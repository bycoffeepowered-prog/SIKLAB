import { useState, useRef, useEffect, forwardRef, useCallback } from "react";
import { useScrollAnimation } from "./Usescrollanimation";
import { supabase } from "./supabaseClient";

// ─── Styles ───────────────────────────────────────────────────────────────────
const FEEDBACK_STYLES = `
  @keyframes fbPopUp {
    from { opacity:0; transform:translateY(60px) scale(0.9); }
    to   { opacity:1; transform:translateY(0)    scale(1);   }
  }
  @keyframes cameraFlash {
    0%   { opacity:0 }
    50%  { opacity:1 }
    100% { opacity:0 }
  }
  @keyframes postItSlideIn {
    from { opacity:0; transform:translate(-50%,-60%) rotate(-5deg) scale(0.8); }
    to   { opacity:1; transform:translate(-50%,-50%) rotate(-3deg) scale(1);   }
  }
  @keyframes postItSlideOut {
    from { opacity:1; transform:translate(-50%,-50%) rotate(-3deg) scale(1);   }
    to   { opacity:0; transform:translate(-50%,-40%) rotate(-3deg) scale(0.8); }
  }
  @keyframes pinDrop {
    0%   { transform:translateY(-20px) scale(1.2); }
    60%  { transform:translateY(4px)   scale(0.95); }
    100% { transform:translateY(0)     scale(1);   }
  }
  @keyframes cardFadeIn {
    from { opacity:0; transform:translateY(10px); }
    to   { opacity:1; transform:translateY(0);    }
  }

  .feedback-section {
    min-height:100vh; padding:80px 40px; color:#fff;
    opacity:0; transform:translateY(60px) scale(0.9);
  }
  .feedback-section.animate-in {
    animation:fbPopUp 1s cubic-bezier(0.34,1.56,0.64,1) forwards;
  }

  .camera-flash {
    position:fixed; inset:0; background:#fff;
    z-index:9998; pointer-events:none;
    animation:cameraFlash 0.5s ease-out;
  }

  /* Post-it — used only on draw tab, positioned inside the panel */
  .post-it-inline {
    position:absolute; top:50%; left:50%;
    transform:translate(-50%,-50%) rotate(-3deg);
    background:#FEFF9C; padding:30px 35px;
    box-shadow:0 4px 6px rgba(0,0,0,.1),0 8px 15px rgba(0,0,0,.15),inset 0 -2px 5px rgba(0,0,0,.05);
    border-radius:2px;
    font-family:'Comic Sans MS','Marker Felt',cursive;
    font-size:18px; color:#333; text-align:center;
    z-index:10; min-width:250px; pointer-events:none;
    animation:postItSlideIn 0.3s cubic-bezier(0.34,1.56,0.64,1);
  }
  .post-it-inline::before {
    content:''; position:absolute; top:0; left:0; right:0;
    height:30px; background:linear-gradient(to bottom,rgba(0,0,0,.03),transparent);
  }
  .post-it-emoji { font-size:32px; display:block; margin-bottom:10px; }
  .post-it-text  { font-weight:bold; line-height:1.4; white-space:pre-line; }

  /* Window chrome */
  .paint-window {
    max-width:900px; margin:0 auto; background:var(--theme-bg,#C0C0C0);
    border:3px solid; border-color:#DFDFDF #404040 #404040 #DFDFDF;
    box-shadow:0 0 0 1px #000,4px 4px 0 2px rgba(0,0,0,.3),0 20px 60px rgba(0,0,0,.6);
    font-family:'MS Sans Serif','Tahoma',Arial,sans-serif;
  }
  .paint-titlebar {
    padding:3px 4px; display:flex; align-items:center; gap:6px;
    border-bottom:2px solid #000;
  }
  .paint-icon  { font-size:14px; }
  .paint-title { flex:1; color:#fff; font-size:11px; font-weight:bold; letter-spacing:.5px; }
  .paint-controls { display:flex; gap:3px; }
  .paint-control-btn {
    width:16px; height:14px; background:#C0C0C0;
    border:2px solid; border-color:#FFF #000 #000 #FFF;
    font-size:9px; font-weight:bold; cursor:pointer;
    display:flex; align-items:center; justify-content:center; padding:0; color:#000;
  }

  /* Menubar */
  .paint-menubar {
    background:#C0C0C0; padding:2px 3px;
    display:flex; gap:4px; flex-wrap:wrap;
    border-bottom:2px solid; border-color:#FFF #808080 #808080 #FFF;
    font-size:11px;
  }
  .paint-menu-item {
    padding:2px 8px; cursor:pointer; color:#000;
    border:2px solid transparent; user-select:none;
  }
  .paint-menu-item:hover  { background:#000080; color:#fff; }
  .paint-menu-item.active { background:#000080; color:#fff; border-color:#FFF #808080 #808080 #FFF; }

  /* Layout */
  .paint-content {
    display:flex; background:var(--theme-bg,#C0C0C0);
    padding:3px; gap:3px; min-height:520px;
  }
  .paint-toolbox {
    background:#C0C0C0;
    border:2px solid; border-color:#FFF #808080 #808080 #FFF;
    padding:3px; display:flex; flex-direction:column; gap:6px;
  }
  .paint-tools-label {
    font-size:9px; font-weight:bold; text-align:center;
    padding:4px; background:#C0C0C0; border:1px solid #808080; color:#000;
  }
  .dev-profile-btn {
    width:64px; height:64px; background:#C0C0C0;
    border:3px solid; border-color:#FFF #000 #000 #FFF;
    cursor:pointer; display:flex; align-items:center;
    justify-content:center; font-size:28px; padding:2px;
  }
  .dev-profile-btn.active, .dev-profile-btn:active {
    border-color:#000 #FFF #FFF #000; background:#808080;
    padding-top:4px; padding-left:4px;
  }
  .paint-canvas-container {
    flex:1; background:#808080;
    border:2px solid; border-color:#000 #FFF #FFF #000;
    padding:3px; overflow:hidden;
  }
  .paint-inner {
    background:#fff; width:100%; height:100%;
    padding:20px; overflow-y:auto;
    font-family:'MS Sans Serif',sans-serif; font-size:11px; color:#000;
    border:1px solid #000;
  }
  /* Draw tab inner — no overflow/scroll, fixed layout */
  .paint-inner-draw {
    background:#fff; width:100%; height:100%;
    padding:10px; overflow:hidden;
    font-family:'MS Sans Serif',sans-serif; font-size:11px; color:#000;
    border:1px solid #000; box-sizing:border-box;
    display:flex; flex-direction:column; position:relative;
  }
  .panel-title { font-size:16px; font-weight:bold; color:#000080; margin-bottom:12px; }

  /* Form elements */
  .paint-input, .paint-select, .paint-textarea {
    width:100%; background:#fff;
    border:2px solid; border-color:#808080 #fff #fff #808080;
    padding:4px 6px;
    font-family:'MS Sans Serif',sans-serif; font-size:11px; color:#000;
    box-sizing:border-box;
  }
  .paint-textarea { resize:vertical; }
  .paint-star-btn {
    background:#C0C0C0; border:2px solid; border-color:#FFF #000 #000 #FFF;
    width:28px; height:28px; font-size:16px; cursor:pointer;
    display:flex; align-items:center; justify-content:center;
  }
  .paint-star-btn.lit { background:#FFD700; }
  .paint-submit-btn {
    width:100%; padding:8px 16px; background:#C0C0C0;
    border:3px solid; border-color:#FFF #000 #000 #FFF;
    font-size:11px; font-weight:bold; cursor:pointer; color:#000;
    letter-spacing:.5px; margin-top:8px;
  }
  .paint-submit-btn:hover  { background:#DFDFDF; }
  .paint-submit-btn:active { border-color:#000 #FFF #FFF #000; padding-top:10px; }
  .paint-submit-btn:disabled { opacity:0.5; cursor:not-allowed; }

  /* Reviews Wall */
  .reviews-wall {
    display:grid;
    grid-template-columns:repeat(auto-fill,minmax(190px,1fr));
    gap:12px; padding:4px;
  }
  .review-card {
    background:#FEFF9C; padding:12px;
    box-shadow:2px 3px 0 rgba(0,0,0,.15);
    border:1px solid #e0c060; position:relative;
    animation:cardFadeIn .3s ease-out;
  }
  .review-card::before {
    content:''; position:absolute; top:0; left:0; right:0;
    height:6px; background:linear-gradient(to bottom,rgba(0,0,0,.06),transparent);
  }
  .rc-name  { font-weight:bold; font-size:12px; color:#000; margin-bottom:3px; }
  .rc-cat   { font-size:10px; color:#666; font-style:italic; margin-bottom:5px; }
  .rc-stars { font-size:13px; margin-bottom:6px; }
  .rc-msg   { font-size:11px; color:#333; line-height:1.5; margin-bottom:6px; word-break:break-word; }
  .rc-date  { font-size:9px; color:#999; }

  /* Art Wall */
  .art-wall-bg {
    background:#c8963e;
    background-image:
      repeating-linear-gradient(0deg,rgba(0,0,0,.04) 0,rgba(0,0,0,.04) 1px,transparent 1px,transparent 40px),
      repeating-linear-gradient(90deg,rgba(0,0,0,.04) 0,rgba(0,0,0,.04) 1px,transparent 1px,transparent 40px);
    min-height:480px; padding:24px 16px;
    display:flex; flex-wrap:wrap; gap:24px;
    align-items:flex-start; justify-content:center; overflow-y:auto;
  }
  .art-item {
    position:relative; margin-top:18px;
    animation:pinDrop 0.4s cubic-bezier(0.34,1.56,0.64,1);
  }
  .art-pin {
    position:absolute; top:-14px; left:50%; transform:translateX(-50%);
    width:12px; height:12px; background:#cc2200;
    border-radius:50%; border:2px solid #991100;
    box-shadow:0 2px 4px rgba(0,0,0,.4); z-index:1;
  }
  .art-frame {
    background:#5c3317; padding:6px 6px 22px 6px;
    box-shadow:2px 2px 0 rgba(0,0,0,.5);
  }
  .art-inner { background:#fff; padding:2px; }
  .art-label {
    font-family:'Comic Sans MS','Marker Felt',cursive;
    font-size:10px; color:#FEFF9C; text-align:center;
    margin-top:4px; padding:0 2px;
  }

  /* Canvas draw */
  .canvas-toolbar {
    display:flex; gap:6px; align-items:center;
    padding:6px 0 8px; flex-wrap:wrap; flex-shrink:0;
  }
  .ctool {
    background:#C0C0C0; border:2px solid; border-color:#FFF #000 #000 #FFF;
    padding:3px 8px; font-size:10px; cursor:pointer; color:#000;
    font-family:'MS Sans Serif',sans-serif;
  }
  .ctool:active { border-color:#000 #FFF #FFF #000; }
  .ctool.active { border-color:#000 #FFF #FFF #000; background:#a0a0a0; }
  .color-swatch {
    width:22px; height:22px; cursor:pointer; flex-shrink:0;
    border:3px solid; border-color:#FFF #000 #000 #FFF;
  }
  .color-swatch.sel { border-color:#000 #FFF #FFF #000; }
  .draw-canvas {
    display:block; background:#fff; cursor:crosshair;
    border:1px solid #000; width:100%; flex:1; min-height:0; touch-action:none;
  }

  /* Help panel */
  .help-content { display:flex; flex-direction:column; gap:20px; }
  .help-section {
    padding:15px; background:#f0f0f0;
    border:2px solid; border-color:#FFF #808080 #808080 #FFF;
  }
  .help-icon  { font-size:2.5rem; margin-bottom:10px; }
  .help-title { font-size:14px; color:#000080; margin:0 0 8px; font-weight:bold; }
  .help-text  { font-size:11px; line-height:1.5; color:#000; margin:0; }

  /* Statusbar */
  .paint-statusbar {
    background:#C0C0C0; border-top:2px solid #FFF;
    padding:3px 6px; display:flex; justify-content:space-between;
    align-items:center; font-size:11px; color:#000;
  }
  .paint-status-text { flex:1; font-size:10px; }
  .coord-display {
    min-width:90px; padding:1px 6px;
    border:2px solid; border-color:#808080 #FFF #FFF #808080;
    background:#fff; font-family:'Courier New',monospace; font-size:10px; color:#000;
  }

  /* Section wrapper */
  .feedback-header       { text-align:center; margin-bottom:3rem; }
  .feedback-title        { font-size:2.5rem; color:#22d3ee; margin-bottom:1rem; letter-spacing:.05em; }
  .feedback-description  { font-size:1.1rem; color:#94a3b8; max-width:600px; margin:0 auto; }
  .paint-interface-wrapper { max-width:1000px; margin:0 auto; }

  @media (max-width:768px) {
    .paint-content   { flex-direction:column; }
    .paint-toolbox   { flex-direction:row; overflow-x:auto; }
    .dev-profile-btn { width:56px; height:56px; }
  }
`;

// ─── Draw colour palette ──────────────────────────────────────────────────────
const PALETTE = [
  "#000000","#FFFFFF","#FF1493","#FF6B6B",
  "#FFD700","#FFA500","#00CC66","#4488FF",
  "#9966FF","#8B4513","#C0C0C0","#808080",
];

// ─── DrawCanvas ───────────────────────────────────────────────────────────────
function DrawCanvas({ onPost, posted, artistName }) {
  const canvasRef = useRef(null);
  const drawing   = useRef(false);
  const last      = useRef({ x: 0, y: 0 });
  const saved     = useRef(null);

  const [color,     setColor]     = useState("#000000");
  const [brushSize, setBrushSize] = useState(3);
  const [eraser,    setEraser]    = useState(false);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  }, []);

  const getPos = (e) => {
    const r   = canvasRef.current.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return {
      x: (src.clientX - r.left) * (canvasRef.current.width  / r.width),
      y: (src.clientY - r.top)  * (canvasRef.current.height / r.height),
    };
  };

  const onStart = (e) => {
    if (posted) return;
    e.preventDefault();
    drawing.current = true;
    last.current    = getPos(e);
  };

  const onMove = (e) => {
    if (posted) return;
    e.preventDefault();
    if (!drawing.current) return;
    const ctx = canvasRef.current.getContext("2d");
    const p   = getPos(e);
    ctx.strokeStyle = eraser ? "#FFFFFF" : color;
    ctx.lineWidth   = eraser ? brushSize * 3 : brushSize;
    ctx.lineCap = ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
  };

  const onEnd = (e) => {
    if (posted) return;
    e.preventDefault();
    if (!drawing.current) return;
    drawing.current = false;
    saved.current   = canvasRef.current.toDataURL();
  };

  const clear = () => {
    if (posted) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    saved.current = null;
  };

  const handlePost = () => {
    onPost(canvasRef.current.toDataURL());
  };

  return (
    <>
      <div className="canvas-toolbar">
        <span style={{ fontSize: "10px", fontWeight: "bold" }}>Size:</span>
        <input
          type="range" min="1" max="20" value={brushSize}
          onChange={(e) => setBrushSize(+e.target.value)}
          style={{ width: "70px" }}
          disabled={posted}
        />
        <span style={{ fontSize: "10px", minWidth: "16px" }}>{brushSize}</span>

        <span style={{ fontSize: "10px", fontWeight: "bold", marginLeft: "6px" }}>Color:</span>
        <div style={{ display: "flex", gap: "3px", flexWrap: "wrap" }}>
          {PALETTE.map((c) => (
            <div
              key={c}
              className={`color-swatch ${color === c && !eraser ? "sel" : ""}`}
              style={{ background: c, opacity: posted ? 0.5 : 1, cursor: posted ? "not-allowed" : "pointer" }}
              onClick={() => { if (!posted) { setColor(c); setEraser(false); } }}
            />
          ))}
        </div>
        <button className={`ctool ${eraser ? "active" : ""}`} onClick={() => { if (!posted) setEraser((v) => !v); }} disabled={posted}>
          Eraser
        </button>
        <button className="ctool" onClick={clear} disabled={posted}>Clear</button>
      </div>

      <canvas
        ref={canvasRef}
        className="draw-canvas"
        width={700} height={340}
        style={{ cursor: posted ? "not-allowed" : "crosshair" }}
        onMouseDown={onStart}  onMouseMove={onMove}  onMouseUp={onEnd}  onMouseLeave={onEnd}
        onTouchStart={onStart} onTouchMove={onMove}  onTouchEnd={onEnd}
      />

      <div style={{ paddingTop: "8px", borderTop: "2px solid #FFF", marginTop: "6px", flexShrink: 0 }}>
        {posted ? (
          <div style={{ textAlign: "center", color: "#008000", fontWeight: "bold", fontSize: "12px", padding: "8px" }}>
            ✅ "{artistName}" is on the Art Wall!
          </div>
        ) : (
          <button className="paint-submit-btn" style={{ marginTop: 0 }} onClick={handlePost}>
            📸 POST TO ART WALL
          </button>
        )}
      </div>
    </>
  );
}

// ─── Art Wall Item ────────────────────────────────────────────────────────────
const ROTATIONS = [-2, 1.5, -0.5, 2, -1.5, 0.5, -2.5, 1, -1, 2.5];

function ArtItem({ drawing, index }) {
  const rot = ROTATIONS[index % ROTATIONS.length];
  return (
    <div className="art-item" style={{ transform: `rotate(${rot}deg)` }}>
      <div className="art-pin" />
      <div className="art-frame">
        <div className="art-inner">
          <img
            src={drawing.img}
            alt={`Drawing by ${drawing.name}`}
            width={160} height={100}
            style={{ display: "block", objectFit: "cover" }}
          />
        </div>
        <div className="art-label">{drawing.name}</div>
      </div>
    </div>
  );
}

// ─── Tab config ───────────────────────────────────────────────────────────────
const TABS = [
  { id: "form",   label: "📝 Review Form", toolIcon: "📋", toolLabel: "📝 FORM"  },
  { id: "wall",   label: "⭐ Reviews",       toolIcon: "⭐", toolLabel: "⭐ WALL"  },
  { id: "art",    label: "🖼️ Art Wall",      toolIcon: "🖼️", toolLabel: "🖼️ ART"  },
  { id: "canvas", label: "✏️ Draw",          toolIcon: "🖌️", toolLabel: "🖌️ DRAW" },
  { id: "help",   label: "❓ Help",          toolIcon: "❓", toolLabel: "❓ HELP"  },
];

const STATUS_TEXT = {
  form:   "Fill out the form to submit your feedback",
  wall:   "All reviews are public, thanks for being kind 💖",
  art:    "Everyone's drawings on the wall 🎨",
  canvas: "Draw freely, (Nothing inapropriate please) then post it to the Art Wall! ",
  help:   "Help and guidance for submitting feedback",
};

// ─── PaintInterface ───────────────────────────────────────────────────────────
function PaintInterface() {
  const EMPTY = { name: "", category: "Select a category", rating: 0, message: "" };

  const [tab,         setTab]         = useState("form");
  const [formData,    setFormData]    = useState(EMPTY);
  const [reviews,     setReviews]     = useState([]);
  const [drawings,    setDrawings]    = useState([]);
  const [showFlash,   setShowFlash]   = useState(false);
  const [submitted,   setSubmitted]   = useState(false);
  const [loading,     setLoading]     = useState(true);
  const [saving,      setSaving]      = useState(false);

  // Draw tab state — persists while on the page
  const [drawPosted,    setDrawPosted]    = useState(false);
  const [drawArtistName, setDrawArtistName] = useState("");
  const [showDrawPostIt, setShowDrawPostIt] = useState(false);

  const fc = (field, val) => setFormData((p) => ({ ...p, [field]: val }));

  // ── Fetch from Supabase on mount ──
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data: reviewData } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      const { data: drawingData } = await supabase
        .from("drawings")
        .select("*")
        .order("created_at", { ascending: false });

      if (reviewData)  setReviews(reviewData);
      if (drawingData) setDrawings(drawingData);
      setLoading(false);
    };

    fetchData();
  }, []);

  // ── Submit review ──
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (formData.category === "Select a category") { alert("Please pick a category!"); return; }
    if (!formData.message.trim()) { alert("Please write your review!"); return; }

    setSaving(true);

    const newReview = {
      name:     formData.name.trim() || "Anonymous",
      category: formData.category,
      rating:   formData.rating,
      message:  formData.message,
      date:     new Date().toLocaleDateString(),
    };

    const { data, error } = await supabase.from("reviews").insert([newReview]).select();

    setSaving(false);

    if (error) {
      alert("Oops! Couldn't save your review. Try again!");
      console.error(error);
      return;
    }

    setReviews((prev) => [data[0], ...prev]);
    setFormData(EMPTY);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
    // Go directly to reviews tab — no sticky note
    setTab("wall");
  };

  // ── Post drawing ──
  const handlePostDrawing = useCallback(async (dataUrl) => {
    const name  = prompt("Sign your artwork! (or leave blank for Anonymous)") ?? "";
    const label = name.trim() || "Anonymous Artist";

    // Convert base64 dataUrl to a Blob for Storage upload
    const res        = await fetch(dataUrl);
    const blob       = await res.blob();
    const fileName = `drawing_${Date.now()}.png`;

    // Upload image to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("drawings")
      .upload(fileName, blob, { contentType: "image/png" });

    if (uploadError) {
      alert("Oops! Couldn't upload your drawing. Try again!");
      console.error(uploadError);
      return;
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from("drawings")
      .getPublicUrl(fileName);

    const publicUrl = urlData.publicUrl;

    // Save the public URL + name to the drawings table
    const { data, error } = await supabase
      .from("drawings")
      .insert([{ img: publicUrl, name: label }])
      .select();

    if (error) {
      alert("Oops! Couldn't save your drawing. Try again!");
      console.error(error);
      return;
    }

    setDrawings((prev) => [data[0], ...prev]);
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 500);

    // Lock the draw tab and show post-it there
    setDrawPosted(true);
    setDrawArtistName(label);
    setShowDrawPostIt(true);
    // Stay on draw tab — do NOT switch away
  }, []);

  const currentTab = TABS.find((t) => t.id === tab);

  return (
    <>
      {showFlash && <div className="camera-flash" />}

      <div className="paint-window" style={{ "--theme-bg": "#FFE4F0" }}>

        {/* Title bar */}
        <div
          className="paint-titlebar"
          style={{ background: "linear-gradient(180deg,#FF1493 0%,#C71585 100%)" }}
        >
          <div className="paint-icon">🐛</div>
          <span className="paint-title">For Reviews &amp; Feelings </span>
          <div className="paint-controls">
            <button className="paint-control-btn" onClick={(e) => e.preventDefault()}>−</button>
            <button className="paint-control-btn" onClick={(e) => e.preventDefault()}>□</button>
            <button className="paint-control-btn" onClick={(e) => e.preventDefault()} style={{ cursor: "not-allowed", opacity: .5 }}>×</button>
          </div>
        </div>

        {/* Menu bar */}
        <div className="paint-menubar">
          {TABS.map((t) => (
            <span
              key={t.id}
              className={`paint-menu-item ${tab === t.id ? "active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </span>
          ))}
        </div>

        {/* Body */}
        <div className="paint-content">

          {/* Toolbox */}
          <div className="paint-toolbox">
            <div className="paint-tools-label">{currentTab?.toolLabel}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {TABS.map((t) => (
                <button
                  key={t.id}
                  className={`dev-profile-btn ${tab === t.id ? "active" : ""}`}
                  onClick={() => setTab(t.id)}
                  title={t.label}
                >
                  <span style={{ fontSize: "28px" }}>{t.toolIcon}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main panel */}
          <div className="paint-canvas-container">

            {/* ── Feedback Form ── */}
            {tab === "form" && (
              <div className="paint-inner">
                <div className="panel-title">Submit Your Feedback</div>

                {submitted && (
                  <div style={{ color: "green", fontWeight: "bold", fontSize: "12px", marginBottom: "10px" }}>
                    ✅ Review posted to the Reviews Wall!
                  </div>
                )}

                <form onSubmit={handleSubmitReview} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div>
                    <label style={{ fontSize: "10px", fontWeight: "bold", display: "block", marginBottom: "3px" }}>Name:</label>
                    <input
                      type="text" className="paint-input"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => fc("name", e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "10px", fontWeight: "bold", display: "block", marginBottom: "3px" }}>Category:</label>
                    <select className="paint-select" value={formData.category} onChange={(e) => fc("category", e.target.value)}>
                      <option>Select a category</option>
                      <option>🐛 Bug Report</option>
                      <option>💡 Feature Request</option>
                      <option>💬 General Feedback</option>
                      <option>🎮 Gameplay Experience</option>
                      <option>🎨 Graphics &amp; Sound</option>
                      <option>❓ Other</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: "10px", fontWeight: "bold", display: "block", marginBottom: "3px" }}>Rating:</label>
                    <div style={{ display: "flex", gap: "4px" }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s} type="button"
                          className={`paint-star-btn ${formData.rating >= s ? "lit" : ""}`}
                          onClick={() => fc("rating", s)}
                        >
                          ⭐
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: "10px", fontWeight: "bold", display: "block", marginBottom: "3px" }}>Message:</label>
                    <textarea
                      className="paint-textarea" rows={8}
                      placeholder="Tell us what you think about SIKLAB..."
                      value={formData.message}
                      onChange={(e) => fc("message", e.target.value)}
                    />
                  </div>

                  <button type="submit" className="paint-submit-btn" disabled={saving}>
                    {saving ? "SAVING..." : "SUBMIT FEEDBACK"}
                  </button>
                </form>
              </div>
            )}

            {/* ── Reviews Wall ── */}
            {tab === "wall" && (
              <div className="paint-inner">
                <div className="panel-title">⭐ Reviews Wall</div>
                {loading ? (
                  <div style={{ textAlign: "center", padding: "40px 20px", color: "#808080", fontSize: "12px" }}>
                    <div style={{ fontSize: "24px", marginBottom: "8px" }}>⏳</div>
                    Loading reviews...
                  </div>
                ) : reviews.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 20px", color: "#808080", fontSize: "12px" }}>
                    <div style={{ fontSize: "32px", marginBottom: "8px" }}>📭</div>
                    No reviews yet. Be the first!
                  </div>
                ) : (
                  <div className="reviews-wall">
                    {reviews.map((r) => (
                      <div key={r.id} className="review-card">
                        <div className="rc-name">{r.name}</div>
                        <div className="rc-cat">{r.category}</div>
                        {r.rating > 0 && <div className="rc-stars">{"⭐".repeat(r.rating)}</div>}
                        <div className="rc-msg">{r.message}</div>
                        <div className="rc-date">{r.date}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Art Wall ── */}
            {tab === "art" && (
              <div className="art-wall-bg">
                {loading ? (
                  <div style={{ textAlign: "center", padding: "60px 20px", color: "#7a5c30", fontFamily: "'MS Sans Serif',sans-serif", fontSize: "13px", fontWeight: "bold", width: "100%" }}>
                    <div style={{ fontSize: "36px", marginBottom: "10px" }}>⏳</div>
                    Loading drawings...
                  </div>
                ) : drawings.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px 20px", color: "#7a5c30", fontFamily: "'MS Sans Serif',sans-serif", fontSize: "13px", fontWeight: "bold", width: "100%" }}>
                    <div style={{ fontSize: "36px", marginBottom: "10px" }}>🖌️</div>
                    No drawings yet!<br />Use the Draw tab to add yours.
                  </div>
                ) : (
                  drawings.map((d, i) => <ArtItem key={d.id} drawing={d} index={i} />)
                )}
              </div>
            )}

            {/* ── Draw ── */}
            {tab === "canvas" && (
              <div className="paint-inner-draw">
                <div className="panel-title" style={{ flexShrink: 0 }}>✏️ Express through drawing how you felt about the game!</div>

                {/* Post-it overlay — stays visible after posting */}
                {showDrawPostIt && (
                  <div className="post-it-inline">
                    <span className="post-it-emoji">📸</span>
                    <div className="post-it-text">
                      {`"${drawArtistName}" is now\non the Art Wall! ✨`}
                    </div>
                  </div>
                )}

                <DrawCanvas
                  onPost={handlePostDrawing}
                  posted={drawPosted}
                  artistName={drawArtistName}
                />
              </div>
            )}

            {/* ── Help ── */}
            {tab === "help" && (
              <div className="paint-inner">
                <div className="panel-title">Help &amp; Information</div>
                <div className="help-content">
                  <div className="help-section">
                    <div className="help-icon">💬</div>
                    <h3 className="help-title">Share Your Thoughts</h3>
                    <p className="help-text">
                      Every piece of feedback helps us create a better gaming experience for everyone.
                      Your reviews are posted publicly on the Reviews Wall.
                    </p>
                  </div>
                  <div className="help-section">
                    <div className="help-icon">🐛</div>
                    <h3 className="help-title">Report Bugs</h3>
                    <p className="help-text">Found a bug? Let us know so we can fix it quickly and improve the game.</p>
                  </div>
                  <div className="help-section">
                    <div className="help-icon">💡</div>
                    <h3 className="help-title">Suggest Features</h3>
                    <p className="help-text">Have an idea for a new feature? We'd love to hear your creative suggestions!</p>
                  </div>
                  <div className="help-section">
                    <div className="help-icon">🎨</div>
                    <h3 className="help-title">Art Wall</h3>
                    <p className="help-text">
                      Use the Draw tab to doodle how you felt playing SIKLAB, then post it to the Art Wall
                      for everyone to see — just like drawings on a classroom wall!
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Status bar */}
        <div className="paint-statusbar">
          <span className="paint-status-text">{STATUS_TEXT[tab]}</span>
          <div className="coord-display">Mode: {tab.charAt(0).toUpperCase() + tab.slice(1)}</div>
        </div>

      </div>
    </>
  );
}

// ─── FeedbackSection (exported) ───────────────────────────────────────────────
const FeedbackSection = forwardRef(function FeedbackSection(_props, ref) {
  const [animRef, isVisible] = useScrollAnimation({ threshold: 0.15 });

  return (
    <>
      <style>{FEEDBACK_STYLES}</style>
      <section
        className={`feedback-section section-full ${isVisible ? "animate-in" : ""}`}
        ref={(node) => {
          animRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        id="feedback"
      >
        <div className="container">
          <div className="feedback-header">
            <h1 className="feedback-title">BUG REPORTS &amp; FEEDBACK</h1>
            <p className="feedback-description">
              Help us improve SIKLAB by sharing your thoughts, reviews, and drawings
            </p>
          </div>
          <div className="paint-interface-wrapper">
            <PaintInterface />
          </div>
        </div>
      </section>
    </>
  );
});

export default FeedbackSection;