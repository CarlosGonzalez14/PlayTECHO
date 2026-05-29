import { Monitor, RadioTower } from 'lucide-react';
import { AppButton } from '../shared/components/AppButton';

export function AdminGameWindowScreen() {
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
            Esta ventana será visible solo para el operador y/o presentador. Desde aquí se
            mostrarán preguntas, respuestas, strikes, puntajes y cambios de ronda.
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
              Aquí colocaremos los botones para revelar pregunta, revelar respuestas y
              administrar puntajes.
            </p>
          </article>

          <article style={cardStyle}>
            <RadioTower size={36} />
            <h2 style={cardTitleStyle}>Comunicación interna</h2>
            <p style={cardTextStyle}>
              Esta ventana enviará eventos a la ventana pública usando IPC.
            </p>
          </article>
        </section>

        <section
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.22)',
            borderRadius: '28px',
            padding: '24px',
            display: 'grid',
            gap: '16px',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontFamily: 'var(--font-title)',
              fontSize: '2rem',
            }}
          >
            Controles temporales
          </h2>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <AppButton variant="secondary">Mostrar pregunta</AppButton>
            <AppButton variant="warning">Revelar respuesta</AppButton>
            <AppButton variant="danger">Respuesta incorrecta</AppButton>
            <AppButton variant="success">Asignar puntos</AppButton>
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