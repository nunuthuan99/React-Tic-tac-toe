import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import classNames from 'classnames'


function Square(props) {
  return (
    <button
      id = {"square-" + props.id}
      onClick = { props.onClick }
      className ="square"
    >
      {props.value}
    </button>
  );
}


class Board extends React.Component {
  renderSquare(i) {
    return (<Square
              key = {i}
              id = {i}
              value = {this.props.squares[i]}
              onClick = { () => this.props.onClick(i) }
           />);
  } 

  render() {
    const boardSize = 3;
    let squares = [];
    for (let i = 0; i < boardSize; ++i) {
      let row = [];
      for (let j = 0; j < boardSize; ++j) row.push(this.renderSquare(i * boardSize + j));
      squares.push(<div key={i} className="board-row">{row}</div>);
    }
    return ( <div>{squares}</div> );
  }
}


class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      history: [{squares: Array(9).fill(null), }],
      stepNumber: 0,
      xIsNext: true,
      toggleSortDes: false, // toggle button that sorting the moves in either ascending or descending order. Sorted by ascending by default.
    }
  }

  // for clicking on the matrix board.
  handleClick = (i) => { // a callback
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice(); // copy array
    if (calculateWinner(squares)[0] || squares[i]) return; // check last step: win or click the square which is clicked

    squares[i] = this.state.xIsNext ? "X" : "O";
    document.getElementById("square-" + i).classList.remove("square-X", "square-O");
    document.getElementById("square-" + i).classList.add("square-" + squares[i]); // add css for square that is clicked

    this.setState({
      history: history.concat( [{squares: squares}] ), // change 'history' variable
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) { // jump to that step but not change 'history' variable
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }
  
  // for toggleSortButton
  handleClickButton() {
    this.setState({
      toggleSortDes: !this.state.toggleSortDes,
    })
  }


  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares)[0];
    let status;

    // create list of moves buttons and handle them
    var moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + ': ' + calculateRowColumn(history[move - 1].squares, history[move].squares) :
        'Go to game start';
      return (
        <li key = {move}>
          <button className = "btn" onClick={() => {this.jumpTo(move);}}> {desc} </button>
        </li>
      );
    });
    if (this.state.toggleSortDes) 
      moves = moves.reverse()

    // handle 'status'
    if (winner) {
      status = 'Winner: ' + winner;

      for (let i = 0; i < 3; i++)  { // add class for which lines get win.
        document.getElementById("square-" + calculateWinner(current.squares)[1][i]).classList.remove("square-X", "square-O");
        document.getElementById("square-" + calculateWinner(current.squares)[1][i]).classList.add("square-win");
      }
    } else {
        if (this.state.stepNumber === 9) status = 'No one win !';
        if (this.state.stepNumber !== 9) status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');  

        // if we have a winner and we want to get back by step. Remove/add css class line win.
        let listSquareWin = document.querySelectorAll(".square-win") 
        for (let i = 0; i < listSquareWin.length; i++) {
          listSquareWin[i].classList.remove("square-win");
          if (listSquareWin[i].textContent === "X") listSquareWin[i].classList.add("square-X");
          else if (listSquareWin[i].textContent === "O") listSquareWin[i].classList.add("square-O");
        };
    }
    
    // create a button to sort list of moves by ascending/descending
    let toggleSortButton = (<button 
                            onClick = { () => this.handleClickButton() }
                            id="button-toggle-sort"
                          > {this.state.toggleSortDes ? "Sort by ascending" : "Sort by descending"} </button>)

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares = {current.squares} 
            onClick = {this.handleClick}
          />
        </div>
        <div className="game-info">
          <div id="div-status">
            {status} 
            {toggleSortButton}
          </div>
          <ul>{moves}</ul>
        </div>
      </div>
    );
  }
}


function calculateWinner(squares) {
  "To calculate a winner in this step (in this 'squares' array.)"
  "Return a array with 2 elements."
  "First element: 'X' if X is a winner, same to 'Y'. 'null' if no one wins in this step."
  "Second element: an array that caused the win. Or a empty array if no one wins in this step."
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
    [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return [null, []];
}
function calculateRowColumn(prev, curr) {
  const matrix = [
    [1, 1], [1, 2], [1, 3],
    [2, 1], [2, 2], [2, 3],
    [3, 1], [3, 2], [3, 3],
  ]
  let i;
  for (i = 0; i < 9; i++)
    if (prev[i] !== curr[i]) break;
  return 'index: [' + matrix[i][0] + ', ' + matrix[i][1] + ']';
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

