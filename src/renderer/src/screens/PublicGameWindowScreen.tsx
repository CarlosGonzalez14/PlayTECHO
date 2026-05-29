import { useEffect, useState } from 'react';
import type { HundredTecherosGameEvent } from '../shared/types/game-events.types';

interface RevealedAnswer {
  index: number;
  answer: string;
  score: number;
}

interface OverlayState {
  text: string;
  overlayType: string;
  teamColor?: 'red' | 'green' | 'yellow';
}

export function PublicGameWindowScreen() {
  const [question, setQuestion] = useState('Esperando pregunta...');
  const [answerCount, setAnswerCount] = useState(0);
  const [revealedAnswers, setRevealedAnswers] = useState<RevealedAnswer[]>([]);
  const [overlay, setOverlay] = useState<OverlayState | null>(null);
  const [eventLog, setEventLog] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = window.playtecho.game.onEventFromAdmin(
      (gameEvent: HundredTecherosGameEvent) => {
        setEventLog((currentLog) => [
          `${new Date().toLocaleTimeString()} · ${gameEvent.type}`,
          ...currentLog.slice(0, 5),
        ]);

        if (gameEvent.type === 'SHOW_QUESTION') {
            setQuestion(gameEvent.payload.question);
            setAnswerCount(gameEvent.payload.answerCount);
            setRevealedAnswers([]);
            setOverlay(null);
        }

        if (gameEvent.type === 'REVEAL_ANSWER') {
          setRevealedAnswers((currentAnswers) => {
            const alreadyExists = currentAnswers.some(
              (answer) => answer.index === gameEvent.payload.index
            );

            if (alreadyExists) {
              return currentAnswers;
            }

            return [...currentAnswers, gameEvent.payload].sort((a, b) => a.index - b.index);
          });
        }

        if (gameEvent.type === 'SHOW_OVERLAY') {
          setOverlay({
            overlayType: gameEvent.payload.overlayType,
            text: gameEvent.payload.text ?? getDefaultOverlayText(gameEvent.payload.overlayType),
            teamColor: gameEvent.payload.teamColor,
          });
        }

        if (gameEvent.type === 'CLEAR_OVERLAY') {
          setOverlay(null);
        }

        if (gameEvent.type === 'RESET_BOARD') {
          setQuestion('Esperando pregunta...');
          setAnswerCount(0);
          setRevealedAnswers([]);
          setOverlay(null);
          setEventLog([]);
        }
      }
    );

    return unsubscribe;
  }, []);

  return (
    <main
      className="app-shell"
      style={{
        minHeight: '100vh',
        padding: 'clamp(20px, 4vw, 48px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {overlay && (
        <section
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            display: 'grid',
            placeItems: 'center',
            background: getOverlayBackground(overlay.teamColor),
            textAlign: 'center',
            padding: '32px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gap: '16px',
              justifyItems: 'center',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-title)',
                fontSize: 'clamp(6rem, 20vw, 16rem)',
                lineHeight: 0.8,
                color: overlay.overlayType.includes('strike') || overlay.overlayType === 'wrong-answer'
                  ? '#e94362'
                  : '#ffffff',
                textShadow: '0 18px 40px rgba(0, 0, 0, 0.45)',
              }}
            >
              {getOverlaySymbol(overlay.overlayType)}
            </div>

            <h2
              style={{
                margin: 0,
                fontFamily: 'var(--font-title)',
                fontSize: 'clamp(2.4rem, 7vw, 6rem)',
                textTransform: 'uppercase',
                textShadow: '0 12px 30px rgba(0, 0, 0, 0.45)',
              }}
            >
              {overlay.text}
            </h2>
          </div>
        </section>
      )}

      <section
        style={{
          width: 'min(1200px, 100%)',
          height: '100%',
          margin: '0 auto',
          display: 'grid',
          gap: '24px',
          alignContent: 'center',
        }}
      >
        <header
          style={{
            textAlign: 'center',
            display: 'grid',
            gap: '10px',
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: 'var(--font-accent)',
              color: '#fdc533',
              fontSize: 'clamp(1.3rem, 3vw, 2.4rem)',
            }}
          >
            Ventana pública
          </p>

          <h1
            style={{
              margin: 0,
              fontFamily: 'var(--font-title)',
              fontSize: 'clamp(3rem, 8vw, 7rem)',
              lineHeight: 0.9,
              textTransform: 'uppercase',
              textShadow: '0 14px 28px rgba(0, 0, 0, 0.28)',
            }}
          >
            100 Techeros Dijeron
          </h1>
        </header>

        <section
          style={{
            background: 'rgba(255, 255, 255, 0.16)',
            border: '1px solid rgba(255, 255, 255, 0.24)',
            borderRadius: '28px',
            padding: '24px',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              margin: 0,
              opacity: 0.86,
              fontWeight: 700,
            }}
          >
            Pregunta
          </p>

          <h2
            style={{
              margin: '8px 0 0',
              fontFamily: 'var(--font-title)',
              fontSize: 'clamp(1.8rem, 5vw, 4rem)',
              lineHeight: 1,
            }}
          >
            {question}
          </h2>
        </section>

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(220px, 1fr))',
            gap: '14px',
          }}
        >
          {Array.from({ length: answerCount > 0 ? answerCount : 10 }).map((_, index) => {
            const answerNumber = index + 1;
            const revealedAnswer = revealedAnswers.find(
              (answer) => answer.index === answerNumber
            );

            return (
              <article
                key={answerNumber}
                style={{
                  minHeight: '76px',
                  borderRadius: '18px',
                  background: revealedAnswer
                    ? 'rgba(255, 255, 255, 0.92)'
                    : 'rgba(0, 92, 169, 0.72)',
                  color: revealedAnswer ? '#1d1d1b' : '#ffffff',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 18px',
                  boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
                }}
              >
                <strong
                  style={{
                    fontFamily: 'var(--font-title)',
                    fontSize: 'clamp(1.2rem, 2.4vw, 2rem)',
                    textTransform: revealedAnswer ? 'uppercase' : 'none',
                  }}
                >
                  {revealedAnswer ? revealedAnswer.answer : answerNumber}
                </strong>

                <span
                  style={{
                    fontFamily: 'var(--font-title)',
                    fontSize: 'clamp(1.4rem, 3vw, 2.4rem)',
                    color: revealedAnswer ? '#005ca9' : '#fdc533',
                  }}
                >
                  {revealedAnswer ? revealedAnswer.score : ''}
                </span>
              </article>
            );
          })}
        </section>

        <aside
          style={{
            background: 'rgba(0, 0, 0, 0.18)',
            borderRadius: '18px',
            padding: '14px',
            fontSize: '0.9rem',
            opacity: 0.86,
          }}
        >
          <strong>Eventos recibidos:</strong>{' '}
          {eventLog.length === 0 ? 'ninguno todavía' : eventLog.join(' | ')}
        </aside>
      </section>
    </main>
  );
}

function getDefaultOverlayText(overlayType: string) {
  if (overlayType === 'wrong-answer') {
    return 'Respuesta incorrecta';
  }

  if (overlayType === 'strike-1') {
    return 'Primer strike';
  }

  if (overlayType === 'strike-2') {
    return 'Segundo strike';
  }

  if (overlayType === 'strike-3') {
    return 'Tercer strike';
  }

  if (overlayType === 'steal-points') {
    return 'Robo de puntos';
  }

  if (overlayType === 'team-wins') {
    return 'Equipo gana';
  }

  return '';
}

function getOverlaySymbol(overlayType: string) {
  if (overlayType === 'strike-1') {
    return 'X';
  }

  if (overlayType === 'strike-2') {
    return 'XX';
  }

  if (overlayType === 'strike-3') {
    return 'XXX';
  }

  if (overlayType === 'wrong-answer') {
    return '✕';
  }

  if (overlayType === 'steal-points') {
    return '!';
  }

  if (overlayType === 'team-wins') {
    return '★';
  }

  return '';
}

function getOverlayBackground(teamColor?: 'red' | 'green' | 'yellow') {
  if (teamColor === 'red') {
    return 'linear-gradient(90deg, rgba(233, 67, 98, 0.95), rgba(0, 0, 0, 0.72))';
  }

  if (teamColor === 'green') {
    return 'linear-gradient(90deg, rgba(47, 172, 102, 0.95), rgba(0, 0, 0, 0.72))';
  }

  if (teamColor === 'yellow') {
    return 'linear-gradient(90deg, rgba(253, 197, 51, 0.95), rgba(0, 0, 0, 0.72))';
  }

  return 'rgba(0, 0, 0, 0.72)';
}