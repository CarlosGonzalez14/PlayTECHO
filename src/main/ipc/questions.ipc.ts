import { ipcMain } from 'electron';
import { createCategory, getAllCategories } from '../db/repositories/categories.repository';
import {
  createQuestion,
  deleteQuestion,
  getQuestionSummaries,
  getQuestionsForExport,
  type CreateQuestionInput,
} from '../db/repositories/questions.repository';

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

export function registerQuestionsIpc() {
  registerHandler('questions:getCategories', () => {
    try {
      return getAllCategories();
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  });

  registerHandler('questions:createCategory', (_event, name: string) => {
    try {
      return createCategory(name);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  });

  registerHandler('questions:createQuestion', (_event, question: CreateQuestionInput) => {
    try {
      return createQuestion(question);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  });

  registerHandler('questions:deleteQuestion', (_event, questionId: number) => {
    try {
      return deleteQuestion(questionId);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  });

  registerHandler('questions:getQuestionSummaries', () => {
    try {
      return getQuestionSummaries();
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  });

  registerHandler('questions:getQuestionsForExport', () => {
    try {
      return getQuestionsForExport();
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  });
}