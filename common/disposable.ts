import type { Disposable } from 'vscode-jsonrpc/lib/common/api';

export type { Disposable } from 'vscode-jsonrpc/lib/common/api';

export function createDisposable(disposables: Disposable[]) {
  return { dispose: createDispose(disposables) };
}

export function createDispose(disposables: Disposable[]) {
  function dispose() {
    while (disposables.length) {
      disposables.pop()?.dispose();
    }
  }
  return dispose;
}
