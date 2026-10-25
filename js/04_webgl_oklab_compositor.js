/**
 * DoradoMotion Studio — WebGL 2.0 SDF Shader, Oklab Perceptual Color Grader & High-Bitrate Video Recorder
 * File: js/04_webgl_oklab_compositor.js
 *
 * Implements:
 * 1. OKLAB_PROFILES: 5 bespoke perceptual color profiles with Sigmoidal contrast (k-curves),
 *    chroma vibrance, and atmospheric palette parameters.
 * 2. True Oklab Color Space & Sigmoidal S-curve tone curve in GLSL (with JS mathematical equivalents).
 * 3. Signed Distance Field (SDF) smooth-minimum (smin) atmospheric volumetric lighting backdrops.
 * 4. Micro-analog film grain shader to eliminate 8-bit banding on gradients.
 * 5. Master dual-canvas compositor layering WebGL backgrounds and Code-SVG vector graphics.
 * 6. High-bitrate broadcast recorder (16 Mbps, 60fps) with audio track merging and automatic download.
 * 7. Resilient headless & 2D canvas fallback if WebGL is unavailable.
 */

(function () {
  'use strict';

  // Ensure root namespace
  window.DoradoStudio = window.DoradoStudio || {};

  // =========================================================================
  // SECTION 1: OKLAB PROFILES & COLOR METADATA
  // =========================================================================

  const OKLAB_PROFILES = {
    moonlit_confession: {
      id: 'moonlit_confession',
      name: 'Moonlit Confession',
      description: 'Deep midnight indigo, silver moonlight mist, soft warm skin/ink highlights',
      kCurve: 1.8,                  // S-curve contrast steepness
      chromaBoost: 1.15,            // Perceptual chroma multiplier
      vignetteStrength: 0.45,       // Edge falloff intensity
      grainIntensity: 0.035,        // Filmic micro-grain level
      profileIndex: 0.0,
      baseColor1: [0.03, 0.05, 0.12],     // Deep midnight indigo
      baseColor2: [0.14, 0.20, 0.32],     // Silver moonlight mist
      highlightColor: [0.92, 0.84, 0.76], // Soft warm skin/ink highlight
      accentColor: [0.45, 0.65, 0.85],    // Moonlit silver-cyan
      negativeSpaceBias: 0.75
    },
    whale_bioluminescence: {
      id: 'whale_bioluminescence',
      name: 'Whale Bioluminescence',
      description: 'Abyssal teal-blue, glowing cyan/violet starlight SDF whale & gem aura',
      kCurve: 2.4,                  // S-curve contrast steepness
      chromaBoost: 1.35,            // Perceptual chroma multiplier
      vignetteStrength: 0.55,       // Edge falloff intensity
      grainIntensity: 0.030,        // Filmic micro-grain level
      profileIndex: 1.0,
      baseColor1: [0.01, 0.06, 0.13],     // Abyssal teal-blue
      baseColor2: [0.03, 0.24, 0.36],     // Deep oceanic bioluminescence
      highlightColor: [0.38, 0.92, 0.96], // Glowing cyan starlight
      accentColor: [0.65, 0.28, 0.92],    // Electric violet aura
      negativeSpaceBias: 0.65
    },
    acoustic_parchment: {
      id: 'acoustic_parchment',
      name: 'Acoustic Parchment',
      description: 'Warm sepia ivory, charcoal ink, golden afternoon dust',
      kCurve: 1.5,                  // Soft filmic roll-off
      chromaBoost: 0.88,            // Gentle subdued chroma
      vignetteStrength: 0.35,       // Subtle edge darkening
      grainIntensity: 0.045,        // Organic paper/film grain
      profileIndex: 2.0,
      baseColor1: [0.09, 0.07, 0.06],     // Charcoal ink
      baseColor2: [0.28, 0.22, 0.17],     // Aged warm sepia
      highlightColor: [0.96, 0.93, 0.85], // Warm ivory parchment
      accentColor: [0.86, 0.66, 0.35],    // Golden afternoon dust
      negativeSpaceBias: 0.50
    },
    seoul_dusk_purple: {
      id: 'seoul_dusk_purple',
      name: 'Seoul Dusk Purple',
      description: 'Code Kunst inspired twilight violet, neon-amber streetlamp bokeh, analog grain',
      kCurve: 2.2,                  // Punchy analog contrast
      chromaBoost: 1.25,            // Rich saturated dusk tones
      vignetteStrength: 0.50,       // Streetlamp isolation vignette
      grainIntensity: 0.050,        // Heavy analog tape grain
      profileIndex: 3.0,
      baseColor1: [0.07, 0.04, 0.15],     // Twilight deep purple
      baseColor2: [0.24, 0.12, 0.34],     // Moody dusky violet
      highlightColor: [0.98, 0.74, 0.38], // Streetlamp neon amber
      accentColor: [0.88, 0.24, 0.62],    // Seoul neon magenta
      negativeSpaceBias: 0.60
    },
    stage_conviction_gold: {
      id: 'stage_conviction_gold',
      name: 'Stage Conviction Gold',
      description: 'Soaring spotlight amber, volumetric cathedral rays, rich stage black',
      kCurve: 2.8,                  // Dramatic stage contrast
      chromaBoost: 1.40,            // Intense spotlight vibrance
      vignetteStrength: 0.60,       // Dark stage edge suppression
      grainIntensity: 0.040,        // Crisp cinematic grain
      profileIndex: 4.0,
      baseColor1: [0.03, 0.02, 0.02],     // Velvet stage black
      baseColor2: [0.18, 0.09, 0.05],     // Deep warm mahogany
      highlightColor: [0.98, 0.86, 0.46], // Searing spotlight gold
      accentColor: [0.92, 0.62, 0.22],    // Cathedral beam amber
      negativeSpaceBias: 0.80
    }
  };

  // Friendly profile alias mapping
  const PROFILE_ALIASES = {
    moonlit: 'moonlit_confession',
    moonlight: 'moonlit_confession',
    whale: 'whale_bioluminescence',
    ocean: 'whale_bioluminescence',
    parchment: 'acoustic_parchment',
    acoustic: 'acoustic_parchment',
    seoul: 'seoul_dusk_purple',
    dusk: 'seoul_dusk_purple',
    code_kunst: 'seoul_dusk_purple',
    stage: 'stage_conviction_gold',
    gold: 'stage_conviction_gold',
    conviction: 'stage_conviction_gold'
  };

  // =========================================================================
  // SECTION 2: OKLAB MATHEMATICAL UTILITIES (JS REFERENCE & CPU FALLBACK)
  // =========================================================================

  const OklabMath = {
    srgbToLinear(c) {
      return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    },

    linearToSrgb(c) {
      const clamped = Math.max(0, Math.min(1, c));
      return clamped <= 0.0031308 ? clamped * 12.92 : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
    },

    rgbToOklab(r, g, b) {
      const lr = this.srgbToLinear(r);
      const lg = this.srgbToLinear(g);
      const lb = this.srgbToLinear(b);

      const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
      const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
      const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;

      const l_ = Math.cbrt(Math.max(0, l));
      const m_ = Math.cbrt(Math.max(0, m));
      const s_ = Math.cbrt(Math.max(0, s));

      return {
        L: 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
        a: 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
        b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_
      };
    },

    oklabToRgb(L, a, b) {
      const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
      const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
      const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

      const l = l_ * l_ * l_;
      const m = m_ * m_ * m_;
      const s = s_ * s_ * s_;

      const lr = +4.0767434721 * l - 3.3077115913 * m + 0.2309699292 * s;
      const lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
      const lb = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

      return {
        r: Math.max(0, Math.min(1, this.linearToSrgb(lr))),
        g: Math.max(0, Math.min(1, this.linearToSrgb(lg))),
        b: Math.max(0, Math.min(1, this.linearToSrgb(lb)))
      };
    },

    sigmoidalContrast(x, k) {
      const clamped = Math.max(0.0001, Math.min(0.9999, x));
      const xk = Math.pow(clamped, k);
      const omxk = Math.pow(1.0 - clamped, k);
      return xk / (xk + omxk);
    }
  };

  // =========================================================================
  // SECTION 3: GLSL SHADER SOURCES (UNIVERSAL WEBGL 1.0 / 2.0 SHADERS)
  // =========================================================================

  const VERTEX_SHADER_SRC = `
    attribute vec2 a_position;
    varying vec2 v_uv;

    void main() {
      v_uv = a_position * 0.5 + 0.5;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  const FRAGMENT_SHADER_SRC = `
    #ifdef GL_ES
    precision highp float;
    #endif

    varying vec2 v_uv;

    uniform vec2 u_resolution;
    uniform float u_time;
    uniform float u_scene_progress;

    // Audio Telemetry
    uniform float u_bass;
    uniform float u_vocal;
    uniform float u_conviction;
    uniform float u_negativeSpace;

    // Color Grading & Profile Uniforms
    uniform float u_k_curve;
    uniform float u_chroma_boost;
    uniform float u_vignette_strength;
    uniform float u_grain_intensity;
    uniform vec3 u_color_base1;
    uniform vec3 u_color_base2;
    uniform vec3 u_color_highlight;
    uniform vec3 u_color_accent;
    uniform float u_profile_index; // 0.0: moonlit, 1.0: whale, 2.0: parchment, 3.0: seoul, 4.0: stage

    // --- Oklab Perceptual Color Space Conversion ---
    vec3 srgbToLinear(vec3 c) {
      vec3 higher = pow((c + vec3(0.055)) / 1.055, vec3(2.4));
      vec3 lower = c / 12.92;
      vec3 cutoff = step(vec3(0.04045), c);
      return mix(lower, higher, cutoff);
    }

    vec3 linearToSrgb(vec3 c) {
      c = clamp(c, 0.0, 1.0);
      vec3 higher = 1.055 * pow(c, vec3(1.0 / 2.4)) - vec3(0.055);
      vec3 lower = c * 12.92;
      vec3 cutoff = step(vec3(0.0031308), c);
      return mix(lower, higher, cutoff);
    }

    vec3 linearToOklab(vec3 c) {
      float l = 0.4122214708 * c.r + 0.5363325363 * c.g + 0.0514459929 * c.b;
      float m = 0.2119034982 * c.r + 0.6806995451 * c.g + 0.1073969566 * c.b;
      float s = 0.0883024619 * c.r + 0.2817188376 * c.g + 0.6299787005 * c.b;

      float l_ = pow(max(l, 0.0), 1.0 / 3.0);
      float m_ = pow(max(m, 0.0), 1.0 / 3.0);
      float s_ = pow(max(s, 0.0), 1.0 / 3.0);

      return vec3(
        0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
        1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
        0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_
      );
    }

    vec3 oklabToLinear(vec3 c) {
      float l_ = c.x + 0.3963377774 * c.y + 0.2158037573 * c.z;
      float m_ = c.x - 0.1055613458 * c.y - 0.0638541728 * c.z;
      float s_ = c.x - 0.0894841775 * c.y - 1.2914855480 * c.z;

      float l = l_ * l_ * l_;
      float m = m_ * m_ * m_;
      float s = s_ * s_ * s_;

      return vec3(
        +4.0767434721 * l - 3.3077115913 * m + 0.2309699292 * s,
        -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
      );
    }

    vec3 srgbToOklab(vec3 c) {
      return linearToOklab(srgbToLinear(c));
    }

    vec3 oklabToSrgb(vec3 c) {
      return linearToSrgb(oklabToLinear(c));
    }

    // Sigmoidal S-Curve Tone Curve
    float sigmoidalContrast(float x, float k) {
      x = clamp(x, 0.0001, 0.9999);
      float xk = pow(x, k);
      float omxk = pow(1.0 - x, k);
      return xk / (xk + omxk);
    }

    // --- SDF Smooth-Minimum & Procedural Shapes ---
    float smin(float a, float b, float k) {
      float h = clamp(0.5 + 0.5 * (b - a) / max(k, 0.0001), 0.0, 1.0);
      return mix(b, a, h) - k * h * (1.0 - h);
    }

    // Filmic noise generator for micro-grain
    float hash12(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * 0.1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
    }

    // Drifting Bokeh orbs SDF
    float sdBokeh(vec2 p, float t, float vocal) {
      float d = 100.0;
      vec2 c0 = vec2(sin(t * 0.35) * 0.55, cos(t * 0.28) * 0.30);
      vec2 c1 = vec2(sin(t * 0.42 + 2.1) * 0.65, cos(t * 0.38 + 1.2) * 0.35);
      vec2 c2 = vec2(sin(t * 0.29 + 4.3) * 0.50, cos(t * 0.45 + 3.4) * 0.28);
      vec2 c3 = vec2(sin(t * 0.51 + 0.8) * 0.60, cos(t * 0.31 + 5.1) * 0.32);

      d = smin(d, length(p - c0) - (0.12 + 0.04 * vocal), 0.35);
      d = smin(d, length(p - c1) - (0.09 + 0.03 * vocal), 0.30);
      d = smin(d, length(p - c2) - (0.14 + 0.05 * vocal), 0.38);
      d = smin(d, length(p - c3) - (0.08 + 0.02 * vocal), 0.25);
      return d;
    }

    // Bioluminescent Whale SDF
    float sdWhale(vec2 p, float t, float bass) {
      vec2 pos = p;
      pos.y += sin(pos.x * 2.2 - t * 1.6) * (0.04 + 0.03 * bass);

      // Main Torso
      vec2 bodyP = pos - vec2(-0.05, 0.0);
      float body = length(bodyP / vec2(0.42, 0.16 + 0.03 * bass)) - 0.70;

      // Tail Segment
      vec2 tailP = pos - vec2(0.52, 0.0);
      float tail = length(tailP / vec2(0.28, 0.08)) - 0.38;

      // Fluke (Tail fin)
      vec2 flukeP = pos - vec2(0.78, 0.0);
      flukeP.y = abs(flukeP.y);
      float fluke = length(flukeP - vec2(0.0, 0.12)) - 0.07;

      return smin(smin(body, tail, 0.20), fluke, 0.15);
    }

    void main() {
      vec2 uv = v_uv;
      vec2 p = (uv - 0.5) * vec2(u_resolution.x / u_resolution.y, 1.0);

      // Base atmospheric gradient: vertical with soft organic wave
      float wave = sin(p.x * 2.5 + u_time * 0.3) * 0.05;
      float gradT = clamp(uv.y + wave, 0.0, 1.0);
      vec3 sceneColor = mix(u_color_base1, u_color_base2, gradT);

      // Profile-specific atmospheric lighting & SDF backdrops
      if (u_profile_index < 0.5) {
        // --- 0. MOONLIT CONFESSION ---
        // Volumetric silver moonlight in upper right
        vec2 moonPos = vec2(0.38, 0.22);
        float dMoon = length(p - moonPos) - 0.18;
        float moonMist = sin(p.x * 3.5 + u_time * 0.4) * cos(p.y * 2.5 - u_time * 0.3) * 0.06;
        float moonAura = exp(-max(0.0, dMoon + moonMist) * 3.2) * (0.85 + 0.35 * u_vocal);
        float moonDisc = smoothstep(0.02, -0.02, dMoon);

        // Soft ink / starlight bokeh in lower left
        float bokeh = sdBokeh(p + vec2(0.2, 0.1), u_time * 0.6, u_vocal);
        float bokehGlow = exp(-max(0.0, bokeh) * 4.5) * (0.35 + 0.25 * u_bass);

        sceneColor += u_color_accent * (moonAura * 0.65 + bokehGlow * 0.4);
        sceneColor = mix(sceneColor, u_color_highlight, moonDisc * 0.95);
      }
      else if (u_profile_index < 1.5) {
        // --- 1. WHALE BIOLUMINESCENCE ---
        // SDF Whale undulating across depth
        float dWh = sdWhale(p * 1.35, u_time, u_bass);
        float whaleEdgeAura = exp(-abs(dWh) * (12.0 - 3.0 * u_bass)) * (0.95 + 0.55 * u_conviction);
        float whaleInner = exp(-max(0.0, dWh) * 3.5) * 0.45;

        // Bioluminescent starlight specks
        float starlight = sdBokeh(p * 1.4, u_time * 0.8, u_vocal);
        float starGlow = exp(-max(0.0, starlight) * 6.5) * (0.50 + 0.30 * u_bass);

        sceneColor += u_color_highlight * (whaleEdgeAura * 0.85 + starGlow * 0.5);
        sceneColor += u_color_accent * (whaleInner * 0.7);
      }
      else if (u_profile_index < 2.5) {
        // --- 2. ACOUSTIC PARCHMENT ---
        // Warm afternoon diagonal sunbeam
        float beamDist = abs(p.x * 0.75 - p.y * 0.55 + 0.15);
        float sunbeam = pow(max(0.0, 1.0 - beamDist), 4.5) * (0.65 + 0.35 * u_vocal);

        // Gentle warm dust motes
        float dustMote = hash12(floor(uv * 320.0) + floor(u_time * 5.0));
        float dust = step(0.985, dustMote) * (0.4 + 0.3 * u_conviction);

        sceneColor += u_color_accent * (sunbeam * 0.65);
        sceneColor += u_color_highlight * dust;
      }
      else if (u_profile_index < 3.5) {
        // --- 3. SEOUL DUSK PURPLE (Code Kunst twilight) ---
        // Horizon twilight glow
        float horizon = exp(-abs(p.y + 0.1) * 3.0) * (0.55 + 0.25 * u_bass);

        // Neon-amber streetlamp bokeh drifting in twilight
        float bokeh = sdBokeh(p, u_time * 0.65, u_bass);
        float bokehAura = exp(-max(0.0, bokeh) * 5.0) * (0.80 + 0.45 * u_bass);

        sceneColor += u_color_accent * (horizon * 0.6);
        sceneColor += u_color_highlight * (bokehAura * 0.85);
      }
      else {
        // --- 4. STAGE CONVICTION GOLD ---
        // Soaring cathedral spotlight cone from ceiling
        vec2 spotOrigin = vec2(0.0, 0.70);
        vec2 dSpot = p - spotOrigin;
        float coneSpread = 0.18 + (spotOrigin.y - p.y) * 0.52;
        float inCone = smoothstep(coneSpread, coneSpread - 0.10, abs(dSpot.x));
        float spotFalloff = exp(-length(dSpot) * 0.75);
        float spotlight = inCone * spotFalloff * (0.85 + 0.65 * u_conviction);

        // Volumetric dust specks in spotlight beam
        float mote = hash12(floor(uv * 260.0) + floor(u_time * 8.0));
        float stageDust = inCone * step(0.98, mote) * 0.6;

        sceneColor += u_color_highlight * (spotlight * 0.90 + stageDust);
        sceneColor += u_color_accent * (spotlight * 0.45);
      }

      // --- Perceptual Oklab Color Space Transformation ---
      vec3 oklab = srgbToOklab(clamp(sceneColor, 0.0, 1.0));

      // Sigmoidal S-Curve Contrast on Lightness L
      oklab.x = sigmoidalContrast(oklab.x, u_k_curve);

      // Smart Chroma Vibrance Boost modulated by profile & u_conviction
      float chromaFactor = u_chroma_boost * (1.0 + 0.25 * u_conviction);
      oklab.y *= chromaFactor;
      oklab.z *= chromaFactor;

      // Subtle Analog Film Grain in Oklab Lightness (anti-banding)
      float grainTime = fract(u_time * 23.41);
      float grain = (hash12(gl_FragCoord.xy * 0.5 + grainTime * 100.0) - 0.5) * u_grain_intensity;
      oklab.x = clamp(oklab.x + grain * (0.6 + 0.4 * (1.0 - oklab.x)), 0.0, 1.0);

      // Negative Space Expansion: deepens emotional void at outer edges
      float distCenter = length(p);
      float negMask = mix(1.0, 1.0 - smoothstep(0.35, 1.1, distCenter), u_negativeSpace);
      oklab.x *= mix(1.0, negMask, 0.40);

      // Soft Edge Vignette
      float vig = smoothstep(1.35, 0.35, distCenter * (u_vignette_strength * 1.4 + 0.2));
      oklab.x *= vig;

      // Convert back to standard sRGB
      vec3 finalRgb = oklabToSrgb(oklab);
      gl_FragColor = vec4(clamp(finalRgb, 0.0, 1.0), 1.0);
    }
  `;

  // =========================================================================
  // SECTION 4: WEBGL SHADER PIPELINE & COMPOSITOR ENGINE
  // =========================================================================

  class WebGLCompositorEngine {
    constructor() {
      this.width = 1920;
      this.height = 1080;

      // Canvas references
      this._glCanvas = null;
      this._compositeCanvas = null;
      this._gl = null;
      this._glCtx2D = null; // Fallback 2D context for glCanvas if WebGL is unavailable
      this._compositeCtx = null;

      // Shader pipeline state
      this._program = null;
      this._quadBuffer = null;
      this._uniforms = {};
      this._isWebGL2 = false;
      this._isInitialized = false;

      // Active state
      this._activeProfileKey = 'moonlit_confession';

      // Recorder state
      this._mediaRecorder = null;
      this._recordedChunks = [];
      this._isRecording = false;
      this._recordingStartTime = 0;
      this._selectedMime = '';
      this._onStatusChange = null;

      // Context lost handler
      this._onContextLost = this._handleContextLost.bind(this);
      this._onContextRestored = this._handleContextRestored.bind(this);
    }

    /**
     * Initializes the WebGL shader pipeline and dual-canvas configuration.
     * Gracefully falls back to 2D canvas gradients if WebGL context is not supported.
     *
     * @param {HTMLCanvasElement} glCanvas - Canvas for WebGL background rendering (1920x1080)
     * @param {HTMLCanvasElement} compositeCanvas - Master canvas for layered output (1920x1080)
     * @param {Object} [options] - Configuration options
     * @returns {Object} Initialization summary { success, mode, error }
     */
    init(glCanvas, compositeCanvas, options = {}) {
      if (!glCanvas || !compositeCanvas) {
        throw new Error('[DoradoStudio.WebGLCompositor] Both glCanvas and compositeCanvas are required.');
      }

      this._glCanvas = glCanvas;
      this._compositeCanvas = compositeCanvas;

      this.width = options.width || 1920;
      this.height = options.height || 1080;

      this._glCanvas.width = this.width;
      this._glCanvas.height = this.height;
      this._compositeCanvas.width = this.width;
      this._compositeCanvas.height = this.height;

      this._compositeCtx = this._compositeCanvas.getContext('2d', { alpha: false });

      // Attempt WebGL 2.0 -> WebGL 1.0 -> 2D Canvas Fallback
      let gl = null;
      const glAttribs = {
        alpha: false,
        depth: false,
        stencil: false,
        antialias: false,
        premultipliedAlpha: false,
        preserveDrawingBuffer: true
      };

      try {
        gl = glCanvas.getContext('webgl2', glAttribs);
        if (gl && typeof gl.createShader === 'function') {
          this._isWebGL2 = true;
        } else {
          gl = glCanvas.getContext('webgl', glAttribs) || glCanvas.getContext('experimental-webgl', glAttribs);
          this._isWebGL2 = false;
        }
      } catch (e) {
        console.warn('[DoradoStudio.WebGLCompositor] WebGL context acquisition threw exception:', e);
        gl = null;
      }

      if (gl && typeof gl.createShader === 'function') {
        try {
          this._gl = gl;
          this._initWebGL(gl);
          this._isInitialized = true;
          return {
            success: true,
            mode: this._isWebGL2 ? 'webgl2' : 'webgl',
            width: this.width,
            height: this.height
          };
        } catch (initErr) {
          console.warn('[DoradoStudio.WebGLCompositor] WebGL pipeline initialization failed, falling back to 2D Canvas:', initErr);
          this._gl = null;
          this._program = null;
          this._quadBuffer = null;
        }
      }

      // Headless / Software 2D Canvas Fallback
      console.info('[DoradoStudio.WebGLCompositor] WebGL unavailable or initialization failed. Initializing high-fidelity 2D Canvas fallback.');
      try {
        this._glCtx2D = this._glCanvas.getContext('2d');
      } catch (fallbackErr) {
        console.warn('[DoradoStudio.WebGLCompositor] Could not get 2D context on glCanvas:', fallbackErr);
      }

      this._isInitialized = true;
      return {
        success: true,
        mode: 'canvas2d_fallback',
        width: this.width,
        height: this.height
      };
    }

    /**
     * Compiles WebGL shaders, creates buffers, and caches uniform locations.
     * @private
     */
    _initWebGL(gl) {
      this._glCanvas.addEventListener('webglcontextlost', this._onContextLost, false);
      this._glCanvas.addEventListener('webglcontextrestored', this._onContextRestored, false);

      const vertShader = this._compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
      const fragShader = this._compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);

      const program = gl.createProgram();
      gl.attachShader(program, vertShader);
      gl.attachShader(program, fragShader);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const info = gl.getProgramInfoLog(program);
        gl.deleteProgram(program);
        throw new Error('[DoradoStudio.WebGLCompositor] Shader program link failed: ' + info);
      }

      this._program = program;
      gl.useProgram(program);

      // Create fullscreen quad buffer [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]
      const quadVertices = new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
         1.0,  1.0
      ]);

      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);
      this._quadBuffer = buffer;

      const aPos = gl.getAttribLocation(program, 'a_position');
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      // Cache uniform locations
      const uniformNames = [
        'u_resolution',
        'u_time',
        'u_scene_progress',
        'u_bass',
        'u_vocal',
        'u_conviction',
        'u_negativeSpace',
        'u_k_curve',
        'u_chroma_boost',
        'u_vignette_strength',
        'u_grain_intensity',
        'u_color_base1',
        'u_color_base2',
        'u_color_highlight',
        'u_color_accent',
        'u_profile_index'
      ];

      this._uniforms = {};
      for (const name of uniformNames) {
        this._uniforms[name] = gl.getUniformLocation(program, name);
      }

      gl.viewport(0, 0, this.width, this.height);
    }

    _compileShader(gl, type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const info = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error('[DoradoStudio.WebGLCompositor] Shader compilation error: ' + info);
      }
      return shader;
    }

    _handleContextLost(e) {
      e.preventDefault();
      console.warn('[DoradoStudio.WebGLCompositor] WebGL context lost.');
    }

    _handleContextRestored() {
      console.info('[DoradoStudio.WebGLCompositor] WebGL context restored. Recompiling shaders.');
      if (this._gl) {
        this._initWebGL(this._gl);
      }
    }

    /**
     * Master dual-canvas render pass.
     * Step 1: Render WebGL SDF & Oklab background onto glCanvas (1920x1080).
     * Step 2: Copy glCanvas onto compositeCanvas.
     * Step 3: Layer Code-SVG vector motion & kinetic lyrics via SVGMotion.
     * Step 4: Optional cinematic letterbox bars and subtle vignette.
     *
     * @param {Object} scene - Current scene data
     * @param {number} localProgress - Normalized progress within current scene [0.0, 1.0]
     * @param {number} globalTime - Absolute playback time in seconds
     * @param {Object} audioTelemetry - Realtime audio telemetry { bass, vocal, conviction, negativeSpace, ... }
     * @param {Object} [options] - Render options { letterbox, vignette, profileOverride }
     * @returns {HTMLCanvasElement} Master composite canvas
     */
    renderFrame(scene, localProgress = 0, globalTime = 0, audioTelemetry = {}, options = {}) {
      if (!this._isInitialized) {
        console.warn('[DoradoStudio.WebGLCompositor] renderFrame called before init.');
        return this._compositeCanvas;
      }

      // Support options-object invocation: renderFrame({ scene, timeSec, progress01, audioRMS, frequencyData, convictionLevel, options })
      if (scene && typeof scene === 'object' && scene.scene !== undefined) {
        const params = scene;
        scene = params.scene;
        localProgress = params.progress01 !== undefined ? params.progress01 : (params.localProgress || 0);
        globalTime = params.timeSec !== undefined ? params.timeSec : (params.globalTime || 0);
        audioTelemetry = {
          energy: params.audioRMS || 0,
          bass: (params.frequencyData && params.frequencyData[2] / 255) || (params.audioRMS || 0.1),
          conviction: params.convictionLevel || (scene && scene.convictionLevel) || 0.5,
          ...(params.telemetry || {})
        };
        options = params.options || {};
      }

      // Defensive audio telemetry defaults
      const telemetry = {
        bass: 0.0,
        vocal: 0.0,
        conviction: 0.0,
        negativeSpace: 0.5,
        energy: 0.0,
        ...(audioTelemetry || {})
      };

      // Resolve profile
      const requestedKey = options.profileOverride ||
        (scene && (scene.oklabProfile || scene.oklabPalette || scene.visualProfile || scene.profile)) ||
        this._activeProfileKey ||
        'moonlit_confession';

      const profile = this.getProfile(requestedKey);

      // STEP 1: Render shader on glCanvas
      if (this._gl && this._program) {
        this._renderWebGL(scene, localProgress, globalTime, telemetry, profile);
      } else if (this._glCtx2D) {
        this._render2DFallback(this._glCtx2D, this.width, this.height, scene, localProgress, globalTime, telemetry, profile);
      }

      // STEP 2: Copy glCanvas onto compositeCanvas (2D context)
      const ctx = this._compositeCtx;
      if (ctx) {
        ctx.clearRect(0, 0, this.width, this.height);
        if (this._glCanvas) {
          ctx.drawImage(this._glCanvas, 0, 0, this.width, this.height);
        }

        // STEP 3: Layer Code-SVG vector motion & kinetic lyrics
        if (window.DoradoStudio && window.DoradoStudio.SVGMotion && typeof window.DoradoStudio.SVGMotion.drawVectorSceneToCanvas === 'function') {
          try {
            window.DoradoStudio.SVGMotion.drawVectorSceneToCanvas(
              ctx,
              scene,
              localProgress,
              globalTime,
              telemetry,
              this.width,
              this.height,
              options
            );
          } catch (svgErr) {
            console.warn('[DoradoStudio.WebGLCompositor] SVGMotion.drawVectorSceneToCanvas error:', svgErr);
          }
        }

        // STEP 4: Optional cinematic letterbox bars (2.39:1 scope) & subtle vignette
        const applyLetterbox = (options.letterbox !== undefined) ? options.letterbox : true;
        if (applyLetterbox) {
          // 2.39:1 anamorphic cinematic scope on 16:9 canvas
          // Height for 2.39:1 on 1920 width = ~803.3px
          // Top & bottom bar heights = (1080 - 803) / 2 ≈ 138px
          const barHeight = Math.round((this.height - (this.width / 2.39)) / 2);
          if (barHeight > 0) {
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, this.width, barHeight);
            ctx.fillRect(0, this.height - barHeight, this.width, barHeight);
          }
        }

        if (options.vignette) {
          const vigGrad = ctx.createRadialGradient(
            this.width * 0.5, this.height * 0.5, this.width * 0.25,
            this.width * 0.5, this.height * 0.5, this.width * 0.68
          );
          vigGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
          vigGrad.addColorStop(1, `rgba(0, 0, 0, ${profile.vignetteStrength || 0.45})`);
          ctx.fillStyle = vigGrad;
          ctx.fillRect(0, 0, this.width, this.height);
        }
      }

      return this._compositeCanvas;
    }

    /**
     * Executes WebGL draw pass.
     * @private
     */
    _renderWebGL(scene, localProgress, globalTime, telemetry, profile) {
      const gl = this._gl;
      gl.useProgram(this._program);
      gl.viewport(0, 0, this.width, this.height);

      const u = this._uniforms;

      if (u.u_resolution) gl.uniform2f(u.u_resolution, this.width, this.height);
      if (u.u_time) gl.uniform1f(u.u_time, globalTime);
      if (u.u_scene_progress) gl.uniform1f(u.u_scene_progress, localProgress);

      // Audio Telemetry
      if (u.u_bass) gl.uniform1f(u.u_bass, telemetry.bass);
      if (u.u_vocal) gl.uniform1f(u.u_vocal, telemetry.vocal);
      if (u.u_conviction) gl.uniform1f(u.u_conviction, telemetry.conviction);
      if (u.u_negativeSpace) gl.uniform1f(u.u_negativeSpace, telemetry.negativeSpace);

      // Color Profile Uniforms
      if (u.u_k_curve) gl.uniform1f(u.u_k_curve, profile.kCurve);
      if (u.u_chroma_boost) gl.uniform1f(u.u_chroma_boost, profile.chromaBoost);
      if (u.u_vignette_strength) gl.uniform1f(u.u_vignette_strength, profile.vignetteStrength);
      if (u.u_grain_intensity) gl.uniform1f(u.u_grain_intensity, profile.grainIntensity);
      if (u.u_profile_index) gl.uniform1f(u.u_profile_index, profile.profileIndex);

      if (u.u_color_base1) gl.uniform3fv(u.u_color_base1, profile.baseColor1);
      if (u.u_color_base2) gl.uniform3fv(u.u_color_base2, profile.baseColor2);
      if (u.u_color_highlight) gl.uniform3fv(u.u_color_highlight, profile.highlightColor);
      if (u.u_color_accent) gl.uniform3fv(u.u_color_accent, profile.accentColor);

      gl.bindBuffer(gl.ARRAY_BUFFER, this._quadBuffer);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    /**
     * 2D Canvas Fallback renderer if WebGL is disabled or unavailable in headless environments.
     * @private
     */
    _render2DFallback(ctx, w, h, scene, localProgress, globalTime, telemetry, profile) {
      ctx.save();

      // Convert profile RGB arrays to CSS strings
      const toCssRgb = (arr) => `rgb(${Math.round(arr[0] * 255)}, ${Math.round(arr[1] * 255)}, ${Math.round(arr[2] * 255)})`;
      const cBase1 = toCssRgb(profile.baseColor1);
      const cBase2 = toCssRgb(profile.baseColor2);
      const cHigh = toCssRgb(profile.highlightColor);
      const cAcc = toCssRgb(profile.accentColor);

      // Base gradient
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, cBase2);
      grad.addColorStop(1, cBase1);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Profile-specific 2D atmospheric simulation
      if (profile.profileIndex === 0.0) {
        // Moonlit Confession: Silver moon in upper right
        const moonX = w * 0.68;
        const moonY = h * 0.28;
        const moonRad = 120 + 20 * telemetry.vocal;
        const moonGlow = ctx.createRadialGradient(moonX, moonY, 10, moonX, moonY, moonRad * 2.5);
        moonGlow.addColorStop(0, cHigh);
        moonGlow.addColorStop(0.35, cAcc);
        moonGlow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = moonGlow;
        ctx.beginPath();
        ctx.arc(moonX, moonY, moonRad * 2.5, 0, Math.PI * 2);
        ctx.fill();
      } else if (profile.profileIndex === 1.0) {
        // Whale Bioluminescence: Floating starlight & teal aura
        const cx = w * 0.5 + Math.sin(globalTime * 0.5) * 80;
        const cy = h * 0.55 + Math.cos(globalTime * 0.4) * 40;
        const aura = ctx.createRadialGradient(cx, cy, 30, cx, cy, 450 + 80 * telemetry.bass);
        aura.addColorStop(0, cHigh);
        aura.addColorStop(0.4, cAcc);
        aura.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(cx, cy, 500, 0, Math.PI * 2);
        ctx.fill();
      } else if (profile.profileIndex === 2.0) {
        // Acoustic Parchment: Diagonal golden sunbeam
        ctx.save();
        ctx.translate(w * 0.4, h * 0.3);
        ctx.rotate(0.35);
        const beamGrad = ctx.createLinearGradient(-150, 0, 150, 0);
        beamGrad.addColorStop(0, 'rgba(0,0,0,0)');
        beamGrad.addColorStop(0.5, cAcc);
        beamGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = beamGrad;
        ctx.globalAlpha = 0.35 + 0.25 * telemetry.vocal;
        ctx.fillRect(-150, -h, 300, h * 2);
        ctx.restore();
      } else if (profile.profileIndex === 3.0) {
        // Seoul Dusk Purple: Twilight horizon + amber bokeh
        const horizonGrad = ctx.createLinearGradient(0, h * 0.4, 0, h);
        horizonGrad.addColorStop(0, 'rgba(0,0,0,0)');
        horizonGrad.addColorStop(0.5, cAcc);
        horizonGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = horizonGrad;
        ctx.globalAlpha = 0.45;
        ctx.fillRect(0, 0, w, h);

        // Bokeh orbs
        ctx.globalAlpha = 0.6;
        for (let i = 0; i < 4; i++) {
          const bx = (w * 0.25 * i + Math.sin(globalTime + i) * 60) % w;
          const by = h * 0.5 + Math.cos(globalTime * 0.8 + i) * 100;
          ctx.fillStyle = cHigh;
          ctx.beginPath();
          ctx.arc(bx, by, 35 + 15 * telemetry.bass, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // Stage Conviction Gold: Spotlight cone
        const spotX = w * 0.5;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(spotX, 0);
        ctx.lineTo(spotX - 350 - 100 * telemetry.conviction, h);
        ctx.lineTo(spotX + 350 + 100 * telemetry.conviction, h);
        ctx.closePath();
        const spotGrad = ctx.createLinearGradient(spotX, 0, spotX, h);
        spotGrad.addColorStop(0, cHigh);
        spotGrad.addColorStop(0.7, cAcc);
        spotGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = spotGrad;
        ctx.globalAlpha = 0.55 + 0.35 * telemetry.conviction;
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();
    }

    // =======================================================================
    // SECTION 5: HIGH-BITRATE BROWSER VIDEO RECORDER
    // =======================================================================

    /**
     * Starts recording the master composite canvas at 16 Mbps high-bitrate broadcast quality.
     * Merges audio tracks from audioStream if available.
     *
     * @param {MediaStream|Object} [audioStream] - Web Audio stream or destination node
     * @param {Function} [onStatusChange] - Callback for recording events { status, elapsedSeconds, ... }
     * @returns {Object} { started: boolean, mimeType: string, hasAudio: boolean }
     */
    startRecording(audioStream = null, onStatusChange = null) {
      if (this._isRecording) {
        console.warn('[DoradoStudio.WebGLCompositor] Recording is already in progress.');
        return { started: false, error: 'already_recording' };
      }

      if (!this._compositeCanvas) {
        throw new Error('[DoradoStudio.WebGLCompositor] Composite canvas not initialized. Call init() first.');
      }

      // Check captureStream support
      const canvas = this._compositeCanvas;
      if (typeof canvas.captureStream !== 'function' && typeof canvas.mozCaptureStream !== 'function') {
        const err = 'HTMLCanvasElement.captureStream() is not supported in this browser environment.';
        console.warn('[DoradoStudio.WebGLCompositor]', err);
        if (typeof onStatusChange === 'function') {
          onStatusChange({ status: 'error', error: err });
        }
        return { started: false, error: err };
      }

      const canvasStream = typeof canvas.captureStream === 'function'
        ? canvas.captureStream(60)
        : canvas.mozCaptureStream(60);

      // Merge audio track if provided
      let combinedStream = canvasStream;
      let hasAudio = false;

      if (audioStream) {
        try {
          let audioTracks = [];
          if (typeof audioStream.getAudioTracks === 'function') {
            audioTracks = audioStream.getAudioTracks();
          } else if (audioStream.stream && typeof audioStream.stream.getAudioTracks === 'function') {
            audioTracks = audioStream.stream.getAudioTracks();
          }

          if (audioTracks && audioTracks.length > 0) {
            const tracks = [...canvasStream.getVideoTracks(), ...audioTracks];
            combinedStream = new MediaStream(tracks);
            hasAudio = true;
          }
        } catch (audioErr) {
          console.warn('[DoradoStudio.WebGLCompositor] Audio track merge warning:', audioErr);
        }
      }

      // Select optimal container/codec format
      const preferredMimes = [
        'video/mp4;codecs=avc1.42E01E,mp4a.40.2',
        'video/mp4;codecs=avc1',
        'video/mp4',
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm'
      ];

      let selectedMime = '';
      if (typeof MediaRecorder !== 'undefined' && typeof MediaRecorder.isTypeSupported === 'function') {
        for (const mime of preferredMimes) {
          if (MediaRecorder.isTypeSupported(mime)) {
            selectedMime = mime;
            break;
          }
        }
      }

      const recorderOptions = {
        videoBitsPerSecond: 16000000 // 16 Mbps Broadcast Master Quality
      };
      if (selectedMime) {
        recorderOptions.mimeType = selectedMime;
      }

      this._recordedChunks = [];
      this._recordingStartTime = performance.now();
      this._onStatusChange = onStatusChange;
      this._selectedMime = selectedMime || 'video/webm';

      try {
        this._mediaRecorder = new MediaRecorder(combinedStream, recorderOptions);
      } catch (e1) {
        console.warn('[DoradoStudio.WebGLCompositor] MediaRecorder options rejected, trying default:', e1);
        try {
          this._mediaRecorder = new MediaRecorder(combinedStream);
          this._selectedMime = this._mediaRecorder.mimeType || 'video/webm';
        } catch (e2) {
          if (typeof onStatusChange === 'function') {
            onStatusChange({ status: 'error', error: e2.message });
          }
          return { started: false, error: e2.message };
        }
      }

      this._mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this._recordedChunks.push(event.data);
          if (typeof this._onStatusChange === 'function') {
            const elapsed = (performance.now() - this._recordingStartTime) / 1000;
            this._onStatusChange({
              status: 'recording',
              elapsedSeconds: elapsed,
              chunksCount: this._recordedChunks.length,
              mimeType: this._selectedMime,
              hasAudio
            });
          }
        }
      };

      this._isRecording = true;
      this._mediaRecorder.start(100); // 100ms slices for smooth memory streaming

      if (typeof onStatusChange === 'function') {
        onStatusChange({
          status: 'started',
          mimeType: this._selectedMime,
          bitrate: recorderOptions.videoBitsPerSecond,
          hasAudio
        });
      }

      return { started: true, mimeType: this._selectedMime, hasAudio };
    }

    /**
     * Stops the active video recording, creates the final Blob, automatically initiates
     * browser file download, and resolves with the recording metrics and Blob URL.
     *
     * @returns {Promise<Object|null>} Recording artifact { blob, url, filename, duration, size, mimeType }
     */
    stopRecording() {
      if (!this._isRecording || !this._mediaRecorder) {
        console.warn('[DoradoStudio.WebGLCompositor] No active recording to stop.');
        return Promise.resolve(null);
      }

      return new Promise((resolve) => {
        const recorder = this._mediaRecorder;
        const startTime = this._recordingStartTime;
        const selectedMime = this._selectedMime;
        const chunks = this._recordedChunks;

        recorder.onstop = () => {
          const elapsed = (performance.now() - startTime) / 1000;
          const blob = new Blob(chunks, { type: selectedMime });
          const blobUrl = URL.createObjectURL(blob);

          const isMp4 = selectedMime.includes('mp4');
          const ext = isMp4 ? 'mp4' : 'webm';
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          const filename = `gwyn_dorado_mv_${timestamp}.${ext}`;

          // Automatically trigger browser file download
          if (typeof document !== 'undefined' && document.createElement) {
            try {
              const downloadLink = document.createElement('a');
              downloadLink.href = blobUrl;
              downloadLink.download = filename;
              downloadLink.style.display = 'none';
              document.body.appendChild(downloadLink);
              downloadLink.click();
              setTimeout(() => {
                if (downloadLink.parentNode) {
                  downloadLink.parentNode.removeChild(downloadLink);
                }
              }, 400);
            } catch (downloadErr) {
              console.warn('[DoradoStudio.WebGLCompositor] Auto-download trigger notice:', downloadErr);
            }
          }

          const result = {
            blob,
            url: blobUrl,
            filename,
            duration: elapsed,
            size: blob.size,
            mimeType: selectedMime
          };

          if (typeof this._onStatusChange === 'function') {
            this._onStatusChange({
              status: 'stopped',
              ...result
            });
          }

          this._isRecording = false;
          this._mediaRecorder = null;
          this._recordingStartTime = 0;

          resolve(result);
        };

        recorder.stop();
      });
    }

    isRecording() {
      return this._isRecording;
    }

    getRecordingState() {
      return {
        isRecording: this._isRecording,
        elapsedSeconds: this._isRecording ? (performance.now() - this._recordingStartTime) / 1000 : 0,
        chunksCount: this._recordedChunks.length,
        mimeType: this._selectedMime
      };
    }

    // =======================================================================
    // SECTION 6: PROFILE MANAGEMENT & RESIZING
    // =======================================================================

    getProfiles() {
      return OKLAB_PROFILES;
    }

    getProfile(key) {
      if (!key) return OKLAB_PROFILES.moonlit_confession;
      const normalized = String(key).toLowerCase().trim();
      const resolvedKey = PROFILE_ALIASES[normalized] || normalized;
      return OKLAB_PROFILES[resolvedKey] || OKLAB_PROFILES.moonlit_confession;
    }

    setProfile(key) {
      const p = this.getProfile(key);
      this._activeProfileKey = p.id;
      return p;
    }

    getActiveProfile() {
      return this.getProfile(this._activeProfileKey);
    }

    resize(width = 1920, height = 1080) {
      this.width = width;
      this.height = height;

      if (this._glCanvas) {
        this._glCanvas.width = width;
        this._glCanvas.height = height;
      }
      if (this._compositeCanvas) {
        this._compositeCanvas.width = width;
        this._compositeCanvas.height = height;
      }
      if (this._gl) {
        this._gl.viewport(0, 0, width, height);
      }
    }

    destroy() {
      if (this._isRecording) {
        try { this._mediaRecorder.stop(); } catch (e) {}
      }
      if (this._gl && this._program) {
        try {
          this._gl.deleteProgram(this._program);
          this._gl.deleteBuffer(this._quadBuffer);
        } catch (e) {}
      }
      if (this._glCanvas) {
        this._glCanvas.removeEventListener('webglcontextlost', this._onContextLost);
        this._glCanvas.removeEventListener('webglcontextrestored', this._onContextRestored);
      }
      this._isInitialized = false;
      this._gl = null;
      this._glCtx2D = null;
      this._compositeCtx = null;
    }
  }

  // Create singleton instance
  const instance = new WebGLCompositorEngine();

  // Attach to window.DoradoStudio
  window.DoradoStudio.WebGLCompositor = instance;
  window.DoradoStudio.WebGLCompositor.OKLAB_PROFILES = OKLAB_PROFILES;
  window.DoradoStudio.WebGLCompositor.OklabMath = OklabMath;
  window.DoradoStudio.WebGLCompositor.WebGLCompositorEngine = WebGLCompositorEngine;

})();
