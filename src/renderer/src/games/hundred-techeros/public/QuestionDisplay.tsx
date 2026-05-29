interface QuestionDisplayProps {
  question: string;
}

export function QuestionDisplay({ question }: QuestionDisplayProps) {
  return (
    <section
      style={{
        minHeight: '110px',
        borderRadius: '28px',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.96), rgba(230,244,255,0.96))',
        border: '4px solid rgba(253, 197, 51, 0.95)',
        boxShadow: '0 18px 34px rgba(0, 0, 0, 0.28)',
        padding: '18px clamp(18px, 4vw, 42px)',
        display: 'grid',
        placeItems: 'center',
        textAlign: 'center',
      }}
    >
      <h2
        style={{
          margin: 0,
          fontFamily: 'var(--font-title)',
          fontSize: 'clamp(1.8rem, 4.4vw, 4.2rem)',
          lineHeight: 0.98,
          color: '#005ca9',
          textTransform: 'uppercase',
        }}
      >
        {question}
      </h2>
    </section>
  );
}