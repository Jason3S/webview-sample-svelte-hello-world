import { type MessageConnection } from 'vscode-jsonrpc/lib/common/connection';
import type { Todos } from './apiModels';
import {
  createClientApi,
  createServerApi,
  type ApplyNotificationAPI,
  type ApplyRequestAPI,
  type ClientMethods,
  type RpcAPI,
  type ServerMethods,
} from './json-rpc-api';

export interface UpdateResult<T> {
  success: boolean;
  value: T;
}

export interface ServerRequestsAPI {
  whatTimeIsIt(): Promise<string>;
  getTodos(): Promise<Todos>;
  updateTodos(todos: Todos): Promise<UpdateResult<Todos>>;
  resetTodos(): Promise<void>;
}

export interface ServerNotificationsAPI {
  showInformationMessage(message: string): Promise<void>;
}

export interface ClientRequestsAPI {}

export interface ClientNotificationsAPI {
  onChangeTodos: (todos: Todos) => Promise<void>;
}

export interface HelloWorldAPI extends RpcAPI {
  serverRequests: ApplyRequestAPI<ServerRequestsAPI>;
  serverNotifications: ApplyNotificationAPI<ServerNotificationsAPI>;
  clientRequests: ApplyRequestAPI<ClientRequestsAPI>;
  clientNotifications: ApplyNotificationAPI<ClientNotificationsAPI>;
}

export interface ServerSideApi extends ClientMethods<HelloWorldAPI> {}

export interface ClientSideApi extends ServerMethods<HelloWorldAPI> {}

export function createServerSideHelloWorldApi(connection: MessageConnection, api: HelloWorldAPI): ServerSideApi {
  return createServerApi(connection, api);
}

export function createClientSideHelloWorldApi(connection: MessageConnection, api: HelloWorldAPI): ClientSideApi {
  return createClientApi(connection, api);
}
