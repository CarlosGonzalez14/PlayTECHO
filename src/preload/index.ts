import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

const playtechoApi = {
  questions: {
    getCategories: () => ipcRenderer.invoke('questions:getCategories'),
    createCategory: (name: string) => ipcRenderer.invoke('questions:createCategory', name),
    createQuestion: (question: unknown) =>
      ipcRenderer.invoke('questions:createQuestion', question),
    getQuestionSummaries: () => ipcRenderer.invoke('questions:getQuestionSummaries'),
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