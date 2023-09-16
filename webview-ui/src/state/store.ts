type DisposableFn = () => void;

export interface Store<T> {
  value: T;
  set(v: T): void;
  update(u: (v: T) => T): void;
  subscribe(s: (v: T) => any): DisposableFn;
}
class Observable<T> implements Store<T> {
  private _value: T;
  private _subscriptions = new Set<(v: T) => any>();
  private _busy = false;
  private _sig = '';
  constructor(value: T) {
    this._value = value;
    this._sig = this.calcSig(value);
  }

  get value() {
    return this._value;
  }

  set value(v: T) {
    this.set(v);
  }

  set(value: T) {
    // Do not update if the value has not changed.
    const sig = this.calcSig(value);
    if (sig === this._sig) return;
    this._value = value;
    this._sig = sig;
    this.notify();
    return;
  }

  subscribe(s: (v: T) => any): DisposableFn {
    const subscriptions = this._subscriptions;
    subscriptions.add(s);
    return () => subscriptions.delete(s);
  }

  update(u: (v: T) => T) {
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

  private calcSig(v: T): string {
    return v === undefined ? 'undefined' : JSON.stringify(v);
  }
}

export function writable<T>(v?: T | undefined): Store<T | undefined>;
export function writable<T>(v: T): Store<T> {
  return new Observable(v);
}
