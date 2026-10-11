import communitySfx from "./assets/sounds/Community.mp3";

let audio = null;
let unlockBound = false;

export function getSiteMusic() {
  if (!audio) {
    audio = new Audio(communitySfx);
    audio.loop = true;
    audio.volume = 0.35;
    audio.preload = "auto";
  }
  return audio;
}

function bindUnlock(track) {
  if (unlockBound) return;
  unlockBound = true;

  const resume = () => {
    if (track.muted) return;
    track
      .play()
      .then(() => {
        window.removeEventListener("pointerdown", resume);
        window.removeEventListener("keydown", resume);
        unlockBound = false;
      })
      .catch(() => {});
  };

  window.addEventListener("pointerdown", resume);
  window.addEventListener("keydown", resume);
}

export function playSiteMusic() {
  const track = getSiteMusic();
  const attempt = track.play();
  if (attempt && typeof attempt.catch === "function") {
    attempt.catch(() => bindUnlock(track));
  }
  return attempt;
}
