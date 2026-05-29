import { motion } from 'framer-motion';

interface GameOverlayProps {
  text: string;
  overlayType: string;
  teamColor?: 'red' | 'green' | 'yellow';
}

export function GameOverlay({ text, overlayType, teamColor }: GameOverlayProps) {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.22 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'grid',
        placeItems: 'center',
        background: getOverlayBackground(teamColor),
        textAlign: 'center',
        padding: '32px',
      }}
    >
      <div
        style={{
          display: 'grid',
          gap: '18px',
          justifyItems: 'center',
        }}
      >
        <motion.div
          initial={{ scale: 0.7, rotate: -8 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 16 }}
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: 'clamp(6rem, 20vw, 17rem)',
            lineHeight: 0.75,
            color:
              overlayType.includes('strike') || overlayType === 'wrong-answer'
                ? '#e94362'
                : '#ffffff',
            WebkitTextStroke: '5px rgba(255,255,255,0.35)',
            textShadow: '0 22px 48px rgba(0, 0, 0, 0.52)',
          }}
        >
          {getOverlaySymbol(overlayType)}
        </motion.div>

        <h2
          style={{
            margin: 0,
            fontFamily: 'var(--font-title)',
            fontSize: 'clamp(2.6rem, 7vw, 6.4rem)',
            lineHeight: 0.95,
            textTransform: 'uppercase',
            textShadow: '0 14px 32px rgba(0, 0, 0, 0.48)',
          }}
        >
          {text}
        </h2>
      </div>
    </motion.section>
  );
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
    return 'linear-gradient(90deg, rgba(233, 67, 98, 0.98), rgba(0, 0, 0, 0.76) 38%, rgba(0, 0, 0, 0.76))';
  }

  if (teamColor === 'green') {
    return 'linear-gradient(90deg, rgba(47, 172, 102, 0.98), rgba(0, 0, 0, 0.76) 38%, rgba(0, 0, 0, 0.76))';
  }

  if (teamColor === 'yellow') {
    return 'linear-gradient(90deg, rgba(253, 197, 51, 0.98), rgba(0, 0, 0, 0.76) 38%, rgba(0, 0, 0, 0.76))';
  }

  return 'rgba(0, 0, 0, 0.76)';
}