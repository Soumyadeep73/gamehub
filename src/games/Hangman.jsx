import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Howl } from "howler";
import "../styles/hangman.css";
import bg from "../assets/audio/hangman-bg.mp3";
import winSoundFile from "../assets/audio/win.mp3";
import loseSoundFile from "../assets/audio/lose.mp3";
import cc from "../assets/audio/click.mp3";

const bgMusic = new Howl({ src: [bg], loop: true, volume: 0.5 });
const clickSound = new Howl({ src: [cc], volume: 0.8 });
const winSound = new Howl({ src: [winSoundFile], volume: 0.4 });
const loseSound = new Howl({ src: [loseSoundFile], volume: 0.4 });

// Word bank with categories and 3 hints each
const wordsData = [
  { word: "JAVASCRIPT", category: "Technical", hints: ["Used for web development", "Often used with HTML/CSS", "Popular scripting language"] },
  { word: "PYTHON", category: "Technical", hints: ["Snake name", "Popular in AI", "Easy syntax"] },
  { word: "REACT", category: "Technical", hints: ["Created by Meta", "Component-based", "JS library"] },
  { word: "ALGORITHM", category: "Technical", hints: ["Used in coding", "Step-by-step", "Essential for problem-solving"] },
  { word: "DEBUGGING", category: "Technical", hints: ["Fixing errors", "Used in development", "Like finding bugs"] },

  { word: "SONNET", category: "Poetic", hints: ["14-line poem", "Used by Shakespeare", "Often romantic"] },
  { word: "ODE", category: "Poetic", hints: ["Lyrical poem", "Shows admiration", "Often addresses subjects"] },
  { word: "METAPHOR", category: "Poetic", hints: ["Figure of speech", "Comparing without 'like/as'", "Common in poetry"] },
  { word: "RHYTHM", category: "Poetic", hints: ["Beat in poetry", "Also in music", "Used for flow"] },
  { word: "HAIKU", category: "Poetic", hints: ["Japanese origin", "3 lines", "5-7-5 syllables"] },

  { word: "NAPOLEON", category: "Historical", hints: ["French emperor", "Waterloo", "Short in height"] },
  { word: "REVOLUTION", category: "Historical", hints: ["Sudden change", "Often political", "Can be violent"] },
  { word: "PRESIDENT", category: "Historical", hints: ["Leader of a nation", "Elected", "Common in democracies"] },
  { word: "EMPIRE", category: "Historical", hints: ["Colonial rule", "British one", "Large territories"] },
  { word: "PYRAMIDS", category: "Historical", hints: ["Egypt", "Pharaohs", "Ancient tombs"] },

  { word: "EVEREST", category: "Geographical", hints: ["Highest peak", "Located in Asia", "Popular with climbers"] },
  { word: "SAHARA", category: "Geographical", hints: ["Largest hot desert", "Located in Africa", "Sand dunes"] },
  { word: "PACIFIC", category: "Geographical", hints: ["Largest ocean", "Ring of Fire", "Borders many continents"] },
  { word: "NILE", category: "Geographical", hints: ["Longest river", "In Africa", "Flows north"] },
  { word: "ATLANTIC", category: "Geographical", hints: ["Ocean", "Separates America & Europe", "Titanic sank here"] },

  { word: "DEMOCRACY", category: "Political", hints: ["Rule by people", "Voting", "Opposite of dictatorship"] },
  { word: "SENATE", category: "Political", hints: ["Part of parliament", "Exists in US", "Has senators"] },
  { word: "ELECTION", category: "Political", hints: ["Voting process", "Choose leaders", "Occurs every few years"] },
  { word: "PARLIAMENT", category: "Political", hints: ["Lawmakers", "UK system", "House of Commons"] },
  { word: "BUREAUCRACY", category: "Political", hints: ["Many rules", "Government system", "Slow decisions"] },

  { word: "RECYCLING", category: "Environmental", hints: ["Reuse waste", "Eco-friendly", "Plastic, paper"] },
  { word: "POLLUTION", category: "Environmental", hints: ["Dirty environment", "Air and water", "Harmful to health"] },
  { word: "GREENHOUSE", category: "Environmental", hints: ["Gas effect", "Global warming", "Traps heat"] },
  { word: "DEFORESTATION", category: "Environmental", hints: ["Cutting trees", "Affects wildlife", "Amazon issues"] },
  { word: "BIODIVERSITY", category: "Environmental", hints: ["Variety of life", "Ecosystem", "Species balance"] },

  { word: "ROMANCE", category: "Love", hints: ["Love story", "Feelings", "Often dramatic"] },
  { word: "HEART", category: "Love", hints: ["Organ", "Symbol of love", "Red and beating"] },
  { word: "HUG", category: "Love", hints: ["Gesture", "Warmth", "Between lovers or friends"] },
  { word: "VALENTINE", category: "Love", hints: ["February", "Love celebration", "Gifts and roses"] },
  { word: "KISS", category: "Love", hints: ["Lip action", "Shows affection", "Romantic"] },

  { word: "GALAXY", category: "Space", hints: ["Milky Way", "Star systems", "Huge and far"] },
  { word: "ASTEROID", category: "Space", hints: ["Rock in space", "Can hit Earth", "Orbit sun"] },
  { word: "ROCKET", category: "Space", hints: ["Launched to sky", "Used by NASA", "Has boosters"] },
  { word: "PLANET", category: "Space", hints: ["Orbits star", "Earth is one", "Part of solar system"] },
  { word: "NEBULA", category: "Space", hints: ["Space cloud", "Gas and dust", "Colorful"] },

  { word: "GENETICS", category: "Biology", hints: ["DNA study", "Traits", "Heredity"] },
  { word: "CELL", category: "Biology", hints: ["Basic unit", "All living things", "Microscopic"] },
  { word: "ENZYME", category: "Biology", hints: ["Protein", "Catalyst", "Helps reactions"] },
  { word: "VIRUS", category: "Biology", hints: ["Tiny microbe", "Causes disease", "COVID-19"] },
  { word: "BACTERIA", category: "Biology", hints: ["One cell", "Can be harmful or helpful", "Microorganism"] },

  { word: "GHOST", category: "Ghost", hints: ["Spirit", "Haunted house", "White floating figure"] },
  { word: "HAUNTED", category: "Ghost", hints: ["Spooky", "Ghost lives here", "Creepy"] },
  { word: "POSSESSED", category: "Ghost", hints: ["Controlled by spirit", "Exorcism", "Scary movies"] },
  { word: "SPIRIT", category: "Ghost", hints: ["Soul", "Afterlife", "Can haunt"] },
  { word: "EXORCISM", category: "Ghost", hints: ["Ghost removal", "Religious ritual", "Scary"] }
];

export default function Hangman() {
  const navigate = useNavigate();
  const [wordData, setWordData] = useState(null);
  const [guessed, setGuessed] = useState([]);
  const [wrong, setWrong] = useState([]);
  const [hintIndex, setHintIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const maxWrong = 6;

  const startGame = () => {
    const random = wordsData[Math.floor(Math.random() * wordsData.length)];
    setWordData(random);
    setGuessed([]);
    setWrong([]);
    setHintIndex(0);
    setScore(0);
    setShowHint(false);
  };

  useEffect(() => {
    startGame();
    bgMusic.play();
    return () => bgMusic.stop();
  }, []);

  const handleGuess = (letter) => {
    clickSound.play();
    if (guessed.includes(letter) || wrong.includes(letter) || !wordData) return;

    if (wordData.word.includes(letter)) {
      setGuessed((prev) => [...prev, letter]);
      const baseScore = 5 - hintIndex;
      setScore((prev) => prev + Math.max(baseScore, 2));
    } else {
      setWrong((prev) => [...prev, letter]);
    }
  };

  const giveHint = () => {
    if (hintIndex < 3) {
      setShowHint(true);
      setTimeout(() => setShowHint(false), 8000);
      setHintIndex((prev) => prev + 1);
    }
  };

  const isWinner = wordData?.word.split("").every((char) => guessed.includes(char));
  const isLoser = wrong.length >= maxWrong;

  useEffect(() => {
    if (isWinner) winSound.play();
    if (isLoser) loseSound.play();
  }, [isWinner, isLoser]);

  const renderWord = () =>
    wordData?.word.split("").map((char, idx) =>
      guessed.includes(char) ? (
        <span key={idx} className="letter">{char}</span>
      ) : (
        <span key={idx} className="letter">_</span>
      )
    );

  return (
    <div className="hangman-container">
      <h2>🪓 Hangman Game</h2>

      <div className="rules">
        <h3>📋 How to Play</h3>
        <ul>
          <li>Guess the letters of the hidden word.</li>
          <li>You can ask for up to 3 hints.</li>
          <li>Each correct letter earns points:</li>
          <li>+5 (0 hints), +4 (1 hint), +3 (2 hints), +2 (3 hints)</li>
          <li>Wrong guesses get 0 points.</li>
        </ul>
      </div>

      <p>❌ Wrong Guesses: {wrong.length}/{maxWrong}</p>
      <p>⭐ Score: {score}</p>

      <div className="hangman-word">{renderWord()}</div>

      <div className="hangman-letters">
        {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
          <button
            key={letter}
            disabled={guessed.includes(letter) || wrong.includes(letter) || isWinner || isLoser}
            onClick={() => handleGuess(letter)}
          >
            {letter}
          </button>
        ))}
      </div>

      <div className="btn-group">
        {hintIndex < 3 && (
          <button onClick={giveHint}>💡 Give Hint ({3 - hintIndex} left)</button>
        )}
        {(isWinner || isLoser) && <button onClick={startGame}>🔄 Play Again</button>}
        <button onClick={() => navigate("/home")}>🏠 Home</button>
      </div>

      {showHint && <div className="hint-popup">💡 Hint: {wordData?.hints[hintIndex-1]}</div>}

      {isWinner && <h3 className="win">🎉 You Win! Great job!</h3>}
      {isLoser && <h3 className="lose">💀 You Lose! The word was: {wordData.word}</h3>}
    </div>
  );
}

        