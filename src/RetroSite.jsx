import { useState, useRef, useEffect } from 'react';
import communitySfx from './assets/sounds/Community.mp3';

import Header from './Header';
import Hero from './Hero';
import MainContent from './MainContent';
import MechanicsSection from './MechanicsSection';
import DownloadSection from './DownloadSection';
import ScenerySection from './ScenerySection';
import FeedbackSection from './FeedbackSection';
import Footer from './Footer';

const GLOBAL_STYLES = `
  * { margin: 0; padding: 0; box-sizing: border-box; -webkit-font-smoothing: none; }
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
  const [muted, setMuted] = useState(false); // 👈 new

  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const mechanicsRef = useRef(null);
  const downloadRef = useRef(null);
  const feedbackRef = useRef(null);
  const sceneryCarouselRef = useRef(null);
  const communityAudioRef = useRef(null);

  useEffect(() => {
    const a = new Audio(communitySfx);
    a.loop = true;
    a.volume = 0.35;
    communityAudioRef.current = a;
    a.play().catch(() => {});
    return () => { a.pause(); a.currentTime = 0; communityAudioRef.current = null; };
  }, []);

  // 👈 new: sync muted state with audio element
  useEffect(() => {
    if (communityAudioRef.current) {
      communityAudioRef.current.muted = muted;
    }
  }, [muted]);

  const scrollToSection = (key) => {
    const refs = { home: homeRef, about: aboutRef, mechanics: mechanicsRef, download: downloadRef, feedback: feedbackRef };
    const ref = refs[key];
    if (ref?.current) {
      window.scrollTo({ top: ref.current.offsetTop - 80, behavior: 'smooth' });
      setActiveSection(key);
    }
  };

  const scrollCarousel = (dir) => {
    sceneryCarouselRef.current?.scrollBy({ left: dir === 'left' ? -350 : 350, behavior: 'smooth' });
  };

  useEffect(() => {
    const onScroll = () => {
      const sections = [
        { key: 'home', ref: homeRef }, { key: 'about', ref: aboutRef },
        { key: 'mechanics', ref: mechanicsRef }, { key: 'download', ref: downloadRef },
        { key: 'feedback', ref: feedbackRef }
      ];
      const pos = window.scrollY + 150;
      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i].ref.current && sections[i].ref.current.offsetTop <= pos) {
          setActiveSection(sections[i].key); break;
        }
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
          activeSection={activeSection}
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
        </main>

        <Footer />
      </div>
    </>
  );
}