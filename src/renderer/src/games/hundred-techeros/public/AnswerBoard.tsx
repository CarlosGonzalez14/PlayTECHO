import { motion } from 'framer-motion';

interface RevealedAnswer {
  index: number;
  answer: string;
  score: number;
}

interface AnswerBoardProps {
  answerCount: number;
  revealedAnswers: RevealedAnswer[];
}

export function AnswerBoard({ answerCount, revealedAnswers }: AnswerBoardProps) {
  const totalSlots = answerCount > 0 ? answerCount : 10;

  return (
    <section
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(220px, 1fr))',
        gap: '14px',
        width: '100%',
      }}
    >
      {Array.from({ length: totalSlots }).map((_, index) => {
        const answerNumber = index + 1;
        const revealedAnswer = revealedAnswers.find((answer) => answer.index === answerNumber);

        return (
          <motion.article
            key={answerNumber}
            initial={false}
            animate={{
              rotateX: revealedAnswer ? 0 : 0,
              scale: revealedAnswer ? [1, 1.04, 1] : 1,
            }}
            transition={{
              duration: 0.28,
              ease: 'easeOut',
            }}
            style={{
              minHeight: '78px',
              borderRadius: '20px',
              background: revealedAnswer
                ? 'linear-gradient(135deg, #ffffff, #eaf6ff)'
                : 'linear-gradient(135deg, #005ca9, #003f74)',
              color: revealedAnswer ? '#1d1d1b' : '#ffffff',
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              alignItems: 'center',
              gap: '14px',
              padding: '12px 18px',
              border: revealedAnswer
                ? '3px solid rgba(253, 197, 51, 0.95)'
                : '3px solid rgba(255, 255, 255, 0.34)',
              boxShadow: '0 14px 28px rgba(0, 0, 0, 0.24)',
              overflow: 'hidden',
            }}
          >
            <strong
              style={{
                fontFamily: 'var(--font-title)',
                fontSize: 'clamp(1.3rem, 2.5vw, 2.25rem)',
                lineHeight: 1,
                textTransform: revealedAnswer ? 'uppercase' : 'none',
              }}
            >
              {revealedAnswer ? revealedAnswer.answer : answerNumber}
            </strong>

            <span
              style={{
                minWidth: '58px',
                height: '52px',
                borderRadius: '16px',
                background: revealedAnswer ? '#005ca9' : 'rgba(253, 197, 51, 0.95)',
                color: revealedAnswer ? '#ffffff' : '#1d1d1b',
                display: 'grid',
                placeItems: 'center',
                fontFamily: 'var(--font-title)',
                fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                lineHeight: 1,
              }}
            >
              {revealedAnswer ? revealedAnswer.score : ''}
            </span>
          </motion.article>
        );
      })}
    </section>
  );
}