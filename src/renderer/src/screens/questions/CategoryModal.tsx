import { X } from 'lucide-react';
import { useState } from 'react';
import { AppButton } from '../../shared/components/AppButton';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCategory: (name: string) => void;
}

export function CategoryModal({ isOpen, onClose, onCreateCategory }: CategoryModalProps) {
  const [categoryName, setCategoryName] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleSubmit = () => {
    const cleanedName = categoryName.trim();

    if (!cleanedName) {
      alert('Escribe el nombre de la categoría.');
      return;
    }

    onCreateCategory(cleanedName);
    setCategoryName('');
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.62)',
        display: 'grid',
        placeItems: 'center',
        padding: '24px',
        zIndex: 100,
      }}
    >
      <section
        style={{
          width: 'min(520px, 100%)',
          background: '#ffffff',
          color: '#1d1d1b',
          borderRadius: '28px',
          padding: '28px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.35)',
          display: 'grid',
          gap: '20px',
        }}
      >
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontFamily: 'var(--font-title)',
              fontSize: '2rem',
              color: '#005ca9',
            }}
          >
            Nueva categoría
          </h2>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '999px',
              background: '#f2f2f2',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={22} />
          </button>
        </header>

        <label
          style={{
            display: 'grid',
            gap: '8px',
            fontWeight: 700,
          }}
        >
          Nombre de la categoría
          <input
            value={categoryName}
            onChange={(event) => setCategoryName(event.target.value)}
            placeholder="Ej. Cultura general"
            style={{
              width: '100%',
              minHeight: '52px',
              borderRadius: '16px',
              border: '2px solid #c6c6c6',
              padding: '0 16px',
              fontSize: '1rem',
              outline: 'none',
            }}
          />
        </label>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <AppButton variant="secondary" onClick={onClose}>
            Cancelar
          </AppButton>

          <AppButton onClick={handleSubmit}>Crear categoría</AppButton>
        </div>
      </section>
    </div>
  );
}