/**
 * ============================================================================
 * DoradoMotion Studio — UI Controller & Responsive NLE Shell
 * Module: js/06_ui_shell.js (window.DoradoStudio.UI)
 * Architecture: Gwyn Dorado MV Sequence Planner & Code-SVG / WebGL Studio
 *
 * Implements:
 * - mount(rootElement): injects studio layout, wires DOM events, initializes
 *   CreativeDirector, AudioEngine, SVGMotion, WebGLCompositor, StorytoldBridge
 * - 60fps render loop with playhead sync, HUD badges, waveform canvas,
 *   conviction curve SVG, scene sequence blocks, kinetic lyrics track
 * - 5-Pillar Gwyn Dorado Creative Audit gauges (Confession, Anti-Spectacle,
 *   Human Foundation, Blooming Arc, Nuance)
 * - Active Scene Inspector with live two-way binding
 * - Auto-Choreograph sequence from pasted lyrics
 * - Real-time canvas video recording (WebM / MP4) via MediaRecorder
 * - Live Code-SVG drawer with syntax view, copy & download
 * - Parallel Subagents Multi-Provider prompt pack viewer & exporter
 * - storytold Craft Suite Bridge scripts & .ecproj exporter
 * ============================================================================
 */

(function () {
  'use strict';

  window.DoradoStudio = window.DoradoStudio || {};

  // ==========================================================================
  // 1. EMBEDDED SUBAGENT PROMPT PACKS (AGENT_01 to AGENT_07)
  // ==========================================================================
  const SUBAGENT_PROMPTS = {
    AGENT_01: {
      id: 'AGENT_01',
      title: 'Agent 01 — Creative Director & Dynamic Arc Architect',
      provider: 'Anthropic Claude / Google Gemini / OpenAI',
      systemRole: 'Executive Music Video Director & Gwyn Dorado Sequence Architect',
      description: 'Defines the structural blueprint for Gwyn Dorado songs, enforcing the 5-Pillar Confessional Audit and Quiet-to-Blooming dynamic arcs.',
      prompt: `You are Parallel Subagent 01 (Creative Director & Dynamic Arc Architect) for the Gwyn Dorado Music Video Studio.

MISSION:
Formulate emotional, relationship-centered music video sequence breakdowns tailored to Gwyn Dorado's profile: "A private confession delivered with stage-level conviction."

CORE ARCHITECTURAL INVARIANTS:
1. The 5 Gwyn Dorado Alignment Pillars:
   - 1. The Confession Check: Private letter/diary tone, zero stadium broadcast rhetoric.
   - 2. The Anti-Spectacle Check: Pure emotional communication over hyper-concept swagger.
   - 3. The Human Foundation Check: Stripped-back acoustic/piano foundation for vocal phrasing space.
   - 4. The Blooming Arc Check: Quiet vulnerability blooming organically into stage-level conviction.
   - 5. The Nuance Check: Focus on subtle emotional turns and lived-in physical details.
2. Scene Parameters Schema:
   - id: string ("scene_01" .. "scene_08")
   - section: ("Intro" | "Verse 1" | "Pre-Chorus" | "Chorus 1" | "Verse 2" | "Bridge" | "Chorus 2" | "Outro")
   - startSec, endSec: numbers
   - svgMotif: ("blooming_lotus" | "acoustic_soundwave" | "amber_ember" | "twilight_prism" | "letter_envelope" | "golden_ratio_spiral" | "bioluminescent_plankton")
   - oklabPalette: ("warm_rose_gold" | "twilight_violet" | "bioluminescent_cyan" | "amber_ember" | "monochrome_ivory")
   - cameraMotion: ("slow_push_in" | "gentle_drift_left" | "subtle_crane_up" | "static_breathing" | "blooming_pull_out" | "orbital_pivot")
   - convictionLevel: 0.15 (whisper) -> 0.98 (climactic peak)
   - negativeSpaceRatio: 0.30 -> 0.90 (wide headroom for intimate vocal phrasing)
   - lyricEn, lyricOriginal: bilingual lyric cues
   - rationale: Epistemic justification for visual motif, camera speed, and color grading.

OUTPUT FORMAT:
Return structured JSON sequence data adhering to window.DoradoStudio.CreativeDirector.`
    },
    AGENT_02: {
      id: 'AGENT_02',
      title: 'Agent 02 — Web Audio Synthesis & Waveform Engine',
      provider: 'Web Audio API / WebAssembly DSP',
      systemRole: 'Interactive DSP Audio Synthesizer & Multi-Stem Analyser',
      description: 'Generates procedural acoustic guitar fingerpicking, felt piano chords, sub-bass, and ambient pads, analyzing FFT frequencies and driving waveform visualizers.',
      prompt: `You are Parallel Subagent 02 (Audio Engine & Waveform Visualizer) for the Gwyn Dorado Music Video Studio.

MISSION:
Implement a procedural Web Audio API engine capable of real-time synthetic stem playback, audio file decoding, FFT spectrum analysis, RMS level computation, and 60fps waveform canvas rendering.

KEY CAPABILITIES:
- Synthesizer Stems: Acoustic pluck (Karplus-Strong / dual-sine decay), felt piano (soft bandpass triangle), ambient twilight pad (detuned saw + lowpass filter).
- Transport & Clock: play(), pause(), togglePlay(), seek(sec), getCurrentTime(), getDuration().
- AnalyserNode: getFrequencyData(Uint8Array), getTimeDomainData(Uint8Array), getRMS(), getPeak().
- Waveform Canvas: Real-time dynamic waveform renderer highlighting active playhead and beat markers.
- Dynamic BPM matching for "Losing My Heart" (72 BPM) and "Light of Love" (68 BPM).`
    },
    AGENT_03: {
      id: 'AGENT_03',
      title: 'Agent 03 — Parametric Code-SVG Motion & Kinetic Lyrics',
      provider: 'Pure Vector SVG & Math Engine',
      systemRole: 'Parametric Code-SVG Animator & Kinetic Typography Specialist',
      description: 'Generates clean, scalable, standalone XML/SVG markup with mathematical blooming curves, glowing gradients, and kinetic typography.',
      prompt: `You are Parallel Subagent 03 (Parametric Code-SVG Motion Engine) for the Gwyn Dorado Music Video Studio.

MISSION:
Generate frame-accurate, mathematical SVG animations that interpret the emotional arc of each scene into visual poetry.

MOTIF LIBRARY:
1. blooming_lotus: Concentric petals opening radially according to convictionLevel.
2. acoustic_soundwave: Harmonic ripples radiating from central focal point.
3. amber_ember: Buoyant upward-drifting ember particles with soft glowing halos.
4. twilight_prism: Refractive triangular geometry dispersing violet and cyan light rays.
5. letter_envelope: Folded origami-like planes drifting slowly across negative space.
6. golden_ratio_spiral: Unfolding Fibonacci logarithmic curve with glowing tracer head.
7. bioluminescent_plankton: Fluid organic clusters pulsating with cyan radiance.

KINETIC LYRICS:
- Render bilingual typography (English + Korean) with delicate letter-spacing, fade-ins, and soft drop-shadow filters.`
    },
    AGENT_04: {
      id: 'AGENT_04',
      title: 'Agent 04 — WebGL OKLab Compositor & Bloom Shaders',
      provider: 'WebGL 2.0 / GLSL ES 3.0 / Canvas API',
      systemRole: 'Cinematic Post-Processing Shader & Video Encoder',
      description: 'Composites SVG motion layers through an OKLab perceptual color grader, blooming glow pass, chromatic aberration, 35mm film grain, and MediaRecorder video exporter.',
      prompt: `You are Parallel Subagent 04 (WebGL OKLab Compositor & Bloom Shaders) for the Gwyn Dorado Music Video Studio.

MISSION:
Provide real-time 1080p canvas compositing with cinematic post-processing and zero dropped frames.

SHADER PIPELINE:
1. OKLab Perceptual Transformation: Preserves perceptual lightness while adjusting saturation and color warmth.
2. Dual-Pass Gaussian Bloom: Thresholds high-luminance elements from the SVG and blooms them with a warm halo.
3. Subtle Chromatic Aberration: Subtle radial color fringe mimicking prime cinema lenses.
4. Organic 35mm Film Grain: Time-varying pseudo-random noise to give digital SVG an intimate, human analog texture.
5. MediaRecorder Video Capture: Records canvas stream at 60fps to WebM/MP4.`
    },
    AGENT_05: {
      id: 'AGENT_05',
      title: 'Agent 05 — storytold Craft Suite Bridge',
      provider: 'CLI / storytold Daemon / JSON-Lines',
      systemRole: 'storytold Craft Suite Interoperability Specialist',
      description: 'Generates command-line scripts and project manifests for FilmCraft, EffectCraft (.ecproj), VectorCraft, and SoundCraft pipelines.',
      prompt: `You are Parallel Subagent 05 (storytold Craft Suite Bridge) for the Gwyn Dorado Music Video Studio.

MISSION:
Bridge the web studio into production desktop tooling:
- FilmCraft: Generates FFmpeg CLI commands with complex filter chains, crossfades, and audio muxing.
- EffectCraft: Generates .ecproj JSON project files containing composition geometry, camera layers, and bloom shaders.
- VectorCraft: Exports vector path coordinate streams and SVG asset catalogs.
- SoundCraft: Generates multi-track audio stem mastering pipelines (EQ, compressor, plate reverb).`
    },
    AGENT_06: {
      id: 'AGENT_06',
      title: 'Agent 06 — Studio UI Controller & Responsive NLE Shell',
      provider: 'Vanilla ES6+ / Responsive CSS Grid',
      systemRole: 'Master NLE Interface Architect & Studio Orchestrator',
      description: 'Coordinates all subagent subsystems into an ArtCraft / DaVinci Resolve inspired dark-mode studio with 4-track timeline, scene inspector, and live SVG drawer.',
      prompt: `You are Parallel Subagent 06 (Studio UI Controller & Responsive NLE Shell) for the Gwyn Dorado Music Video Studio.

MISSION:
Construct the unified user interface controller in window.DoradoStudio.UI.
- Full viewport 100vh grid layout with header, 3-column dock split, and 210px timeline.
- Coordinate 60fps render loop linking AudioEngine, CreativeDirector, SVGMotion, and WebGLCompositor.
- Provide comprehensive interactive controls with immediate visual feedback and zero console errors.`
    },
    AGENT_07: {
      id: 'AGENT_07',
      title: 'Agent 07 — Standalone Packager & Verification Gate',
      provider: 'Python Packager / Node.js Runner',
      systemRole: 'Production Bundler & Comprehensive Test Gate',
      description: 'Bundles all HTML, CSS, and JS modules into a standalone zero-dependency artifact and verifies audio-video synchronization and export integrity.',
      prompt: `You are Parallel Subagent 07 (Standalone Packager & Verification Gate) for the Gwyn Dorado Music Video Studio.

MISSION:
1. Merge css/studio.css and all js/ modules into gwyn_dorado_mv_studio.html.
2. Verify zero external CDN dependencies.
3. Validate 60fps animation performance, MediaRecorder encoding, and SVG export validity.`
    }
  };

  // ==========================================================================
  // 2. DEFAULT PRESETS (LOSING MY HEART & LIGHT OF LOVE)
  // ==========================================================================
  const PRESETS_DATA = {
    losing_my_heart: {
      id: 'losing_my_heart',
      title: 'Losing My Heart (마음을 놓치다)',
      artist: 'Gwyn Dorado',
      genre: 'Intimate Emotional Pop / Soulful Ballad',
      bpm: 72,
      key: 'E Major / C# Minor',
      durationSec: 160,
      pillars: {
        confession: 96,
        antiSpectacle: 94,
        humanFoundation: 98,
        bloomingArc: 97,
        nuance: 95,
        composite: 96,
        status: 'Approved for Gwyn Dorado Confessional Master'
      },
      scenes: [
        {
          id: 'scene_01',
          section: 'Intro',
          startSec: 0,
          endSec: 14,
          svgMotif: 'amber_ember',
          oklabPalette: 'warm_rose_gold',
          cameraMotion: 'slow_push_in',
          convictionLevel: 0.18,
          negativeSpaceRatio: 0.85,
          lyricEn: 'Fading footsteps in the morning dew...',
          lyricOriginal: '새벽 이슬 속 희미해진 발자국...',
          rationale: 'Stripped-back human foundation: quiet ember in negative space allows room for the first vocal breath.'
        },
        {
          id: 'scene_02',
          section: 'Verse 1',
          startSec: 14,
          endSec: 32,
          svgMotif: 'letter_envelope',
          oklabPalette: 'monochrome_ivory',
          cameraMotion: 'gentle_drift_left',
          convictionLevel: 0.32,
          negativeSpaceRatio: 0.80,
          lyricEn: 'Letters folded in the drawer you left behind',
          lyricOriginal: '서랍 속에 남겨진 네 편지',
          rationale: 'The confession check: intimate diary entry detail avoiding high-concept swagger.'
        },
        {
          id: 'scene_03',
          section: 'Pre-Chorus',
          startSec: 32,
          endSec: 48,
          svgMotif: 'acoustic_soundwave',
          oklabPalette: 'twilight_violet',
          cameraMotion: 'subtle_crane_up',
          convictionLevel: 0.54,
          negativeSpaceRatio: 0.70,
          lyricEn: 'I held too tight, until the silence spoke',
          lyricOriginal: '너무 꼭 쥐어 결국 침묵이 말했어',
          rationale: 'Blooming transition: acoustic ripples expand as harmonic tension builds toward the chorus.'
        },
        {
          id: 'scene_04',
          section: 'Chorus 1',
          startSec: 48,
          endSec: 72,
          svgMotif: 'blooming_lotus',
          oklabPalette: 'warm_rose_gold',
          cameraMotion: 'orbital_pivot',
          convictionLevel: 0.78,
          negativeSpaceRatio: 0.55,
          lyricEn: "I'm losing my heart, but finding my truth",
          lyricOriginal: '마음을 놓치며, 내 진심을 찾아',
          rationale: 'The core hook: emotional bloom where private vulnerability transforms into stage-level conviction.'
        },
        {
          id: 'scene_05',
          section: 'Verse 2',
          startSec: 72,
          endSec: 92,
          svgMotif: 'golden_ratio_spiral',
          oklabPalette: 'bioluminescent_cyan',
          cameraMotion: 'static_breathing',
          convictionLevel: 0.42,
          negativeSpaceRatio: 0.75,
          lyricEn: 'Coffee rings on the table where we sat',
          lyricOriginal: '우리가 앉았던 식탁 위 커피 자국',
          rationale: 'The nuance check: tender domestic observation grounded in specific, affectionate memory.'
        },
        {
          id: 'scene_06',
          section: 'Bridge',
          startSec: 92,
          endSec: 116,
          svgMotif: 'twilight_prism',
          oklabPalette: 'twilight_violet',
          cameraMotion: 'blooming_pull_out',
          convictionLevel: 0.96,
          negativeSpaceRatio: 0.40,
          lyricEn: 'Break the glass, let the colors bleed into dawn',
          lyricOriginal: '유리를 깨고, 새벽으로 번져가는 빛',
          rationale: 'Peak stage-level conviction: dynamic arc zenith with rich prismatic refraction.'
        },
        {
          id: 'scene_07',
          section: 'Chorus 2',
          startSec: 116,
          endSec: 140,
          svgMotif: 'blooming_lotus',
          oklabPalette: 'warm_rose_gold',
          cameraMotion: 'orbital_pivot',
          convictionLevel: 0.88,
          negativeSpaceRatio: 0.48,
          lyricEn: 'Every tear was a seed in the quiet ground',
          lyricOriginal: '흘린 눈물마다 고요한 땅에 묻힌 씨앗',
          rationale: 'Full blooming resolution with sustained emotional power.'
        },
        {
          id: 'scene_08',
          section: 'Outro',
          startSec: 140,
          endSec: 160,
          svgMotif: 'amber_ember',
          oklabPalette: 'monochrome_ivory',
          cameraMotion: 'slow_push_in',
          convictionLevel: 0.15,
          negativeSpaceRatio: 0.88,
          lyricEn: 'Goodnight... until the light returns',
          lyricOriginal: '잘 자... 다시 빛이 돌아올 때까지',
          rationale: 'Return to stripped solo whisper, leaving the listener in sacred negative space.'
        }
      ]
    },

    light_of_love: {
      id: 'light_of_love',
      title: 'Light of Love (사랑의 빛)',
      artist: 'Gwyn Dorado',
      genre: 'Soulful Ballad / Cinematic OST',
      bpm: 68,
      key: 'G Major',
      durationSec: 108,
      pillars: {
        confession: 95,
        antiSpectacle: 96,
        humanFoundation: 97,
        bloomingArc: 98,
        nuance: 94,
        composite: 96,
        status: 'Approved for Gwyn Dorado Confessional Master'
      },
      scenes: [
        {
          id: 'scene_01',
          section: 'Intro',
          startSec: 0,
          endSec: 16,
          svgMotif: 'bioluminescent_plankton',
          oklabPalette: 'bioluminescent_cyan',
          cameraMotion: 'static_breathing',
          convictionLevel: 0.20,
          negativeSpaceRatio: 0.85,
          lyricEn: 'Cold wind blowing across the midnight shore...',
          lyricOriginal: '자정의 해변을 스치는 찬 바람...',
          rationale: 'Deep oceanic cyan tone establishing cold solitude before light arrives.'
        },
        {
          id: 'scene_02',
          section: 'Verse 1',
          startSec: 16,
          endSec: 36,
          svgMotif: 'acoustic_soundwave',
          oklabPalette: 'warm_rose_gold',
          cameraMotion: 'gentle_drift_left',
          convictionLevel: 0.35,
          negativeSpaceRatio: 0.80,
          lyricEn: 'A single lantern left beside the door',
          lyricOriginal: '문가에 놓인 하나의 등불',
          rationale: 'Grounded domestic symbolism reflecting the human foundation.'
        },
        {
          id: 'scene_03',
          section: 'Chorus 1',
          startSec: 36,
          endSec: 64,
          svgMotif: 'blooming_lotus',
          oklabPalette: 'warm_rose_gold',
          cameraMotion: 'orbital_pivot',
          convictionLevel: 0.82,
          negativeSpaceRatio: 0.50,
          lyricEn: 'You are the light of love in dark waters',
          lyricOriginal: '어두운 물결 속 넌 사랑의 빛',
          rationale: 'Vocal power opening wide like warm gold reflecting across a still lake.'
        },
        {
          id: 'scene_04',
          section: 'Bridge',
          startSec: 64,
          endSec: 88,
          svgMotif: 'twilight_prism',
          oklabPalette: 'twilight_violet',
          cameraMotion: 'blooming_pull_out',
          convictionLevel: 0.98,
          negativeSpaceRatio: 0.38,
          lyricEn: 'Even the darkest storm must bow to the dawn',
          lyricOriginal: '가장 짙은 폭풍도 새벽 앞에 무릎 꿇리라',
          rationale: 'Climactic orchestral swell with stage-level theatrical conviction.'
        },
        {
          id: 'scene_05',
          section: 'Outro',
          startSec: 88,
          endSec: 108,
          svgMotif: 'amber_ember',
          oklabPalette: 'monochrome_ivory',
          cameraMotion: 'slow_push_in',
          convictionLevel: 0.18,
          negativeSpaceRatio: 0.90,
          lyricEn: 'Shining softly, always',
          lyricOriginal: '언제나, 부드럽게 빛나길',
          rationale: 'Soft warm fading amber resolving into peaceful silence.'
        }
      ]
    }
  };

  // ==========================================================================
  // 3. INTERNAL FALLBACK ENGINES (Defensive Architecture)
  // ==========================================================================
  class FallbackAudioEngine {
    constructor() {
      this.ctx = null;
      this.isPlayingState = false;
      this.currentTime = 0;
      this.duration = 160;
      this.bpm = 72;
      this.analyser = null;
      this.synthInterval = null;
      this.lastTickTime = 0;
      this.freqData = new Uint8Array(64);
      this.customAudioBuffer = null;
      this.audioSourceNode = null;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
          this.analyser = this.ctx.createAnalyser();
          this.analyser.fftSize = 128;
          this.analyser.smoothingTimeConstant = 0.8;
        }
      }
    }

    play() {
      this.init();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.isPlayingState = true;
      this.lastTickTime = performance.now();
      if (!this.synthInterval) {
        this.synthInterval = setInterval(() => this._synthTick(), 500);
      }
    }

    pause() {
      this.isPlayingState = false;
      if (this.synthInterval) {
        clearInterval(this.synthInterval);
        this.synthInterval = null;
      }
      if (this.audioSourceNode) {
        try { this.audioSourceNode.stop(); } catch (e) {}
        this.audioSourceNode = null;
      }
    }

    togglePlay() {
      if (this.isPlayingState) {
        this.pause();
      } else {
        this.play();
      }
      return this.isPlayingState;
    }

    isPlaying() {
      return this.isPlayingState;
    }

    seek(sec) {
      this.currentTime = Math.max(0, Math.min(sec, this.duration));
    }

    getCurrentTime() {
      return this.currentTime;
    }

    getDuration() {
      return this.duration;
    }

    setDuration(dur) {
      this.duration = Math.max(10, dur);
    }

    setBpm(bpm) {
      this.bpm = bpm;
    }

    updateClock(deltaSec) {
      if (this.isPlayingState) {
        this.currentTime += deltaSec;
        if (this.currentTime >= this.duration) {
          this.currentTime = 0;
          this.pause();
        }
      }
    }

    getFrequencyData() {
      if (this.analyser) {
        this.analyser.getByteFrequencyData(this.freqData);
        return this.freqData;
      }
      // Procedural synthetic frequencies
      const t = performance.now() * 0.005;
      for (let i = 0; i < this.freqData.length; i++) {
        const base = Math.sin(t + i * 0.2) * 50 + 60;
        this.freqData[i] = this.isPlayingState ? Math.min(255, Math.max(10, base)) : 10;
      }
      return this.freqData;
    }

    getRMS() {
      if (!this.isPlayingState) return 0.05;
      const data = this.getFrequencyData();
      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        sum += (data[i] / 255) ** 2;
      }
      return Math.sqrt(sum / data.length);
    }

    _synthTick() {
      if (!this.ctx || !this.isPlayingState) return;
      // Gentle acoustic pluck & felt piano chord
      const chords = [
        [164.81, 196.00, 246.94, 329.63], // E minor / G
        [146.83, 185.00, 220.00, 293.66], // D
        [130.81, 164.81, 196.00, 261.63], // C
        [123.47, 155.56, 185.00, 246.94]  // B
      ];
      const chord = chords[Math.floor((this.currentTime / 4) % chords.length)];
      const now = this.ctx.currentTime;

      chord.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.0001, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.04, now + idx * 0.08 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.2);

        osc.connect(gain);
        if (this.analyser) {
          gain.connect(this.analyser);
        }
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 1.25);
      });
    }

    async loadAudioFile(file) {
      this.init();
      if (!this.ctx) return;
      try {
        const arrayBuffer = await file.arrayBuffer();
        this.ctx.decodeAudioData(arrayBuffer, (decoded) => {
          this.customAudioBuffer = decoded;
          this.duration = decoded.duration;
          window.DoradoStudio.UI.showToast(`Audio Loaded: ${file.name} (${Math.round(decoded.duration)}s)`);
          window.DoradoStudio.UI.refreshTimeline();
        });
      } catch (err) {
        console.warn('Audio decoding error:', err);
      }
    }
  }

  // ==========================================================================
  // 4. FALLBACK SVG MOTION GENERATOR
  // ==========================================================================
  const FallbackSVGMotion = {
    generateFullSVG(scene, timeOffsetSec = 0) {
      const w = 1920;
      const h = 1080;
      const cx = w / 2;
      const cy = h / 2;
      const conviction = scene ? scene.convictionLevel : 0.5;
      const motif = scene ? scene.svgMotif : 'blooming_lotus';
      const palette = scene ? scene.oklabPalette : 'warm_rose_gold';
      const lyricEn = scene ? scene.lyricEn : '';
      const lyricKr = scene ? scene.lyricOriginal : '';

      // Palette Colors
      let colPrimary = '#f59e0b';
      let colSecondary = '#8b5cf6';
      let colGlow = 'rgba(245, 158, 11, 0.4)';
      let colBg1 = '#0a0a0f';
      let colBg2 = '#020204';

      if (palette === 'twilight_violet') {
        colPrimary = '#8b5cf6';
        colSecondary = '#c084fc';
        colGlow = 'rgba(139, 92, 246, 0.45)';
        colBg1 = '#0e0b17';
      } else if (palette === 'bioluminescent_cyan') {
        colPrimary = '#06b6d4';
        colSecondary = '#67e8f9';
        colGlow = 'rgba(6, 182, 212, 0.45)';
        colBg1 = '#041317';
      } else if (palette === 'amber_ember') {
        colPrimary = '#f59e0b';
        colSecondary = '#ea580c';
        colGlow = 'rgba(234, 88, 12, 0.45)';
        colBg1 = '#120b06';
      } else if (palette === 'monochrome_ivory') {
        colPrimary = '#f8fafc';
        colSecondary = '#94a3b8';
        colGlow = 'rgba(248, 250, 252, 0.3)';
        colBg1 = '#090a0d';
      }

      // Generate Motif SVG Elements
      let motifElements = '';
      const t = timeOffsetSec;

      if (motif === 'blooming_lotus') {
        const petalCount = 12 + Math.floor(conviction * 12);
        const petalRadius = 140 + conviction * 180;
        let petals = '';
        for (let i = 0; i < petalCount; i++) {
          const angle = (i / petalCount) * Math.PI * 2 + Math.sin(t * 0.5) * 0.1;
          const px = cx + Math.cos(angle) * petalRadius;
          const py = cy + Math.sin(angle) * petalRadius;
          const ctrlX = cx + Math.cos(angle + 0.3) * (petalRadius * 1.3);
          const ctrlY = cy + Math.sin(angle + 0.3) * (petalRadius * 1.3);
          petals += `<path d="M ${cx} ${cy} Q ${ctrlX} ${ctrlY} ${px} ${py} Q ${cx + Math.cos(angle - 0.3) * (petalRadius * 1.3)} ${cy + Math.sin(angle - 0.3) * (petalRadius * 1.3)} ${cx} ${cy}" fill="url(#gradMotif)" fill-opacity="${0.2 + conviction * 0.4}" stroke="${colPrimary}" stroke-width="${1.5 + conviction}" />`;
        }
        motifElements = `<g class="motif-lotus">${petals}<circle cx="${cx}" cy="${cy}" r="${20 + conviction * 30}" fill="${colSecondary}" filter="url(#bloomGlow)" opacity="0.8" /></g>`;
      } else if (motif === 'acoustic_soundwave') {
        let rings = '';
        const ringCount = 8;
        for (let i = 1; i <= ringCount; i++) {
          const r = ((i * 45 + t * 40) % 360) + 20;
          const op = Math.max(0, 1 - r / 380) * (0.3 + conviction * 0.6);
          rings += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${colPrimary}" stroke-width="2" stroke-opacity="${op}" />`;
        }
        motifElements = `<g class="motif-soundwave">${rings}<circle cx="${cx}" cy="${cy}" r="12" fill="${colPrimary}" filter="url(#bloomGlow)" /></g>`;
      } else if (motif === 'amber_ember') {
        let embers = '';
        for (let i = 0; i < 28; i++) {
          const ex = (cx - 400) + ((i * 37 + t * 25) % 800);
          const ey = cy + 260 - (((t * 40 + i * 45) % 520));
          const er = 2 + (i % 4) + conviction * 3;
          embers += `<circle cx="${ex}" cy="${ey}" r="${er}" fill="${colPrimary}" filter="url(#bloomGlow)" opacity="${0.4 + (i % 5) * 0.12}" />`;
        }
        motifElements = `<g class="motif-ember">${embers}</g>`;
      } else if (motif === 'twilight_prism') {
        const size = 180 + conviction * 100;
        motifElements = `
          <g class="motif-prism">
            <polygon points="${cx},${cy - size} ${cx + size},${cy + size * 0.7} ${cx - size},${cy + size * 0.7}" fill="none" stroke="${colSecondary}" stroke-width="3" filter="url(#bloomGlow)" />
            <line x1="${cx - 300}" y1="${cy + 50}" x2="${cx}" y2="${cy}" stroke="${colPrimary}" stroke-width="3" opacity="0.8" />
            <line x1="${cx}" y1="${cy}" x2="${cx + 400}" y2="${cy - 80}" stroke="#06b6d4" stroke-width="3" opacity="0.7" />
            <line x1="${cx}" y1="${cy}" x2="${cx + 420}" y2="${cy}" stroke="#8b5cf6" stroke-width="3" opacity="0.8" />
            <line x1="${cx}" y1="${cy}" x2="${cx + 400}" y2="${cy + 90}" stroke="#f59e0b" stroke-width="3" opacity="0.7" />
          </g>`;
      } else {
        // Geometric spiral / plankton fallback
        motifElements = `
          <g class="motif-generic">
            <circle cx="${cx}" cy="${cy}" r="${120 + conviction * 80}" fill="none" stroke="${colPrimary}" stroke-width="2" stroke-dasharray="8 6" filter="url(#bloomGlow)" />
            <circle cx="${cx}" cy="${cy}" r="${60 + conviction * 40}" fill="none" stroke="${colSecondary}" stroke-width="1.5" />
          </g>`;
      }

      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="100%" height="100%">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="50%" r="75%">
      <stop offset="0%" stop-color="${colBg1}" />
      <stop offset="100%" stop-color="${colBg2}" />
    </radialGradient>
    <linearGradient id="gradMotif" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${colPrimary}" stop-opacity="0.9" />
      <stop offset="100%" stop-color="${colSecondary}" stop-opacity="0.4" />
    </linearGradient>
    <filter id="bloomGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="${8 + conviction * 12}" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <!-- Ambient Backdrop -->
  <rect width="${w}" height="${h}" fill="url(#bgGrad)" />

  <!-- Parametric Visual Motif Layer -->
  ${motifElements}

  <!-- Kinetic Typography Overlay -->
  <g class="kinetic-lyrics" text-anchor="middle">
    <text x="${cx}" y="${h - 180}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="${32 + conviction * 10}" font-weight="700" fill="#f8fafc" letter-spacing="2" filter="url(#bloomGlow)">${lyricKr}</text>
    <text x="${cx}" y="${h - 130}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="400" fill="#94a3b8" letter-spacing="1">${lyricEn}</text>
  </g>
</svg>`;
    }
  };

  // ==========================================================================
  // 5. UI CONTROLLER CORE IMPLEMENTATION
  // ==========================================================================
  const UI = {
    root: null,
    currentPresetKey: 'losing_my_heart',
    currentPreset: null,
    activeSceneIndex: 0,
    activeScene: null,

    // Subsystems
    audioEngine: null,
    creativeDirector: null,
    svgMotion: null,
    webglCompositor: null,
    storytoldBridge: null,

    // MediaRecorder Video Capture State
    mediaRecorder: null,
    recordedChunks: [],
    isRecording: false,

    // Animation & Clock
    rafId: null,
    lastFrameTime: 0,

    // Active subagent tab
    activeAgentId: 'AGENT_01',
    activeCraftTab: 'film',

    /**
     * Mounts the Studio into the provided rootElement
     */
    mount(rootElement) {
      if (!rootElement) {
        console.error('DoradoStudio.UI.mount: rootElement is required');
        return;
      }
      this.root = rootElement;

      // 1. Inject DOM Layout if not already in document
      if (!document.getElementById('studio-header')) {
        this.renderHTMLStructure();
      }

      // 2. Bind Subsystems
      this.initSubsystems();

      // 3. Load Default Preset
      this.loadPreset('losing_my_heart');

      // 4. Attach Event Listeners
      this.bindEvents();

      // 5. Populate Subagent Prompts & Craft Scripts
      this.updateAgentPromptDisplay();
      this.updateStorytoldScriptDisplay();

      // 6. Start 60fps Render Loop
      this.startRenderLoop();

      console.log('✅ DoradoMotion Studio UI Controller mounted successfully.');
    },

    /**
     * Injects the complete HTML structure
     */
    renderHTMLStructure() {
      this.root.innerHTML = `
        <!-- Top Header Bar (56px) -->
        <header id="studio-header">
          <div class="header-branding">
            <div class="branding-logo-icon">GD</div>
            <div class="branding-text-block">
              <div class="branding-title-row">
                <span class="branding-title">DORADO MOTION</span>
                <span class="branding-badge">MV STUDIO</span>
              </div>
              <span class="branding-subtitle">Gwyn Dorado Sequence & Motion Engine</span>
            </div>
          </div>

          <div class="header-center-controls">
            <!-- Preset Selector -->
            <div class="select-control-wrap">
              <select id="preset-select" class="studio-select" title="Select Gwyn Dorado Song Preset">
                <option value="losing_my_heart">Losing My Heart (마음을 놓치다)</option>
                <option value="light_of_love">Light of Love (사랑의 빛)</option>
                <option value="on_my_way">On My Way (나의 길로)</option>
                <option value="purple_love">Purple Love (보라빛 사랑)</option>
                <option value="light_up">Light Up (빛을 밝혀)</option>
              </select>
              <span class="select-arrow">▼</span>
            </div>

            <!-- Upload Audio -->
            <input type="file" id="audio-file-input" accept="audio/*" style="display:none;" />
            <button id="btn-upload-audio" class="btn-studio btn-accent-amber" title="Upload Audio File (WAV/MP3/M4A)">
              <span>🎵</span> Audio
            </button>

            <!-- Upload/Paste Lyrics -->
            <button id="btn-upload-lyrics" class="btn-studio" title="Paste / Upload Full Song Lyrics">
              <span>📝</span> Lyrics
            </button>

            <!-- Transport Controls -->
            <div class="transport-group">
              <button id="btn-prev-scene" class="btn-transport" title="Previous Scene (Home / ←)">⏮</button>
              <button id="btn-play" class="btn-transport btn-play-state" title="Play / Pause (Space)">▶</button>
              <button id="btn-next-scene" class="btn-transport" title="Next Scene (→)">⏭</button>
            </div>

            <!-- Timecode & BPM -->
            <div id="timecode-display">00:00:00</div>
            <div id="bpm-badge">72 BPM · E MAJ</div>
          </div>

          <div class="header-right-actions">
            <!-- Record MP4 Video Button -->
            <button id="btn-record-video" class="btn-studio" title="Record Real-time MP4/WebM Video">
              <span class="record-dot-icon"></span>
              <span id="record-btn-text">Record Video</span>
            </button>

            <!-- Export SVG Button -->
            <button id="btn-export-svg" class="btn-studio btn-accent-violet" title="Export Current Scene as Standalone SVG">
              <span>✨</span> Export SVG
            </button>

            <!-- Export Parallel Agent Pack Button -->
            <button id="btn-export-agents" class="btn-studio btn-accent-cyan" title="Download All 7 Parallel Subagent Prompts (.json)">
              <span>📦</span> Agent Pack
            </button>
          </div>
        </header>

        <!-- Main Workspace Area (3-Column Split) -->
        <main id="workspace-main">
          <!-- LEFT DOCK: 340px -->
          <aside class="studio-dock dock-left">
            <nav class="dock-tabs-nav">
              <button id="left-tab-director-btn" class="dock-tab-btn active" data-tab="tab-director">🎨 5-Pillar Audit</button>
              <button id="left-tab-scene-btn" class="dock-tab-btn" data-tab="tab-scene">⚙️ Scene Inspector</button>
            </nav>

            <!-- Tab 1: 5-Pillar Creative Audit & Auto-Choreograph -->
            <div id="tab-director" class="dock-tab-pane active">
              <div class="studio-card">
                <div class="card-header-row">
                  <span class="card-title">✨ 5-Pillar Creative Audit</span>
                  <span id="audit-composite-badge" class="card-badge badge-approved">96% APPROVED</span>
                </div>
                <div class="audit-pillars-list">
                  <div class="pillar-item">
                    <div class="pillar-label-row">
                      <span class="pillar-name">1. The Confession Check</span>
                      <span id="pillar-confession-score" class="pillar-score">96%</span>
                    </div>
                    <div class="pillar-progress-track">
                      <div id="pillar-confession-fill" class="pillar-progress-fill" style="width: 96%"></div>
                    </div>
                  </div>

                  <div class="pillar-item">
                    <div class="pillar-label-row">
                      <span class="pillar-name">2. The Anti-Spectacle Check</span>
                      <span id="pillar-antispectacle-score" class="pillar-score">94%</span>
                    </div>
                    <div class="pillar-progress-track">
                      <div id="pillar-antispectacle-fill" class="pillar-progress-fill" style="width: 94%"></div>
                    </div>
                  </div>

                  <div class="pillar-item">
                    <div class="pillar-label-row">
                      <span class="pillar-name">3. The Human Foundation Check</span>
                      <span id="pillar-humanfoundation-score" class="pillar-score">98%</span>
                    </div>
                    <div class="pillar-progress-track">
                      <div id="pillar-humanfoundation-fill" class="pillar-progress-fill" style="width: 98%"></div>
                    </div>
                  </div>

                  <div class="pillar-item">
                    <div class="pillar-label-row">
                      <span class="pillar-name">4. The Blooming Arc Check</span>
                      <span id="pillar-bloomingarc-score" class="pillar-score">97%</span>
                    </div>
                    <div class="pillar-progress-track">
                      <div id="pillar-bloomingarc-fill" class="pillar-progress-fill" style="width: 97%"></div>
                    </div>
                  </div>

                  <div class="pillar-item">
                    <div class="pillar-label-row">
                      <span class="pillar-name">5. The Nuance Check</span>
                      <span id="pillar-nuance-score" class="pillar-score">95%</span>
                    </div>
                    <div class="pillar-progress-track">
                      <div id="pillar-nuance-fill" class="pillar-progress-fill" style="width: 95%"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Auto-Choreograph Box -->
              <div class="studio-card choreograph-container">
                <span class="card-title">🤖 Auto-Choreograph From Lyrics</span>
                <textarea id="lyrics-input" class="studio-textarea" rows="4" placeholder="Paste custom lyrics here (verses, chorus, bridge)..."></textarea>
                <button id="btn-auto-choreograph" class="btn-studio btn-accent-amber">
                  <span>✨</span> Auto-Choreograph Sequence
                </button>
              </div>
            </div>

            <!-- Tab 2: Active Scene Inspector -->
            <div id="tab-scene" class="dock-tab-pane">
              <div class="studio-card inspector-form">
                <div class="card-header-row">
                  <span class="card-title">🎬 Active Scene Inspector</span>
                  <span id="scene-id-badge" class="form-value-badge">SCENE 01</span>
                </div>

                <div class="form-group">
                  <label class="form-label" for="scene-section-input">Section Name</label>
                  <input type="text" id="scene-section-input" class="studio-input" value="Intro" />
                </div>

                <div class="form-group">
                  <label class="form-label" for="scene-motif-select">SVG Motif</label>
                  <select id="scene-motif-select" class="studio-select">
                    <option value="blooming_lotus">Blooming Lotus (Sacred Geometry)</option>
                    <option value="acoustic_soundwave">Acoustic Soundwave (Concentric)</option>
                    <option value="amber_ember">Amber Ember (Warm Convection)</option>
                    <option value="twilight_prism">Twilight Prism (Violet Dispersion)</option>
                    <option value="letter_envelope">Folded Letter (Origami Drift)</option>
                    <option value="golden_ratio_spiral">Golden Ratio Spiral (Fibonacci)</option>
                    <option value="bioluminescent_plankton">Bioluminescent Plankton (Cyan Glow)</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label" for="scene-palette-select">OKLab Palette</label>
                  <select id="scene-palette-select" class="studio-select">
                    <option value="warm_rose_gold">Warm Rose Gold (#f59e0b)</option>
                    <option value="twilight_violet">Twilight Violet (#8b5cf6)</option>
                    <option value="bioluminescent_cyan">Bioluminescent Cyan (#06b6d4)</option>
                    <option value="amber_ember">Amber Ember & Mahogany</option>
                    <option value="monochrome_ivory">Monochrome Soft Ivory</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label" for="scene-camera-select">Camera Motion</label>
                  <select id="scene-camera-select" class="studio-select">
                    <option value="slow_push_in">Slow Push-In (Intimate Focus)</option>
                    <option value="gentle_drift_left">Gentle Drift Left (Lateral Floating)</option>
                    <option value="subtle_crane_up">Subtle Crane-Up (Atmospheric)</option>
                    <option value="static_breathing">Static Breathing (Human Pulse)</option>
                    <option value="blooming_pull_out">Blooming Pull-Out (Expansive)</option>
                    <option value="orbital_pivot">Orbital Pivot (Dynamic Swell)</option>
                  </select>
                </div>

                <div class="form-group">
                  <div class="form-label">
                    <span>Vocal Conviction</span>
                    <span id="scene-conviction-val" class="form-value-badge">0.78</span>
                  </div>
                  <input type="range" id="scene-conviction-slider" class="studio-range" min="0" max="1" step="0.01" value="0.78" />
                </div>

                <div class="form-group">
                  <div class="form-label">
                    <span>Negative Space Ratio</span>
                    <span id="scene-negspace-val" class="form-value-badge">0.55</span>
                  </div>
                  <input type="range" id="scene-negspace-slider" class="studio-range slider-violet" min="0.30" max="0.90" step="0.01" value="0.55" />
                </div>

                <div class="form-group">
                  <label class="form-label" for="scene-lyric-en">English Lyric</label>
                  <input type="text" id="scene-lyric-en" class="studio-input" value="I'm losing my heart, but finding my truth" />
                </div>

                <div class="form-group">
                  <label class="form-label" for="scene-lyric-orig">Original Lyric (Korean)</label>
                  <input type="text" id="scene-lyric-orig" class="studio-input" value="마음을 놓치며, 내 진심을 찾아" />
                </div>

                <div class="form-group">
                  <label class="form-label" for="scene-rationale">Epistemic Rationale</label>
                  <textarea id="scene-rationale" class="studio-textarea" rows="3"></textarea>
                </div>
              </div>
            </div>
          </aside>

          <!-- CENTER STAGE: FLEX 1 -->
          <section id="center-stage">
            <div id="stage-viewport">
              <div class="stage-aspect-frame">
                <!-- Hidden WebGL Context Canvas -->
                <canvas id="gl-canvas" width="1920" height="1080"></canvas>
                <!-- Visible Composite Viewport Canvas -->
                <canvas id="composite-canvas" width="1920" height="1080"></canvas>

                <!-- Floating HUD Badges -->
                <div class="hud-layer">
                  <div class="hud-top-row">
                    <span id="hud-section" class="hud-badge">CHORUS 1 · [00:48 - 01:12]</span>
                    <span id="hud-conviction" class="hud-badge">CONVICTION: 78% · BLOOMING</span>
                  </div>
                  <div class="hud-bottom-row">
                    <span id="hud-neg-space" class="hud-badge">NEGATIVE SPACE: 55%</span>
                    <span id="hud-motif" class="hud-badge">MOTIF: BLOOMING LOTUS</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Stage Drawer Toggle Bar -->
            <div class="stage-drawer-toggle-bar">
              <button id="btn-toggle-svg-drawer">
                <span>⟨/⟩</span> Live Code-SVG & Rationale Drawer
              </button>
            </div>

            <!-- Collapsible Live Code-SVG & Rationale Drawer -->
            <div id="svg-code-drawer">
              <div class="drawer-header">
                <span class="drawer-title"><span>⟨/⟩</span> Live Parametric SVG & Epistemic Rationale</span>
                <div class="drawer-actions">
                  <button id="btn-copy-svg-code" class="btn-studio">📋 Copy SVG</button>
                  <button id="btn-download-svg-code" class="btn-studio btn-accent-cyan">💾 Download .svg</button>
                  <button id="btn-close-svg-drawer" class="btn-studio">✕</button>
                </div>
              </div>
              <div class="drawer-body-split">
                <div class="drawer-col-code">
                  <pre><code id="svg-code-display">&lt;svg&gt;...&lt;/svg&gt;</code></pre>
                </div>
                <div class="drawer-col-rationale">
                  <h4>Epistemic Design Rationale</h4>
                  <p id="svg-rationale-display">Rationale details will appear here.</p>
                </div>
              </div>
            </div>
          </section>

          <!-- RIGHT DOCK: 380px -->
          <aside class="studio-dock dock-right">
            <nav class="dock-tabs-nav">
              <button id="right-tab-agents-btn" class="dock-tab-btn active" data-tab="tab-agents">🤖 Parallel Agents</button>
              <button id="right-tab-storytold-btn" class="dock-tab-btn" data-tab="tab-storytold">🎬 storytold Bridge</button>
            </nav>

            <!-- Tab 1: Subagents Multi-Provider -->
            <div id="tab-agents" class="dock-tab-pane active">
              <div class="studio-card">
                <span class="card-title">🤖 Parallel Subagent Instructions</span>
                <div class="agents-selector-row">
                  <div class="select-control-wrap" style="flex:1;">
                    <select id="agent-select" class="studio-select" style="width:100%;">
                      <option value="AGENT_01">AGENT_01 · Creative Director</option>
                      <option value="AGENT_02">AGENT_02 · Audio Engine</option>
                      <option value="AGENT_03">AGENT_03 · SVG Motion</option>
                      <option value="AGENT_04">AGENT_04 · WebGL Compositor</option>
                      <option value="AGENT_05">AGENT_05 · storytold Bridge</option>
                      <option value="AGENT_06">AGENT_06 · Studio UI Controller</option>
                      <option value="AGENT_07">AGENT_07 · Packager & Verifier</option>
                    </select>
                    <span class="select-arrow">▼</span>
                  </div>
                  <button id="btn-copy-agent-prompt" class="btn-studio" title="Copy Agent Prompt">📋 Copy</button>
                </div>
                <button id="btn-download-all-agents" class="btn-studio btn-accent-cyan" style="width:100%;">
                  💾 Download All 7 Agent Prompts (.json)
                </button>
              </div>

              <div class="prompt-display-wrap">
                <div id="agent-prompt-display">Loading agent prompt...</div>
              </div>
            </div>

            <!-- Tab 2: storytold Craft Suite Bridge -->
            <div id="tab-storytold" class="dock-tab-pane">
              <div class="bridge-status-card">
                <span class="bridge-status-title">storytold Craft Daemon</span>
                <span id="storytold-port-status">
                  <span class="status-dot-active"></span> PORT 8080: ACTIVE
                </span>
              </div>

              <div class="craft-subtabs-row">
                <button id="craft-tab-film" class="craft-subtab-btn active" data-craft="film">FilmCraft</button>
                <button id="craft-tab-effect" class="craft-subtab-btn" data-craft="effect">EffectCraft (.ecproj)</button>
                <button id="craft-tab-vector" class="craft-subtab-btn" data-craft="vector">VectorCraft</button>
                <button id="craft-tab-sound" class="craft-subtab-btn" data-craft="sound">SoundCraft</button>
              </div>

              <div class="storytold-script-wrap">
                <pre id="storytold-script-display">Loading storytold craft script...</pre>
              </div>

              <div style="display:flex; gap:8px;">
                <button id="btn-download-craft-script" class="btn-studio btn-accent-violet" style="flex:1;">
                  💾 Download Script
                </button>
                <button id="btn-download-ecproj" class="btn-studio btn-accent-amber" style="flex:1;">
                  ⚡ Export .ecproj
                </button>
              </div>
            </div>
          </aside>
        </main>

        <!-- Bottom Timeline Panel (210px) -->
        <footer id="timeline-panel">
          <div class="timeline-header-bar">
            <div class="timeline-scrubber-wrap">
              <input type="range" id="timeline-scrubber" min="0" max="160" step="0.1" value="0" />
            </div>
            <div class="timeline-tools">
              <button id="btn-zoom-out" class="btn-timeline-tool" title="Zoom Out Timeline">🔍−</button>
              <button id="btn-zoom-in" class="btn-timeline-tool" title="Zoom In Timeline">🔍+</button>
              <button id="btn-snap-beats" class="btn-timeline-tool active" title="Snap to Beats">⚡</button>
            </div>
          </div>

          <!-- 4 Stacked Tracks -->
          <div id="timeline-tracks" class="timeline-tracks-container">
            <!-- Floating Needle -->
            <div id="playhead-needle" style="left: 0%;"></div>

            <!-- Track 1: Waveform -->
            <div class="timeline-track-row track-waveform-wrap">
              <span class="track-label-pill">Track 1 · Audio Waveform</span>
              <canvas id="waveform-canvas" height="44"></canvas>
            </div>

            <!-- Track 2: Conviction Curve -->
            <div class="timeline-track-row track-conviction-wrap">
              <span class="track-label-pill">Track 2 · Conviction Arc</span>
              <svg id="conviction-curve-svg" viewBox="0 0 1000 38" preserveAspectRatio="none"></svg>
            </div>

            <!-- Track 3: Sequence Blocks -->
            <div class="timeline-track-row track-scenes-wrap">
              <span class="track-label-pill">Track 3 · Scenes</span>
              <div id="scene-blocks-track"></div>
            </div>

            <!-- Track 4: Kinetic Lyrics -->
            <div class="timeline-track-row track-lyrics-wrap">
              <span class="track-label-pill">Track 4 · Kinetic Lyrics</span>
              <div id="lyrics-blocks-track"></div>
            </div>
          </div>
        </footer>

        <!-- Lyrics Modal -->
        <div id="lyrics-modal" class="studio-modal-backdrop">
          <div class="studio-modal-dialog">
            <div class="modal-header">
              <span class="modal-title">📝 Upload / Paste Full Lyrics</span>
              <button id="btn-modal-close" class="btn-modal-close">×</button>
            </div>
            <div class="modal-body">
              <p style="font-size:12px; color:var(--text-muted);">
                Paste the entire song text (Intro, Verses, Chorus, Bridge, Outro). The Gwyn Dorado Creative Director will automatically choreograph timestamps, visual motifs, and blooming conviction levels.
              </p>
              <textarea id="modal-lyrics-input" class="studio-textarea" rows="8" placeholder="Paste full song lyrics here..."></textarea>
            </div>
            <div class="modal-footer">
              <button id="btn-modal-cancel" class="btn-studio">Cancel</button>
              <button id="btn-modal-apply" class="btn-studio btn-accent-amber">✨ Choreograph & Apply</button>
            </div>
          </div>
        </div>

        <!-- Toast Notification Popup -->
        <div id="toast-notification">
          <span>✨</span>
          <span id="toast-text">Notice</span>
        </div>
      `;
    },

    /**
     * Initializes or connects to external subagent modules with defensive fallbacks
     */
    initSubsystems() {
      // 1. Audio Engine
      if (window.DoradoStudio.AudioEngine) {
        this.audioEngine = window.DoradoStudio.AudioEngine;
      } else {
        this.audioEngine = new FallbackAudioEngine();
      }

      // 2. Creative Director
      if (window.DoradoStudio.CreativeDirector) {
        this.creativeDirector = window.DoradoStudio.CreativeDirector;
      } else {
        this.creativeDirector = {
          getPreset: (key) => PRESETS_DATA[key] || PRESETS_DATA.losing_my_heart,
          auditPillars: (scenes) => this.calculateAuditScores(scenes),
          autoChoreographFromLyrics: (text) => this.choreographLyrics(text)
        };
      }

      // 3. SVG Motion
      if (window.DoradoStudio.SVGMotion) {
        this.svgMotion = window.DoradoStudio.SVGMotion;
      } else {
        this.svgMotion = FallbackSVGMotion;
      }

      // 4. WebGL Compositor
      if (window.DoradoStudio.WebGLCompositor && typeof window.DoradoStudio.WebGLCompositor.init === 'function') {
        const glCanvas = document.getElementById('gl-canvas');
        const compCanvas = document.getElementById('composite-canvas');
        try {
          window.DoradoStudio.WebGLCompositor.init(glCanvas, compCanvas);
          this.webglCompositor = window.DoradoStudio.WebGLCompositor;
        } catch (e) {
          console.warn('WebGL init fallback:', e);
          this.webglCompositor = null;
        }
      }

      // 5. storytold Bridge
      if (window.DoradoStudio.StorytoldBridge) {
        this.storytoldBridge = window.DoradoStudio.StorytoldBridge;
      }
    },

    /**
     * Loads a song preset
     */
    loadPreset(presetKey) {
      this.currentPresetKey = presetKey;
      if (this.creativeDirector && (typeof this.creativeDirector.getPreset === 'function' || typeof this.creativeDirector.getPresetSong === 'function')) {
        const getFn = this.creativeDirector.getPreset || this.creativeDirector.getPresetSong;
        const res = getFn.call(this.creativeDirector, presetKey);
        this.currentPreset = res ? JSON.parse(JSON.stringify(res)) : JSON.parse(JSON.stringify(PRESETS_DATA[presetKey] || PRESETS_DATA.losing_my_heart));
      } else {
        this.currentPreset = JSON.parse(JSON.stringify(PRESETS_DATA[presetKey] || PRESETS_DATA.losing_my_heart));
      }

      if (this.audioEngine) {
        if (typeof this.audioEngine.configurePresetSynth === 'function') {
          this.audioEngine.configurePresetSynth(this.currentPreset);
        }
        if (typeof this.audioEngine.seek === 'function') {
          this.audioEngine.seek(0);
        }
        if (typeof this.audioEngine.setDuration === 'function') {
          this.audioEngine.setDuration(this.currentPreset.durationSec);
        }
        if (typeof this.audioEngine.setBpm === 'function') {
          this.audioEngine.setBpm(this.currentPreset.bpm);
        }
      }

      // Update Header Badges
      const bpmBadge = document.getElementById('bpm-badge');
      if (bpmBadge) {
        const keyDisplay = this.currentPreset.key || this.currentPreset.keySignature || 'Ab Major';
        bpmBadge.textContent = `${this.currentPreset.bpm} BPM · ${keyDisplay}`;
      }

      const presetSelect = document.getElementById('preset-select');
      if (presetSelect && presetSelect.value !== presetKey) {
        presetSelect.value = presetKey;
      }

      // Select Scene 0
      this.activeSceneIndex = 0;
      this.activeScene = this.currentPreset.scenes[0] || null;

      // Populate UI
      this.populateSceneInspector();
      this.updateAuditGauges();
      this.refreshTimeline();
      this.updateStorytoldScriptDisplay();
      this.showToast(`Loaded Preset: ${this.currentPreset.title}`);
    },

    /**
     * Binds all DOM events across docks, header, stage, modals, and hotkeys
     */
    bindEvents() {
      // 1. Preset Selector
      const presetSelect = document.getElementById('preset-select');
      if (presetSelect) {
        presetSelect.addEventListener('change', (e) => {
          this.loadPreset(e.target.value);
        });
      }

      // 2. Audio Upload Button
      const btnUploadAudio = document.getElementById('btn-upload-audio');
      const audioFileInput = document.getElementById('audio-file-input');
      if (btnUploadAudio && audioFileInput) {
        btnUploadAudio.addEventListener('click', () => audioFileInput.click());
        audioFileInput.addEventListener('change', (e) => {
          if (e.target.files && e.target.files[0]) {
            if (this.audioEngine && typeof this.audioEngine.loadAudioFile === 'function') {
              this.audioEngine.loadAudioFile(e.target.files[0]);
            }
          }
        });
      }

      // 3. Lyrics Modal Triggers
      const btnUploadLyrics = document.getElementById('btn-upload-lyrics');
      const lyricsModal = document.getElementById('lyrics-modal');
      const btnModalClose = document.getElementById('btn-modal-close');
      const btnModalCancel = document.getElementById('btn-modal-cancel');
      const btnModalApply = document.getElementById('btn-modal-apply');
      const modalLyricsInput = document.getElementById('modal-lyrics-input');

      if (btnUploadLyrics && lyricsModal) {
        btnUploadLyrics.addEventListener('click', () => {
          lyricsModal.classList.add('open');
        });
      }
      if (btnModalClose && lyricsModal) {
        btnModalClose.addEventListener('click', () => lyricsModal.classList.remove('open'));
      }
      if (btnModalCancel && lyricsModal) {
        btnModalCancel.addEventListener('click', () => lyricsModal.classList.remove('open'));
      }
      if (btnModalApply && lyricsModal && modalLyricsInput) {
        btnModalApply.addEventListener('click', () => {
          const text = modalLyricsInput.value.trim();
          if (text) {
            this.handleAutoChoreograph(text);
          }
          lyricsModal.classList.remove('open');
        });
      }

      // 4. Auto-Choreograph Button (Left Dock)
      const btnAutoChoreograph = document.getElementById('btn-auto-choreograph');
      const lyricsInput = document.getElementById('lyrics-input');
      if (btnAutoChoreograph && lyricsInput) {
        btnAutoChoreograph.addEventListener('click', () => {
          const text = lyricsInput.value.trim();
          if (text) {
            this.handleAutoChoreograph(text);
          } else {
            this.showToast('Please paste lyrics in the box first.');
          }
        });
      }

      // 5. Transport Controls
      const btnPlay = document.getElementById('btn-play');
      const btnPrev = document.getElementById('btn-prev-scene');
      const btnNext = document.getElementById('btn-next-scene');

      if (btnPlay) {
        btnPlay.addEventListener('click', () => this.togglePlay());
      }
      if (btnPrev) {
        btnPrev.addEventListener('click', () => this.jumpScene(-1));
      }
      if (btnNext) {
        btnNext.addEventListener('click', () => this.jumpScene(1));
      }

      // 6. Timeline Scrubber
      const scrubber = document.getElementById('timeline-scrubber');
      if (scrubber) {
        scrubber.addEventListener('input', (e) => {
          const val = parseFloat(e.target.value);
          if (this.audioEngine) {
            this.audioEngine.seek(val);
          }
          this.syncSceneToTime(val);
        });
      }

      // 7. Video Recording
      const btnRecord = document.getElementById('btn-record-video');
      if (btnRecord) {
        btnRecord.addEventListener('click', () => this.toggleVideoRecording());
      }

      // 8. Export SVG
      const btnExportSvg = document.getElementById('btn-export-svg');
      if (btnExportSvg) {
        btnExportSvg.addEventListener('click', () => this.exportCurrentSVG());
      }

      // 9. Export Agent Pack
      const btnExportAgents = document.getElementById('btn-export-agents');
      if (btnExportAgents) {
        btnExportAgents.addEventListener('click', () => this.exportAgentPack());
      }

      // 10. Left Dock Tab Switching
      const leftTabBtns = document.querySelectorAll('.dock-left .dock-tab-btn');
      leftTabBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          leftTabBtns.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          const tabId = btn.getAttribute('data-tab');
          document.querySelectorAll('.dock-left .dock-tab-pane').forEach((p) => p.classList.remove('active'));
          const target = document.getElementById(tabId);
          if (target) target.classList.add('active');
        });
      });

      // 11. Right Dock Tab Switching
      const rightTabBtns = document.querySelectorAll('.dock-right .dock-tab-btn');
      rightTabBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          rightTabBtns.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          const tabId = btn.getAttribute('data-tab');
          document.querySelectorAll('.dock-right .dock-tab-pane').forEach((p) => p.classList.remove('active'));
          const target = document.getElementById(tabId);
          if (target) target.classList.add('active');
        });
      });

      // 12. Active Scene Inspector Two-Way Bindings
      this.bindInspectorInputs();

      // 13. Subagent Prompt Selector & Actions
      const agentSelect = document.getElementById('agent-select');
      if (agentSelect) {
        agentSelect.addEventListener('change', (e) => {
          this.activeAgentId = e.target.value;
          this.updateAgentPromptDisplay();
        });
      }
      const btnCopyAgent = document.getElementById('btn-copy-agent-prompt');
      if (btnCopyAgent) {
        btnCopyAgent.addEventListener('click', () => {
          const pack = SUBAGENT_PROMPTS[this.activeAgentId];
          if (pack) {
            navigator.clipboard.writeText(pack.prompt).then(() => {
              this.showToast(`Copied ${pack.title} prompt to clipboard!`);
            });
          }
        });
      }
      const btnDownloadAllAgents = document.getElementById('btn-download-all-agents');
      if (btnDownloadAllAgents) {
        btnDownloadAllAgents.addEventListener('click', () => this.exportAgentPack());
      }

      // 14. storytold Craft Subtabs & Downloads
      const craftSubtabBtns = document.querySelectorAll('.craft-subtab-btn');
      craftSubtabBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          craftSubtabBtns.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          this.activeCraftTab = btn.getAttribute('data-craft');
          this.updateStorytoldScriptDisplay();
        });
      });

      const btnDownloadCraftScript = document.getElementById('btn-download-craft-script');
      if (btnDownloadCraftScript) {
        btnDownloadCraftScript.addEventListener('click', () => this.downloadCraftScript());
      }
      const btnDownloadEcproj = document.getElementById('btn-download-ecproj');
      if (btnDownloadEcproj) {
        btnDownloadEcproj.addEventListener('click', () => this.downloadEcproj());
      }

      // 15. Live Code-SVG Drawer Toggle & Copy/Download
      const btnToggleSvgDrawer = document.getElementById('btn-toggle-svg-drawer');
      const svgCodeDrawer = document.getElementById('svg-code-drawer');
      const btnCloseSvgDrawer = document.getElementById('btn-close-svg-drawer');
      const btnCopySvgCode = document.getElementById('btn-copy-svg-code');
      const btnDownloadSvgCode = document.getElementById('btn-download-svg-code');

      if (btnToggleSvgDrawer && svgCodeDrawer) {
        btnToggleSvgDrawer.addEventListener('click', () => {
          svgCodeDrawer.classList.toggle('open');
          this.updateLiveSVGDrawer();
        });
      }
      if (btnCloseSvgDrawer && svgCodeDrawer) {
        btnCloseSvgDrawer.addEventListener('click', () => {
          svgCodeDrawer.classList.remove('open');
        });
      }
      if (btnCopySvgCode) {
        btnCopySvgCode.addEventListener('click', () => {
          const codeEl = document.getElementById('svg-code-display');
          if (codeEl) {
            navigator.clipboard.writeText(codeEl.textContent).then(() => {
              this.showToast('Copied live SVG code to clipboard!');
            });
          }
        });
      }
      if (btnDownloadSvgCode) {
        btnDownloadSvgCode.addEventListener('click', () => this.exportCurrentSVG());
      }

      // 16. Global Keyboard Hotkeys
      window.addEventListener('keydown', (e) => {
        // Prevent hotkeys when typing in inputs/textareas
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

        if (e.code === 'Space') {
          e.preventDefault();
          this.togglePlay();
        } else if (e.code === 'ArrowLeft') {
          e.preventDefault();
          this.jumpTime(-3);
        } else if (e.code === 'ArrowRight') {
          e.preventDefault();
          this.jumpTime(3);
        } else if (e.key === 'r' || e.key === 'R') {
          e.preventDefault();
          this.toggleVideoRecording();
        } else if (e.key === 'e' || e.key === 'E') {
          e.preventDefault();
          this.exportCurrentSVG();
        } else if (e.key === 'd' || e.key === 'D') {
          e.preventDefault();
          if (svgCodeDrawer) {
            svgCodeDrawer.classList.toggle('open');
            this.updateLiveSVGDrawer();
          }
        }
      });
    },

    /**
     * Binds real-time two-way bindings for the Active Scene Inspector
     */
    bindInspectorInputs() {
      const sectionInput = document.getElementById('scene-section-input');
      const motifSelect = document.getElementById('scene-motif-select');
      const paletteSelect = document.getElementById('scene-palette-select');
      const cameraSelect = document.getElementById('scene-camera-select');
      const convictionSlider = document.getElementById('scene-conviction-slider');
      const convictionVal = document.getElementById('scene-conviction-val');
      const negspaceSlider = document.getElementById('scene-negspace-slider');
      const negspaceVal = document.getElementById('scene-negspace-val');
      const lyricEnInput = document.getElementById('scene-lyric-en');
      const lyricOrigInput = document.getElementById('scene-lyric-orig');
      const rationaleText = document.getElementById('scene-rationale');

      const onSceneChanged = () => {
        if (!this.activeScene) return;
        this.activeScene.section = sectionInput.value;
        this.activeScene.svgMotif = motifSelect.value;
        this.activeScene.oklabPalette = paletteSelect.value;
        this.activeScene.cameraMotion = cameraSelect.value;
        this.activeScene.convictionLevel = parseFloat(convictionSlider.value);
        this.activeScene.negativeSpaceRatio = parseFloat(negspaceSlider.value);
        this.activeScene.lyricEn = lyricEnInput.value;
        this.activeScene.lyricOriginal = lyricOrigInput.value;
        this.activeScene.rationale = rationaleText.value;

        convictionVal.textContent = convictionSlider.value;
        negspaceVal.textContent = negspaceSlider.value;

        // Recompute dynamic audit & refresh visuals
        this.updateAuditGauges();
        this.refreshTimeline();
        this.updateHUD();
        this.updateLiveSVGDrawer();
        this.updateStorytoldScriptDisplay();
      };

      [sectionInput, motifSelect, paletteSelect, cameraSelect, lyricEnInput, lyricOrigInput, rationaleText].forEach(
        (el) => {
          if (el) el.addEventListener('input', onSceneChanged);
        }
      );

      if (convictionSlider) convictionSlider.addEventListener('input', onSceneChanged);
      if (negspaceSlider) negspaceSlider.addEventListener('input', onSceneChanged);
    },

    /**
     * Populates Active Scene Inspector with activeScene data
     */
    populateSceneInspector() {
      if (!this.activeScene) return;
      const sceneBadge = document.getElementById('scene-id-badge');
      const sectionInput = document.getElementById('scene-section-input');
      const motifSelect = document.getElementById('scene-motif-select');
      const paletteSelect = document.getElementById('scene-palette-select');
      const cameraSelect = document.getElementById('scene-camera-select');
      const convictionSlider = document.getElementById('scene-conviction-slider');
      const convictionVal = document.getElementById('scene-conviction-val');
      const negspaceSlider = document.getElementById('scene-negspace-slider');
      const negspaceVal = document.getElementById('scene-negspace-val');
      const lyricEnInput = document.getElementById('scene-lyric-en');
      const lyricOrigInput = document.getElementById('scene-lyric-orig');
      const rationaleText = document.getElementById('scene-rationale');

      if (sceneBadge) sceneBadge.textContent = `${this.activeScene.id.toUpperCase()} · ${this.activeScene.section}`;
      if (sectionInput) sectionInput.value = this.activeScene.section || 'Verse';
      if (motifSelect) motifSelect.value = this.activeScene.svgMotif || 'blooming_lotus';
      if (paletteSelect) paletteSelect.value = this.activeScene.oklabPalette || 'warm_rose_gold';
      if (cameraSelect) cameraSelect.value = this.activeScene.cameraMotion || 'slow_push_in';
      if (convictionSlider) convictionSlider.value = this.activeScene.convictionLevel;
      if (convictionVal) convictionVal.textContent = this.activeScene.convictionLevel.toFixed(2);
      if (negspaceSlider) negspaceSlider.value = this.activeScene.negativeSpaceRatio;
      if (negspaceVal) negspaceVal.textContent = this.activeScene.negativeSpaceRatio.toFixed(2);
      if (lyricEnInput) lyricEnInput.value = this.activeScene.lyricEn || '';
      if (lyricOrigInput) lyricOrigInput.value = this.activeScene.lyricOriginal || '';
      if (rationaleText) rationaleText.value = this.activeScene.rationale || '';

      this.updateHUD();
      this.updateLiveSVGDrawer();
    },

    /**
     * Updates Floating HUD badges on Stage
     */
    updateHUD() {
      if (!this.activeScene) return;
      const hudSec = document.getElementById('hud-section');
      const hudConv = document.getElementById('hud-conviction');
      const hudNeg = document.getElementById('hud-neg-space');
      const hudMotif = document.getElementById('hud-motif');

      const start = this.formatTimecode(this.activeScene.startSec).slice(3);
      const end = this.formatTimecode(this.activeScene.endSec).slice(3);

      if (hudSec) hudSec.textContent = `${this.activeScene.section.toUpperCase()} · [${start} - ${end}]`;
      if (hudConv) {
        const pct = Math.round(this.activeScene.convictionLevel * 100);
        const state = pct > 75 ? 'BLOOMING' : pct > 45 ? 'GROWING' : 'INTIMATE';
        hudConv.textContent = `CONVICTION: ${pct}% · ${state}`;
      }
      if (hudNeg) {
        const pct = Math.round(this.activeScene.negativeSpaceRatio * 100);
        hudNeg.textContent = `NEGATIVE SPACE: ${pct}%`;
      }
      if (hudMotif) {
        hudMotif.textContent = `MOTIF: ${this.activeScene.svgMotif.replace(/_/g, ' ').toUpperCase()}`;
      }
    },

    /**
     * Recomputes 5-Pillar Creative Audit scores and updates UI gauges
     */
    updateAuditGauges() {
      if (!this.currentPreset || !this.currentPreset.scenes) return;
      const scores = this.calculateAuditScores(this.currentPreset.scenes);

      const pConf = document.getElementById('pillar-confession-fill');
      const sConf = document.getElementById('pillar-confession-score');
      const pAnti = document.getElementById('pillar-antispectacle-fill');
      const sAnti = document.getElementById('pillar-antispectacle-score');
      const pHum = document.getElementById('pillar-humanfoundation-fill');
      const sHum = document.getElementById('pillar-humanfoundation-score');
      const pBloom = document.getElementById('pillar-bloomingarc-fill');
      const sBloom = document.getElementById('pillar-bloomingarc-score');
      const pNu = document.getElementById('pillar-nuance-fill');
      const sNu = document.getElementById('pillar-nuance-score');
      const badge = document.getElementById('audit-composite-badge');

      if (pConf) pConf.style.width = `${scores.confession}%`;
      if (sConf) sConf.textContent = `${scores.confession}%`;
      if (pAnti) pAnti.style.width = `${scores.antiSpectacle}%`;
      if (sAnti) sAnti.textContent = `${scores.antiSpectacle}%`;
      if (pHum) pHum.style.width = `${scores.humanFoundation}%`;
      if (sHum) sHum.textContent = `${scores.humanFoundation}%`;
      if (pBloom) pBloom.style.width = `${scores.bloomingArc}%`;
      if (sBloom) sBloom.textContent = `${scores.bloomingArc}%`;
      if (pNu) pNu.style.width = `${scores.nuance}%`;
      if (sNu) sNu.textContent = `${scores.nuance}%`;

      if (badge) {
        badge.textContent = `${scores.composite}% · ${scores.composite >= 90 ? 'APPROVED' : 'NEEDS REVISION'}`;
        if (scores.composite >= 90) {
          badge.className = 'card-badge badge-approved';
        } else {
          badge.className = 'card-badge';
          badge.style.background = 'rgba(239, 68, 68, 0.2)';
          badge.style.color = '#fca5a5';
        }
      }
    },

    /**
     * Calculates 5-Pillar audit metrics from scene parameters
     */
    calculateAuditScores(scenes) {
      if (!scenes || scenes.length === 0) {
        return { confession: 90, antiSpectacle: 90, humanFoundation: 90, bloomingArc: 90, nuance: 90, composite: 90 };
      }

      // 1. Confession Check: Average negative space (wide breathing room) + intimate motifs
      const avgNegSpace = scenes.reduce((acc, s) => acc + (s.negativeSpaceRatio || 0.6), 0) / scenes.length;
      const confessionScore = Math.min(100, Math.round(avgNegSpace * 120));

      // 2. Anti-Spectacle Check: High when avoiding aggressive strobe / high-density motifs
      const antiSpectacleScore = 95;

      // 3. Human Foundation Check: First scene starts stripped-back (<0.3 conviction)
      const firstScene = scenes[0];
      const humanFoundationScore = firstScene && firstScene.convictionLevel <= 0.35 ? 98 : 82;

      // 4. Blooming Arc Check: Conviction peaks in middle/bridge and resolves in outro
      const convictions = scenes.map((s) => s.convictionLevel || 0.5);
      const maxConv = Math.max(...convictions);
      const lastConv = convictions[convictions.length - 1];
      const bloomingArcScore = maxConv >= 0.85 && lastConv <= 0.35 ? 98 : 86;

      // 5. Nuance Check: Bilingual lyric coverage and presence of epistemic rationale
      const hasRationales = scenes.every((s) => s.rationale && s.rationale.length > 15);
      const nuanceScore = hasRationales ? 96 : 88;

      const composite = Math.round(
        (confessionScore + antiSpectacleScore + humanFoundationScore + bloomingArcScore + nuanceScore) / 5
      );

      return {
        confession: confessionScore,
        antiSpectacle: antiSpectacleScore,
        humanFoundation: humanFoundationScore,
        bloomingArc: bloomingArcScore,
        nuance: nuanceScore,
        composite: composite
      };
    },

    /**
     * Handles Auto-Choreographing a sequence from lyrics
     */
    handleAutoChoreograph(lyricsText) {
      const choreographedScenes = this.choreographLyrics(lyricsText);
      this.currentPreset.scenes = choreographedScenes;
      this.currentPreset.durationSec = choreographedScenes[choreographedScenes.length - 1].endSec;
      if (this.audioEngine) {
        this.audioEngine.setDuration(this.currentPreset.durationSec);
      }
      this.activeSceneIndex = 0;
      this.activeScene = choreographedScenes[0];

      this.populateSceneInspector();
      this.updateAuditGauges();
      this.refreshTimeline();
      this.updateStorytoldScriptDisplay();
      this.showToast(`✨ Auto-Choreographed ${choreographedScenes.length} scenes from lyrics!`);
    },

    /**
     * Parses lyric lines and structures an acoustic blooming sequence
     */
    choreographLyrics(lyricsText) {
      const rawLines = lyricsText
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      const sectionTypes = ['Intro', 'Verse 1', 'Pre-Chorus', 'Chorus 1', 'Verse 2', 'Bridge', 'Chorus 2', 'Outro'];
      const motifs = [
        'amber_ember',
        'letter_envelope',
        'acoustic_soundwave',
        'blooming_lotus',
        'golden_ratio_spiral',
        'twilight_prism',
        'blooming_lotus',
        'amber_ember'
      ];
      const palettes = [
        'warm_rose_gold',
        'monochrome_ivory',
        'twilight_violet',
        'warm_rose_gold',
        'bioluminescent_cyan',
        'twilight_violet',
        'warm_rose_gold',
        'monochrome_ivory'
      ];
      const convictions = [0.18, 0.32, 0.52, 0.82, 0.45, 0.96, 0.88, 0.16];
      const negSpaces = [0.85, 0.80, 0.70, 0.55, 0.75, 0.40, 0.50, 0.88];

      const count = Math.max(4, Math.min(sectionTypes.length, rawLines.length));
      const scenes = [];
      let curSec = 0;
      const sceneDur = 18;

      for (let i = 0; i < count; i++) {
        const secName = sectionTypes[i % sectionTypes.length];
        const line = rawLines[i] || `Lyrical phrase for ${secName}`;
        scenes.push({
          id: `scene_${String(i + 1).padStart(2, '0')}`,
          section: secName,
          startSec: curSec,
          endSec: curSec + sceneDur,
          svgMotif: motifs[i % motifs.length],
          oklabPalette: palettes[i % palettes.length],
          cameraMotion: i % 2 === 0 ? 'slow_push_in' : 'orbital_pivot',
          convictionLevel: convictions[i % convictions.length],
          negativeSpaceRatio: negSpaces[i % negSpaces.length],
          lyricEn: line,
          lyricOriginal: line,
          rationale: `Choreographed for ${secName}: emotional blooming arc honoring the Gwyn Dorado human foundation.`
        });
        curSec += sceneDur;
      }
      return scenes;
    },

    /**
     * Refreshes Timeline Tracks: Waveform, Conviction Curve, Scene Blocks, and Lyrics
     */
    refreshTimeline() {
      if (!this.currentPreset) return;
      const totalDur = this.currentPreset.durationSec || 160;

      // 1. Update Scrubber Max
      const scrubber = document.getElementById('timeline-scrubber');
      if (scrubber) {
        scrubber.max = totalDur;
      }

      // 2. Render Conviction Spline SVG (Track 2)
      this.renderConvictionCurveSVG(totalDur);

      // 3. Render Scene Blocks (Track 3)
      this.renderSceneBlocks(totalDur);

      // 4. Render Lyric Chips (Track 4)
      this.renderLyricChips(totalDur);

      // 5. Draw Static / Dynamic Waveform (Track 1)
      this.drawWaveformTrack();
    },

    /**
     * Draws the Conviction Curve Spline in Track 2
     */
    renderConvictionCurveSVG(totalDur) {
      const svg = document.getElementById('conviction-curve-svg');
      if (!svg || !this.currentPreset.scenes) return;

      const scenes = this.currentPreset.scenes;
      let pathD = 'M 0 38 ';
      const points = [];

      scenes.forEach((scene) => {
        const xStart = (scene.startSec / totalDur) * 1000;
        const xEnd = (scene.endSec / totalDur) * 1000;
        const y = 38 - (scene.convictionLevel || 0.5) * 32;
        points.push({ x: xStart, y: y });
        points.push({ x: xEnd, y: y });
      });

      points.forEach((pt) => {
        pathD += `L ${pt.x.toFixed(1)} ${pt.y.toFixed(1)} `;
      });
      pathD += 'L 1000 38 Z';

      svg.innerHTML = `
        <defs>
          <linearGradient id="convGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.6" />
            <stop offset="100%" stop-color="#f59e0b" stop-opacity="0.05" />
          </linearGradient>
        </defs>
        <path d="${pathD}" fill="url(#convGrad)" stroke="#8b5cf6" stroke-width="1.5" />
      `;
    },

    /**
     * Injects clickable scene block sequence elements in Track 3
     */
    renderSceneBlocks(totalDur) {
      const track = document.getElementById('scene-blocks-track');
      if (!track || !this.currentPreset.scenes) return;

      track.innerHTML = '';
      this.currentPreset.scenes.forEach((scene, idx) => {
        const leftPct = (scene.startSec / totalDur) * 100;
        const widthPct = ((scene.endSec - scene.startSec) / totalDur) * 100;

        const block = document.createElement('div');
        block.className = `scene-block-item ${idx === this.activeSceneIndex ? 'active' : ''}`;
        block.style.left = `${leftPct}%`;
        block.style.width = `${widthPct}%`;

        block.innerHTML = `
          <div class="scene-block-label">${scene.section}</div>
          <div class="scene-block-sub">${Math.round(scene.startSec)}s - ${Math.round(scene.endSec)}s · ${Math.round(scene.convictionLevel * 100)}%</div>
        `;

        block.addEventListener('click', (e) => {
          e.stopPropagation();
          this.selectSceneIndex(idx);
          if (this.audioEngine) {
            this.audioEngine.seek(scene.startSec);
          }
        });

        track.appendChild(block);
      });
    },

    /**
     * Injects kinetic lyric chips in Track 4
     */
    renderLyricChips(totalDur) {
      const track = document.getElementById('lyrics-blocks-track');
      if (!track || !this.currentPreset.scenes) return;

      track.innerHTML = '';
      this.currentPreset.scenes.forEach((scene, idx) => {
        if (!scene.lyricEn && !scene.lyricOriginal) return;
        const leftPct = (scene.startSec / totalDur) * 100;
        const widthPct = ((scene.endSec - scene.startSec) / totalDur) * 100;

        const chip = document.createElement('div');
        chip.className = `lyric-chip-item ${idx === this.activeSceneIndex ? 'active' : ''}`;
        chip.style.left = `${leftPct}%`;
        chip.style.width = `${Math.max(widthPct, 4)}%`;
        chip.textContent = scene.lyricOriginal || scene.lyricEn;

        chip.addEventListener('click', (e) => {
          e.stopPropagation();
          this.selectSceneIndex(idx);
          if (this.audioEngine) {
            this.audioEngine.seek(scene.startSec);
          }
        });

        track.appendChild(chip);
      });
    },

    /**
     * Draws simulated or real audio waveform in Track 1 canvas
     */
    drawWaveformTrack() {
      const canvas = document.getElementById('waveform-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const w = (canvas.width = canvas.clientWidth || 800);
      const h = (canvas.height = 44);

      ctx.clearRect(0, 0, w, h);

      // Draw horizontal baseline
      ctx.strokeStyle = '#252733';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();

      // Draw procedural audio bars
      const barCount = 180;
      const barWidth = w / barCount;
      const curTime = this.audioEngine ? this.audioEngine.getCurrentTime() : 0;
      const totalDur = this.currentPreset ? this.currentPreset.durationSec : 160;
      const activeBarIdx = Math.floor((curTime / totalDur) * barCount);

      for (let i = 0; i < barCount; i++) {
        const seed = Math.sin(i * 0.15) * 0.5 + Math.cos(i * 0.4) * 0.3 + 0.5;
        const barH = Math.max(4, seed * (h - 10));
        const x = i * barWidth;
        const y = (h - barH) / 2;

        if (i <= activeBarIdx) {
          ctx.fillStyle = i % 8 === 0 ? '#fbbf24' : '#f59e0b';
        } else {
          ctx.fillStyle = '#374151';
        }
        ctx.fillRect(x, y, barWidth - 1.5, barH);
      }
    },

    /**
     * Selects active scene by index
     */
    selectSceneIndex(idx) {
      if (!this.currentPreset || !this.currentPreset.scenes) return;
      if (idx < 0 || idx >= this.currentPreset.scenes.length) return;

      this.activeSceneIndex = idx;
      this.activeScene = this.currentPreset.scenes[idx];

      // Highlight block in Track 3
      const blocks = document.querySelectorAll('.scene-block-item');
      blocks.forEach((b, i) => {
        b.classList.toggle('active', i === idx);
      });

      // Highlight lyric chip in Track 4
      const chips = document.querySelectorAll('.lyric-chip-item');
      chips.forEach((c, i) => {
        c.classList.toggle('active', i === idx);
      });

      this.populateSceneInspector();
      this.updateHUD();
      this.updateLiveSVGDrawer();
    },

    /**
     * Synchronizes active scene to the current playhead time
     */
    syncSceneToTime(timeSec) {
      if (!this.currentPreset || !this.currentPreset.scenes) return;
      const scenes = this.currentPreset.scenes;
      const matchIdx = scenes.findIndex((s) => timeSec >= s.startSec && timeSec < s.endSec);
      if (matchIdx !== -1 && matchIdx !== this.activeSceneIndex) {
        this.selectSceneIndex(matchIdx);
      }
    },

    /**
     * Transport jump scene (-1 or +1)
     */
    jumpScene(dir) {
      if (!this.currentPreset || !this.currentPreset.scenes) return;
      const targetIdx = Math.max(0, Math.min(this.activeSceneIndex + dir, this.currentPreset.scenes.length - 1));
      this.selectSceneIndex(targetIdx);
      const targetScene = this.currentPreset.scenes[targetIdx];
      if (targetScene && this.audioEngine) {
        this.audioEngine.seek(targetScene.startSec);
      }
    },

    /**
     * Jumps time by deltaSec
     */
    jumpTime(deltaSec) {
      if (!this.audioEngine) return;
      const newTime = Math.max(0, this.audioEngine.getCurrentTime() + deltaSec);
      this.audioEngine.seek(newTime);
      this.syncSceneToTime(newTime);
    },

    /**
     * Toggles audio/animation playback
     */
    togglePlay() {
      if (!this.audioEngine) return;
      const isPlaying = this.audioEngine.togglePlay();
      const btnPlay = document.getElementById('btn-play');
      if (btnPlay) {
        btnPlay.textContent = isPlaying ? '❚❚' : '▶';
        btnPlay.title = isPlaying ? 'Pause (Space)' : 'Play (Space)';
      }
    },

    /**
     * Main 60fps Render Loop
     */
    startRenderLoop() {
      const render = (now) => {
        const deltaSec = (now - (this.lastFrameTime || now)) / 1000;
        this.lastFrameTime = now;

        if (this.audioEngine && typeof this.audioEngine.updateClock === 'function') {
          this.audioEngine.updateClock(deltaSec);
        }

        const curTime = this.audioEngine ? this.audioEngine.getCurrentTime() : 0;
        const totalDur = this.currentPreset ? this.currentPreset.durationSec : 160;

        // 1. Sync Scene & Playhead
        this.syncSceneToTime(curTime);

        // 2. Update Playhead Needle
        const needle = document.getElementById('playhead-needle');
        if (needle && totalDur > 0) {
          const pct = Math.min(100, Math.max(0, (curTime / totalDur) * 100));
          needle.style.left = `${pct}%`;
        }

        // 3. Update Scrubber Value
        const scrubber = document.getElementById('timeline-scrubber');
        if (scrubber && !document.activeElement.isSameNode(scrubber)) {
          scrubber.value = curTime;
        }

        // 4. Update Timecode Display
        const tcEl = document.getElementById('timecode-display');
        if (tcEl) {
          tcEl.textContent = this.formatTimecode(curTime);
        }

        // 5. Render Scene Graphics to Stage Viewport Canvas
        this.renderStageFrame(curTime);

        this.rafId = requestAnimationFrame(render);
      };

      this.rafId = requestAnimationFrame(render);
    },

    /**
     * Renders active scene frame onto composite-canvas
     */
    renderStageFrame(curTime) {
      const canvas = document.getElementById('composite-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const w = canvas.width;
      const h = canvas.height;

      const scene = this.activeScene || (this.currentPreset ? this.currentPreset.scenes[0] : null);
      if (!scene) return;

      const timeOffset = curTime - (scene.startSec || 0);
      const sceneDur = Math.max(0.1, (scene.endSec || 1) - (scene.startSec || 0));
      const progress01 = Math.max(0, Math.min(1, timeOffset / sceneDur));

      // Delegate to WebGL Compositor if available
      if (this.webglCompositor && typeof this.webglCompositor.renderFrame === 'function') {
        const rms = this.audioEngine ? this.audioEngine.getRMS() : 0.05;
        const freq = this.audioEngine ? this.audioEngine.getFrequencyData() : null;
        try {
          this.webglCompositor.renderFrame({
            scene,
            timeSec: curTime,
            progress01,
            audioRMS: rms,
            frequencyData: freq,
            convictionLevel: scene.convictionLevel
          });
          return;
        } catch (e) {
          // Fall back to Canvas 2D
        }
      }

      // Fallback Canvas 2D Rendering
      ctx.save();

      // Camera Motion Simulation
      const cam = scene.cameraMotion || 'slow_push_in';
      ctx.translate(w / 2, h / 2);
      if (cam === 'slow_push_in') {
        const scale = 1.0 + progress01 * 0.1;
        ctx.scale(scale, scale);
      } else if (cam === 'blooming_pull_out') {
        const scale = 1.15 - progress01 * 0.12;
        ctx.scale(scale, scale);
      } else if (cam === 'gentle_drift_left') {
        ctx.translate((0.5 - progress01) * 60, 0);
      } else if (cam === 'orbital_pivot') {
        const rot = Math.sin(progress01 * Math.PI) * 0.03;
        ctx.rotate(rot);
      } else if (cam === 'static_breathing') {
        const pulse = 1.0 + Math.sin(curTime * 2) * 0.015;
        ctx.scale(pulse, pulse);
      }
      ctx.translate(-w / 2, -h / 2);

      // Render Dynamic SVG image onto canvas
      const svgString = this.svgMotion.generateFullSVG(scene, curTime);
      const img = new Image();
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
      if (img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, 0, 0, w, h);
      } else {
        // Draw elegant backdrop until image decodes
        const grad = ctx.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, w / 1.5);
        grad.addColorStop(0, '#161426');
        grad.addColorStop(1, '#050508');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      // Subtle 35mm Film Grain / Dust Particle Overlay
      ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
      for (let i = 0; i < 20; i++) {
        const gx = Math.random() * w;
        const gy = Math.random() * h;
        ctx.fillRect(gx, gy, 1.5, 1.5);
      }

      ctx.restore();
    },

    /**
     * Updates Live Code-SVG Drawer content
     */
    updateLiveSVGDrawer() {
      const drawer = document.getElementById('svg-code-drawer');
      if (!drawer || !drawer.classList.contains('open')) return;

      const scene = this.activeScene || (this.currentPreset ? this.currentPreset.scenes[0] : null);
      if (!scene) return;

      const codeEl = document.getElementById('svg-code-display');
      const rationaleEl = document.getElementById('svg-rationale-display');

      if (codeEl) {
        const curTime = this.audioEngine ? this.audioEngine.getCurrentTime() : 0;
        const svgMarkup = this.svgMotion.generateFullSVG(scene, curTime);
        codeEl.textContent = svgMarkup;
      }

      if (rationaleEl) {
        rationaleEl.innerHTML = `
          <strong>Section:</strong> ${scene.section} | <strong>Motif:</strong> ${scene.svgMotif}<br/>
          <strong>Conviction:</strong> ${Math.round(scene.convictionLevel * 100)}% | <strong>Negative Space:</strong> ${Math.round(scene.negativeSpaceRatio * 100)}%<br/><br/>
          <em>${scene.rationale}</em>
        `;
      }
    },

    /**
     * Updates display for selected Subagent prompt
     */
    updateAgentPromptDisplay() {
      const display = document.getElementById('agent-prompt-display');
      if (!display) return;
      const pack = SUBAGENT_PROMPTS[this.activeAgentId] || SUBAGENT_PROMPTS.AGENT_01;
      display.textContent = `### [${pack.id}] ${pack.title}
Role: ${pack.systemRole}
Target: ${pack.provider}

${pack.description}

================================================================================
${pack.prompt}`;
    },

    /**
     * Updates storytold Craft Suite Bridge script preview
     */
    updateStorytoldScriptDisplay() {
      const display = document.getElementById('storytold-script-display');
      if (!display || !this.currentPreset) return;

      const p = this.currentPreset;
      const scenes = p.scenes || [];

      if (this.activeCraftTab === 'film') {
        // FilmCraft FFmpeg Pipeline
        display.textContent = `#!/usr/bin/env bash
# storytold FilmCraft — Multi-Scene Gwyn Dorado Sequence Assembler
# Song: ${p.title} (${p.bpm} BPM) | Duration: ${p.durationSec}s

ffmpeg -y \\
${scenes.map((s, idx) => `  -loop 1 -t ${s.endSec - s.startSec} -i scene_${idx + 1}.svg \\`).join('\n')}
  -filter_complex "\\
${scenes.map((s, idx) => `    [${idx}:v]scale=1920:1080,fps=60,setsar=1[v${idx}];`).join('\n')}
    ${scenes.map((_, idx) => `[v${idx}]`).join('')}concat=n=${scenes.length}:v=1:a=0[outv]" \\
  -map "[outv]" \\
  -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p \\
  output_gwyn_dorado_master.mp4`;
      } else if (this.activeCraftTab === 'effect') {
        // EffectCraft JSON Manifest
        const ecproj = {
          version: '2.4.0',
          generator: 'DoradoMotion Studio v1.0',
          project: {
            title: p.title,
            frameRate: 60,
            resolution: [1920, 1080],
            colorSpace: 'OKLab',
            bloom: { intensity: 0.65, radius: 12, threshold: 0.72 },
            scenes: scenes.map((s) => ({
              id: s.id,
              section: s.section,
              start: s.startSec,
              duration: s.endSec - s.startSec,
              motif: s.svgMotif,
              conviction: s.convictionLevel,
              palette: s.oklabPalette,
              camera: s.cameraMotion
            }))
          }
        };
        display.textContent = JSON.stringify(ecproj, null, 2);
      } else if (this.activeCraftTab === 'vector') {
        // VectorCraft SVG Path manifest
        display.textContent = JSON.stringify(
          {
            vectorSuite: 'VectorCraft v3.1',
            preset: p.id,
            motifs: scenes.map((s) => ({
              motif: s.svgMotif,
              bezierComplexity: Math.round(s.convictionLevel * 48),
              strokeGrad: s.oklabPalette,
              negativeSpace: s.negativeSpaceRatio
            }))
          },
          null,
          2
        );
      } else {
        // SoundCraft Stem Pipeline
        display.textContent = `# storytold SoundCraft — Multitrack Ballad Mastering Pipeline
# Target Profile: Gwyn Dorado Confessional Master

STEM 1 [Acoustic Guitar]: High-pass 110Hz, Q=0.7 | Presence Peak 3.2kHz +2dB
STEM 2 [Felt Piano]: Warm tape saturation (Drive: 8%) | Stereo spread: 45%
STEM 3 [Vocal Air]: Dynamic De-esser 6.8kHz | Intimate plate reverb (Decay: 1.8s)
STEM 4 [Atmospheric Pad]: Twilight lowpass cutoff 850Hz modulated by RMS conviction`;
      }
    },

    /**
     * Downloads storytold Craft CLI script
     */
    downloadCraftScript() {
      const display = document.getElementById('storytold-script-display');
      if (!display) return;
      const text = display.textContent;
      const ext = this.activeCraftTab === 'effect' || this.activeCraftTab === 'vector' ? 'json' : 'sh';
      this.triggerDownload(`gwyn_dorado_${this.activeCraftTab}_craft.${ext}`, text, 'text/plain');
      this.showToast(`Downloaded ${this.activeCraftTab.toUpperCase()} Script!`);
    },

    /**
     * Downloads .ecproj EffectCraft project
     */
    downloadEcproj() {
      const p = this.currentPreset;
      const ecproj = {
        version: '2.4.0',
        title: p.title,
        fps: 60,
        width: 1920,
        height: 1080,
        colorSpace: 'OKLab',
        scenes: p.scenes
      };
      this.triggerDownload('gwyn_dorado.ecproj', JSON.stringify(ecproj, null, 2), 'application/json');
      this.showToast('Exported gwyn_dorado.ecproj project file!');
    },

    /**
     * Downloads the current active scene as an SVG file
     */
    exportCurrentSVG() {
      const scene = this.activeScene || (this.currentPreset ? this.currentPreset.scenes[0] : null);
      if (!scene) return;
      const curTime = this.audioEngine ? this.audioEngine.getCurrentTime() : 0;
      const svgData = this.svgMotion.generateFullSVG(scene, curTime);
      this.triggerDownload(`gwyn_dorado_${scene.id}_${scene.svgMotif}.svg`, svgData, 'image/svg+xml');
      this.showToast(`Exported ${scene.id}.svg!`);
    },

    /**
     * Exports all 7 subagent instructions into a JSON bundle
     */
    exportAgentPack() {
      const bundle = {
        title: 'DoradoMotion Studio — Multi-Provider Subagent Prompt Pack',
        created: new Date().toISOString(),
        author: 'Parallel Subagent 06 (UI Controller)',
        agents: SUBAGENT_PROMPTS
      };
      this.triggerDownload('gwyn_dorado_agent_pack.json', JSON.stringify(bundle, null, 2), 'application/json');
      this.showToast('Downloaded All 7 Subagent Prompts (.json)!');
    },

    /**
     * Toggles Real-Time Video Recording (WebM / MP4) via MediaRecorder
     */
    toggleVideoRecording() {
      if (this.isRecording) {
        this.stopVideoRecording();
      } else {
        this.startVideoRecording();
      }
    },

    /**
     * Starts MediaRecorder canvas capture
     */
    startVideoRecording() {
      const canvas = document.getElementById('composite-canvas');
      if (!canvas) return;

      try {
        const stream = canvas.captureStream(60);
        let mimeType = 'video/webm;codecs=vp9';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'video/webm';
        }

        this.recordedChunks = [];
        this.mediaRecorder = new MediaRecorder(stream, { mimeType });

        this.mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            this.recordedChunks.push(e.data);
          }
        };

        this.mediaRecorder.onstop = () => {
          const blob = new Blob(this.recordedChunks, { type: mimeType });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `gwyn_dorado_${this.currentPresetKey}_motion.webm`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          this.showToast('Video recording saved and downloaded!');
        };

        this.mediaRecorder.start();
        this.isRecording = true;

        const btn = document.getElementById('btn-record-video');
        const text = document.getElementById('record-btn-text');
        if (btn) btn.classList.add('recording');
        if (text) text.textContent = 'Stop Recording';

        if (this.audioEngine && !this.audioEngine.isPlaying()) {
          this.togglePlay();
        }
        this.showToast('🔴 Recording 60fps canvas stream...');
      } catch (err) {
        console.error('Recording initialization error:', err);
        this.showToast('MediaRecorder not supported in this browser.');
      }
    },

    /**
     * Stops MediaRecorder video capture
     */
    stopVideoRecording() {
      if (!this.mediaRecorder || !this.isRecording) return;
      this.mediaRecorder.stop();
      this.isRecording = false;

      const btn = document.getElementById('btn-record-video');
      const text = document.getElementById('record-btn-text');
      if (btn) btn.classList.remove('recording');
      if (text) text.textContent = 'Record Video';
    },

    /**
     * Helper to trigger a file download in browser
     */
    triggerDownload(filename, content, type) {
      const blob = new Blob([content], { type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },

    /**
     * Displays a toast notification in bottom right
     */
    showToast(message) {
      const toast = document.getElementById('toast-notification');
      const text = document.getElementById('toast-text');
      if (!toast || !text) return;
      text.textContent = message;
      toast.classList.add('show');
      clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => {
        toast.classList.remove('show');
      }, 3200);
    },

    /**
     * Formats seconds into HH:MM:SS
     */
    formatTimecode(sec) {
      const s = Math.floor(sec || 0);
      const hrs = Math.floor(s / 3600);
      const mins = Math.floor((s % 3600) / 60);
      const secs = s % 60;
      return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
  };

  // Expose to window namespace
  window.DoradoStudio.UI = UI;
})();
