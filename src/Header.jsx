import { useState } from 'react';

const siklabGif = '/images/siklab.gif';

const HEADER_STYLES = `
  :root {
    --site-header-height: 104px;
  }

  .retro-site {
    padding-top: var(--site-header-height);
  }

  .header {
    background: var(--card-bg-solid, #020617);
    border-bottom: 4px solid var(--accent-color, #ef4444);
    box-shadow: 0 4px 20px var(--shadow, rgba(0,0,0,0.5));
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999999;
    width: 100%;
    overflow: visible;
    transition: background 0.3s ease, border-color 0.3s ease;
  }

  .header-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.65rem 0;
    flex-wrap: wrap;
    position: relative;
    min-height: 84px;
  }

  .logo {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .logo-gif {
    height: 80px;
    width: auto;
    object-fit: contain;
    display: block;
    flex-shrink: 0;
  }

  .nav-tabs {
    display: flex;
    gap: 0.35rem;
    align-items: center;
    flex-wrap: wrap;
  }

  .nav-tab {
    padding: 0.4rem 0.85rem;
    border: 2px solid rgba(239,68,68,0.5);
    background: transparent;
    color: #fca5a5;
    font-weight: bold;
    font-family: 'Courier New', monospace;
    letter-spacing: 0.05em;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.75rem;
    white-space: nowrap;
  }

  .nav-tab:hover {
    background: rgba(220,38,38,0.2);
  }

  .nav-tab.active {
    background: #dc2626;
    border-color: #fca5a5;
    color: white;
    box-shadow: 0 0 20px rgba(220,38,38,0.5);
  }

  .menu-toggle {
    display: none;
    padding: 0.35rem 0.65rem;
    border: 2px solid rgba(255,255,255,0.3);
    background: rgba(255,255,255,0.1);
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    line-height: 1;
  }

  .theme-toggle-btn,
  .mute-btn {
    padding: 0.4rem 0.65rem;
    border: 2px solid rgba(255,255,255,0.3);
    background: rgba(255,255,255,0.1);
    color: white;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.2s;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 38px;
  }

  .theme-toggle-btn:hover,
  .mute-btn:hover,
  .menu-toggle:hover {
    background: rgba(255,255,255,0.2);
    transform: scale(1.05);
  }

  .mute-btn.muted {
    border-color: rgba(239,68,68,0.6);
    background: rgba(239,68,68,0.15);
  }

  .header-spacer {
    flex: 1;
  }

  @media (max-width: 768px) {
    :root {
      --site-header-height: 54px;
    }

    .header {
      border-bottom-width: 2px;
    }

    .header-row {
      padding: 6px 0;
      gap: 6px;
      flex-wrap: nowrap;
      min-height: 42px;
    }

    .logo-gif {
      height: 42px;
    }

    .menu-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 34px;
      height: 34px;
      padding: 0;
    }

    .nav-tabs {
      display: none;
      flex-direction: column;
      width: auto;
      gap: 6px;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: var(--card-bg-solid, #020617);
      padding: 10px;
      border-bottom: 2px solid var(--accent-color, #ef4444);
      z-index: 999999;
    }

    .nav-tabs.open {
      display: flex;
    }

    .nav-tab {
      width: 100%;
      text-align: left;
      font-size: 11px;
      padding: 10px;
    }

    .theme-toggle-btn,
    .mute-btn {
      min-width: 34px;
      height: 34px;
      padding: 0;
      font-size: 0.9rem;
    }
  }

  @media (max-width: 400px) {
    :root {
      --site-header-height: 50px;
    }

    .header-row {
      min-height: 38px;
    }

    .logo-gif {
      height: 38px;
    }
  }
`;

const NAV_ITEMS = [
  { key: 'home', label: 'HOME' },
  { key: 'about', label: 'ABOUT GAME' },
  { key: 'mechanics', label: 'MECHANICS' },
  { key: 'download', label: 'DOWNLOAD' },
  { key: 'feedback', label: 'FEEDBACK' },
];

export default function Header({
  activeSection,
  scrollToSection,
  lightMode,
  toggleTheme,
  muted,
  toggleMute,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavClick = (key) => {
    scrollToSection(key);
    setMenuOpen(false);
  };

  return (
    <>
      <style>{HEADER_STYLES}</style>

      <header className="header">
        <div className="container">
          <div className="header-row">
            <div className="logo">
              <img src={siklabGif} alt="SIKLAB Logo" className="logo-gif" />
            </div>

            <button
              className="menu-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              ☰
            </button>

            <div className={`nav-tabs ${menuOpen ? 'open' : ''}`}>
              {NAV_ITEMS.map(({ key, label }) => (
                <button
                  key={key}
                  className={`nav-tab ${activeSection === key ? 'active' : ''}`}
                  onClick={() => handleNavClick(key)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="header-spacer" />

            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title={lightMode ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {lightMode ? '🌙' : '☀️'}
            </button>

            <button
              className={`mute-btn${muted ? ' muted' : ''}`}
              onClick={toggleMute}
              aria-label={muted ? 'Unmute music' : 'Mute music'}
              title={muted ? 'Unmute music' : 'Mute music'}
            >
              {muted ? '🔇' : '🔊'}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}