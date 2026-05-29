import { ArrowLeft, FileDown, FileSpreadsheet, PlusCircle, Upload } from 'lucide-react';
import { AppButton } from '../shared/components/AppButton';

interface QuestionsManagerScreenProps {
  onBack: () => void;
}

export function QuestionsManagerScreen({ onBack }: QuestionsManagerScreenProps) {
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
          width: 'min(1100px, 100%)',
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
              Preguntas
            </h1>

            <p
              style={{
                margin: '8px 0 0',
                maxWidth: '720px',
                opacity: 0.9,
                lineHeight: 1.5,
              }}
            >
              Aquí construiremos el formulario para crear preguntas, importar desde Excel o
              CSV, descargar el machote y respaldar el banco de preguntas.
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
            gap: '18px',
          }}
        >
          <ActionCard
            icon={<PlusCircle size={34} />}
            title="Crear pregunta"
            description="Formulario manual con categoría, dificultad, respuestas y puntajes."
          />

          <ActionCard
            icon={<Upload size={34} />}
            title="Importar Excel/CSV"
            description="Carga masiva de preguntas desde un archivo externo."
          />

          <ActionCard
            icon={<FileSpreadsheet size={34} />}
            title="Descargar machote"
            description="Archivo guía para llenar preguntas con el formato correcto."
          />

          <ActionCard
            icon={<FileDown size={34} />}
            title="Respaldar preguntas"
            description="Exportación del banco de preguntas en Excel o CSV."
          />
        </section>
      </section>
    </main>
  );
}

interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function ActionCard({ icon, title, description }: ActionCardProps) {
  return (
    <article
      style={{
        minHeight: '210px',
        padding: '24px',
        borderRadius: '28px',
        background: 'rgba(255, 255, 255, 0.16)',
        border: '1px solid rgba(255, 255, 255, 0.22)',
        boxShadow: '0 18px 34px rgba(0, 0, 0, 0.16)',
        display: 'grid',
        alignContent: 'start',
        gap: '16px',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '22px',
          background: 'rgba(255, 255, 255, 0.18)',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        {icon}
      </div>

      <div>
        <h2
          style={{
            margin: 0,
            fontFamily: 'var(--font-title)',
            fontSize: '1.55rem',
          }}
        >
          {title}
        </h2>

        <p
          style={{
            margin: '8px 0 0',
            lineHeight: 1.45,
            opacity: 0.9,
          }}
        >
          {description}
        </p>
      </div>
    </article>
  );
}