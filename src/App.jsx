import { BrowserRouter, Routes, Route } from "react-router-dom";
import SplashScreen from "./components/SplashScreen";
import Home from "./Home";
import TicTacToe from "./games/TicTacToe";
import RockPaperScissors from "./games/RockPaperScissors";
import MemoryGame from "./games/MemoryGame";
import Hangman from "./games/Hangman";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/home" element={<Home />} />
        <Route path="/tictactoe" element={<TicTacToe />} />
        <Route path="/rps" element={<RockPaperScissors />} />
        <Route path="/memory" element={<MemoryGame />} />
        <Route path="/hangman" element={<Hangman />} />
      </Routes>
    </BrowserRouter>
  );
}
