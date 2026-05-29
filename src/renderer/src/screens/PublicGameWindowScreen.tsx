import { useEffect, useState } from 'react';
import { PublicBoard } from '../games/hundred-techeros/public/PublicBoard';
import type { HundredTecherosGameEvent } from '../shared/types/game-events.types';

interface RevealedAnswer {
  index: number;
  answer: string;
  score: number;
}

interface OverlayState {
  text: string;
  overlayType: string;
  teamColor?: 'red' | 'green' | 'yellow';
}

export function PublicGameWindowScreen() {
  const [question, setQuestion] = useState('Esperando pregunta...');
  const [answerCount, setAnswerCount] = useState(0);
  const [revealedAnswers, setRevealedAnswers] = useState<RevealedAnswer[]>([]);
  const [roundScore, setRoundScore] = useState(0);
  const [redTeamScore, setRedTeamScore] = useState(0);
  const [greenTeamScore, setGreenTeamScore] = useState(0);
  const [overlay, setOverlay] = useState<OverlayState | null>(null);
  const [activeTeamText, setActiveTeamText] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = window.playtecho.game.onEventFromAdmin(
      (gameEvent: HundredTecherosGameEvent) => {
        if (gameEvent.type === 'SHOW_QUESTION') {
          setQuestion(gameEvent.payload.question);
          setAnswerCount(gameEvent.payload.answerCount);
          setRevealedAnswers([]);
          setRoundScore(0);
          setOverlay(null);
          setActiveTeamText(null);
        }

        if (gameEvent.type === 'REVEAL_ANSWER') {
          setRevealedAnswers((currentAnswers) => {
            const alreadyExists = currentAnswers.some(
              (answer) => answer.index === gameEvent.payload.index
            );

            if (alreadyExists) {
              return currentAnswers;
            }

            setRoundScore((currentScore) => currentScore + gameEvent.payload.score);

            return [...currentAnswers, gameEvent.payload].sort((a, b) => a.index - b.index);
          });
        }

        if (gameEvent.type === 'AWARD_ROUND_POINTS') {
          if (gameEvent.payload.team === 'red') {
            setRedTeamScore((currentScore) => currentScore + roundScore);
            setOverlay({
              overlayType: 'team-wins',
              text: 'Equipo rojo gana',
              teamColor: 'red',
            });
          }

          if (gameEvent.payload.team === 'green') {
            setGreenTeamScore((currentScore) => currentScore + roundScore);
            setOverlay({
              overlayType: 'team-wins',
              text: 'Equipo verde gana',
              teamColor: 'green',
            });
          }
        }

        if (gameEvent.type === 'SET_ACTIVE_TEAM') {
          setActiveTeamText(gameEvent.payload.text);
        }

        if (gameEvent.type === 'SHOW_OVERLAY') {
          setOverlay({
            overlayType: gameEvent.payload.overlayType,
            text: gameEvent.payload.text ?? getDefaultOverlayText(gameEvent.payload.overlayType),
            teamColor: gameEvent.payload.teamColor,
          });
        }

        if (gameEvent.type === 'CLEAR_OVERLAY') {
          setOverlay(null);
        }

        if (gameEvent.type === 'RESET_ROUND') {
          setQuestion('Esperando pregunta...');
          setAnswerCount(0);
          setRevealedAnswers([]);
          setRoundScore(0);
          setOverlay(null);
          setActiveTeamText(null);
        }

        if (gameEvent.type === 'RESET_BOARD') {
          setQuestion('Esperando pregunta...');
          setAnswerCount(0);
          setRevealedAnswers([]);
          setRoundScore(0);
          setRedTeamScore(0);
          setGreenTeamScore(0);
          setOverlay(null);
          setActiveTeamText(null);
        }
      }
    );

    return unsubscribe;
  }, [roundScore]);

  return (
    <PublicBoard
      question={question}
      answerCount={answerCount}
      revealedAnswers={revealedAnswers}
      roundScore={roundScore}
      redTeamScore={redTeamScore}
      greenTeamScore={greenTeamScore}
      overlay={overlay}
      activeTeamText={activeTeamText}
    />
  );
}

function getDefaultOverlayText(overlayType: string) {
  if (overlayType === 'wrong-answer') {
    return 'Respuesta incorrecta';
  }

  if (overlayType === 'strike-1') {
    return 'Primer strike';
  }

  if (overlayType === 'strike-2') {
    return 'Segundo strike';
  }

  if (overlayType === 'strike-3') {
    return 'Tercer strike';
  }

  if (overlayType === 'steal-points') {
    return 'Robo de puntos';
  }

  if (overlayType === 'team-wins') {
    return 'Equipo gana';
  }

  return '';
}