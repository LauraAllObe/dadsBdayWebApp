import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import confetti from 'canvas-confetti';
import './App.css';

const messages = [
  "It is Tuesday, July 15th...",
  "This is a very important day...",
  "How come?...",
  "*drum roll*",
  "Today commemorates the birthday of Ernst Georg Obermaier, the best dad ever!!",
  "HAPPY BIRTHDAY DAD!!!!!"
];

function App() {
  const [current, setCurrent] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [typing, setTyping] = useState(false);
  const textRef = useRef(null);
  const typingAudioRef = useRef(null);
  const drumrollRef = useRef(null);
  const [audioEnabled, setAudioEnabled] = useState(false);


  useEffect(() => {
    // Initial confetti rain
    confetti({
      particleCount: 100,
      spread: 360,
      origin: { y: 0 },
      startVelocity: 30,
      gravity: 0.5,
    });

    // No typing on load
  }, []);

  useEffect(() => {
    // Prime the audio element to reduce latency
    if (typingAudioRef.current) {
      typingAudioRef.current.load(); // ensures preload
    }
    if (drumrollRef.current) {
      drumrollRef.current.load();
    }
  }, []);

  const typeMessage = (message, playAudio = false) => {
    setTyping(true);
    setDisplayedText('');
    let i = 0;
    let currentText = '';

    const isDrumroll = message.trim().toLowerCase().includes("drum roll");

    if (drumrollRef.current) {
      drumrollRef.current.pause();
      drumrollRef.current.currentTime = 0;
    }

    if (typingAudioRef.current) {
      typingAudioRef.current.pause();
      typingAudioRef.current.currentTime = 0;
      typingAudioRef.current.loop = false;
    }

    setTimeout(() => {
      if (playAudio) {
        if (!isDrumroll && typingAudioRef.current) {
          typingAudioRef.current.loop = true;
          typingAudioRef.current.currentTime = 3;
          typingAudioRef.current.play().catch(() => {});
        } else if (isDrumroll && drumrollRef.current) {
          drumrollRef.current.currentTime = 3;
          drumrollRef.current.play().catch(() => {});
        }
      }
      
      const interval = setInterval(() => {
        currentText += message[i];
        setDisplayedText(currentText);
        i++;

        if (i >= message.length) {
          clearInterval(interval);
          setTyping(false);

          if (typingAudioRef.current) {
            typingAudioRef.current.pause();
            typingAudioRef.current.currentTime = 0;
            typingAudioRef.current.loop = false;
          }
        }
      }, 35);
    }, 500);
  };

  const handleTap = () => {
    if (!audioEnabled) {
      setAudioEnabled(true);

      // Unlock audio
      if (typingAudioRef.current) {
        typingAudioRef.current.play().then(() => {
          typingAudioRef.current.pause();
          typingAudioRef.current.currentTime = 0;
        }).catch(() => {});
      }

      if (drumrollRef.current) {
        drumrollRef.current.play().then(() => {
          drumrollRef.current.pause();
          drumrollRef.current.currentTime = 0;
        }).catch(() => {});
      }

      // ✅ Instead of relying on audioEnabled (which is stale), explicitly pass true
      typeMessage(messages[0], true);
      return;
    }

    if (typing) return;

    // Stop any audio
    if (drumrollRef.current) {
      drumrollRef.current.pause();
      drumrollRef.current.currentTime = 0;
    }

    if (typingAudioRef.current) {
      typingAudioRef.current.pause();
      typingAudioRef.current.currentTime = 0;
      typingAudioRef.current.loop = false;
    }

    if (current < messages.length - 1) {
      const next = current + 1;
      setCurrent(next);
      typeMessage(messages[next], true); // pass true for audio

      if (next === 4 || next === 5) {
        triggerConfettiBlast();
      }
    }
  };

  const triggerConfettiBlast = () => {
    confetti({
      particleCount: 300,
      spread: 90,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="App" onClick={handleTap}>
      <img src="/garland.PNG" alt="garland" className="garland" />
      <div className="cake-container">
        <img src="/table.png" className="table" />
      </div>
      <div className="family-container">
        <img src="/simsalabim.PNG" id="sim" alt="simsalabim" className="pet-family-member" />
        <img src="/laura.PNG" id="lau" alt="laura" className="family-member" />
        <img src="/selena.PNG" id="sel" alt="selena" className="pet-family-member" />
        <img src="/sarah.PNG" id="sar" alt="sarah" className="family-member" />
        <img src="/millie.PNG" id="mil" alt="millie" className="pet-family-member" />
        <img src="/bella.PNG" id="bel" alt="bella" className="pet-family-member" />
        <img src="/zoe.PNG" id="zoe" alt="zoe" className="family-member" />
      </div>

      <div className="dad-container">
        <img src="/dad1.PNG" alt="dad" className="dad" />
        <img src="/hat.PNG" alt="hat" className="hat" />
      </div>

      <canvas id="confetti-canvas"></canvas>

      {audioEnabled && (
        <div className="bubble-container">
          <p className="speech-text" ref={textRef}>{displayedText}</p>
        </div>
      )}

      <audio ref={typingAudioRef} src="/click.wav" preload="auto" />
      <audio ref={drumrollRef} src="/drumroll.mp3" preload="auto" />
    </div>
  );
}

export default App;
