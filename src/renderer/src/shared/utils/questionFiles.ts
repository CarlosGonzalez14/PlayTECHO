import * as XLSX from 'xlsx';
import type { Question, QuestionDifficulty } from '../types/question.types';
import type { QuestionForExport } from '../types/window.types';

type ImportRow = Record<string, unknown>;

export interface ParsedQuestion {
  categoria: string;
  pregunta: string;
  dificultad: QuestionDifficulty;
  respuestas: {
    respuesta: string;
    puntaje: number;
  }[];
}

export interface ImportParseResult {
  validQuestions: ParsedQuestion[];
  errors: string[];
}

const headers = [
  'categoria',
  'pregunta',
  'dificultad',
  'respuesta_1',
  'puntaje_1',
  'respuesta_2',
  'puntaje_2',
  'respuesta_3',
  'puntaje_3',
  'respuesta_4',
  'puntaje_4',
  'respuesta_5',
  'puntaje_5',
  'respuesta_6',
  'puntaje_6',
  'respuesta_7',
  'puntaje_7',
  'respuesta_8',
  'puntaje_8',
  'respuesta_9',
  'puntaje_9',
  'respuesta_10',
  'puntaje_10',
];

function downloadWorkbook(workbook: XLSX.WorkBook, fileName: string) {
  XLSX.writeFile(workbook, fileName);
}

function normalizeText(value: unknown) {
  return String(value ?? '').trim();
}

function normalizeDifficulty(value: unknown): QuestionDifficulty | null {
  const cleanedValue = normalizeText(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (cleanedValue === 'facil') {
    return 'facil';
  }

  if (cleanedValue === 'media') {
    return 'media';
  }

  if (cleanedValue === 'dificil') {
    return 'dificil';
  }

  return null;
}

function normalizeScore(value: unknown) {
  if (typeof value === 'number') {
    return value;
  }

  const cleanedValue = normalizeText(value);

  if (!cleanedValue) {
    return 0;
  }

  return Number(cleanedValue);
}

export function downloadQuestionsTemplate() {
  const exampleRows = [
    {
      categoria: 'Cultura general',
      pregunta: 'Menciona una comida típica mexicana',
      dificultad: 'facil',
      respuesta_1: 'Tacos',
      puntaje_1: 35,
      respuesta_2: 'Mole',
      puntaje_2: 25,
      respuesta_3: 'Tamales',
      puntaje_3: 20,
      respuesta_4: 'Pozole',
      puntaje_4: 10,
      respuesta_5: 'Tlayudas',
      puntaje_5: 10,
      respuesta_6: '',
      puntaje_6: '',
      respuesta_7: '',
      puntaje_7: '',
      respuesta_8: '',
      puntaje_8: '',
      respuesta_9: '',
      puntaje_9: '',
      respuesta_10: '',
      puntaje_10: '',
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(exampleRows, {
    header: headers,
  });

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Preguntas');

  downloadWorkbook(workbook, 'machote-preguntas-playtecho.xlsx');
}

export async function parseQuestionsFile(file: File): Promise<ImportParseResult> {
  const buffer = await file.arrayBuffer();

  const workbook = XLSX.read(buffer, {
    type: 'array',
  });

  const firstSheetName = workbook.SheetNames[0];

  if (!firstSheetName) {
    return {
      validQuestions: [],
      errors: ['El archivo no contiene hojas de cálculo.'],
    };
  }

  const worksheet = workbook.Sheets[firstSheetName];

  const rows = XLSX.utils.sheet_to_json<ImportRow>(worksheet, {
    defval: '',
  });

  const validQuestions: ParsedQuestion[] = [];
  const errors: string[] = [];

  rows.forEach((row, index) => {
    const excelRowNumber = index + 2;

    const categoria = normalizeText(row.categoria);
    const pregunta = normalizeText(row.pregunta);
    const dificultad = normalizeDifficulty(row.dificultad);

    const respuestas: ParsedQuestion['respuestas'] = [];

    for (let answerIndex = 1; answerIndex <= 10; answerIndex += 1) {
      const respuesta = normalizeText(row[`respuesta_${answerIndex}`]);
      const puntaje = normalizeScore(row[`puntaje_${answerIndex}`]);

      const hasAnswer = respuesta !== '';
      const hasScore = puntaje !== 0 && !Number.isNaN(puntaje);

      if (hasAnswer || hasScore) {
        respuestas.push({
          respuesta,
          puntaje,
        });
      }
    }

    const rowErrors: string[] = [];

    if (!categoria) {
      rowErrors.push('falta la categoría');
    }

    if (!pregunta) {
      rowErrors.push('falta la pregunta');
    }

    if (!dificultad) {
      rowErrors.push('la dificultad debe ser facil, media o dificil');
    }

    if (respuestas.length < 4 || respuestas.length > 10) {
      rowErrors.push('debe tener entre 4 y 10 respuestas');
    }

    const hasEmptyAnswer = respuestas.some((answer) => answer.respuesta === '');

    if (hasEmptyAnswer) {
      rowErrors.push('hay respuestas sin texto');
    }

    const hasInvalidScore = respuestas.some((answer) => {
      return (
        Number.isNaN(answer.puntaje) ||
        answer.puntaje <= 0 ||
        !Number.isInteger(answer.puntaje)
      );
    });

    if (hasInvalidScore) {
      rowErrors.push('todos los puntajes deben ser enteros mayores que 0');
    }

    const totalScore = respuestas.reduce((sum, answer) => sum + answer.puntaje, 0);

    if (totalScore !== 100) {
      rowErrors.push(`los puntajes suman ${totalScore}, pero deben sumar 100`);
    }

    if (rowErrors.length > 0) {
      errors.push(`Fila ${excelRowNumber}: ${rowErrors.join(', ')}.`);
      return;
    }

    validQuestions.push({
      categoria,
      pregunta,
      dificultad: dificultad as QuestionDifficulty,
      respuestas,
    });
  });

  return {
    validQuestions,
    errors,
  };
}

export function buildQuestionFromParsedRow(parsedQuestion: ParsedQuestion, categoriaId: number): Question {
  return {
    pregunta: parsedQuestion.pregunta,
    dificultad: parsedQuestion.dificultad,
    categoria_id: categoriaId,
    estado: 'publicada',
    respuestas: parsedQuestion.respuestas,
  };
}

export function downloadQuestionsBackup(questions: QuestionForExport[]) {
  const rows = questions.map((question) => {
    const row: Record<string, string | number> = {
      categoria: question.categoria,
      pregunta: question.pregunta,
      dificultad: question.dificultad,
    };

    for (let index = 1; index <= 10; index += 1) {
      const answer = question.respuestas[index - 1];

      row[`respuesta_${index}`] = answer?.respuesta ?? '';
      row[`puntaje_${index}`] = answer?.puntaje ?? '';
    }

    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(rows, {
    header: headers,
  });

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Preguntas');

  downloadWorkbook(workbook, 'respaldo-preguntas-playtecho.xlsx');
}