import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Howl } from "howler";
import "../styles/tictactoe.css";
import bgm from "../assets/audio/tictactoe-bg.mp3";
import cc from "../assets/audio/click.mp3";
import win from "../assets/audio/win.mp3";
import draw from "../assets/audio/draw.mp3";

// Sound Setup
const bgMusic = new Howl({ src: [bgm], loop: true, volume: 0.8 });
const clickSound = new Howl({ src: [cc], volume: 0.8 });
const winSound = new Howl({ src: [win], volume: 0.4 });
const loseSound = new Howl({ src: ["/assets/lose.mp3"], volume: 1 });
const drawSound = new Howl({ src: [draw], volume: 0.5 });

const winningCombos = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

export default function TicTacToe() {
  const navigate = useNavigate();
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isX, setIsX] = useState(true);
  const [winner, setWinner] = useState(null);
  const [score, setScore] = useState({ X: 0, O: 0 });
  const [isDisabled, setIsDisabled] = useState(false); // 👈 freeze board

  useEffect(() => {
    bgMusic.play();
    return () => bgMusic.stop();
  }, []);

  useEffect(() => {
    const win = checkWinner(board);

    if (win) {
      setIsDisabled(true); // Disable board while waiting
      setTimeout(() => {
        setWinner(win);
        if (win === "X" || win === "O") {
          winSound.play(); // Winner sound
          setScore((prev) => ({ ...prev, [win]: prev[win] + 1 }));
        }
        setIsDisabled(false);
      }, 1500); // Delay before announcing result
    } else if (!board.includes(null)) {
      setIsDisabled(true);
      setTimeout(() => {
        setWinner("Draw");
        drawSound.play();
        setIsDisabled(false);
      }, 1500);
    }
  }, [board]);

  const checkWinner = (squares) => {
    for (let [a, b, c] of winningCombos) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (idx) => {
    if (board[idx] || winner || isDisabled) return;
    const newBoard = board.slice();
    newBoard[idx] = isX ? "X" : "O";
    setBoard(newBoard);
    setIsX(!isX);
    clickSound.play();
  };

  const handleReplay = () => {
    setBoard(Array(9).fill(null));
    setIsX(true);
    setWinner(null);
  };

  return (
    <div className="ttt-container">
      <h2>Tic-Tac-Toe</h2>
      <div className="rules-box">
  <h4>📜 Game Rules:</h4>
  <ul>
    <li>The game is played on a 3x3 grid.</li>
    <li>Player X always goes first.</li>
    <li>Players take turns placing their symbol (X or O).</li>
    <li>The first player to get 3 of their symbols in a row (horizontally, vertically, or diagonally) wins.</li>
    <li>If all cells are filled and no one has won, it's a draw.</li>
  </ul>
</div>

      <div className="scoreboard">
        <span>Player X: {score.X}</span>
        <span>Player O: {score.O}</span>
      </div>

      <div className={`board ${isDisabled ? "disabled" : ""}`}>
        {board.map((val, idx) => (
          <div key={idx} className="cell" onClick={() => handleClick(idx)}>
            {val}
          </div>
        ))}
      </div>

      {winner && (
        <div className="result">
          <h3>{winner === "Draw" ? "It's a Draw!" : `Player ${winner} Wins!`}</h3>
          <button onClick={handleReplay}>Play Again</button>
        </div>
      )}

        <button onClick={() => navigate("/home")}>🏠 Home</button>
    </div>
  );
}
