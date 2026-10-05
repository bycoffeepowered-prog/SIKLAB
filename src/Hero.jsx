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
    height: calc(100dvh - var(--site-header-height, 96px));
    min-height: calc(100dvh - var(--site-header-height, 96px));
    max-height: calc(100dvh - var(--site-header-height, 96px));
    display: flex;
    align-items: flex-end;
    justify-content: center;
    background: var(--hero-gradient);
    position: relative;
    overflow: hidden;
    opacity: 0;
    transform: translateY(50px) scale(0.95);
    transition: background 0.3s ease;
    box-sizing: border-box;
  }

  .hero.animate-in {
    animation: heroPopUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }

  .hero-content {
    position: relative;
    z-index: 2;
    height: 100%;
    width: auto;
    max-width: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    padding: 0;
  }

  .arcade-container {
    position: relative;
    height: 100%;
    width: max-content;
    max-width: 100%;
    display: block;
    line-height: 0;
  }

  .arcade-img {
    height: 100%;
    width: auto;
    max-width: 100vw;
    object-fit: contain;
    object-position: bottom center;
    display: block;
    margin-bottom: 0;
    filter: drop-shadow(0 -20px 80px rgba(139,92,246,0.5)) drop-shadow(0 0 120px rgba(88,28,135,0.6));
    position: relative;
    z-index: 1;
    pointer-events: none;
  }

  .arcade-screen {
    position: absolute;
    left: 14.5%;
    top: 29.5%;
    width: 70.1%;
    height: 56.4%;
    z-index: 2;
    overflow: hidden;
    background: #000;
    border-radius: 0;
  }

  .arcade-screen-video {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
    display: block;
    background: #000;
  }

  @media (max-width: 1024px) {
    .hero-content {
      max-width: 100%;
    }
  }

  @media (max-width: 768px) {
    .hero {
      padding-top: 0;
    }

    .hero-content,
    .arcade-container {
      max-width: 100%;
    }
  }
`;

const Hero = forwardRef(function Hero(_props, ref) {
  const [animRef, isVisible] = useScrollAnimation({ threshold: 0.2 });

  return (
    <>
      <style>{HERO_STYLES}</style>
      <section
        className={`hero section-full tab-screen ${isVisible ? 'animate-in' : ''}`}
        ref={(node) => {
          animRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        id="home"
      >
        <div className="hero-content">
          <div className="arcade-container">
            <div className="arcade-screen">
              <video
                className="arcade-screen-video"
                autoPlay
                loop
                muted
                playsInline
                webkit-playsinline="true"
                preload="auto"
              >
                <source src="/images/home-trailer.mp4" type="video/mp4" />
              </video>
            </div>
            <img
              src="/images/arcade-cabinet.png"
              alt="Siklab Arcade Cabinet"
              className="arcade-img"
            />
          </div>
        </div>
      </section>
    </>
  );
});

export default Hero;