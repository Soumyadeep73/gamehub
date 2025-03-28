import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import clickSound from "./assets/audio/click.mp3";
import { Howl } from "howler";
import "./styles/home.css";
import tictactoeimg from "./assets/image/tictactoe.png";
import hangman from "./assets/image/hangman.png";
import memory from "./assets/image/memorygame.png";
import rps from "./assets/image/rockpaperseciors.png";

export default function Home() {
  const navigate = useNavigate();
  const [lastGame, setLastGame] = useState("");
  const [soundOn, setSoundOn] = useState(true);
  const [click, setClick] = useState(null);

  useEffect(() => {
    const clickSoundInstance = new Howl({
      src: [clickSound],
      volume: soundOn ? 1 : 0,
    });
    setClick(clickSoundInstance);

    // Optional cleanup
    return () => {
      clickSoundInstance.unload();
    };
  }, [soundOn]);

  const handleClick = (path, name) => {
    if (click && soundOn) click.play();
    setLastGame(name);
    navigate(path);
  };

  const toggleSound = () => {
    setSoundOn((prev) => !prev);
  };

  const games = [
    { name: "Tic Tac Toe", img: tictactoeimg, path: "/tictactoe", color: "#00ffff" },
    { name: "Rock Paper Scissors", img: rps, path: "/rps", color: "#ff4081" },
    { name: "Memory Game", img: memory, path: "/memory", color: "#ffd740" },
    { name: "Hangman", img: hangman, path: "/hangman", color: "#7c4dff" },
  ];

  return (
    <div className="home-container">
      <h1 className="home-title">🎮 Game Hub</h1>

      <button className="sound-toggle" onClick={toggleSound}>
        {soundOn ? "🔊 Sound On" : "🔇 Sound Off"}
      </button>

      <div className="square-grid">
        {games.map((game, index) => (
          <div
            key={index}
            className="game-tile"
            style={{
              borderColor: game.color,
              boxShadow: `0 0 14px ${game.color}aa`,
            }}
            onClick={() => handleClick(game.path, game.name)}
          >
            <img src={game.img} alt={game.name} />
            <p>{game.name}</p>
          </div>
        ))}
      </div>

      {lastGame && (
        <p className="last-played">
          🎯 Last played: <strong>{lastGame}</strong>
        </p>
      )}
    </div>
  );
}
