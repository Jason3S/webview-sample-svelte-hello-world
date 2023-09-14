import { type MessageConnection, NotificationType, RequestType, type Disposable } from 'vscode-jsonrpc/lib/common/api';

export type { Disposable } from 'vscode-jsonrpc/lib/common/api';

export const apiPrefix = {
  serverRequest: 'sr_',
  serverNotification: 'sn_',
  clientRequest: 'cr_',
  clientNotification: 'cn_',
} as const;

export interface Requests {
  [name: string]: ((p: any) => Promise<any>) | undefined;
}

export interface Notifications {
  [name: string]: ((p: any) => Promise<void>) | undefined;
}

export interface ServerSideAPI {
  /** Requests sent to the Server */
  serverRequests: Requests;
  /** Notifications sent to the Server */
  serverNotifications: Notifications;
}

export interface ClientSideAPI {
  /** Requests sent to the Client */
  clientRequests: Requests;
  /** Notifications sent to the Client */
  clientNotifications: Notifications;
}

export interface RpcAPI extends ClientSideAPI, ServerSideAPI {}

type StrictRequired<T> = {
  [P in keyof T]-?: Exclude<T[P], undefined>;
};

type ClientRequests<A extends ClientSideAPI> = A['clientRequests'];
type ClientNotifications<A extends ClientSideAPI> = A['clientNotifications'];
type ServerRequests<A extends ServerSideAPI> = A['serverRequests'];
type ServerNotifications<A extends ServerSideAPI> = A['serverNotifications'];

export type ClientMethods<T extends ClientSideAPI> = {
  clientRequest: StrictRequired<ClientRequests<T>>;
  clientNotification: StrictRequired<ClientNotifications<T>>;
} & Disposable;

export type ServerMethods<T extends ServerSideAPI> = {
  serverRequest: StrictRequired<ServerRequests<T>>;
  serverNotification: StrictRequired<ServerNotifications<T>>;
} & Disposable;

/**
 * Create an API Interface that can be used on the Server
 * @param connection
 * @param api - the api structure. Provide functions to handle server requests.
 * @returns
 */
export function createServerApi<A extends RpcAPI>(connection: MessageConnection, api: A): ClientMethods<A> {
  const _disposables: Disposable[] = [];

  bindRequests(connection, apiPrefix.serverRequest, api.serverRequests, _disposables);
  bindNotifications(connection, apiPrefix.serverNotification, api.serverNotifications, _disposables);

  type CR = ClientRequests<A>;
  type CN = ClientNotifications<A>;

  const clientRequest = mapRequestsToFn<CR>(connection, apiPrefix.clientRequest, api.clientRequests);
  const clientNotification = mapNotificationsToFn<CN>(connection, apiPrefix.clientNotification, api.clientNotifications);

  function dispose() {
    while (_disposables.length) {
      const disposable = _disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }

  return {
    clientRequest,
    clientNotification,
    dispose,
  };
}

/**
 * Create an API Interface that can be used on the Client
 * @param connection
 * @param api - the api structure. Provide functions to handle client requests.
 * @returns
 */
export function createClientApi<A extends RpcAPI>(connection: MessageConnection, api: A): ServerMethods<A> {
  const _disposables: Disposable[] = [];

  bindRequests(connection, apiPrefix.clientRequest, api.clientRequests, _disposables);
  bindNotifications(connection, apiPrefix.clientNotification, api.clientNotifications, _disposables);

  type SR = ServerRequests<A>;
  type SN = ServerNotifications<A>;

  const serverRequest = mapRequestsToFn<SR>(connection, apiPrefix.serverRequest, api.serverRequests);
  const serverNotification = mapNotificationsToFn<SN>(connection, apiPrefix.serverNotification, api.serverNotifications);

  function dispose() {
    while (_disposables.length) {
      const disposable = _disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }

  return {
    serverRequest,
    serverNotification,
    dispose,
  };
}

function bindRequests(connection: MessageConnection, prefix: string, requests: Requests, disposables: Disposable[]) {
  for (const [name, fn] of Object.entries(requests)) {
    console.log('bindRequest %o', { name, fn: typeof fn });
    if (!fn) continue;
    const tReq = new RequestType(prefix + name);

    disposables.push(connection.onRequest(tReq, fn));
  }
}

function bindNotifications(connection: MessageConnection, prefix: string, requests: Notifications, disposables: Disposable[]) {
  for (const [name, fn] of Object.entries(requests)) {
    console.log('bindNotifications %o', { name, fn: typeof fn });
    if (!fn) continue;
    const tNote = new NotificationType(prefix + name);

    disposables.push(connection.onNotification(tNote, fn));
  }
}

function mapRequestsToFn<T extends Requests>(connection: MessageConnection, prefix: string, requests: T): StrictRequired<T> {
  return Object.fromEntries(
    Object.entries(requests).map(([name]) => {
      const tReq = new RequestType(prefix + name);
      const fn = (...params: any) => connection.sendRequest(tReq, params);
      return [name, fn];
    }),
  ) as StrictRequired<T>;
}

function mapNotificationsToFn<T extends Notifications>(connection: MessageConnection, prefix: string, notifications: T): StrictRequired<T> {
  return Object.fromEntries(
    Object.entries(notifications).map(([name]) => {
      const tNote = new NotificationType(prefix + name);
      const fn = (...params: any) => connection.sendNotification(tNote, params);
      return [name, fn];
    }),
  ) as StrictRequired<T>;
}
