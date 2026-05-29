import { useState } from 'react';
import { LauncherScreen } from './screens/LauncherScreen';
import { LoadingScreen } from './screens/LoadingScreen';
import { QuestionsManagerScreen } from './screens/QuestionsManagerScreen';

type AppScreen = 'launcher' | 'loading' | 'questions-manager';

function App() {
  const [screen, setScreen] = useState<AppScreen>('launcher');

  const handleLaunchGame = () => {
    setScreen('loading');

    window.setTimeout(() => {
      console.log('Aquí abriremos la ventana pública y la ventana privada del juego.');
    }, 900);
  };

  if (screen === 'loading') {
    return <LoadingScreen />;
  }

  if (screen === 'questions-manager') {
    return <QuestionsManagerScreen onBack={() => setScreen('launcher')} />;
  }

  return (
    <LauncherScreen
      onLaunchGame={handleLaunchGame}
      onOpenQuestionsManager={() => setScreen('questions-manager')}
    />
  );
}

export default App;