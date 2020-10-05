import React from 'react';

export class LetterJellyBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.nominateSelf = this.nominateSelf.bind(this);
  }

  handleChange(event) {    this.setState({value: event.target.value});  }
  handleSubmit(event) {
    this.props.moves.submitWord(this.state.value, this.props.playerName);
    event.preventDefault();
  }

  onClick(id) {
    this.props.moves.hintPlayer(id);
  }

  nominateSelf() {
    this.props.moves.nominateSelfAsHinter();
  }

  render() {

    let playerIDNum = Number.parseInt(this.props.playerID);

    let winner = '';
    if (this.props.ctx.gameover) {
      winner =
        this.props.ctx.gameover.winner !== undefined ? (
          <div id="winner">Winner: {this.props.ctx.gameover.winner}</div>
        ) : (
          <div id="winner">Draw!</div>
        );
    }

    let wordForm = '';
    if (this.props.ctx.phase === 'selectWords') {
      wordForm = (
      <div id="wordform"> <form onSubmit={this.handleSubmit}>
          <label>
            Word:
          </label>
          <input type="text" value={this.state.value} onChange={this.handleChange} />
          <input type="submit" value="Submit" />
        </form>
      </div>);
    }

    let nominateButton = '';
    if (this.props.ctx.phase === 'selectHinter') {
      nominateButton = (
        <button onClick={this.nominateSelf}>  
          Give Next Hint 
        </button>
      );
    }

    let hinter = '';
    let undoButton = '';
    let submitButton = ''

    if (this.props.ctx.phase === 'mainPhase' && !this.props.G.hintGiven) {
      if (this.props.playerID === this.props.G.hinter) {
        hinter = "You are the hinter. Click on other player's cards to construct your hint."
        undoButton = (
          <button onClick={() => this.props.moves.undoHint()}>  
            Undo 
          </button>
        );
        submitButton = (
          <button onClick={() => this.props.moves.submitHints()}>  
            Submit Hints 
          </button>
        )
      }
      else {
        hinter = 'Waiting for player ' + this.props.G.hinter + ' to submit their hint.'
      }
    }

    let hintedWord = ''
    if (this.props.ctx.phase === 'mainPhase') {
      for (let i = 0; i < this.props.G.currentHint.length; i++) {
        let char = '';
        if (this.props.G.currentHint[i] === '*') {
          char = '*';
        } else if (this.props.G.currentHint[i] === playerIDNum) {
          char = '?'
        } else {
          char = this.props.G.currentLetter[Number.parseInt(this.props.G.currentHint[i])];
        }
        hintedWord += char;
      }
      hintedWord = 'Hinted word: ' + hintedWord
    }

    let keepLetterButton = '';
    let nextLetterButton = '';
    if (this.props.ctx.phase === 'mainPhase' && this.props.G.hintGiven && !this.props.G.moveOnChosen[playerIDNum]) {
      keepLetterButton = (
        <button onClick={() => this.props.moves.chooseToMoveOn(false)}>  
          Keep Letter 
        </button>
      );
      nextLetterButton = (
        <button onClick={() => this.props.moves.chooseToMoveOn(true)}>  
          Keep Letter 
        </button>
      );
    }

    const tableStyle = {
      tableLayout: 'fixed',
    };

    const nameStyle = {
      border: '0px',
      width: '50px',
      height: '50px',
      lineHeight: '50px',
      textAlign: 'center',
    };

    const letterStyle = {
      border: '1px solid #555',
      width: '50px',
      height: '50px',
      lineHeight: '50px',
      textAlign: 'center',
    };

    const hintCellStyle = {
      border: '0px',
      width: '50px',
      height: '25px',
      lineHeight: '25px',
    };

    function hintCircleStyle(num) {
      let colors = [
        'red',
        'orange',
        'yellow',
        'lime',
        'green',
        'blue',
        'purple',
        'black',
      ];
      return {
        backgroundColor: colors[Math.min(num, 7)],
        display: 'block',
        height: '25px',
        width: '25px',
        borderRadius: '50%',
        border: '2px solid #000',
        margin: 'auto',
        color: num < 4 ? 'black' : 'white',
        lineHeight: '25px',
        textAlign: 'center',
      };
    }

    let tbody = [];
    let names = [];
    let nameCells = [];
    let letterCells = [];
    // Self card 
    nameCells.push(
      <td style={nameStyle} key={this.props.playerID}>
        {this.props.playerName}
      </td>
    );
    letterCells.push(
      <td style={letterStyle} key={this.props.playerID}>
        ? ({this.props.G.currentLetterIndex[playerIDNum]})
      </td>
    );
    for (let i = 0; i < this.props.ctx.numPlayers; i++) {
      if (i !== playerIDNum) {
        nameCells.push(
          <td style={nameStyle} key={i}>
            {this.props.G.playerNames[i]}
          </td>
        );
        let cell = (
          <td style={letterStyle} key={i} onClick={() => this.onClick(i)}>
            {this.props.G.currentLetter[i]}
          </td>
        );
        letterCells.push(
          cell
        );
      }
    }
    // Wildcard
    nameCells.push(
      <td style={nameStyle} key={'*'}>
        Wildcard
      </td>
    );
    letterCells.push(
      <td style={letterStyle} key={'*'} onClick={() => this.onClick('*')}>
        *
      </td>
    );
    tbody.push(<tr key={0}>{nameCells}</tr>);
    tbody.push(<tr key={1}>{letterCells}</tr>);

    // Hint circles
    for (let i = 0; i < this.props.G.currentHint.length; i++) {
      let index = this.props.G.currentHint[i] === '*' ? this.props.ctx.numPlayers : this.props.G.currentHint[i];
      if (index === playerIDNum) {
        index = 0;
      } else if (index < playerIDNum) {
        index = index + 1;
      } // else index > playerIDNum: leave as is
      let row = [];
      for (let j = 0; j < this.props.ctx.numPlayers + 1; j++) {
        if (j === index) {
          row.push(
            <td key={j} style={hintCellStyle}>
              <span style={hintCircleStyle(i)}>
                {i+1}
              </span>
            </td>
          );
        } else {
          row.push(<td key={j}></td>);
        }
      }
      tbody.push(<tr key={i+2}>{row}</tr>);
    }

    return (
      <div>
        {winner}
        {wordForm}
        {nominateButton}
        <div> {hinter} </div>
        <div> {hintedWord} </div>
        <div>
          {undoButton}
          {submitButton}
        </div>
        <div>
          {keepLetterButton}
          {nextLetterButton}
        </div>
        <table id="board" style={tableStyle}>
          <tbody>{tbody}</tbody>
        </table>
      </div>
    );
  }
}