import { forwardRef } from 'react';
import { useScrollAnimation } from './Usescrollanimation';

const topdownImg = '/images/mechanics-topdown.png';
const adventureImg = '/images/mechanics-adventure.jpg';
const storyImg = '/images/61.png';
const polyImg = '/images/boy1.png';
const arImg = '/images/ar.jpg';
const mobImg = '/images/mechanics-touchscreen.jpg';

const MECHANICS_STYLES = `
  @keyframes mechPopUp { 
    from { opacity:0; transform:translateY(60px) scale(0.9); } 
    to { opacity:1; transform:translateY(0) scale(1); } 
  }
  @keyframes mechSlideIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes mechBounceLeft { 0%,100% { transform:translateX(0); } 50% { transform:translateX(-10px); } }

  .mechanics-section {
    padding: 32px 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    color: var(--text-primary);
    opacity: 0;
    transform: translateY(60px) scale(0.9);
    transition: color 0.3s ease;
  }
  .mechanics-section.animate-in {
    animation: mechPopUp 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }
  .mechanics-container { max-width: 1600px; width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 30px; align-items: start; }
  .mechanics-left-panel { 
    background: var(--card-bg); 
    padding: 30px; 
    border-radius: 20px; 
    box-shadow: 0 8px 32px var(--shadow); 
    backdrop-filter: blur(10px); 
    border: 1px solid var(--border-color); 
    transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  }
  .mechanics-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
  .mechanics-right-panel { 
    background: var(--card-bg); 
    padding: 30px; 
    border-radius: 20px; 
    box-shadow: 0 8px 32px var(--shadow); 
    backdrop-filter: blur(10px); 
    border: 1px solid var(--border-color); 
    height: auto;
    min-height: 420px;
    max-height: calc(100dvh - var(--site-header-height, 128px) - 80px); 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  }
  .mechanics-intro { text-align: center; padding: 60px 40px; animation: mechSlideIn 0.3s ease; }
  .intro-icon { font-size: 80px; margin-bottom: 20px; filter: drop-shadow(0 4px 12px rgba(225,190,231,0.3)); }
  .intro-label { 
    font-size: 14px; 
    letter-spacing: 0.2em; 
    text-transform: uppercase; 
    opacity: 0.7; 
    margin: 0 0 12px; 
    color: var(--accent-purple); 
    transition: color 0.3s ease;
  }
  .intro-title { 
    font-size: 40px; 
    margin: 0 0 30px; 
    font-weight: 700; 
    color: var(--text-primary); 
    line-height: 1.2; 
    transition: color 0.3s ease;
  }
  .intro-text { 
    font-size: 18px; 
    line-height: 1.8; 
    opacity: 0.9; 
    margin: 0 0 16px; 
    color: var(--text-secondary); 
    max-width: 500px; 
    margin-left: auto; 
    margin-right: auto; 
    transition: color 0.3s ease;
  }
  .intro-arrow { font-size: 40px; margin-top: 40px; animation: mechBounceLeft 2s infinite; }
  .polaroid-card { background: #fff; padding: 10px; border: 4px solid currentColor; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 6px 12px rgba(0,0,0,0.3); display: flex; flex-direction: column; position: relative; }
  .polaroid-card:hover { transform: translateY(-4px); box-shadow: 0 8px 16px rgba(0,0,0,0.4); }
  .polaroid-card.active { transform: translateY(-4px) scale(1.05); box-shadow: 0 12px 24px rgba(0,0,0,0.5); border-width: 5px; }
  .polaroid-dark-gray { color: #4a5568; }
  .polaroid-light-gray { color: #a0aec0; }
  .polaroid-yellow { color: #ecc94b; }
  .polaroid-lime { color: #9ae6b4; }
  .polaroid-cyan { color: #76e4f7; }
  .polaroid-purple { color: #b794f4; }
  .polaroid-image { width: 100%; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; }
  .polaroid-dark-gray .polaroid-image { background: linear-gradient(135deg,#2d3748,#4a5568); }
  .polaroid-light-gray .polaroid-image { background: linear-gradient(135deg,#cbd5e0,#e2e8f0); }
  .polaroid-yellow .polaroid-image { background: linear-gradient(135deg,#faf089,#f6e05e); }
  .polaroid-lime .polaroid-image { background: linear-gradient(135deg,#c6f6d5,#9ae6b4); }
  .polaroid-cyan .polaroid-image { background: linear-gradient(135deg,#b2f5ea,#76e4f7); }
  .polaroid-purple .polaroid-image { background: linear-gradient(135deg,#d6bcfa,#b794f4); }
  .polaroid-icon { font-size: 48px; }
  .polaroid-content { padding: 10px 10px 6px; background: #fff; margin-top: 10px; }
  .polaroid-title { font-size: 14px; font-weight: 700; color: #1a202c; margin: 0; text-align: center; }
  .polaroid-desc { padding: 0 10px 10px; background: #fff; }
  .polaroid-desc p { font-size: 11px; line-height: 1.4; color: #4a5568; margin: 0; text-align: center; }
  .detail-card { 
    background: var(--card-bg-solid); 
    border-radius: 16px; 
    overflow: hidden; 
    width: 100%; 
    border: 6px solid currentColor; 
    box-shadow: 0 12px 40px var(--shadow-heavy); 
    animation: mechSlideIn 0.3s ease; 
    min-height: 400px; 
    transition: background 0.3s ease, box-shadow 0.3s ease;
  }
  .detail-image { width: 100%; aspect-ratio: 16/10; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
  .detail-image img { width: 100%; height: 100%; object-fit: cover; }
  .polaroid-dark-gray .detail-image { background: linear-gradient(135deg,#2d3748,#4a5568); }
  .polaroid-light-gray .detail-image { background: linear-gradient(135deg,#cbd5e0,#e2e8f0); }
  .polaroid-yellow .detail-image { background: linear-gradient(135deg,#faf089,#f6e05e); }
  .polaroid-lime .detail-image { background: linear-gradient(135deg,#c6f6d5,#9ae6b4); }
  .polaroid-cyan .detail-image { background: linear-gradient(135deg,#b2f5ea,#76e4f7); }
  .polaroid-purple .detail-image { background: linear-gradient(135deg,#d6bcfa,#b794f4); }
  .detail-icon { font-size: 120px; }
  .detail-body { 
    padding: 32px; 
    background: var(--card-bg-solid); 
    color: var(--text-primary); 
    transition: background 0.3s ease, color 0.3s ease;
  }
  .detail-title { 
    font-size: 32px; 
    font-weight: 700; 
    margin: 0 0 8px; 
    color: var(--text-primary); 
    transition: color 0.3s ease;
  }
  .detail-subtitle { 
    font-size: 16px; 
    opacity: 0.8; 
    margin: 0 0 20px; 
    color: var(--accent-purple); 
    transition: color 0.3s ease;
  }
  .detail-divider { height: 2px; background: linear-gradient(90deg,currentColor,transparent); margin: 20px 0; opacity: 0.3; }
  .detail-description { 
    font-size: 16px; 
    line-height: 1.7; 
    color: var(--text-secondary); 
    margin: 0; 
    transition: color 0.3s ease;
  }
  @media (max-width: 1200px) { .mechanics-container { grid-template-columns: 1fr; } .mechanics-right-panel { position: static; order: -1; } .mechanics-grid { grid-template-columns: repeat(4,1fr); } .intro-arrow { display: none; } }
  @media (max-width: 1024px) { .mechanics-grid { grid-template-columns: repeat(3,1fr); } }
  @media (max-width: 640px) { .mechanics-section { padding: 36px 16px; align-items: flex-start; } .mechanics-grid { grid-template-columns: repeat(2,1fr); gap: 16px; } .polaroid-title { font-size: 12px; } .detail-title { font-size: 24px; } .intro-icon { font-size: 60px; } .intro-title { font-size: 28px; } }
`;

const MECHANICS_DATA = [
  { id: 1, name: 'Top-Down View', desc: "Navigate from a bird's eye perspective", detail: 'Experience strategic gameplay with our top-down camera system. See the battlefield from above, plan your movements, and anticipate enemy positions. This classic perspective offers tactical advantages while maintaining intuitive controls perfect for mobile gaming.', color: 'dark-gray', image: topdownImg },
  { id: 2, name: 'Adventure Game', desc: 'Walk your own unique path.', detail: 'Go through an interactive, narrative-driven genre focused on exploration, puzzle-solving, and story, that draw from factual historical events.', color: 'light-gray', image: adventureImg },
  { id: 3, name: 'Story-based Game', desc: 'Experience the tales of the past.', detail: 'A blend of immersive narratives with historical settings, offering experiences ranging from accurate portrayals to fictionalized tales in the past.', color: 'yellow', image: storyImg},
  { id: 4, name: 'Low-Poly', desc: 'Level up and unlock skills', detail: 'A unique 3D computer graphics style utilizing a small number of polygons to create lightweight, minimalist, and blocky models.', color: 'lime', image: polyImg },
  { id: 5, name: 'Augmented Reality', desc: 'Complete epic missions', detail: 'An immersive technology that integrates digital information into the real world. Through a camera-enabled device, users can interact with their physical space and computer-generated content at the same time.', color: 'cyan', image: arImg},
  { id: 6, name: 'Touchscreen Controls', desc: 'Discover Philippine landmarks', detail: 'Mobile touch screen gaming controls are optimized through customizable, on-screen virtual joysticks and buttons, often supplemented by attachable hardware like small suction-cup joysticks for better tactile feedback. ', color: 'purple', image: mobImg }
];

const ICONS = { 1: '🏞️', 2: '🗺️', 3: '📜', 4: '🙋🏻‍♂️', 5: '🥽', 6: '📱' };

const MechanicsSection = forwardRef(function MechanicsSection({ selectedMechanic, setSelectedMechanic }, ref) {
  const [animRef, isVisible] = useScrollAnimation({ threshold: 0.15 });
  
  return (
    <>
      <style>{MECHANICS_STYLES}</style>
      <section className={`mechanics-section section-full tab-screen ${isVisible ? 'animate-in' : ''}`} ref={(node) => {
        animRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }} id="mechanics">
        <div className="mechanics-container">
          <div className="mechanics-left-panel">
            <div className="mechanics-grid">
              {MECHANICS_DATA.map(item => (
                <button key={item.id} className={`polaroid-card polaroid-${item.color} ${selectedMechanic?.id === item.id ? 'active' : ''}`} onClick={() => setSelectedMechanic(item)}>
                  <div className="polaroid-image"><span className="polaroid-icon">{ICONS[item.id]}</span></div>
                  <div className="polaroid-content"><h3 className="polaroid-title">{item.name}</h3></div>
                  <div className="polaroid-desc"><p>{item.desc}</p></div>
                </button>
              ))}
            </div>
          </div>
          <div className="mechanics-right-panel">
            {!selectedMechanic ? (
              <div className="mechanics-intro">
                <div className="intro-icon">🎮</div>
                <p className="intro-label">DISCOVER</p>
                <h2 className="intro-title">Game Mechanics</h2>
                <p className="intro-text">Explore the core gameplay features that make SIKLAB unique.</p>
                <p className="intro-text">Click any card to reveal more details about each mechanic.</p>
                <div className="intro-arrow">👈</div>
              </div>
            ) : (
              <div className={`detail-card polaroid-${selectedMechanic.color}`}>
                <div className="detail-image">
                  <img src={selectedMechanic.image} alt={selectedMechanic.name} />
                </div>
                <div className="detail-body">
                  <h2 className="detail-title">{selectedMechanic.name}</h2>
                  <p className="detail-subtitle">{selectedMechanic.desc}</p>
                  <div className="detail-divider"></div>
                  <p className="detail-description">{selectedMechanic.detail}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
});

export default MechanicsSection;