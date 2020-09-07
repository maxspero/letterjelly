import React from 'react';
import './App.css';

// boardgame.io dependencies
import { Client } from 'boardgame.io/react';
import { SocketIO } from 'boardgame.io/multiplayer'
// Local (debug) multiplayer
// import { Local } from 'boardgame.io/multiplayer';

// LetterJelly dependencies
import { LetterJelly } from './Game';
import { LetterJellyBoard } from './Board';


const LetterJellyClient = Client({ 
  game: LetterJelly,
  board: LetterJellyBoard,
  // Local (debug) multiplayer
  // multiplayer: Local(),
  multiplayer: SocketIO({ server: 'localhost:8000' }),
});

const App = () => (
  <div>
    <LetterJellyClient playerID="0" />
    <LetterJellyClient playerID="1" />
  </div>
);

export default App;