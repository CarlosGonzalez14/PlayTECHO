export type GameOverlayType =
  | 'wrong-answer'
  | 'strike-1'
  | 'strike-2'
  | 'strike-3'
  | 'steal-points'
  | 'team-wins';

export type TeamColor = 'red' | 'green' | 'yellow';

export type HundredTecherosGameEvent =
  | {
      type: 'SHOW_QUESTION';
      payload: {
        question: string;
        answerCount: number;
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
      type: 'AWARD_ROUND_POINTS';
      payload: {
        team: 'red' | 'green';
      };
    }
  | {
      type: 'SET_ACTIVE_TEAM';
      payload: {
        team: 'red' | 'green';
        text: string;
      };
    }
  | {
      type: 'SHOW_OVERLAY';
      payload: {
        overlayType: GameOverlayType;
        text?: string;
        teamColor?: TeamColor;
      };
    }
  | {
      type: 'CLEAR_OVERLAY';
    }
  | {
      type: 'RESET_ROUND';
    }
  | {
      type: 'RESET_BOARD';
    };