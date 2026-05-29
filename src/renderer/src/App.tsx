import { fonts } from './shared/theme/fonts';

function App() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#0092DD',
        color: '#ffffff',
      }}
    >
      <section style={{ textAlign: 'center' }}>
        <h1
          style={{
            fontFamily: fonts.title,
            fontSize: '5rem',
            margin: 0,
          }}
        >
          PlayTECHO
        </h1>

        <h2
          style={{
            fontFamily: fonts.accent,
            fontSize: '2rem',
            marginTop: '1rem',
          }}
        >
          100 Techeros Dijeron
        </h2>

        <p
          style={{
            fontFamily: fonts.body,
            fontSize: '1.2rem',
            marginTop: '1rem',
          }}
        >
          Juego educativo de escritorio con React, Electron y SQLite.
        </p>

        <p
          style={{
            fontFamily: fonts.techopardy,
            fontSize: '1.8rem',
            marginTop: '1rem',
          }}
        >
          TECHOpardy
        </p>
      </section>
    </main>
  );
}

export default App;