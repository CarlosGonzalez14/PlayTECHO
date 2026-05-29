import { app, BrowserWindow, shell } from 'electron';
import { electronApp, optimizer } from '@electron-toolkit/utils';
import { registerQuestionsIpc } from './ipc/questions.ipc';
import { registerWindowsIpc } from './ipc/windows.ipc';
import { openLauncherWindow } from './windows/windowManager';

app.whenReady().then(() => {
  registerQuestionsIpc();
  registerWindowsIpc();

  electronApp.setAppUserModelId('com.playtecho.app');

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);

    window.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url);
      return { action: 'deny' };
    });
  });

  openLauncherWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      openLauncherWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});