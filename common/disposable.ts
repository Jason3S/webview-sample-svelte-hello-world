// Poly fill

// @ts-ignore
Symbol.dispose ??= Symbol('Symbol.dispose');
// Symbol.asyncDispose ??= Symbol('Symbol.asyncDispose');

export interface Disposable {
  /**
   * Dispose this object.
   */
  dispose(): void;
  [Symbol.dispose](): void;
}

export type DisposableLike = Disposable | Omit<Disposable, 'dispose'> | Omit<Disposable, typeof Symbol.dispose>;

// export interface AsyncDisposable {
//   asyncDispose(): void;
//   [Symbol.asyncDispose](): PromiseLike<void>;
// }

export function createDisposable<T extends {}>(fn: () => void, thisArg?: T): Disposable {
  // We want to prevent double disposal calls.
  // This can happen if there are multiple systems calling dispose.
  let isDisposed = false;

  function dispose() {
    if (isDisposed) return;
    isDisposed = true;
    thisArg ? fn.call(thisArg) : fn();
  }

  return {
    dispose,
    [Symbol.dispose]: dispose,
  };
}

/**
 * Make and object Disposable by adding disposable properties.
 * @param obj - Object to modify
 * @param dispose - the dispose function.
 * @returns the same object.
 */
export function injectDisposable<T extends {}>(obj: T, dispose: () => void): T & Disposable {
  return Object.assign(obj, createDisposable(dispose, obj));
}

export function createDisposableFromList(disposables: DisposableLike[]) {
  return createDisposable(createDisposeMethodFromList(disposables));
}

export function createDisposeMethodFromList(disposables: DisposableLike[]): () => void {
  function dispose() {
    let error: any | undefined = undefined;

    // Note disposables are disposed in reverse order by default.
    while (disposables.length) {
      try {
        const disposable = disposables.pop() as Partial<Disposable>;
        if (!disposable) continue;
        if (disposable[Symbol.dispose]) {
          disposable[Symbol.dispose]?.call(disposable);
          continue;
        }
        disposable.dispose?.call(disposable);
      } catch (e) {
        error ??= e;
      }
    }

    if (error) throw error;
  }
  return dispose;
}
