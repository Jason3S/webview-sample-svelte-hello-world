import { window } from 'vscode';
import { type MessageConnection } from 'vscode-jsonrpc/node';
import { ServerSideApi, ServerSideApiDef, UpdateResult, createServerSideHelloWorldApi } from '../common/api';
import { Todos } from '../common/apiModels';
import { createDisposeMethodFromList, type Disposable } from '../common/disposable';
import { log } from './logger';
import { sampleList, store } from './store';
import { getLogLevel, setLogLevel } from '../common/logger';

export function createApi(connection: MessageConnection): ServerSideApi {
  const disposables: Disposable[] = [];
  const dispose = createDisposeMethodFromList(disposables);

  const api: ServerSideApiDef = {
    serverRequests: {
      whatTimeIsIt,
      updateTodos,
      getTodos,
      resetTodos,
      getLogLevel: async () => getLogLevel(),
      setLogLevel: async (level) => (typeof level === 'number' && setLogLevel(level), getLogLevel()),
    },
    serverNotifications: {
      async showInformationMessage(message) {
        await window.showInformationMessage('Show Message: ' + message);
      },
    },
    clientRequests: {},
    clientNotifications: { onChangeTodos: true },
  };

  const serverSideApi = createServerSideHelloWorldApi(connection, api);
  disposables.push(serverSideApi);

  store.todos.subscribe((v) => serverSideApi.clientNotification.onChangeTodos(v));

  return { ...serverSideApi, dispose };

  /**
   * Get the time
   */
  async function whatTimeIsIt() {
    return new Date().toString();
  }

  /**
   * Update the todo list
   */
  async function updateTodos(todos: Todos): Promise<UpdateResult<Todos>> {
    let success = false;

    function update(current: Todos): Todos {
      if (current.seq !== todos.seq) return current;
      const next = { ...todos };
      ++next.seq;
      success = true;
      return next;
    }

    log('Update Todos: %o', todos);
    store.todos.update(update);
    return { success, value: store.todos.value };
  }

  /**
   * Fetch the todo list
   */
  async function getTodos() {
    const v = store.todos.value;
    log('getTodos, found: %o', v);
    return v;
  }

  /**
   * Reset the Todo list
   */
  async function resetTodos() {
    const current = store.todos.value;
    updateTodos({ ...current, todos: sampleList.map((todo) => ({ ...todo })) });
  }
}
