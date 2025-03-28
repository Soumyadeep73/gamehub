import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Howl } from "howler";
import "../styles/rockpaperscissors.css";

import cc from "../assets/audio/click.mp3";
import win from "../assets/audio/win.mp3";
import draw from "../assets/audio/draw.mp3"; // ✅ NEW
import rps from "../assets/audio/rps-bg.mp3";

const bgMusic = new Howl({ src: [rps], loop: true, volume: 0.8 });
const clickSound = new Howl({ src: [cc], volume: 0.8 });
const winSound = new Howl({ src: [win], volume: 0.5 });
const drawSound = new Howl({ src: [draw], volume: 0.5 }); // ✅ NEW

const options = ["Rock", "Paper", "Scissors"];

export default function RockPaperScissors() {
  const navigate = useNavigate();
  const [playerChoice, setPlayerChoice] = useState(null);
  const [cpuChoice, setCpuChoice] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState({ player: 0, cpu: 0 });

  useEffect(() => {
    bgMusic.play();
    return () => bgMusic.stop();
  }, []);

  const play = (choice) => {
    clickSound.play();
    const cpu = options[Math.floor(Math.random() * 3)];
    setPlayerChoice(choice);
    setCpuChoice(cpu);

    const result = getResult(choice, cpu);
    setResult(result);

    if (result === "Player Wins") {
      setScore((prev) => ({ ...prev, player: prev.player + 1 }));
      winSound.play();
    } else if (result === "CPU Wins") {
      setScore((prev) => ({ ...prev, cpu: prev.cpu + 1 }));
    } else if (result === "Draw") {
      drawSound.play(); // ✅ Play draw sound
    }
  };

  const getResult = (player, cpu) => {
    if (player === cpu) return "Draw";
    if (
      (player === "Rock" && cpu === "Scissors") ||
      (player === "Paper" && cpu === "Rock") ||
      (player === "Scissors" && cpu === "Paper")
    ) {
      return "Player Wins";
    } else {
      return "CPU Wins";
    }
  };

  const handleReplay = () => {
    setPlayerChoice(null);
    setCpuChoice(null);
    setResult(null);
  };

  return (
    <div className="rps-container">
      <h2>Rock Paper Scissors</h2>
      <div className="rules-box">
  <h4>📜 Game Rules:</h4>
  <ul>
    <li>Click Rock, Paper, or Scissors to make your move.</li>
    <li>CPU will randomly choose its move.</li>
    <li>Rock beats Scissors, Scissors beats Paper, Paper beats Rock.</li>
    <li>Winning earns you 1 point. Draw earns none.</li>
    <li>Try to beat the CPU in score!</li>
  </ul>
</div>

      <div className="scoreboard">
        <span>Player: {score.player}</span>
        <span>CPU: {score.cpu}</span>
      </div>

      <div className="choices">
        {options.map((option) => (
          <button key={option} onClick={() => play(option)}>{option}</button>
        ))}
      </div>

      {result && (
        <div className="result">
          <p>You chose: <strong>{playerChoice}</strong></p>
          <p>CPU chose: <strong>{cpuChoice}</strong></p>
          <h3>{result}</h3>
          <button onClick={handleReplay}>Play Again</button>
        </div>
      )}

        <button onClick={() => navigate("/home")}>🏠 Home</button>
    </div>
  );
}
