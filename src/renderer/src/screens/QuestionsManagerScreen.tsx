import { ArrowLeft, FileDown, FileSpreadsheet, Upload } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { AppButton } from '../shared/components/AppButton';
import type { Category, Question } from '../shared/types/question.types';
import type { QuestionSummary } from '../shared/types/window.types';
import { QuestionForm } from './questions/QuestionForm';
import {
  buildQuestionFromParsedRow,
  downloadQuestionsBackup,
  downloadQuestionsTemplate,
  parseQuestionsFile,
} from '../shared/utils/questionFiles';

interface QuestionsManagerScreenProps {
  onBack: () => void;
}

export function QuestionsManagerScreen({ onBack }: QuestionsManagerScreenProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [questionSummaries, setQuestionSummaries] = useState<QuestionSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [fileActionMessage, setFileActionMessage] = useState<string | null>(null);

  const loadQuestionData = useCallback(async () => {
    try {
      setIsLoading(true);
      setLoadError(null);

      const [storedCategories, storedQuestions] = await Promise.all([
        window.playtecho.questions.getCategories(),
        window.playtecho.questions.getQuestionSummaries(),
      ]);

      setCategories(storedCategories);
      setQuestionSummaries(storedQuestions);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo cargar la información de preguntas.';

      setLoadError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuestionData();
  }, [loadQuestionData]);

  const handleCreateCategory = async (name: string): Promise<Category> => {
    const newCategory = await window.playtecho.questions.createCategory(name);

    setCategories((currentCategories) => {
      const alreadyExists = currentCategories.some(
        (category) => category.id === newCategory.id
      );

      if (alreadyExists) {
        return currentCategories;
      }

      return [...currentCategories, newCategory].sort((a, b) =>
        a.nombre.localeCompare(b.nombre)
      );
    });

    return newCategory;
  };

  const handleSaveQuestion = async (question: Question) => {
    await window.playtecho.questions.createQuestion(question);
    await loadQuestionData();
  };

  const handleDownloadTemplate = () => {
    downloadQuestionsTemplate();
    setFileActionMessage('Machote descargado correctamente.');
  };

  const handleBackupQuestions = async () => {
    try {
      const questions = await window.playtecho.questions.getQuestionsForExport();

      if (questions.length === 0) {
        setFileActionMessage('Todavía no hay preguntas guardadas para respaldar.');
        return;
      }

      downloadQuestionsBackup(questions);
      setFileActionMessage('Respaldo descargado correctamente.');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'No se pudo generar el respaldo.';

      setFileActionMessage(message);
    }
  };

  const handleOpenImportFile = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    event.target.value = '';

    if (!file) {
      return;
    }

    try {
      setIsImporting(true);
      setFileActionMessage(null);

      const result = await parseQuestionsFile(file);

      if (result.errors.length > 0) {
        setFileActionMessage(
          `El archivo tiene errores y no fue importado. Primeros errores: ${result.errors
            .slice(0, 5)
            .join(' ')}`
        );
        return;
      }

      if (result.validQuestions.length === 0) {
        setFileActionMessage('El archivo no contiene preguntas válidas para importar.');
        return;
      }

      let importedCount = 0;

      for (const parsedQuestion of result.validQuestions) {
        const category = await window.playtecho.questions.createCategory(
          parsedQuestion.categoria
        );

        const question = buildQuestionFromParsedRow(parsedQuestion, category.id);

        await window.playtecho.questions.createQuestion(question);

        importedCount += 1;
      }

      await loadQuestionData();

      setFileActionMessage(
        `Importación completada. Se guardaron ${importedCount} preguntas en SQLite.`
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'No se pudo importar el archivo.';

      setFileActionMessage(message);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <main
      className="app-shell"
      style={{
        padding: 'clamp(20px, 4vw, 48px)',
        overflow: 'auto',
      }}
    >
      <section
        style={{
          width: 'min(1180px, 100%)',
          margin: '0 auto',
          display: 'grid',
          gap: '28px',
        }}
      >
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontFamily: 'var(--font-title)',
                fontSize: 'clamp(2.4rem, 6vw, 5rem)',
                lineHeight: 0.95,
              }}
            >
              Banco de preguntas
            </h1>

            <p
              style={{
                margin: '8px 0 0',
                maxWidth: '760px',
                opacity: 0.9,
                lineHeight: 1.5,
              }}
            >
              Crea preguntas para los juegos de PlayTECHO. A partir de este paso, las
              categorías, preguntas y respuestas se guardan en SQLite.
            </p>
          </div>

          <AppButton variant="secondary" onClick={onBack}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
              <ArrowLeft size={22} />
              Volver
            </span>
          </AppButton>
        </header>

        {loadError && (
          <section
            style={{
              background: 'rgba(233, 67, 98, 0.22)',
              border: '1px solid rgba(255, 255, 255, 0.28)',
              borderRadius: '22px',
              padding: '18px',
            }}
          >
            <strong>No se pudo cargar la base de datos:</strong> {loadError}
          </section>
        )}

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
          }}
        >
          <SmallActionCard
            icon={<Upload size={26} />}
            title={isImporting ? 'Importando...' : 'Importar Excel/CSV'}
            description="Carga preguntas desde un archivo externo."
            onClick={handleOpenImportFile}
            disabled={isImporting}
          />

          <SmallActionCard
            icon={<FileSpreadsheet size={26} />}
            title="Descargar machote"
            description="Archivo guía para llenar preguntas."
            onClick={handleDownloadTemplate}
          />

          <SmallActionCard
            icon={<FileDown size={26} />}
            title="Respaldar preguntas"
            description="Exporta el banco actual."
            onClick={handleBackupQuestions}
          />

          <SmallActionCard
            title={`${questionSummaries.length}`}
            description="Preguntas guardadas en SQLite."
          />
        </section>

        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleImportFile}
          style={{ display: 'none' }}
        />

        {fileActionMessage && (
          <section
            style={{
              background: 'rgba(255, 255, 255, 0.16)',
              border: '1px solid rgba(255, 255, 255, 0.24)',
              borderRadius: '20px',
              padding: '16px',
              lineHeight: 1.5,
            }}
          >
            {fileActionMessage}
          </section>
        )}

        {isLoading ? (
          <section
            style={{
              background: 'rgba(255, 255, 255, 0.16)',
              borderRadius: '28px',
              padding: '28px',
              textAlign: 'center',
              fontFamily: 'var(--font-title)',
              fontSize: '1.8rem',
            }}
          >
            Cargando banco de preguntas...
          </section>
        ) : (
          <QuestionForm
            categories={categories}
            onCreateCategory={handleCreateCategory}
            onSaveQuestion={handleSaveQuestion}
          />
        )}

        {questionSummaries.length > 0 && (
          <section
            style={{
              display: 'grid',
              gap: '14px',
            }}
          >
            <h2
              style={{
                margin: 0,
                fontFamily: 'var(--font-title)',
                fontSize: '2.2rem',
              }}
            >
              Preguntas guardadas
            </h2>

            <div
              style={{
                display: 'grid',
                gap: '10px',
              }}
            >
              {questionSummaries.map((question) => (
                <article
                  key={question.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.14)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '20px',
                    padding: '18px',
                    display: 'grid',
                    gap: '8px',
                  }}
                >
                  <strong
                    style={{
                      fontFamily: 'var(--font-title)',
                      fontSize: '1.25rem',
                    }}
                  >
                    {question.pregunta}
                  </strong>

                  <span
                    style={{
                      opacity: 0.88,
                      lineHeight: 1.4,
                    }}
                  >
                    Categoría: {question.categoria_nombre} · Dificultad:{' '}
                    {question.dificultad} · Respuestas: {question.total_respuestas} ·
                    Puntaje total: {question.total_puntaje}
                  </span>
                </article>
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

interface SmallActionCardProps {
  icon?: ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
  disabled?: boolean;
}

function SmallActionCard({
  icon,
  title,
  description,
  onClick,
  disabled = false,
}: SmallActionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || !onClick}
      style={{
        minHeight: '132px',
        padding: '20px',
        borderRadius: '24px',
        background: 'rgba(255, 255, 255, 0.13)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        display: 'grid',
        gap: '10px',
        alignContent: 'start',
        textAlign: 'left',
        color: '#ffffff',
        cursor: onClick && !disabled ? 'pointer' : 'default',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        {icon && (
          <span
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '14px',
              background: 'rgba(255, 255, 255, 0.18)',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            {icon}
          </span>
        )}

        <h2
          style={{
            margin: 0,
            fontFamily: 'var(--font-title)',
            fontSize: icon ? '1.25rem' : '2.2rem',
          }}
        >
          {title}
        </h2>
      </div>

      <p
        style={{
          margin: 0,
          opacity: 0.86,
          lineHeight: 1.4,
        }}
      >
        {description}
      </p>
    </button>
  );
}