import React, { useState } from 'react';
import './App.css';

/**
 * Returns the winner ("X" or "O") or "draw" or null.
 * @param {Array} squares
 * @returns {string|null}
 */
// PUBLIC_INTERFACE
function calculateWinner(squares) {
  /** This is a public function, used for win/draw detection. */
  const lines = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // columns
    [0,4,8],[2,4,6] // diagonals
  ];
  for (let i=0;i<lines.length;i++) {
    const [a,b,c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  // Check for draw (no empty squares)
  if (squares.every(Boolean)) return 'draw';
  return null;
}

// PUBLIC_INTERFACE
function App() {
  /** Main interactive Tic Tac Toe game */
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  // minimal session (reload = reset): just store in React state
  const [score, setScore] = useState({ X: 0, O: 0, draw: 0 });

  // Handle move
  const handleSquareClick = (i) => {
    if (board[i] || gameOver) return; // ignore if occupied or finished
    const newBoard = board.slice();
    newBoard[i] = xIsNext ? 'X' : 'O';
    const result = calculateWinner(newBoard);
    if (result) {
      setWinner(result);
      setGameOver(true);
      if (result === 'draw') {
        setScore({ ...score, draw: score.draw + 1 });
      } else {
        setScore({ ...score, [result]: score[result] + 1 });
      }
    }
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  // Start new game
  // PUBLIC_INTERFACE
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
    setGameOver(false);
  };

  const currentStatus = () => {
    if (gameOver) {
      if (winner === 'draw') return "It's a draw!";
      return `Winner: ${winner}`;
    }
    return `Turn: ${xIsNext ? 'X' : 'O'}`;
  };

  return (
    <div className="App ttt-app-bg">
      <div className="ttt-container">
        {/* STATUS BAR */}
        <div className="ttt-status-bar">
          <h2 className="ttt-status">{currentStatus()}</h2>
          <div className="ttt-scoreboard">
            <span className="ttt-score ttt-score-x">X: {score.X}</span>
            <span className="ttt-score ttt-score-o">O: {score.O}</span>
            <span className="ttt-score ttt-score-draw">Draws: {score.draw}</span>
          </div>
        </div>
        {/* BOARD */}
        <div className="ttt-board">
          {board.map((val, idx) => (
            <button
              key={idx}
              className="ttt-square"
              onClick={() => handleSquareClick(idx)}
              aria-label={`Square ${Math.floor(idx/3)+1}-${idx%3+1}, value: ${val || 'empty'}`}
              disabled={Boolean(board[idx]) || gameOver}
              style={val === 'X' ? {color: "var(--primary-color)"} : (val === 'O' ? {color: "var(--accent-color)"} : {})}
            >
              {val}
            </button>
          ))}
        </div>
        {/* CONTROL BUTTONS */}
        <div className="ttt-controls">
          <button className="ttt-btn-reset" onClick={resetGame}>
            Reset Game
          </button>
        </div>
        <div className="ttt-footer-msg">
          <span style={{fontSize: "12px", opacity: 0.45}}>Minimalistic tic tac toe. PvP. Session score. Light theme.</span>
        </div>
      </div>
    </div>
  );
}

export default App;
