import type { BrowserWindow } from 'electron';
import { createAdminWindow } from './createAdminWindow';
import { createLauncherWindow } from './createLauncherWindow';
import { createPublicGameWindow } from './createPublicGameWindow';

let launcherWindow: BrowserWindow | null = null;
let publicGameWindow: BrowserWindow | null = null;
let adminWindow: BrowserWindow | null = null;

export function openLauncherWindow() {
  if (launcherWindow && !launcherWindow.isDestroyed()) {
    launcherWindow.focus();
    return launcherWindow;
  }

  launcherWindow = createLauncherWindow();

  launcherWindow.on('closed', () => {
    launcherWindow = null;
  });

  return launcherWindow;
}

export function openHundredTecherosWindows() {
  if (!publicGameWindow || publicGameWindow.isDestroyed()) {
    publicGameWindow = createPublicGameWindow();

    publicGameWindow.on('closed', () => {
      publicGameWindow = null;
    });
  } else {
    publicGameWindow.focus();
  }

  if (!adminWindow || adminWindow.isDestroyed()) {
    adminWindow = createAdminWindow();

    adminWindow.on('closed', () => {
      adminWindow = null;
    });
  } else {
    adminWindow.focus();
  }

  if (launcherWindow && !launcherWindow.isDestroyed()) {
    launcherWindow.close();
    launcherWindow = null;
  }

  return {
    publicGameWindow,
    adminWindow,
  };
}

export function getPublicGameWindow() {
  return publicGameWindow && !publicGameWindow.isDestroyed() ? publicGameWindow : null;
}

export function getAdminWindow() {
  return adminWindow && !adminWindow.isDestroyed() ? adminWindow : null;
}