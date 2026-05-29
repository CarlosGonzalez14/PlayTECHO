import type { Category, Question, QuestionDifficulty } from './question.types';

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

export interface PlayTechoApi {
  questions: {
    getCategories: () => Promise<Category[]>;
    createCategory: (name: string) => Promise<Category>;
    createQuestion: (question: Question) => Promise<QuestionSummary>;
    getQuestionSummaries: () => Promise<QuestionSummary[]>;
  };
}

declare global {
  interface Window {
    playtecho: PlayTechoApi;
  }
}

export {};