import type { ReactNode } from 'react';

type AppButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning';

interface AppButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: AppButtonVariant;
  disabled?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<AppButtonVariant, React.CSSProperties> = {
  primary: {
    background: '#ffffff',
    color: '#005ca9',
  },
  secondary: {
    background: 'rgba(255, 255, 255, 0.18)',
    color: '#ffffff',
    border: '2px solid rgba(255, 255, 255, 0.55)',
  },
  danger: {
    background: '#e94362',
    color: '#ffffff',
  },
  success: {
    background: '#2fac66',
    color: '#ffffff',
  },
  warning: {
    background: '#fdc533',
    color: '#1d1d1b',
  },
};

export function AppButton({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  fullWidth = false,
}: AppButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        width: fullWidth ? '100%' : 'auto',
        minHeight: '56px',
        padding: '0 28px',
        borderRadius: '999px',
        fontFamily: 'var(--font-title)',
        fontSize: 'clamp(1rem, 2vw, 1.25rem)',
        fontWeight: 700,
        letterSpacing: '0.02em',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.55 : 1,
        boxShadow: disabled ? 'none' : '0 14px 28px rgba(0, 0, 0, 0.22)',
        transform: 'translateY(0)',
        transition: 'transform 160ms ease, box-shadow 160ms ease, opacity 160ms ease',
        ...variantStyles[variant],
      }}
      onMouseEnter={(event) => {
        if (!disabled) {
          event.currentTarget.style.transform = 'translateY(-2px)';
          event.currentTarget.style.boxShadow = '0 18px 34px rgba(0, 0, 0, 0.26)';
        }
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.transform = 'translateY(0)';
        event.currentTarget.style.boxShadow = disabled
          ? 'none'
          : '0 14px 28px rgba(0, 0, 0, 0.22)';
      }}
    >
      {children}
    </button>
  );
}