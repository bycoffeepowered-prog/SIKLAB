import { useState, useRef, useEffect, useCallback } from 'react';
import communitySfx from './assets/sounds/Community.mp3';

import Header from './Header';
import Hero from './Hero';
import MainContent from './MainContent';
import MechanicsSection from './MechanicsSection';
import DownloadSection from './DownloadSection';
import FeedbackSection from './FeedbackSection';
import Footer from './Footer';

const GLOBAL_STYLES = `
  * { margin: 0; padding: 0; box-sizing: border-box; -webkit-font-smoothing: none; }
  html {
    scroll-padding-top: var(--site-header-height, 96px);
    scroll-snap-type: y proximity;
  }
  body {
    font-family: 'Courier New', monospace;
    image-rendering: pixelated;
    margin: 0;
    overflow-x: hidden;
  }
  .retro-site {
    min-height: 100vh;
    background: var(--bg-gradient);
    color: var(--text-primary);
    position: relative;
    transition: background 0.3s ease, color 0.3s ease;
  }
  .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
  .main-scrollable { display: flex; flex-direction: column; }
  .section-full { width: 100%; }
  .tab-screen {
    height: calc(100dvh - var(--site-header-height, 96px));
    min-height: calc(100dvh - var(--site-header-height, 96px));
    max-height: calc(100dvh - var(--site-header-height, 96px));
    scroll-snap-align: start;
    overflow: hidden;
  }
  .footer-snap {
    scroll-snap-align: start;
  }
  .scalloped-border {
    position: relative;
    width: 100%;
    height: 40px;
    flex-shrink: 0;
    background-color: #fef3c7;
    overflow: hidden;
    z-index: 10;
  }
  .scalloped-border::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 20px 0px, var(--bg-primary) 20px, transparent 21px);
    background-size: 40px 40px;
    background-repeat: repeat-x;
  }
  .scalloped-border::after {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 20px 40px, #fef3c7 20px, transparent 21px);
    background-size: 40px 40px;
    background-repeat: repeat-x;
  }
  .scalloped-border.inverted {
    background-color: var(--bg-primary);
    transition: background-color 0.3s ease;
  }
  .scalloped-border.inverted::before {
    background: radial-gradient(circle at 20px 0px, #fef3c7 20px, transparent 21px);
    background-size: 40px 40px;
    background-repeat: repeat-x;
  }
  .scalloped-border.inverted::after {
    background: radial-gradient(circle at 20px 40px, var(--bg-primary) 20px, transparent 21px);
    background-size: 40px 40px;
    background-repeat: repeat-x;
  }
`;

const USERS_DB = {};

export default function RetroSite({ lightMode, toggleTheme }) {
  const [activeSection, setActiveSection] = useState('home');
  const [showMapPopup, setShowMapPopup] = useState(false);
  const [showCharacterPopup, setShowCharacterPopup] = useState(false);
  const [showARPopup, setShowARPopup] = useState(false);
  const [showCollectiblesPopup, setShowCollectiblesPopup] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [characterCategory, setCharacterCategory] = useState('main');
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [authModal, setAuthModal] = useState(null);
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [userCount, setUserCount] = useState(0);
  const [muted, setMuted] = useState(false);

  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const mechanicsRef = useRef(null);
  const downloadRef = useRef(null);
  const feedbackRef = useRef(null);
  const footerRef = useRef(null);
  const sceneryCarouselRef = useRef(null);
  const communityAudioRef = useRef(null);

  const refs = {
    home: homeRef,
    about: aboutRef,
    mechanics: mechanicsRef,
    download: downloadRef,
    feedback: feedbackRef,
    footer: footerRef,
  };

  const scrollToSection = useCallback((key) => {
    const el = refs[key]?.current;
    setActiveSection(key);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  useEffect(() => {
    const a = new Audio(communitySfx);
    a.loop = true;
    a.volume = 0.35;
    communityAudioRef.current = a;
    a.play().catch(() => {});
    return () => { a.pause(); a.currentTime = 0; communityAudioRef.current = null; };
  }, []);

  useEffect(() => {
    if (communityAudioRef.current) {
      communityAudioRef.current.muted = muted;
    }
  }, [muted]);

  useEffect(() => {
    const sections = [
      { key: 'home', ref: homeRef },
      { key: 'about', ref: aboutRef },
      { key: 'mechanics', ref: mechanicsRef },
      { key: 'download', ref: downloadRef },
      { key: 'feedback', ref: feedbackRef },
      { key: 'footer', ref: footerRef },
    ];
    const onScroll = () => {
      const headerH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--site-header-height')) || 96;
      const pos = window.scrollY + headerH + 8;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sections[i].ref.current;
        if (el && el.offsetTop <= pos) {
          setActiveSection(sections[i].key);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollCarousel = (dir) => {
    sceneryCarouselRef.current?.scrollBy({ left: dir === 'left' ? -350 : 350, behavior: 'smooth' });
  };

  const openModal = (mode) => { setAuthModal(mode); setAuthError(''); setAuthForm({ name: '', email: '', password: '' }); };
  const closeModal = () => { setAuthModal(null); setAuthError(''); };
  const handleAuthInput = (e) => setAuthForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSignup = (e) => {
    e.preventDefault();
    const { name, email, password } = authForm;
    if (!name || !email || !password) { setAuthError('All fields are required.'); return; }
    if (USERS_DB[email]) { setAuthError('An account with this email already exists.'); return; }
    USERS_DB[email] = { name, password };
    setUserCount(Object.keys(USERS_DB).length);
    setCurrentUser({ name, email });
    closeModal();
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const { email, password } = authForm;
    if (!email || !password) { setAuthError('Email and password are required.'); return; }
    const user = USERS_DB[email];
    if (!user) { setAuthError('No account found with this email.'); return; }
    if (user.password !== password) { setAuthError('Incorrect password.'); return; }
    setCurrentUser({ name: user.name, email });
    closeModal();
  };

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <div className="retro-site">
        <Header
          activeSection={activeSection === 'footer' ? 'feedback' : activeSection}
          scrollToSection={scrollToSection}
          currentUser={currentUser}
          userCount={userCount}
          authModal={authModal}
          authForm={authForm}
          authError={authError}
          openModal={openModal}
          closeModal={closeModal}
          handleAuthInput={handleAuthInput}
          handleLogin={handleLogin}
          handleSignup={handleSignup}
          handleLogout={() => setCurrentUser(null)}
          lightMode={lightMode}
          toggleTheme={toggleTheme}
          muted={muted}
          toggleMute={() => setMuted(m => !m)}
        />

        <main className="main-scrollable">
          <Hero ref={homeRef} />

          <MainContent
            ref={aboutRef}
            showMapPopup={showMapPopup}
            setShowMapPopup={setShowMapPopup}
            showCharacterPopup={showCharacterPopup}
            setShowCharacterPopup={setShowCharacterPopup}
            selectedCharacter={selectedCharacter}
            setSelectedCharacter={setSelectedCharacter}
            characterCategory={characterCategory}
            setCharacterCategory={setCharacterCategory}
            sceneryCarouselRef={sceneryCarouselRef}
            scrollCarousel={scrollCarousel}
            showARPopup={showARPopup}
            setShowARPopup={setShowARPopup}
            showCollectiblesPopup={showCollectiblesPopup}
            setShowCollectiblesPopup={setShowCollectiblesPopup}
          />

          <MechanicsSection
            ref={mechanicsRef}
            selectedMechanic={selectedMechanic}
            setSelectedMechanic={setSelectedMechanic}
          />

          <DownloadSection ref={downloadRef} />

          <FeedbackSection ref={feedbackRef} />

          <div className="footer-snap" ref={footerRef} id="credits">
            <Footer />
          </div>
        </main>
      </div>
    </>
  );
}
