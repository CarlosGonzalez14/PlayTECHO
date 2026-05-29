import { BrowserWindow } from 'electron';
import { join } from 'node:path';
import { is } from '@electron-toolkit/utils';
import icon from '../../../resources/icon.png?asset';
import { loadRendererRoute } from './loadRendererRoute';

export function createAdminWindow() {
  const adminWindow = new BrowserWindow({
    width: 1180,
    height: 760,
    minWidth: 980,
    minHeight: 660,
    show: false,
    autoHideMenuBar: true,
    title: 'PlayTECHO - Panel del operador',
    icon,
    backgroundColor: '#005ca9',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  adminWindow.on('ready-to-show', () => {
    adminWindow.show();
  });

  if (is.dev) {
    adminWindow.webContents.openDevTools({ mode: 'detach' });
  }

  loadRendererRoute(adminWindow, 'admin-game');

  return adminWindow;
}