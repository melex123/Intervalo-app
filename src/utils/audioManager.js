// Audio manager for beeps during prep phase
class AudioManager {
    constructor() {
        this.enabled = true;
        this.audioContext = null;
    }

    _getContext() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume().catch(() => {});
        }
        return this.audioContext;
    }

    beep(frequency = 800, duration = 100) {
        if (!this.enabled) return;

        try {
            const audioContext = this._getContext();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration / 1000);
        } catch (error) {
            console.warn('Audio not supported:', error);
        }
    }

    prepBeep() {
        this.beep(600, 100);
    }

    finalBeep() {
        this.beep(1000, 150);
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
}

export const audioManager = new AudioManager();
export default audioManager;
