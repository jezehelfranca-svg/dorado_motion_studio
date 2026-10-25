/**
 * DoradoMotion Studio — Module 03: Programmatic Code-SVG Motion & Kinetic Lyric Engine
 * 
 * Provides:
 * 1. MOTIF_CATALOG: 6 Procedural Code-SVG Motifs
 *    - ink_confession: Hand-Drawn Ink Confession (Calligraphic Bezier strokes & unfolding letter)
 *    - window_rain: Window Rain & Streetlamp Bokeh (Refractive raindrops & rippling reflections)
 *    - whale_gem: Whale Gem & Starlight Origami (Morphing geometric whale & crystalline facets)
 *    - royal_lotus: Royal Moonlight & Blooming Lotus (2.5D silk-screen mountain parallax & lanterns)
 *    - acoustic_strings: Acoustic String Harmonics (Standing-wave guitar/piano strings driven by vocal FFT)
 *    - celestial_bloom: Stage-Level Conviction Bloom (Orbital light rings & golden-ratio constellation)
 * 
 * 2. PALETTES: 5 Oklab profiles
 *    - moonlit_confession, whale_bioluminescence, acoustic_parchment, seoul_dusk_purple, stage_conviction_gold
 * 
 * 3. renderSVGCode(scene, localProgress, globalTime, audioTelemetry, width, height)
 *    - Standalone animated SVG generator with semantic layers, defs, gradients, filters, Bezier paths, and kinetic typography.
 * 
 * 4. drawVectorSceneToCanvas(ctx, scene, localProgress, globalTime, audioTelemetry, width, height, options)
 *    - 60fps Canvas 2D vector compositor with 2.5D camera motions, procedural drawing, audio responsiveness, and kinetic typography.
 * 
 * 5. drawKineticLyrics(ctx, scene, localProgress, audioTelemetry, width, height)
 *    - Intimate kinetic typography engine supporting subtle ink-reveals and climactic blooming halos.
 */

(function (root) {
  'use strict';

  // =========================================================================
  // 1. MOTIF CATALOG METADATA
  // =========================================================================
  const MOTIF_CATALOG = [
    {
      id: 'ink_confession',
      name: 'Hand-Drawn Ink Confession',
      description: 'Calligraphic Bezier strokes & unfolding letter with cursive flourishes',
      symbol: '✒️',
      tags: ['confession', 'quill', 'unfolding letter', 'ink flourish', 'intimate calligraphy']
    },
    {
      id: 'window_rain',
      name: 'Window Rain & Streetlamp Bokeh',
      description: 'Refractive raindrops & rippling reflections against urban twilight',
      symbol: '🌧️',
      tags: ['rain', 'bokeh', 'refraction', 'water droplets', 'melancholy glass']
    },
    {
      id: 'whale_gem',
      name: 'Whale Gem & Starlight Origami',
      description: 'Morphing geometric whale & crystalline facets gliding through celestial deep',
      symbol: '🐋',
      tags: ['whale', 'origami', 'crystals', 'bioluminescence', 'celestial deep']
    },
    {
      id: 'royal_lotus',
      name: 'Royal Moonlight & Blooming Lotus',
      description: '2.5D silk-screen mountain parallax, reflective ripples & blooming lotus lanterns',
      symbol: '🪷',
      tags: ['lotus', 'mountains', 'lanterns', 'moonlight', 'Joseon silk aesthetic']
    },
    {
      id: 'acoustic_strings',
      name: 'Acoustic String Harmonics',
      description: 'Standing-wave guitar/piano strings driven by vocal FFT & soundboard rosette',
      symbol: '🎸',
      tags: ['strings', 'harmonics', 'standing waves', 'resonance', 'acoustic guitar']
    },
    {
      id: 'celestial_bloom',
      name: 'Stage-Level Conviction Bloom',
      description: 'Orbital light rings & golden-ratio constellation radiating vocal power',
      symbol: '✨',
      tags: ['climax', 'orbital rings', 'sacred geometry', 'golden ratio', 'stage conviction']
    }
  ];

  // =========================================================================
  // 2. PALETTES DICTIONARY (5 OKLAB-TUNED COLOR SCHEMES)
  // =========================================================================
  const PALETTES = {
    moonlit_confession: {
      id: 'moonlit_confession',
      name: 'Moonlit Confession',
      bgTop: '#0a0e1a',
      bgBottom: '#161f38',
      primaryStroke: '#9ec3f7',
      secondaryStroke: '#5473a8',
      accentGlow: '#c5e0ff',
      textPrimary: '#f0f6ff',
      textSecondary: '#93aed4',
      overlayTint: 'rgba(158, 195, 247, 0.12)'
    },
    whale_bioluminescence: {
      id: 'whale_bioluminescence',
      name: 'Whale Bioluminescence',
      bgTop: '#041219',
      bgBottom: '#0c2836',
      primaryStroke: '#38efbf',
      secondaryStroke: '#198c8c',
      accentGlow: '#5affda',
      textPrimary: '#e8fffa',
      textSecondary: '#72c0b4',
      overlayTint: 'rgba(56, 239, 191, 0.12)'
    },
    acoustic_parchment: {
      id: 'acoustic_parchment',
      name: 'Acoustic Parchment',
      bgTop: '#18120c',
      bgBottom: '#2b2016',
      primaryStroke: '#e4b873',
      secondaryStroke: '#9c7746',
      accentGlow: '#ffd48f',
      textPrimary: '#fff6e5',
      textSecondary: '#bda382',
      overlayTint: 'rgba(228, 184, 115, 0.12)'
    },
    seoul_dusk_purple: {
      id: 'seoul_dusk_purple',
      name: 'Seoul Dusk Purple',
      bgTop: '#120a1c',
      bgBottom: '#251438',
      primaryStroke: '#d678f5',
      secondaryStroke: '#7a4099',
      accentGlow: '#ff99ff',
      textPrimary: '#fcf0ff',
      textSecondary: '#b58fc9',
      overlayTint: 'rgba(214, 120, 245, 0.12)'
    },
    stage_conviction_gold: {
      id: 'stage_conviction_gold',
      name: 'Stage Conviction Gold',
      bgTop: '#1a1406',
      bgBottom: '#332408',
      primaryStroke: '#fcd34d',
      secondaryStroke: '#a17316',
      accentGlow: '#fff1a8',
      textPrimary: '#fffdf5',
      textSecondary: '#deb86e',
      overlayTint: 'rgba(252, 211, 77, 0.14)'
    }
  };

  // Default fallback palette
  const DEFAULT_PALETTE = PALETTES.moonlit_confession;

  // =========================================================================
  // 3. MATHEMATICAL HELPERS & EASING
  // =========================================================================
  function clamp(val, min = 0, max = 1) {
    return Math.max(min, Math.min(max, val));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function smoothstep(min, max, value) {
    const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
    return x * x * (3 - 2 * x);
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  function hexToRgba(hex, alpha = 1) {
    if (!hex || typeof hex !== 'string') return `rgba(255, 255, 255, ${alpha})`;
    let cleanHex = hex.replace('#', '');
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split('').map(c => c + c).join('');
    }
    const num = parseInt(cleanHex, 16);
    if (isNaN(num)) return `rgba(255, 255, 255, ${alpha})`;
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function sanitizeTelemetry(telemetry) {
    const t = telemetry || {};
    return {
      bass: typeof t.bass === 'number' ? clamp(t.bass, 0, 1) : 0.0,
      vocalPresence: typeof t.vocalPresence === 'number' ? clamp(t.vocalPresence, 0, 1) : 0.0,
      treble: typeof t.treble === 'number' ? clamp(t.treble, 0, 1) : 0.0,
      rms: typeof t.rms === 'number' ? clamp(t.rms, 0, 1) : 0.0,
      energy: typeof t.energy === 'number' ? clamp(t.energy, 0, 1) : 0.0,
      isBeat: Boolean(t.isBeat)
    };
  }

  function getPalette(paletteKey) {
    if (typeof paletteKey === 'object' && paletteKey !== null) {
      return Object.assign({}, DEFAULT_PALETTE, paletteKey);
    }
    return PALETTES[paletteKey] || DEFAULT_PALETTE;
  }

  // =========================================================================
  // 4. PROCEDURAL CAMERA MOTION (2.5D CAMERA SYSTEM)
  // =========================================================================
  function computeCameraTransform(cameraMotion, localProgress, globalTime, audioTelemetry, width, height) {
    const cx = width / 2;
    const cy = height / 2;
    let dx = 0;
    let dy = 0;
    let scale = 1.0;
    let rotate = 0.0;

    const mode = cameraMotion || 'slow_breathe';
    const beatKick = audioTelemetry.isBeat ? 0.015 : 0.0;
    const vocalSwell = audioTelemetry.vocalPresence * 0.02;

    switch (mode) {
      case 'slow_breathe': {
        const cycle = Math.sin(globalTime * 0.8);
        scale = 1.0 + 0.035 * cycle + beatKick + vocalSwell;
        dy = 12 * Math.sin(globalTime * 0.6);
        dx = 6 * Math.cos(globalTime * 0.4);
        rotate = 0.003 * Math.sin(globalTime * 0.5);
        break;
      }
      case 'gentle_drift_right': {
        const t = easeInOutQuad(localProgress);
        dx = lerp(-60, 60, t);
        dy = 8 * Math.sin(globalTime * 0.7);
        scale = 1.02 + 0.02 * localProgress + vocalSwell;
        rotate = -0.008 + 0.016 * localProgress;
        break;
      }
      case 'parallax_rise': {
        const t = easeOutCubic(localProgress);
        dy = lerp(45, -55, t);
        scale = 1.0 + 0.04 * t + beatKick;
        rotate = 0.002 * Math.sin(globalTime * 1.2);
        break;
      }
      case 'orbital_bloom': {
        const t = localProgress;
        scale = 1.0 + 0.08 * t + 0.04 * audioTelemetry.vocalPresence + beatKick;
        rotate = (t - 0.5) * 0.07;
        dx = 15 * Math.sin(globalTime * 0.5);
        dy = 10 * Math.cos(globalTime * 0.5);
        break;
      }
      case 'fade_still':
      default: {
        scale = 1.0 + 0.005 * Math.sin(globalTime * 0.5) + beatKick;
        dx = 0;
        dy = 0;
        rotate = 0;
        break;
      }
    }

    return { cx, cy, dx, dy, scale, rotate };
  }

  // =========================================================================
  // 5. KINETIC TYPOGRAPHY ENGINE (CANVAS & SVG)
  // =========================================================================
  /**
   * Intimate Kinetic Typography:
   * - In sparse scenes (convictionLevel < 0.55): Places lyrics in lower-left or upper-right negative space
   *   using an intimate italic serif font, with progressive ink-reveal alpha fade and subtle quill underline.
   * - In blooming/climax scenes (convictionLevel >= 0.55): Centers lyrics in lower-third with expanding letter-spacing
   *   and soft luminous halo synced to vocalPresence.
   * - Displays both scene.lyricEn (primary) and scene.lyricOriginal (delicate subtitle).
   */
  function drawKineticLyrics(ctx, scene, localProgress, audioTelemetry, width = 1920, height = 1080) {
    if (!scene) return;
    const lyricEn = scene.lyricEn || '';
    const lyricOriginal = scene.lyricOriginal || '';
    if (!lyricEn && !lyricOriginal) return;

    const palette = getPalette(scene.palette);
    const conviction = typeof scene.convictionLevel === 'number' ? scene.convictionLevel : 0.5;
    const tel = sanitizeTelemetry(audioTelemetry);
    const isClimax = conviction >= 0.55;

    // Time-based reveal alpha
    // Enter smoothly between 0.05 and 0.25, persist, then gentle exit after 0.90
    let textAlpha = 1.0;
    if (localProgress < 0.25) {
      textAlpha = smoothstep(0.04, 0.25, localProgress);
    } else if (localProgress > 0.88) {
      textAlpha = 1.0 - smoothstep(0.88, 0.98, localProgress);
    }

    if (textAlpha <= 0.001) return;

    ctx.save();

    if (!isClimax) {
      // -------------------------------------------------------------
      // SPARSE & INTIMATE MODE (Quiet Confession, Georgia/Playfair Italic)
      // -------------------------------------------------------------
      const posX = width * 0.085;
      const posY = height * 0.84;
      const maxTextWidth = width * 0.65;

      // 1. Delicate Subtitle (Original Korean / Native Lyric) above English
      if (lyricOriginal) {
        ctx.save();
        ctx.font = '300 20px "Noto Serif KR", "Nanum Myeongjo", Georgia, serif';
        ctx.fillStyle = hexToRgba(palette.textSecondary, textAlpha * 0.78);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
        ctx.shadowBlur = 6;
        ctx.fillText(lyricOriginal, posX, posY - 44);
        ctx.restore();
      }

      // 2. Main English Lyric (Intimate Italic Serif)
      ctx.save();
      const fontSize = Math.round(width * 0.021); // ~40px at 1920
      ctx.font = `italic 400 ${fontSize}px "Playfair Display", Georgia, "Times New Roman", serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = hexToRgba(palette.textPrimary, textAlpha * 0.95);
      ctx.shadowColor = hexToRgba(palette.accentGlow, 0.35 * textAlpha);
      ctx.shadowBlur = 10;

      // Character-by-character ink reveal
      const chars = lyricEn.split('');
      const charProgress = clamp((localProgress - 0.05) / 0.40, 0, 1);
      const visibleCharCount = Math.floor(chars.length * charProgress);
      const partialFraction = (chars.length * charProgress) - visibleCharCount;

      let currentX = posX;
      for (let i = 0; i < chars.length; i++) {
        let chAlpha = 0;
        if (i < visibleCharCount) {
          chAlpha = textAlpha;
        } else if (i === visibleCharCount) {
          chAlpha = textAlpha * partialFraction;
        } else {
          chAlpha = 0;
        }

        if (chAlpha > 0) {
          ctx.fillStyle = hexToRgba(palette.textPrimary, chAlpha);
          ctx.fillText(chars[i], currentX, posY);
        }
        currentX += ctx.measureText(chars[i]).width;
      }
      ctx.restore();

      // 3. Subtle Calligraphic Quill Underline
      const measuredTotal = currentX - posX;
      const underlineWidth = Math.max(60, measuredTotal);
      const drawProgress = easeOutCubic(clamp((localProgress - 0.12) / 0.45, 0, 1));
      if (drawProgress > 0) {
        ctx.save();
        ctx.beginPath();
        const startX = posX;
        const endX = posX + underlineWidth * drawProgress;
        const lineY = posY + 16;
        const midX = (startX + endX) / 2;
        const curveOffset = Math.sin(drawProgress * Math.PI) * 4;

        ctx.moveTo(startX, lineY);
        ctx.quadraticCurveTo(midX, lineY + curveOffset, endX, lineY);

        ctx.strokeStyle = hexToRgba(palette.primaryStroke, textAlpha * 0.55 * drawProgress);
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.shadowColor = hexToRgba(palette.accentGlow, 0.4);
        ctx.shadowBlur = 8;
        ctx.stroke();

        // Little quill ink dot at tip
        ctx.beginPath();
        ctx.arc(endX, lineY, 2, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba(palette.accentGlow, textAlpha * 0.8 * drawProgress);
        ctx.fill();
        ctx.restore();
      }

    } else {
      // -------------------------------------------------------------
      // CLIMAX / STAGE CONVICTION MODE (Grand Centered Typography)
      // -------------------------------------------------------------
      const centerX = width / 2;
      const centerY = height * 0.81;

      // Vocal Presence dynamic swelling
      const vocalPulse = tel.vocalPresence * 18;
      const glowBlur = 18 + vocalPulse + (tel.isBeat ? 14 : 0);

      // 1. Delicate Subtitle above main lyric
      if (lyricOriginal) {
        ctx.save();
        ctx.font = '300 22px "Noto Serif KR", "Nanum Myeongjo", Georgia, serif';
        ctx.fillStyle = hexToRgba(palette.textSecondary, textAlpha * 0.85);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        ctx.shadowColor = hexToRgba(palette.accentGlow, 0.4);
        ctx.shadowBlur = 10;
        ctx.fillText(lyricOriginal, centerX, centerY - 52);
        ctx.restore();
      }

      // 2. Main Climax English Lyric with Expanding Letter Spacing & Luminous Halo
      ctx.save();
      const fontSize = Math.round(width * 0.026 + tel.vocalPresence * 3); // ~50px-53px
      ctx.font = `600 ${fontSize}px "Playfair Display", "Cinzel", Georgia, serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';

      // Dynamic letter-spacing expansion:
      const baseSpacing = 4 + tel.vocalPresence * 8 + (tel.isBeat ? 3 : 0);

      // Render with expanding spacing by measuring and staggering characters
      const chars = lyricEn.split('');
      const charWidths = chars.map(ch => ctx.measureText(ch).width);
      const totalWidth = charWidths.reduce((sum, w) => sum + w, 0) + (chars.length - 1) * baseSpacing;
      let startCharX = centerX - totalWidth / 2;

      // Multi-pass Luminous Halo
      // Outer glow
      ctx.shadowColor = hexToRgba(palette.accentGlow, 0.8 * textAlpha);
      ctx.shadowBlur = glowBlur;
      ctx.fillStyle = hexToRgba(palette.textPrimary, textAlpha);

      let currentX = startCharX;
      for (let i = 0; i < chars.length; i++) {
        const charW = charWidths[i];
        const drawX = currentX + charW / 2;
        ctx.fillText(chars[i], drawX, centerY);
        currentX += charW + baseSpacing;
      }

      // Second crisp pass to keep core razor sharp
      ctx.shadowBlur = 2;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      currentX = startCharX;
      for (let i = 0; i < chars.length; i++) {
        const charW = charWidths[i];
        const drawX = currentX + charW / 2;
        ctx.fillText(chars[i], drawX, centerY);
        currentX += charW + baseSpacing;
      }
      ctx.restore();

      // 3. Stage Conviction Flourish Underline (Symmetrical golden wings)
      const flourishWidth = Math.min(totalWidth * 1.15, width * 0.7);
      const wingsProgress = easeOutCubic(clamp((localProgress - 0.08) / 0.40, 0, 1));
      if (wingsProgress > 0) {
        ctx.save();
        ctx.beginPath();
        const lineY = centerY + 20;
        const halfW = (flourishWidth / 2) * wingsProgress;
        
        ctx.moveTo(centerX - halfW, lineY);
        ctx.quadraticCurveTo(centerX - halfW * 0.5, lineY + 5, centerX, lineY);
        ctx.quadraticCurveTo(centerX + halfW * 0.5, lineY + 5, centerX + halfW, lineY);

        ctx.strokeStyle = hexToRgba(palette.primaryStroke, textAlpha * 0.75 * wingsProgress);
        ctx.lineWidth = 2.0;
        ctx.shadowColor = hexToRgba(palette.accentGlow, 0.85);
        ctx.shadowBlur = 12;
        ctx.stroke();

        // Center diamond crest
        ctx.beginPath();
        const dSize = 4 + tel.vocalPresence * 2;
        ctx.moveTo(centerX, lineY - dSize);
        ctx.lineTo(centerX + dSize, lineY);
        ctx.lineTo(centerX, lineY + dSize);
        ctx.lineTo(centerX - dSize, lineY);
        ctx.closePath();
        ctx.fillStyle = hexToRgba(palette.accentGlow, textAlpha * 0.95);
        ctx.fill();
        ctx.restore();
      }
    }

    ctx.restore();
  }

  // =========================================================================
  // 6. PROCEDURAL MOTIF DRAWING ENGINES (CANVAS 2D)
  // =========================================================================

  // Helper to compute negative space focal radius
  function computeFocalRadius(scene, width, height) {
    const rawRatio = typeof scene.negativeSpaceRatio === 'number' ? scene.negativeSpaceRatio : 0.65;
    const ratio = clamp(rawRatio, 0.30, 0.90);
    const minDim = Math.min(width, height);
    // When negative space is 0.90, focal radius is small & intimate (~220px)
    // When negative space is 0.30, focal radius fills canvas (~520px)
    return minDim * 0.5 * (1.0 - ratio * 0.62);
  }

  // -------------------------------------------------------------------------
  // MOTIF 1: "ink_confession" (Hand-Drawn Ink Confession)
  // -------------------------------------------------------------------------
  function drawMotifInkConfession(ctx, scene, localProgress, globalTime, audioTelemetry, width, height, focalRadius) {
    const palette = getPalette(scene.palette);
    const tel = sanitizeTelemetry(audioTelemetry);
    const cx = width / 2;
    const cy = height * 0.46;

    ctx.save();

    // 1. Unfolding Letter / Diary Parchment Base (Isometric 2.5D)
    const foldProgress = easeInOutQuad(clamp(localProgress * 2.2, 0, 1));
    const letterW = focalRadius * 1.35;
    const letterH = focalRadius * 0.88;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(0.04 * Math.sin(globalTime * 0.7));

    // Outer subtle parchment shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
    ctx.shadowBlur = 25;
    ctx.fillStyle = hexToRgba(palette.bgBottom, 0.85);
    ctx.fillRect(-letterW / 2, -letterH / 2, letterW, letterH);

    // Parchment inner borders
    ctx.strokeStyle = hexToRgba(palette.secondaryStroke, 0.6);
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-letterW / 2 + 8, -letterH / 2 + 8, letterW - 16, letterH - 16);

    // Envelope fold lines (Triangular flaps)
    ctx.beginPath();
    // Bottom fold
    ctx.moveTo(-letterW / 2, letterH / 2);
    ctx.lineTo(0, 15);
    ctx.lineTo(letterW / 2, letterH / 2);

    // Side folds
    ctx.moveTo(-letterW / 2, -letterH / 2);
    ctx.lineTo(-letterW * 0.15, 0);
    ctx.moveTo(letterW / 2, -letterH / 2);
    ctx.lineTo(letterW * 0.15, 0);

    ctx.strokeStyle = hexToRgba(palette.primaryStroke, 0.4);
    ctx.lineWidth = 1.0;
    ctx.stroke();

    // Top unfolding flap (morphs upward as foldProgress reaches 1)
    const flapApexY = lerp(10, -letterH * 0.85, foldProgress);
    ctx.beginPath();
    ctx.moveTo(-letterW / 2, -letterH / 2);
    ctx.lineTo(0, flapApexY);
    ctx.lineTo(letterW / 2, -letterH / 2);
    ctx.strokeStyle = hexToRgba(palette.accentGlow, 0.75);
    ctx.lineWidth = 1.8;
    ctx.shadowColor = hexToRgba(palette.accentGlow, 0.6);
    ctx.shadowBlur = 12;
    ctx.stroke();

    // Wax seal emblem at center of envelope
    const sealAlpha = 1.0 - smoothstep(0.0, 0.4, foldProgress);
    if (sealAlpha > 0.05) {
      ctx.beginPath();
      ctx.arc(0, 10, 18, 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba(palette.primaryStroke, 0.9 * sealAlpha);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, 10, 14, 0, Math.PI * 2);
      ctx.strokeStyle = hexToRgba(palette.accentGlow, sealAlpha);
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    ctx.restore();

    // 2. Dynamic Calligraphic Cursive Ribbon Flourishes emerging from the letter
    const ribbonProgress = easeOutCubic(clamp((localProgress - 0.15) / 0.80, 0, 1));
    if (ribbonProgress > 0) {
      ctx.save();
      const numFlourishes = 3;
      for (let f = 0; f < numFlourishes; f++) {
        const fAngle = (f / numFlourishes) * Math.PI * 2 + globalTime * 0.15;
        const reach = focalRadius * (1.1 + f * 0.35 + tel.vocalPresence * 0.4) * ribbonProgress;
        
        ctx.beginPath();
        const p0x = cx;
        const p0y = cy - 20;

        const p1x = cx + Math.cos(fAngle - 0.6) * (reach * 0.45);
        const p1y = cy + Math.sin(fAngle - 0.6) * (reach * 0.35) - 40;

        const p2x = cx + Math.cos(fAngle + 0.5) * (reach * 0.85);
        const p2y = cy + Math.sin(fAngle + 0.5) * (reach * 0.75) + 30 * Math.sin(globalTime + f);

        const p3x = cx + Math.cos(fAngle) * reach;
        const p3y = cy + Math.sin(fAngle) * reach;

        ctx.moveTo(p0x, p0y);
        ctx.bezierCurveTo(p1x, p1y, p2x, p2y, p3x, p3y);

        ctx.strokeStyle = hexToRgba(f === 0 ? palette.accentGlow : palette.primaryStroke, 0.8 - f * 0.2);
        ctx.lineWidth = 3.5 - f * 0.9 + (tel.bass * 2.0);
        ctx.lineCap = 'round';
        ctx.shadowColor = hexToRgba(palette.accentGlow, 0.7);
        ctx.shadowBlur = 15;
        ctx.stroke();

        // Terminal ink droplet bloom
        ctx.beginPath();
        const dropR = (4.0 - f * 0.8) + tel.vocalPresence * 3.5;
        ctx.arc(p3x, p3y, dropR, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba(palette.accentGlow, 0.95);
        ctx.fill();
      }
      ctx.restore();
    }

    // 3. Floating Quill Silhouette tracing the confession
    ctx.save();
    const quillAngle = 0.4 + 0.1 * Math.sin(globalTime * 1.5);
    const quillTipX = cx + focalRadius * 0.6 * Math.cos(globalTime * 0.9);
    const quillTipY = cy + focalRadius * 0.4 * Math.sin(globalTime * 0.9);
    
    ctx.translate(quillTipX, quillTipY);
    ctx.rotate(quillAngle);

    // Quill nib
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-6, -20);
    ctx.lineTo(6, -20);
    ctx.closePath();
    ctx.fillStyle = hexToRgba(palette.accentGlow, 0.9);
    ctx.fill();

    // Quill feather shaft & vane
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.quadraticCurveTo(-15, -70, -28, -130);
    ctx.quadraticCurveTo(-5, -95, 0, -60);
    ctx.quadraticCurveTo(10, -90, 16, -125);
    ctx.quadraticCurveTo(8, -65, 0, -20);
    ctx.fillStyle = hexToRgba(palette.primaryStroke, 0.6);
    ctx.shadowColor = hexToRgba(palette.accentGlow, 0.5);
    ctx.shadowBlur = 8;
    ctx.fill();

    ctx.restore();

    ctx.restore();
  }

  // -------------------------------------------------------------------------
  // MOTIF 2: "window_rain" (Window Rain & Streetlamp Bokeh)
  // -------------------------------------------------------------------------
  function drawMotifWindowRain(ctx, scene, localProgress, globalTime, audioTelemetry, width, height, focalRadius) {
    const palette = getPalette(scene.palette);
    const tel = sanitizeTelemetry(audioTelemetry);
    const cx = width / 2;
    const cy = height * 0.48;

    ctx.save();

    // 1. Streetlamp Bokeh Discs (Warm / cold urban glow discs scattered)
    const bokehSeeds = [
      { rx: -0.55, ry: -0.35, r: 120, col: palette.accentGlow, phase: 0.1 },
      { rx: 0.48, ry: -0.42, r: 160, col: palette.primaryStroke, phase: 1.4 },
      { rx: -0.28, ry: 0.15, r: 90, col: palette.secondaryStroke, phase: 2.1 },
      { rx: 0.62, ry: 0.22, r: 140, col: palette.accentGlow, phase: 3.2 },
      { rx: -0.15, ry: -0.20, r: 110, col: palette.primaryStroke, phase: 4.0 },
      { rx: 0.25, ry: -0.10, r: 130, col: palette.accentGlow, phase: 5.1 },
      { rx: -0.68, ry: 0.35, r: 100, col: palette.secondaryStroke, phase: 1.8 },
      { rx: 0.05, ry: 0.30, r: 150, col: palette.primaryStroke, phase: 2.9 }
    ];

    bokehSeeds.forEach(b => {
      const bx = cx + b.rx * width * 0.85 + Math.sin(globalTime * 0.4 + b.phase) * 15;
      const by = cy + b.ry * height * 0.75 + Math.cos(globalTime * 0.3 + b.phase) * 12;
      const pulse = 1.0 + 0.15 * Math.sin(globalTime * 1.1 + b.phase) + tel.bass * 0.25;
      const rad = b.r * pulse;

      const grad = ctx.createRadialGradient(bx, by, rad * 0.1, bx, by, rad);
      grad.addColorStop(0.0, hexToRgba(b.col, 0.42));
      grad.addColorStop(0.5, hexToRgba(b.col, 0.18));
      grad.addColorStop(1.0, hexToRgba(b.col, 0.0));

      ctx.save();
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(bx, by, rad, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // 2. Condensation Mist Vignette on Glass Window Pane
    const mistGrad = ctx.createRadialGradient(cx, cy, focalRadius * 0.4, cx, cy, width * 0.65);
    mistGrad.addColorStop(0.0, 'rgba(255, 255, 255, 0.0)');
    mistGrad.addColorStop(0.7, hexToRgba(palette.bgTop, 0.45));
    mistGrad.addColorStop(1.0, hexToRgba(palette.bgBottom, 0.85));
    ctx.fillStyle = mistGrad;
    ctx.fillRect(0, 0, width, height);

    // 3. Streaming Rainwater Rivulets (Vertical meandering tears on glass)
    const streams = [
      { xOffset: -0.38, speed: 1.1, amp: 14, seed: 1 },
      { xOffset: -0.18, speed: 1.4, amp: 20, seed: 2 },
      { xOffset: 0.08, speed: 0.9, amp: 16, seed: 3 },
      { xOffset: 0.28, speed: 1.3, amp: 18, seed: 4 },
      { xOffset: 0.44, speed: 1.0, amp: 12, seed: 5 }
    ];

    streams.forEach(s => {
      const baseX = cx + s.xOffset * width;
      const flowHeadY = ((globalTime * 90 * s.speed + s.seed * 350) % (height * 1.3)) - 100;

      ctx.save();
      ctx.beginPath();
      const startY = Math.max(0, flowHeadY - 320);
      const endY = Math.min(height, flowHeadY);

      if (endY > startY) {
        ctx.moveTo(baseX, startY);
        for (let y = startY; y <= endY; y += 20) {
          const waveX = baseX + Math.sin(y * 0.02 + s.seed) * s.amp;
          ctx.lineTo(waveX, y);
        }
        ctx.strokeStyle = hexToRgba(palette.primaryStroke, 0.45);
        ctx.lineWidth = 2.0;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Droplet bead at bottom of stream
        const beadX = baseX + Math.sin(endY * 0.02 + s.seed) * s.amp;
        ctx.beginPath();
        ctx.arc(beadX, endY, 4.5 + tel.bass * 2, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba(palette.accentGlow, 0.85);
        ctx.shadowColor = hexToRgba(palette.accentGlow, 0.7);
        ctx.shadowBlur = 8;
        ctx.fill();

        // Droplet specular glint (tiny white dot)
        ctx.beginPath();
        ctx.arc(beadX - 1.2, endY - 1.2, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      }
      ctx.restore();
    });

    // 4. Static Glass Condensation Micro-Droplets
    const numDroplets = 45;
    for (let i = 0; i < numDroplets; i++) {
      const pseudoX = (Math.sin(i * 127.1 + 0.5) * 0.5 + 0.5) * width;
      const pseudoY = (Math.cos(i * 311.7 + 0.8) * 0.5 + 0.5) * height;
      const dropRadius = 2.0 + (i % 5) * 1.2;

      ctx.save();
      ctx.beginPath();
      ctx.arc(pseudoX, pseudoY, dropRadius, 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba(palette.primaryStroke, 0.35);
      ctx.fill();

      // Highlight crescent
      ctx.beginPath();
      ctx.arc(pseudoX - dropRadius * 0.3, pseudoY - dropRadius * 0.3, dropRadius * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba('#ffffff', 0.65);
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();
  }

  // -------------------------------------------------------------------------
  // MOTIF 3: "whale_gem" (Whale Gem & Starlight Origami)
  // -------------------------------------------------------------------------
  function drawMotifWhaleGem(ctx, scene, localProgress, globalTime, audioTelemetry, width, height, focalRadius) {
    const palette = getPalette(scene.palette);
    const tel = sanitizeTelemetry(audioTelemetry);
    const cx = width / 2;
    const cy = height * 0.46;

    ctx.save();

    // 1. Gentle Swimming Glide Trajectory
    const swimTime = globalTime * 0.65;
    const swimX = cx + Math.sin(swimTime * 0.7) * 80;
    const swimY = cy + Math.cos(swimTime * 0.5) * 35;
    const swimAngle = Math.cos(swimTime * 0.7) * 0.08;

    ctx.translate(swimX, swimY);
    ctx.rotate(swimAngle);

    // Dynamic Undulation along Spine
    const undulate = (distFromHead) => {
      const phase = swimTime * 2.2 - distFromHead * 0.005;
      return Math.sin(phase) * (distFromHead * 0.08) * (1.0 + tel.vocalPresence * 0.5);
    };

    // 2. Faceted Low-Poly Whale Hull Vertices
    // Whale geometry spans from Head (left) to Tail (right)
    const scale = (focalRadius / 260) * (1.0 + tel.vocalPresence * 0.08);

    const rawVerts = [
      { id: 0, x: -280, y: 0 },                  // Snout
      { id: 1, x: -210, y: -45 },                // Forehead
      { id: 2, x: -210, y: 35 },                 // Chin
      { id: 3, x: -110, y: -65 },                // Crown
      { id: 4, x: -100, y: 0 },                  // Eye region
      { id: 5, x: -100, y: 55 },                 // Throat pleats
      { id: 6, x: 20, y: -50 },                  // Dorsal back
      { id: 7, x: 10, y: 25 },                   // Mid flank
      { id: 8, x: 0, y: 130 },                   // Pectoral fin tip
      { id: 9, x: 140, y: -30 },                 // Tail stock top
      { id: 10, x: 140, y: 15 },                 // Tail stock bottom
      { id: 11, x: 230, y: -55 },                // Fluke upper tip
      { id: 12, x: 215, y: -5 },                 // Fluke notch
      { id: 13, x: 240, y: 45 }                  // Fluke lower tip
    ];

    // Apply scaling and dynamic spine undulation
    const verts = rawVerts.map(v => {
      const distFromHead = v.x + 280;
      const dy = undulate(distFromHead);
      return {
        x: v.x * scale,
        y: (v.y + dy) * scale
      };
    });

    // Triangular facets for low-poly origami effect
    const triangles = [
      [0, 1, 4], [0, 4, 2], [1, 3, 4], [2, 4, 5],
      [3, 6, 4], [4, 6, 7], [4, 7, 5], [5, 7, 8],
      [6, 9, 7], [7, 9, 10], [9, 11, 12], [9, 12, 10], [10, 12, 13]
    ];

    // Draw Facet Fills with Bioluminescent Shading
    triangles.forEach((tri, idx) => {
      const vA = verts[tri[0]];
      const vB = verts[tri[1]];
      const vC = verts[tri[2]];

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(vA.x, vA.y);
      ctx.lineTo(vB.x, vB.y);
      ctx.lineTo(vC.x, vC.y);
      ctx.closePath();

      // Shading based on normal/index and audio energy
      const shadeFactor = 0.25 + (idx % 5) * 0.12 + tel.vocalPresence * 0.15;
      ctx.fillStyle = hexToRgba(idx % 2 === 0 ? palette.primaryStroke : palette.secondaryStroke, shadeFactor);
      ctx.fill();

      // Crystal Wireframe Stroke
      ctx.strokeStyle = hexToRgba(palette.accentGlow, 0.75);
      ctx.lineWidth = 1.3;
      ctx.stroke();
      ctx.restore();
    });

    // 3. Starlight Constellation Eye & Facet Nodes
    verts.forEach((v, idx) => {
      ctx.save();
      ctx.beginPath();
      const nodeR = (idx === 4 ? 4.5 : 2.5) + tel.vocalPresence * 1.5;
      ctx.arc(v.x, v.y, nodeR, 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba(palette.accentGlow, 0.95);
      ctx.shadowColor = hexToRgba(palette.accentGlow, 0.85);
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.restore();
    });

    // 4. Bioluminescent Starlight Particle Trail from Flukes
    const tailFluke = verts[12];
    const numTrailParticles = 16;
    for (let p = 0; p < numTrailParticles; p++) {
      const trailAge = ((globalTime * 1.2 + p * 0.2) % 2.0) / 2.0;
      const trailX = tailFluke.x + trailAge * 220 * scale;
      const trailY = tailFluke.y + Math.sin(globalTime * 3 + p) * (35 * scale) * trailAge;
      const trailAlpha = (1.0 - trailAge) * 0.7;

      ctx.save();
      ctx.beginPath();
      ctx.arc(trailX, trailY, (3.5 - trailAge * 2.5) + tel.vocalPresence * 2, 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba(palette.accentGlow, trailAlpha);
      ctx.shadowColor = hexToRgba(palette.accentGlow, 0.9);
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();
  }

  // -------------------------------------------------------------------------
  // MOTIF 4: "royal_lotus" (Royal Moonlight & Blooming Lotus)
  // -------------------------------------------------------------------------
  function drawMotifRoyalLotus(ctx, scene, localProgress, globalTime, audioTelemetry, width, height, focalRadius) {
    const palette = getPalette(scene.palette);
    const tel = sanitizeTelemetry(audioTelemetry);
    const cx = width / 2;
    const waterLevel = height * 0.68;

    ctx.save();

    // 1. Joseon Silk-Screen Mountain Ridges (Irworobongdo aesthetic)
    const mountainTiers = [
      { yBase: waterLevel - 140, amp: 70, freq: 0.002, speed: 0.05, col: palette.secondaryStroke, alpha: 0.35 },
      { yBase: waterLevel - 80, amp: 55, freq: 0.0035, speed: 0.1, col: palette.bgBottom, alpha: 0.65 },
      { yBase: waterLevel - 25, amp: 40, freq: 0.005, speed: 0.2, col: palette.bgTop, alpha: 0.95 }
    ];

    mountainTiers.forEach(m => {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(0, m.yBase);
      for (let x = 0; x <= width; x += 40) {
        const peak = Math.sin(x * m.freq + 1.2) * m.amp + Math.cos(x * m.freq * 2.1) * (m.amp * 0.4);
        ctx.lineTo(x, m.yBase - peak);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = hexToRgba(m.col, m.alpha);
      ctx.fill();
      ctx.restore();
    });

    // 2. Celestial Full Moon with Atmospheric Halo
    const moonX = cx + width * 0.22;
    const moonY = height * 0.22;
    const moonR = 65 + tel.vocalPresence * 8;

    // Moon Halos
    const moonHalo = ctx.createRadialGradient(moonX, moonY, moonR * 0.8, moonX, moonY, moonR * 2.8);
    moonHalo.addColorStop(0.0, hexToRgba(palette.accentGlow, 0.45));
    moonHalo.addColorStop(0.5, hexToRgba(palette.primaryStroke, 0.15));
    moonHalo.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');

    ctx.save();
    ctx.fillStyle = moonHalo;
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonR * 2.8, 0, Math.PI * 2);
    ctx.fill();

    // Crisp Moon Disk
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
    ctx.fillStyle = hexToRgba(palette.textPrimary, 0.92);
    ctx.shadowColor = hexToRgba(palette.accentGlow, 0.9);
    ctx.shadowBlur = 25;
    ctx.fill();
    ctx.restore();

    // 3. Reflective Water Horizon with Sine Ripples
    ctx.save();
    const waterGrad = ctx.createLinearGradient(0, waterLevel, 0, height);
    waterGrad.addColorStop(0.0, hexToRgba(palette.bgBottom, 0.85));
    waterGrad.addColorStop(1.0, hexToRgba(palette.bgTop, 0.98));
    ctx.fillStyle = waterGrad;
    ctx.fillRect(0, waterLevel, width, height - waterLevel);

    // Water Ripple Highlights
    const numRipples = 6;
    for (let r = 0; r < numRipples; r++) {
      const ripY = waterLevel + 18 + r * 22;
      const ripPhase = globalTime * 1.5 + r * 0.8;
      ctx.beginPath();
      ctx.moveTo(cx - 350, ripY);
      for (let x = cx - 350; x <= cx + 350; x += 30) {
        const dy = Math.sin(x * 0.02 + ripPhase) * (2.5 + tel.bass * 3);
        ctx.lineTo(x, ripY + dy);
      }
      ctx.strokeStyle = hexToRgba(palette.primaryStroke, 0.35 - r * 0.04);
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
    ctx.restore();

    // 4. Sacred Blooming Lotus Flower (Center Focal Art)
    const lotusX = cx;
    const lotusY = waterLevel - 15;
    const bloomProgress = easeOutCubic(clamp(localProgress * 1.35, 0, 1));

    ctx.save();
    ctx.translate(lotusX, lotusY);

    // Broad Lotus Leaf Pad
    ctx.beginPath();
    ctx.ellipse(0, 10, focalRadius * 0.9, focalRadius * 0.25, 0, 0, Math.PI * 2);
    ctx.fillStyle = hexToRgba(palette.secondaryStroke, 0.7);
    ctx.fill();
    ctx.strokeStyle = hexToRgba(palette.primaryStroke, 0.5);
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Blooming Petals (3 Concentric Layers: Outer, Middle, Inner)
    const petalLayers = [
      { count: 8, radius: focalRadius * 0.75, width: 36, spreadAngle: 0.85, alpha: 0.75, col: palette.secondaryStroke },
      { count: 8, radius: focalRadius * 0.55, width: 28, spreadAngle: 0.55, alpha: 0.85, col: palette.primaryStroke },
      { count: 6, radius: focalRadius * 0.35, width: 20, spreadAngle: 0.35, alpha: 0.95, col: palette.accentGlow }
    ];

    petalLayers.forEach((layer, layerIdx) => {
      const numPetals = layer.count;
      for (let p = 0; p < numPetals; p++) {
        const baseAngle = -Math.PI / 2 + ((p - (numPetals - 1) / 2) / numPetals) * Math.PI * layer.spreadAngle;
        const currentAngle = baseAngle * bloomProgress;
        const petalLen = layer.radius * (0.4 + 0.6 * bloomProgress);

        ctx.save();
        ctx.rotate(currentAngle);

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(-layer.width, -petalLen * 0.6, 0, -petalLen);
        ctx.quadraticCurveTo(layer.width, -petalLen * 0.6, 0, 0);

        ctx.fillStyle = hexToRgba(layer.col, layer.alpha);
        ctx.shadowColor = hexToRgba(palette.accentGlow, 0.6);
        ctx.shadowBlur = 10;
        ctx.fill();

        ctx.strokeStyle = hexToRgba(palette.accentGlow, 0.8);
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.restore();
      }
    });

    // Glowing Golden Stamen / Nectar Core
    ctx.beginPath();
    const stamenR = (12 + tel.vocalPresence * 6) * bloomProgress;
    ctx.arc(0, -6, stamenR, 0, Math.PI * 2);
    ctx.fillStyle = hexToRgba(palette.accentGlow, 0.95);
    ctx.shadowColor = hexToRgba(palette.accentGlow, 0.95);
    ctx.shadowBlur = 20;
    ctx.fill();

    // Floating Stamen Sparks / Firefly Embers
    for (let s = 0; s < 8; s++) {
      const sparkAngle = globalTime * 1.5 + s * (Math.PI / 4);
      const sparkDist = (stamenR + 15 + Math.sin(globalTime * 2 + s) * 10) * bloomProgress;
      const sx = Math.cos(sparkAngle) * sparkDist;
      const sy = -6 + Math.sin(sparkAngle) * sparkDist * 0.6;

      ctx.beginPath();
      ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba(palette.textPrimary, 0.9);
      ctx.fill();
    }

    ctx.restore();

    ctx.restore();
  }

  // -------------------------------------------------------------------------
  // MOTIF 5: "acoustic_strings" (Acoustic String Harmonics)
  // -------------------------------------------------------------------------
  function drawMotifAcousticStrings(ctx, scene, localProgress, globalTime, audioTelemetry, width, height, focalRadius) {
    const palette = getPalette(scene.palette);
    const tel = sanitizeTelemetry(audioTelemetry);
    const cx = width / 2;
    const cy = height * 0.48;

    ctx.save();

    // 1. Soundboard Rosette Inlay (Concentric Guilloche Circles)
    const rosetteR = focalRadius * 0.95;
    ctx.save();
    ctx.translate(cx, cy);

    // Rosette soundhole cavity
    ctx.beginPath();
    ctx.arc(0, 0, rosetteR * 0.72, 0, Math.PI * 2);
    ctx.fillStyle = hexToRgba(palette.bgTop, 0.92);
    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = 30;
    ctx.fill();

    // Guilloche Engraving Lathe Rings
    const numRings = 4;
    for (let r = 0; r < numRings; r++) {
      const ringRadius = rosetteR * (0.75 + r * 0.08);
      ctx.beginPath();
      const petals = 24 + r * 8;
      for (let a = 0; a <= Math.PI * 2; a += 0.05) {
        const mod = Math.sin(a * petals + globalTime * 0.2) * 4;
        const rad = ringRadius + mod;
        const x = Math.cos(a) * rad;
        const y = Math.sin(a) * rad;
        if (a === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = hexToRgba(r % 2 === 0 ? palette.primaryStroke : palette.accentGlow, 0.65 - r * 0.1);
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
    ctx.restore();

    // 2. Six Acoustic Strings with Dynamic Standing Wave Harmonics
    const stringSpan = focalRadius * 1.6;
    const stringStartX = cx - stringSpan;
    const stringEndX = cx + stringSpan;
    const stringLength = stringEndX - stringStartX;

    const numStrings = 6;
    const stringSpacing = (focalRadius * 1.1) / (numStrings - 1);
    const topStringY = cy - (focalRadius * 0.55);

    for (let i = 0; i < numStrings; i++) {
      const restY = topStringY + i * stringSpacing;
      const stringThickness = 1.0 + (numStrings - 1 - i) * 0.65; // Bass strings thicker

      // Vibration envelope: fundamental + 2nd/3rd harmonics driven by vocal & bass
      const fundamentalAmp = (12.0 + tel.bass * 25.0) * (0.8 + 0.4 * (i % 2));
      const harmonicAmp = (6.0 + tel.vocalPresence * 18.0) * (0.7 + 0.5 * ((i + 1) % 2));
      const freq = 12.0 + i * 4.0;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(stringStartX, restY);

      const segments = 60;
      for (let s = 0; s <= segments; s++) {
        const frac = s / segments;
        const x = stringStartX + frac * stringLength;

        // Standing wave formula: sum of sine harmonics
        const mode1 = Math.sin(Math.PI * frac) * Math.sin(globalTime * freq);
        const mode2 = Math.sin(2 * Math.PI * frac) * Math.sin(globalTime * freq * 2);
        const mode3 = Math.sin(3 * Math.PI * frac) * Math.sin(globalTime * freq * 3);

        const dy = (mode1 * fundamentalAmp + mode2 * harmonicAmp * 0.6 + mode3 * harmonicAmp * 0.3);
        ctx.lineTo(x, restY + dy);
      }

      ctx.strokeStyle = hexToRgba(i === 0 || i === numStrings - 1 ? palette.accentGlow : palette.primaryStroke, 0.85);
      ctx.lineWidth = stringThickness;
      ctx.shadowColor = hexToRgba(palette.accentGlow, 0.6);
      ctx.shadowBlur = 10 + tel.vocalPresence * 8;
      ctx.stroke();

      // Diamond Resonance Nodes at L/4, L/2, 3L/4
      [0.25, 0.5, 0.75].forEach(nodeFrac => {
        const nodeX = stringStartX + nodeFrac * stringLength;
        ctx.beginPath();
        const dR = 3.5 + tel.vocalPresence * 2;
        ctx.moveTo(nodeX, restY - dR);
        ctx.lineTo(nodeX + dR, restY);
        ctx.lineTo(nodeX, restY + dR);
        ctx.lineTo(nodeX - dR, restY);
        ctx.closePath();
        ctx.fillStyle = hexToRgba(palette.accentGlow, 0.95);
        ctx.fill();
      });

      ctx.restore();
    }

    // 3. Shockwave Pluck Ripple on Beats
    if (tel.isBeat || tel.bass > 0.65) {
      ctx.save();
      ctx.beginPath();
      const rippleR = ((globalTime * 180) % (focalRadius * 1.2));
      ctx.arc(cx, cy, rippleR, 0, Math.PI * 2);
      ctx.strokeStyle = hexToRgba(palette.accentGlow, 0.8 * (1.0 - rippleR / (focalRadius * 1.2)));
      ctx.lineWidth = 2.5;
      ctx.shadowColor = hexToRgba(palette.accentGlow, 0.9);
      ctx.shadowBlur = 15;
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  }

  // -------------------------------------------------------------------------
  // MOTIF 6: "celestial_bloom" (Stage-Level Conviction Bloom)
  // -------------------------------------------------------------------------
  function drawMotifCelestialBloom(ctx, scene, localProgress, globalTime, audioTelemetry, width, height, focalRadius) {
    const palette = getPalette(scene.palette);
    const tel = sanitizeTelemetry(audioTelemetry);
    const cx = width / 2;
    const cy = height * 0.46;

    ctx.save();
    ctx.translate(cx, cy);

    const bloomProgress = easeOutCubic(clamp(localProgress * 1.25, 0, 1));
    const vocalScale = 1.0 + tel.vocalPresence * 0.35 + (tel.isBeat ? 0.15 : 0);

    // 1. Volumetric Conviction God-Rays (Radial light beams)
    const numRays = 16;
    for (let r = 0; r < numRays; r++) {
      const rayAngle = (r / numRays) * Math.PI * 2 + globalTime * 0.1;
      const rayLen = focalRadius * (1.6 + 0.4 * Math.sin(globalTime * 2 + r)) * vocalScale * bloomProgress;
      const rayWidth = 0.08 + tel.vocalPresence * 0.04;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, rayLen, rayAngle - rayWidth / 2, rayAngle + rayWidth / 2);
      ctx.closePath();

      const rayGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, rayLen);
      rayGrad.addColorStop(0.0, hexToRgba(palette.accentGlow, 0.65));
      rayGrad.addColorStop(0.6, hexToRgba(palette.primaryStroke, 0.2));
      rayGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');

      ctx.fillStyle = rayGrad;
      ctx.fill();
      ctx.restore();
    }

    // 2. Sacred Golden Ratio (Phyllotaxis) Star Constellation
    const goldenAngle = 137.507764 * (Math.PI / 180);
    const numSeeds = 72;
    for (let s = 1; s <= numSeeds; s++) {
      const phiAngle = s * goldenAngle + globalTime * 0.08;
      const dist = (focalRadius * 0.12) * Math.sqrt(s) * bloomProgress * vocalScale;
      const sx = Math.cos(phiAngle) * dist;
      const sy = Math.sin(phiAngle) * dist;
      const starR = 2.0 + (s % 4) * 0.8 + tel.vocalPresence * 1.5;

      ctx.save();
      ctx.beginPath();
      ctx.arc(sx, sy, starR, 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba(s % 3 === 0 ? palette.accentGlow : palette.primaryStroke, 0.85);
      ctx.shadowColor = hexToRgba(palette.accentGlow, 0.9);
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.restore();
    }

    // 3. Multi-Axis Gyroscopic Orbital Rings (3D Elliptical gimbal)
    const numRings = 4;
    for (let o = 0; o < numRings; o++) {
      const ringTilt = (o / numRings) * Math.PI + globalTime * 0.25;
      const ringRx = focalRadius * (0.55 + o * 0.28) * bloomProgress;
      const ringRy = ringRx * (0.35 + 0.15 * Math.sin(globalTime * 0.5 + o));

      ctx.save();
      ctx.rotate(ringTilt);
      ctx.beginPath();
      ctx.ellipse(0, 0, ringRx, ringRy, 0, 0, Math.PI * 2);
      ctx.strokeStyle = hexToRgba(palette.primaryStroke, 0.65 - o * 0.1);
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Satellite Orb on Ring
      const orbAngle = globalTime * (1.2 + o * 0.3);
      const orbX = Math.cos(orbAngle) * ringRx;
      const orbY = Math.sin(orbAngle) * ringRy;
      ctx.beginPath();
      ctx.arc(orbX, orbY, 4.0 + tel.vocalPresence * 2, 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba(palette.accentGlow, 0.95);
      ctx.shadowColor = hexToRgba(palette.accentGlow, 1.0);
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.restore();
    }

    // 4. Center Radiant Climax Starburst Core
    ctx.save();
    const coreGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, focalRadius * 0.45 * vocalScale);
    coreGrad.addColorStop(0.0, '#ffffff');
    coreGrad.addColorStop(0.3, hexToRgba(palette.accentGlow, 0.95));
    coreGrad.addColorStop(0.7, hexToRgba(palette.primaryStroke, 0.45));
    coreGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');

    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(0, 0, focalRadius * 0.45 * vocalScale, 0, Math.PI * 2);
    ctx.fill();

    // 8-Point Diffraction Spikes
    const spikeLen = focalRadius * 0.85 * vocalScale;
    ctx.beginPath();
    for (let a = 0; a < 8; a++) {
      const spkAngle = (a / 8) * Math.PI * 2;
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(spkAngle) * spikeLen, Math.sin(spkAngle) * spikeLen);
    }
    ctx.strokeStyle = hexToRgba(palette.accentGlow, 0.7);
    ctx.lineWidth = 1.8;
    ctx.shadowColor = hexToRgba(palette.accentGlow, 1.0);
    ctx.shadowBlur = 15;
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }

  // =========================================================================
  // 7. COMPOSITE CANVAS 2D RENDERER (60FPS HIGH-PRECISION RUNTIME)
  // =========================================================================
  /**
   * Directly renders the high-precision 60fps vector motion artwork and kinetic lyrics onto
   * a 2D CanvasRenderingContext2D (ctx) so it composites over the WebGL shader backdrop.
   */
  function drawVectorSceneToCanvas(ctx, scene, localProgress = 0, globalTime = 0, audioTelemetry = {}, width = 1920, height = 1080, options = {}) {
    if (!ctx) return;
    const s = scene || {};
    const normProgress = clamp(typeof localProgress === 'number' ? localProgress : 0, 0, 1);
    const time = typeof globalTime === 'number' ? globalTime : 0;
    const tel = sanitizeTelemetry(audioTelemetry);
    const palette = getPalette(s.palette || s.oklabPalette);

    // Optional background clear / atmospheric tint
    if (options.clearCanvas !== false) {
      if (options.renderBackdrop === true) {
        // Draw full Oklab gradient backdrop if standalone
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0.0, palette.bgTop);
        bgGrad.addColorStop(1.0, palette.bgBottom);
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);
      } else {
        // Transparent clear for layering over WebGL compositor
        ctx.clearRect(0, 0, width, height);
      }
    }

    // Compute 2.5D Camera Transform
    const cam = computeCameraTransform(s.cameraMotion, normProgress, time, tel, width, height);

    ctx.save();
    // Apply 2.5D Camera Transform
    ctx.translate(cam.cx + cam.dx, cam.cy + cam.dy);
    ctx.scale(cam.scale, cam.scale);
    ctx.rotate(cam.rotate);
    ctx.translate(-cam.cx, -cam.cy);

    // Compute negative space focal radius
    const focalRadius = computeFocalRadius(s, width, height);

    // Dispatch to specific procedural motif
    const motifId = s.motif || s.svgMotif || 'ink_confession';
    switch (motifId) {
      case 'ink_confession':
        drawMotifInkConfession(ctx, s, normProgress, time, tel, width, height, focalRadius);
        break;
      case 'window_rain':
        drawMotifWindowRain(ctx, s, normProgress, time, tel, width, height, focalRadius);
        break;
      case 'whale_gem':
        drawMotifWhaleGem(ctx, s, normProgress, time, tel, width, height, focalRadius);
        break;
      case 'royal_lotus':
        drawMotifRoyalLotus(ctx, s, normProgress, time, tel, width, height, focalRadius);
        break;
      case 'acoustic_strings':
        drawMotifAcousticStrings(ctx, s, normProgress, time, tel, width, height, focalRadius);
        break;
      case 'celestial_bloom':
        drawMotifCelestialBloom(ctx, s, normProgress, time, tel, width, height, focalRadius);
        break;
      default:
        drawMotifInkConfession(ctx, s, normProgress, time, tel, width, height, focalRadius);
        break;
    }

    ctx.restore(); // Restore camera transform

    // Draw Gwyn Dorado Kinetic Typography Layer (HUD / overlay coordinate space)
    drawKineticLyrics(ctx, s, normProgress, tel, width, height);
  }

  // =========================================================================
  // 8. STANDALONE PROGRAMMATIC SVG CODE GENERATOR
  // =========================================================================
  /**
   * Generates and returns a complete, valid, standalone animated SVG string:
   * <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">...</svg>
   * 
   * Includes:
   * - <defs> (linear/radial gradients, glow filters <feGaussianBlur>)
   * - <g id="layer-backdrop">
   * - <g id="layer-midground-parallax">
   * - <g id="layer-focal-confession"> (mathematical Bezier strokes, dashed offsets)
   * - <g id="layer-atmosphere">
   * - <g id="layer-kinetic-lyrics">
   */
  function renderSVGCode(scene, localProgress = 0, globalTime = 0, audioTelemetry = {}, width = 1920, height = 1080) {
    const s = scene || {};
    const normProgress = clamp(typeof localProgress === 'number' ? localProgress : 0, 0, 1);
    const time = typeof globalTime === 'number' ? globalTime : 0;
    const tel = sanitizeTelemetry(audioTelemetry);
    const palette = getPalette(s.palette || s.oklabPalette);
    const motifId = s.motif || s.svgMotif || 'ink_confession';
    const conviction = typeof s.convictionLevel === 'number' ? s.convictionLevel : 0.5;
    const isClimax = conviction >= 0.55;
    const focalRadius = computeFocalRadius(s, width, height);

    const cx = width / 2;
    const cy = height * 0.46;

    // Camera transform for SVG layers
    const cam = computeCameraTransform(s.cameraMotion, normProgress, time, tel, width, height);
    const focalTransform = `translate(${cam.cx + cam.dx}, ${cam.cy + cam.dy}) scale(${cam.scale.toFixed(4)}) rotate(${(cam.rotate * 180 / Math.PI).toFixed(3)}) translate(${-cam.cx}, ${-cam.cy})`;
    const parallaxTransform = `translate(${(cam.dx * 0.4).toFixed(2)}, ${(cam.dy * 0.4).toFixed(2)})`;

    // -----------------------------------------------------------------------
    // MOTIF-SPECIFIC SVG FOCAL GEOMETRY GENERATOR
    // -----------------------------------------------------------------------
    let focalGeometrySVG = '';
    let midgroundGeometrySVG = '';

    switch (motifId) {
      case 'ink_confession': {
        const letterW = Math.round(focalRadius * 1.35);
        const letterH = Math.round(focalRadius * 0.88);
        const foldProgress = easeInOutQuad(clamp(normProgress * 2.2, 0, 1));
        const flapApexY = lerp(cy + 10, cy - letterH * 0.85, foldProgress).toFixed(1);

        // Calligraphic flourish path
        const dashTotal = 1200;
        const dashOffset = (dashTotal * (1.0 - normProgress)).toFixed(1);

        focalGeometrySVG = `
          <!-- Unfolding Envelope Base -->
          <rect x="${cx - letterW / 2}" y="${cy - letterH / 2}" width="${letterW}" height="${letterH}" rx="8"
                fill="${palette.bgBottom}" fill-opacity="0.85" stroke="${palette.secondaryStroke}" stroke-width="1.5" />
          <line x1="${cx - letterW / 2}" y1="${cy + letterH / 2}" x2="${cx}" y2="${cy + 15}" stroke="${palette.primaryStroke}" stroke-width="1.2" stroke-opacity="0.6" />
          <line x1="${cx + letterW / 2}" y1="${cy + letterH / 2}" x2="${cx}" y2="${cy + 15}" stroke="${palette.primaryStroke}" stroke-width="1.2" stroke-opacity="0.6" />
          
          <!-- Top Unfolding Flap -->
          <path d="M ${cx - letterW / 2} ${cy - letterH / 2} L ${cx} ${flapApexY} L ${cx + letterW / 2} ${cy - letterH / 2}"
                fill="none" stroke="${palette.accentGlow}" stroke-width="2" filter="url(#dorado-glow)" />

          <!-- Dynamic Calligraphic Flourish Ribbons -->
          <path d="M ${cx} ${cy - 20} C ${cx - focalRadius * 0.6} ${cy - 120}, ${cx + focalRadius * 0.8} ${cy - 80}, ${cx + focalRadius * 1.1} ${cy - 20} S ${cx - focalRadius * 0.4} ${cy + 140}, ${cx - focalRadius * 0.9} ${cy + 80}"
                fill="none" stroke="${palette.accentGlow}" stroke-width="3.5" stroke-linecap="round"
                stroke-dasharray="${dashTotal}" stroke-dashoffset="${dashOffset}" filter="url(#dorado-glow)" />

          <!-- Quill Pen Silhouette -->
          <g transform="translate(${cx + focalRadius * 0.55}, ${cy - focalRadius * 0.35}) rotate(25)">
            <path d="M 0 0 L -6 -20 L 6 -20 Z" fill="${palette.accentGlow}" />
            <path d="M 0 -20 Q -15 -70, -28 -130 Q -5 -95, 0 -60 Q 10 -90, 16 -125 Q 8 -65, 0 -20"
                  fill="${palette.primaryStroke}" fill-opacity="0.65" filter="url(#dorado-glow)" />
          </g>
        `;
        break;
      }

      case 'window_rain': {
        // Bokeh discs & streaming rain trails
        midgroundGeometrySVG = `
          <!-- Streetlamp Bokeh Orbs -->
          <circle cx="${cx - 300}" cy="${cy - 150}" r="120" fill="url(#bokeh-radial-1)" />
          <circle cx="${cx + 340}" cy="${cy - 100}" r="160" fill="url(#bokeh-radial-2)" />
          <circle cx="${cx - 120}" cy="${cy + 140}" r="95" fill="url(#bokeh-radial-1)" />
          <circle cx="${cx + 200}" cy="${cy + 180}" r="130" fill="url(#bokeh-radial-2)" />
        `;

        focalGeometrySVG = `
          <!-- Streaming Glass Droplet Rivulets -->
          <path d="M ${cx - 240} ${cy - 300} Q ${cx - 225} ${cy - 100}, ${cx - 235} ${cy + 100} T ${cx - 220} ${cy + 300}"
                fill="none" stroke="${palette.primaryStroke}" stroke-width="2.2" stroke-linecap="round" stroke-opacity="0.75" />
          <circle cx="${cx - 220}" cy="${cy + 300}" r="5" fill="${palette.accentGlow}" filter="url(#dorado-glow)" />
          
          <path d="M ${cx + 180} ${cy - 320} Q ${cx + 195} ${cy - 80}, ${cx + 175} ${cy + 120} T ${cx + 190} ${cy + 280}"
                fill="none" stroke="${palette.primaryStroke}" stroke-width="2.5" stroke-linecap="round" stroke-opacity="0.75" />
          <circle cx="${cx + 190}" cy="${cy + 280}" r="5.5" fill="${palette.accentGlow}" filter="url(#dorado-glow)" />

          <!-- Concentric Ripple -->
          <circle cx="${cx}" cy="${cy + 150}" r="${(80 * normProgress + 20).toFixed(1)}"
                  fill="none" stroke="${palette.accentGlow}" stroke-width="1.5" stroke-opacity="${(1.0 - normProgress).toFixed(2)}" />
        `;
        break;
      }

      case 'whale_gem': {
        const sc = (focalRadius / 260).toFixed(3);
        focalGeometrySVG = `
          <!-- Low-Poly Crystalline Whale Group -->
          <g transform="translate(${cx}, ${cy}) scale(${sc})">
            <!-- Facets -->
            <polygon points="-280,0 -210,-45 -100,0" fill="${palette.primaryStroke}" fill-opacity="0.35" stroke="${palette.accentGlow}" stroke-width="1.5" />
            <polygon points="-280,0 -100,0 -210,35" fill="${palette.secondaryStroke}" fill-opacity="0.4" stroke="${palette.accentGlow}" stroke-width="1.5" />
            <polygon points="-210,-45 -110,-65 -100,0" fill="${palette.primaryStroke}" fill-opacity="0.45" stroke="${palette.accentGlow}" stroke-width="1.5" />
            <polygon points="-210,35 -100,0 -100,55" fill="${palette.secondaryStroke}" fill-opacity="0.3" stroke="${palette.accentGlow}" stroke-width="1.5" />
            <polygon points="-110,-65 20,-50 -100,0" fill="${palette.primaryStroke}" fill-opacity="0.5" stroke="${palette.accentGlow}" stroke-width="1.5" />
            <polygon points="-100,0 20,-50 10,25" fill="${palette.secondaryStroke}" fill-opacity="0.35" stroke="${palette.accentGlow}" stroke-width="1.5" />
            <polygon points="-100,55 10,25 0,130" fill="${palette.primaryStroke}" fill-opacity="0.55" stroke="${palette.accentGlow}" stroke-width="1.5" />
            <polygon points="20,-50 140,-30 10,25" fill="${palette.primaryStroke}" fill-opacity="0.45" stroke="${palette.accentGlow}" stroke-width="1.5" />
            <polygon points="10,25 140,-30 140,15" fill="${palette.secondaryStroke}" fill-opacity="0.38" stroke="${palette.accentGlow}" stroke-width="1.5" />
            <polygon points="140,-30 230,-55 215,-5" fill="${palette.primaryStroke}" fill-opacity="0.6" stroke="${palette.accentGlow}" stroke-width="1.5" />
            <polygon points="140,15 215,-5 240,45" fill="${palette.secondaryStroke}" fill-opacity="0.5" stroke="${palette.accentGlow}" stroke-width="1.5" />

            <!-- Bioluminescent Starlight Eye -->
            <circle cx="-100" cy="0" r="5" fill="${palette.accentGlow}" filter="url(#dorado-glow)" />

            <!-- Starlight Trail Nodes -->
            <circle cx="260" cy="-20" r="3" fill="${palette.accentGlow}" filter="url(#dorado-glow)" />
            <circle cx="295" cy="10" r="2.5" fill="${palette.accentGlow}" filter="url(#dorado-glow)" />
            <circle cx="330" cy="-15" r="2" fill="${palette.accentGlow}" filter="url(#dorado-glow)" />
          </g>
        `;
        break;
      }

      case 'royal_lotus': {
        const waterY = height * 0.68;
        midgroundGeometrySVG = `
          <!-- Joseon Silk Mountain Peaks -->
          <path d="M 0 ${height} L 0 ${waterY - 90} Q 400 ${waterY - 180}, 960 ${waterY - 110} T 1920 ${waterY - 140} L 1920 ${height} Z"
                fill="${palette.secondaryStroke}" fill-opacity="0.35" />
          <path d="M 0 ${height} L 0 ${waterY - 40} Q 600 ${waterY - 120}, 1200 ${waterY - 60} T 1920 ${waterY - 50} L 1920 ${height} Z"
                fill="${palette.bgBottom}" fill-opacity="0.75" />
          
          <!-- Celestial Moon -->
          <circle cx="${cx + 420}" cy="${height * 0.22}" r="65" fill="${palette.textPrimary}" filter="url(#dorado-glow)" />
        `;

        focalGeometrySVG = `
          <!-- Water Surface Mirror -->
          <rect x="0" y="${waterY}" width="${width}" height="${height - waterY}" fill="${palette.bgBottom}" fill-opacity="0.9" />
          
          <!-- Lotus Leaf & Blooming Petals -->
          <g transform="translate(${cx}, ${waterY - 15})">
            <ellipse cx="0" cy="10" rx="${focalRadius * 0.85}" ry="${focalRadius * 0.22}" fill="${palette.secondaryStroke}" fill-opacity="0.6" stroke="${palette.primaryStroke}" stroke-width="1.5" />
            
            <!-- Outer Petals -->
            <path d="M 0 0 C -45 -60, -90 -40, -110 -15 C -80 15, -30 10, 0 0 Z" fill="${palette.secondaryStroke}" fill-opacity="0.75" stroke="${palette.accentGlow}" stroke-width="1.2" />
            <path d="M 0 0 C 45 -60, 90 -40, 110 -15 C 80 15, 30 10, 0 0 Z" fill="${palette.secondaryStroke}" fill-opacity="0.75" stroke="${palette.accentGlow}" stroke-width="1.2" />
            <path d="M 0 0 C -25 -85, -50 -70, 0 -115 C 50 -70, 25 -85, 0 0 Z" fill="${palette.primaryStroke}" fill-opacity="0.85" stroke="${palette.accentGlow}" stroke-width="1.4" filter="url(#dorado-glow)" />

            <!-- Core Stamen -->
            <circle cx="0" cy="-6" r="14" fill="${palette.accentGlow}" filter="url(#dorado-glow)" />
          </g>
        `;
        break;
      }

      case 'acoustic_strings': {
        const rosetteR = Math.round(focalRadius * 0.9);
        focalGeometrySVG = `
          <!-- Soundboard Rosette Inlay -->
          <g transform="translate(${cx}, ${cy})">
            <circle cx="0" cy="0" r="${rosetteR * 0.72}" fill="${palette.bgTop}" stroke="${palette.primaryStroke}" stroke-width="2" />
            <circle cx="0" cy="0" r="${rosetteR * 0.82}" fill="none" stroke="${palette.accentGlow}" stroke-width="1.5" stroke-dasharray="4,4" />
            <circle cx="0" cy="0" r="${rosetteR * 0.92}" fill="none" stroke="${palette.secondaryStroke}" stroke-width="1.2" />
          </g>

          <!-- 6 Acoustic Standing Wave Strings -->
          ${[0, 1, 2, 3, 4, 5].map(idx => {
            const stringY = (cy - focalRadius * 0.5 + idx * (focalRadius / 4.5)).toFixed(1);
            const waveY = (Math.sin(normProgress * Math.PI * 2 + idx) * 12).toFixed(1);
            return `
              <path d="M ${cx - focalRadius * 1.5} ${stringY} Q ${cx} ${Number(stringY) + Number(waveY)}, ${cx + focalRadius * 1.5} ${stringY}"
                    fill="none" stroke="${idx === 0 || idx === 5 ? palette.accentGlow : palette.primaryStroke}"
                    stroke-width="${(1.2 + (5 - idx) * 0.5).toFixed(1)}" filter="url(#dorado-glow)" />
              <polygon points="${cx},${Number(stringY) - 4} ${cx + 4},${stringY} ${cx},${Number(stringY) + 4} ${cx - 4},${stringY}"
                       fill="${palette.accentGlow}" />
            `;
          }).join('')}
        `;
        break;
      }

      case 'celestial_bloom':
      default: {
        focalGeometrySVG = `
          <!-- Golden Ratio Constellation & Orbital Rings -->
          <g transform="translate(${cx}, ${cy})">
            <!-- 3D Gyroscopic Rings -->
            <ellipse cx="0" cy="0" rx="${focalRadius * 0.85}" ry="${focalRadius * 0.38}" fill="none" stroke="${palette.primaryStroke}" stroke-width="1.8" transform="rotate(-30)" />
            <ellipse cx="0" cy="0" rx="${focalRadius * 0.85}" ry="${focalRadius * 0.38}" fill="none" stroke="${palette.accentGlow}" stroke-width="1.8" transform="rotate(35)" filter="url(#dorado-glow)" />
            <ellipse cx="0" cy="0" rx="${focalRadius * 0.6}" ry="${focalRadius * 0.6}" fill="none" stroke="${palette.secondaryStroke}" stroke-width="1.2" stroke-dasharray="6,6" />

            <!-- Core Radiant Starburst -->
            <circle cx="0" cy="0" r="${focalRadius * 0.3}" fill="url(#core-bloom-radial)" />
            <line x1="0" y1="${-focalRadius * 0.8}" x2="0" y2="${focalRadius * 0.8}" stroke="${palette.accentGlow}" stroke-width="2" filter="url(#dorado-glow)" />
            <line x1="${-focalRadius * 0.8}" y1="0" x2="${focalRadius * 0.8}" y2="0" stroke="${palette.accentGlow}" stroke-width="2" filter="url(#dorado-glow)" />
          </g>
        `;
        break;
      }
    }

    // -----------------------------------------------------------------------
    // KINETIC LYRIC SVG LAYER GENERATOR
    // -----------------------------------------------------------------------
    const lyricEn = s.lyricEn || '';
    const lyricOriginal = s.lyricOriginal || '';
    let lyricLayerSVG = '';

    if (lyricEn || lyricOriginal) {
      if (!isClimax) {
        // Sparse & Intimate Mode (Lower Left)
        const posX = width * 0.085;
        const posY = height * 0.84;
        lyricLayerSVG = `
          <g id="layer-kinetic-lyrics" opacity="0.95">
            ${lyricOriginal ? `
              <text x="${posX}" y="${posY - 44}" font-family="'Noto Serif KR', Georgia, serif" font-size="20" font-weight="300"
                    fill="${palette.textSecondary}" opacity="0.82" letter-spacing="1.5">
                ${escapeXml(lyricOriginal)}
              </text>
            ` : ''}
            <text x="${posX}" y="${posY}" font-family="'Playfair Display', Georgia, 'Times New Roman', serif" font-style="italic" font-size="40"
                  fill="${palette.textPrimary}" filter="url(#dorado-glow)" letter-spacing="0.5">
              ${escapeXml(lyricEn)}
            </text>
            <!-- Quill underline -->
            <path d="M ${posX} ${posY + 16} Q ${posX + 180} ${posY + 20}, ${posX + 360} ${posY + 16}"
                  fill="none" stroke="${palette.primaryStroke}" stroke-width="1.8" stroke-linecap="round" stroke-opacity="0.65" />
          </g>
        `;
      } else {
        // Stage Climax Conviction Mode (Centered Lower-Third)
        const centerY = height * 0.81;
        lyricLayerSVG = `
          <g id="layer-kinetic-lyrics" opacity="0.98">
            ${lyricOriginal ? `
              <text x="${cx}" y="${centerY - 52}" text-anchor="middle" font-family="'Noto Serif KR', Georgia, serif" font-size="22" font-weight="300"
                    fill="${palette.textSecondary}" opacity="0.88" letter-spacing="2">
                ${escapeXml(lyricOriginal)}
              </text>
            ` : ''}
            <text x="${cx}" y="${centerY}" text-anchor="middle" font-family="'Playfair Display', 'Cinzel', Georgia, serif" font-size="52" font-weight="600"
                  fill="${palette.textPrimary}" filter="url(#dorado-glow)" letter-spacing="4">
              ${escapeXml(lyricEn)}
            </text>
            <!-- Climax Golden Wings Underline -->
            <path d="M ${cx - 260} ${centerY + 22} Q ${cx - 130} ${centerY + 27}, ${cx} ${centerY + 22} Q ${cx + 130} ${centerY + 27}, ${cx + 260} ${centerY + 22}"
                  fill="none" stroke="${palette.primaryStroke}" stroke-width="2.2" stroke-linecap="round" filter="url(#dorado-glow)" />
            <polygon points="${cx},${centerY + 16} ${cx + 5},${centerY + 22} ${cx},${centerY + 28} ${cx - 5},${centerY + 22}"
                     fill="${palette.accentGlow}" />
          </g>
        `;
      }
    }

    // -----------------------------------------------------------------------
    // FULL SVG DOCUMENT STRING ASSEMBLY
    // -----------------------------------------------------------------------
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <!-- Oklab Backdrop Linear Gradient -->
    <linearGradient id="bg-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${palette.bgTop}" />
      <stop offset="100%" stop-color="${palette.bgBottom}" />
    </linearGradient>

    <!-- Bokeh Radial Gradients -->
    <radialGradient id="bokeh-radial-1" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${palette.accentGlow}" stop-opacity="0.45" />
      <stop offset="60%" stop-color="${palette.primaryStroke}" stop-opacity="0.2" />
      <stop offset="100%" stop-color="${palette.primaryStroke}" stop-opacity="0.0" />
    </radialGradient>
    <radialGradient id="bokeh-radial-2" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${palette.primaryStroke}" stop-opacity="0.4" />
      <stop offset="70%" stop-color="${palette.secondaryStroke}" stop-opacity="0.15" />
      <stop offset="100%" stop-color="${palette.secondaryStroke}" stop-opacity="0.0" />
    </radialGradient>

    <!-- Core Bloom Radial Gradient -->
    <radialGradient id="core-bloom-radial" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
      <stop offset="35%" stop-color="${palette.accentGlow}" stop-opacity="0.85" />
      <stop offset="75%" stop-color="${palette.primaryStroke}" stop-opacity="0.3" />
      <stop offset="100%" stop-color="${palette.primaryStroke}" stop-opacity="0.0" />
    </radialGradient>

    <!-- High-Fidelity Glow Filter -->
    <filter id="dorado-glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur1" />
      <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="blur2" />
      <feMerge>
        <feMergeNode in="blur2" />
        <feMergeNode in="blur1" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <!-- 1. Layer Backdrop -->
  <g id="layer-backdrop">
    <rect width="${width}" height="${height}" fill="url(#bg-grad)" />
  </g>

  <!-- 2. Layer Midground Parallax -->
  <g id="layer-midground-parallax" transform="${parallaxTransform}">
    ${midgroundGeometrySVG}
  </g>

  <!-- 3. Layer Focal Confession -->
  <g id="layer-focal-confession" transform="${focalTransform}">
    ${focalGeometrySVG}
  </g>

  <!-- 4. Layer Atmosphere -->
  <g id="layer-atmosphere">
    <!-- Subtle Stardust Motes -->
    <circle cx="${cx - 450}" cy="${cy - 220}" r="2.5" fill="${palette.accentGlow}" opacity="0.75" />
    <circle cx="${cx + 520}" cy="${cy - 180}" r="2" fill="${palette.textPrimary}" opacity="0.65" />
    <circle cx="${cx - 320}" cy="${cy + 240}" r="3" fill="${palette.primaryStroke}" opacity="0.5" />
    <circle cx="${cx + 380}" cy="${cy + 210}" r="2.5" fill="${palette.accentGlow}" opacity="0.7" />
  </g>

  <!-- 5. Layer Kinetic Lyrics -->
  ${lyricLayerSVG}
</svg>`;
  }

  function escapeXml(unsafe) {
    if (!unsafe) return '';
    return String(unsafe)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  /**
   * Generates a complete standalone SVG document for the current scene and timestamp.
   * @param {Object} scene Active scene definition
   * @param {number} curTime Current playback position in seconds
   * @param {Object} options Rendering options
   * @returns {string} Standalone SVG XML string
   */
  function generateFullSVG(scene, curTime = 0, options = {}) {
    const s = scene || {};
    const localProgress = (s.startSec !== undefined && s.endSec && s.endSec > s.startSec)
      ? clamp((curTime - s.startSec) / Math.max(0.1, s.endSec - s.startSec), 0, 1)
      : 0.5;

    const audioTelemetry = (typeof window !== 'undefined' && window.DoradoStudio && window.DoradoStudio.AudioEngine && typeof window.DoradoStudio.AudioEngine.getRealtimeTelemetry === 'function')
      ? window.DoradoStudio.AudioEngine.getRealtimeTelemetry(curTime, s)
      : { energy: 0.25, bass: 0.2, conviction: s.convictionLevel || 0.5 };

    return renderSVGCode(s, localProgress, curTime, audioTelemetry, options.width || 1920, options.height || 1080);
  }

  // =========================================================================
  // 9. PUBLIC INTERFACE CONTRACT EXPORT
  // =========================================================================
  const SVGMotion = {
    MOTIF_CATALOG,
    PALETTES,
    renderSVGCode,
    generateFullSVG,
    drawVectorSceneToCanvas,
    drawKineticLyrics,
    // Utility helpers for diagnostics, testing & studio UI inspection
    computeCameraTransform,
    computeFocalRadius,
    sanitizeTelemetry,
    getPalette,
    hexToRgba,
    clamp,
    lerp,
    smoothstep
  };

  root.DoradoStudio = root.DoradoStudio || {};
  root.DoradoStudio.SVGMotion = SVGMotion;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SVGMotion;
  }
})(typeof window !== 'undefined' ? window : this);
