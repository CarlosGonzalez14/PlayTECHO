import type { Category, Question, QuestionDifficulty } from './question.types';
import type { HundredTecherosGameEvent } from './game-events.types';

export interface QuestionSummary {
  id: number;
  pregunta: string;
  dificultad: QuestionDifficulty;
  categoria_id: number;
  categoria_nombre: string;
  estado: 'borrador' | 'publicada';
  total_respuestas: number;
  total_puntaje: number;
}

export interface QuestionForExport {
  id: number;
  categoria: string;
  pregunta: string;
  dificultad: QuestionDifficulty;
  respuestas: {
    respuesta: string;
    puntaje: number;
  }[];
}

export interface PlayTechoApi {
  questions: {
    getCategories: () => Promise<Category[]>;
    createCategory: (name: string) => Promise<Category>;
    createQuestion: (question: Question) => Promise<QuestionSummary>;
    deleteQuestion: (questionId: number) => Promise<{ deleted: boolean; id: number }>;
    getQuestionSummaries: () => Promise<QuestionSummary[]>;
    getQuestionsForExport: () => Promise<QuestionForExport[]>;
  };
  windows: {
    openHundredTecherosWindows: () => Promise<{ success: boolean }>;
  };
  game: {
    sendEventToPublicWindow: (
      gameEvent: HundredTecherosGameEvent
    ) => Promise<{ success: boolean }>;

    onEventFromAdmin: (
      callback: (gameEvent: HundredTecherosGameEvent) => void
    ) => () => void;
  };
}

declare global {
  interface Window {
    playtecho: PlayTechoApi;
  }
}

export {};