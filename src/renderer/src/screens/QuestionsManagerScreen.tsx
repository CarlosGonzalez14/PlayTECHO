import { ArrowLeft, FileDown, FileSpreadsheet, Upload } from 'lucide-react';
import { useState } from 'react';
import { AppButton } from '../shared/components/AppButton';
import type { Category, Question } from '../shared/types/question.types';
import { QuestionForm } from './questions/QuestionForm';

interface QuestionsManagerScreenProps {
  onBack: () => void;
}

const initialCategories: Category[] = [
  {
    id: 1,
    nombre: 'Cultura general',
  },
  {
    id: 2,
    nombre: 'TECHO',
  },
  {
    id: 3,
    nombre: 'Comunidad',
  },
];

export function QuestionsManagerScreen({ onBack }: QuestionsManagerScreenProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [savedQuestions, setSavedQuestions] = useState<Question[]>([]);

  const handleCreateCategory = (name: string): Category => {
    const existingCategory = categories.find(
      (category) => category.nombre.toLowerCase() === name.toLowerCase()
    );

    if (existingCategory) {
      alert('Esa categoría ya existe. Se seleccionará la categoría existente.');
      return existingCategory;
    }

    const newCategory: Category = {
      id: Date.now(),
      nombre: name,
    };

    setCategories((currentCategories) => [...currentCategories, newCategory]);

    return newCategory;
  };

  const handleSaveQuestion = (question: Question) => {
    setSavedQuestions((currentQuestions) => [...currentQuestions, question]);
    console.log('Pregunta lista para guardar en SQLite:', question);
  };

  return (
    <main
      className="app-shell"
      style={{
        padding: 'clamp(20px, 4vw, 48px)',
        overflow: 'auto',
      }}
    >
      <section
        style={{
          width: 'min(1180px, 100%)',
          margin: '0 auto',
          display: 'grid',
          gap: '28px',
        }}
      >
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontFamily: 'var(--font-title)',
                fontSize: 'clamp(2.4rem, 6vw, 5rem)',
                lineHeight: 0.95,
              }}
            >
              Banco de preguntas
            </h1>

            <p
              style={{
                margin: '8px 0 0',
                maxWidth: '760px',
                opacity: 0.9,
                lineHeight: 1.5,
              }}
            >
              Crea preguntas para los juegos de PlayTECHO. En este paso validamos la
              estructura antes de conectar el formulario con SQLite.
            </p>
          </div>

          <AppButton variant="secondary" onClick={onBack}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
              <ArrowLeft size={22} />
              Volver
            </span>
          </AppButton>
        </header>

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
          }}
        >
          <SmallActionCard
            icon={<Upload size={26} />}
            title="Importar Excel/CSV"
            description="Lo conectaremos después."
          />

          <SmallActionCard
            icon={<FileSpreadsheet size={26} />}
            title="Descargar machote"
            description="Pendiente para la fase de Excel."
          />

          <SmallActionCard
            icon={<FileDown size={26} />}
            title="Respaldar preguntas"
            description="Exportación pendiente."
          />

          <SmallActionCard
            title={`${savedQuestions.length}`}
            description="Preguntas validadas en esta sesión."
          />
        </section>

        <QuestionForm
          categories={categories}
          onCreateCategory={handleCreateCategory}
          onSaveQuestion={handleSaveQuestion}
        />
      </section>
    </main>
  );
}

interface SmallActionCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

function SmallActionCard({ icon, title, description }: SmallActionCardProps) {
  return (
    <article
      style={{
        minHeight: '132px',
        padding: '20px',
        borderRadius: '24px',
        background: 'rgba(255, 255, 255, 0.13)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        display: 'grid',
        gap: '10px',
        alignContent: 'start',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        {icon && (
          <span
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '14px',
              background: 'rgba(255, 255, 255, 0.18)',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            {icon}
          </span>
        )}

        <h2
          style={{
            margin: 0,
            fontFamily: 'var(--font-title)',
            fontSize: icon ? '1.25rem' : '2.2rem',
          }}
        >
          {title}
        </h2>
      </div>

      <p
        style={{
          margin: 0,
          opacity: 0.86,
          lineHeight: 1.4,
        }}
      >
        {description}
      </p>
    </article>
  );
}