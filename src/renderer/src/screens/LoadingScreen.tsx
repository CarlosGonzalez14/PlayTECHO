import { motion } from 'framer-motion';

export function LoadingScreen() {
  return (
    <main
      className="app-shell"
      style={{
        display: 'grid',
        placeItems: 'center',
        padding: '32px',
      }}
    >
      <section
        style={{
          display: 'grid',
          justifyItems: 'center',
          gap: '24px',
          textAlign: 'center',
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.1,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            width: '88px',
            height: '88px',
            borderRadius: '999px',
            border: '10px solid rgba(255, 255, 255, 0.28)',
            borderTopColor: '#ffffff',
          }}
        />

        <div>
          <h1
            style={{
              margin: 0,
              fontFamily: 'var(--font-title)',
              fontSize: 'clamp(2rem, 6vw, 4rem)',
            }}
          >
            Cargando juego
          </h1>

          <p
            style={{
              margin: '8px 0 0',
              opacity: 0.86,
              fontSize: '1rem',
            }}
          >
            Preparando la experiencia PlayTECHO...
          </p>
        </div>
      </section>
    </main>
  );
}