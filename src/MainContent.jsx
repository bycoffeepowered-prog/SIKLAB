import { forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { useScrollAnimation } from './Usescrollanimation';

const MAIN_STYLES = `
  @keyframes mainPopUp { 
    from { opacity:0; transform:translateY(60px) scale(0.95); } 
    to { opacity:1; transform:translateY(0) scale(1); } 
  }
  @keyframes mcFadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes mcSlideUp { from { opacity:0; transform:translateY(40px) scale(0.95); } to { opacity:1; transform:translateY(0) scale(1); } }
  @keyframes mcSpin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
  @keyframes mcBounce { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
  @keyframes charFloat { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-20px); } }

  .main-content-wrapper {
    opacity: 0;
    transform: translateY(60px) scale(0.95);
  }
  .main-content-wrapper.animate-in {
    animation: mainPopUp 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }

  .main-content {
    background: #fef3c7;
    padding: 3rem 0;
  }
  
  .scalloped-border {
    position: relative;
    width: 100%;
    height: 40px;
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
  
  .main-title { font-size: 3rem; font-weight: 900; color: #1e293b; margin-bottom: 1rem; line-height: 1.1; letter-spacing: -0.02em; }
  .main-description { color: #475569; margin-bottom: 2rem; line-height: 1.6; }
  .room-sections-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 2rem; margin-bottom: 2rem; }
  .room-section { width: 100%; }
  .room-title { font-size: 2rem; font-weight: 900; color: #1e293b; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 4px solid #dc2626; line-height: 1.2; }
  .room-items { display: flex; flex-direction: column; gap: 1rem; }
  .room-card { background: white; border: 4px solid #1e293b; padding: 1rem; box-shadow: 8px 8px 0 rgba(0,0,0,0.2); }
  .room-card-content { display: flex; gap: 1rem; }
  .room-icon { font-size: 4rem; flex-shrink: 0; }
  .room-info { flex: 1; }
  .room-text { font-size: 0.875rem; color: #475569; margin-bottom: 0.5rem; line-height: 1.4; }
  .room-button { background: #1e293b; color: white; padding: 0.5rem 1rem; border: none; font-size: 0.75rem; font-weight: bold; font-family: 'Courier New', monospace; cursor: pointer; transition: background 0.2s; }
  .room-button:hover { background: #dc2626; }
  .additional-section { border-top: 4px solid #1e293b; padding-top: 2rem; }
  .mc-section-title { font-size: 2rem; font-weight: 900; color: #1e293b; margin-bottom: 1.5rem; line-height: 1.2; }
  .bottom-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(250px,1fr)); gap: 1.5rem; }
  .bottom-card { background: white; border: 4px solid #1e293b; padding: 1rem; box-shadow: 8px 8px 0 rgba(0,0,0,0.2); display: flex; flex-direction: column; }
  .bottom-icon { font-size: 4rem; text-align: center; margin-bottom: 1rem; }
  .bottom-text { font-size: 0.75rem; color: #475569; line-height: 1.4; margin-bottom: 1rem; flex: 1; }
  .bottom-button { width: 100%; background: #1e293b; color: white; padding: 0.75rem 1rem; border: none; font-size: 0.75rem; font-weight: bold; font-family: 'Courier New', monospace; cursor: pointer; transition: background 0.2s; }
  .bottom-button:hover { background: #dc2626; }

  /* Map popup - fixed to show full map without scrolling */
  .map-popup-overlay { 
    position: fixed; 
    inset: 0; 
    background: rgba(0,0,0,0.9); 
    backdrop-filter: blur(10px); 
    z-index: 99999; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    padding: 20px; 
    animation: mcFadeIn 0.3s ease-out; 
  }
  .map-popup-container { 
    width: auto; 
    max-width: 95vw; 
    max-height: 95vh; 
    background: linear-gradient(135deg,#f4e4c1 0%,#e8d5b7 100%); 
    border-radius: 12px; 
    border: 4px solid #8b7355; 
    box-shadow: 0 30px 80px rgba(0,0,0,0.9); 
    display: flex; 
    flex-direction: column; 
    overflow: hidden; 
    animation: mcSlideUp 0.4s ease-out; 
    position: relative; 
  }
  .floating-close { 
    position: absolute; 
    top: 1rem; 
    right: 1rem; 
    background: rgba(0,0,0,0.7); 
    border: 2px solid #fff; 
    color: #fff; 
    width: 40px; 
    height: 40px; 
    border-radius: 50%; 
    font-size: 24px; 
    cursor: pointer; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    transition: all 0.2s; 
    z-index: 100; 
    font-weight: bold; 
  }
  .floating-close:hover { background: #dc2626; transform: rotate(90deg); }

  .map-popup-content { 
    flex: 1; 
    overflow-y: auto; 
    padding: 1rem; 
    position: relative; 
    background: #f9f3e8; 
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    gap: 1rem; 
  }
  .map-grid-overlay { 
    position: absolute; 
    inset: 0; 
    background-image: repeating-linear-gradient(0deg,transparent,transparent 49px,rgba(139,115,85,0.1) 49px,rgba(139,115,85,0.1) 50px),repeating-linear-gradient(90deg,transparent,transparent 49px,rgba(139,115,85,0.1) 49px,rgba(139,115,85,0.1) 50px); 
    pointer-events: none; 
    opacity: 0.3; 
  }
  
  .map-footer { 
    padding: 1rem; 
    background: rgba(193,154,107,0.3); 
    border: 2px dashed #8b7355; 
    border-radius: 8px; 
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    font-family: 'Courier New',monospace; 
    color: #3d2817;
    width: 100%;
    position: relative;
    z-index: 1;
  }

  .map-footer-image-container {
    width: auto;
    max-width: 100%;
    height: 72vh;
    border: 4px solid #8b7355;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 6px 6px 12px rgba(0,0,0,0.4), inset 0 0 20px rgba(0,0,0,0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .map-footer-image-container:hover {
    transform: scale(1.02);
    box-shadow: 8px 8px 16px rgba(0,0,0,0.5), inset 0 0 20px rgba(0,0,0,0.1);
  }

  .map-footer-image {
    width: auto;
    height: 100%;
    display: block;
    object-fit: contain;
  }

  .map-footer-info {
    display: flex;
    align-items: center;
    gap: 2rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .map-coordinates { 
    display: flex; 
    flex-direction: column; 
    gap: 0.3rem; 
    font-size: 0.85rem;
    text-align: center;
  }

  .map-scale { 
    font-size: 0.75rem; 
    opacity: 0.8; 
  }

  .map-stamp { 
    background: rgba(139,115,85,0.2); 
    border: 2px solid #8b7355; 
    padding: 0.5rem 1rem; 
    border-radius: 4px; 
    font-weight: bold; 
    transform: rotate(-5deg); 
    font-family: 'Georgia',serif; 
  }

  /* Scenery carousel - infinite loop */
  .scenery-carousel-wrapper { position: relative; display: flex; align-items: center; gap: 14px; width: 100%; }
  .scenery-carousel { flex: 1; display: flex; gap: 28px; overflow-x: auto; padding: 16px 6px 24px; scroll-snap-type: x mandatory; scroll-behavior: smooth; scrollbar-width: none; }
  .scenery-carousel::-webkit-scrollbar { display: none; }
  .scenery-arrow { background: rgba(139,115,85,0.8); border-radius: 999px; border: 2px solid #3d2817; width: 40px; height: 40px; font-size: 22px; color: #f4e4c1; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.18s; flex-shrink: 0; }
  .scenery-arrow:hover { background: #8b7355; box-shadow: 0 4px 15px rgba(0,0,0,0.5); }
  .scenery-card { flex: 0 0 320px; scroll-snap-align: center; }
  .scenery-card-glass { position: relative; width: 100%; height: 440px; border-radius: 40px; padding: 22px 22px 26px; box-sizing: border-box; background: rgba(10,40,20,0.75); border: 1px solid rgba(255,255,255,0.35); backdrop-filter: blur(22px); display: flex; flex-direction: column; align-items: center; justify-content: space-between; transition: transform 0.2s ease,box-shadow 0.2s ease; cursor: pointer; }
  .scenery-card-glass:hover { transform: translateY(-8px); box-shadow: 0 12px 30px rgba(0,0,0,0.8); }
  .scenery-image-wrap { flex: 1; width: 100%; display: flex; align-items: center; justify-content: center; padding-bottom: 12px; overflow: hidden; }
  .scenery-image { max-width: 100%; width: 100%; height: 280px; object-fit: cover; border-radius: 20px; box-shadow: 0 8px 20px rgba(0,0,0,0.6); }
  .scenery-pill { margin-top: 8px; padding: 12px 28px; border-radius: 999px; border: none; background: linear-gradient(135deg,#2aa92a,#0f7e24); color: #fff; font-size: 18px; text-align: center; }

  /* Character popup - No header, floating X, bio only */
  .character-popup-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.95); backdrop-filter: blur(10px); z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 10px; animation: mcFadeIn 0.3s ease-out; }
  .character-popup-container { width: 100%; max-width: 1600px; height: 95vh; background: linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%); border-radius: 12px; border: 3px solid #e94560; box-shadow: 0 30px 80px rgba(0,0,0,0.9),0 0 50px rgba(233,69,96,0.3); display: flex; flex-direction: column; overflow: hidden; animation: mcSlideUp 0.4s ease-out; position: relative; }
  .character-popup-body { flex: 1; display: grid; grid-template-columns: 280px 1fr 320px; gap: 0; overflow: hidden; min-height: 0; }
  .character-grid-panel { background: rgba(0,0,0,0.4); border-right: 2px solid #e94560; display: flex; flex-direction: column; overflow: hidden; }
  .character-tabs { display: flex; background: rgba(0,0,0,0.6); border-bottom: 2px solid #e94560; flex-shrink: 0; }
  .character-tab { flex: 1; padding: 0.8rem; background: transparent; border: none; color: #888; font-family: 'Arial Black',sans-serif; font-size: 0.75rem; cursor: pointer; transition: all 0.2s; border-bottom: 3px solid transparent; }
  .character-tab:hover { background: rgba(233,69,96,0.2); color: #fff; }
  .character-tab.active { background: rgba(233,69,96,0.3); color: #e94560; border-bottom-color: #e94560; }
  .character-grid { flex: 1; padding: 1rem; overflow-y: auto; display: grid; grid-template-columns: repeat(2,1fr); gap: 0.8rem; align-content: start; }
  .character-grid.others { grid-template-columns: repeat(3, 1fr); gap: 0.5rem; }
  .character-grid.others .character-portrait { aspect-ratio: 1; }
  .character-grid.others .character-portrait img { min-width: 0; min-height: 0; object-fit: cover; object-position: center top; }
  .character-grid.others .character-portrait-name { font-size: 0.65rem; padding: 6px 3px 3px; line-height: 1.1; }
  .character-portrait { position: relative; aspect-ratio: 1; border: 3px solid #444; border-radius: 8px; overflow: hidden; cursor: pointer; transition: all 0.2s; background: linear-gradient(135deg,#1a1a2e,#0f3460); }
  .character-portrait img { width: 100%; height: 100%; object-fit: cover; object-position: center top; min-width: 120px; min-height: 120px; transition: transform 0.2s; }
  .character-portrait:hover { border-color: #e94560; transform: translateY(-4px); box-shadow: 0 8px 20px rgba(233,69,96,0.4); }
  .character-portrait:hover img { transform: scale(1.1); }
  .character-portrait.selected { border-color: #e94560; box-shadow: 0 0 20px rgba(233,69,96,0.6),inset 0 0 20px rgba(233,69,96,0.2); }
  .character-portrait-name { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top,rgba(0,0,0,0.9),transparent); color: #fff; padding: 8px 5px 5px; font-size: 0.75rem; font-weight: bold; text-align: center; }
  .character-display-panel { position: relative; display: flex; flex-direction: column; justify-content: flex-end; background: radial-gradient(circle at center,#e94560 0%,transparent 70%),linear-gradient(180deg,#0f3460 0%,#1a1a2e 100%); overflow: hidden; }
  .character-display-bg { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; overflow: hidden; }
  .character-display-image { width: 85%; height: 85%; object-fit: contain; filter: drop-shadow(0 20px 40px rgba(0,0,0,0.8)); animation: charFloat 3s ease-in-out infinite; }
  .character-display-info { position: relative; z-index: 2; background: linear-gradient(to top,rgba(0,0,0,0.9),transparent); padding: 1.5rem; }
  .character-name-bar { display: flex; justify-content: center; align-items: center; background: rgba(0,0,0,0.6); padding: 1rem; border-radius: 8px; border: 2px solid #e94560; }
  .character-name-text { color: #fff; font-size: 1.8rem; font-weight: bold; font-family: 'Impact',sans-serif; text-transform: uppercase; letter-spacing: 0.1em; text-shadow: 2px 2px 4px rgba(0,0,0,0.8); }
  .character-display-placeholder { text-align: center; color: #666; padding: 4rem 2rem; }
  .character-details-panel { background: rgba(0,0,0,0.4); border-left: 2px solid #e94560; padding: 2rem; overflow-y: auto; display: flex; flex-direction: column; }
  .character-section { background: rgba(255,255,255,0.05); border: 1px solid rgba(233,69,96,0.3); border-radius: 8px; padding: 1.5rem; }
  .char-section-title { color: #e94560; font-size: 0.9rem; margin: 0 0 1rem 0; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; }
  .character-bio { color: #ccc; line-height: 1.8; font-size: 0.9rem; }
  .character-details-placeholder { text-align: center; color: #666; padding: 3rem; }

  /* Generic popup for AR, Papers, Collectibles - Modern Anime Style */
  .generic-popup-overlay { 
    position: fixed !important; 
    inset: 0 !important; 
    background: rgba(0,0,0,0.85) !important; 
    backdrop-filter: blur(8px); 
    z-index: 9999999 !important; 
    display: flex !important; 
    align-items: center; 
    justify-content: center; 
    padding: 20px; 
    animation: mcFadeIn 0.3s ease-out; 
  }
  .generic-popup-container { 
    width: 100%; 
    max-width: 900px; 
    max-height: 85vh; 
    background: #e8e4d9;
    border-radius: 32px; 
    border: 8px solid #1a1a1a; 
    box-shadow: 0 40px 100px rgba(0,0,0,0.8); 
    display: flex; 
    flex-direction: column; 
    overflow: hidden; 
    animation: mcSlideUp 0.4s ease-out; 
    position: relative; 
  }
  .generic-popup-content { 
    flex: 1; 
    padding: 3rem 2.5rem; 
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem;
    align-items: center;
    overflow-y: auto;
  }
  .generic-left-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  .generic-popup-title {
    font-size: 3rem;
    font-weight: 900;
    color: #1a1a1a;
    line-height: 1;
    text-transform: uppercase;
    letter-spacing: -0.02em;
    margin: 0;
  }
  .generic-popup-description {
    font-size: 1rem;
    color: #4a4a4a;
    line-height: 1.6;
    margin: 0;
  }
  .generic-action-buttons {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }
  .generic-icon-btn {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #1a1a1a;
    color: #e8e4d9;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  .generic-icon-btn:hover {
    background: #333;
    transform: scale(1.1);
  }
  .generic-download-btn {
    flex: 1;
    padding: 0.9rem 2rem;
    background: #e8e4d9;
    color: #1a1a1a;
    border: 2px solid #1a1a1a;
    border-radius: 999px;
    font-size: 0.95rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: all 0.2s;
  }
  .generic-download-btn:hover {
    background: #1a1a1a;
    color: #e8e4d9;
  }
  .generic-right-section {
    position: relative;
    height: 100%;
    min-height: 400px;
  }
  .generic-image-card {
    position: relative;
    background: linear-gradient(135deg, #fff5e1 0%, #ffe4b8 100%);
    border: 4px solid #1a1a1a;
    border-radius: 24px;
    padding: 1.5rem;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    box-shadow: 8px 8px 0 rgba(0,0,0,0.15);
  }
  .generic-star-badge {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: #ffd93d;
    width: 40px;
    height: 80px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    padding: 0.5rem 0;
    box-shadow: 4px 4px 0 rgba(0,0,0,0.2);
  }
  .generic-star-badge::before,
  .generic-star-badge::after {
    content: "★";
    font-size: 1.2rem;
    color: #1a1a1a;
  }
  .generic-feature-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 12px;
  }
  .generic-badge-circle {
    position: absolute;
    bottom: 1.5rem;
    left: 50%;
    transform: translateX(-50%);
    background: #1a1a1a;
    color: #ffd93d;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 4px solid #ffd93d;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    font-weight: 700;
    text-align: center;
    text-transform: uppercase;
    line-height: 1.2;
    padding: 1rem;
    box-shadow: 0 8px 20px rgba(0,0,0,0.3);
  }
  .generic-badge-circle .badge-main {
    font-size: 0.65rem;
    margin-bottom: 0.3rem;
  }
  .generic-badge-circle .badge-sub {
    font-size: 0.55rem;
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    .generic-popup-content {
      grid-template-columns: 1fr;
      padding: 2rem 1.5rem;
    }
    .generic-popup-title {
      font-size: 2rem;
    }
    .generic-right-section {
      min-height: 300px;
    }
  }

  @media (max-width: 1000px) {
    .main-title { font-size: 2rem; }
    .room-sections-grid { grid-template-columns: 1fr; }
    .map-popup-container, .character-popup-container { max-width: 100%; height: 95vh; }
    .character-popup-body { grid-template-columns: 1fr; max-height: none; }
    .character-display-panel { order: 1; min-height: 300px; }
    .character-grid-panel { order: 2; border-right: none; border-top: 2px solid #e94560; }
    .character-details-panel { order: 3; border-left: none; border-top: 2px solid #e94560; }
    .character-name-text { font-size: 1.3rem; }
    .character-grid { grid-template-columns: repeat(3,1fr); }
    .map-footer-image-container {
      max-width: 100%;
    }
  }

  @media (max-width: 768px) {
    .scalloped-border { 
      height: 30px; 
    }
  }
  
  @media (max-width: 480px) {
    .scalloped-border { 
      height: 25px; 
    }
  }
`;

const CHARACTERS_DATA = {
  main: [
    { id: 1, name: 'Emmanuel', image: '/images/boy.png', bio: 'Isang estudyanteng kilala sa pagiging madiskarte at laging may plano para yumaman at umasenso sa buhay. Ngunit habang pilit niyang kinokontrol ang kanyang kapalaran, unti-unti niyang natutuklasan na may ibang plano ang tadhana para sa kanya.' },
    { id: 2, name: 'Grasya', image: '/images/girl.png', bio: 'Isang babaeng walang takot humarap sa panganib dahil sa kanyang pambihirang “matalas na pakiramdam.” Ngunit sa bawat pagkakataong nauunahan niya ang sakuna, may kapalit na pangyayaring hindi niya kailanman kayang hulaan.' }
  ],
  heroes: [
    { id: 3, name: 'Emilio Aguinaldo', image: '/images/ea.png', bio: 'Unang Pangulo ng Pilipinas na namuno sa rebolusyon laban sa Espanya at nagtatag ng unang pamahalaang rebolusyonaryo.'},
    { id: 4, name: 'Jose Rizal', image: '/images/rizal.png', bio: 'Isang pambansang bayani ng Pilipinas na manunulat at doktor na gumising sa damdaming makabayan laban sa kolonyalismong Espanyol.' },
    { id: 5, name: 'Juan Luna', image: '/images/Luna.png', bio: 'Isang kilalang pintor at rebolusyonaryong Pilipino na tanyag sa kanyang makasaysayang obra na sumasalamin sa diwa ng nasyonalismo.'}
  ],
  others: [
    { id: 6, name: 'Jelyn',         image: '/images/Jennib.png',    bio: 'Isang Chinoy na dalagang Caviteña na lumaki sa panahong buhay pa si Heneral Paua at umiikot ang bansa sa tensyon ng digmaan at pagbabago. Sa kabila ng kanyang tahimik na kilos, dala niya ang talas ng isip at tibay ng mga taong sanay mabuhay sa gitna ng kaguluhan.'},
    { id: 7, name: 'Maria',         image: '/images/maria.png',     bio: 'Kilala bilang “Distanciada” na tindera dahil sa kanyang talino, ganda, at malamig na pakikitungo sa iba. Ngunit sa harap ng taong mahal niya, unti-unting nawawala ang kanyang matigas na anyo at lumalabas ang tunay niyang lambing.' },
    { id: 8,  name: 'Nicholas',      image: '/images/josepa.png',    bio: 'Isang sundalong sunud-sunuran sa utos dahil sa takot na maparusahan o maiwan ng sistema. Kahit napapaligiran ng kapwa sundalo, araw-araw niyang dinadala ang matinding lungkot at pakiramdam ng pagiging nag-iisa.'},
    { id: 9, name: 'Luciano',       image: '/images/lancelot.png',  bio: 'Isang lalaking bihasa sa pagmaniobra ng sistema at paggamit ng batas para sa sariling kapakinabangan. Habang abala ang iba sa paghahanap ng sagot, matagal na niyang alam ang galaw ng laro at kung paano ito dayain.' },
    { id: 10, name: 'Josepa',        image: '/images/Nicholo.png',   bio: 'Isang istriktong gwardya na kilala sa matalas na paghihinala at walang pasensyang makinig sa paliwanag ng iba. Para sa kanya, mas mahalaga ang pagsunod sa batas kaysa sa emosyon ng tao.'},
    { id: 11, name: 'Jerome',        image: '/images/jerom.png',     bio: 'Isang binatang laging may gitara sa balikat at matatamis na salita sa labi. Madaling umibig at mas madaling mang-iwan, ngunit sa likod ng kanyang pagiging playboy ay isang pusong takot masaktan nang totoo.'},
    { id: 12, name: 'Rosa',          image: '/images/rosas.png',     bio: 'Isang babaeng madaling magalit at laging tila may dinadalang bigat sa dibdib. Minsan alam niya kung bakit siya galit, ngunit kadalasan ay siya mismo ang naliligaw sa sarili niyang emosyon.' },
    { id: 13, name: 'Boyet Junios',  image: '/images/bj.png',        bio: 'Halos hindi makita si Boyet dahil buhay niya ay umiikot lamang sa trabaho. Tahimik at masipag, ngunit kapalit ng kanyang sipag ay ang unti-unting paglayo niya sa mga taong mahalaga sa kanya.'},
    { id: 14,  name: 'Juan Melo',     image: '/images/melo.png',      bio: 'Ang "Tahimik na Matapang." Hindi siya mahilig sa maraming salita, ngunit sa kanyang mga kamay nakasalalay ang mga mahahalagang mensahe. Siya ang tagahatid ng liham na may dalang bigat ng katotohanan.' },
    { id: 15,  name: 'Maliya',        image: '/images/aliyahate.png', bio: 'Isang flight attendant na kilala sa pagiging mataray at matalim magsalita. Ngunit sa likod ng kanyang matigas na personalidad ay isang kaibigang handang magbigay ng pera at tumulong kahit siya mismo ang nauubos.'},
    { id: 16, name: 'Eumir',         image: '/images/euriblue.png',  bio: 'Maliit ngunit matipunong taga-greet sa pintuan ng paliparan na kilala sa pagiging mabait at palabiro. Ngunit kapag siya ang pinaka-kailangan, madalas siyang nawawala dahil nahihimbing na naman sa tulog.'},
    { id: 17, name: 'Manong Jhong',  image: '/images/ced.png',       bio: 'Ang maaasahang bagger ng paliparan na laging handang tumulong sa mabibigat na dala ng iba. Bukod sa husay niya sa basketball, nagbibigay rin sa kanya ng inspirasyon ang lihim niyang pagtingin sa kambal ng kanyang matalik na kaibigan.' },
    { id: 18,  name: 'Isa',           image: '/images/isawho.png',    bio: 'Isang dalagang nabubuhay sa alaala at pag-asa habang hinihintay ang pagbabalik ng kasintahan niyang si Jorge na nasa digmaan ng mga Hapones. Sa bawat himig ng musika, pilit niyang pinatatag ang pusong unti-unting nilalamon ng pangungulila.'}
    
    
    
  ]
};

const SCENERY_DATA = [
  { id: 1, name: 'Gomburza Monument', image: '/images/gomburza.png',     url: 'https://memory.nhcp.gov.ph/collections/?ptermid=1306' },
  { id: 2, name: 'Intramuros',        image: '/images/intramuros.png',   url: 'https://intramuros.gov.ph/fs/' },
  { id: 3, name: 'Malacañang Palace', image: '/images/malacanang.png',   url: 'https://museums.gov.ph/tour-request-form/' },
  { id: 4, name: 'NAIA Terminal',     image: '/images/naia.png',         url: 'https://museums.gov.ph/tour-request-form/' },
  { id: 5, name: 'National Museum',   image: '/images/nationalmuseum.png', url: 'https://www.nationalmuseum.gov.ph/our-museums/national-museum-of-fine-arts/' }
];

const MAP_IMAGE = '/images/map.jpg';

const MainContent = forwardRef(function MainContent(props, ref) {
  const { showMapPopup, setShowMapPopup, showCharacterPopup, setShowCharacterPopup, 
    selectedCharacter, setSelectedCharacter, characterCategory, setCharacterCategory,
    sceneryCarouselRef, scrollCarousel,
    showARPopup, setShowARPopup,
    showPapersPopup, setShowPapersPopup,
    showCollectiblesPopup, setShowCollectiblesPopup } = props;
  
  const [animRef, isVisible] = useScrollAnimation({ threshold: 0.15 });

  const handleCarouselScroll = (direction) => {
    if (!sceneryCarouselRef.current) return;
    
    const carousel = sceneryCarouselRef.current;
    const cardWidth = 348;
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
    
    carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    
    setTimeout(() => {
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;
      if (carousel.scrollLeft >= maxScroll) {
        carousel.scrollLeft = 0;
      } else if (carousel.scrollLeft <= 0) {
        carousel.scrollLeft = maxScroll;
      }
    }, 300);
  };

  return (
    <>
      <style>{MAIN_STYLES}</style>
      <div className={`main-content-wrapper ${isVisible ? 'animate-in' : ''}`} ref={(node) => {
        animRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}>
        <div className="scalloped-border"></div>
        <section className="main-content section-full" id="about">
          <div className="container">
            <h1 className="main-title">STORY</h1>
            <p className="main-description">Siklab follows a student from Dasmariñas whose ordinary life is 
              suddenly interrupted when they are transported into the past, into a Philippines that exists 
              beyond textbooks and classrooms. What begins as confusion slowly turns into purpose as the 
              player realizes that history is not simply a collection of dates and names, but a living world
               shaped by struggle, courage, and sacrifice. Tasked with a once in a lifetime quest, the 
               player journeys through key moments in Philippine history, meeting national heroes not as 
               distant legends but as people with ideals, doubts, and convictions. Along the way, they e
               ncounter diverse cultures and traditions, uncover secrets lost to time, and experience the 
               realities faced by those who came before them. Through exploration and discovery, Siklab 
               invites players to live history rather than merely study it, showing that the past is not 
               something left behind, but something that continues to shape identity, memory, and the 
               future.
            </p>

            <div className="room-sections-grid">
              <div className="room-section">
                <h2 className="room-title">MEET CHARACTERS IN GAME</h2>
                <div className="room-items">
                  <div className="room-card">
                    <div className="room-card-content">
                      <div className="room-icon">⚔️</div>
                      <div className="room-info">
                        <p className="room-text">The filipino people.</p>
                        <button className="room-button" onClick={() => setShowCharacterPopup(true)}>Characters</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="room-section">
                <h2 className="room-title">MAP</h2>
                <div className="room-items">
                  <div className="room-card">
                    <div className="room-card-content">
                      <div className="room-icon">🗺️</div>
                      <div className="room-info">
                        <p className="room-text">Explore the Game</p>
                        <button className="room-button" onClick={() => setShowMapPopup(true)}>EXPLORE</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="additional-section">
              <h2 className="mc-section-title">REWARDS</h2>
              <div className="bottom-grid">
                <div className="bottom-card">
                  <div className="bottom-icon">📱</div>
                  <p className="bottom-text">view your character in real life</p>
                  <button className="bottom-button" onClick={() => setShowARPopup(true)}>AUGMENTED REALITY</button>
                </div>
                <div className="bottom-card">
                  <div className="bottom-icon">✉️</div>
                  <p className="bottom-text">check the words of the most iconic</p>
                  <button className="bottom-button" onClick={() => setShowPapersPopup(true)}>PAPERS</button>
                </div>
                <div className="bottom-card">
                  <div className="bottom-icon">🌺</div>
                  <p className="bottom-text">look through the iconic plants you found in game</p>
                  <button className="bottom-button" onClick={() => setShowCollectiblesPopup(true)}>COLLECTIBLES</button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="scalloped-border inverted"></div>
      </div>

      {/* MAP POPUP */}
      {showMapPopup && createPortal(
        <div className="map-popup-overlay" onClick={(e) => e.target === e.currentTarget && setShowMapPopup(false)}>
          <div className="map-popup-container">
            <button className="floating-close" onClick={() => setShowMapPopup(false)}>×</button>
            <div className="map-popup-content">
              <div className="map-grid-overlay"></div>
              
              {/* MAP IMAGE */}
              <div className="map-footer">
                <div className="map-footer-image-container">
                  <img src={MAP_IMAGE} alt="Siklab Game Map" className="map-footer-image" />
                </div>
                <div className="map-footer-info">
                  <div className="map-coordinates">
                    <span>📐 Coordinates: 14.5995° N, 120.9842° E</span>
                    <span className="map-scale">Scale: 1:50,000</span>
                  </div>
                  <div className="map-stamp">✓ SIKLAB Adventures</div>
                </div>
              </div>

              {/* SCENERY CAROUSEL BELOW */}
              <div className="scenery-carousel-wrapper">
                <button className="scenery-arrow left" onClick={() => handleCarouselScroll('left')}>‹</button>
                <div className="scenery-carousel" ref={sceneryCarouselRef}>
                  {[...SCENERY_DATA, ...SCENERY_DATA, ...SCENERY_DATA].map((item, index) => (
                    <div key={`${item.id}-${index}`} className="scenery-card">
                      <div 
                        className="scenery-card-glass map-location-pin"
                        onClick={() => window.open(item.url, '_blank')}
                      >
                        <div className="map-pin-marker">📍</div>
                        <div className="scenery-image-wrap">
                          <img src={item.image} alt={item.name} className="scenery-image" />
                        </div>
                        <div className="scenery-pill">{item.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="scenery-arrow right" onClick={() => handleCarouselScroll('right')}>›</button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* CHARACTER POPUP */}
      {showCharacterPopup && createPortal(
        <div className="character-popup-overlay" onClick={(e) => e.target === e.currentTarget && setShowCharacterPopup(false)}>
          <div className="character-popup-container">
            <button className="floating-close" onClick={() => setShowCharacterPopup(false)}>×</button>
            <div className="character-popup-body">
              <div className="character-grid-panel">
                <div className="character-tabs">
                  {['main','heroes','others'].map(cat => (
                    <button key={cat} className={`character-tab ${characterCategory === cat ? 'active' : ''}`} onClick={() => { setCharacterCategory(cat); setSelectedCharacter(CHARACTERS_DATA[cat][0]); }}>
                      {cat.toUpperCase()}
                    </button>
                  ))}
                </div>
                <div className={`character-grid ${characterCategory}`}>
                  {CHARACTERS_DATA[characterCategory].map(c => (
                    <div key={c.id} className={`character-portrait ${selectedCharacter?.id === c.id ? 'selected' : ''}`} onClick={() => setSelectedCharacter(c)}>
                      <img src={c.image} alt={c.name} />
                      <div className="character-portrait-name">{c.name}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="character-display-panel">
                {selectedCharacter ? (
                  <>
                    <div className="character-display-bg"><img src={selectedCharacter.image} alt={selectedCharacter.name} className="character-display-image" /></div>
                    <div className="character-display-info">
                      {selectedCharacter.role && <div className="character-role-badge">{selectedCharacter.role}</div>}
                      <div className="character-name-bar">
                        <span className="character-name-text">{selectedCharacter.name}</span>
                      </div>
                    </div>
                  </>
                ) : <div className="character-display-placeholder"><h3>SELECT A CHARACTER</h3><p>Choose a hero from the list</p></div>}
              </div>
              <div className="character-details-panel">
                {selectedCharacter ? (
                  <div className="character-section">
                    <h4 className="char-section-title">📜 BIO</h4>
                    <p className="character-bio">{selectedCharacter.bio}</p>
                  </div>
                ) : <div className="character-details-placeholder"><p>Select a character to view details</p></div>}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* AUGMENTED REALITY POPUP */}
      {showARPopup && createPortal(
        <div className="generic-popup-overlay" onClick={(e) => {
          if (e.target === e.currentTarget) setShowARPopup(false);
        }}>
          <div className="generic-popup-container">
            <button className="floating-close" onClick={() => setShowARPopup(false)}>×</button>
            <div className="generic-popup-content">
              <div className="generic-left-section">
                <h2 className="generic-popup-title">AUGMENTED REALITY</h2>
                <p className="generic-popup-description">
                  Experience your favorite characters in the real world! Use AR technology to bring historical 
                  figures to life right in your room. Take photos, interact, and learn about Philippine history 
                  in an immersive way like never before.
                </p>
                <div className="generic-action-buttons">
                  <button className="generic-icon-btn" disabled style={{opacity:0.3,cursor:'not-allowed'}}>▶</button>
                  <button className="generic-download-btn" disabled style={{opacity:0.3,cursor:'not-allowed',background:'#1a1a1a',color:'#666',borderColor:'#444'}}>
                    View AR Gallery
                    <span>🔒</span>
                  </button>
                </div>
              </div>
              <div className="generic-right-section">
                <div className="generic-image-card">
                  <div className="generic-star-badge"></div>
                  <img src="/images/augmented.png" alt="AR Experience" className="generic-feature-image" />
                  <div className="generic-badge-circle">
                    <div className="badge-main">OFFICIAL RELEASE</div>
                    <div className="badge-sub">★COMING SOON★</div>
                    <div className="badge-sub">CRYPKO V1.0</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* PAPERS POPUP */}
      {showPapersPopup && createPortal(
        <div className="generic-popup-overlay" onClick={(e) => {
          if (e.target === e.currentTarget) setShowPapersPopup(false);
        }}>
          <div className="generic-popup-container">
            <button className="floating-close" onClick={() => setShowPapersPopup(false)}>×</button>
            <div className="generic-popup-content">
              <div className="generic-left-section">
                <h2 className="generic-popup-title">HISTORICAL PAPERS</h2>
                <p className="generic-popup-description">
                  Discover authentic historical documents and letters from the Philippine Revolution. Read the 
                  actual words of heroes like Rizal, Bonifacio, and Aguinaldo. Unlock these precious pieces 
                  of history as you progress through the game and deepen your understanding of the past.
                </p>
                <div className="generic-action-buttons">
                  <button className="generic-icon-btn" disabled style={{opacity:0.3,cursor:'not-allowed'}}>▶</button>
                  <button className="generic-download-btn" disabled style={{opacity:0.3,cursor:'not-allowed',background:'#1a1a1a',color:'#666',borderColor:'#444'}}>
                    Browse Collection
                    <span>🔒</span>
                  </button>
                </div>
              </div>
              <div className="generic-right-section">
                <div className="generic-image-card">
                  <div className="generic-star-badge"></div>
                  <img src="/images/news.png" alt="Historical Documents" className="generic-feature-image" />
                  <div className="generic-badge-circle">
                    <div className="badge-main">OFFICIAL RELEASE</div>
                    <div className="badge-sub">★COMING SOON★</div>
                    <div className="badge-sub">SIKLAB V1.0</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* COLLECTIBLES POPUP */}
      {showCollectiblesPopup && createPortal(
        <div className="generic-popup-overlay" onClick={(e) => {
          if (e.target === e.currentTarget) setShowCollectiblesPopup(false);
        }}>
          <div className="generic-popup-container">
            <button className="floating-close" onClick={() => setShowCollectiblesPopup(false)}>×</button>
            <div className="generic-popup-content">
              <div className="generic-left-section">
                <h2 className="generic-popup-title">COLLECTIBLES</h2>
                <p className="generic-popup-description">
                  Gather rare Philippine flora and cultural artifacts throughout your journey. Each collectible 
                  tells a story of the land's rich biodiversity and heritage. From sampaguita flowers to ancient 
                  tribal symbols, build your collection and become a master curator of Philippine treasures.
                </p>
                <div className="generic-action-buttons">
                  <button className="generic-icon-btn" disabled style={{opacity:0.3,cursor:'not-allowed'}}>▶</button>
                  <button className="generic-download-btn" disabled style={{opacity:0.3,cursor:'not-allowed',background:'#1a1a1a',color:'#666',borderColor:'#444'}}>
                    View Collection
                    <span>🔒</span>
                  </button>
                </div>
              </div>
              <div className="generic-right-section">
                <div className="generic-image-card">
                  <div className="generic-star-badge"></div>
                  <img src="/images/gums.png" alt="Collectible Items" className="generic-feature-image" />
                  <div className="generic-badge-circle">
                    <div className="badge-main">OFFICIAL RELEASE</div>
                    <div className="badge-sub">★ COMING SOON★</div>
                    <div className="badge-sub">SIKLAB V1.0</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
});

export default MainContent;