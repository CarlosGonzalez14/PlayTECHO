import { motion } from 'framer-motion';
import { Gamepad2, HelpCircle, Settings, Upload } from 'lucide-react';
import { AppButton } from '../shared/components/AppButton';

interface LauncherScreenProps {
  onLaunchGame: () => void;
  onOpenQuestionsManager: () => void;
}

export function LauncherScreen({
  onLaunchGame,
  onOpenQuestionsManager,
}: LauncherScreenProps) {
  return (
    <main
      className="app-shell"
      style={{
        display: 'grid',
        placeItems: 'center',
        padding: 'clamp(24px, 5vw, 64px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: '52vw',
          height: '52vw',
          maxWidth: '620px',
          maxHeight: '620px',
          borderRadius: '999px',
          background: 'rgba(255, 255, 255, 0.09)',
          filter: 'blur(2px)',
          top: '-18%',
          right: '-12%',
        }}
      />

      <div
        style={{
          position: 'absolute',
          width: '36vw',
          height: '36vw',
          maxWidth: '420px',
          maxHeight: '420px',
          borderRadius: '999px',
          background: 'rgba(253, 197, 51, 0.18)',
          bottom: '-14%',
          left: '-8%',
        }}
      />

      <section
        style={{
          width: 'min(760px, 100%)',
          display: 'grid',
          justifyItems: 'center',
          gap: '28px',
          zIndex: 1,
          textAlign: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.84, y: 28 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          style={{
            display: 'grid',
            gap: '10px',
          }}
        >
          <motion.h1
            animate={{
              rotate: [0, -1.2, 1.2, 0],
              scale: [1, 1.025, 1],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              repeatType: 'mirror',
              ease: 'easeInOut',
            }}
            style={{
              margin: 0,
              fontFamily: 'var(--font-title)',
              fontSize: 'clamp(4rem, 12vw, 9rem)',
              lineHeight: 0.86,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '-0.06em',
              textShadow: '0 12px 24px rgba(0, 0, 0, 0.28)',
            }}
          >
            PlayTECHO
          </motion.h1>

          <p
            style={{
              margin: 0,
              fontFamily: 'var(--font-accent)',
              fontSize: 'clamp(1.25rem, 3vw, 2.2rem)',
              color: '#fdc533',
              textShadow: '0 8px 18px rgba(0, 0, 0, 0.28)',
            }}
          >
            Juegos educativos tipo game-show
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.55 }}
          style={{
            width: 'min(420px, 100%)',
            display: 'grid',
            gap: '16px',
          }}
        >
          <AppButton fullWidth onClick={onLaunchGame}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
              <Gamepad2 size={24} />
              Lanzar juego
            </span>
          </AppButton>

          <AppButton fullWidth variant="secondary" onClick={onOpenQuestionsManager}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
              <Upload size={24} />
              Subir preguntas
            </span>
          </AppButton>

          <AppButton fullWidth variant="secondary">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
              <Settings size={24} />
              Configuración
            </span>
          </AppButton>

          <button
            type="button"
            style={{
              marginTop: '4px',
              background: 'transparent',
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              opacity: 0.86,
              fontSize: '0.95rem',
            }}
          >
            <HelpCircle size={18} />
            Ayuda
          </button>
        </motion.div>
      </section>
    </main>
  );
}