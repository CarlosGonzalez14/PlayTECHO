import { getDatabase } from '../database';

type QuestionDifficulty = 'facil' | 'media' | 'dificil';

interface AnswerInput {
  respuesta: string;
  puntaje: number;
}

export interface CreateQuestionInput {
  pregunta: string;
  dificultad: QuestionDifficulty;
  categoria_id: number;
  estado?: 'borrador' | 'publicada';
  respuestas: AnswerInput[];
}

export interface QuestionSummaryRow {
  id: number;
  pregunta: string;
  dificultad: QuestionDifficulty;
  categoria_id: number;
  categoria_nombre: string;
  estado: 'borrador' | 'publicada';
  total_respuestas: number;
  total_puntaje: number;
}

function validateQuestionBeforeInsert(question: CreateQuestionInput) {
  const cleanedQuestion = question.pregunta.trim();
  const answers = question.respuestas;
  const totalScore = answers.reduce((sum, answer) => sum + Number(answer.puntaje || 0), 0);

  if (!cleanedQuestion) {
    throw new Error('La pregunta no puede estar vacía.');
  }

  if (!question.categoria_id) {
    throw new Error('Debes seleccionar una categoría válida.');
  }

  if (!['facil', 'media', 'dificil'].includes(question.dificultad)) {
    throw new Error('La dificultad no es válida.');
  }

  if (answers.length < 4 || answers.length > 10) {
    throw new Error('La pregunta debe tener entre 4 y 10 respuestas.');
  }

  const hasEmptyAnswer = answers.some((answer) => answer.respuesta.trim() === '');

  if (hasEmptyAnswer) {
    throw new Error('Todas las respuestas deben tener texto.');
  }

  const hasInvalidScore = answers.some((answer) => {
    const score = Number(answer.puntaje);
    return Number.isNaN(score) || score <= 0 || !Number.isInteger(score);
  });

  if (hasInvalidScore) {
    throw new Error('Todos los puntajes deben ser enteros mayores que 0.');
  }

  if (totalScore !== 100) {
    throw new Error(`La suma de puntajes debe ser exactamente 100. Actualmente suma ${totalScore}.`);
  }
}

export function createQuestion(question: CreateQuestionInput): QuestionSummaryRow {
  validateQuestionBeforeInsert(question);

  const database = getDatabase();

  const insertQuestion = database.prepare(
    `
    INSERT INTO preguntas (pregunta, dificultad, categoria_id, estado)
    VALUES (?, ?, ?, 'borrador')
    `
  );

  const insertAnswer = database.prepare(
    `
    INSERT INTO respuestas (respuesta, puntaje, pregunta_id)
    VALUES (?, ?, ?)
    `
  );

  const publishQuestion = database.prepare(
    `
    UPDATE preguntas
    SET estado = 'publicada'
    WHERE id = ?
    `
  );

  const getQuestionSummaryById = database.prepare(
    `
    SELECT
      p.id,
      p.pregunta,
      p.dificultad,
      p.categoria_id,
      c.nombre AS categoria_nombre,
      p.estado,
      COUNT(r.id) AS total_respuestas,
      COALESCE(SUM(r.puntaje), 0) AS total_puntaje
    FROM preguntas p
    INNER JOIN categorias c ON c.id = p.categoria_id
    LEFT JOIN respuestas r ON r.pregunta_id = p.id
    WHERE p.id = ?
    GROUP BY p.id
    `
  );

  const insertTransaction = database.transaction((input: CreateQuestionInput) => {
    const result = insertQuestion.run(
      input.pregunta.trim(),
      input.dificultad,
      input.categoria_id
    );

    const questionId = Number(result.lastInsertRowid);

    for (const answer of input.respuestas) {
      insertAnswer.run(answer.respuesta.trim(), Number(answer.puntaje), questionId);
    }

    publishQuestion.run(questionId);

    return getQuestionSummaryById.get(questionId) as QuestionSummaryRow;
  });

  return insertTransaction(question);
}

export function getQuestionSummaries(): QuestionSummaryRow[] {
  const database = getDatabase();

  return database
    .prepare(
      `
      SELECT
        p.id,
        p.pregunta,
        p.dificultad,
        p.categoria_id,
        c.nombre AS categoria_nombre,
        p.estado,
        COUNT(r.id) AS total_respuestas,
        COALESCE(SUM(r.puntaje), 0) AS total_puntaje
      FROM preguntas p
      INNER JOIN categorias c ON c.id = p.categoria_id
      LEFT JOIN respuestas r ON r.pregunta_id = p.id
      GROUP BY p.id
      ORDER BY p.id DESC
      `
    )
    .all() as QuestionSummaryRow[];
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

interface ExportQuestionRow {
  id: number;
  categoria: string;
  pregunta: string;
  dificultad: QuestionDifficulty;
}

interface ExportAnswerRow {
  pregunta_id: number;
  respuesta: string;
  puntaje: number;
}

export function getQuestionsForExport(): QuestionForExport[] {
  const database = getDatabase();

  const questions = database
    .prepare(
      `
      SELECT
        p.id,
        c.nombre AS categoria,
        p.pregunta,
        p.dificultad
      FROM preguntas p
      INNER JOIN categorias c ON c.id = p.categoria_id
      WHERE p.estado = 'publicada'
      ORDER BY p.id ASC
      `
    )
    .all() as ExportQuestionRow[];

  const answers = database
    .prepare(
      `
      SELECT
        pregunta_id,
        respuesta,
        puntaje
      FROM respuestas
      ORDER BY id ASC
      `
    )
    .all() as ExportAnswerRow[];

  return questions.map((question) => ({
    id: question.id,
    categoria: question.categoria,
    pregunta: question.pregunta,
    dificultad: question.dificultad,
    respuestas: answers
      .filter((answer) => answer.pregunta_id === question.id)
      .map((answer) => ({
        respuesta: answer.respuesta,
        puntaje: answer.puntaje,
      })),
  }));
}

export function deleteQuestion(questionId: number) {
  const database = getDatabase();

  if (!questionId || Number.isNaN(questionId)) {
    throw new Error('El ID de la pregunta no es válido.');
  }

  const existingQuestion = database
    .prepare(
      `
      SELECT id
      FROM preguntas
      WHERE id = ?
      `
    )
    .get(questionId) as { id: number } | undefined;

  if (!existingQuestion) {
    throw new Error('La pregunta que intentas eliminar no existe.');
  }

  const result = database
    .prepare(
      `
      DELETE FROM preguntas
      WHERE id = ?
      `
    )
    .run(questionId);

  return {
    deleted: result.changes > 0,
    id: questionId,
  };
}

export interface GameQuestionAnswer {
  id: number;
  respuesta: string;
  puntaje: number;
}

export interface GameQuestionForPlay {
  id: number;
  pregunta: string;
  dificultad: QuestionDifficulty;
  categoria_id: number;
  categoria_nombre: string;
  respuestas: GameQuestionAnswer[];
}

interface GameQuestionRow {
  id: number;
  pregunta: string;
  dificultad: QuestionDifficulty;
  categoria_id: number;
  categoria_nombre: string;
}

export function getQuestionForGameById(questionId: number): GameQuestionForPlay {
  const database = getDatabase();

  const question = database
    .prepare(
      `
      SELECT
        p.id,
        p.pregunta,
        p.dificultad,
        p.categoria_id,
        c.nombre AS categoria_nombre
      FROM preguntas p
      INNER JOIN categorias c ON c.id = p.categoria_id
      WHERE p.id = ?
        AND p.estado = 'publicada'
      `
    )
    .get(questionId) as GameQuestionRow | undefined;

  if (!question) {
    throw new Error('No se encontró una pregunta publicada con ese ID.');
  }

  const respuestas = database
    .prepare(
      `
      SELECT
        id,
        respuesta,
        puntaje
      FROM respuestas
      WHERE pregunta_id = ?
      ORDER BY id ASC
      `
    )
    .all(questionId) as GameQuestionAnswer[];

  return {
    ...question,
    respuestas,
  };
}