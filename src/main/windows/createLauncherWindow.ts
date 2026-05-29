import { BrowserWindow } from 'electron';
import { join } from 'node:path';
import { is } from '@electron-toolkit/utils';
import icon from '../../../resources/icon.png?asset';
import { loadRendererRoute } from './loadRendererRoute';

export function createLauncherWindow() {
  const launcherWindow = new BrowserWindow({
    width: 1180,
    height: 760,
    minWidth: 960,
    minHeight: 640,
    show: false,
    autoHideMenuBar: true,
    title: 'PlayTECHO',
    icon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  launcherWindow.on('ready-to-show', () => {
    launcherWindow.show();
  });

  launcherWindow.webContents.setWindowOpenHandler((details) => {
    launcherWindow.webContents.send('browser-window-open-url', details.url);
    return { action: 'deny' };
  });

  if (is.dev) {
    launcherWindow.webContents.openDevTools({ mode: 'detach' });
  }

  loadRendererRoute(launcherWindow, 'launcher');

  return launcherWindow;
}