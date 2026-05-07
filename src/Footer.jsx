import { useState } from 'react';

const ishImg = '/images/isa.png';
const junImg = '/images/junjun.png';
const kyImg = '/images/liyah.png';
const melImg = '/images/melody.png';
const xanImg = '/images/xandy.png';

const edImg = '/images/EdFace.png';
const elmerImg = '/images/ElmerFace.png';
const alvinImg = '/images/AlvinFace.png';

const FOOTER_STYLES = `
  @keyframes ftFadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes ftSlideUp { from { opacity:0; transform:translateY(40px) scale(0.95); } to { opacity:1; transform:translateY(0) scale(1); } }
  @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
  
  .team-avatar{
    width: 64px;
    height: 64px;
    border-radius: 12px;
    object-fit: cover;
    background: rgba(0,0,0,0.4);
    flex-shrink: 0;
  }

  .footer { 
    background: var(--footer-bg); 
    border-top: 4px solid var(--accent-color); 
    padding: 2rem 0; 
    margin-top: 4rem; 
    transition: background 0.3s ease, border-color 0.3s ease;
  }

  .footer-top { 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    margin-bottom: 1rem; 
    flex-wrap: wrap; 
    gap: 1rem; 
  }

  .footer-logo { 
    background: linear-gradient(135deg,#f97316 0%,#dc2626 100%); 
    padding: 0.5rem 1rem; 
    border: 2px solid #fdba74; 
    font-weight: 900; 
    color: white; 
    font-family: 'Courier New',monospace; 
    cursor: pointer; 
    transition: transform 0.2s,box-shadow 0.2s; 
  }

  .footer-logo:hover { 
    transform: translateY(-2px); 
    box-shadow: 0 4px 15px rgba(239,68,68,0.5); 
  }

  .footer-nav { 
    display: flex; 
    gap: 1.5rem; 
    flex-wrap: wrap; 
  }

  .footer-link { 
    color: var(--accent-cyan); 
    text-decoration: none; 
    font-size: 0.875rem; 
    font-weight: bold; 
    transition: color 0.2s; 
    cursor: pointer;
  }

  .footer-link:hover { 
    color: var(--text-primary); 
    text-shadow: 0 0 8px rgba(34,211,238,0.6); 
  }

  .footer-bottom { 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    flex-wrap: wrap; 
    gap: 1rem; 
  }

  .footer-text { 
    font-size: 0.75rem; 
    color: var(--text-muted); 
    transition: color 0.3s ease;
  }

  .footer-legal {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .footer-game-label,
  .footer-legal-label {
    font-size: 0.75rem;
    color: var(--text-muted);
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .terminal-overlay { 
    position: fixed; 
    inset: 0; 
    background: rgba(0,0,0,0.9); 
    backdrop-filter: blur(8px); 
    z-index: 99999; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    padding: 20px; 
    animation: ftFadeIn 0.3s ease-out; 
  }

  .terminal-popup { 
    width: 100%; 
    max-width: 1400px; 
    max-height: 90vh; 
    animation: ftSlideUp 0.4s ease-out;
  }

  .terminal-window { 
    width: 100%; 
    max-height: 90vh;
    background-color: #1a1a1a;
    border-radius: 12px; 
    overflow: hidden; 
    box-shadow: 0 30px 80px rgba(0,0,0,0.9); 
    display: flex; 
    flex-direction: column; 
    font-family: 'Courier New',monospace;
    border: 2px solid var(--accent-cyan);
  }

  .terminal-tabs {
    display: flex;
    align-items: center;
    background: #2a2a2a;
    padding: 0;
    border-bottom: 1px solid #1a1a1a;
  }

  .terminal-tabs-wrapper {
    display: flex;
    flex: 1;
  }

  .terminal-close { 
    background: rgba(255,95,86,0.2);
    border: none;
    border-left: 1px solid #1a1a1a;
    color: #ff5f56; 
    width: 48px; 
    height: 100%;
    min-height: 44px;
    font-size: 20px; 
    cursor: pointer; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    transition: all 0.2s;
    font-weight: bold;
    line-height: 1;
    flex-shrink: 0;
  }

  .terminal-close:hover { 
    background: #ff5f56;
    color: white;
  }

  .terminal-tab {
    padding: 0.75rem 1.5rem;
    background: transparent;
    border: none;
    color: #888;
    font-family: 'Courier New',monospace;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s;
    border-right: 1px solid #1a1a1a;
    position: relative;
  }

  .terminal-tab:hover { 
    background: #333; 
    color: #fff; 
  }

  .terminal-tab.active { 
    background: #1a1a1a;
    color: var(--accent-cyan);
  }

  .terminal-tab.active::before {
    content: '▶';
    position: absolute;
    left: 0.5rem;
    animation: blink 1s infinite;
  }

  .terminal-body { 
    flex: 1; 
    padding: 2rem; 
    overflow-y: auto;
    background-color: #1a1a1a;
    color: #00ff00;
    font-size: 14px; 
    line-height: 1.8;
    scrollbar-width: thin;
    scrollbar-color: var(--accent-cyan) transparent;
  }

  .terminal-body::-webkit-scrollbar { width: 8px; }
  .terminal-body::-webkit-scrollbar-thumb { background-color: var(--accent-cyan); border-radius: 10px; }

  .terminal-prompt-line {
    color: #888;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }

  .terminal-prompt-line::before {
    content: '$ ';
    color: var(--accent-cyan);
    font-weight: bold;
  }

  .about-section {
    max-width: 900px;
    margin: 0 auto;
  }

  .about-hero {
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: rgba(0,255,0,0.05);
    border: 1px solid rgba(0,255,0,0.3);
    border-left: 4px solid var(--accent-cyan);
  }

  .about-hero h2 {
    font-size: 2rem;
    color: var(--accent-cyan);
    margin: 0 0 1rem 0;
    font-family: 'Courier New',monospace;
    font-weight: 900;
    text-shadow: 0 0 10px rgba(34,211,238,0.5);
  }

  .about-hero h2::before {
    content: '> ';
    color: #00ff00;
  }

  .about-hero p {
    color: #00ff00;
    font-size: 1rem;
    line-height: 1.8;
    margin: 0;
  }
  
  .vision-mission {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
  }

  .vm-card {
    background: rgba(0,0,0,0.4);
    padding: 1.5rem;
    border: 1px solid rgba(0,255,0,0.3);
    border-left: 4px solid var(--accent-cyan);
    transition: all 0.3s;
  }

  .vm-card:hover {
    transform: translateX(4px);
    box-shadow: 0 0 20px rgba(34,211,238,0.3);
    background: rgba(0,0,0,0.6);
  }

  .vm-card h3 {
    color: var(--accent-cyan);
    font-size: 1.3rem;
    margin: 0 0 1rem 0;
    font-family: 'Courier New',monospace;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .vm-card h3::before {
    content: '>';
    color: #00ff00;
  }

  .vm-card p {
    color: #00ff00;
    line-height: 1.8;
    margin: 0;
    font-size: 0.9rem;
  }

  .team-section,
  .contributors-section {
    text-align: center;
  }

  .team-header {
    margin-bottom: 2rem;
  }

  .team-header h2 {
    font-size: 2rem;
    color: var(--accent-cyan);
    margin: 0 0 0.5rem 0;
    font-family: 'Courier New',monospace;
    font-weight: 900;
    text-shadow: 0 0 10px rgba(34,211,238,0.5);
  }

  .team-header h2::before {
    content: '> ';
    color: #00ff00;
  }

  .team-header p {
    color: #888;
    font-size: 0.95rem;
  }
  
  .team-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .team-card {
    background: rgba(0,0,0,0.4);
    padding: 1.5rem;
    border: 1px solid rgba(0,255,0,0.3);
    border-left: 4px solid var(--accent-cyan);
    transition: all 0.3s;
    text-align: left;
  }

  .team-card:hover {
    transform: translateX(4px);
    box-shadow: 0 0 20px rgba(34,211,238,0.3);
    border-color: var(--accent-cyan);
  }

  .team-card-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(0,255,0,0.2);
  }

  .team-info {
    flex: 1;
  }

  .team-name {
    font-size: 1.3rem;
    color: var(--accent-cyan);
    margin: 0 0 0.3rem 0;
    font-weight: bold;
  }

  .team-role {
    color: #00ff00;
    font-size: 0.85rem;
    font-weight: bold;
    margin: 0;
  }

  .team-specialty {
    color: #888;
    font-size: 0.8rem;
    margin: 0.5rem 0 1rem 0;
    font-style: italic;
  }

  .team-specialty::before {
    content: '// ';
    color: #666;
  }

  .team-responsibilities {
    color: #00ff00;
    font-size: 0.85rem;
    line-height: 1.6;
    margin: 0;
    padding: 0;
  }

  .team-responsibilities li {
    margin-bottom: 0.4rem;
    list-style: none;
    padding-left: 1.5rem;
    position: relative;
  }

  .team-responsibilities li::before {
    content: ">";
    position: absolute;
    left: 0;
    color: var(--accent-cyan);
  }

  .team-contact-card {
    max-width: 1200px;
    margin: 1.5rem auto 0;
    padding: 1.5rem;
    background: rgba(0,0,0,0.4);
    border: 1px solid rgba(0,255,0,0.3);
    border-left: 4px solid var(--accent-cyan);
    text-align: left;
  }

  .team-contact-title {
    color: var(--accent-cyan);
    font-size: 1.3rem;
    margin: 0 0 1rem 0;
    font-weight: bold;
  }

  .team-contact-title::before {
    content: '> ';
    color: #00ff00;
  }

  .team-contact-links {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
  }

  .team-contact-link {
    color: #00ff00;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: bold;
    word-break: break-word;
  }

  .team-contact-link.github {
    color: var(--accent-cyan);
  }

  .team-contact-link:hover {
    color: #ffffff;
    text-shadow: 0 0 8px rgba(34,211,238,0.6);
  }

  .contributors-header {
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: rgba(0,255,0,0.05);
    border: 1px solid rgba(0,255,0,0.3);
    border-left: 4px solid var(--accent-cyan);
  }

  .contributors-header h2 {
    font-size: 2rem;
    color: #00ff00;
    margin: 0 0 0.5rem 0;
    font-family: 'Courier New',monospace;
    font-weight: 900;
  }

  .contributors-header h2::before {
    content: '> ';
    color: var(--accent-cyan);
  }

  .contributors-header .highlight {
    color: var(--accent-cyan);
    text-shadow: 0 0 10px rgba(34,211,238,0.5);
  }

  .contributors-header p {
    color: #888;
    font-size: 0.95rem;
    max-width: 800px;
    margin: 1rem auto 0;
    line-height: 1.6;
  }
  
  .contributors-category {
    margin-bottom: 2.5rem;
  }

  .category-title {
    font-size: 1.5rem;
    color: var(--accent-cyan);
    margin-bottom: 1.5rem;
    font-family: 'Courier New',monospace;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    text-shadow: 0 0 10px rgba(34,211,238,0.5);
  }

  .category-title::before {
    content: '> ';
    color: #00ff00;
  }
  
  .contributors-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .contributor-card {
    background: rgba(0,0,0,0.4);
    padding: 1.2rem;
    border: 1px solid rgba(0,255,0,0.2);
    border-left: 3px solid rgba(34,211,238,0.5);
    transition: all 0.3s;
    text-align: left;
  }

  .contributor-card:hover {
    transform: translateX(4px);
    box-shadow: 0 0 15px rgba(0,0,0,0.4);
    border-left-color: var(--accent-cyan);
  }

  .contributor-card-header {
    display: flex;
    gap: 1rem;
    align-items: center;
    margin-bottom: 0.8rem;
  }

  .contributor-avatar {
    width: 64px;
    height: 64px;
    border-radius: 12px;
    object-fit: cover;
    background: rgba(0,0,0,0.4);
    flex-shrink: 0;
    border: 1px solid rgba(0,255,0,0.2);
  }

  .contributor-name {
    font-size: 1rem;
    color: var(--accent-cyan);
    margin: 0 0 0.3rem 0;
    font-weight: bold;
  }

  .contributor-name::before {
    content: '> ';
    color: #00ff00;
  }

  .contributor-title {
    color: #00ff00;
    font-size: 0.8rem;
    margin-bottom: 0.3rem;
    font-style: italic;
  }

  .contributor-affiliation,
  .contributor-email,
  .contributor-expertise {
    color: #888;
    font-size: 0.75rem;
    line-height: 1.4;
    margin-top: 0.35rem;
  }

  .contributor-email {
    color: #00ff00;
  }

  .contributor-expertise::before {
    content: '// ';
    color: #666;
  }
  
  .contributors-footer {
    margin-top: 2rem;
    padding: 1.5rem;
    background: rgba(0,0,0,0.4);
    border: 1px solid rgba(0,255,0,0.3);
    border-left: 4px solid var(--accent-cyan);
  }

  .contributors-footer p {
    color: #00ff00;
    font-size: 0.85rem;
    line-height: 1.6;
    margin: 0;
    text-align: left;
  }

  @media (max-width: 768px) { 
    .footer {
      margin-top: 0;
      padding: 10px 0;
    }

    .footer-nav,
    .footer-game-label {
      display: none;
    }

    .terminal-popup { 
      max-width: 100%; 
      max-height: 95vh; 
    }

    .terminal-tabs { 
      overflow-x: auto; 
    }

    .terminal-tab { 
      padding: 0.6rem 1rem; 
      font-size: 0.75rem; 
      white-space: nowrap; 
    }

    .terminal-body { 
      padding: 1.5rem; 
      font-size: 13px; 
    }

    .team-grid, 
    .contributors-grid { 
      grid-template-columns: 1fr; 
    }

    .vision-mission { 
      grid-template-columns: 1fr; 
    }

    .team-contact-card {
      margin-top: 1rem;
      padding: 1.2rem;
    }
  }

  @media (max-width: 480px) { 
    .terminal-title { 
      font-size: 11px; 
    }

    .about-hero h2, 
    .team-header h2, 
    .contributors-header h2 { 
      font-size: 1.5rem; 
    }
  }
`;

const TEAM_DATA = [
  { id: 1, image: ishImg, name: 'ISA', role: 'Project Manager', specialty: 'Leadership & Vision', responsibilities: ['Project coordination', 'Environment art', 'Creative direction', 'Character design'] },
  { id: 2, image: junImg, name: 'JUN', role: 'Lead Programmer', specialty: 'Code Architecture', responsibilities: ['Game mechanics programming', 'System architecture', 'Bug fixing'] },
  { id: 3, image: kyImg, name: 'ALIYAH', role: 'Lead Designer', specialty: 'Visual Design & UX', responsibilities: ['UI/UX design', 'Visual aesthetics', 'Design documentation'] },
  { id: 4, image: melImg, name: 'MELODY', role: 'AR Developer', specialty: 'Backend Systems', responsibilities: ['Backend development', 'AR Development', 'Performance optimization'] },
  { id: 5, image: xanImg, name: 'XANDY', role: 'Designer', specialty: 'Creative Design', responsibilities: ['UI/UX Designer'] }
];

const CONTRIBUTORS_DATA = {
  academic: [
    {
      image: edImg,
      name: 'Sir Lord Edgardian J. Tavu',
      title: 'Project Advisor',
      affiliation: 'Computer Science Head'
    },
    {
      image: elmerImg,
      name: 'Sir Elmer M. Aliño',
      title: 'Capstone Professor',
      affiliation: 'Professor of IT'
    },
    {
      image: alvinImg,
      name: 'Sir Alvin E. Camacho',
      title: 'IT Head',
      affiliation: 'Information Technology Head'
    }
  ],
  historians: [
    {
      name: 'April Hope Castro',
      title: 'Assistant Professor',
      email: 'atcastro1@up.edu.ph',
      affiliation: 'UP Los Baños',
      expertise: 'Local History, Biography, Archival Research, Vocabularies, Deportados, Institutional History, and Feminist Studies'
    },
    {
      name: 'Eugene Raymond Crudo',
      title: 'Assistant Professor',
      email: 'epcrudo@up.edu.ph',
      affiliation: 'UP Los Baños',
      expertise: 'Art History, Classical Sculpture, Local History, Cultural Heritage, Rizal Studies, and historical game consultation'
    }
  ],
  community: [
    { name: 'Beta Tester 1', title: 'Quality Assurance', affiliation: 'Gaming Community' },
    { name: 'Beta Tester 2', title: 'Quality Assurance', affiliation: 'Gaming Community' },
    { name: 'Beta Tester 3', title: 'Gameplay Feedback', affiliation: 'Gaming Community' },
    { name: 'Beta Tester 4', title: 'User Experience', affiliation: 'Gaming Community' },
    { name: 'Beta Tester 5', title: 'Performance Testing', affiliation: 'Gaming Community' }
  ]
};

export default function Footer() {
  const [showTerminal, setShowTerminal] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [showLegal, setShowLegal] = useState(false);
  const [legalTab, setLegalTab] = useState('privacy');

  return (
    <>
      <style>{FOOTER_STYLES}</style>

      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <button
              className="footer-logo"
              onClick={() => setShowTerminal(true)}
            >
              POWERED BY COFFEE
            </button>

            <nav className="footer-nav">
              <span className="footer-game-label">Game:</span>
              <span className="footer-link" onClick={() => { setShowTerminal(true); setActiveTab('about'); }}>About</span>
              <span className="footer-link" onClick={() => { setShowTerminal(true); setActiveTab('team'); }}>Meet the Team</span>
              <span className="footer-link" onClick={() => { setShowTerminal(true); setActiveTab('contributors'); }}>Contributors</span>
              <span className="footer-link" onClick={() => { setShowTerminal(true); setActiveTab('faq'); }}>FAQ</span>
            </nav>
          </div>

          <div className="footer-bottom">
            <p className="footer-text">© 2025 SIKLAB. All rights reserved.</p>

            <div className="footer-legal">
              <span className="footer-legal-label">Legal:</span>
              <span className="footer-link" onClick={() => { setShowLegal(true); setLegalTab('privacy'); }}>Privacy</span>
              <span className="footer-link" onClick={() => { setShowLegal(true); setLegalTab('terms'); }}>Terms</span>
            </div>
          </div>
        </div>
      </footer>

      {showTerminal && (
        <div className="terminal-overlay" onClick={(e) => e.target === e.currentTarget && setShowTerminal(false)}>
          <div className="terminal-popup">
            <div className="terminal-window">
              <div className="terminal-tabs">
                <div className="terminal-tabs-wrapper">
                  <button className={`terminal-tab ${activeTab === 'about' ? 'active' : ''}`} onClick={() => setActiveTab('about')}>about.txt</button>
                  <button className={`terminal-tab ${activeTab === 'team' ? 'active' : ''}`} onClick={() => setActiveTab('team')}>team.sh</button>
                  <button className={`terminal-tab ${activeTab === 'contributors' ? 'active' : ''}`} onClick={() => setActiveTab('contributors')}>contributors.log</button>
                  <button className={`terminal-tab ${activeTab === 'faq' ? 'active' : ''}`} onClick={() => setActiveTab('faq')}>faq.md</button>
                </div>

                <button className="terminal-close" onClick={() => setShowTerminal(false)}>×</button>
              </div>

              <div className="terminal-body">
                {activeTab === 'about' && (
                  <div className="about-section">
                    <div className="terminal-prompt-line">cat about.txt</div>

                    <div className="about-hero">
                      <h2>SIKLAB</h2>
                      <p>
                        SIKLAB is an innovative mobile game that combines engaging gameplay with Philippine history and culture.
                        Through immersive storytelling and interactive experiences, we aim to educate and inspire players about the rich heritage of the Philippines.
                      </p>
                    </div>

                    <div className="vision-mission">
                      <div className="vm-card">
                        <h3>👁️ Vision</h3>
                        <p>
                          To create an engaging platform that preserves and promotes Philippine culture and history through
                          innovative gaming experiences, inspiring the next generation to appreciate and celebrate our heritage.
                        </p>
                      </div>

                      <div className="vm-card">
                        <h3>🎯 Mission</h3>
                        <p>
                          To develop high-quality educational games that blend entertainment with cultural learning, making
                          Philippine history accessible and exciting for players of all ages through cutting-edge technology
                          and compelling narratives.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'team' && (
                  <div className="team-section">
                    <div className="terminal-prompt-line">./team.sh --list-all</div>

                    <div className="team-header">
                      <h2>Meet the Team</h2>
                      <p>The passionate developers behind SIKLAB</p>
                    </div>

                    <div className="team-grid">
                      {TEAM_DATA.map(member => (
                        <div key={member.id} className="team-card">
                          <div className="team-card-header">
                            <img className="team-avatar" src={member.image} alt={member.name} />

                            <div className="team-info">
                              <h3 className="team-name">{member.name}</h3>
                              <div className="team-role">{member.role}</div>
                            </div>
                          </div>

                          <div className="team-specialty">{member.specialty}</div>

                          <ul className="team-responsibilities">
                            {member.responsibilities.map((resp, idx) => (
                              <li key={idx}>{resp}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <div className="team-contact-card">
                      <h3 className="team-contact-title">Contact Us</h3>

                      <div className="team-contact-links">
                        <a
                          className="team-contact-link"
                          href="mailto:bycoffeepowered@gmail.com"
                        >
                          📧 bycoffeepowered@gmail.com
                        </a>

                        <a
                          className="team-contact-link github"
                          href="https://github.com/bycoffeepowered-prog"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          💻 github.com/bycoffeepowered-prog
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'contributors' && (
                  <div className="contributors-section">
                    <div className="terminal-prompt-line">tail -f contributors.log</div>

                    <div className="contributors-header">
                      <h2>SYSTEM <span className="highlight">CONTRIBUTORS</span></h2>
                      <p>
                        SIKLAB is supported by academic validators, historians, data contributors, and community members
                        who helped strengthen the project's accuracy, cultural authenticity, and overall development.
                      </p>
                    </div>

                    <div className="contributors-category">
                      <h3 className="category-title">Academic Validation</h3>

                      <div className="contributors-grid">
                        {CONTRIBUTORS_DATA.academic.map((contributor, idx) => (
                          <div key={idx} className="contributor-card">
                            <div className="contributor-card-header">
                              {contributor.image && (
                                <img className="contributor-avatar" src={contributor.image} alt={contributor.name} />
                              )}

                              <div>
                                <h4 className="contributor-name">{contributor.name}</h4>
                                <div className="contributor-title">{contributor.title}</div>
                                <div className="contributor-affiliation">{contributor.affiliation}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="contributors-category">
                      <h3 className="category-title">Historians & Data Contributors</h3>

                      <div className="contributors-grid">
                        {CONTRIBUTORS_DATA.historians.map((contributor, idx) => (
                          <div key={idx} className="contributor-card">
                            <h4 className="contributor-name">{contributor.name}</h4>
                            <div className="contributor-title">{contributor.title}</div>
                            <div className="contributor-email">{contributor.email}</div>
                            <div className="contributor-affiliation">{contributor.affiliation}</div>
                            <div className="contributor-expertise">{contributor.expertise}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="contributors-category">
                      <h3 className="category-title">Community Contributors</h3>

                      <div className="contributors-grid">
                        {CONTRIBUTORS_DATA.community.map((contributor, idx) => (
                          <div key={idx} className="contributor-card">
                            <h4 className="contributor-name">{contributor.name}</h4>
                            <div className="contributor-title">{contributor.title}</div>
                            <div className="contributor-affiliation">{contributor.affiliation}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="contributors-footer">
                      <p>
                        <strong>
                          The Powered By Coffee team extends its gratitude to every contributor who helped validate,
                          review, and improve SIKLAB. Their guidance helped support historical accuracy, cultural
                          authenticity, and meaningful Filipino storytelling throughout the project.
                        </strong>
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'faq' && (
                  <div className="about-section">
                    <div className="terminal-prompt-line">cat faq.md</div>

                    <div className="about-hero">
                      <h2>Frequently Asked Questions</h2>
                      <p>Got questions? We've got answers!</p>
                    </div>

                    <div className="vm-card">
                      <h3>What is SIKLAB?</h3>
                      <p>
                        SIKLAB is an educational mobile game that brings Philippine history and culture to life through
                        engaging gameplay and interactive storytelling.
                      </p>
                    </div>

                    <div className="vm-card">
                      <h3>What platforms is SIKLAB available on?</h3>
                      <p>
                        SIKLAB is designed for mobile devices and will be available on both iOS and Android platforms.
                      </p>
                    </div>

                    <div className="vm-card">
                      <h3>Is SIKLAB free to play?</h3>
                      <p>
                        Yes! SIKLAB is free to download and play, with optional in-game features to enhance your experience.
                      </p>
                    </div>

                    <div className="vm-card">
                      <h3>How can I provide feedback?</h3>
                      <p>
                        We welcome feedback! You can reach out to our team through the game's support section or
                        contact us directly through our official channels.
                      </p>
                    </div>

                    <div className="vm-card">
                      <h3>Is the historical content accurate?</h3>
                      <p>
                        Absolutely! Our content is validated by academic advisors and historians to ensure historical
                        accuracy and cultural authenticity.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showLegal && (
        <div className="terminal-overlay" onClick={(e) => e.target === e.currentTarget && setShowLegal(false)}>
          <div className="terminal-popup">
            <div className="terminal-window">
              <div className="terminal-tabs">
                <div className="terminal-tabs-wrapper">
                  <button className={`terminal-tab ${legalTab === 'privacy' ? 'active' : ''}`} onClick={() => setLegalTab('privacy')}>privacy.txt</button>
                  <button className={`terminal-tab ${legalTab === 'terms' ? 'active' : ''}`} onClick={() => setLegalTab('terms')}>terms.txt</button>
                </div>

                <button className="terminal-close" onClick={() => setShowLegal(false)}>×</button>
              </div>

              <div className="terminal-body">
                {legalTab === 'privacy' && (
                  <div className="about-section">
                    <div className="terminal-prompt-line">cat privacy.txt</div>

                    <div className="about-hero">
                      <h2>Privacy Policy</h2>
                      <p>Last updated: February 2025</p>
                    </div>

                    <div className="vm-card">
                      <h3>Information We Collect</h3>
                      <p>
                        SIKLAB collects minimal user data necessary for gameplay functionality, including game progress,
                        preferences, and device information to optimize your gaming experience.
                      </p>
                    </div>

                    <div className="vm-card">
                      <h3>How We Use Your Information</h3>
                      <p>
                        Your data is used solely to enhance your gaming experience, save your progress, and improve
                        our game based on usage patterns. We never sell your personal information to third parties.
                      </p>
                    </div>

                    <div className="vm-card">
                      <h3>Data Security</h3>
                      <p>
                        We implement industry-standard security measures to protect your data. All information is
                        encrypted and stored securely on our servers.
                      </p>
                    </div>

                    <div className="vm-card">
                      <h3>Your Rights</h3>
                      <p>
                        You have the right to access, modify, or delete your data at any time. Contact our support
                        team to exercise these rights.
                      </p>
                    </div>

                    <div className="vm-card">
                      <h3>Children's Privacy</h3>
                      <p>
                        SIKLAB is designed to be educational and family-friendly. We do not knowingly collect personal
                        information from children under 13 without parental consent.
                      </p>
                    </div>

                    <div className="vm-card">
                      <h3>Contact Us</h3>
                      <p>
                        If you have any questions about our privacy practices, please contact our team through
                        the game's support section.
                      </p>
                    </div>
                  </div>
                )}

                {legalTab === 'terms' && (
                  <div className="about-section">
                    <div className="terminal-prompt-line">cat terms.txt</div>

                    <div className="about-hero">
                      <h2>Terms of Service</h2>
                      <p>Last updated: February 2025</p>
                    </div>

                    <div className="vm-card">
                      <h3>Acceptance of Terms</h3>
                      <p>
                        By downloading and playing SIKLAB, you agree to these Terms of Service. If you do not agree
                        with these terms, please do not use the game.
                      </p>
                    </div>

                    <div className="vm-card">
                      <h3>License to Use</h3>
                      <p>
                        SIKLAB grants you a limited, non-exclusive, non-transferable license to download and play
                        the game for personal, non-commercial use.
                      </p>
                    </div>

                    <div className="vm-card">
                      <h3>User Conduct</h3>
                      <p>
                        Users must not attempt to hack, modify, or exploit the game. Any cheating, harassment, or
                        inappropriate behavior may result in account suspension or termination.
                      </p>
                    </div>

                    <div className="vm-card">
                      <h3>Intellectual Property</h3>
                      <p>
                        All content in SIKLAB, including graphics, code, storylines, and characters, are the property
                        of the Powered By Coffee development team and protected by copyright laws.
                      </p>
                    </div>

                    <div className="vm-card">
                      <h3>Disclaimers</h3>
                      <p>
                        SIKLAB is provided "as is" without warranties of any kind. We strive for accuracy in our
                        historical content but cannot guarantee complete accuracy in all cases.
                      </p>
                    </div>

                    <div className="vm-card">
                      <h3>Limitation of Liability</h3>
                      <p>
                        The Powered By Coffee team shall not be liable for any damages arising from the use or inability to
                        use the game, including data loss or device issues.
                      </p>
                    </div>

                    <div className="vm-card">
                      <h3>Changes to Terms</h3>
                      <p>
                        We reserve the right to modify these terms at any time. Continued use of SIKLAB after
                        changes constitutes acceptance of the new terms.
                      </p>
                    </div>

                    <div className="vm-card">
                      <h3>Contact Information</h3>
                      <p>
                        For questions about these Terms of Service, please contact our support team through
                        the game's official channels.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}