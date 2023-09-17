import type { Todos } from '../../../common/apiModels';
import { log } from '../../../common/logger';
import { getClientApi } from '../api';
import { writable } from './store';

interface MetaTodos {
  from: 'server' | 'client';
  todos: Todos;
}

export const todos = writable<Todos | undefined>();
const metaTodos = writable<MetaTodos | undefined>();

const api = getClientApi();

metaTodos.subscribe(async (m) => {
  if (m?.from !== 'client') return;
  const r = await api.serverRequest.updateTodos(m.todos);
  updateTodos(r.value, true);
});

metaTodos.subscribe((m) => {
  if (m?.from !== 'server') return;
  todos.update((curr) => {
    return !curr || m.todos.seq > curr.seq ? m.todos : curr;
  });
});

todos.subscribe((todo) => {
  todo && updateTodos(todo, false);
});

api.clientNotification.onChangeTodos.subscribe((updated) => {
  updateTodos(updated, true);
});

async function initTodos() {
  const todos = await api.serverRequest.getTodos();
  log('initTodos %o', todos);
  if (todos) {
    updateTodos(todos, true);
  }
}

function updateTodos(todos: Todos, fromServer = false) {
  log('updateTodos %o', todos);
  const from: 'server' | 'client' = fromServer ? 'server' : 'client';
  const next = { from, todos };
  metaTodos.update((curr) => {
    log('onChangeTodos %o -> %o', curr, next);
    if (!curr || next.todos.seq > curr.todos.seq) return next;
    if (next.from === 'client' && next.todos.seq === curr.todos.seq) return next;
    return curr;
  });
}

initTodos();
