import { type MessageConnection } from 'vscode-jsonrpc/lib/common/connection';
import type { AppState } from './apiModels';
import {
  createClientApi,
  createServerApi,
  type ApplyNotificationAPI,
  type ApplyRequestAPI,
  type ClientAPIDef,
  type ServerSideMethods,
  type RpcAPI,
  type ServerAPIDef,
  type ClientSideMethods,
} from './json-rpc-api';

export interface UpdateResult<T> {
  success: boolean;
  value: T;
}

export interface ServerRequestsAPI {
  whatTimeIsIt(): Promise<string>;
  getAppState(): Promise<AppState>;
  updateAppState(state: AppState): Promise<UpdateResult<AppState>>;
  resetTodos(): Promise<void>;
}

export interface ServerNotificationsAPI {
  showInformationMessage(message: string): Promise<void>;
}

export interface ClientRequestsAPI {}

export interface ClientNotificationsAPI {
  onChangeAppState: (state: AppState) => void;
}

export interface HelloWorldAPI extends RpcAPI {
  serverRequests: ApplyRequestAPI<ServerRequestsAPI>;
  serverNotifications: ApplyNotificationAPI<ServerNotificationsAPI>;
  clientRequests: ApplyRequestAPI<ClientRequestsAPI>;
  clientNotifications: ApplyNotificationAPI<ClientNotificationsAPI>;
}

export interface ServerSideApi extends ServerSideMethods<HelloWorldAPI> {}
export interface ClientSideApi extends ClientSideMethods<HelloWorldAPI> {}

export type ServerSideApiDef = ServerAPIDef<HelloWorldAPI>;
export type ClientSideApiDef = ClientAPIDef<HelloWorldAPI>;

export function createServerSideHelloWorldApi(connection: MessageConnection, api: ServerAPIDef<HelloWorldAPI>): ServerSideApi {
  return createServerApi(connection, api);
}

export function createClientSideHelloWorldApi(connection: MessageConnection, api: ClientAPIDef<HelloWorldAPI>): ClientSideApi {
  return createClientApi(connection, api);
}
