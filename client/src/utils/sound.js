// Subtle, pleasant notification chime using Web Audio API
export const playNotificationSound = () => {
  try {
    const isSoundEnabled = localStorage.getItem("bhatchat_sound") !== "false";
    if (!isSoundEnabled) return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    // Harmonic pleasant frequencies (587.33Hz D5 -> 880Hz A5)
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch {
    // Audio autoplay or permissions policy may prevent sound in background tab
  }
};
