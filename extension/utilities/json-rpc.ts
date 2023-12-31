import { Webview } from 'vscode';
import {
  AbstractMessageReader,
  AbstractMessageWriter,
  MessageConnection,
  createMessageConnection,
  type DataCallback,
  type Disposable,
  type Message,
  type MessageWriter,
} from 'vscode-jsonrpc/node';

export class WebViewMessageReader extends AbstractMessageReader {
  constructor(readonly webview: Webview) {
    super();
  }

  listen(callback: DataCallback): Disposable {
    console.log('start listening');
    return this.webview.onDidReceiveMessage((data) => {
      console.log('listen: %o', data);
      callback(data);
    });
  }
}

export class WebViewMessageWriter extends AbstractMessageWriter implements MessageWriter {
  private errorCount: number;

  constructor(readonly webview: Webview) {
    super();
    this.errorCount = 0;
  }

  public async write(msg: Message): Promise<void> {
    try {
      await this.webview.postMessage(msg);
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

export function createConnectionToWebview(webview: Webview): MessageConnection {
  return createMessageConnection(new WebViewMessageReader(webview), new WebViewMessageWriter(webview));
}

/*************************************** */
