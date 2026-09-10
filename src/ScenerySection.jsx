import { useRef } from 'react';
import { useScrollAnimation } from './Usescrollanimation';

const SCENERY_STYLES = `
  @keyframes sceneryPopUp { 
    from { opacity:0; transform:translateY(60px) scale(0.9); } 
    to { opacity:1; transform:translateY(0) scale(1); } 
  }
  .scenery-section {
    min-height: 100vh;
    padding: 80px 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    color: var(--text-primary);
    opacity: 0;
    transform: translateY(60px) scale(0.9);
    transition: color 0.3s ease;
  }
  .scenery-section.animate-in {
    animation: sceneryPopUp 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }
  .scenery-inner { max-width: 1280px; width: 100%; }
  .scenery-header { margin-bottom: 28px; text-align: left; }
  .scenery-title { 
    font-size: 40px; 
    line-height: 1.05; 
    margin: 0 0 6px; 
    color: var(--text-primary); 
    transition: color 0.3s ease;
  }
  .scenery-subtitle { 
    font-size: 14px; 
    opacity: 0.9; 
    margin: 0; 
    color: var(--text-secondary); 
    transition: color 0.3s ease;
  }
  .scenery-carousel-wrapper { position: relative; display: flex; align-items: center; gap: 14px; }
  .scenery-carousel { flex: 1; display: flex; gap: 28px; overflow-x: auto; padding: 16px 6px 24px; scroll-snap-type: x mandatory; scroll-behavior: smooth; scrollbar-width: none; }
  .scenery-carousel::-webkit-scrollbar { display: none; }
  .scenery-arrow { 
    background: var(--card-bg); 
    border-radius: 999px; 
    border: 1px solid var(--border-accent); 
    width: 40px; 
    height: 40px; 
    font-size: 22px; 
    color: var(--text-primary); 
    cursor: pointer; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    backdrop-filter: blur(10px); 
    box-shadow: 0 10px 26px var(--shadow-heavy); 
    transition: all 0.18s; 
  }
  .scenery-arrow:hover { 
    transform: translateY(-1px) scale(1.04); 
    background: var(--card-bg-solid); 
    box-shadow: 0 14px 30px var(--shadow-heavy); 
  }
  .scenery-card { flex: 0 0 320px; scroll-snap-align: center; }
  .scenery-card-glass { 
    position: relative; 
    width: 100%; 
    height: 440px; 
    border-radius: 40px; 
    padding: 22px 22px 26px; 
    box-sizing: border-box; 
    background: radial-gradient(circle at top,rgba(255,255,255,0.15),transparent 60%), var(--card-glass); 
    border: 1px solid var(--border-accent); 
    box-shadow: 0 22px 50px var(--shadow-heavy); 
    backdrop-filter: blur(22px); 
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    justify-content: space-between; 
    transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.3s ease, border-color 0.3s ease; 
  }
  .scenery-card-glass:hover { 
    transform: translateY(-6px); 
    box-shadow: 0 26px 60px var(--shadow-heavy), 0 0 0 1px var(--border-accent); 
    border-color: var(--accent-green); 
  }
  .scenery-image-wrap { flex: 1; width: 100%; display: flex; align-items: center; justify-content: center; padding-bottom: 12px; overflow: hidden; }
  .scenery-image { max-width: 100%; width: 100%; height: 280px; object-fit: cover; border-radius: 20px; box-shadow: 0 8px 20px rgba(0,0,0,0.6); }
  .scenery-pill { 
    margin-top: 8px; 
    padding: 12px 28px; 
    border-radius: 999px; 
    border: none; 
    background: linear-gradient(135deg, var(--accent-green), var(--accent-cyan)); 
    color: #fff; 
    font-size: 18px; 
    letter-spacing: 0.03em; 
    text-align: center; 
    transition: background 0.3s ease;
  }
  @media (max-width: 1024px) { .scenery-section { padding: 60px 40px; } }
  @media (max-width: 768px) { .scenery-card { flex: 0 0 260px; } .scenery-card-glass { height: 360px; } }
  @media (max-width: 480px) { .scenery-card { flex: 0 0 240px; } .scenery-card-glass { height: 330px; } }
`;

const SCENERY_DATA = [
  { id: 1, name: 'Gomburza Monument', image: '/images/gomburza.png' },
  { id: 2, name: 'Intramuros',        image: '/images/intramuros.png' },
  { id: 3, name: 'Malacañang Palace', image: '/images/malacanang.png' },
  { id: 4, name: 'NAIA Terminal',     image: '/images/naia.png' },
];

export default function ScenerySection() {
  const carouselRef = useRef(null);
  const [animRef, isVisible] = useScrollAnimation({ threshold: 0.15 });
  const scroll = (dir) => carouselRef.current?.scrollBy({ left: dir === 'left' ? -350 : 350, behavior: 'smooth' });

  return (
    <>
      <style>{SCENERY_STYLES}</style>
      <section className={`scenery-section section-full ${isVisible ? 'animate-in' : ''}`} ref={animRef} id="scenery">
        <div className="scenery-inner">
          <div className="scenery-header">
            <h2 className="scenery-title">Explore the World</h2>
            <p className="scenery-subtitle">Discover iconic Philippine landmarks</p>
          </div>
          <div className="scenery-carousel-wrapper">
            <button className="scenery-arrow left" onClick={() => scroll('left')}>‹</button>
            <div className="scenery-carousel" ref={carouselRef}>
              {SCENERY_DATA.map(item => (
                <div key={item.id} className="scenery-card">
                  <div className="scenery-card-glass">
                    <div className="scenery-image-wrap"><img src={item.image} alt={item.name} className="scenery-image" /></div>
                    <div className="scenery-pill">{item.name}</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="scenery-arrow right" onClick={() => scroll('right')}>›</button>
          </div>
        </div>
      </section>
    </>
  );
}