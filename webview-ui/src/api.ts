import { createClientSideHelloWorldApi, type ClientSideApi } from '../../common/api.js';
import { getRpcConnection } from './utilities/json-rpc';

function createApi(): ClientSideApi {
  const connection = getRpcConnection();

  const api = createClientSideHelloWorldApi(connection, {
    serverNotifications: {
      showInformationMessage: undefined,
    },
    serverRequests: {
      whatTimeIsIt: undefined,
    },
    clientNotifications: {},
    clientRequests: {},
  });

  connection.listen();

  return api;
}

let _api: ClientSideApi | undefined;

export function getClientApi(): ClientSideApi {
  if (_api) return _api;
  _api = createApi();
  return _api;
}
