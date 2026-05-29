import { Monitor, RadioTower, RotateCcw, X } from 'lucide-react';
import { useState } from 'react';
import { AppButton } from '../shared/components/AppButton';
import type { HundredTecherosGameEvent } from '../shared/types/game-events.types';

export function AdminGameWindowScreen() {
  const [lastAction, setLastAction] = useState('Aún no se ha enviado ningún evento.');

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
          width: 'min(1100px, 100%)',
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
              maxWidth: '760px',
              lineHeight: 1.5,
              opacity: 0.9,
            }}
          >
            Desde este panel ya podemos enviar eventos a la ventana pública.
          </p>
        </header>

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
          }}
        >
          <article style={cardStyle}>
            <Monitor size={36} />
            <h2 style={cardTitleStyle}>Control del tablero</h2>
            <p style={cardTextStyle}>
              Los botones de abajo envían eventos reales a la ventana pública.
            </p>
          </article>

          <article style={cardStyle}>
            <RadioTower size={36} />
            <h2 style={cardTitleStyle}>Última acción</h2>
            <p style={cardTextStyle}>{lastAction}</p>
          </article>
        </section>

        <section style={panelStyle}>
          <h2 style={sectionTitleStyle}>Pregunta y respuestas</h2>

          <div style={buttonGridStyle}>
            <AppButton
              variant="secondary"
              onClick={() =>
                sendGameEvent({
                  type: 'SHOW_QUESTION',
                  payload: {
                    question: 'Menciona algo que una familia necesita para vivir mejor',
                  },
                })
              }
            >
              Mostrar pregunta
            </AppButton>

            <AppButton
              variant="warning"
              onClick={() =>
                sendGameEvent({
                  type: 'REVEAL_ANSWER',
                  payload: {
                    index: 1,
                    answer: 'Vivienda digna',
                    score: 35,
                  },
                })
              }
            >
              Revelar respuesta 1
            </AppButton>

            <AppButton
              variant="warning"
              onClick={() =>
                sendGameEvent({
                  type: 'REVEAL_ANSWER',
                  payload: {
                    index: 2,
                    answer: 'Agua potable',
                    score: 25,
                  },
                })
              }
            >
              Revelar respuesta 2
            </AppButton>

            <AppButton
              variant="warning"
              onClick={() =>
                sendGameEvent({
                  type: 'REVEAL_ANSWER',
                  payload: {
                    index: 3,
                    answer: 'Electricidad',
                    score: 20,
                  },
                })
              }
            >
              Revelar respuesta 3
            </AppButton>
          </div>
        </section>

        <section style={panelStyle}>
          <h2 style={sectionTitleStyle}>Overlays temporales</h2>

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
            <AppButton
              variant="danger"
              onClick={() =>
                sendGameEvent({
                  type: 'RESET_BOARD',
                })
              }
            >
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

const cardStyle: React.CSSProperties = {
  minHeight: '190px',
  padding: '24px',
  borderRadius: '28px',
  background: 'rgba(255, 255, 255, 0.15)',
  border: '1px solid rgba(255, 255, 255, 0.22)',
  display: 'grid',
  gap: '12px',
  alignContent: 'start',
};

const cardTitleStyle: React.CSSProperties = {
  margin: 0,
  fontFamily: 'var(--font-title)',
  fontSize: '1.6rem',
};

const cardTextStyle: React.CSSProperties = {
  margin: 0,
  lineHeight: 1.5,
  opacity: 0.9,
};

const panelStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.15)',
  border: '1px solid rgba(255, 255, 255, 0.22)',
  borderRadius: '28px',
  padding: '24px',
  display: 'grid',
  gap: '16px',
};

const sectionTitleStyle: React.CSSProperties = {
  margin: 0,
  fontFamily: 'var(--font-title)',
  fontSize: '2rem',
};

const buttonGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '12px',
};

const inlineIconStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '10px',
};