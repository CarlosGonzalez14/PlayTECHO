import { BrowserWindow } from 'electron';
import { join } from 'node:path';
import icon from '../../../resources/icon.png?asset';
import { loadRendererRoute } from './loadRendererRoute';

export function createPublicGameWindow() {
  const publicWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 960,
    minHeight: 540,
    show: false,
    autoHideMenuBar: true,
    title: 'PlayTECHO - Ventana pública',
    icon,
    backgroundColor: '#0092DD',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  publicWindow.on('ready-to-show', () => {
    publicWindow.show();
  });

  loadRendererRoute(publicWindow, 'public-game');

  return publicWindow;
}