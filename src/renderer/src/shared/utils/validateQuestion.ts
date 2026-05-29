import type { Answer, QuestionDifficulty } from '../types/question.types';

interface ValidateQuestionInput {
  pregunta: string;
  dificultad: QuestionDifficulty;
  categoriaId: number | null;
  respuestas: Answer[];
}

export interface QuestionValidationResult {
  isValid: boolean;
  errors: string[];
  totalScore: number;
}

export function validateQuestion({
  pregunta,
  dificultad,
  categoriaId,
  respuestas,
}: ValidateQuestionInput): QuestionValidationResult {
  const errors: string[] = [];

  const cleanedQuestion = pregunta.trim();
  const validAnswers = respuestas.filter((answer) => answer.respuesta.trim() !== '');
  const totalScore = respuestas.reduce((sum, answer) => sum + Number(answer.puntaje || 0), 0);

  if (!categoriaId) {
    errors.push('Debes seleccionar una categoría.');
  }

  if (!cleanedQuestion) {
    errors.push('Debes escribir el contenido de la pregunta.');
  }

  if (!dificultad) {
    errors.push('Debes seleccionar una dificultad.');
  }

  if (respuestas.length < 4) {
    errors.push('La pregunta debe tener al menos 4 respuestas.');
  }

  if (respuestas.length > 10) {
    errors.push('La pregunta no puede tener más de 10 respuestas.');
  }

  if (validAnswers.length !== respuestas.length) {
    errors.push('Todas las respuestas deben tener texto.');
  }

  const hasInvalidScore = respuestas.some((answer) => {
    const score = Number(answer.puntaje);
    return Number.isNaN(score) || score <= 0 || !Number.isInteger(score);
  });

  if (hasInvalidScore) {
    errors.push('Todos los puntajes deben ser números enteros mayores que 0.');
  }

  if (totalScore !== 100) {
    errors.push(`La suma total de puntajes debe ser exactamente 100. Actualmente suma ${totalScore}.`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    totalScore,
  };
}