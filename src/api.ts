import { NotificationType, type MessageConnection } from 'vscode-jsonrpc/node';
import { window, Disposable } from 'vscode';

interface Api extends Disposable {}

export function createApi(connection: MessageConnection): Api {
  const tShowInformationMessage = new NotificationType<string>('showInformationMessage');
  const _disposables: Disposable[] = [];

  _disposables.push(
    connection.onNotification(tShowInformationMessage, (message) => window.showInformationMessage('Show Message: ' + message)),
  );

  return {
    dispose() {
      while (_disposables.length) {
        const disposable = _disposables.pop();
        if (disposable) {
          disposable.dispose();
        }
      }
    },
  };
}
