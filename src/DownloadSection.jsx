import { forwardRef, useEffect, useState } from "react";
import { useScrollAnimation } from "./Usescrollanimation";
import { supabase } from "./supabaseClient";

const DEFAULT_CONTROLS = {
  download_enabled: true,
  download_title: "Download Chapter 1",
  download_subtitle: "Hosted on itch.io",
  download_link:
    "https://derp145.itch.io/siklab-demo?fbclid=IwY2xjawRnbNNleHRuA2FlbQIxMQBzcnRjBmFwcF9pZAEwAAEedwteU16dBaZnavyYVBJWR8C1TkdBMZQpfc0oRyGK9H6RBAyhDSiDd4z-0hs_aem_BhIiv5dHU-Lb2xn-SASRig",

  preview_enabled: false,
  preview_title: "Download Official Version",
  preview_link: "",
};

const DOWNLOAD_STYLES = `
  @keyframes dlPopUp { 
    from { opacity:0; transform:translateY(60px) scale(0.9); } 
    to { opacity:1; transform:translateY(0) scale(1); } 
  }

  @keyframes cautionScroll {
    from { background-position: 0 0; }
    to   { background-position: 60px 0; }
  }

  .download-section {
    min-height: 100vh;
    padding: 80px 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    opacity: 0;
    transform: translateY(60px) scale(0.9);
  }

  .download-section.animate-in {
    animation: dlPopUp 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }

  .download-inner {
    max-width: 1100px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 48px;
  }

  .download-card { 
    flex: 0 0 52%;
    border-radius: 28px; 
    overflow: hidden; 
    box-shadow: 0 24px 60px var(--shadow-heavy); 
    background: #000; 
    border: 3px solid var(--accent-cyan); 
    line-height: 0;
  }

  .download-video { 
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }

  .download-buttons {
    flex: 0 0 40%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    color: var(--text-primary);
  }

  .download-heading { 
    margin: 0;
    font-size: 32px; 
    letter-spacing: 0.08em;
    text-transform: uppercase; 
    color: var(--accent-cyan);
  }

  .download-caption {
    margin: 0 0 8px;
    font-size: 16px;
    opacity: 0.9;
  }

  .download-btn-group { 
    display: flex; 
    flex-direction: column; 
    gap: 16px; 
    width: 100%; 
  }

  .download-btn-wrap {
    position: relative;
    width: 100%;
  }

  .download-btn { 
    display: flex; 
    align-items: center; 
    gap: 12px; 
    background: var(--card-bg-solid); 
    border: 2px solid var(--accent-cyan); 
    padding: 12px 20px; 
    border-radius: 12px; 
    color: var(--text-primary); 
    font-family: 'Courier New', monospace; 
    width: 100%;
    text-align: left;
    overflow: hidden;
  }

  .download-btn.active {
    cursor: pointer;
    opacity: 1;
    filter: none;
    text-decoration: none;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .download-btn.active:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 18px rgba(34,211,238,0.45);
  }

  .download-btn.disabled {
    cursor: not-allowed;
    opacity: 0.55;
    filter: grayscale(1) saturate(0.3);
  }

  .download-btn-wrap.disabled::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 12px;
    background-image: repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 10px,
      rgba(0, 0, 0, 0.22) 10px,
      rgba(0, 0, 0, 0.22) 20px
    );
    pointer-events: none;
    z-index: 2;
    animation: cautionScroll 1.5s linear infinite;
  }

  .download-soon {
    position: absolute;
    top: 50%;
    right: 14px;
    transform: translateY(-50%);
    z-index: 3;
    background: var(--accent-cyan, #22d3ee);
    color: #000;
    font-size: 9px;
    font-weight: bold;
    letter-spacing: 2px;
    padding: 3px 8px;
    border-radius: 4px;
    text-transform: uppercase;
  }

  .download-img {
    width: 40px;
    height: 40px;
    object-fit: contain;
  }

  .download-btn-label {
    font-size: 0.72rem;
    opacity: 0.8;
  }

  .download-btn-store {
    font-size: 1rem;
    font-weight: bold;
  }

  @media (max-width: 1024px) {
    .download-section {
      padding: 60px 40px;
    }

    .download-inner {
      flex-direction: column;
      gap: 28px;
    }

    .download-card {
      width: 100%;
      max-width: 480px;
    }
  }
`;

function ButtonContent({ img, alt, title, subtitle }) {
  return (
    <>
      <img src={img} alt={alt} className="download-img" />
      <div>
        <div className="download-btn-label">{title}</div>
        <div className="download-btn-store">{subtitle}</div>
      </div>
    </>
  );
}

const DownloadSection = forwardRef(function DownloadSection(_props, ref) {
  const [animRef, isVisible] = useScrollAnimation({ threshold: 0.15 });
  const [controls, setControls] = useState(DEFAULT_CONTROLS);

  useEffect(() => {
    async function loadControls() {
      const { data, error } = await supabase
        .from("site_controls")
        .select("*")
        .eq("id", 1)
        .single();

      if (error || !data) {
        console.error("Site controls error:", error?.message);
        return;
      }

      setControls({
        download_enabled: data.download_enabled ?? true,
        download_title: data.download_title || DEFAULT_CONTROLS.download_title,
        download_subtitle:
          data.download_subtitle || DEFAULT_CONTROLS.download_subtitle,
        download_link: data.download_link || DEFAULT_CONTROLS.download_link,

        preview_enabled: data.preview_enabled ?? false,
        preview_title: data.preview_title || DEFAULT_CONTROLS.preview_title,
        preview_link: data.preview_link || "",
      });
    }

    loadControls();
  }, []);

  const downloadActive =
    controls.download_enabled && controls.download_link.trim() !== "";

  const previewActive =
    controls.preview_enabled && controls.preview_link.trim() !== "";

  return (
    <>
      <style>{DOWNLOAD_STYLES}</style>

      <section
        className={`download-section section-full ${
          isVisible ? "animate-in" : ""
        }`}
        ref={(node) => {
          animRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        id="download"
      >
        <div className="download-inner">
          <div className="download-card">
            <video className="download-video" autoPlay loop muted playsInline>
              <source src="/images/TRAILER.mp4" type="video/mp4" />
            </video>
          </div>

          <div className="download-buttons">
            <h2 className="download-heading">Download Now</h2>
            <p className="download-caption">Available on mobile</p>

            <div className="download-btn-group">
              {downloadActive ? (
                <a
                  href={controls.download_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="download-btn active"
                >
                  <ButtonContent
                    img="/images/girl.png"
                    alt="Download"
                    title={controls.download_title}
                    subtitle={controls.download_subtitle}
                  />
                </a>
              ) : (
                <div className="download-btn-wrap disabled">
                  <button className="download-btn disabled" disabled>
                    <ButtonContent
                      img="/images/girl.png"
                      alt="Download"
                      title={controls.download_title}
                      subtitle={controls.download_subtitle || "Unavailable"}
                    />
                  </button>
                  <span className="download-soon">OFF</span>
                </div>
              )}

              {previewActive ? (
                <a
                  href={controls.preview_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="download-btn active"
                >
                  <ButtonContent
                    img="/images/boy.png"
                    alt="Preview"
                    title={controls.preview_title}
                    subtitle="Available Now"
                  />
                </a>
              ) : (
                <div className="download-btn-wrap disabled">
                  <button className="download-btn disabled" disabled>
                    <ButtonContent
                      img="/images/boy.png"
                      alt="Official"
                      title={controls.preview_title}
                      subtitle="Coming Soon"
                    />
                  </button>
                  <span className="download-soon">Soon</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
});

export default DownloadSection;