import { useEffect, useState } from 'react';
import { AdminGameWindowScreen } from './screens/AdminGameWindowScreen';
import { LauncherScreen } from './screens/LauncherScreen';
import { LoadingScreen } from './screens/LoadingScreen';
import { PublicGameWindowScreen } from './screens/PublicGameWindowScreen';
import { QuestionsManagerScreen } from './screens/QuestionsManagerScreen';

type AppScreen = 'launcher' | 'loading' | 'questions-manager';
type WindowRoute = 'launcher' | 'public-game' | 'admin-game';

function getWindowRoute(): WindowRoute {
  const hash = window.location.hash.replace('#/', '');

  if (hash === 'public-game') {
    return 'public-game';
  }

  if (hash === 'admin-game') {
    return 'admin-game';
  }

  return 'launcher';
}

function App() {
  const [windowRoute, setWindowRoute] = useState<WindowRoute>(() => getWindowRoute());
  const [screen, setScreen] = useState<AppScreen>('launcher');

  useEffect(() => {
    const handleHashChange = () => {
      setWindowRoute(getWindowRoute());
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleLaunchGame = async () => {
    try {
      setScreen('loading');
      await window.playtecho.windows.openHundredTecherosWindows();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'No se pudieron abrir las ventanas del juego.';

      alert(message);
      setScreen('launcher');
    }
  };

  if (windowRoute === 'public-game') {
    return <PublicGameWindowScreen />;
  }

  if (windowRoute === 'admin-game') {
    return <AdminGameWindowScreen />;
  }

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