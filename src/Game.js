import { INVALID_MOVE } from 'boardgame.io/core';
import * as actions from './Actions.js'; 


export const LetterJelly = {
  setup: (ctx) => ({ 
    cells: Array(ctx.numPlayers).fill(null),



  }),

  turn: {
    moveLimit: 1,
  },

  phases: {
    selectWords: {
      moves: {
        submitWord: actions.submitWord,
      },
      start: true
    },
    selectHinter: {
      moves: {
        nominateSelfAsHinter: actions.nominateSelfAsHinter,
      }
    },
    giveHints: {
      moves: {
        hintPlayer: actions.hintPlayer,
        undoHint: actions.undoHint,
        submitHints: actions.submitHints,
      }
    },
    moveOnChoice: {
      moves: {
        chooseToMoveOn: actions.chooseToMoveOn,
      }
    },
    guessWord: {
      moves: {
        assignGuesses: actions.assignGuesses,
      }
    },
  },

  endIf: (G, ctx) => {
    if (IsVictory(G.cells)) {
      return { winner: ctx.currentPlayer };
    }
    if (IsDraw(G.cells)) {
      return { draw: true };
    }
  },

  // Remove secrets and also information about themselves
  // playerview: (g, ctx, playerid) => {
  //   let r = { ...G }; if (r.secret !== undefined) {
  //     delete r.secret;
  //   }
  //   if (r.players[playerID] !== undefined) {
  //     delete r.players[playerID];
  //   }
  //   return r;
  // },
};

// Return true if `cells` is in a winning configuration.
function IsVictory(cells) {
  const positions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
    [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
  ];

  const isRowComplete = row => {
    const symbols = row.map(i => cells[i]);
    return symbols.every(i => i !== null && i === symbols[0]);
  };

  return positions.map(isRowComplete).some(i => i === true);
}

// Return true if all `cells` are occupied.
function IsDraw(cells) {
  return cells.filter(c => c === null).length === 0;
}