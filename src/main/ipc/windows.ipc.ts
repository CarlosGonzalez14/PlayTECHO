import { ipcMain } from 'electron';
import { openHundredTecherosWindows } from '../windows/windowManager';

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

export function registerWindowsIpc() {
  registerHandler('windows:openHundredTecherosWindows', () => {
    try {
      openHundredTecherosWindows();

      return {
        success: true,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  });
}