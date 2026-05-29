import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

const playtechoApi = {
  questions: {
    getCategories: () => ipcRenderer.invoke('questions:getCategories'),
    createCategory: (name: string) => ipcRenderer.invoke('questions:createCategory', name),
    createQuestion: (question: unknown) =>
      ipcRenderer.invoke('questions:createQuestion', question),
    deleteQuestion: (questionId: number) =>
      ipcRenderer.invoke('questions:deleteQuestion', questionId),
    getQuestionSummaries: () => ipcRenderer.invoke('questions:getQuestionSummaries'),
    getQuestionsForExport: () => ipcRenderer.invoke('questions:getQuestionsForExport'),
  },
  windows: {
    openHundredTecherosWindows: () =>
      ipcRenderer.invoke('windows:openHundredTecherosWindows'),
  },
  game: {
    sendEventToPublicWindow: (gameEvent: unknown) =>
      ipcRenderer.invoke('game:sendEventToPublicWindow', gameEvent),

    onEventFromAdmin: (callback: (gameEvent: unknown) => void) => {
      const listener = (_event: Electron.IpcRendererEvent, gameEvent: unknown) => {
        callback(gameEvent);
      };

      ipcRenderer.on('game:eventFromAdmin', listener);

      return () => {
        ipcRenderer.removeListener('game:eventFromAdmin', listener);
      };
    },
  },
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('playtecho', playtechoApi);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore fallback para contextIsolation desactivado
  window.electron = electronAPI;
  // @ts-ignore fallback para contextIsolation desactivado
  window.playtecho = playtechoApi;
}