import React, { useEffect, useState } from "react";
import "../styles/memorygame.css";
import { Howl } from "howler";
import bgMusicFile from "../assets/audio/memory-bg.mp3";
import winSoundFile from "../assets/audio/win.mp3";
import loseSoundFile from "../assets/audio/lose.mp3";
import { useNavigate } from "react-router-dom";

const allEmojis = [
  "🍎", "🍌", "🍇", "🍒", "🍉", "🍓", "🥝", "🍍", "🍑", "🥭",
  "🍔", "🌭", "🍕", "🍟", "🥪", "🍩", "🍪", "🎂", "🍿", "🥗"
];

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

export default function MemoryGame() {
  const [phase, setPhase] = useState("start"); // start, memorize, guess, result
  const [memorizeImages, setMemorizeImages] = useState([]);
  const [guessImages, setGuessImages] = useState([]);
  const [selected, setSelected] = useState([]);
  const [correct, setCorrect] = useState([]);
  const [timer, setTimer] = useState(0);
  const [score, setScore] = useState(0);
  const [bgMusic, setBgMusic] = useState(null);
  const navigate = useNavigate();

  // Initialize background music on mount
  useEffect(() => {
    const bg = new Howl({
      src: [bgMusicFile],
      loop: true,
      volume: 0.5,
    });
    setBgMusic(bg);

    return () => {
      if (bg) bg.stop(); // Clean up on unmount
    };
  }, []);

  const initializeGame = () => {
    const shuffled = shuffle(allEmojis);
    const memorized = shuffle(shuffled.slice(0, 12));
    const guessPool = shuffle([
      ...memorized.slice(0, 4),
      ...shuffled.slice(12, 16),
    ]).slice(0, 8);

    setMemorizeImages(memorized);
    setGuessImages(guessPool);
    setSelected([]);
    setCorrect([]);
    setScore(0);
  };

  const startGame = () => {
    initializeGame();
    setPhase("memorize");
    setTimer(10);
    if (bgMusic) {
      bgMusic.stop();
      bgMusic.play();
    }
  };

  useEffect(() => {
    if (timer <= 0) {
      if (phase === "memorize") {
        setPhase("guess");
        setTimer(10);
      } else if (phase === "guess") {
        finishGame();
      }
      return;
    }

    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer, phase]);

  const handleSelect = (emoji) => {
    if (phase !== "guess") return;
    setSelected((prev) =>
      prev.includes(emoji)
        ? prev.filter((e) => e !== emoji)
        : [...prev, emoji]
    );
  };

  const finishGame = () => {
    if (bgMusic) bgMusic.stop();

    const correctAnswers = guessImages.filter((img) =>
      memorizeImages.includes(img)
    );

    let score = 0;
    selected.forEach((img) => {
      if (correctAnswers.includes(img)) score += 2;
      else score -= 1;
    });

    const finalScore = Math.max(0, score);
    setCorrect(correctAnswers);
    setScore(finalScore);
    setPhase("result");

    // Play win/lose sound
    const winSound = new Howl({ src: [winSoundFile], volume: 1 });
    const loseSound = new Howl({ src: [loseSoundFile], volume: 1 });

    if (finalScore >= 4) winSound.play();
    else loseSound.play();
  };

  return (
    <div className="memory-container">
      <h1>🧠 Memory Challenge</h1>

      <div className="rules">
        <h3>📋 How to Play</h3>
        <ul>
          <li>🧠 You’ll see 12 random emojis to memorize in 10 seconds.</li>
          <li>🤔 Then you’ll be shown 8 emojis — choose the ones you saw before!</li>
          <li>✅ +2 point for a correct guess</li>
          <li>❌ -1 point for a wrong guess</li>
          <li>🎯 Max score: 8</li>
        </ul>
      </div>
      <div className="btn-group">
        <button onClick={() => navigate("/home")}>🏠 Home</button>
      </div>
      {phase === "start" && (
        <div className="btn-group">
          <button onClick={startGame}>▶️ Play Now</button>
        </div>
      )}

      {phase !== "start" && (
        <>
          <h2>Phase: {phase.toUpperCase()}</h2>
          <h3>⏱ Time Left: {timer}s</h3>
          
        </>
      )}

      {phase === "memorize" && (
        <div className="grid">
          {memorizeImages.map((img, i) => (
            <div key={i} className="card">{img}</div>
          ))}
        </div>
      )}

      {phase === "guess" && (
        <div className="grid">
          {guessImages.map((img, i) => (
            <div
              key={i}
              className={`card ${selected.includes(img) ? "selected" : ""}`}
              onClick={() => handleSelect(img)}
            >
              {img}
            </div>
          ))}
        </div>
      )}

      {phase === "result" && (
        <>
          <h2>✅ You scored: {score} / 8</h2>
          <div className="grid">
            {guessImages.map((img, i) => {
              const isCorrect = correct.includes(img);
              const wasSelected = selected.includes(img);
              let className = "card result";

              if (wasSelected && isCorrect) className += " correct";
              else if (wasSelected && !isCorrect) className += " wrong";
              else if (!wasSelected && isCorrect) className += " missed";

              return (
                <div key={i} className={className}>{img}</div>
              );
            })}
          </div>
          <div className="btn-group">
            <button onClick={startGame}>🔁 Play Again</button>
          </div>
        </>
      )}
    </div>
  );
}
