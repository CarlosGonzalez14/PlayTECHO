import { MinusCircle, PlusCircle, Save } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AppButton } from '../../shared/components/AppButton';
import type {
  Answer,
  Category,
  Question,
  QuestionDifficulty,
} from '../../shared/types/question.types';
import { validateQuestion } from '../../shared/utils/validateQuestion';
import { CategoryModal } from './CategoryModal';

interface QuestionFormProps {
  categories: Category[];
  onCreateCategory: (name: string) => Promise<Category>;
  onSaveQuestion: (question: Question) => Promise<void>;
}

const initialAnswers: Answer[] = [
  { respuesta: '', puntaje: 0 },
  { respuesta: '', puntaje: 0 },
  { respuesta: '', puntaje: 0 },
  { respuesta: '', puntaje: 0 },
];

export function QuestionForm({
  categories,
  onCreateCategory,
  onSaveQuestion,
}: QuestionFormProps) {
  const [pregunta, setPregunta] = useState('');
  const [dificultad, setDificultad] = useState<QuestionDifficulty>('facil');
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [respuestas, setRespuestas] = useState<Answer[]>(initialAnswers);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const validation = useMemo(
    () =>
      validateQuestion({
        pregunta,
        dificultad,
        categoriaId,
        respuestas,
      }),
    [pregunta, dificultad, categoriaId, respuestas]
  );

  const canAddAnswer = respuestas.length < 10;
  const canRemoveAnswer = respuestas.length > 4;

  const handleAddAnswer = () => {
    if (!canAddAnswer) {
      return;
    }

    setRespuestas((currentAnswers) => [
      ...currentAnswers,
      {
        respuesta: '',
        puntaje: 0,
      },
    ]);
  };

  const handleRemoveAnswer = (indexToRemove: number) => {
    if (!canRemoveAnswer) {
      return;
    }

    setRespuestas((currentAnswers) =>
      currentAnswers.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleAnswerTextChange = (indexToUpdate: number, value: string) => {
    setRespuestas((currentAnswers) =>
      currentAnswers.map((answer, index) =>
        index === indexToUpdate
          ? {
              ...answer,
              respuesta: value,
            }
          : answer
      )
    );
  };

  const handleAnswerScoreChange = (indexToUpdate: number, value: string) => {
    const numericValue = Number(value);

    setRespuestas((currentAnswers) =>
      currentAnswers.map((answer, index) =>
        index === indexToUpdate
          ? {
              ...answer,
              puntaje: Number.isNaN(numericValue) ? 0 : numericValue,
            }
          : answer
      )
    );
  };

const handleCreateCategory = async (name: string) => {
  const newCategory = await onCreateCategory(name);
  setCategoriaId(newCategory.id);
};

const handleSave = async () => {
  const result = validateQuestion({
    pregunta,
    dificultad,
    categoriaId,
    respuestas,
  });

  if (!result.isValid || !categoriaId) {
    setErrors(result.errors);
    return;
  }

  const questionToSave: Question = {
    pregunta: pregunta.trim(),
    dificultad,
    categoria_id: categoriaId,
    estado: 'publicada',
    respuestas: respuestas.map((answer) => ({
      respuesta: answer.respuesta.trim(),
      puntaje: Number(answer.puntaje),
    })),
  };

  try {
    setIsSaving(true);
    setErrors([]);

    await onSaveQuestion(questionToSave);

    setPregunta('');
    setDificultad('facil');
    setCategoriaId(null);
    setRespuestas(initialAnswers);

    alert('Pregunta guardada correctamente en SQLite.');
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'No se pudo guardar la pregunta.';

    setErrors([message]);
  } finally {
    setIsSaving(false);
  }
};

  return (
    <>
      <section
        style={{
          background: 'rgba(255, 255, 255, 0.16)',
          border: '1px solid rgba(255, 255, 255, 0.22)',
          borderRadius: '32px',
          padding: 'clamp(20px, 4vw, 34px)',
          boxShadow: '0 22px 42px rgba(0, 0, 0, 0.18)',
          display: 'grid',
          gap: '24px',
        }}
      >
        <header>
          <h2
            style={{
              margin: 0,
              fontFamily: 'var(--font-title)',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              lineHeight: 0.95,
            }}
          >
            Crear pregunta
          </h2>

          <p
            style={{
              margin: '10px 0 0',
              opacity: 0.9,
              lineHeight: 1.5,
            }}
          >
            Captura una pregunta con entre 4 y 10 respuestas. La suma de los puntajes debe
            ser exactamente 100.
          </p>
        </header>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '18px',
          }}
        >
          <label style={fieldStyle}>
            Categoría
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '10px',
              }}
            >
              <select
                value={categoriaId ?? ''}
                onChange={(event) =>
                  setCategoriaId(event.target.value ? Number(event.target.value) : null)
                }
                style={inputStyle}
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.nombre}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(true)}
                style={{
                  width: '54px',
                  minHeight: '54px',
                  borderRadius: '16px',
                  background: '#fdc533',
                  color: '#1d1d1b',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                }}
                title="Crear categoría"
              >
                <PlusCircle size={24} />
              </button>
            </div>
          </label>

          <label style={fieldStyle}>
            Dificultad
            <select
              value={dificultad}
              onChange={(event) => setDificultad(event.target.value as QuestionDifficulty)}
              style={inputStyle}
            >
              <option value="facil">Fácil</option>
              <option value="media">Media</option>
              <option value="dificil">Difícil</option>
            </select>
          </label>
        </div>

        <label style={fieldStyle}>
          Pregunta
          <textarea
            value={pregunta}
            onChange={(event) => setPregunta(event.target.value)}
            placeholder="Ej. Menciona una comida típica mexicana"
            rows={3}
            style={{
              ...inputStyle,
              paddingTop: '14px',
              resize: 'vertical',
              lineHeight: 1.5,
            }}
          />
        </label>

        <section
          style={{
            display: 'grid',
            gap: '16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <h3
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-title)',
                  fontSize: '2rem',
                }}
              >
                Respuestas
              </h3>

              <p
                style={{
                  margin: '4px 0 0',
                  opacity: 0.86,
                }}
              >
                Total acumulado:{' '}
                <strong
                  style={{
                    color: validation.totalScore === 100 ? '#fdc533' : '#ffffff',
                  }}
                >
                  {validation.totalScore}/100
                </strong>
              </p>
            </div>

            <AppButton variant="warning" onClick={handleAddAnswer} disabled={!canAddAnswer}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                <PlusCircle size={22} />
                Añadir respuesta
              </span>
            </AppButton>
          </div>

          <div
            style={{
              display: 'grid',
              gap: '12px',
            }}
          >
            {respuestas.map((answer, index) => (
              <div
                key={index}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(180px, 1fr) minmax(90px, 140px) auto',
                  gap: '10px',
                  alignItems: 'center',
                }}
              >
                <input
                  value={answer.respuesta}
                  onChange={(event) => handleAnswerTextChange(index, event.target.value)}
                  placeholder={`Respuesta ${index + 1}`}
                  style={inputStyle}
                />

                <input
                  value={answer.puntaje || ''}
                  onChange={(event) => handleAnswerScoreChange(index, event.target.value)}
                  placeholder="Puntos"
                  type="number"
                  min={1}
                  max={100}
                  style={inputStyle}
                />

                <button
                  type="button"
                  onClick={() => handleRemoveAnswer(index)}
                  disabled={!canRemoveAnswer}
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '16px',
                    background: canRemoveAnswer ? '#e94362' : 'rgba(255,255,255,0.22)',
                    color: '#ffffff',
                    display: 'grid',
                    placeItems: 'center',
                    cursor: canRemoveAnswer ? 'pointer' : 'not-allowed',
                    opacity: canRemoveAnswer ? 1 : 0.55,
                  }}
                  title="Eliminar respuesta"
                >
                  <MinusCircle size={22} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {errors.length > 0 && (
          <section
            style={{
              background: 'rgba(233, 67, 98, 0.22)',
              border: '1px solid rgba(255, 255, 255, 0.28)',
              borderRadius: '22px',
              padding: '18px',
            }}
          >
            <h3
              style={{
                margin: '0 0 10px',
                fontFamily: 'var(--font-title)',
              }}
            >
              Revisa antes de guardar
            </h3>

            <ul
              style={{
                margin: 0,
                paddingLeft: '20px',
                lineHeight: 1.6,
              }}
            >
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </section>
        )}

        <footer
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <AppButton variant="success" onClick={handleSave} disabled={isSaving}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
              <Save size={22} />
              {isSaving ? 'Guardando...' : 'Guardar pregunta'}
            </span>
          </AppButton>
        </footer>
      </section>

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onCreateCategory={handleCreateCategory}
      />
    </>
  );
}

const fieldStyle: React.CSSProperties = {
  display: 'grid',
  gap: '8px',
  fontWeight: 700,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  minHeight: '54px',
  borderRadius: '16px',
  border: '2px solid rgba(255, 255, 255, 0.42)',
  background: 'rgba(255, 255, 255, 0.92)',
  color: '#1d1d1b',
  padding: '0 16px',
  fontSize: '1rem',
  outline: 'none',
};