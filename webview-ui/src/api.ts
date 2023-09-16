import { createClientSideHelloWorldApi, type ClientSideApi } from '../../common/api.js';
import type { Todos } from '../../common/apiModels.js';
import { getRpcConnection } from './utilities/json-rpc';
import type { Disposable } from './utilities/vscode.js';

export interface API extends ClientSideApi {
  onChangeTodos(handler: (todo: Todos) => void): Disposable;
}

let _api: API | undefined;

export function getClientApi(): API {
  if (_api) return _api;
  _api = createApi();
  return _api;
}

function createApi(): API {
  const connection = getRpcConnection();

  const manageOnChangeTools = createEventManager<Todos>('onChangeTodos');

  const clientSide = createClientSideHelloWorldApi(connection, {
    serverNotifications: {
      showInformationMessage: undefined,
    },
    serverRequests: {
      whatTimeIsIt: undefined,
      updateTodos: undefined,
      getTodos: undefined,
      resetTodos: undefined,
    },
    clientNotifications: {
      onChangeTodos: manageOnChangeTools.listener,
    },
    clientRequests: {},
  });

  connection.listen();

  const api: API = {
    ...clientSide,
    onChangeTodos: manageOnChangeTools.subscribe,
  };

  return api;
}

function createEventManager<T>(name: string) {
  type Subscriber = (p: T) => void;
  const subscribers = new Set<Subscriber>();
  async function listener(p: T) {
    for (const s of subscribers) {
      console.log(`notify ${name} %o`, s);
      s(p);
    }
  }
  function subscribe(s: Subscriber): Disposable {
    console.log(`subscribe to ${name} %o`, s);
    subscribers.add(s);
    return {
      dispose() {
        subscribers.delete(s);
      },
    };
  }

  return { listener, subscribe };
}
