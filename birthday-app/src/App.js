import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import './App.css';

const messages = [
  "It is Tuesday, July 15th...",
  "This is a very important day...",
  "How come?...",
  "*drum roll*",
  "Today marks the 60th birthday of Ernst Obermaier, the best dad ever!!!",
];

function App() {
  const [current, setCurrent] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [typing, setTyping] = useState(false);
  const textRef = useRef(null);
  const typingAudioRef = useRef(null);
  const drumrollRef = useRef(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [countdownText, setCountdownText] = useState('');
  const [makeWishVisible, setMakeWishVisible] = useState(false);
  const cheerAudioRef = useRef(null);
  const beepAudioRef = useRef(null);
  const [showBubble, setShowBubble] = useState(true);
  const [dadStage, setDadStage] = useState('dad1');
  const [showSmoke, setShowSmoke] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [cakeStage, setCakeStage] = useState('cake.GIF');
  const [animationComplete, setAnimationComplete] = useState(false);
  const [interactionLocked, setInteractionLocked] = useState(false);

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
          typingAudioRef.current.currentTime = 0;
          typingAudioRef.current.play().catch(() => {});
        } else if (isDrumroll && drumrollRef.current) {
          drumrollRef.current.currentTime = 4;
          drumrollRef.current.play().catch(() => {});
        }
      }
      setTimeout(() => {
        const interval = setInterval(() => {
          currentText += message[i];
          setDisplayedText(currentText);
          i++;

          // Modify end of typewriter function:
          if (i >= message.length) {
            clearInterval(interval);
            setTyping(false);

            if (typingAudioRef.current) {
              typingAudioRef.current.pause();
              typingAudioRef.current.currentTime = 0;
              typingAudioRef.current.loop = false;
            }

            // Trigger sequence if it's the last message
            if (message === messages[messages.length - 1]) {
              runFinalSequence();
            }
          }
        }, 35);
      }, 400);
    }, 100);
  };

  const handleTap = () => {
    // Pre-warm beep and cheer audio
    beepAudioRef.current?.play().then(() => {
      beepAudioRef.current?.pause();
      beepAudioRef.current.currentTime = 0;
    }).catch(() => {});

    cheerAudioRef.current?.play().then(() => {
      cheerAudioRef.current?.pause();
      cheerAudioRef.current.currentTime = 0;
    }).catch(() => {});
    
    if (interactionLocked) return;
    if (animationComplete) {
      resetApp();
    }
    else {
      if (!audioEnabled) {
        setAudioEnabled(true);

        // Unlock audio
        if (typingAudioRef.current) {
          typingAudioRef.current.play().then(() => {
            typingAudioRef.current.pause();
            typingAudioRef.current.currentTime = 3;
          }).catch(() => {});
        }

        if (drumrollRef.current) {
          drumrollRef.current.play().then(() => {
            drumrollRef.current.pause();
            drumrollRef.current.currentTime = 2;
          }).catch(() => {});
        }

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
      }
    }
  };

  const resetApp = () => {
    setInteractionLocked(false);
    setCurrent(0);
    setDisplayedText('');
    setTyping(false);
    setAudioEnabled(false);
    setCountdownText('');
    setMakeWishVisible(false);
    setShowBubble(true);
    setDadStage('dad1');
    setShowSmoke(false);
    setShowBanner(false);
    setCakeStage('cake.GIF');
    setAnimationComplete(false);

    // Reset audio
    if (typingAudioRef.current) {
      typingAudioRef.current.pause();
      typingAudioRef.current.currentTime = 0;
    }

    if (drumrollRef.current) {
      drumrollRef.current.pause();
      drumrollRef.current.currentTime = 0;
    }

    if (cheerAudioRef.current) {
      cheerAudioRef.current.pause();
      cheerAudioRef.current.currentTime = 0;
    }

    if (beepAudioRef.current) {
      beepAudioRef.current.pause();
      beepAudioRef.current.currentTime = 0;
    }

    // Optionally, re-trigger confetti or intro effect
    confetti({
      particleCount: 100,
      spread: 360,
      origin: { y: 0 },
      startVelocity: 30,
      gravity: 0.5,
    });
  };

  const triggerConfettiBlast = () => {
    confetti({
      particleCount: 300,
      spread: 90,
      origin: { y: 0.6 },
    });
  };

  const runFinalSequence = () => {
    setInteractionLocked(true);
    setTimeout(() => {
      setShowBubble(false);
      setTimeout(() => {
        setMakeWishVisible(true);

        const countdown = ['3...', '2...', '1...'];
        let i = 0;
        const countdownInterval = setInterval(() => {
          if (beepAudioRef.current) {
            beepAudioRef.current.currentTime = 0;
            beepAudioRef.current.play().catch(() => {});
          }
          if (i < countdown.length) {
            setCountdownText(countdown[i]);

            i++;
          } else {
            clearInterval(countdownInterval);
            setCountdownText('');
            setMakeWishVisible(false);
            beepAudioRef.current?.pause();
            // Delay 1s to let '1...' breathe before the transformation
            setTimeout(() => {
              startDadTransformation();
            }, 1000);
          }
        }, 1000);
      }, 1000);
    }, 1500);
  };

  const startDadTransformation = () => {
    setDadStage('dad2');

    setTimeout(() => {
      setDadStage('dad3');
      setShowSmoke(true);
      setCakeStage('cakeOut.PNG');

      setTimeout(() => {
        setDadStage('dad1');
        setShowSmoke(false);

        triggerConfettiBlast();
        cheerAudioRef.current?.play().catch(() => {});
        setShowBanner(true);

        setTimeout(() => {
          setAnimationComplete(true);
          setInteractionLocked(false);
        }, 2000);

      }, 1500); // After dad3
    }, 1000); // After dad2
  };

  return (
    <div className="App"  alt="" onClick={handleTap}>
      <img src="/garland.PNG" alt="garland" className="garland" />
      <div className="cake-container">
        <img src="/table.png"  alt="" className="table" />
        <img src={`/${cakeStage}`}  alt="" className="cake" />
        <img src="/smoke.png"  alt="" className="smoke" style={{ display: showSmoke ? 'block' : 'none' }} />
      </div>
      <div  alt="" className="family-container">
        <img src="/simsalabim.PNG" id="sim" alt="simsalabim" className="pet-family-member" />
        <img src="/laura.PNG" id="lau" alt="laura" className="family-member" />
        <img src="/selena.PNG" id="sel" alt="selena" className="pet-family-member" />
        <img src="/sarah.PNG" id="sar" alt="sarah" className="family-member" />
        <img src="/millie.PNG" id="mil" alt="millie" className="pet-family-member" />
        <img src="/bella.PNG" id="bel" alt="bella" className="pet-family-member" />
        <img src="/zoe.PNG" id="zoe" alt="zoe" className="family-member" />
      </div>

      <div  alt="" className="dad-container">
        <img src={`/${dadStage}.PNG`} alt="dad" className="dad" />
        <img src="/hat.PNG" alt="hat" className="hat" />
      </div>

      <canvas  alt="" id="confetti-canvas"></canvas>

      {audioEnabled && (
        <div  alt="" className="bubble-container" style={{ display: showBubble ? 'flex' : 'none' }}>
          <p  alt="" className="speech-text" ref={textRef}>{displayedText}</p>
        </div>
      )}

      {makeWishVisible && (
        <div  alt="" className="wish-overlay">
          <h1  alt="" className="make-wish-text">MAKE A WISH</h1>
          <div  alt="" className="countdown">{countdownText}</div>
        </div>
      )}

      {showBanner && (
        <div  alt="" className="birthday-banner">HAPPY BIRTHDAY DAD!!!!!</div>
      )}

      <audio  alt="" ref={typingAudioRef} src="/click.wav" preload="auto" />
      <audio  alt="" ref={drumrollRef} src="/drumroll.mp3" preload="auto" />
      <audio  alt="" ref={cheerAudioRef} src="/cheer.mp3" preload="auto" />
      <audio  alt="" ref={beepAudioRef} src="/beep.mp3" preload="auto" />

    </div>
  );
}

export default App;
