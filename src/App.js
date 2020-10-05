import React from 'react';
import './App.css';

// boardgame.io dependencies
import { Client } from 'boardgame.io/react';
import { SocketIO } from 'boardgame.io/multiplayer'
import { Lobby } from 'boardgame.io/react';
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
  numPlayers: 4,
});

// Doesn't work: 
// const LetterJellyLobby = Lobby({
//   gameserver: 'localhost:8000',
//   lobbyserver: 'localhost:8000',
//   gameComponents: {
//     game: LetterJelly,
//     board: LetterJellyBoard,
//   }
// });

    /* Works:
    <Lobby 
      gameServer={'http://localhost:8000'}
      lobbyServer={'http://localhost:8000'}
      gameComponents={[
        { game: LetterJelly, board: LetterJellyBoard }
      ]}
    />
    */




const App = () => (
  <div>
    <LetterJellyClient playerID="0" playerName="max"/>
    <LetterJellyClient playerID="1" playerName="ecide"/>
    <LetterJellyClient playerID="2" playerName="evilcide"/>
    <LetterJellyClient playerID="3" playerName="masp"/>
  </div>
);


export default App;