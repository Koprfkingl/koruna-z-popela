/* On Android the WebView has no speech synthesis, so the native text-to-speech plugin stands in for it.
   In a browser or on Windows this file does nothing. */
(function () {
  const C = window.Capacitor;
  if (!C || !C.isNativePlatform || !C.isNativePlatform()) return;
  const TTS = C.registerPlugin('TextToSpeech');
  class Utterance { constructor(text) { this.text = text || ''; this.lang = 'cs-CZ'; this.rate = 1; this.pitch = 1; this.volume = 1; this.voice = null; this.onend = null; this.onerror = null; } }
  const synth = {
    speaking: false, pending: false, paused: false, onvoiceschanged: null,
    getVoices: () => [],
    speak(u) {
      synth.speaking = true;
      TTS.speak({ text: u.text, lang: u.lang || 'cs-CZ', rate: u.rate || 1, pitch: u.pitch || 1, volume: u.volume == null ? 1 : u.volume, category: 'playback' })
        .then(() => { synth.speaking = false; if (u.onend) u.onend({}); })
        .catch(e => { synth.speaking = false; if (u.onerror) u.onerror(e); });
    },
    cancel() { synth.speaking = false; TTS.stop().catch(() => {}); },
    pause() {}, resume() {}, addEventListener() {}, removeEventListener() {}
  };
  try { Object.defineProperty(window, 'speechSynthesis', { value: synth, configurable: true }); } catch (e) { window.speechSynthesis = synth; }
  try { Object.defineProperty(window, 'SpeechSynthesisUtterance', { value: Utterance, configurable: true, writable: true }); } catch (e) { window.SpeechSynthesisUtterance = Utterance; }
})();
