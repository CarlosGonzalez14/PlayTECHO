export function PublicGameWindowScreen() {
  return (
    <main
      className="app-shell"
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: 'clamp(24px, 5vw, 64px)',
        textAlign: 'center',
      }}
    >
      <section
        style={{
          width: 'min(900px, 100%)',
          display: 'grid',
          gap: '18px',
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--font-accent)',
            color: '#fdc533',
            fontSize: 'clamp(1.4rem, 4vw, 2.6rem)',
          }}
        >
          Ventana pública
        </p>

        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--font-title)',
            fontSize: 'clamp(4rem, 12vw, 9rem)',
            lineHeight: 0.9,
            textTransform: 'uppercase',
            textShadow: '0 14px 28px rgba(0, 0, 0, 0.28)',
          }}
        >
          100 Techeros Dijeron
        </h1>

        <p
          style={{
            margin: 0,
            fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
            lineHeight: 1.5,
            opacity: 0.92,
          }}
        >
          Esta será la pantalla proyectable para jugadores y público. Aquí construiremos el
          tablero, marcadores, pregunta, respuestas y overlays.
        </p>
      </section>
    </main>
  );
}