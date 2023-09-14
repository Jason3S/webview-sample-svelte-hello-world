import { NotificationType, type MessageConnection, RequestType } from 'vscode-jsonrpc/node';
import { window, Disposable } from 'vscode';
import { RpcAPI, createServerApi } from './utilities/json-rpc-api';

interface Api extends Disposable {}

export interface ServerAPI extends RpcAPI {
  serverRequests: {};
  serverNotifications: {
    showInformationMessage(message: string): Promise<void>;
  };
  clientRequests: {};
  clientNotifications: {};
}

export function createApi(connection: MessageConnection): Api {
  const api: ServerAPI = {
    serverRequests: {},
    serverNotifications: {
      async showInformationMessage(message) {
        await window.showInformationMessage('Show Message: ' + message);
      },
    },
    clientRequests: {},
    clientNotifications: {},
  };

  return createServerApi(connection, api);
}
