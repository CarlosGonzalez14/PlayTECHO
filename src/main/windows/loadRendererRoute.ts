import { BrowserWindow } from 'electron';
import { join } from 'node:path';
import { is } from '@electron-toolkit/utils';

export type RendererRoute = 'launcher' | 'public-game' | 'admin-game';

export function loadRendererRoute(window: BrowserWindow, route: RendererRoute) {
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    window.loadURL(`${process.env['ELECTRON_RENDERER_URL']}#/${route}`);
    return;
  }

  window.loadFile(join(__dirname, '../renderer/index.html'), {
    hash: `/${route}`,
  });
}