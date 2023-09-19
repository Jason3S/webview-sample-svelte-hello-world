type DisposableFn = () => void;

export interface Store<T> {
  set(v: T | undefined): void;
  update(u: (v: T | undefined) => T | undefined): void;
  subscribe(s: (v: T | undefined) => any): DisposableFn;
}

export interface ValueStore<T> extends Store<T> {
  readonly value?: T;
}

/**
 * A ClientServerStore is used to avoid feedback loops.
 */
export interface ClientServerStore<T> {
  readonly value?: T;
  readonly client: ValueStore<T>;
  /** Notify the */
  readonly server: ValueStore<T>;
}

export type Subscriber<T> = (v: T | undefined) => any;

class StoreObservable<T> implements Store<T> {
  protected _value: T | undefined;
  private _subscriptions = new Set<Subscriber<T>>();
  private _busy = false;
  constructor(value?: T) {
    this._value = value;
  }

  set(value: T | undefined) {
    // Do not update if the value has not changed.
    if (!isNotEqual(this._value, value)) return;
    this._value = value;
    this.notify();
    return;
  }

  subscribe(s: (v: T | undefined) => any): DisposableFn {
    const subscriptions = this._subscriptions;
    subscriptions.add(s);
    s(this._value);
    return () => subscriptions.delete(s);
  }

  update(u: (v: T | undefined) => T) {
    return this.set(u(this._value));
  }

  private notify() {
    if (this._busy) return;
    try {
      this._busy = true;
      for (const s of this._subscriptions) {
        s(this._value);
      }
    } finally {
      this._busy = false;
    }
  }
}

class ValueStoreObservable<T> extends StoreObservable<T> implements ValueStore<T> {
  constructor(value?: T) {
    super(value);
  }

  get value() {
    return this._value;
  }
}

class ClientServerStoreImpl<T> implements ClientServerStore<T> {
  private _value: T | undefined;
  private _busy = false;
  private subServer = new Set<Subscriber<T>>();
  private subClient = new Set<Subscriber<T>>();

  readonly client: Store<T>;
  readonly server: Store<T>;

  get value() {
    return this._value;
  }

  constructor(value?: T) {
    // We need to notify the sever of any changes made by any client.
    this.client = {
      set: (v: T) => this.setValue(v, true),
      update: (uFn) => this.setValue(uFn(this._value), true),
      subscribe: (s) => this.subscribe(this.subClient, s, true),
    };
    // We do not want to notify the server of changes made by the server.
    this.server = {
      set: (v: T) => this.setValue(v, false),
      update: (uFn) => this.setValue(uFn(this._value), false),
      subscribe: (s) => this.subscribe(this.subServer, s, false),
    };
  }

  private setValue(value: T | undefined, notifyServer: boolean) {
    if (!isNotEqual(this._value, value)) return;

    this._value = value;
    if (notifyServer) this.notify(this.subServer);
    this.notify(this.subClient);
  }

  private notify(subscriptions: Set<Subscriber<T>>) {
    if (this._busy) return;
    try {
      this._busy = true;
      for (const s of subscriptions) {
        s(this._value);
      }
    } finally {
      this._busy = false;
    }
  }

  private subscribe(subscriptions: Set<Subscriber<T>>, subscriber: Subscriber<T>, notify: boolean): DisposableFn {
    subscriptions.add(subscriber);
    notify && subscriber(this._value);
    return () => subscriptions.delete(subscriber);
  }
}

function isNotEqual<T>(a: T, b: T): boolean {
  // eslint-disable-next-line eqeqeq
  return a != a ? b == b : a !== b || (a && typeof a === 'object') || typeof a === 'function';
}

export function writable<T>(v?: T | undefined): ValueStore<T | undefined>;
export function writable<T>(v: T): ValueStore<T> {
  return new ValueStoreObservable(v);
}

export function createClientServerStore<T>(initialValue?: T): ClientServerStore<T> {
  return new ClientServerStoreImpl(initialValue);
}
