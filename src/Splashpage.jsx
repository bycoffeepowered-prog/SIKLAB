import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
const pspImage = '/images/psp.png';
import glitchSfx from "./assets/sounds/Glitch.mp3";
import { playSiteMusic } from "./siteMusic";

function Splashpage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(0);
  const [showLoading, setShowLoading] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const [glitchAll, setGlitchAll] = useState(false);

  const canvasRef = useRef(null);
  const glitchAudioRef = useRef(null);

  useEffect(() => {
    const a = new Audio(glitchSfx);
    a.volume = 0.7;
    glitchAudioRef.current = a;

    return () => {
      a.pause();
      glitchAudioRef.current = null;
    };
  }, []);

  const playGlitch = () => {
    const a = glitchAudioRef.current;
    if (!a) return;
    a.currentTime = 0;
    a.play().catch(() => {});
  };

  // background signal canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let raf = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let specks = [];
    let lines = [];

    const createSpeck = () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() < 0.7 ? 2 : 1,
      life: 0,
      maxLife: 4 + Math.random() * 5,
    });

    const createLine = () => {
      const long = Math.random() > 0.85;
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        width: Math.random() > 0.7 ? 2.5 : 1.5,
        height: long ? 200 + Math.random() * 300 : 40 + Math.random() * 120,
        life: 0,
        maxLife: long ? 10 + Math.random() * 6 : 6 + Math.random() * 5,
      };
    };

    const draw = () => {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (Math.random() > 0.78) specks.push(createSpeck());
      if (Math.random() > 0.9) lines.push(createLine());
      if (Math.random() > 0.96) lines.push(createLine());

      specks = specks.filter((s) => {
        s.life++;
        ctx.fillStyle = `rgba(255,255,255,${1 - s.life / s.maxLife})`;
        ctx.fillRect(s.x, s.y, s.size, s.size);
        return s.life <= s.maxLife;
      });

      lines = lines.filter((l) => {
        l.life++;
        ctx.fillStyle = `rgba(255,255,255,${0.3 * (1 - l.life / l.maxLife)})`;
        ctx.fillRect(l.x, l.y, l.width, l.height);
        return l.life <= l.maxLife;
      });

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // entry: glitch + show PSP
  useEffect(() => {
    const t = setTimeout(() => {
      setGlitchAll(true);
      playGlitch();
      setShowConsole(true);

      setTimeout(() => setGlitchAll(false), 700);
    }, 200);

    return () => clearTimeout(t);
  }, []);

  // loading bar -> go to retro page
  useEffect(() => {
    if (!showLoading) return;

    const interval = setInterval(() => {
      setLoading((prev) => {
        const next = prev + 2;

        if (next >= 100) {
          clearInterval(interval);
          setGlitchAll(true);
          playGlitch();

          setTimeout(() => navigate("/retro", { replace: true }), 350);

          return 100;
        }

        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [showLoading, navigate]);

  const handleStart = () => {
    playSiteMusic();
    setGlitchAll(true);
    playGlitch();
    setTimeout(() => setGlitchAll(false), 450);

    setLoading(0);
    setShowLoading(true);
  };

  return (
    <>
      <style>{`
        /* ROOT + BACKGROUND SIGNAL */
        .splash-root {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
        }

        .bg-wrapper {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }

        .bg-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .bg-scanlines {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.05) 0px,
            rgba(255, 255, 255, 0.05) 1px,
            transparent 2px,
            transparent 8px
          );
          opacity: 0.35;
          mix-blend-mode: screen;
        }

        .bg-noise {
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(circle at 10% 20%, rgba(255,255,255,0.06) 0 1px, transparent 2px),
            radial-gradient(circle at 70% 30%, rgba(255,255,255,0.05) 0 1px, transparent 2px),
            radial-gradient(circle at 40% 80%, rgba(255,255,255,0.04) 0 1px, transparent 2px);
          background-size: 180px 180px;
          opacity: 0.25;
          animation: noiseDrift 2.2s steps(2, end) infinite;
          mix-blend-mode: screen;
        }

        @keyframes noiseDrift {
          0% { transform: translate(0, 0); }
          25% { transform: translate(-6px, 4px); }
          50% { transform: translate(7px, -5px); }
          75% { transform: translate(-4px, -6px); }
          100% { transform: translate(0, 0); }
        }

        /* FULLSCREEN GLOBAL GLITCH */
        .global-glitch {
          position: fixed;
          inset: 0;
          z-index: 999;
          pointer-events: none;
          opacity: 0;
          mix-blend-mode: screen;
        }

        .global-glitch.on {
          opacity: 1;
          animation: glitchOverlay 700ms steps(2, end) 1;
        }

        .splash-root.glitching {
          animation: globalJitter 700ms steps(2, end) 1;
        }

        @keyframes globalJitter {
          0%   { filter: none; transform: translate(0,0); }
          20%  { filter: hue-rotate(25deg) contrast(1.25); transform: translate(-2px, 1px); }
          40%  { filter: hue-rotate(-20deg) contrast(1.35); transform: translate(3px, -2px); }
          60%  { filter: hue-rotate(10deg) contrast(1.15); transform: translate(-3px, 2px); }
          100% { filter: none; transform: translate(0,0); }
        }

        @keyframes glitchOverlay {
          0% {
            background:
              repeating-linear-gradient(to bottom, rgba(255,255,255,0.18) 0px, rgba(255,255,255,0.18) 2px, transparent 3px, transparent 10px),
              radial-gradient(circle at 30% 40%, rgba(255,0,90,0.18), transparent 45%),
              radial-gradient(circle at 70% 60%, rgba(0,170,255,0.18), transparent 45%);
            transform: translate(0,0);
          }
          35% {
            background:
              repeating-linear-gradient(to bottom, rgba(255,255,255,0.28) 0px, rgba(255,255,255,0.28) 2px, transparent 3px, transparent 8px),
              radial-gradient(circle at 20% 55%, rgba(255,0,90,0.22), transparent 50%),
              radial-gradient(circle at 80% 45%, rgba(0,170,255,0.22), transparent 50%);
            transform: translate(-6px, 2px);
          }
          70% {
            background:
              repeating-linear-gradient(to bottom, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 1px, transparent 2px, transparent 12px),
              radial-gradient(circle at 60% 35%, rgba(255,0,90,0.15), transparent 55%),
              radial-gradient(circle at 40% 65%, rgba(0,170,255,0.15), transparent 55%);
            transform: translate(5px, -3px);
          }
          100% {
            background:
              repeating-linear-gradient(to bottom, rgba(255,255,255,0) 0px, rgba(255,255,255,0) 2px, transparent 3px, transparent 10px);
            transform: translate(0,0);
          }
        }

        /* SPLASH SCREEN - GALAXY */
        .splash-screen {
          width: 100vw;
          height: 100vh;
          position: relative;
          z-index: 2;
          background:
            radial-gradient(ellipse at 20% 30%, rgba(138, 43, 226, 0.4) 0%, transparent 40%),
            radial-gradient(ellipse at 80% 70%, rgba(30, 144, 255, 0.3) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(147, 51, 234, 0.2) 0%, transparent 60%),
            linear-gradient(135deg, #0a0e27 0%, #1a0b2e 25%, #16003b 50%, #0d0221 75%, #000000 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .splash-screen::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(2px 2px at 20% 30%, #cdd6ff, transparent),
            radial-gradient(2px 2px at 60% 70%, #a5b4ff, transparent),
            radial-gradient(1px 1px at 50% 50%, #ffffff, transparent),
            radial-gradient(1px 1px at 80% 10%, #b8c1ff, transparent),
            radial-gradient(2px 2px at 90% 60%, #9aa8ff, transparent),
            radial-gradient(1px 1px at 33% 50%, #e0e7ff, transparent),
            radial-gradient(1px 1px at 75% 80%, #c7d2fe, transparent);
          background-size: 200% 200%;
          animation: galaxyMove 60s ease-in-out infinite;
          opacity: 0.8;
          filter: drop-shadow(0 0 6px rgba(139, 92, 246, 0.6));
        }

        .splash-screen::after {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center, rgba(138, 43, 226, 0.1) 0%, transparent 50%);
          animation: pulseGalaxy 8s ease-in-out infinite;
        }

        @keyframes galaxyMove {
          0%, 100% {
            background-position: 0% 0%, 40% 60%, 80% 20%, 10% 90%, 70% 30%, 30% 70%, 90% 10%;
          }
          50% {
            background-position: 100% 100%, 60% 40%, 20% 80%, 90% 10%, 30% 70%, 70% 30%, 10% 90%;
          }
        }

        @keyframes pulseGalaxy {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        /* HANDHELD CONSOLE (PSP) */
        .handheld-console {
          position: relative;
          z-index: 10;
          width: 1200px;
          top: 10%;
          left: -2%;
          max-width: 95vw;
          aspect-ratio: 1.5 / 1;
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
          display: flex;
          align-items: center;
          justify-content: center;
          filter: drop-shadow(0 50px 120px rgba(0, 0, 0, 0.8))
            drop-shadow(0 0 60px rgba(138, 43, 226, 0.3));
        }

        .handheld-console.hidden {
          opacity: 0;
          transform: translateY(40px) scale(0.95);
          pointer-events: none;
        }

        .handheld-console.show {
          opacity: 1;
        }

        .handheld-console.glitch-in {
          animation: consoleGlitch 650ms steps(2, end) 1, consoleFloat 4s ease-in-out infinite;
        }

        .handheld-console.glitch-in::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 14px;
          pointer-events: none;
          background: repeating-linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.08) 0px,
            rgba(255, 255, 255, 0.08) 1px,
            transparent 2px,
            transparent 6px
          );
          opacity: 0;
          animation: scanFlash 650ms ease 1;
        }

        @keyframes consoleFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-15px) scale(1); }
        }

        @keyframes consoleGlitch {
          0%   { transform: translateY(40px) scale(0.95); filter: hue-rotate(0deg); }
          15%  { transform: translateY(10px) translateX(-6px) scale(1.02); filter: hue-rotate(35deg) contrast(1.2); }
          30%  { transform: translateY(0px) translateX(8px) scale(0.98); filter: hue-rotate(-25deg) contrast(1.35); }
          45%  { transform: translateY(-3px) translateX(-10px) scale(1.01); filter: hue-rotate(15deg) contrast(1.1); }
          60%  { transform: translateY(0px) translateX(6px) scale(1); filter: hue-rotate(-10deg); }
          100% { transform: translateY(0px) translateX(0px) scale(1); filter: none; }
        }

        @keyframes scanFlash {
          0%   { opacity: 0; }
          25%  { opacity: 0.55; }
          55%  { opacity: 0.25; }
          100% { opacity: 0; }
        }

        /* SCREEN CONTENT */
        .screen {
          position: absolute;
          top: 20%;
          left: 40%;
          width: 28%;
          height: 38%;
        }

        .screen-content {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 15px;
        }

        .pixel-text {
          font-family: "Press Start 2P", "Courier New", monospace;
          font-size: 50px;
          color: #fff;
          text-shadow:
            0 0 20px rgba(157, 78, 221, 0.9),
            0 0 40px rgba(199, 125, 255, 0.6),
            0 4px 8px rgba(0, 0, 0, 0.8);
          letter-spacing: 4px;
          animation: textGlow 3s ease-in-out infinite;
        }

        @keyframes textGlow {
          0%, 100% {
            text-shadow:
              0 0 20px rgba(157, 78, 221, 0.9),
              0 0 40px rgba(199, 125, 255, 0.6),
              0 4px 8px rgba(0, 0, 0, 0.8);
          }
          50% {
            text-shadow:
              0 0 40px rgba(157, 78, 221, 1),
              0 0 80px rgba(199, 125, 255, 0.9),
              0 4px 8px rgba(0, 0, 0, 0.8);
          }
        }

        /* START BUTTON */
        .start-button {
          font-family: "Press Start 2P", "Courier New", monospace;
          font-size: 40px;
          padding: 8px 24px;
          background: linear-gradient(135deg, #9d4edd 0%, #7b2cbf 100%);
          color: #fff;
          border: 2px solid #c77dff;
          border-radius: 8px;
          cursor: pointer;
          box-shadow:
            0 4px 0 #5a189a,
            0 4px 20px rgba(157, 78, 221, 0.6),
            inset 0 -2px 8px rgba(0, 0, 0, 0.3),
            inset 0 2px 8px rgba(255, 255, 255, 0.2);
          transition: all 0.15s;
          animation: buttonPulse 2s ease-in-out infinite;
          position: relative;
          overflow: hidden;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        .start-button::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          animation: buttonShine 3s linear infinite;
        }

        @keyframes buttonShine {
          0% { left: -100%; }
          100% { left: 200%; }
        }

        @keyframes buttonPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .start-button:hover { transform: scale(1.08); }

        .start-button:active {
          transform: translateY(3px) scale(1.05);
          box-shadow: 0 1px 0 #5a189a, 0 1px 10px rgba(157, 78, 221, 0.6);
        }

        /* LOADING BAR */
        .loading-bar-container {
          width: 180px;
          max-width: 90%;
          height: 16px;
          background: #000;
          border: 2px solid #9d4edd;
          border-radius: 4px;
          overflow: hidden;
          box-shadow:
            0 0 15px rgba(157, 78, 221, 0.4),
            inset 0 2px 6px rgba(0, 0, 0, 0.8);
          position: relative;
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .loading-bar {
          height: 100%;
          background: linear-gradient(
            90deg,
            #7b2cbf 0%,
            #9d4edd 25%,
            #c77dff 50%,
            #9d4edd 75%,
            #7b2cbf 100%
          );
          background-size: 200% 100%;
          transition: width 0.3s ease-out;
          box-shadow:
            0 0 25px rgba(157, 78, 221, 0.8),
            inset 0 2px 8px rgba(255, 255, 255, 0.3);
          animation: barShimmer 2s linear infinite;
          position: relative;
        }

        .loading-bar::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%);
          animation: barGloss 1.5s ease-in-out infinite;
        }

        @keyframes barShimmer {
          0% { background-position: 0% 0; }
          100% { background-position: 200% 0; }
        }

        @keyframes barGloss {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .handheld-console { width: 90vw; }
          .pixel-text { font-size: 20px; }
          .start-button { font-size: 10px; padding: 6px 20px; }
          .loading-bar-container { height: 14px; width: 150px; }
        }

        @media (max-width: 768px) {
          .handheld-console { width: 95vw; }
          .pixel-text { font-size: 18px; letter-spacing: 3px; }
          .loading-bar-container { width: 130px; height: 12px; }
          .start-button { font-size: 9px; padding: 5px 18px; }
        }

        @media (max-width: 480px) {
          .pixel-text { font-size: 14px; letter-spacing: 2px; }
          .start-button { font-size: 8px; padding: 4px 15px; }
          .loading-bar-container { height: 10px; width: 110px; }
        }
      `}</style>

      <div className={`splash-root ${glitchAll ? "glitching" : ""}`}>
        <div className="bg-wrapper" aria-hidden="true">
          <canvas ref={canvasRef} className="bg-canvas" />
          <div className="bg-scanlines" />
          <div className="bg-noise" />
        </div>

        <div className={`global-glitch ${glitchAll ? "on" : ""}`} aria-hidden="true" />

        <div className="splash-screen">
          <div
            className={`handheld-console ${showConsole ? "show glitch-in" : "hidden"}`}
            style={{ backgroundImage: `url(${pspImage})` }}
          >
            <div className="screen">
              <div className="screen-content">
                {!showLoading ? (
                  <>
                    <div className="pixel-text">PRESS</div>
                    <button className="start-button" onClick={handleStart}>
                      START
                    </button>
                  </>
                ) : (
                  <>
                    <div className="pixel-text">LOADING</div>
                    <div className="loading-bar-container">
                      <div className="loading-bar" style={{ width: `${loading}%` }} />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Splashpage;