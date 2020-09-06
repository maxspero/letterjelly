import React from 'react';
import './App.css';

// boardgame.io dependencies
import { Client } from 'boardgame.io/react';
import { SocketIO } from 'boardgame.io/multiplayer'
// Local (debug) multiplayer
// import { Local } from 'boardgame.io/multiplayer';

// LetterJelly dependencies
import { TicTacToe } from './Game';
import { TicTacToeBoard } from './Board';


const TicTacToeClient = Client({ 
  game: TicTacToe,
  board: TicTacToeBoard,
  multiplayer: SocketIO({ server: 'localhost:8000' }),
});

const App = () => (
  <div>
    <TicTacToeClient playerID="0" />
    <TicTacToeClient playerID="1" />
  </div>
);

export default App;