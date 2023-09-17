import { createClientSideHelloWorldApi, type ClientSideApi } from '../../common/api.js';
import type { Todos } from '../../common/apiModels.js';
import { getRpcConnection } from './utilities/json-rpc';
import type { Disposable } from './utilities/vscode.js';

export interface API extends ClientSideApi {}

let _api: API | undefined;

export function getClientApi(): API {
  if (_api) return _api;
  _api = createApi();
  return _api;
}

function createApi(): API {
  const connection = getRpcConnection();
  const clientSide = createClientSideHelloWorldApi(connection, {
    serverNotifications: {
      showInformationMessage: true,
    },
    serverRequests: {
      whatTimeIsIt: true,
      updateTodos: true,
      getTodos: true,
      resetTodos: true,
    },
    clientNotifications: {
      onChangeTodos: true,
    },
    clientRequests: {},
  });

  connection.listen();

  const api: API = clientSide;

  return api;
}
