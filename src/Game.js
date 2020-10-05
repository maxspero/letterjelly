import { ActivePlayers } from 'boardgame.io/core';
import * as actions from './Actions.js'; 


export const LetterJelly = {
  name: 'LetterJelly',

  setup: (ctx) => ({ 
    wordLength: 5,
    words: Array(ctx.numPlayers).fill(null),
    letters: Array(ctx.numPlayers).fill(null),
    guesses: Array(ctx.numPlayers).fill(null),
    currentLetterIndex: Array(ctx.numPlayers).fill(0),
    currentLetter: Array(ctx.numPlayers).fill('~'),
    redHints: Array(ctx.numPlayers).fill(1),
    greenHints: 6,
    hinter: null,
    currentHint: [],
    hintHistory: [],
    hintGiven: false,
    moveOnChosen: Array(ctx.numPlayers).fill(false),
    playerNames: Array(ctx.numPlayers).fill(""),
  }),

  turn: {
    moveLimit: 1,
  },

  phases: {
    selectWords: {
      moves: {
        submitWord: actions.submitWord,
      },
      start: true,
      // End selectWords phase when all words are chosen
      endIf: G => (G.words.every(element => element != null)),
      next: 'selectHinter',
      turn: {
        activePlayers: ActivePlayers.ALL,
      },
    },
    selectHinter: {
      moves: {
        nominateSelfAsHinter: actions.nominateSelfAsHinter,
      },
      endIf: G => (G.hinter !== null),
      next: 'giveHints',
      onBegin: actions.updateLetters,
    },
    giveHints: {
      moves: {
        hintPlayer: actions.hintPlayer,
        undoHint: actions.undoHint,
        submitHints: actions.submitHints,
      },
      turn: {
        endIf: (G, ctx) => (G.hintGiven),
      },
      onBegin: (G, ctx) => {
        G.moveOnChosen.fill(false);
        G.hintGiven = false;
        G.currentHint = [];
        // let stages = {};
        // stages[G.hinter] = 'giveHints';
        // ctx.events.setActivePlayers({
        //   value: stages,
        //   moves: 500,
        // });
      },
      endIf: G => (G.hintGiven),
      next: 'moveOnPhase',
    },
    moveOnPhase: {
      moves: {
        chooseToMoveOn: actions.chooseToMoveOn,
      },
      turn: {
        activePlayers: ActivePlayers.ALL,
      },
      moves: {
        chooseToMoveOn: actions.chooseToMoveOn,
      },
      endIf: (G, ctx) => {
        if (G.moveOnChosen.every(e => e)) {
          return { next: G.greenHints === 0 ? 'guessWords' : 'selectHinter' }
        }
        return false;
      },
      turn: {
        activePlayers: ActivePlayers.ALL,
      },
      onBegin: (G, ctx) => {
        G.hintHistory.push(G.currentHint);
      },
    },
    guessWords: {
      moves: {
        assignGuesses: actions.guess,
      },
      turn: {
        activePlayers: ActivePlayers.ALL,
      },
    },
  },

  // endIf: (G, ctx) => {
  //   if (IsVictory(G.cells)) {
  //     return { winner: ctx.currentPlayer };
  //   }
  //   if (IsDraw(G.cells)) {
  //     return { draw: true };
  //   }
  // },

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
