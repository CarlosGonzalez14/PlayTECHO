import { Eye, Monitor, RadioTower, RefreshCcw, RotateCcw, Send, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { AppButton } from '../shared/components/AppButton';
import type { HundredTecherosGameEvent } from '../shared/types/game-events.types';
import type { GameQuestionForPlay, QuestionSummary } from '../shared/types/window.types';

export function AdminGameWindowScreen() {
  const [questionSummaries, setQuestionSummaries] = useState<QuestionSummary[]>([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<GameQuestionForPlay | null>(null);
  const [revealedAnswerIndexes, setRevealedAnswerIndexes] = useState<number[]>([]);
  const [lastAction, setLastAction] = useState('Aún no se ha enviado ningún evento.');
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [isLoadingSelectedQuestion, setIsLoadingSelectedQuestion] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const selectedSummary = useMemo(() => {
    return questionSummaries.find((question) => question.id === selectedQuestionId) ?? null;
  }, [questionSummaries, selectedQuestionId]);

  const loadQuestionSummaries = useCallback(async () => {
    try {
      setIsLoadingQuestions(true);
      setLoadError(null);

      const questions = await window.playtecho.questions.getQuestionSummaries();

      setQuestionSummaries(questions);

      if (questions.length > 0) {
        setSelectedQuestionId((currentSelectedId) => currentSelectedId ?? questions[0].id);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'No se pudieron cargar las preguntas.';

      setLoadError(message);
    } finally {
      setIsLoadingQuestions(false);
    }
  }, []);

  const loadSelectedQuestion = useCallback(async (questionId: number) => {
    try {
      setIsLoadingSelectedQuestion(true);
      setLoadError(null);

      const question = await window.playtecho.questions.getQuestionForGameById(questionId);

      setSelectedQuestion(question);
      setRevealedAnswerIndexes([]);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'No se pudo cargar la pregunta seleccionada.';

      setLoadError(message);
      setSelectedQuestion(null);
    } finally {
      setIsLoadingSelectedQuestion(false);
    }
  }, []);

  useEffect(() => {
    loadQuestionSummaries();
  }, [loadQuestionSummaries]);

  useEffect(() => {
    if (selectedQuestionId) {
      loadSelectedQuestion(selectedQuestionId);
    }
  }, [selectedQuestionId, loadSelectedQuestion]);

  const sendGameEvent = async (gameEvent: HundredTecherosGameEvent) => {
    try {
      await window.playtecho.game.sendEventToPublicWindow(gameEvent);
      setLastAction(`Evento enviado: ${gameEvent.type}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'No se pudo enviar el evento.';

      setLastAction(message);
    }
  };

  const handleSendQuestionToPublicWindow = async () => {
    if (!selectedQuestion) {
      setLastAction('Selecciona una pregunta antes de enviarla.');
      return;
    }

    await sendGameEvent({
      type: 'SHOW_QUESTION',
      payload: {
        question: selectedQuestion.pregunta,
        answerCount: selectedQuestion.respuestas.length,
      },
    });

    setRevealedAnswerIndexes([]);
  };

  const handleRevealAnswer = async (answerIndex: number) => {
    if (!selectedQuestion) {
      return;
    }

    const answer = selectedQuestion.respuestas[answerIndex];

    if (!answer) {
      return;
    }

    await sendGameEvent({
      type: 'REVEAL_ANSWER',
      payload: {
        index: answerIndex + 1,
        answer: answer.respuesta,
        score: answer.puntaje,
      },
    });

    setRevealedAnswerIndexes((currentIndexes) => {
      if (currentIndexes.includes(answerIndex)) {
        return currentIndexes;
      }

      return [...currentIndexes, answerIndex];
    });
  };

  const handleResetBoard = async () => {
    await sendGameEvent({
      type: 'RESET_BOARD',
    });

    setRevealedAnswerIndexes([]);
  };

  return (
    <main
      className="app-shell"
      style={{
        minHeight: '100vh',
        padding: 'clamp(20px, 4vw, 48px)',
        overflow: 'auto',
      }}
    >
      <section
        style={{
          width: 'min(1180px, 100%)',
          margin: '0 auto',
          display: 'grid',
          gap: '26px',
        }}
      >
        <header>
          <p
            style={{
              margin: 0,
              fontFamily: 'var(--font-accent)',
              color: '#fdc533',
              fontSize: 'clamp(1.25rem, 3vw, 2.1rem)',
            }}
          >
            Ventana privada
          </p>

          <h1
            style={{
              margin: 0,
              fontFamily: 'var(--font-title)',
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              lineHeight: 0.9,
            }}
          >
            Panel del operador
          </h1>

          <p
            style={{
              margin: '12px 0 0',
              maxWidth: '820px',
              lineHeight: 1.5,
              opacity: 0.9,
            }}
          >
            Selecciona una pregunta guardada en SQLite, envíala al tablero público y revela
            sus respuestas conforme avanza la ronda.
          </p>
        </header>

        {loadError && (
          <section
            style={{
              background: 'rgba(233, 67, 98, 0.22)',
              border: '1px solid rgba(255, 255, 255, 0.28)',
              borderRadius: '22px',
              padding: '18px',
              lineHeight: 1.5,
            }}
          >
            {loadError}
          </section>
        )}

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px',
          }}
        >
          <article style={cardStyle}>
            <Monitor size={36} />
            <h2 style={cardTitleStyle}>Pregunta seleccionada</h2>
            <p style={cardTextStyle}>
              {selectedSummary
                ? `${selectedSummary.categoria_nombre} · ${selectedSummary.dificultad} · ${selectedSummary.total_respuestas} respuestas`
                : 'No hay pregunta seleccionada.'}
            </p>
          </article>

          <article style={cardStyle}>
            <RadioTower size={36} />
            <h2 style={cardTitleStyle}>Última acción</h2>
            <p style={cardTextStyle}>{lastAction}</p>
          </article>
        </section>

        <section style={panelStyle}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            <h2 style={sectionTitleStyle}>Banco de preguntas</h2>

            <AppButton variant="secondary" onClick={loadQuestionSummaries}>
              <span style={inlineIconStyle}>
                <RefreshCcw size={20} />
                Actualizar lista
              </span>
            </AppButton>
          </div>

          {isLoadingQuestions ? (
            <p style={cardTextStyle}>Cargando preguntas guardadas...</p>
          ) : questionSummaries.length === 0 ? (
            <p style={cardTextStyle}>
              Todavía no hay preguntas guardadas. Primero crea o importa preguntas desde el
              gestor de preguntas.
            </p>
          ) : (
            <label
              style={{
                display: 'grid',
                gap: '8px',
                fontWeight: 700,
              }}
            >
              Seleccionar pregunta
              <select
                value={selectedQuestionId ?? ''}
                onChange={(event) => {
                  const value = event.target.value;
                  setSelectedQuestionId(value ? Number(value) : null);
                }}
                style={inputStyle}
              >
                {questionSummaries.map((question) => (
                  <option key={question.id} value={question.id}>
                    {question.pregunta} · {question.categoria_nombre} ·{' '}
                    {question.total_respuestas} respuestas
                  </option>
                ))}
              </select>
            </label>
          )}
        </section>

        <section style={panelStyle}>
          <h2 style={sectionTitleStyle}>Pregunta cargada</h2>

          {isLoadingSelectedQuestion ? (
            <p style={cardTextStyle}>Cargando detalle de la pregunta...</p>
          ) : selectedQuestion ? (
            <div
              style={{
                display: 'grid',
                gap: '16px',
              }}
            >
              <article
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  borderRadius: '20px',
                  padding: '18px',
                  display: 'grid',
                  gap: '8px',
                }}
              >
                <strong
                  style={{
                    fontFamily: 'var(--font-title)',
                    fontSize: '1.6rem',
                    lineHeight: 1.1,
                  }}
                >
                  {selectedQuestion.pregunta}
                </strong>

                <span style={cardTextStyle}>
                  Categoría: {selectedQuestion.categoria_nombre} · Dificultad:{' '}
                  {selectedQuestion.dificultad} · Respuestas:{' '}
                  {selectedQuestion.respuestas.length}
                </span>
              </article>

              <AppButton variant="success" onClick={handleSendQuestionToPublicWindow}>
                <span style={inlineIconStyle}>
                  <Send size={22} />
                  Enviar pregunta al tablero
                </span>
              </AppButton>
            </div>
          ) : (
            <p style={cardTextStyle}>Selecciona una pregunta para cargarla.</p>
          )}
        </section>

        {selectedQuestion && (
          <section style={panelStyle}>
            <h2 style={sectionTitleStyle}>Revelar respuestas</h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '12px',
              }}
            >
              {selectedQuestion.respuestas.map((answer, index) => {
                const isRevealed = revealedAnswerIndexes.includes(index);

                return (
                  <button
                    key={answer.id}
                    type="button"
                    onClick={() => handleRevealAnswer(index)}
                    disabled={isRevealed}
                    style={{
                      minHeight: '96px',
                      borderRadius: '20px',
                      padding: '16px',
                      background: isRevealed
                        ? 'rgba(255, 255, 255, 0.18)'
                        : 'rgba(253, 197, 51, 0.96)',
                      color: isRevealed ? '#ffffff' : '#1d1d1b',
                      cursor: isRevealed ? 'not-allowed' : 'pointer',
                      opacity: isRevealed ? 0.62 : 1,
                      display: 'grid',
                      gap: '8px',
                      textAlign: 'left',
                      boxShadow: isRevealed
                        ? 'none'
                        : '0 14px 28px rgba(0, 0, 0, 0.22)',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-title)',
                        fontSize: '1.25rem',
                      }}
                    >
                      Respuesta {index + 1} · {answer.puntaje} puntos
                    </span>

                    <span
                      style={{
                        fontSize: '0.98rem',
                        lineHeight: 1.35,
                      }}
                    >
                      {answer.respuesta}
                    </span>

                    {isRevealed && (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '0.9rem',
                        }}
                      >
                        <Eye size={16} />
                        Ya revelada
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        )}
        <section style={panelStyle}>
        <h2 style={sectionTitleStyle}>Turno y puntos</h2>

        <div style={buttonGridStyle}>
            <AppButton
            variant="danger"
            onClick={() =>
                sendGameEvent({
                type: 'SET_ACTIVE_TEAM',
                payload: {
                    team: 'red',
                    text: 'Turno del equipo rojo',
                },
                })
            }
            >
            Turno equipo rojo
            </AppButton>

            <AppButton
            variant="success"
            onClick={() =>
                sendGameEvent({
                type: 'SET_ACTIVE_TEAM',
                payload: {
                    team: 'green',
                    text: 'Turno del equipo verde',
                },
                })
            }
            >
            Turno equipo verde
            </AppButton>

            <AppButton
            variant="danger"
            onClick={() =>
                sendGameEvent({
                type: 'AWARD_ROUND_POINTS',
                payload: {
                    team: 'red',
                },
                })
            }
            >
            Puntos para equipo rojo
            </AppButton>

            <AppButton
            variant="success"
            onClick={() =>
                sendGameEvent({
                type: 'AWARD_ROUND_POINTS',
                payload: {
                    team: 'green',
                },
                })
            }
            >
            Puntos para equipo verde
            </AppButton>

            <AppButton
            variant="secondary"
            onClick={() =>
                sendGameEvent({
                type: 'RESET_ROUND',
                })
            }
            >
            Limpiar ronda
            </AppButton>
        </div>
        </section>
        <section style={panelStyle}>
          <h2 style={sectionTitleStyle}>Overlays</h2>

          <div style={buttonGridStyle}>
            <AppButton
              variant="danger"
              onClick={() =>
                sendGameEvent({
                  type: 'SHOW_OVERLAY',
                  payload: {
                    overlayType: 'wrong-answer',
                    text: 'Respuesta incorrecta',
                  },
                })
              }
            >
              <span style={inlineIconStyle}>
                <X size={22} />
                Incorrecta
              </span>
            </AppButton>

            <AppButton
              variant="danger"
              onClick={() =>
                sendGameEvent({
                  type: 'SHOW_OVERLAY',
                  payload: {
                    overlayType: 'strike-1',
                    text: 'Primer strike',
                  },
                })
              }
            >
              Strike 1
            </AppButton>

            <AppButton
              variant="danger"
              onClick={() =>
                sendGameEvent({
                  type: 'SHOW_OVERLAY',
                  payload: {
                    overlayType: 'strike-2',
                    text: 'Segundo strike',
                  },
                })
              }
            >
              Strike 2
            </AppButton>

            <AppButton
              variant="danger"
              onClick={() =>
                sendGameEvent({
                  type: 'SHOW_OVERLAY',
                  payload: {
                    overlayType: 'strike-3',
                    text: 'Tercer strike',
                  },
                })
              }
            >
              Strike 3
            </AppButton>

            <AppButton
              variant="secondary"
              onClick={() =>
                sendGameEvent({
                  type: 'SHOW_OVERLAY',
                  payload: {
                    overlayType: 'steal-points',
                    text: 'Robo de puntos',
                  },
                })
              }
            >
              Robo de puntos
            </AppButton>

            <AppButton
              variant="success"
              onClick={() =>
                sendGameEvent({
                  type: 'SHOW_OVERLAY',
                  payload: {
                    overlayType: 'team-wins',
                    text: 'Equipo rojo gana',
                    teamColor: 'red',
                  },
                })
              }
            >
              Gana equipo rojo
            </AppButton>

            <AppButton
              variant="success"
              onClick={() =>
                sendGameEvent({
                  type: 'SHOW_OVERLAY',
                  payload: {
                    overlayType: 'team-wins',
                    text: 'Equipo verde gana',
                    teamColor: 'green',
                  },
                })
              }
            >
              Gana equipo verde
            </AppButton>

            <AppButton
              variant="secondary"
              onClick={() =>
                sendGameEvent({
                  type: 'CLEAR_OVERLAY',
                })
              }
            >
              Limpiar overlay
            </AppButton>
          </div>
        </section>

        <section style={panelStyle}>
          <h2 style={sectionTitleStyle}>Reinicio</h2>

          <div style={buttonGridStyle}>
            <AppButton variant="danger" onClick={handleResetBoard}>
              <span style={inlineIconStyle}>
                <RotateCcw size={22} />
                Resetear tablero
              </span>
            </AppButton>
          </div>
        </section>
      </section>
    </main>
  );
}

const cardStyle: CSSProperties = {
  minHeight: '190px',
  padding: '24px',
  borderRadius: '28px',
  background: 'rgba(255, 255, 255, 0.15)',
  border: '1px solid rgba(255, 255, 255, 0.22)',
  display: 'grid',
  gap: '12px',
  alignContent: 'start',
};

const cardTitleStyle: CSSProperties = {
  margin: 0,
  fontFamily: 'var(--font-title)',
  fontSize: '1.6rem',
};

const cardTextStyle: CSSProperties = {
  margin: 0,
  lineHeight: 1.5,
  opacity: 0.9,
};

const panelStyle: CSSProperties = {
  background: 'rgba(255, 255, 255, 0.15)',
  border: '1px solid rgba(255, 255, 255, 0.22)',
  borderRadius: '28px',
  padding: '24px',
  display: 'grid',
  gap: '16px',
};

const sectionTitleStyle: CSSProperties = {
  margin: 0,
  fontFamily: 'var(--font-title)',
  fontSize: '2rem',
};

const buttonGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '12px',
};

const inlineIconStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
};

const inputStyle: CSSProperties = {
  width: '100%',
  minHeight: '54px',
  borderRadius: '16px',
  border: '2px solid rgba(255, 255, 255, 0.42)',
  background: 'rgba(255, 255, 255, 0.94)',
  color: '#1d1d1b',
  padding: '0 16px',
  fontSize: '1rem',
  outline: 'none',
};