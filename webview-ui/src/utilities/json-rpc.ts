import {
  AbstractMessageReader,
  AbstractMessageWriter,
  createMessageConnection,
  type DataCallback,
  type Disposable,
  type Message,
  type MessageConnection,
  type MessageWriter,
} from 'vscode-jsonrpc/browser';
import { vscode, type VSCodeMessageAPI } from './vscode';
import { log } from '../../../common/logger';

export { NotificationType } from 'vscode-jsonrpc/lib/common/api';

export class WebViewMessageReader extends AbstractMessageReader {
  constructor(readonly api: VSCodeMessageAPI) {
    super();
  }

  listen(callback: DataCallback): Disposable {
    return this.api.onDidReceiveMessage((data) => {
      if (!data || !data.data) return;
      log('client listen: %o', data.data);
      callback(data.data);
    });
  }
}

export class WebViewMessageWriter extends AbstractMessageWriter implements MessageWriter {
  private errorCount: number;

  constructor(readonly api: VSCodeMessageAPI) {
    super();
    this.errorCount = 0;
  }

  public async write(msg: Message): Promise<void> {
    try {
      await this.api.postMessage(msg);
      this.errorCount = 0;
    } catch (error) {
      this.handleError(error, msg);
      return Promise.reject(error);
    }
  }

  private handleError(error: any, msg: Message): void {
    this.errorCount++;
    this.fireError(error, msg, this.errorCount);
  }

  public end(): void {}
}

function createConnectionToVSCode(api: VSCodeMessageAPI): MessageConnection {
  return createMessageConnection(new WebViewMessageReader(api), new WebViewMessageWriter(api));
}

let connection: MessageConnection | undefined = undefined;

export function getRpcConnection(): MessageConnection {
  if (connection) return connection;
  connection = createConnectionToVSCode(vscode);
  return connection;
}
