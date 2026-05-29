export type QuestionDifficulty = 'facil' | 'media' | 'dificil';

export type QuestionStatus = 'borrador' | 'publicada';

export interface Category {
  id: number;
  nombre: string;
}

export interface Answer {
  id?: number;
  respuesta: string;
  puntaje: number;
  pregunta_id?: number;
}

export interface Question {
  id?: number;
  pregunta: string;
  dificultad: QuestionDifficulty;
  categoria_id: number;
  estado: QuestionStatus;
  respuestas: Answer[];
}