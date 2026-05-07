import { forwardRef } from 'react';
import { useScrollAnimation } from './Usescrollanimation';

const HERO_STYLES = `
  @keyframes heroPopUp {
    from { 
      opacity: 0; 
      transform: translateY(50px) scale(0.95);
    }
    to { 
      opacity: 1; 
      transform: translateY(0) scale(1);
    }
  }

  .hero {
    padding: 0;
    min-height: 50vh;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    background: var(--hero-gradient);
    position: relative;
    overflow: hidden;
    opacity: 0;
    transform: translateY(50px) scale(0.95);
    transition: background 0.3s ease;
  }

  .hero.animate-in {
    animation: heroPopUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }

  .hero-content {
    position: relative;
    z-index: 2;
    width: min(57%, 900px);
    display: flex;
    justify-content: center;
    align-items: flex-end;
    padding: 0;
  }

  .arcade-container {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    width: 100%;
    position: relative;
  }

  .arcade-img {
    width: 75%;
    max-width: 900px;
    min-width: 500px;
    height: auto;
    object-fit: contain;
    display: block;
    margin-bottom: -4px;
    filter: drop-shadow(0 -20px 80px rgba(139,92,246,0.5)) drop-shadow(0 0 120px rgba(88,28,135,0.6));
    position: relative;
    z-index: 2;
    pointer-events: none;
  }

  .arcade-screen-video {
    position: absolute;
    top: 31%;
    left: 50%;
    transform: translateX(-50%);
    width: 51%;
    height: auto;
    max-height: 53%;
    object-fit: cover;
    z-index: 3;
    border-radius: 12px;
    background: #000;
  }

  @media (max-width: 768px) {
    .hero {
      min-height: auto;
      padding-top: 28px;
      overflow: visible;
    }

    .hero-content {
      width: 100%;
      max-width: 520px;
      padding: 0 12px;
    }

    .arcade-img {
      width: 100%;
      min-width: 0;
      max-width: 520px;
    }

    .arcade-screen-video {
      width: 51%;
      top: 31%;
      border-radius: 8px;
    }
  }

  @media (max-width: 420px) {
    .hero-content {
      padding: 0 8px;
    }

    .arcade-screen-video {
      border-radius: 5px;
    }
  }
`;

const Hero = forwardRef(function Hero(_props, ref) {
  const [animRef, isVisible] = useScrollAnimation({ threshold: 0.2 });

  return (
    <>
      <style>{HERO_STYLES}</style>
      <section
        className={`hero section-full ${isVisible ? 'animate-in' : ''}`}
        ref={(node) => {
          animRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        id="home"
      >
        <div className="hero-content">
          <div className="arcade-container">
            <img
              src="/images/arcade-cabinet.png"
              alt="Siklab Arcade Cabinet"
              className="arcade-img"
            />
            <video className="arcade-screen-video" autoPlay loop muted playsInline>
              <source src="/images/TrialTrailer.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>
    </>
  );
});

export default Hero;