import { window } from 'vscode';
import { type MessageConnection } from 'vscode-jsonrpc/node';
import { ServerSideApi, ServerSideApiDef, UpdateResult, createServerSideHelloWorldApi } from '../common/api';
import { AppState } from '../common/apiModels';
import { createDisposeMethodFromList, injectDisposable, type DisposableLike } from '../common/disposable';
import { log } from './logger';
import { sampleList, store } from './store';
import { setLogLevel } from '../common/logger';

export function createApi(connection: MessageConnection): ServerSideApi {
  const disposables: DisposableLike[] = [];
  const dispose = createDisposeMethodFromList(disposables);

  const api: ServerSideApiDef = {
    serverRequests: {
      whatTimeIsIt,
      updateAppState,
      getAppState,
      resetTodos,
    },
    serverNotifications: {
      async showInformationMessage(message) {
        await window.showInformationMessage('Show Message: ' + message);
      },
    },
    clientRequests: {},
    clientNotifications: { onChangeAppState: true },
  };

  const serverSideApi = createServerSideHelloWorldApi(connection, api);
  disposables.push(serverSideApi);
  disposables.push(
    store.state.subscribe((v) => {
      setLogLevel(v.logLevel);
      serverSideApi.clientNotification.onChangeAppState(v);
    }),
  );

  return injectDisposable({ ...serverSideApi }, dispose);

  /**
   * Get the time
   */
  async function whatTimeIsIt() {
    return new Date().toString();
  }

  /**
   * Update the todo list
   */
  async function updateAppState(todos: AppState): Promise<UpdateResult<AppState>> {
    let success = false;

    function update(current: AppState): AppState {
      if (current.seq !== todos.seq) return current;
      const next = { ...todos };
      ++next.seq;
      success = true;
      return next;
    }

    log('Update Todos: %o', todos);
    store.state.update(update);
    return { success, value: store.state.value };
  }

  /**
   * Fetch the todo list
   */
  async function getAppState() {
    const v = store.state.value;
    log('getTodos, found: %o', v);
    return v;
  }

  /**
   * Reset the Todo list
   */
  async function resetTodos() {
    const current = store.state.value;
    updateAppState({ ...current, todos: sampleList.map((todo) => ({ ...todo })) });
  }
}
