import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Howl } from "howler";
import splashMusic from "../assets/audio/splash.mp3";
import "../styles/splash.css";

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize Howl sound
    const music = new Howl({
      src: [splashMusic],
      volume: 1,
    });

    // Play music
    music.play();

    // Set fade-out to start after 5 seconds
    setTimeout(() => {
      music.fade(1, 0, 6000); // fade from volume 1 to 0 over 2 seconds
    }, 5000);

    // Navigate after 3 seconds
    const timer = setTimeout(() => {
      navigate("/home");
    }, 6000);

    // Cleanup
    return () => {
      music.stop(); // stop music if component unmounts early
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className="splash-container">
      <div className="splash-logo">
        <h1>🎮 Game Hub</h1>
        <p className="subtitle">Get Ready to Play!</p>
      </div>
    </div>
  );
}
