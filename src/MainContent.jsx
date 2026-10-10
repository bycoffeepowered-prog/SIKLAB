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
    opacity: 1;
    transform: none;
    background: #fef3c7;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    isolation: isolate;
  }
  .main-content-wrapper.animate-in {
    animation: none;
  }

  .main-content {
    background: #fef3c7;
    padding: 0.75rem 0 0.85rem;
    flex: 1;
    min-height: 0;
    box-sizing: border-box;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .main-content > .container {
    flex: 1;
    min-height: 0;
    width: 100%;
    max-width: 1180px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    justify-content: flex-start;
    gap: 0.35rem;
  }
  
  .scalloped-border {
    position: relative;
    width: 100%;
    height: 40px;
    flex-shrink: 0;
    background-color: #fef3c7;
    overflow: hidden;
    z-index: 1;
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
  
  .main-title { font-family: 'Cinzel', serif; font-size: clamp(1.7rem, 3.6vh, 2.5rem); font-weight: 900; color: #1e293b; margin-bottom: 0.2rem; line-height: 1.1; letter-spacing: 0.08em; flex-shrink: 0; }
  .main-description { font-family: 'Cormorant Garamond', Georgia, serif; font-size: clamp(1.05rem, 2.05vh, 1.28rem); font-weight: 600; color: #3f2f1e; margin-bottom: 0.45rem; line-height: 1.55; text-align: justify; text-justify: inter-word; flex: 0 1 auto; min-height: 0; overflow: hidden; }
  .room-sections-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; margin-bottom: 0.7rem; flex: 0 0 auto; }
  .room-section { width: 100%; display: flex; flex-direction: column; }
  .room-title { font-size: clamp(1rem, 2.1vh, 1.35rem); font-weight: 900; color: #1e293b; margin-bottom: 0.4rem; padding-bottom: 0.25rem; border-bottom: 4px solid #dc2626; line-height: 1.2; }
  .room-items { display: flex; flex-direction: column; }
  .room-card { background: white; border: 4px solid #1e293b; padding: 0.7rem 0.95rem; box-shadow: 5px 5px 0 rgba(0,0,0,0.2); position: relative; z-index: 1; }
  .room-card-content { display: flex; gap: 0.85rem; align-items: center; width: 100%; }
  .room-icon { font-size: 2.4rem; flex-shrink: 0; }
  .room-info { flex: 1; }
  .room-text { font-size: 0.85rem; color: #475569; margin-bottom: 0.35rem; line-height: 1.35; }
  .room-button { background: #1e293b; color: white; padding: 0.45rem 1rem; border: none; font-size: 0.75rem; font-weight: bold; font-family: 'Courier New', monospace; cursor: pointer; transition: background 0.2s; }
  .room-button:hover { background: #dc2626; }
  .additional-section { border-top: 4px solid #1e293b; padding-top: 0.65rem; padding-bottom: 8px; flex: 0 0 auto; display: flex; flex-direction: column; }
  .mc-section-title { font-size: clamp(1rem, 2.1vh, 1.35rem); font-weight: 900; color: #1e293b; margin-bottom: 0.4rem; line-height: 1.2; }
  .bottom-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
  .bottom-card { background: white; border: 4px solid #1e293b; padding: 0.65rem 0.9rem 0.75rem; box-shadow: 5px 5px 0 rgba(0,0,0,0.2); display: flex; flex-direction: column; position: relative; z-index: 1; }
  .bottom-icon { font-size: 2rem; text-align: center; margin-bottom: 0.2rem; }
  .bottom-text { font-size: 0.8rem; color: #475569; line-height: 1.35; margin-bottom: 0.4rem; text-align: center; }
  .bottom-button { width: 100%; background: #1e293b; color: white; padding: 0.5rem 1rem; border: none; font-size: 0.75rem; font-weight: bold; font-family: 'Courier New', monospace; cursor: pointer; transition: background 0.2s; }
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
  .scenery-card-glass { position: relative; width: 100%; height: 440px; border-radius: 40px; padding: 22px 22px 26px; box-sizing: border-box; background: rgba(74, 48, 28, 0.9); border: 1px solid rgba(244,228,193,0.35); backdrop-filter: blur(22px); display: flex; flex-direction: column; align-items: center; justify-content: space-between; transition: transform 0.2s ease,box-shadow 0.2s ease; cursor: pointer; }
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
  .character-portrait img,
  .character-portrait-fallback { width: 100%; height: 100%; object-fit: cover; object-position: center top; min-width: 120px; min-height: 120px; transition: transform 0.2s; }
  .character-portrait-fallback { display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg,#3d1a1a,#1a1a2e); color: #f4e4c1; font-family: 'Cinzel', serif; font-size: 2rem; font-weight: 900; }
  .character-portrait:hover { border-color: #e94560; transform: translateY(-4px); box-shadow: 0 8px 20px rgba(233,69,96,0.4); }
  .character-portrait:hover img { transform: scale(1.1); }
  .character-portrait.selected { border-color: #e94560; box-shadow: 0 0 20px rgba(233,69,96,0.6),inset 0 0 20px rgba(233,69,96,0.2); }
  .character-portrait-name { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top,rgba(0,0,0,0.9),transparent); color: #fff; padding: 8px 5px 5px; font-size: 0.75rem; font-weight: bold; text-align: center; }
  .character-display-panel { position: relative; display: flex; flex-direction: column; justify-content: flex-end; background: radial-gradient(circle at center,#e94560 0%,transparent 70%),linear-gradient(180deg,#0f3460 0%,#1a1a2e 100%); overflow: hidden; }
  .character-display-bg { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; overflow: hidden; }
  .character-display-image { width: 85%; height: 85%; object-fit: contain; filter: drop-shadow(0 20px 40px rgba(0,0,0,0.8)); animation: charFloat 3s ease-in-out infinite; }
  .character-display-fallback { width: 220px; height: 220px; border-radius: 50%; border: 4px solid #e94560; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.45); color: #fff; font-family: 'Cinzel', serif; font-size: 4.5rem; font-weight: 900; filter: drop-shadow(0 20px 40px rgba(0,0,0,0.8)); animation: charFloat 3s ease-in-out infinite; }
  .character-display-info { position: relative; z-index: 2; background: linear-gradient(to top,rgba(0,0,0,0.9),transparent); padding: 1.5rem; }
  .character-name-bar { display: flex; justify-content: center; align-items: center; background: rgba(0,0,0,0.6); padding: 1rem; border-radius: 8px; border: 2px solid #e94560; }
  .character-name-text { color: #fff; font-size: 1.8rem; font-weight: bold; font-family: 'Impact',sans-serif; text-transform: uppercase; letter-spacing: 0.1em; text-shadow: 2px 2px 4px rgba(0,0,0,0.8); }
  .character-display-placeholder { text-align: center; color: #666; padding: 4rem 2rem; }
  .character-details-panel { background: rgba(0,0,0,0.4); border-left: 2px solid #e94560; padding: 2rem; overflow-y: auto; display: flex; flex-direction: column; }
  .character-section { background: rgba(255,255,255,0.05); border: 1px solid rgba(233,69,96,0.3); border-radius: 8px; padding: 1.5rem; }
  .char-section-title { color: #e94560; font-size: 0.9rem; margin: 0 0 1rem 0; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; }
  .character-bio { color: #ccc; line-height: 1.8; font-size: 0.9rem; }
  .character-details-placeholder { text-align: center; color: #666; padding: 3rem; }

  /* Generic popup for AR and Collectibles - Modern Anime Style */
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
    max-width: 980px; 
    max-height: 90vh; 
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
  .generic-popup-content.reward-layout {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    align-items: stretch;
  }
  .reward-top {
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 2rem;
    align-items: center;
  }
  .reward-catalog {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 0.9rem;
  }
  @media (min-width: 769px) {
    .reward-catalog:not(.collectible-grid) {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      width: 100%;
      max-width: 800px;
      align-self: center;
    }
  }
  .reward-item {
    background: #fff;
    border: 3px solid #1a1a1a;
    border-radius: 16px;
    padding: 0.9rem;
    text-align: left;
    box-shadow: 4px 4px 0 rgba(0,0,0,0.12);
  }
  .reward-item-thumb,
  .reward-item-fallback {
    width: 100%;
    height: 110px;
    object-fit: contain;
    object-position: center;
    border-radius: 10px;
    margin-bottom: 0.6rem;
    border: 2px solid #1a1a1a;
    background: #fff5e1;
  }
  .reward-item-fallback {
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Cinzel', serif;
    font-size: 1.6rem;
    font-weight: 900;
    color: #3d2817;
  }
  .reward-item-era {
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #dc2626;
  }
  .reward-item-name {
    font-size: 0.95rem;
    font-weight: 800;
    color: #1a1a1a;
    margin: 0.25rem 0 0.35rem;
    line-height: 1.25;
  }
  .reward-item-text {
    font-size: 0.78rem;
    color: #4a4a4a;
    line-height: 1.45;
    margin: 0;
  }
  .reward-catalog.collectible-grid {
    grid-template-columns: repeat(auto-fill, minmax(132px, 1fr));
    gap: 1rem;
  }
  .collectible-grid .reward-item {
    background: transparent;
    border: none;
    box-shadow: none;
    padding: 0;
    text-align: center;
  }
  .collectible-grid .reward-item-thumb {
    height: auto;
    aspect-ratio: 3 / 4;
    object-fit: contain;
    border: none;
    border-radius: 14px;
    background: transparent;
    margin-bottom: 0.45rem;
  }
  .collectible-grid .reward-item-name {
    font-size: 0.82rem;
    margin: 0.15rem 0 0.2rem;
  }
  .collectible-grid .reward-item-text {
    font-size: 0.72rem;
  }
  .reward-layout .generic-right-section {
    min-height: 240px;
    height: auto;
  }

  @media (max-width: 768px) {
    .generic-popup-content {
      grid-template-columns: 1fr;
      padding: 2rem 1.5rem;
    }
    .reward-top {
      grid-template-columns: 1fr;
    }
    .generic-popup-title {
      font-size: 2rem;
    }
    .generic-right-section {
      min-height: 300px;
    }
  }

  @media (max-width: 1099px) {
    .main-content-wrapper,
    .main-content,
    .main-content > .container {
      overflow: visible;
      height: auto;
      max-height: none;
      min-height: 0;
    }
    .main-description {
      flex: none;
      min-height: auto;
      overflow: visible;
      font-size: 1.05rem;
    }
    .room-sections-grid,
    .bottom-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 1000px) {
    .main-title { font-size: 2rem; }
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
    .main-content {
      padding: 1rem 0 1.25rem;
    }
    .scalloped-border { height: 28px; }
    .main-title { font-size: 1.6rem; }
    .main-description { font-size: 1rem; line-height: 1.5; }
    .room-title, .mc-section-title { font-size: 1.05rem; }
    .room-icon { font-size: 2.2rem; }
  }
`;

const CHARACTERS_DATA = {
  main: [
    { id: 1, name: 'Emmanuel', image: '/images/boy.png', bio: 'Isang estudyanteng kilala sa pagiging madiskarte at laging may plano para yumaman at umasenso sa buhay. Ngunit habang pilit niyang kinokontrol ang kanyang kapalaran, unti-unti niyang natutuklasan na may ibang plano ang tadhana para sa kanya.' },
    { id: 2, name: 'Xandy', image: '/images/girl.png', bio: 'Isang babaeng walang takot humarap sa panganib dahil sa kanyang pambihirang “matalas na pakiramdam.” Ngunit sa bawat pagkakataong nauunahan niya ang sakuna, may kapalit na pangyayaring hindi niya kailanman kayang hulaan.' }
  ],
  others: [
    { id: 3,  name: 'Juan Melo',     image: '/images/melo.png',      bio: 'Isang tahimik ngunit matapang na binata na nagsisilbing gabay ng Player sa panahon ng pananakop ng Espanya. Kahit simple lang siya, marami siyang alam tungkol sa kasaysayan at lihim ng Fort Santiago.' },
    { id: 4,  name: 'Jelyn',         image: '/images/Jennib.png',    bio: 'Isa siyang tahimik na Chinoy na dalaga na lumaki sa gitna ng kaguluhan at digmaan. Nagtayo siya ng sariling karihan upang mapakain ang mga mamamayan ng Bagumbayan sa panahon ng hirap at takot. Ngunit sa likod ng kaniyang kilos ay isang lihim na kasapi ng Katipunan matapang, matalino, at sanay mamuhay sa gitna ng panganib at kaguluhan.'},
    { id: 5,  name: 'Maria',         image: '/images/maria.png',     bio: 'Isa siyang kilalang babaylan na nawalan ng katayuan matapos dumating at manakop ang mga Kastila. Dahil sa kaniyang talino at matatag na paninindigan, malamig siya makitungo sa karamihan at bihirang magpakita ng emosyon. Ngunit sa piling ng taong kaniyang minamahal, lumalabas ang kaniyang tunay na lambing at mahinahong puso.' },
    { id: 6,  name: 'Luciano',       image: '/images/lancelot.png',  bio: 'Isa siyang kartero na tuso at bihasa sa pagbaluktot ng batas para sa sariling kapakinabangan. Palagi siyang isang hakbang sa unahan at marunong dumiskarte upang dayain at manipulahin ang sistema nang hindi agad nahuhuli.'},
    { id: 7,  name: 'Isabelle',      image: '/images/isawho.png',    bio: 'Isang dalagang nagsisilbing gabay ng Player sa panahon ng Amerikano at Hapon. Sa likod ng kanyang mabait na anyo ay isang lihim na pag-ibig sa sundalong Hapones na si George.'},
    { id: 8,  name: 'Josepa',        image: '/images/josepa.png',    bio: 'Siya ay isang lihim na rebolusyonista na tumutulong sa pagpapalaganap ng damdaming makabayan at laban sa mga Amerikano para sa adhikain ni Aguinaldo. Sa likod ng kaniyang tahimik na kilos ay isang pusong handang makipaglaban para sa kalayaan ng bayan.'},
    { id: 9,  name: 'Jerome',        image: '/images/jerom.png',     bio: 'Isa siyang mayamang binata na nag-aaral sa Unibersidad ng Santo Tomas, kilala sa kaniyang gitara at matatamis na salita. Madali siyang makapagpaibig ng iba dahil sa kaniyang alindog at karisma, ngunit sa kabila nito ay takot siyang masaktan kaya madalas siyang nauunang umiwas bago pa man siya tunay na mahulog.'},
    { id: 10, name: 'Rosa',          image: '/images/rosas.png',     bio: 'Isa siyang babaeng madaling magalit at may mabigat na dinadala sa puso. Pinatigas siya ng mga sugat na iniwan ng digmaan kaya madalas siyang malamig at mataray sa iba. Madalas siyang matagpuang nakatanaw sa dagat, tahimik na pinagmamasdan ang paglayag ng mga barkong Hapones habang umaasang balang araw ay magiging malaya rin siya.' },
    { id: 11, name: 'Maliya',        image: '/images/aliyahate.png', bio: 'Isang mataray ngunit maaasahang flight attendant na nagsisilbing gabay ng Player. Kahit matalim magsalita, handa siyang tumulong kahit siya mismo ang nawawalan.'},
    { id: 12, name: 'Nicolo',        image: '/images/Nicholo.png',   bio: 'Isa siyang lihim na operatiba ng pamahalaan na tanging hangarin ay gawin ang makabubuti para sa bayan. Handa niyang sundin ang anumang utos, gaano man ito kabigat, basta para sa kapakanan ng bansa.'},
    { id: 16, name: 'Eumir',         image: '/images/euriblue.png',  bio: 'Isang maliit ngunit masayahing taga-salubong sa paliparan na mahilig magpatawa. Ngunit kapag kailangan na siya, madalas siyang nawawala dahil nakakatulog.'},
    { id: 17, name: 'Manong Jhong',  image: '/images/ced.png',       bio: 'Isang mabait at masipag na bagger sa paliparan na laging handang tumulong sa iba. Mahilig siya sa basketball at may lihim na paghanga sa kambal ng kanyang kaibigan.' }    
  ]
};

const SCENERY_DATA = [
  { id: 1, name: 'National University Dasmarinas', image: '/images/NUD.png',        url: 'https://www.facebook.com/NUDasmaPH/' },
  { id: 2, name: 'Intramuros',                     image: '/images/intramuros.png', url: 'https://intramuros.gov.ph/' },
  { id: 3, name: 'Baywalk',                        image: '/images/baywalk.png',    url: 'https://www.yelp.com/biz/baywalk-manila' },
  { id: 4, name: 'NAIA Terminal',                  image: '/images/naia.png',       url: 'https://miaa.gov.ph/' }
];

const AR_ITEMS = [
  { name: 'Emmanuel', era: 'AR Character', image: '/images/boy.png', text: 'I-scan ang marker para makita si Emmanuel sa totoong mundo — diskarte, plano, at lahat.' },
  { name: 'Xandy', era: 'AR Character', image: '/images/girl.png', text: 'Iharap ang camera at harapin si Xandy nang buo, kasama ang kanyang matalas na pakiramdam.' },
  { name: 'Isabelle', era: 'AR Character', image: '/images/isawho.png', text: 'AR encounter mula sa panahon ng Amerikano at Hapon. Gabay, lihim, at pag-ibig na hindi dapat malaman ng lahat.' },
  { name: 'Fort Santiago Relic', era: 'AR Object', text: 'Isang relic na lumilitaw sa mesa o sahig mo. Iikot-ikot ito para makita ang mga detalye ng kuta.' }
];

const COLLECTIBLE_ITEMS = [
  { name: 'Katipunero', era: 'Rebolusyon', image: '/images/collectibles/katipunan-male.png', text: 'Card ng lalaking kasapi ng Katipunan. Unang sagisag ng paglaban sa kolonyal na panahon.' },
  { name: 'Katipunera', era: 'Rebolusyon', image: '/images/collectibles/katipunan-female.png', text: 'Card ng babaeng rebolusyonarya sa baro’t saya, tapis, at pulang panuelo.' },
  { name: 'Lalaking Babaylan', era: 'Katutubo', image: '/images/collectibles/babaylan-male.png', text: 'Lalaking babaylan sa tradisyonal na damit. Tagapamagitan ng tao at ng lumang paniniwala.' },
  { name: 'Babaeng Babaylan', era: 'Katutubo', image: '/images/collectibles/babaylan-female.png', text: 'Babaeng babaylan sa puting damit at maroon na sash. Bantay ng ritwal at alaala.' },
  { name: 'Estudyante', era: 'Kasalukuyan', image: '/images/collectibles/girl.png', text: 'Modernong estudyante na may backpack. Tulay mula sa kasalukuyan papunta sa nakaraan.' },
  { name: 'Kalapati', era: 'Kapayapaan', image: '/images/collectibles/dove.png', text: 'Puting kalapati na may sanga. Sagisag ng tigil-putukan at bagong simula.' },
  { name: 'Watawat', era: 'Kalayaan', image: '/images/collectibles/flag.png', text: 'Watawat ng Pilipinas. Kolektahin para tandaan ang bawat panahong ipinaglaban ito.' },
  { name: 'Sampaguita', era: 'Pambansang Bulaklak', image: '/images/collectibles/sampaguita.png', text: 'Pambansang bulaklak. Isang tahimik na card na palaging nasa tabi ng mga bayani.' },
  { name: 'Yellow Ribbon', era: 'EDSA', image: '/images/collectibles/ribbon.png', text: 'Dilaw na laso ng People Power. Ipinapakita nito ang lakas ng ordinaryong tao sa lansangan.' },
  { name: 'Medalya', era: 'Parangal', image: '/images/collectibles/medal.png', text: 'Gintong medalya. Gantimpala para sa mga natapos na kabanata at hidden quest.' },
  { name: 'Anting-anting', era: 'Folk', image: '/images/collectibles/anting-anting.png', text: 'Ukít na anting-anting ng mandirigma. Pananggalang ng mga tauhan sa gitna ng gulo.' },
  { name: 'Lapis', era: 'Edukasyon', image: '/images/collectibles/lapis.png', text: 'Isang lapis. Sa SIKLAB, ito ang sagisag ng pag-aaral — at ng mga lihim na sinulat sa kwaderno.' },
  { name: 'Diyaryo', era: 'Rebolusyon', image: '/images/collectibles/diyaryo.png', text: 'Pahayagang “El Nieraldo de la Revolución.” Balita, propaganda, at senyales para sa susunod na quest.' },
  { name: 'Marcial Bonifacio', era: 'Alaala', image: '/images/collectibles/nameplate.png', text: 'Nameplate ni Marcial Bonifacio. Isang pangalang kailangang tandaan habang ginagalugad ang nakaraan.' },
  { name: 'Lamesa', era: 'Kultura', image: '/images/collectibles/lamesa.png', text: 'Mesa ng kakanin at ulam. Paalala na may buhay at hapag pa rin sa gitna ng kasaysayan.' },
  { name: 'Barko', era: 'Amerikano', image: '/images/collectibles/ship.png', text: 'Barkong may watawat ng Amerika. Tanda ng panahon ng okupasyon at ng mga daungang binabantayan.' },
  { name: 'Tangke', era: 'Digmaan', image: '/images/collectibles/tank.png', text: 'Tangke mula sa panahon ng giyera. Bigat ng bakbakan na dumaan sa bayan.' },
  { name: 'Telebisyon', era: 'Modernong Panahon', image: '/images/collectibles/tv.png', text: 'Lumang telebisyon. Dito dumadaan ang mga anunsyo, balita, at alaala ng bagong panahon.' }
];

const MAP_IMAGE = '/images/map.png';

function RewardCatalog({ items, variant }) {
  return (
    <div className={`reward-catalog${variant === 'cards' ? ' collectible-grid' : ''}`}>
      {items.map((item) => (
        <article key={`${item.name}-${item.image || item.era}`} className="reward-item">
          {item.image ? (
            <img src={item.image} alt={item.name} className="reward-item-thumb" />
          ) : (
            <div className="reward-item-fallback">{item.name.charAt(0)}</div>
          )}
          <div className="reward-item-era">{item.era}</div>
          <h3 className="reward-item-name">{item.name}</h3>
          <p className="reward-item-text">{item.text}</p>
        </article>
      ))}
    </div>
  );
}

function CharacterArt({ character, className }) {
  if (character?.image) {
    return <img src={character.image} alt={character.name} className={className} />;
  }
  return (
    <div className={className ? 'character-display-fallback' : 'character-portrait-fallback'}>
      {character?.initials || character?.name?.charAt(0) || '?'}
    </div>
  );
}

const MainContent = forwardRef(function MainContent(props, ref) {
  const { showMapPopup, setShowMapPopup, showCharacterPopup, setShowCharacterPopup, 
    selectedCharacter, setSelectedCharacter, characterCategory, setCharacterCategory,
    sceneryCarouselRef, scrollCarousel,
    showARPopup, setShowARPopup,
    showCollectiblesPopup, setShowCollectiblesPopup } = props;
  
  const [animRef, isVisible] = useScrollAnimation({ threshold: 0.15 });

  const handleCarouselScroll = (direction) => {
    if (!sceneryCarouselRef.current) return;
    
    const carousel = sceneryCarouselRef.current;
    const cards = Array.from(carousel.querySelectorAll('.scenery-card'));
    if (!cards.length) return;

    const viewport = carousel.getBoundingClientRect();
    const center = viewport.left + carousel.clientLeft + carousel.clientWidth / 2;
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;
    const positions = cards.map((card) => {
      const bounds = card.getBoundingClientRect();
      return Math.max(0, Math.min(maxScroll,
        carousel.scrollLeft + bounds.left + bounds.width / 2 - center
      ));
    });
    const target = direction === 'left'
      ? positions.findLast((position) => position < carousel.scrollLeft - 1) ?? positions.at(-1)
      : positions.find((position) => position > carousel.scrollLeft + 1) ?? positions[0];

    carousel.scrollTo({ left: target, behavior: 'smooth' });
  };

  return (
    <>
      <style>{MAIN_STYLES}</style>
      <div className={`main-content-wrapper tab-screen ${isVisible ? 'animate-in' : ''}`} ref={(node) => {
        animRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}>
        <div className="scalloped-border"></div>
        <section className="main-content section-full" id="about">
          <div className="container">
            <h1 className="main-title">STORY</h1>
            <p className="main-description">
              Sinusundan ng SIKLAB ang isang estudyante mula sa Dasmariñas na biglang naabala ang pangkaraniwang buhay matapos siyang dalhin ng misteryosong glitch sa iba’t ibang panahon ng kasaysayan ng Pilipinas. Ang nagsimula bilang desperadong pagtatangkang makauwi ay naging paglalakbay sa mga pagpupunyagi, sakripisyo, at pagkakakilanlang humubog sa bansa.
              Sa iba’t ibang yugto ng kasaysayan — mula sa Panahon ng Kolonyalismong Espanyol, hanggang sa Pananakop ng Amerika at Hapon, at sa kalaunan ang Batas Militar at panahon ng EDSA — tinutuklas ng manlalaro ang buhay na anyo ng nakaraan sa pamamagitan ng interactive na pagkukuwento, mga mini-game, at mga kapaligirang hango sa kasaysayan. Sa daan, makikilala nila ang mga tao mula sa iba’t ibang buhay: mga rebolusyonaryo, babaylan, estudyante, manggagawa, miyembro ng resistance, at mga karaniwang Pilipinong nagsisikap mabuhay sa gitna ng gulo at pagbabago.
            </p>
            <p className="main-description">
              Sa halip na iharap ang kasaysayan bilang simpleng talaan ng mga pangyayari, hinahayaan ng SIKLAB ang mga manlalaro na maranasan ito sa pamamagitan ng mga personal na kuwento, tradisyon, paggalugad, at makabuluhang mga desisyon. Sa tulong ng mga AR collectible, mga mini-game na hango sa larong kalye, side quest, at mga paghaharap ng karakter, layunin ng laro na gawing mas buhay, emosyonal, at kapana-panabik ang kasaysayan ng Pilipinas para sa mga modernong mag-aaral.
              Habang lalong lumalalim ang manlalaro sa nakaraan, unti-unti niyang natutuklasan na ang kasaysayan ay hindi lamang nakasulat sa mga aklat — ito ay isang buhay na alaala na dala ng mga tao, sakripisyo, at mga kuwentong patuloy na humuhubog sa pagkakakilanlang Pilipino at sa kinabukasan ng bansa.
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
                  <div className="bottom-icon">🎖️</div>
                  <p className="bottom-text">gold cards unlocked across every era of the game</p>
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
                  {['main','others'].map(cat => (
                    <button key={cat} className={`character-tab ${characterCategory === cat ? 'active' : ''}`} onClick={() => { setCharacterCategory(cat); setSelectedCharacter(CHARACTERS_DATA[cat][0]); }}>
                      {cat.toUpperCase()}
                    </button>
                  ))}
                </div>
                <div className={`character-grid ${characterCategory}`}>
                  {CHARACTERS_DATA[characterCategory].map(c => (
                    <div key={c.id} className={`character-portrait ${selectedCharacter?.id === c.id ? 'selected' : ''}`} onClick={() => setSelectedCharacter(c)}>
                      <CharacterArt character={c} />
                      <div className="character-portrait-name">{c.name}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="character-display-panel">
                {selectedCharacter ? (
                  <>
                    <div className="character-display-bg"><CharacterArt character={selectedCharacter} className="character-display-image" /></div>
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
            <div className="generic-popup-content reward-layout">
              <div className="reward-top">
                <div className="generic-left-section">
                  <h2 className="generic-popup-title">AUGMENTED REALITY</h2>
                  <p className="generic-popup-description">
                    I-scan ang AR markers sa laro para lumitaw ang mga karakter at relic sa totoong mundo.
                    Gamitin ang camera ng phone, iikot ang object, at kunan ng litrato. Hindi na locked —
                    ito ang AR gallery na makikita sa Chapter 1.
                  </p>
                </div>
                <div className="generic-right-section">
                  <div className="generic-image-card">
                    <img src="/images/augmented.png" alt="AR Experience" className="generic-feature-image" />
                    <div className="generic-badge-circle">
                      <div className="badge-main">AR GALLERY</div>
                      <div className="badge-sub">★ CHAPTER 1 ★</div>
                      <div className="badge-sub">SIKLAB</div>
                    </div>
                  </div>
                </div>
              </div>
              <RewardCatalog items={AR_ITEMS} />
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
            <div className="generic-popup-content reward-layout">
              <div className="reward-top">
                <div className="generic-left-section">
                  <h2 className="generic-popup-title">COLLECTIBLES</h2>
                  <p className="generic-popup-description">
                    Ito ang mga card na na-unlock sa SIKLAB — karakter, sagisag, at bagay mula sa bawat
                    panahon. Kolektahin sila in-game, tapos balik dito para tingnan ang buong gallery.
                  </p>
                </div>
                <div className="generic-right-section">
                  <div className="generic-image-card">
                    <img src="/images/collectibles/flag.png" alt="Collectible Cards" className="generic-feature-image" />
                    <div className="generic-badge-circle">
                      <div className="badge-main">18 CARDS</div>
                      <div className="badge-sub">★ UNLOCKED ★</div>
                      <div className="badge-sub">SIKLAB</div>
                    </div>
                  </div>
                </div>
              </div>
              <RewardCatalog items={COLLECTIBLE_ITEMS} variant="cards" />
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
});

export default MainContent;
