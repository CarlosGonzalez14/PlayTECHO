export type GameOverlayType =
  | 'wrong-answer'
  | 'strike-1'
  | 'strike-2'
  | 'strike-3'
  | 'steal-points'
  | 'team-wins';

export type HundredTecherosGameEvent =
  | {
      type: 'SHOW_QUESTION';
      payload: {
        question: string;
      };
    }
  | {
      type: 'REVEAL_ANSWER';
      payload: {
        index: number;
        answer: string;
        score: number;
      };
    }
  | {
      type: 'SHOW_OVERLAY';
      payload: {
        overlayType: GameOverlayType;
        text?: string;
        teamColor?: 'red' | 'green' | 'yellow';
      };
    }
  | {
      type: 'CLEAR_OVERLAY';
    }
  | {
      type: 'RESET_BOARD';
    };