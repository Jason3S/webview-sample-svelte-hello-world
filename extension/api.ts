import { window } from 'vscode';
import { type MessageConnection } from 'vscode-jsonrpc/node';
import { HelloWorldAPI, ServerSideApi, createServerSideHelloWorldApi } from '../common/api';

export function createApi(connection: MessageConnection): ServerSideApi {
  const api: HelloWorldAPI = {
    serverRequests: {
      async whatTimeIsIt() {
        return new Date().toString();
      },
    },
    serverNotifications: {
      async showInformationMessage(message) {
        await window.showInformationMessage('Show Message: ' + message);
      },
    },
    clientRequests: {},
    clientNotifications: {},
  };

  return createServerSideHelloWorldApi(connection, api);
}
