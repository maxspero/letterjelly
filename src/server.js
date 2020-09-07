const { Server } = require('boardgame.io/server');
const { LetterJelly } = require('./Game');

const server = Server({ games: [LetterJelly] });

server.run(8000);