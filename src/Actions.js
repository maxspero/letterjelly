import { INVALID_MOVE } from 'boardgame.io/core';

// state updates between phases
export function updateLetters(G, ctx) {
  console.log('updating letters');
  for (let i = 0; i < ctx.numPlayers; i++) {
    console.log(i + ': ' + G.letters[i][G.currentLetterIndex[i]]);
    G.currentLetter[i] = G.letters[i][G.currentLetterIndex[i]];
  }
}

// selectWords phase
// Temp fix: ask for playerNum, playerName to 
export function submitWord(G, ctx, word, playerName) {
  let player = ctx.playerID;
  // Set player name
  G.playerNames[player] = playerName;
  console.log(playerName + " (Player " + player + ") has submitted word " + word + ".");

  // check valid word 
  if (word.length !== G.wordLength) {
    console.log('Word length not valid for player ' + ctx.currentPlayer + 
                '. Expected word of length ' + G.wordLength + ' but got ' 
                + word.length + ' instead.');
    return INVALID_MOVE;
  }
  // TODO: check if character composition is valid, assign word to someone else at random
  G.words[player] = word;
  G.letters[player] = ctx.random.Shuffle(word.split(''));
  // Do this
  ctx.events.setActivePlayers({ all: 'selectWord', moveLimit: 1 });
}
        
// selectHinter phase
export function nominateSelfAsHinter(G, ctx) {
  // player = ctx.currentPlayer;
  let player = ctx.playerID;
  if (G.redHints[player] > 0) {
    G.redHints[player]--;
  }
  else if (G.greenHints > 0) {
    G.greenHints--;
  } else {
    return INVALID_MOVE;
  }
  G.hinter = player;
  console.log(player);
  ctx.events.endTurn({ next: player });
  // ctx.events.endPhase();
  // ctx.events.endTurn({ next: player });
}

// giveHints phase
export function hintPlayer(G, ctx, playerID) {
  G.currentHint.push(playerID);
}

export function undoHint(G, ctx) {
  console.log('undoHint!');
  return { ...G, currentHint: G.currentHint.slice(0, G.currentHint.length - 1)};
}
        
export function submitHints(G, ctx) {
  console.log('Submit Hint!');
  G.hintGiven = true;
}

// moveOnChoice phase
export function chooseToMoveOn(G, ctx, moveOn) {
  if (moveOn) {
    G.currentLetterIndex[ctx.playerID]++;
  }
  G.moveOnChosen[ctx.playerID] = true;
}

// guessWord phase
export function guess(G, ctx, guess) {
  G.guesses[ctx.currentPlayer] = guess;
}
