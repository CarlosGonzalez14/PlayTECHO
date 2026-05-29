import { AnimatePresence } from 'framer-motion';
import { AnswerBoard } from './AnswerBoard';
import { GameOverlay } from './GameOverlay';
import { QuestionDisplay } from './QuestionDisplay';
import { Scoreboard } from './Scoreboard';

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

interface PublicBoardProps {
  question: string;
  answerCount: number;
  revealedAnswers: RevealedAnswer[];
  roundScore: number;
  redTeamScore: number;
  greenTeamScore: number;
  overlay: OverlayState | null;
  activeTeamText: string | null;
}

export function PublicBoard({
  question,
  answerCount,
  revealedAnswers,
  roundScore,
  redTeamScore,
  greenTeamScore,
  overlay,
  activeTeamText,
}: PublicBoardProps) {
  return (
    <main
      className="app-shell"
      style={{
        minHeight: '100vh',
        padding: 'clamp(16px, 2.8vw, 42px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <AnimatePresence>
        {overlay && (
          <GameOverlay
            text={overlay.text}
            overlayType={overlay.overlayType}
            teamColor={overlay.teamColor}
          />
        )}
      </AnimatePresence>

      <div
        style={{
          position: 'absolute',
          inset: '16px',
          borderRadius: '38px',
          border: '5px solid rgba(253, 197, 51, 0.65)',
          pointerEvents: 'none',
          boxShadow: 'inset 0 0 40px rgba(255,255,255,0.18)',
        }}
      />

      <section
        style={{
          width: 'min(1280px, 100%)',
          minHeight: 'calc(100vh - clamp(32px, 5.6vw, 84px))',
          margin: '0 auto',
          display: 'grid',
          gridTemplateRows: 'auto auto 1fr auto',
          gap: '18px',
          alignContent: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <header
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(180px, 1fr) minmax(190px, 0.7fr) minmax(180px, 1fr)',
            gap: '16px',
            alignItems: 'center',
          }}
        >
          <Scoreboard label="Equipo rojo" score={redTeamScore} color="red" compact />

          <Scoreboard label="Ronda" score={roundScore} color="blue" compact />

          <Scoreboard label="Equipo verde" score={greenTeamScore} color="green" compact />
        </header>

        <section
          style={{
            textAlign: 'center',
            display: 'grid',
            gap: '4px',
          }}
        >
          <h1
            style={{
              margin: 0,
              fontFamily: 'var(--font-title)',
              fontSize: 'clamp(2.4rem, 5vw, 5rem)',
              lineHeight: 0.86,
              textTransform: 'uppercase',
              color: '#ffffff',
              textShadow: '0 14px 28px rgba(0, 0, 0, 0.28)',
            }}
          >
            100 Techeros Dijeron
          </h1>

          {activeTeamText && (
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--font-accent)',
                color: '#fdc533',
                fontSize: 'clamp(1.2rem, 3vw, 2rem)',
                textShadow: '0 8px 20px rgba(0, 0, 0, 0.26)',
              }}
            >
              {activeTeamText}
            </p>
          )}
        </section>

        <QuestionDisplay question={question} />

        <AnswerBoard answerCount={answerCount} revealedAnswers={revealedAnswers} />
      </section>
    </main>
  );
}