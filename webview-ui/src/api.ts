import { createClientSideHelloWorldApi, type ClientSideApi } from '../../common/api.js';
import { getRpcConnection } from './utilities/json-rpc';

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
      updateAppState: true,
      getAppState: true,
      resetTodos: true,
    },
    clientNotifications: {
      onChangeAppState: true,
    },
    clientRequests: {},
  });

  connection.listen();

  const api: API = clientSide;

  return api;
}
