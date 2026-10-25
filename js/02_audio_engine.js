/**
 * 02_audio_engine.js
 * Gwyn Dorado Music Video Studio - Web Audio FFT, Beat Detector & Procedural Synthesizer Engine
 * 
 * Provides:
 *  - High-precision Web Audio Graph (AnalyserNode 2048, Master Gain, MediaStreamDestination)
 *  - Mode A ("file"): Decoded user audio file with fast RMS peak extraction & spectral flux beat detector
 *  - Mode B ("synth"): Procedural Gwyn Dorado Acoustic Ballad synthesizer (Acoustic Guitar, Rhodes, String Pad, Bass Bloom, Music Box)
 *  - Real-time 4-band FFT telemetry (bass, mid, vocalPresence, treble, rms, isBeat) with smooth procedural fallback
 *  - Direct audio streaming for canvas MediaRecorder video export
 */

(function () {
  'use strict';

  // Ensure namespace
  window.DoradoStudio = window.DoradoStudio || {};

  class AudioEngineService {
    constructor() {
      // Audio Graph Core
      this.audioCtx = null;
      this.analyser = null;
      this.masterGain = null;
      this.streamDest = null;

      // Playback State
      this.mode = 'synth'; // 'synth' | 'file'
      this.durationSec = 64;
      this.bpm = 72;
      this.fileName = 'Gwyn Dorado - Procedural Acoustic (Built-in)';
      this.isPlayingState = false;
      this.currentTimeSec = 0;
      this.playStartTime = 0;
      this.playStartOffset = 0;

      // Telemetry & Waveform Data
      this.waveformPeaks = []; // 400 normalized floats (0.0 .. 1.0)
      this.beats = [];         // Timestamp array in seconds
      this.freqData = null;    // Uint8Array(1024)
      this.timeData = null;    // Uint8Array(2048)
      this._prevBass = 0;

      // Mode A ("file") State
      this.audioBuffer = null;
      this.sourceNode = null;

      // Mode B ("synth") State & Scheduling
      this.activeSynthVoices = new Set();
      this.synthSchedulerTimer = null;
      this.scheduledUntilTime = 0;
      this.lookaheadSec = 0.20; // 200ms scheduling lookahead
      this.schedulerIntervalMs = 35; // 35ms tick

      // Event Subscriptions
      this.listeners = {};

      // Initialize default synthetic preset structure
      this.configurePresetSynth({
        title: 'Light of Love (Procedural Acoustic)',
        durationSec: 64,
        bpm: 72
      });
    }

    /**
     * Lazy-initializes AudioContext and connects audio graph:
     * Sources -> MasterGain -> Analyser -> Destination & StreamDestination
     */
    init() {
      if (this.audioCtx) {
        if (this.audioCtx.state === 'suspended') {
          this.audioCtx.resume().catch(() => {});
        }
        return this.audioCtx;
      }

      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        console.warn('[AudioEngine] Web Audio API is not supported in this environment.');
        return null;
      }

      this.audioCtx = new AudioContextClass();

      // Master Analyser Node
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 2048;
      this.analyser.smoothingTimeConstant = 0.82;

      // Master Volume Gain Node
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(0.85, this.audioCtx.currentTime);

      // MediaStreamAudioDestinationNode for Canvas/Video recording
      if (typeof this.audioCtx.createMediaStreamDestination === 'function') {
        this.streamDest = this.audioCtx.createMediaStreamDestination();
      }

      // Graph routing: masterGain -> analyser -> [speakers & recorder stream]
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.audioCtx.destination);
      if (this.streamDest) {
        this.analyser.connect(this.streamDest);
      }

      // Pre-allocate FFT buffers
      this.freqData = new Uint8Array(this.analyser.frequencyBinCount);
      this.timeData = new Uint8Array(this.analyser.fftSize);

      return this.audioCtx;
    }

    /**
     * Mode A: Loads an audio file (MP3, WAV, OGG, FLAC, M4A), decodes AudioBuffer,
     * extracts 400 waveform peaks, detects beats, and switches to 'file' mode.
     */
    async loadAudioFile(file) {
      if (!file) {
        throw new Error('[AudioEngine] No file provided to loadAudioFile.');
      }

      this.init();
      if (this.isPlayingState) {
        this.pause();
      }

      const arrayBuffer = await file.arrayBuffer();

      // Decode audio data safely across browser versions
      const decodedBuffer = await new Promise((resolve, reject) => {
        this.audioCtx.decodeAudioData(
          arrayBuffer,
          (buf) => resolve(buf),
          (err) => reject(err || new Error('Audio decoding failed.'))
        );
      });

      this.audioBuffer = decodedBuffer;
      this.durationSec = Math.max(1, decodedBuffer.duration);
      this.fileName = file.name;
      this.mode = 'file';
      this.currentTimeSec = 0;

      // 1. Extract 400 normalized peaks
      this.waveformPeaks = this._extractPeaks(decodedBuffer, 400);

      // 2. Detect beats via Spectral Energy Flux
      this.beats = this._detectBeats(decodedBuffer);

      this.emit('loaded', {
        fileName: this.fileName,
        durationSec: this.durationSec,
        waveformPeaks: this.waveformPeaks,
        beats: this.beats,
        mode: this.mode
      });

      return {
        durationSec: this.durationSec,
        waveformPeaks: this.waveformPeaks,
        beats: this.beats,
        fileName: this.fileName
      };
    }

    /**
     * Mode B: Configures procedural synthesizer matching Gwyn Dorado's emotional ballad structure.
     * Generates a 400-point blooming arc waveform envelope and aligned beat timestamps.
     */
    configurePresetSynth(presetObj = {}) {
      if (this.isPlayingState) {
        this.pause();
      }

      this.durationSec = Number(presetObj.durationSec) || 64;
      this.bpm = Number(presetObj.bpm) || 72;
      this.mode = 'synth';
      this.fileName = presetObj.title ? `Built-in: ${presetObj.title}` : 'Gwyn Dorado - Procedural Acoustic (Built-in)';
      this.audioBuffer = null;
      this.currentTimeSec = 0;

      // 1. Build beat grid (quarter-note intervals: 60 / bpm)
      const beatInterval = 60 / this.bpm;
      this.beats = [];
      for (let t = 0; t < this.durationSec; t += beatInterval) {
        this.beats.push(parseFloat(t.toFixed(3)));
      }

      // 2. Generate 400-point synthetic waveform peaks reflecting Blooming Arc
      const numPeaks = 400;
      this.waveformPeaks = [];
      const scenes = presetObj.scenes && presetObj.scenes.length > 0 ? presetObj.scenes : [
        { name: 'Verse', startTime: 0, endTime: 18, convictionLevel: 0.35 },
        { name: 'Chorus', startTime: 18, endTime: 38, convictionLevel: 0.78 },
        { name: 'Bridge', startTime: 38, endTime: 52, convictionLevel: 0.96 },
        { name: 'Outro', startTime: 52, endTime: 64, convictionLevel: 0.22 }
      ];

      for (let i = 0; i < numPeaks; i++) {
        const time = (i / numPeaks) * this.durationSec;
        const scene = scenes.find(s => time >= s.startTime && time < s.endTime) || scenes[scenes.length - 1];
        const cl = scene.convictionLevel != null ? scene.convictionLevel : 0.5;

        // Blooming arc envelope
        const baseAmp = 0.16 + 0.64 * cl;
        const phaseInBeat = (time % beatInterval) / beatInterval;
        const pulse = Math.exp(-phaseInBeat * 3.6) * (0.12 + 0.16 * cl);
        const naturalNoise = Math.sin(i * 0.52) * 0.04 + Math.cos(i * 1.33) * 0.03;
        const peak = Math.max(0.06, Math.min(0.98, baseAmp + pulse + naturalNoise));
        this.waveformPeaks.push(parseFloat(peak.toFixed(4)));
      }

      this.emit('configured', {
        mode: this.mode,
        durationSec: this.durationSec,
        bpm: this.bpm,
        waveformPeaks: this.waveformPeaks,
        beats: this.beats
      });

      return {
        durationSec: this.durationSec,
        waveformPeaks: this.waveformPeaks,
        beats: this.beats,
        fileName: this.fileName
      };
    }

    /**
     * Starts playback from startTimeSec (or current seek position).
     */
    async play(startTimeSec) {
      this.init();

      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        try {
          await this.audioCtx.resume();
        } catch (e) {
          console.warn('[AudioEngine] AudioContext resume failed:', e);
        }
      }

      if (typeof startTimeSec === 'number') {
        this.currentTimeSec = Math.max(0, Math.min(startTimeSec, this.durationSec));
      }

      // If at end of track, loop back to start
      if (this.currentTimeSec >= this.durationSec - 0.05) {
        this.currentTimeSec = 0;
      }

      if (this.isPlayingState) {
        this.pause();
      }

      this.isPlayingState = true;
      this.playStartTime = this.audioCtx.currentTime;
      this.playStartOffset = this.currentTimeSec;

      if (this.mode === 'file' && this.audioBuffer) {
        this._startFilePlayback(this.currentTimeSec);
      } else {
        this._startSynthPlayback(this.currentTimeSec);
      }

      this.emit('play', { currentTime: this.currentTimeSec });
    }

    /**
     * Pauses playback and cleans up active voices/sources.
     */
    pause() {
      if (!this.isPlayingState) {
        return;
      }

      this.currentTimeSec = this.getCurrentTime();
      this.isPlayingState = false;

      // Stop Mode A source
      if (this.sourceNode) {
        try {
          this.sourceNode.stop();
          this.sourceNode.disconnect();
        } catch (e) {}
        this.sourceNode = null;
      }

      // Stop Mode B scheduler & active voices
      if (this.synthSchedulerTimer) {
        clearInterval(this.synthSchedulerTimer);
        this.synthSchedulerTimer = null;
      }
      this._stopAllSynthVoices();

      this.emit('pause', { currentTime: this.currentTimeSec });
    }

    /**
     * Seeks to target time in seconds.
     */
    seek(timeSec) {
      const clamped = Math.max(0, Math.min(timeSec, this.durationSec));
      const wasPlaying = this.isPlayingState;

      if (wasPlaying) {
        // Pause active voices, set position, and immediately resume from new offset
        this.pause();
        this.currentTimeSec = clamped;
        this.play(clamped);
      } else {
        this.currentTimeSec = clamped;
      }

      this.emit('seek', { currentTime: this.currentTimeSec });
    }

    /**
     * Returns current playback position in seconds (0.00 .. durationSec).
     */
    getCurrentTime() {
      if (this.isPlayingState && this.audioCtx) {
        const elapsed = this.audioCtx.currentTime - this.playStartTime;
        const current = this.playStartOffset + elapsed;
        if (current >= this.durationSec) {
          return this.durationSec;
        }
        return Math.max(0, current);
      }
      return Math.max(0, Math.min(this.currentTimeSec, this.durationSec));
    }

    /**
     * Returns total track duration in seconds.
     */
    getDuration() {
      return this.durationSec;
    }

    /**
     * Returns whether audio is currently playing.
     */
    isPlaying() {
      return this.isPlayingState;
    }

    /**
     * Returns the 400-point normalized waveform envelope array.
     */
    getWaveformPeaks() {
      return this.waveformPeaks;
    }

    /**
     * Returns the beat timestamp array in seconds.
     */
    getBeats() {
      return this.beats;
    }

    /**
     * Sets total track duration in seconds.
     */
    setDuration(sec) {
      const d = Math.max(1, Number(sec) || 64);
      this.durationSec = d;
      if (this.mode === 'synth') {
        const beatInterval = 60 / (this.bpm || 72);
        this.beats = [];
        for (let t = 0; t < this.durationSec; t += beatInterval) {
          this.beats.push(parseFloat(t.toFixed(3)));
        }
      }
    }

    /**
     * Sets tempo in BPM.
     */
    setBpm(bpm) {
      const b = Math.max(30, Math.min(240, Number(bpm) || 72));
      this.bpm = b;
      if (this.mode === 'synth') {
        const beatInterval = 60 / this.bpm;
        this.beats = [];
        for (let t = 0; t < this.durationSec; t += beatInterval) {
          this.beats.push(parseFloat(t.toFixed(3)));
        }
      }
    }

    /**
     * Toggles playback state between play and pause.
     * @returns {boolean} Whether audio is now playing
     */
    togglePlay() {
      if (this.isPlayingState) {
        this.pause();
        return false;
      } else {
        this.play();
        return true;
      }
    }

    /**
     * Updates internal clock for procedural fallback or animation loops.
     */
    updateClock(deltaSec) {
      if (this.isPlayingState) {
        if (!this.audioCtx || this.audioCtx.state !== 'running') {
          this.currentTimeSec = Math.min(this.durationSec, this.currentTimeSec + (Number(deltaSec) || 0.016));
          if (this.currentTimeSec >= this.durationSec) {
            this.pause();
          }
        }
      }
    }

    /**
     * Returns instantaneous root-mean-square amplitude (0.0 .. 1.0).
     */
    getRMS() {
      const telem = this.getRealtimeTelemetry(this.getCurrentTime());
      return telem ? telem.rms : 0.05;
    }

    /**
     * Returns raw frequency data Uint8Array for visualizers.
     */
    getFrequencyData() {
      const telem = this.getRealtimeTelemetry(this.getCurrentTime());
      return telem ? telem.freqData : null;
    }

    /**
     * Compatibility alias for configurePresetSynth.
     */
    configurePreset(presetObj) {
      return this.configurePresetSynth(presetObj);
    }

    /**
     * Master Volume control (0.0 to 1.5).
     */
    setVolume(value) {
      if (!this.masterGain && this.audioCtx) {
        this.init();
      }
      if (this.masterGain) {
        const clamped = Math.max(0, Math.min(1.5, Number(value) || 0.85));
        this.masterGain.gain.setValueAtTime(clamped, this.audioCtx.currentTime);
      }
    }

    /**
     * Returns the MediaStream from MediaStreamAudioDestinationNode for MediaRecorder.
     */
    getAudioStream() {
      this.init();
      if (this.streamDest && this.streamDest.stream) {
        return this.streamDest.stream;
      }
      try {
        return new MediaStream();
      } catch (e) {
        return null;
      }
    }

    /**
     * Computes real-time 4-band FFT telemetry & RMS:
     *  - bass: bins 1..12 (~20Hz..260Hz)
     *  - mid: bins 13..60 (~280Hz..1.3kHz)
     *  - vocalPresence: bins 25..110 (~550Hz..2.4kHz)
     *  - treble: bins 111..256 (~2.4kHz..5.6kHz)
     *  - rms: 0.0 .. 1.0 root-mean-square amplitude
     *  - isBeat: boolean
     * 
     * Includes a smooth procedural fallback modulated by currentScene.convictionLevel
     * if AudioContext is suspended or paused, ensuring scrub reactive visuals!
     */
    getRealtimeTelemetry(currentTimeSec, currentScene) {
      const time = typeof currentTimeSec === 'number' ? currentTimeSec : this.getCurrentTime();
      const scene = currentScene || { convictionLevel: 0.5 };
      const conviction = typeof scene.convictionLevel === 'number' ? scene.convictionLevel : 0.5;

      let bass = 0;
      let mid = 0;
      let vocalPresence = 0;
      let treble = 0;
      let rms = 0;
      let isBeat = false;

      const isAudioActive = this.isPlayingState && this.audioCtx && this.audioCtx.state === 'running' && this.analyser;

      if (isAudioActive) {
        if (!this.freqData || this.freqData.length !== this.analyser.frequencyBinCount) {
          this.freqData = new Uint8Array(this.analyser.frequencyBinCount);
          this.timeData = new Uint8Array(this.analyser.fftSize);
        }

        this.analyser.getByteFrequencyData(this.freqData);
        this.analyser.getByteTimeDomainData(this.timeData);

        // 1. Bass (bins 1..12)
        let sumBass = 0;
        for (let i = 1; i <= 12; i++) {
          sumBass += this.freqData[i];
        }
        bass = sumBass / (12 * 255);

        // 2. Mid (bins 13..60)
        let sumMid = 0;
        for (let i = 13; i <= 60; i++) {
          sumMid += this.freqData[i];
        }
        mid = sumMid / (48 * 255);

        // 3. Vocal Presence (bins 25..110)
        let sumVocal = 0;
        for (let i = 25; i <= 110; i++) {
          sumVocal += this.freqData[i];
        }
        vocalPresence = sumVocal / (86 * 255);

        // 4. Treble (bins 111..256)
        let sumTreble = 0;
        for (let i = 111; i <= 256; i++) {
          sumTreble += this.freqData[i];
        }
        treble = sumTreble / (146 * 255);

        // 5. RMS amplitude from time-domain waveform
        let sumSq = 0;
        const len = this.timeData.length;
        for (let i = 0; i < len; i++) {
          const v = (this.timeData[i] - 128) / 128;
          sumSq += v * v;
        }
        rms = Math.min(1.0, Math.sqrt(sumSq / len) * 2.7);

        // 6. Beat detection: timestamp match or transient jump
        const nearBeat = this.beats.some(b => Math.abs(b - time) <= 0.075);
        const transientSpike = bass > 0.42 && (bass - this._prevBass) > 0.12;
        isBeat = nearBeat || transientSpike;
        this._prevBass = bass;

      } else {
        // Procedural Fallback: modulated by currentScene.convictionLevel & time
        const t = time;
        const cl = Math.max(0.05, Math.min(1.0, conviction));

        const pulse1 = 0.5 + 0.5 * Math.sin(t * 3.77);
        const pulse2 = 0.5 + 0.5 * Math.cos(t * 7.54);
        const pulse3 = 0.5 + 0.5 * Math.sin(t * 1.88 + 1.2);

        bass = Math.max(0.05, Math.min(0.95, 0.20 + 0.55 * cl * (0.65 + 0.35 * pulse1)));
        mid = Math.max(0.05, Math.min(0.95, 0.24 + 0.48 * cl * (0.70 + 0.30 * pulse2)));
        vocalPresence = Math.max(0.05, Math.min(0.98, 0.28 + 0.58 * cl * (0.60 + 0.40 * pulse3)));
        treble = Math.max(0.05, Math.min(0.90, 0.15 + 0.40 * cl * (0.55 + 0.45 * pulse1 * pulse2)));
        rms = Math.max(0.05, Math.min(0.95, (bass * 0.35 + mid * 0.3 + vocalPresence * 0.35)));

        isBeat = this.beats.some(b => Math.abs(b - time) <= 0.075);

        // Keep Uint8Array buffers populated for visualizers that directly read freqData / timeData
        if (!this.freqData) {
          this.freqData = new Uint8Array(1024);
          this.timeData = new Uint8Array(2048);
        }
        for (let i = 0; i < this.freqData.length; i++) {
          let bandVal = mid;
          if (i <= 12) bandVal = bass;
          else if (i <= 110) bandVal = vocalPresence;
          else bandVal = treble;
          const decay = Math.exp(-i / 230);
          const ripple = 0.82 + 0.18 * Math.sin(i * 0.38 + t * 4.2);
          this.freqData[i] = Math.floor(Math.min(255, bandVal * 255 * decay * ripple));
        }
        for (let i = 0; i < this.timeData.length; i++) {
          const angle = (i / this.timeData.length) * Math.PI * 8 + t * 10;
          this.timeData[i] = Math.floor(128 + rms * 112 * Math.sin(angle));
        }
      }

      return {
        bass: parseFloat(bass.toFixed(3)),
        mid: parseFloat(mid.toFixed(3)),
        vocalPresence: parseFloat(vocalPresence.toFixed(3)),
        treble: parseFloat(treble.toFixed(3)),
        rms: parseFloat(rms.toFixed(3)),
        isBeat,
        freqData: this.freqData,
        timeData: this.timeData,
        currentTime: parseFloat(time.toFixed(3)),
        duration: this.durationSec,
        isPlaying: this.isPlayingState,
        mode: this.mode
      };
    }

    // =========================================================================
    // INTERNAL: Mode A (File Playback) Implementation
    // =========================================================================

    _startFilePlayback(offsetSec) {
      if (!this.audioBuffer || !this.audioCtx) return;

      const source = this.audioCtx.createBufferSource();
      source.buffer = this.audioBuffer;
      source.connect(this.masterGain);

      const offset = Math.max(0, Math.min(offsetSec, this.durationSec));
      source.start(0, offset);
      this.sourceNode = source;

      source.onended = () => {
        // Natural end of track check
        if (this.isPlayingState && this.getCurrentTime() >= this.durationSec - 0.08) {
          this.pause();
          this.currentTimeSec = this.durationSec;
          this.emit('ended');
        }
      };
    }

    _extractPeaks(audioBuffer, numPeaks = 400) {
      const channelData = audioBuffer.getChannelData(0);
      const totalSamples = channelData.length;
      const step = Math.floor(totalSamples / numPeaks);
      const peaks = new Float32Array(numPeaks);
      let maxPeak = 0;

      for (let i = 0; i < numPeaks; i++) {
        const start = i * step;
        const end = Math.min(start + step, totalSamples);
        let peak = 0;
        for (let j = start; j < end; j++) {
          const abs = Math.abs(channelData[j]);
          if (abs > peak) peak = abs;
        }
        peaks[i] = peak;
        if (peak > maxPeak) maxPeak = peak;
      }

      const normalized = [];
      const normFactor = maxPeak > 0.001 ? 1.0 / maxPeak : 1.0;
      for (let i = 0; i < numPeaks; i++) {
        const val = Math.max(0.04, Math.min(1.0, peaks[i] * normFactor));
        normalized.push(parseFloat(val.toFixed(4)));
      }
      return normalized;
    }

    _detectBeats(audioBuffer) {
      const sampleRate = audioBuffer.sampleRate;
      const channelData = audioBuffer.getChannelData(0);
      const hopSize = 1024; // ~23ms frames
      const numFrames = Math.floor(channelData.length / hopSize);

      if (numFrames < 16) {
        return [0];
      }

      // Energy per frame
      const energies = new Float32Array(numFrames);
      for (let f = 0; f < numFrames; f++) {
        const start = f * hopSize;
        let sum = 0;
        for (let i = 0; i < hopSize; i++) {
          const s = channelData[start + i];
          sum += s * s;
        }
        energies[f] = Math.sqrt(sum / hopSize);
      }

      // Positive Energy Flux
      const flux = new Float32Array(numFrames);
      for (let f = 1; f < numFrames; f++) {
        const diff = energies[f] - energies[f - 1];
        flux[f] = diff > 0 ? diff : 0;
      }

      // Dynamic local thresholding
      const windowRadius = 14;
      const beats = [];
      const minDistanceSec = 0.28; // ~214 BPM max
      let lastBeatSec = -1;

      for (let f = windowRadius; f < numFrames - windowRadius; f++) {
        let localSum = 0;
        for (let w = -windowRadius; w <= windowRadius; w++) {
          localSum += flux[f + w];
        }
        const localAvg = localSum / (2 * windowRadius + 1);
        const threshold = localAvg * 1.48 + 0.012;

        if (flux[f] > threshold && flux[f] >= flux[f - 1] && flux[f] >= flux[f + 1]) {
          const timeSec = (f * hopSize) / sampleRate;
          if (timeSec - lastBeatSec >= minDistanceSec) {
            beats.push(parseFloat(timeSec.toFixed(3)));
            lastBeatSec = timeSec;
          }
        }
      }

      // Fallback if quiet audio
      if (beats.length < 8) {
        const bpm = 72;
        const interval = 60 / bpm;
        const fallback = [];
        for (let t = 0; t < audioBuffer.duration; t += interval) {
          fallback.push(parseFloat(t.toFixed(3)));
        }
        return fallback;
      }

      return beats;
    }

    // =========================================================================
    // INTERNAL: Mode B (Procedural Acoustic Synthesizer) Implementation
    // =========================================================================

    _startSynthPlayback(offsetSec) {
      this.scheduledUntilTime = offsetSec;

      // Start precise Web Audio lookahead scheduling loop
      this.synthSchedulerTimer = setInterval(() => {
        if (!this.isPlayingState) return;

        const currentSongTime = this.getCurrentTime();

        // Check track completion
        if (currentSongTime >= this.durationSec) {
          this.pause();
          this.currentTimeSec = this.durationSec;
          this.emit('ended');
          return;
        }

        const scheduleHorizon = currentSongTime + this.lookaheadSec;
        if (scheduleHorizon > this.scheduledUntilTime) {
          this._scheduleMusicalEvents(this.scheduledUntilTime, scheduleHorizon, currentSongTime);
          this.scheduledUntilTime = scheduleHorizon;
        }
      }, this.schedulerIntervalMs);

      // Trigger immediate first scheduling burst
      this._scheduleMusicalEvents(offsetSec, offsetSec + this.lookaheadSec, offsetSec);
      this.scheduledUntilTime = offsetSec + this.lookaheadSec;
    }

    _scheduleMusicalEvents(fromSec, toSec, currentSongTime) {
      if (!this.audioCtx) return;

      const beatSec = 60 / this.bpm; // 0.8333s at 72bpm
      const barSec = beatSec * 4;   // 3.3333s per 4/4 bar
      const totalBars = 19;         // ~63.3s total

      // Determine bar range in window
      const startBar = Math.max(0, Math.floor(fromSec / barSec));
      const endBar = Math.min(totalBars - 1, Math.floor(toSec / barSec));

      for (let bar = startBar; bar <= endBar; bar++) {
        const barStart = bar * barSec;
        this._renderBarEvents(bar, barStart, fromSec, toSec, currentSongTime, beatSec);
      }
    }

    _renderBarEvents(bar, barStart, fromSec, toSec, currentSongTime, beatSec) {
      const halfBeat = beatSec * 0.5; // 8th note arpeggios

      // Musical Composition Architecture:
      // Bars 0..4: Verse 1 (Intimate Fingerpicked Guitar + Delicate Bass)
      // Bars 5..10: Chorus (Warm Rhodes Chords + Piano Lead + Acoustic Rhythm + Bass)
      // Bars 11..15: Bridge Climax (Lush Soaring String Pad + Bass Bloom + Resonant Filter Swell)
      // Bars 16..18: Outro (Delicate Music Box Whispers + Acoustic Resolution)

      if (bar >= 0 && bar <= 4) {
        // --- VERSE 1: Fingerpicked Acoustic Guitar Arpeggios ---
        const chords = [
          { bass: 43, arp: [55, 62, 67, 71, 67, 62, 71, 62] }, // G major (G2, G3-D4-G4-B4)
          { bass: 42, arp: [54, 62, 66, 69, 66, 62, 69, 62] }, // D/F# (F#2, F#3-D4-F#4-A4)
          { bass: 40, arp: [52, 59, 64, 67, 64, 59, 67, 59] }, // Em7 (E2, E3-B3-E4-G4)
          { bass: 48, arp: [55, 60, 64, 71, 64, 60, 71, 60] }, // Cmaj7 (C3, G3-C4-E4-B4)
          { bass: 38, arp: [50, 57, 62, 67, 66, 62, 67, 62] }  // Dsus4 -> D
        ];
        const c = chords[bar % chords.length];

        // Bass root on Beat 1
        this._maybeScheduleNote(barStart, fromSec, toSec, currentSongTime, () => {
          this._playBassNote(c.bass, barStart - currentSongTime, beatSec * 1.8, 0.55);
        });

        // 8th-note fingerpicked acoustic plucks
        c.arp.forEach((midi, idx) => {
          const noteTime = barStart + idx * halfBeat;
          this._maybeScheduleNote(noteTime, fromSec, toSec, currentSongTime, () => {
            const vel = idx % 2 === 0 ? 0.72 : 0.58;
            this._playAcousticPluck(midi, noteTime - currentSongTime, halfBeat * 1.6, vel);
          });
        });

      } else if (bar >= 5 && bar <= 10) {
        // --- CHORUS: Warm Rhodes + Piano Lead + Acoustic & Bass ---
        const chorusChords = [
          { bass: 43, rhodes: [55, 59, 62, 67], lead: 71 }, // G (B4)
          { bass: 42, rhodes: [54, 57, 62, 66], lead: 69 }, // D/F# (A4)
          { bass: 40, rhodes: [52, 55, 59, 62], lead: 67 }, // Em7 (G4)
          { bass: 36, rhodes: [48, 55, 59, 64], lead: 64 }, // Cmaj7 (E4)
          { bass: 47, rhodes: [54, 59, 62, 66], lead: 67 }, // G/B (G4)
          { bass: 38, rhodes: [50, 57, 62, 67], lead: 69 }  // Dsus4 -> D (A4)
        ];
        const c = chorusChords[(bar - 5) % chorusChords.length];

        // Sustained Rhodes chords on beats 1 and 3
        this._maybeScheduleNote(barStart, fromSec, toSec, currentSongTime, () => {
          this._playRhodesChord(c.rhodes, barStart - currentSongTime, beatSec * 2.2, 0.65);
          this._playBassNote(c.bass, barStart - currentSongTime, beatSec * 2.0, 0.75);
        });
        this._maybeScheduleNote(barStart + beatSec * 2, fromSec, toSec, currentSongTime, () => {
          this._playRhodesChord(c.rhodes, (barStart + beatSec * 2) - currentSongTime, beatSec * 1.8, 0.55);
        });

        // Poignant piano melody lead note
        this._maybeScheduleNote(barStart + beatSec * 0.5, fromSec, toSec, currentSongTime, () => {
          this._playRhodesChord([c.lead], (barStart + beatSec * 0.5) - currentSongTime, beatSec * 2.5, 0.82);
        });

        // Acoustic strum accents
        for (let s = 0; s < 4; s++) {
          const strumTime = barStart + s * beatSec;
          this._maybeScheduleNote(strumTime, fromSec, toSec, currentSongTime, () => {
            this._playAcousticPluck(c.rhodes[1] || 60, strumTime - currentSongTime, beatSec * 0.7, 0.45);
          });
        }

      } else if (bar >= 11 && bar <= 15) {
        // --- BRIDGE CLIMAX: Lush Soaring String Pad + Bass Bloom ---
        const bridgeChords = [
          { bass: 36, strings: [48, 55, 60, 64, 71] }, // Cmaj7 (Blooming strings)
          { bass: 38, strings: [50, 57, 62, 66, 69] }, // D7
          { bass: 40, strings: [52, 59, 64, 67, 74] }, // Em9 (Soaring peak)
          { bass: 36, strings: [48, 55, 60, 64, 71] }, // Cmaj7
          { bass: 38, strings: [50, 57, 62, 67, 74] }  // Dsus4 climax
        ];
        const c = bridgeChords[(bar - 11) % bridgeChords.length];

        // Rich detuned string pad chord (duration: full bar)
        this._maybeScheduleNote(barStart, fromSec, toSec, currentSongTime, () => {
          this._playStringSection(c.strings, barStart - currentSongTime, barSec * 1.05, 0.78);
          this._playBassNote(c.bass, barStart - currentSongTime, barSec * 0.95, 0.88);
        });

        // Supporting acoustic sparkle
        for (let s = 0; s < 4; s++) {
          const noteTime = barStart + s * beatSec + halfBeat * 0.5;
          this._maybeScheduleNote(noteTime, fromSec, toSec, currentSongTime, () => {
            this._playAcousticPluck(c.strings[3] || 67, noteTime - currentSongTime, halfBeat * 1.2, 0.5);
          });
        }

      } else if (bar >= 16 && bar <= 18) {
        // --- OUTRO: Delicate Music Box Whispers + Acoustic Resolution ---
        const outroChords = [
          { bass: 43, chimes: [79, 83, 86, 91] }, // G (G5, B5, D6, G6)
          { bass: 36, chimes: [76, 79, 83, 88] }, // Cmaj7 (E5, G5, B5, E6)
          { bass: 43, chimes: [79, 86, 91] }      // Final delicate G chord
        ];
        const c = outroChords[(bar - 16) % outroChords.length];

        // Music Box crystal chimes
        c.chimes.forEach((midi, idx) => {
          const chimeTime = barStart + idx * (beatSec * 0.75);
          this._maybeScheduleNote(chimeTime, fromSec, toSec, currentSongTime, () => {
            this._playMusicBoxChime(midi, chimeTime - currentSongTime, 1.4, 0.65);
          });
        });

        // Gentle sub bass foundation
        this._maybeScheduleNote(barStart, fromSec, toSec, currentSongTime, () => {
          this._playBassNote(c.bass, barStart - currentSongTime, barSec * 0.8, 0.45);
        });
      }
    }

    _maybeScheduleNote(noteSongTime, fromSec, toSec, currentSongTime, playFn) {
      if (noteSongTime >= fromSec && noteSongTime < toSec) {
        try {
          playFn();
        } catch (e) {
          console.warn('[AudioEngine] Synth voice scheduling error:', e);
        }
      }
    }

    // =========================================================================
    // VOICE GENERATORS: Web Audio Synthesis Models
    // =========================================================================

    _midiToFreq(midi) {
      return 440 * Math.pow(2, (midi - 69) / 12);
    }

    /**
     * Acoustic Guitar Pluck: Warm Triangle + subtle metallic shimmer via dynamic lowpass
     */
    _playAcousticPluck(midi, delayFromNow, duration, velocity = 0.7) {
      if (!this.audioCtx || !this.masterGain) return;
      const startTime = this.audioCtx.currentTime + Math.max(0, delayFromNow);
      const freq = this._midiToFreq(midi);

      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const filter = this.audioCtx.createBiquadFilter();
      const gain = this.audioCtx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, startTime);

      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(freq, startTime);

      // Lowpass pluck filter decay
      filter.type = 'lowpass';
      filter.Q.setValueAtTime(1.8, startTime);
      filter.frequency.setValueAtTime(Math.min(3800, freq * 5.5), startTime);
      filter.frequency.exponentialRampToValueAtTime(Math.max(380, freq * 1.2), startTime + Math.min(0.28, duration));

      // Fast attack & steel-string natural decay
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.32 * velocity, startTime + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.08 * velocity, startTime + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc1.start(startTime);
      osc2.start(startTime);
      osc1.stop(startTime + duration + 0.05);
      osc2.stop(startTime + duration + 0.05);

      this._registerVoice([osc1, osc2], [filter, gain], startTime + duration + 0.05);
    }

    /**
     * Warm Rhodes Piano: Dual sine harmonic structure with soft chime
     */
    _playRhodesChord(midiArray, delayFromNow, duration, velocity = 0.7) {
      if (!this.audioCtx || !this.masterGain || !midiArray.length) return;
      const startTime = this.audioCtx.currentTime + Math.max(0, delayFromNow);

      midiArray.forEach((midi) => {
        const freq = this._midiToFreq(midi);
        const oscFundamental = this.audioCtx.createOscillator();
        const oscHarmonic = this.audioCtx.createOscillator();
        const filter = this.audioCtx.createBiquadFilter();
        const gain = this.audioCtx.createGain();

        oscFundamental.type = 'sine';
        oscFundamental.frequency.setValueAtTime(freq, startTime);

        oscHarmonic.type = 'sine';
        oscHarmonic.frequency.setValueAtTime(freq * 2.0, startTime); // Octave overtone

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1800, startTime);

        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.linearRampToValueAtTime(0.18 * velocity, startTime + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.07 * velocity, startTime + 0.7);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        oscFundamental.connect(filter);
        oscHarmonic.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        oscFundamental.start(startTime);
        oscHarmonic.start(startTime);
        oscFundamental.stop(startTime + duration + 0.05);
        oscHarmonic.stop(startTime + duration + 0.05);

        this._registerVoice([oscFundamental, oscHarmonic], [filter, gain], startTime + duration + 0.05);
      });
    }

    /**
     * Lush Soaring String Pad: Detuned saw/triangles with resonant filter swell
     */
    _playStringSection(midiArray, delayFromNow, duration, velocity = 0.7) {
      if (!this.audioCtx || !this.masterGain || !midiArray.length) return;
      const startTime = this.audioCtx.currentTime + Math.max(0, delayFromNow);

      midiArray.forEach((midi) => {
        const freq = this._midiToFreq(midi);
        const oscA = this.audioCtx.createOscillator();
        const oscB = this.audioCtx.createOscillator();
        const filter = this.audioCtx.createBiquadFilter();
        const gain = this.audioCtx.createGain();

        oscA.type = 'sawtooth';
        oscA.frequency.setValueAtTime(freq, startTime);
        oscA.detune.setValueAtTime(-7, startTime); // Detune -7 cents

        oscB.type = 'triangle';
        oscB.frequency.setValueAtTime(freq, startTime);
        oscB.detune.setValueAtTime(7, startTime); // Detune +7 cents

        // Filter swell: rises to 2800Hz then settles
        filter.type = 'lowpass';
        filter.Q.setValueAtTime(2.2, startTime);
        filter.frequency.setValueAtTime(650, startTime);
        filter.frequency.exponentialRampToValueAtTime(2600, startTime + duration * 0.45);
        filter.frequency.exponentialRampToValueAtTime(1100, startTime + duration);

        // Smooth cinematic pad envelope
        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.linearRampToValueAtTime(0.14 * velocity, startTime + 0.45);
        gain.gain.setValueAtTime(0.14 * velocity, startTime + duration * 0.65);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        oscA.connect(filter);
        oscB.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        oscA.start(startTime);
        oscB.start(startTime);
        oscA.stop(startTime + duration + 0.1);
        oscB.stop(startTime + duration + 0.1);

        this._registerVoice([oscA, oscB], [filter, gain], startTime + duration + 0.1);
      });
    }

    /**
     * Grounding Bass Bloom: Deep sub sine + warm triangle overtone
     */
    _playBassNote(midi, delayFromNow, duration, velocity = 0.8) {
      if (!this.audioCtx || !this.masterGain) return;
      const startTime = this.audioCtx.currentTime + Math.max(0, delayFromNow);
      const freq = this._midiToFreq(midi);

      const oscSub = this.audioCtx.createOscillator();
      const oscWarmth = this.audioCtx.createOscillator();
      const filter = this.audioCtx.createBiquadFilter();
      const gain = this.audioCtx.createGain();

      oscSub.type = 'sine';
      oscSub.frequency.setValueAtTime(freq, startTime);

      oscWarmth.type = 'triangle';
      oscWarmth.frequency.setValueAtTime(freq * 2.0, startTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, startTime);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.38 * velocity, startTime + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.24 * velocity, startTime + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      oscSub.connect(filter);
      oscWarmth.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      oscSub.start(startTime);
      oscWarmth.start(startTime);
      oscSub.stop(startTime + duration + 0.05);
      oscWarmth.stop(startTime + duration + 0.05);

      this._registerVoice([oscSub, oscWarmth], [filter, gain], startTime + duration + 0.05);
    }

    /**
     * Music Box / Celesta Whisper: Pure sine with shimmering bell overtone
     */
    _playMusicBoxChime(midi, delayFromNow, duration = 1.0, velocity = 0.6) {
      if (!this.audioCtx || !this.masterGain) return;
      const startTime = this.audioCtx.currentTime + Math.max(0, delayFromNow);
      const freq = this._midiToFreq(midi);

      const osc = this.audioCtx.createOscillator();
      const bellHarmonic = this.audioCtx.createOscillator();
      const filter = this.audioCtx.createBiquadFilter();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      bellHarmonic.type = 'sine';
      bellHarmonic.frequency.setValueAtTime(freq * 2.756, startTime); // Bell non-integer partial

      filter.type = 'highpass';
      filter.frequency.setValueAtTime(450, startTime);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.25 * velocity, startTime + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(filter);
      bellHarmonic.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(startTime);
      bellHarmonic.start(startTime);
      osc.stop(startTime + duration + 0.05);
      bellHarmonic.stop(startTime + duration + 0.05);

      this._registerVoice([osc, bellHarmonic], [filter, gain], startTime + duration + 0.05);
    }

    /**
     * Registers an active voice for safe cancellation on seek/pause
     */
    _registerVoice(oscillators, nodes, stopTime) {
      const voiceRecord = {
        stop: () => {
          try {
            oscillators.forEach(osc => {
              osc.stop();
              osc.disconnect();
            });
            nodes.forEach(node => {
              if (node.gain) {
                node.gain.cancelScheduledValues(0);
                node.gain.setValueAtTime(0.0001, this.audioCtx ? this.audioCtx.currentTime : 0);
              }
              node.disconnect();
            });
          } catch (e) {}
        }
      };

      this.activeSynthVoices.add(voiceRecord);

      // Auto-cleanup when voice duration ends
      const cleanupDelayMs = Math.max(50, (stopTime - (this.audioCtx ? this.audioCtx.currentTime : 0)) * 1000);
      setTimeout(() => {
        this.activeSynthVoices.delete(voiceRecord);
      }, cleanupDelayMs);
    }

    _stopAllSynthVoices() {
      this.activeSynthVoices.forEach(voice => {
        voice.stop();
      });
      this.activeSynthVoices.clear();
    }

    // =========================================================================
    // EVENT EMITTER
    // =========================================================================

    on(event, callback) {
      if (!this.listeners[event]) {
        this.listeners[event] = [];
      }
      this.listeners[event].push(callback);
      return this;
    }

    off(event, callback) {
      if (!this.listeners[event]) return this;
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
      return this;
    }

    emit(event, data) {
      if (!this.listeners[event]) return;
      this.listeners[event].forEach(cb => {
        try {
          cb(data);
        } catch (e) {
          console.error(`[AudioEngine] Listener error on '${event}':`, e);
        }
      });
    }
  }

  // Export singleton instance and class definition
  const instance = new AudioEngineService();
  window.DoradoStudio.AudioEngine = instance;
  window.DoradoStudio.AudioEngineClass = AudioEngineService;

})();
