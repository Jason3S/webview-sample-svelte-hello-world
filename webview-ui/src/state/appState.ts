import type { Todos } from '../../../common/apiModels';
import { log } from '../../../common/logger';
import { getClientApi } from '../api';
import { createClientServerStore } from './store';

const csTodos = createClientServerStore<Todos>();

export const todos = csTodos.client;

const api = getClientApi();

// Watch for changes to be send to the server
csTodos.server.subscribe(async (v) => {
  if (!v) return;
  const result = await api.serverRequest.updateTodos(v);
  csTodos.server.set(result.value);
});

api.clientNotification.onChangeTodos.subscribe((updated) => {
  csTodos.server.set(updated);
});

async function initTodos() {
  const todos = await api.serverRequest.getTodos();
  log('initTodos %o', todos);
  if (todos) {
    csTodos.server.set(todos);
  }
}

initTodos();
