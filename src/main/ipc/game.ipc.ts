import { ipcMain } from 'electron';
import { getPublicGameWindow } from '../windows/windowManager';

function registerHandler(channel: string, listener: Parameters<typeof ipcMain.handle>[1]) {
  ipcMain.removeHandler(channel);
  ipcMain.handle(channel, listener);
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Ocurrió un error inesperado.';
}

export function registerGameIpc() {
  registerHandler('game:sendEventToPublicWindow', (_event, gameEvent: unknown) => {
    try {
      const publicWindow = getPublicGameWindow();

      if (!publicWindow) {
        throw new Error('La ventana pública no está abierta.');
      }

      publicWindow.webContents.send('game:eventFromAdmin', gameEvent);

      return {
        success: true,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  });
}