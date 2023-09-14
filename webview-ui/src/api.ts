import { NotificationType, getRpcConnection } from './utilities/json-rpc';

export interface ClientApi {
  showInformationMessage(message: string): Promise<void>;
}

function createApi(): ClientApi {
  const connection = getRpcConnection();

  const tShowInformationMessage = new NotificationType<string>('showInformationMessage');

  async function showInformationMessage(message: string): Promise<void> {
    await connection.sendNotification(tShowInformationMessage, message);
  }

  connection.listen();

  return {
    showInformationMessage,
  };
}

let _api: ClientApi | undefined;

export function getClientApi(): ClientApi {
  if (_api) return _api;
  _api = createApi();
  return _api;
}
