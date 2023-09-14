import { type MessageConnection } from 'vscode-jsonrpc/lib/common/connection';
import { createClientApi, createServerApi, type ClientMethods, type RpcAPI, type ServerMethods } from './json-rpc-api';

type Maybe<T> = T | undefined;

export interface HelloWorldAPI extends RpcAPI {
  serverRequests: {
    whatTimeIsIt: Maybe<() => Promise<string>>;
  };
  serverNotifications: {
    showInformationMessage: Maybe<(message: string) => Promise<void>>;
  };
  clientRequests: {};
  clientNotifications: {};
}

export interface ServerSideApi extends ClientMethods<HelloWorldAPI> {}

export interface ClientSideApi extends ServerMethods<HelloWorldAPI> {}

export function createServerSideHelloWorldApi(connection: MessageConnection, api: HelloWorldAPI): ServerSideApi {
  return createServerApi(connection, api);
}

export function createClientSideHelloWorldApi(connection: MessageConnection, api: HelloWorldAPI): ClientSideApi {
  return createClientApi(connection, api);
}
