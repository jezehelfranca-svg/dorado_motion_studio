/**
 * ============================================================================
 * GWYN DORADO MOTION STUDIO — STORYTOLD CRAFT SUITE INTEGRATION BRIDGE
 * & MULTI-PROVIDER PARALLEL SUBAGENT EXPORTER
 * 
 * Module: 05_storytold_bridge.js
 * Namespace: window.DoradoStudio.StorytoldBridge
 * 
 * Integrates the high-performance pure-Rust media suite (Storytold Craft Suite):
 *   - FilmCraft   (Port 9876): Pure-Rust NLE Timeline, Lumetri Grading & Master Assembly
 *   - EffectCraft (Port 9877): Pure-Rust Motion Graphics, 306 Effects, 3D Camera & Lottie (.ecproj)
 *   - VectorCraft (Port 9878): Pure-Rust Vector Illustration, Pathfinder & Layered SVG Artboards
 *   - SoundCraft  (Port 7801): Pure-Rust DAW, Tempo/Beat Grid, Audio Health & LUFS Bounce
 *   - LightCraft  (Port 9879): Pure-Rust Non-Destructive RAW & Filmic Color Pipeline
 * 
 * Provides:
 *   1. STORYTOLD_REPOS catalog of all 5 tools, roles, binaries, and control ports.
 *   2. Programmatic CLI & JSON-lines control channel scripts for all 5 tools.
 *   3. Zero-Friction Multi-Provider Parallel Subagent Prompt Generator (7 Sharded Prompts)
 *      allowing Claude 3.7, OpenAI, Cursor, or Gemini to run concurrent pipelines
 *      without file-lock or race condition collisions.
 *   4. Client-side browser downloaders & live local control port telemetry pingers.
 * ============================================================================
 */

(function (global) {
  'use strict';

  // Ensure root namespace exists
  const DoradoStudio = global.DoradoStudio = global.DoradoStudio || {};

  /**
   * ==========================================================================
   * 1. STORYTOLD CRAFT SUITE CATALOG
   * ==========================================================================
   */
  const STORYTOLD_REPOS = Object.freeze({
    filmcraft: Object.freeze({
      id: "filmcraft",
      name: "FilmCraft",
      repo: "https://github.com/storytold/filmcraft",
      cli: "filmcraft-cli",
      defaultPort: 9876,
      role: "Pure-Rust NLE Timeline, Lumetri Grading & Master Assembly",
      description: "High-performance non-linear timeline editor written in pure Rust with real-time video sequencing, Lumetri grading, transition shaders, and multi-track audio mastering."
    }),
    effectcraft: Object.freeze({
      id: "effectcraft",
      name: "EffectCraft",
      repo: "https://github.com/storytold/effectcraft",
      cli: "effectcraft-cli",
      defaultPort: 9877,
      role: "Pure-Rust Motion Graphics, 306 Effects, 3D Camera & Lottie (.ecproj)",
      description: "Hardware-accelerated motion graphics compositor with 306 built-in Rust effects, bezier keyframing, 3D camera projections, and bi-directional Lottie / .ecproj interchange."
    }),
    vectorcraft: Object.freeze({
      id: "vectorcraft",
      name: "VectorCraft",
      repo: "https://github.com/storytold/vectorcraft",
      cli: "vectorcraft-cli",
      defaultPort: 9878,
      role: "Pure-Rust Vector Illustration, Pathfinder & Layered SVG Artboards",
      description: "Ultra-fast vector graphics and illustration engine supporting complex bezier curves, boolean pathfinder operations, multi-artboard SVG export, and live code-to-path compilation."
    }),
    soundcraft: Object.freeze({
      id: "soundcraft",
      name: "SoundCraft",
      repo: "https://github.com/storytold/soundcraft",
      cli: "soundcraft-cli",
      defaultPort: 7801,
      role: "Pure-Rust DAW, Tempo/Beat Grid, Audio Health & LUFS Bounce",
      description: "Zero-latency pure-Rust digital audio workstation and DSP rack featuring sub-sample beat grids, memory location markers, ITU-R BS.1770-4 LUFS compliance normalization, and stem bounce."
    }),
    lightcraft: Object.freeze({
      id: "lightcraft",
      name: "LightCraft",
      repo: "https://github.com/storytold/lightcraft",
      cli: "lightcraft-cli",
      defaultPort: 9879,
      role: "Pure-Rust Non-Destructive RAW & Filmic Color Pipeline",
      description: "Non-destructive filmic RAW development and color science engine supporting ACEScg, Oklab perceptual color space, 3D LUT generation, and chromatic flare simulation."
    })
  });

  /**
   * Safe helper to resolve a valid Sequence Bible with default fallback.
   * Resilient whether called before or after 01_creative_director.js loads.
   * 
   * @param {Object} bible
   * @returns {Object} Fully populated Sequence Bible
   */
  function resolveBible(bible) {
    if (bible && Array.isArray(bible.scenes) && bible.scenes.length > 0) {
      return bible;
    }

    // Try CreativeDirector preset
    if (DoradoStudio.CreativeDirector && typeof DoradoStudio.CreativeDirector.getPresetSong === 'function') {
      const preset = DoradoStudio.CreativeDirector.getPresetSong('losing_my_heart');
      if (preset) return preset;
    }

    // Resilient built-in fallback
    return {
      songId: "losing_my_heart",
      title: "Losing My Heart",
      koreanTitle: "마음을 놓치다",
      album: "Famous Singers 4: OST (Studio Slam / JTBC)",
      bpm: 68,
      durationSec: 64,
      defaultOklabProfile: "moonlit_confession",
      styleDna: "Intimate Korean acoustic ballad; breathless close-mic vocal, gentle fingerstyle acoustic guitar, and moonlit ink calligraphy dissolving into dark indigo parchment.",
      scenes: [
        {
          id: "scene_01",
          index: 0,
          section: "Intro",
          startSec: 0,
          endSec: 8,
          lyricOriginal: "조용한 밤, 숨결만 남은 텅 빈 방 안...",
          lyricEn: "A quiet night, only breath remains in this empty room...",
          convictionLevel: 0.16,
          negativeSpaceRatio: 0.84,
          svgMotif: "ink_confession",
          sdfPreset: "moonlit_mist",
          oklabPalette: "moonlit_confession",
          cameraMotion: "slow_breathe",
          strokeSpeed: 0.8,
          particleDensity: 0.15,
          rationale: "Sparse single-stroke calligraphy on dark parchment establishes the private confession premise with 84% negative space."
        },
        {
          id: "scene_02",
          index: 1,
          section: "Verse 1",
          startSec: 8,
          endSec: 16,
          lyricOriginal: "달빛 아래 숨겨둔 마음, 차가운 창가에 기대어",
          lyricEn: "A quiet heart hidden beneath the moonlight, leaning against the cold window",
          convictionLevel: 0.24,
          negativeSpaceRatio: 0.78,
          svgMotif: "window_rain",
          sdfPreset: "moonlit_mist",
          oklabPalette: "moonlit_confession",
          cameraMotion: "gentle_drift_right",
          strokeSpeed: 1.0,
          particleDensity: 0.22,
          rationale: "Delicate condensation droplets slide down cool glass; the stripped-back human foundation honors close vocal intimacy."
        },
        {
          id: "scene_03",
          index: 2,
          section: "Pre-Chorus",
          startSec: 16,
          endSec: 24,
          lyricOriginal: "점점 번져가는 그림자 속으로 나를 놓쳐버릴까 봐",
          lyricEn: "Fearing I might lose myself in the deepening shadows",
          convictionLevel: 0.48,
          negativeSpaceRatio: 0.62,
          svgMotif: "acoustic_strings",
          sdfPreset: "moonlit_mist",
          oklabPalette: "moonlit_confession",
          cameraMotion: "parallax_rise",
          strokeSpeed: 1.25,
          particleDensity: 0.38,
          rationale: "Resonating string vectors radiate through subtle mist as harmonic tension builds towards the first confession crest."
        },
        {
          id: "scene_04",
          index: 3,
          section: "Chorus 1",
          startSec: 24,
          endSec: 32,
          lyricOriginal: "마음을 놓치다, 너의 손끝이 닿았던 그 자리에서",
          lyricEn: "Losing my heart, right where your fingertips once lingered",
          convictionLevel: 0.76,
          negativeSpaceRatio: 0.44,
          svgMotif: "celestial_bloom",
          sdfPreset: "moonlit_mist",
          oklabPalette: "moonlit_confession",
          cameraMotion: "orbital_bloom",
          strokeSpeed: 1.5,
          particleDensity: 0.65,
          rationale: "Luminescent celestial flower blooms outwards, emotional release framed within deep indigo negative space."
        },
        {
          id: "scene_05",
          index: 4,
          section: "Verse 2",
          startSec: 32,
          endSec: 40,
          lyricOriginal: "비워낸 가슴에 고인 너의 이름, 지우려 애써도 선명해",
          lyricEn: "Your name pools inside my hollowed chest; no matter how I try, it stays vivid",
          convictionLevel: 0.38,
          negativeSpaceRatio: 0.72,
          svgMotif: "ink_confession",
          sdfPreset: "moonlit_mist",
          oklabPalette: "moonlit_confession",
          cameraMotion: "slow_breathe",
          strokeSpeed: 1.1,
          particleDensity: 0.30,
          rationale: "Dynamic trough after chorus release: negative space widens back to 72%, centering solitary reflection."
        },
        {
          id: "scene_06",
          index: 5,
          section: "Chorus 2",
          startSec: 40,
          endSec: 48,
          lyricOriginal: "다시 널 부르다 무너져도, 이 아픔마저 너라면",
          lyricEn: "Even if I crumble calling you again, if this pain is yours, I accept it",
          convictionLevel: 0.82,
          negativeSpaceRatio: 0.38,
          svgMotif: "celestial_bloom",
          sdfPreset: "golden_bloom",
          oklabPalette: "stage_conviction_gold",
          cameraMotion: "orbital_bloom",
          strokeSpeed: 1.6,
          particleDensity: 0.75,
          rationale: "Second emotional wave swells with higher conviction and amber-gold luminescence."
        },
        {
          id: "scene_07",
          index: 6,
          section: "Bridge",
          startSec: 48,
          endSec: 56,
          lyricOriginal: "온 세상을 다 주어도 바꿀 수 없던 너라는 단 하나의 빛!",
          lyricEn: "The single light that all the world could never replace—it was always you!",
          convictionLevel: 0.95,
          negativeSpaceRatio: 0.32,
          svgMotif: "royal_lotus",
          sdfPreset: "golden_bloom",
          oklabPalette: "stage_conviction_gold",
          cameraMotion: "parallax_rise",
          strokeSpeed: 1.9,
          particleDensity: 0.92,
          rationale: "The Peak of Stage-Level Conviction (95%): full kinetic power channeled into royal lotus, anchored by 32% negative space."
        },
        {
          id: "scene_08",
          index: 7,
          section: "Outro",
          startSec: 56,
          endSec: 64,
          lyricOriginal: "달빛마저 잠든 밤... 안녕, 내 사랑",
          lyricEn: "Even the moonlight falls asleep tonight... goodbye, my quiet love",
          convictionLevel: 0.18,
          negativeSpaceRatio: 0.86,
          svgMotif: "ink_confession",
          sdfPreset: "moonlit_mist",
          oklabPalette: "moonlit_confession",
          cameraMotion: "fade_still",
          strokeSpeed: 0.7,
          particleDensity: 0.12,
          rationale: "Final fade to an intimate whisper: remaining particles decelerate into quiet dark space (86% negative ratio)."
        }
      ]
    };
  }

  /**
   * Formats seconds into HH:MM:SS.mmm format for NLE/DAW markers.
   */
  function formatTimecode(sec) {
    const s = Math.max(0, Number(sec) || 0);
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = Math.floor(s % 60);
    const millis = Math.floor((s % 1) * 1000);
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(millis).padStart(3, '0')}`;
  }

  /**
   * ==========================================================================
   * 2. PROGRAMMATIC PROJECT & CLI GENERATORS
   * ==========================================================================
   */

  /**
   * Generates both a shell script (`filmcraft-cli`) AND the exact JSON-lines
   * control channel payload for every scene in `bible.scenes`.
   * 
   * @param {Object} bible - Sequence Bible
   * @returns {Object} { shellScript, jsonLines, commands, summary, toString() }
   */
  function generateFilmCraftScript(bible) {
    const b = resolveBible(bible);
    const songId = b.songId || "gwyn_dorado_mv";
    const scenes = b.scenes || [];
    const totalDuration = b.durationSec || 64;
    const fps = 30;

    const jsonLinesArray = [];
    let rpcId = 1;

    // 1. Project Initialization Command
    jsonLinesArray.push({
      jsonrpc: "2.0",
      id: rpcId++,
      method: "engine.execute",
      params: {
        command: "project.create",
        name: `MV_${songId}`,
        resolution: [3840, 2160],
        fps: fps,
        colorSpace: "ACEScg_Oklab",
        sampleRate: 48000
      }
    });

    // 2. Tracks Initialization
    jsonLinesArray.push({
      jsonrpc: "2.0",
      id: rpcId++,
      method: "engine.execute",
      params: { command: "timeline.createTrack", track: "V1", kind: "video", name: "Visual Shards" }
    });
    jsonLinesArray.push({
      jsonrpc: "2.0",
      id: rpcId++,
      method: "engine.execute",
      params: { command: "timeline.createTrack", track: "V2", kind: "video", name: "Kinetic Typography" }
    });
    jsonLinesArray.push({
      jsonrpc: "2.0",
      id: rpcId++,
      method: "engine.execute",
      params: { command: "timeline.createTrack", track: "A1", kind: "audio", name: "Master Audio -14LUFS" }
    });

    // 3. Audio Track Placement
    jsonLinesArray.push({
      jsonrpc: "2.0",
      id: rpcId++,
      method: "engine.execute",
      params: {
        command: "timeline.place",
        track: "A1",
        inPoint: 0.0,
        outPoint: totalDuration,
        asset: `workspace/runs/${songId}/audio/master_normalized_-14LUFS.wav`,
        label: `${b.title} Master Audio`
      }
    });

    // Shell script lines buffer
    const shLines = [
      "#!/usr/bin/env bash",
      "# ============================================================================",
      `# FilmCraft Pure-Rust NLE Timeline & Lumetri Master Assembly Script`,
      `# Song: ${b.title} (${b.koreanTitle})`,
      `# Duration: ${totalDuration}s | BPM: ${b.bpm} | FPS: ${fps} | Target: 4K UHD`,
      "# Control Channel Port: 9876",
      "# ============================================================================",
      "set -euo pipefail",
      "",
      `echo "[FilmCraft] Initializing Master Timeline for MV_${songId}..."`,
      "",
      `# 1. Initialize NLE Project`,
      `filmcraft-cli project new "MV_${songId}" \\`,
      `  --width 3840 --height 2160 --fps ${fps} \\`,
      `  --colorspace "ACEScg" \\`,
      `  --out "workspace/runs/${songId}/assembly/MV_${songId}.fcproj"`,
      "",
      `# 2. Add Audio Master Track`,
      `filmcraft-cli timeline place \\`,
      `  --track A1 \\`,
      `  --asset "workspace/runs/${songId}/audio/master_normalized_-14LUFS.wav" \\`,
      `  --start 0.0 \\`,
      `  --duration ${totalDuration} \\`,
      `  --label "${b.title} (Master Audio)"`,
      "",
      `# 3. Assemble Visual Shards & Apply Lumetri Color Grading`
    ];

    scenes.forEach((scene, idx) => {
      const dur = Math.round((scene.endSec - scene.startSec) * 100) / 100;
      const shardVideoPath = `workspace/runs/${songId}/shards/${scene.id}/render.mp4`;
      const shardLyricsPath = `workspace/runs/${songId}/shards/${scene.id}/lyrics.svg`;

      // JSON-lines timeline placement for video shard
      jsonLinesArray.push({
        jsonrpc: "2.0",
        id: rpcId++,
        method: "engine.execute",
        params: {
          command: "timeline.place",
          track: "V1",
          clipIndex: idx,
          inPoint: scene.startSec,
          outPoint: scene.endSec,
          start: scene.startSec,
          duration: dur,
          asset: shardVideoPath,
          label: `${scene.id}: ${scene.section}`
        }
      });

      // JSON-lines timeline placement for lyric overlay
      jsonLinesArray.push({
        jsonrpc: "2.0",
        id: rpcId++,
        method: "engine.execute",
        params: {
          command: "timeline.place",
          track: "V2",
          clipIndex: idx,
          inPoint: scene.startSec,
          outPoint: scene.endSec,
          start: scene.startSec,
          duration: dur,
          asset: shardLyricsPath,
          label: `${scene.id} Lyrics`
        }
      });

      // Lumetri grading parameters derived from Blooming Arc & Oklab profile
      const exposureVal = Math.round((0.10 + (scene.convictionLevel * 0.25)) * 100) / 100;
      const contrastVal = Math.round((1.05 + (scene.convictionLevel * 0.22)) * 100) / 100;
      const vignetteVal = Math.round((scene.negativeSpaceRatio * 0.55) * 100) / 100;
      const tempVal = scene.oklabPalette === "stage_conviction_gold" ? 14.0 : -10.5;

      jsonLinesArray.push({
        jsonrpc: "2.0",
        id: rpcId++,
        method: "engine.execute",
        params: {
          command: "effects.setParam",
          params: {
            track: "V1",
            clipIndex: idx,
            effect: "lumetri",
            param: "exposure",
            value: exposureVal
          }
        }
      });

      jsonLinesArray.push({
        jsonrpc: "2.0",
        id: rpcId++,
        method: "engine.execute",
        params: {
          command: "effects.setParam",
          params: {
            track: "V1",
            clipIndex: idx,
            effect: "lumetri",
            param: "temperature",
            value: tempVal
          }
        }
      });

      jsonLinesArray.push({
        jsonrpc: "2.0",
        id: rpcId++,
        method: "engine.execute",
        params: {
          command: "effects.setParam",
          params: {
            track: "V1",
            clipIndex: idx,
            effect: "lumetri",
            param: "contrast",
            value: contrastVal
          }
        }
      });

      jsonLinesArray.push({
        jsonrpc: "2.0",
        id: rpcId++,
        method: "engine.execute",
        params: {
          command: "effects.setParam",
          params: {
            track: "V1",
            clipIndex: idx,
            effect: "lumetri",
            param: "vignette",
            value: vignetteVal
          }
        }
      });

      // Shell Script Section
      shLines.push(`echo "[FilmCraft] Placing ${scene.id} (${scene.section}: ${scene.startSec}s -> ${scene.endSec}s)..."`);
      shLines.push(`filmcraft-cli timeline place \\`);
      shLines.push(`  --track V1 \\`);
      shLines.push(`  --asset "${shardVideoPath}" \\`);
      shLines.push(`  --start ${scene.startSec} \\`);
      shLines.push(`  --duration ${dur} \\`);
      shLines.push(`  --label "${scene.id} (${scene.section})"`);
      shLines.push(`filmcraft-cli effects set-param --track V1 --clip ${idx} --effect lumetri --param exposure ${exposureVal}`);
      shLines.push(`filmcraft-cli effects set-param --track V1 --clip ${idx} --effect lumetri --param temperature ${tempVal}`);
      shLines.push(`filmcraft-cli effects set-param --track V1 --clip ${idx} --effect lumetri --param contrast ${contrastVal}`);
      shLines.push(`filmcraft-cli effects set-param --track V1 --clip ${idx} --effect lumetri --param vignette ${vignetteVal}`);
      shLines.push("");
    });

    // Final Export Script Lines
    shLines.push(`# 4. Master 4K ProRes 422 HQ & H.265 Render`);
    shLines.push(`echo "[FilmCraft] Rendering Final Master 4K Video..."`);
    shLines.push(`filmcraft-cli export \\`);
    shLines.push(`  --project "workspace/runs/${songId}/assembly/MV_${songId}.fcproj" \\`);
    shLines.push(`  --preset "ProRes422HQ" \\`);
    shLines.push(`  --audio "workspace/runs/${songId}/audio/master_normalized_-14LUFS.wav" \\`);
    shLines.push(`  --out "workspace/runs/${songId}/renders/master_${songId}_prores422hq.mov"`);
    shLines.push(`filmcraft-cli export \\`);
    shLines.push(`  --project "workspace/runs/${songId}/assembly/MV_${songId}.fcproj" \\`);
    shLines.push(`  --preset "H265_Broadcast" \\`);
    shLines.push(`  --bitrate 45M \\`);
    shLines.push(`  --audio "workspace/runs/${songId}/audio/master_normalized_-14LUFS.wav" \\`);
    shLines.push(`  --out "workspace/runs/${songId}/renders/master_${songId}_4k60.mp4"`);
    shLines.push(`echo "[FilmCraft] Assembly complete. Saved to workspace/runs/${songId}/renders/"`);

    const jsonLinesOutput = jsonLinesArray.map(obj => JSON.stringify(obj)).join('\n');
    const shellScriptOutput = shLines.join('\n');

    return {
      shellScript: shellScriptOutput,
      jsonLines: jsonLinesOutput,
      commands: jsonLinesArray,
      summary: `Generated FilmCraft Assembly with ${scenes.length} video shards, Lumetri Oklab color grading, and ProRes/H.265 export pipelines.`,
      toString: function () { return shellScriptOutput; }
    };
  }

  /**
   * Generates a complete `.ecproj` JSON composition structure AND `effectcraft-cli`
   * commands driven by `bible.scenes`.
   * 
   * @param {Object} bible - Sequence Bible
   * @param {Object} [activeScene] - Optional single scene filter
   * @returns {Object} { ecproj, ecprojString, cliCommands, script, toString() }
   */
  function generateEffectCraftProject(bible, activeScene) {
    const b = resolveBible(bible);
    const songId = b.songId || "gwyn_dorado_mv";
    const scenes = activeScene ? [activeScene] : (b.scenes || []);
    const totalDuration = b.durationSec || 64;
    const width = 3840;
    const height = 2160;
    const fps = 30;

    const comps = [];

    // Main Master Composition
    const mainComp = {
      id: "comp_main",
      name: "Main",
      width: width,
      height: height,
      fps: fps,
      duration: totalDuration,
      camera: {
        type: "3D",
        fov: 45.0,
        position: [0.0, 0.0, -1000.0],
        target: [0.0, 0.0, 0.0],
        dof: { enabled: true, focusDistance: 1000.0, aperture: 2.8 }
      },
      layers: []
    };

    const cliCommands = [
      "#!/usr/bin/env bash",
      "# ============================================================================",
      `# EffectCraft Pure-Rust Motion Graphics & SDF Shader Automation Script`,
      `# Song: ${b.title} (${b.koreanTitle})`,
      `# Control Channel Port: 9877`,
      "# ============================================================================",
      "set -euo pipefail",
      "",
      `echo "[EffectCraft] Initializing .ecproj composition tree..."`,
      `effectcraft-cli project new "workspace/runs/${songId}/effectcraft/master.ecproj" --width ${width} --height ${height} --fps ${fps}`
    ];

    scenes.forEach((scene, idx) => {
      const dur = Math.round((scene.endSec - scene.startSec) * 100) / 100;
      const compId = `comp_${scene.id}`;

      // Scene-specific Sub-Composition
      const sceneComp = {
        id: compId,
        name: `${scene.id}_${scene.section}`,
        width: width,
        height: height,
        fps: fps,
        duration: dur,
        camera: {
          type: "3D",
          fov: 42.0,
          motion: scene.cameraMotion || "slow_breathe",
          position: [0.0, 0.0, -950.0],
          target: [0.0, 0.0, 0.0]
        },
        layers: [
          {
            id: `layer_${scene.id}_bg_svg`,
            name: "01_VectorCraft_Artboard_SVG",
            type: "vector_artboard",
            source: `workspace/runs/${songId}/shards/${scene.id}/artboard.svg`,
            transform: {
              position: [width / 2, height / 2, 0],
              scale: [100, 100, 100],
              opacity: 1.0
            },
            blendMode: "normal"
          },
          {
            id: `layer_${scene.id}_sdf_atmosphere`,
            name: `02_SDF_${scene.sdfPreset}`,
            type: "sdf_shader",
            shaderPreset: scene.sdfPreset || "moonlit_mist",
            parameters: {
              density: scene.particleDensity || 0.25,
              conviction: scene.convictionLevel || 0.2,
              negativeSpace: scene.negativeSpaceRatio || 0.75,
              palette: scene.oklabPalette || "moonlit_confession"
            },
            blendMode: "screen",
            opacity: 0.88
          },
          {
            id: `layer_${scene.id}_lyrics_lottie`,
            name: "03_Kinetic_Typography_Lottie",
            type: "lottie_layer",
            source: `workspace/runs/${songId}/shards/${scene.id}/lyrics.lottie.json`,
            transform: {
              position: [width / 2, height * 0.82, 0],
              scale: [100, 100, 100],
              opacity: 1.0
            },
            blendMode: "normal"
          },
          {
            id: `layer_${scene.id}_lumetri_grade`,
            name: "04_Oklab_Adjustment_Grade",
            type: "adjustment",
            effect: "lumetri_oklab",
            parameters: {
              kCurveContrast: scene.convictionLevel >= 0.85 ? 2.4 : 1.8,
              chromaBoost: scene.convictionLevel >= 0.85 ? 1.3 : 1.15,
              vignette: scene.negativeSpaceRatio * 0.5,
              grain: 0.035
            }
          }
        ]
      };

      comps.push(sceneComp);

      // Add to Main Composition as sequential layer
      mainComp.layers.push({
        id: `main_layer_${scene.id}`,
        name: `Scene_${scene.index + 1}_${scene.section}`,
        type: "composition_instance",
        compositionId: compId,
        inPoint: scene.startSec,
        outPoint: scene.endSec,
        transform: {
          position: [width / 2, height / 2, 0],
          scale: [100, 100, 100],
          opacity: 1.0
        }
      });

      // CLI Commands for this scene
      cliCommands.push(`echo "[EffectCraft] Configuring Comp ${sceneComp.name}..."`);
      cliCommands.push(`effectcraft-cli comp add "${sceneComp.name}" --width ${width} --height ${height} --duration ${dur}`);
      cliCommands.push(`effectcraft-cli set "${sceneComp.name}" '#1' transform/position ${width / 2} ${height / 2} 0`);
      cliCommands.push(`effectcraft-cli set "${sceneComp.name}" '#1' transform/opacity 1.0`);
      cliCommands.push(`effectcraft-cli set "${sceneComp.name}" '#2' effects/sdf/preset "${scene.sdfPreset}"`);
      cliCommands.push(`effectcraft-cli set "${sceneComp.name}" '#2' effects/sdf/density ${scene.particleDensity}`);
      cliCommands.push(`effectcraft-cli exec file.exportLottie --comp "${sceneComp.name}" --out "workspace/runs/${songId}/shards/${scene.id}/motion.lottie.json"`);
      cliCommands.push(`effectcraft-cli render --comp "${sceneComp.name}" --out "workspace/runs/${songId}/shards/${scene.id}/render.mp4" --bitrate 45M --fps ${fps}`);
      cliCommands.push("");
    });

    comps.unshift(mainComp);

    // Final Main Render Command
    cliCommands.push(`echo "[EffectCraft] Rendering Master Composition..."`);
    cliCommands.push(`effectcraft-cli render --comp Main --out "workspace/runs/${songId}/renders/effectcraft_master.mp4" --bitrate 50M --fps ${fps}`);

    const ecprojObject = {
      format: "EffectCraft_Project",
      version: "1.4.0",
      generator: "DoradoMotion Studio (05_storytold_bridge.js)",
      createdAt: new Date().toISOString(),
      songId: songId,
      metadata: {
        title: b.title,
        koreanTitle: b.koreanTitle,
        bpm: b.bpm,
        durationSec: totalDuration,
        resolution: [width, height],
        fps: fps
      },
      compositions: comps
    };

    const ecprojString = JSON.stringify(ecprojObject, null, 2);
    const cliScript = cliCommands.join('\n');

    return {
      ecproj: ecprojObject,
      ecprojString: ecprojString,
      cliCommands: cliCommands,
      script: cliScript,
      summary: `Generated EffectCraft project with ${comps.length} compositions (Main + ${scenes.length} sub-comps) and Lottie/MP4 render commands.`,
      toString: function () { return cliScript; }
    };
  }

  /**
   * Generates `vectorcraft-cli` MCP/CLI automation commands to export multi-layer
   * SVG artboards for each scene.
   * 
   * @param {Object} bible - Sequence Bible
   * @param {Object} [activeScene] - Optional single scene filter
   * @returns {Object} { commands, script, toString() }
   */
  function generateVectorCraftCommands(bible, activeScene) {
    const b = resolveBible(bible);
    const songId = b.songId || "gwyn_dorado_mv";
    const scenes = activeScene ? [activeScene] : (b.scenes || []);
    const width = 3840;
    const height = 2160;

    const commands = [
      "#!/usr/bin/env bash",
      "# ============================================================================",
      `# VectorCraft Pure-Rust Vector Artboard & Pathfinder Automation Script`,
      `# Song: ${b.title} (${b.koreanTitle})`,
      `# Target: 3840x2160 Pure SVG Vector Artboards with Negative-Space Invariants`,
      "# Control Channel Port: 9878",
      "# ============================================================================",
      "set -euo pipefail",
      "",
      `echo "[VectorCraft] Generating Multi-Layer Artboards for ${songId}..."`
    ];

    scenes.forEach(scene => {
      const artboardName = `Artboard_${scene.id}_${scene.section.replace(/\s+/g, '_')}`;
      const outSvg = `workspace/runs/${songId}/shards/${scene.id}/artboard.svg`;
      const negPercent = Math.round(scene.negativeSpaceRatio * 100);

      commands.push("");
      commands.push(`echo "[VectorCraft] Creating ${artboardName} (${negPercent}% negative space)..."`);
      commands.push(`vectorcraft-cli artboard new "${artboardName}" \\`);
      commands.push(`  --width ${width} --height ${height} \\`);
      commands.push(`  --viewbox "0 0 ${width} ${height}" \\`);
      commands.push(`  --background "#05070B"`);

      // Add functional vector layers
      commands.push(`vectorcraft-cli layer add "01_NegativeSpace_Ground" --artboard "${artboardName}" --opacity 1.0`);
      commands.push(`vectorcraft-cli layer add "02_Motif_${scene.svgMotif}" --artboard "${artboardName}" --opacity 0.95`);
      commands.push(`vectorcraft-cli layer add "03_Gwyn_Ink_Calligraphy" --artboard "${artboardName}" --opacity 0.90`);
      commands.push(`vectorcraft-cli layer add "04_Atmospheric_Particles" --artboard "${artboardName}" --opacity 0.85`);

      // Import procedural bezier vectors & apply pathfinder operations
      commands.push(`vectorcraft-cli path import "assets/vectors/motifs/${scene.svgMotif}.svg" \\`);
      commands.push(`  --artboard "${artboardName}" \\`);
      commands.push(`  --layer "02_Motif_${scene.svgMotif}" \\`);
      commands.push(`  --align center --scale ${Math.round((0.8 + scene.convictionLevel * 0.4) * 100) / 100}`);

      commands.push(`vectorcraft-cli pathfinder boolean union \\`);
      commands.push(`  --artboard "${artboardName}" \\`);
      commands.push(`  --layer "02_Motif_${scene.svgMotif}"`);

      // Export pure-vector code-SVG with zero bitmaps
      commands.push(`vectorcraft-cli export \\`);
      commands.push(`  --artboard "${artboardName}" \\`);
      commands.push(`  --format svg \\`);
      commands.push(`  --precision 3 \\`);
      commands.push(`  --minify false \\`);
      commands.push(`  --out "${outSvg}"`);
    });

    commands.push("");
    commands.push(`echo "[VectorCraft] Successfully generated all ${scenes.length} vector artboards."`);

    const scriptOutput = commands.join('\n');
    return {
      commands: commands,
      script: scriptOutput,
      summary: `Generated VectorCraft CLI commands for ${scenes.length} multi-layer 4K SVG artboards.`,
      toString: function () { return scriptOutput; }
    };
  }

  /**
   * Generates `soundcraft-cli run` commands setting tempo map (`bible.bpm`),
   * memory locations for each song section (`Intro`, `Verse 1`, `Chorus`, `Bridge`),
   * and LUFS normalization bounce.
   * 
   * @param {Object} bible - Sequence Bible
   * @returns {Object} { commands, script, markers, summary, toString() }
   */
  function generateSoundCraftCommands(bible) {
    const b = resolveBible(bible);
    const songId = b.songId || "gwyn_dorado_mv";
    const bpm = b.bpm || 68;
    const totalDuration = b.durationSec || 64;
    const scenes = b.scenes || [];

    const markers = scenes.map(s => ({
      name: `${s.section}: ${s.id}`,
      timeSec: s.startSec,
      timecode: formatTimecode(s.startSec),
      color: s.section.toLowerCase().includes("chorus") ? "#f59e0b" : (s.section.toLowerCase().includes("bridge") ? "#ec4899" : "#38bdf8")
    }));

    const commands = [
      "#!/usr/bin/env bash",
      "# ============================================================================",
      `# SoundCraft Pure-Rust DAW Automation & LUFS Normalization Script`,
      `# Song: ${b.title} (${b.koreanTitle})`,
      `# Tempo: ${bpm} BPM | Time Signature: 4/4 | Target: -14.0 LUFS (±0.5), -1.0 dBTP`,
      "# Control Channel Port: 7801",
      "# ============================================================================",
      "set -euo pipefail",
      "",
      `echo "[SoundCraft] Initializing DAW session for ${songId}..."`,
      `soundcraft-cli session new "DAW_${songId}" --rate 48000 --bit-depth 24`,
      `soundcraft-cli tempo set ${bpm} --time-signature 4/4`,
      `soundcraft-cli markers clear`
    ];

    // Add Memory Location Markers for every section
    commands.push("");
    commands.push(`# Memory Location Markers`);
    markers.forEach(m => {
      commands.push(`soundcraft-cli marker add "${m.name}" --time "${m.timecode}" --color "${m.color}"`);
    });

    // Track Configuration
    commands.push("");
    commands.push(`# Stems Setup & Routing`);
    commands.push(`soundcraft-cli track add "Gwyn_Lead_Vocal" --color "#38bdf8" --gain -1.2 --pan center`);
    commands.push(`soundcraft-cli track add "Acoustic_Guitar_Fingerstyle" --color "#f59e0b" --gain -3.0 --pan center`);
    commands.push(`soundcraft-cli track add "String_Ensemble_Pad" --color "#818cf8" --gain -5.0 --stereo-width 1.25`);
    commands.push(`soundcraft-cli track add "Sub_Bass_Bloom" --color "#ec4899" --gain -6.5 --pan center`);

    // Master DSP, Audio Health & LUFS Normalization Bounce
    commands.push("");
    commands.push(`# Master DSP & ITU-R BS.1770-4 LUFS Normalization`);
    commands.push(`soundcraft-cli master eq --high-pass 30 --air-boost 12000 1.5`);
    commands.push(`soundcraft-cli master lufs-target \\`);
    commands.push(`  --integrated -14.0 \\`);
    commands.push(`  --true-peak -1.0 \\`);
    commands.push(`  --max-momentary -11.0 \\`);
    commands.push(`  --lra 6.5`);
    commands.push(`soundcraft-cli audit audio-health --in "workspace/runs/${songId}/audio/mixdown.wav"`);
    commands.push(`soundcraft-cli bounce \\`);
    commands.push(`  --start 0.0 \\`);
    commands.push(`  --duration ${totalDuration} \\`);
    commands.push(`  --format wav24 \\`);
    commands.push(`  --dither tpdf \\`);
    commands.push(`  --out "workspace/runs/${songId}/audio/master_normalized_-14LUFS.wav"`);
    commands.push("");
    commands.push(`echo "[SoundCraft] Audio master bounce complete: workspace/runs/${songId}/audio/master_normalized_-14LUFS.wav"`);

    const scriptOutput = commands.join('\n');
    return {
      commands: commands,
      script: scriptOutput,
      markers: markers,
      summary: `Generated SoundCraft DAW script with tempo map (${bpm} BPM), ${markers.length} section markers, and -14 LUFS mastering bounce.`,
      toString: function () { return scriptOutput; }
    };
  }

  /**
   * ==========================================================================
   * 3. ZERO-FRICTION PARALLEL SUBAGENT INSTRUCTION GENERATOR
   * ==========================================================================
   * Generates an array of 7 complete, copy-ready, zero-friction subagent
   * instruction prompts customized with the active song's exact data, shard
   * paths, and 5-Pillar rules so users can paste or download them for any
   * external AI provider (Claude, OpenAI, Cursor, Gemini, etc.) to run concurrently
   * without file-lock collisions.
   * 
   * @param {Object} bible - Sequence Bible
   * @returns {Array<Object>} Array of 7 prompt objects { id, filename, title, role, shardPath, content }
   */
  function generateParallelAgentPrompts(bible) {
    const b = resolveBible(bible);
    const songId = b.songId || "gwyn_dorado_mv";
    const title = b.title || "Losing My Heart";
    const koreanTitle = b.koreanTitle || "마음을 놓치다";
    const bpm = b.bpm || 68;
    const durationSec = b.durationSec || 64;
    const defaultOklab = b.defaultOklabProfile || "moonlit_confession";
    const styleDna = b.styleDna || "Private confession delivered with stage-level conviction.";
    const scenes = b.scenes || [];

    const sceneOverviewTable = scenes.map(s => 
      `| \`${s.id}\` | **${s.section}** | ${s.startSec}s – ${s.endSec}s | ${(s.convictionLevel * 100).toFixed(0)}% | ${(s.negativeSpaceRatio * 100).toFixed(0)}% | \`${s.svgMotif}\` | \`${s.cameraMotion}\` |`
    ).join('\n');

    const promptList = [];

    // ========================================================================
    // AGENT 01: AUDIO ARCHIVIST
    // ========================================================================
    promptList.push({
      id: "AGENT_01_AUDIO_ARCHIVIST",
      filename: "AGENT_01_AUDIO_ARCHIVIST.md",
      title: "Agent 01: Audio Archivist & Stem Harmonizer",
      role: "Audio Engineering & SoundCraft DSP Master",
      shardPath: `workspace/runs/${songId}/audio/`,
      content: `# SUBAGENT 01: AUDIO ARCHIVIST & STEM HARMONIZER
**Project:** Gwyn Dorado Music Video Studio — *${title}* (${koreanTitle})
**Target Shard Directory:** \`workspace/runs/${songId}/audio/\`
**Exclusive Output Files:**
- \`workspace/runs/${songId}/audio/stems_manifest.json\`
- \`workspace/runs/${songId}/audio/tempo_map.json\`
- \`workspace/runs/${songId}/audio/master_normalized_-14LUFS.wav\`
- \`workspace/runs/${songId}/audio/transcription_aligned.json\`

---

## 1. Zero-Friction Isolation Rules
1. **Directory Quarantine:** You have **EXCLUSIVE WRITE PERMISSION** to \`workspace/runs/${songId}/audio/\`.
2. **Zero Shared Write Lock:** NEVER write or modify any file outside this directory.
3. **Deterministic Output:** All downstream subagents (Agent 04, Agent 05, Agent 06) rely on your normalized audio file.

---

## 2. Active Song Metadata
- **Song ID:** \`${songId}\`
- **Title:** ${title} (${koreanTitle})
- **Album / Context:** ${b.album || "Famous Singers 4: OST (Studio Slam / JTBC)"}
- **Tempo:** ${bpm} BPM (4/4 time signature)
- **Duration:** ${durationSec} seconds
- **Style DNA:** ${styleDna}

---

## 3. The 5 Gwyn Dorado Pillars (Audio Execution Directives)
- **The Confession Check:** The vocal stem must preserve close-mic proximity, breath articulators, and dynamic micro-swells. Do not over-compress or remove natural breathing.
- **The Anti-Spectacle Check:** In verses, maintain sparse instrumentation (acoustic fingerstyle guitar + vocal presence). Let quiet passages breathe.
- **The Human Foundation Check:** Intro and Verse 1 must highlight acoustic warmth before adding any synthetic or string pads.
- **The Blooming Arc Check:** The crescendo must build organically from quiet vulnerability (Intro conviction ~16%) to stage-level conviction in the Bridge (~95%), then fade to whisper in the Outro (~18%).
- **Spatial Storytelling:** Verse stereo width = 0.85 (intimate, centered). Chorus stereo width = 1.25. Bridge stereo width = 1.40.

---

## 4. Execution Step-by-Step Instructions
1. **Initialize SoundCraft DAW Session:**
   \`\`\`bash
   soundcraft-cli session new "DAW_${songId}" --rate 48000 --bit-depth 24
   soundcraft-cli tempo set ${bpm} --time-signature 4/4
   \`\`\`
2. **Register Timeline Markers:**
${scenes.map(s => `   soundcraft-cli marker add "${s.section}: ${s.id}" --time "${formatTimecode(s.startSec)}" --color "${s.section.includes("Chorus") ? "#f59e0b" : "#38bdf8"}"`).join('\n')}
3. **Master Normalization (ITU-R BS.1770-4 Compliance):**
   - Integrated Target: **-14.0 LUFS** (±0.5 LUFS)
   - Max True Peak: **-1.0 dBTP**
   - Max Momentary LUFS: **-11.0 LUFS**
   \`\`\`bash
   soundcraft-cli master lufs-target --integrated -14.0 --true-peak -1.0 --max-momentary -11.0
   soundcraft-cli bounce --out "workspace/runs/${songId}/audio/master_normalized_-14LUFS.wav" --format wav24
   \`\`\`
4. **Export Manifests:**
   Save \`stems_manifest.json\` containing stem sample rates, dynamic range (LRA), and exact duration.

---

## 5. Verification Gate (Go / No-Go)
- [ ] \`master_normalized_-14LUFS.wav\` exists and duration is exactly ${durationSec}s.
- [ ] Integrated loudness is -14.0 LUFS ±0.5.
- [ ] True peak <= -1.0 dBTP.
- [ ] All 8 section markers are verified without timestamp overlaps.
`
    });

    // ========================================================================
    // AGENT 02: CREATIVE DIRECTOR
    // ========================================================================
    promptList.push({
      id: "AGENT_02_CREATIVE_DIRECTOR",
      filename: "AGENT_02_CREATIVE_DIRECTOR.md",
      title: "Agent 02: Creative Director & Sequence Bible Orchestrator",
      role: "Cinematography & Sequence Bible Formalizer",
      shardPath: `workspace/runs/${songId}/`,
      content: `# SUBAGENT 02: CREATIVE DIRECTOR & SEQUENCE BIBLE ORCHESTRATOR
**Project:** Gwyn Dorado Music Video Studio — *${title}* (${koreanTitle})
**Target Shard Directory:** \`workspace/runs/${songId}/\`
**Exclusive Output Files:**
- \`workspace/runs/${songId}/song_director_bible.json\`
- \`workspace/runs/${songId}/blooming_arc_audit.json\`
- \`workspace/runs/${songId}/scene_breakdown.csv\`

---

## 1. Zero-Friction Isolation Rules
1. **Directory Quarantine:** You have **EXCLUSIVE WRITE PERMISSION** for the master metadata files in \`workspace/runs/${songId}/\`.
2. **Immutable Downstream Contract:** Once \`song_director_bible.json\` is emitted, it serves as the immutable read-only contract for all parallel shard workers (Agents 03, 04, 05, 06).

---

## 2. Sequence Breakdown & Timeline
| Scene ID | Section | Time Window | Conviction | Negative Space | SVG Motif | Camera Motion |
|:---|:---|:---|:---:|:---:|:---|:---|
${sceneOverviewTable}

---

## 3. The 5 Gwyn Dorado Pillars (Formal Criteria)
1. **The Confession Check:** Every scene rationale must tie directly to interior psychological states, avoiding generic spectacle.
2. **The Anti-Spectacle Check:**
   - Every single scene MUST maintain at least **30% negative space**.
   - Sequence-wide average negative space MUST be **>= 50%** (Current plan: ~${(scenes.reduce((acc, s) => acc + s.negativeSpaceRatio, 0) / scenes.length * 100).toFixed(0)}%).
3. **The Human Foundation Check:** Scene 01 opening conviction MUST be **<= 35%** (Current: ${(scenes[0].convictionLevel * 100).toFixed(0)}%) with negative space **>= 65%**.
4. **The Blooming Arc Check:**
   - Dynamic Delta = \`Peak Conviction (Bridge) - Scene 01 Conviction\` MUST be **>= +0.45** (Current: +${((scenes[6] ? scenes[6].convictionLevel : 0.95) - scenes[0].convictionLevel).toFixed(2)}).
   - Outro scene conviction MUST drop back to **<= 35%** (Current: ${(scenes[scenes.length - 1].convictionLevel * 100).toFixed(0)}%).
5. **The Nuance Check:** Every scene must have a unique epistemic rationale.

---

## 4. Execution Step-by-Step Instructions
1. Audit and write \`song_director_bible.json\` conforming to the schema.
2. Generate \`blooming_arc_audit.json\` recording the math verification for each of the 5 pillars.
3. Export \`scene_breakdown.csv\` for downstream visual verification.
`
    });

    // ========================================================================
    // AGENT 03: CODE-SVG SCENE ARTBOARD CRAFTERS
    // ========================================================================
    promptList.push({
      id: "AGENT_03_SVG_SCENE_WORKERS",
      filename: "AGENT_03_SVG_SCENE_WORKERS.md",
      title: "Agent 03: Code-SVG Scene Artboard Crafters",
      role: "VectorCraft Vector Illustration & Pure Code-SVG Artist",
      shardPath: `workspace/runs/${songId}/shards/scene_XX/`,
      content: `# SUBAGENT 03: CODE-SVG SCENE ARTBOARD CRAFTERS
**Project:** Gwyn Dorado Music Video Studio — *${title}* (${koreanTitle})
**Target Shard Directories:** \`workspace/runs/${songId}/shards/scene_01/\` through \`scene_08/\`
**Exclusive Output Files:**
${scenes.map(s => `- \`workspace/runs/${songId}/shards/${s.id}/artboard.svg\``).join('\n')}
- \`workspace/runs/${songId}/shards/svg_manifest.json\`

---

## 1. Zero-Friction Isolation Rules
1. **Parallel Worker Architecture:** You may launch 8 independent parallel scene workers. Each worker writes **ONLY** to its assigned shard directory (\`scene_01/\`, \`scene_02/\`, etc.).
2. **No Bitmap Ingestion:** Strict Code-SVG rule! All visual assets must be 100% scalable vector code (bezier curves, polygon strokes, gradient meshes). No JPEG, PNG, or base64 raster blobs.

---

## 2. Technical Artboard Specifications
- **Canvas Resolution:** 3840 x 2160 pixels
- **ViewBox:** \`viewBox="0 0 3840 2160"\`
- **SVG Layer Hierarchy:**
  1. \`<g id="bg-negative-space">\` — Deep indigo/black background polygon (#05070B)
  2. \`<g id="motif-elements">\` — Procedural motif geometry (\`${scenes.map(s => s.svgMotif).join(', ')}\`)
  3. \`<g id="performer-silhouette">\` — Gwyn Dorado contour strokes with organic line variation
  4. \`<g id="atmospheric-particles">\` — Delicate vector stardust and mist motes
- **Stroke Style:** \`stroke-linecap="round"\`, \`stroke-linejoin="round"\`, organic hand-drawn ink quality.

---

## 3. Scene-by-Scene Vector Directives
${scenes.map(s => `### ${s.id.toUpperCase()}: ${s.section} (${s.startSec}s – ${s.endSec}s)
- **Motif:** \`${s.svgMotif}\`
- **Negative Space Target:** ${(s.negativeSpaceRatio * 100).toFixed(0)}% (DO NOT fill the center or edges beyond ${((1 - s.negativeSpaceRatio) * 100).toFixed(0)}% coverage)
- **Conviction / Stroke Weight:** ${(s.convictionLevel * 100).toFixed(0)}% (Stroke width: ${(0.8 + s.convictionLevel * 1.5).toFixed(1)}px)
- **Rationale:** ${s.rationale}
- **CLI Generator:**
  \`\`\`bash
  vectorcraft-cli artboard new "Artboard_${s.id}" --width 3840 --height 2160 --viewbox "0 0 3840 2160" --background "#05070B"
  vectorcraft-cli layer add "Motif_${s.svgMotif}" --artboard "Artboard_${s.id}"
  vectorcraft-cli export --artboard "Artboard_${s.id}" --out "workspace/runs/${songId}/shards/${s.id}/artboard.svg"
  \`\`\`
`).join('\n')}

---

## 4. Verification Gate
- [ ] All 8 \`artboard.svg\` files exist and are valid standalone SVGs (viewable in browser).
- [ ] Negative space ratio passes the anti-spectacle check (>= 30% per file).
`
    });

    // ========================================================================
    // AGENT 04: EFFECTCRAFT SHADER & MOTION COMPOSITOR
    // ========================================================================
    promptList.push({
      id: "AGENT_04_EFFECTCRAFT_SHADER_WORKER",
      filename: "AGENT_04_EFFECTCRAFT_SHADER_WORKER.md",
      title: "Agent 04: EffectCraft Shader & Motion Compositor",
      role: "EffectCraft Pure-Rust Compositor & WebGL/SDF Shader Engineer",
      shardPath: `workspace/runs/${songId}/shards/scene_XX/`,
      content: `# SUBAGENT 04: EFFECTCRAFT SHADER & MOTION COMPOSITOR
**Project:** Gwyn Dorado Music Video Studio — *${title}* (${koreanTitle})
**Target Shard Directories:** \`workspace/runs/${songId}/shards/scene_01/\` through \`scene_08/\`
**Exclusive Output Files:**
${scenes.map(s => `- \`workspace/runs/${songId}/shards/${s.id}/motion.ecproj\`\n- \`workspace/runs/${songId}/shards/${s.id}/render.mp4\``).join('\n')}

---

## 1. Zero-Friction Isolation Rules
1. **Parallel Shard Worker:** Ingests \`scene_XX/artboard.svg\` (from Agent 03) and \`song_director_bible.json\` (from Agent 02).
2. **Exclusive Outputs:** Writes ONLY \`motion.ecproj\` and \`render.mp4\` into each corresponding \`shards/scene_XX/\` folder.

---

## 2. Motion Graphics & SDF Shader Presets
- **Available SDF Presets:** \`moonlit_mist\`, \`whale_gem_sdf\`, \`golden_bloom\`, \`seoul_dusk\`, \`warm_parchment\`
- **Resolution:** 3840 x 2160 | **FPS:** 30 | **Codec:** H.264 / H.265 visually lossless

---

## 3. Scene Motion Profiles
${scenes.map(s => `### ${s.id.toUpperCase()} (${s.section})
- **Camera Motion:** \`${s.cameraMotion}\`
- **SDF Atmosphere:** \`${s.sdfPreset}\` (Particle density: ${s.particleDensity})
- **Oklab Grading:** \`${s.oklabPalette}\`
- **EffectCraft CLI Command:**
  \`\`\`bash
  effectcraft-cli comp add "Comp_${s.id}" --width 3840 --height 2160 --duration ${(s.endSec - s.startSec).toFixed(1)}
  effectcraft-cli set "Comp_${s.id}" '#1' transform/camera "${s.cameraMotion}"
  effectcraft-cli set "Comp_${s.id}" '#2' effects/sdf/preset "${s.sdfPreset}"
  effectcraft-cli render --comp "Comp_${s.id}" --out "workspace/runs/${songId}/shards/${s.id}/render.mp4" --bitrate 45M
  \`\`\`
`).join('\n')}

---

## 4. Verification Gate
- [ ] All 8 \`render.mp4\` clips exist and play smoothly at 30fps.
- [ ] Duration of each clip matches exactly \`endSec - startSec\`.
`
    });

    // ========================================================================
    // AGENT 05: KINETIC BILINGUAL TYPOGRAPHER
    // ========================================================================
    promptList.push({
      id: "AGENT_05_KINETIC_TYPOGRAPHER",
      filename: "AGENT_05_KINETIC_TYPOGRAPHER.md",
      title: "Agent 05: Kinetic Bilingual Typographer",
      role: "Motion Typography & Lottie Animation Specialist",
      shardPath: `workspace/runs/${songId}/shards/scene_XX/`,
      content: `# SUBAGENT 05: KINETIC BILINGUAL TYPOGRAPHER
**Project:** Gwyn Dorado Music Video Studio — *${title}* (${koreanTitle})
**Target Shard Directories:** \`workspace/runs/${songId}/shards/scene_01/\` through \`scene_08/\`
**Exclusive Output Files:**
${scenes.map(s => `- \`workspace/runs/${songId}/shards/${s.id}/lyrics.svg\`\n- \`workspace/runs/${songId}/shards/${s.id}/lyrics.lottie.json\``).join('\n')}

---

## 1. Zero-Friction Isolation Rules
1. **Parallel Execution:** Generates vector typography and synchronized Lottie animation files for each scene in isolation.
2. **Non-Intrusive Layout:** Lyrics must NEVER cover the central visual focal point. Adhere strictly to the negative space bounds.

---

## 2. Bilingual Typography Layout Guidelines
- **Primary Typography:** Korean Hangul original lyric (font: Noto Serif KR / Pretendard, elegant font weight 300–400).
- **Secondary Typography:** English poetic translation (font: Cormorant Garamond / Inter italic, font size ~65% of Hangul).
- **Entrance Animation:** Staggered per-character glyph fade with delicate vertical drift (12px upward).
- **Negative Space Respect:** Place text in the lower third (\`y = 1750px\`) or upper third (\`y = 380px\`), retaining clear negative space around vocal phrases.

---

## 3. Lyrical Alignment per Scene
${scenes.map(s => `### ${s.id.toUpperCase()} (${s.section})
- **Hangul Original:** "${s.lyricOriginal}"
- **English Poetic:** "${s.lyricEn}"
- **Display Window:** ${s.startSec}s to ${s.endSec}s
`).join('\n')}

---

## 4. Verification Gate
- [ ] All 8 \`lyrics.svg\` and \`lyrics.lottie.json\` files created.
- [ ] No font clipping or visual obstruction of central artboard motifs.
`
    });

    // ========================================================================
    // AGENT 06: FILMCRAFT NLE TIMELINE MASTER ASSEMBLER
    // ========================================================================
    promptList.push({
      id: "AGENT_06_FILMCRAFT_ASSEMBLER",
      filename: "AGENT_06_FILMCRAFT_ASSEMBLER.md",
      title: "Agent 06: FilmCraft NLE Timeline Master Assembler",
      role: "FilmCraft Pure-Rust NLE Timeline Editor & Colorist",
      shardPath: `workspace/runs/${songId}/assembly/`,
      content: `# SUBAGENT 06: FILMCRAFT NLE TIMELINE MASTER ASSEMBLER
**Project:** Gwyn Dorado Music Video Studio — *${title}* (${koreanTitle})
**Target Shard Directories:** \`workspace/runs/${songId}/assembly/\` and \`workspace/runs/${songId}/renders/\`
**Exclusive Output Files:**
- \`workspace/runs/${songId}/assembly/MV_${songId}.fcproj\`
- \`workspace/runs/${songId}/assembly/filmcraft_timeline.jsonl\`
- \`workspace/runs/${songId}/assembly/assemble_master.sh\`
- \`workspace/runs/${songId}/renders/master_${songId}_prores422hq.mov\`
- \`workspace/runs/${songId}/renders/master_${songId}_4k60.mp4\`

---

## 1. Zero-Friction Isolation Rules
1. **Downstream Master Assembly:** Ingests rendered video shards from Agent 04 and master normalized audio from Agent 01.
2. **Timeline Integrity:** Assembles all 8 clips contiguously along the exact beat and frame grid with ZERO gaps.

---

## 2. NLE Track Layout
- **Track V1 (Video Shards):** \`scene_01/render.mp4\` through \`scene_08/render.mp4\`
- **Track V2 (Typography Overlay):** \`scene_01/lyrics.svg\` through \`scene_08/lyrics.svg\`
- **Track A1 (Audio Master):** \`workspace/runs/${songId}/audio/master_normalized_-14LUFS.wav\`

---

## 3. FilmCraft CLI Assembly Commands
\`\`\`bash
#!/usr/bin/env bash
set -euo pipefail

# 1. Create Project
filmcraft-cli project new "MV_${songId}" --width 3840 --height 2160 --fps 30 --colorspace "ACEScg"

# 2. Place Audio Master
filmcraft-cli timeline place --track A1 --asset "workspace/runs/${songId}/audio/master_normalized_-14LUFS.wav" --start 0.0 --duration ${durationSec}

# 3. Place Visual Shards
${scenes.map((s, idx) => `filmcraft-cli timeline place --track V1 --asset "workspace/runs/${songId}/shards/${s.id}/render.mp4" --start ${s.startSec} --duration ${(s.endSec - s.startSec).toFixed(1)}
filmcraft-cli effects set-param --track V1 --clip ${idx} --effect lumetri --param exposure ${(0.10 + s.convictionLevel * 0.25).toFixed(2)}
filmcraft-cli effects set-param --track V1 --clip ${idx} --effect lumetri --param contrast ${(1.05 + s.convictionLevel * 0.22).toFixed(2)}
filmcraft-cli effects set-param --track V1 --clip ${idx} --effect lumetri --param vignette ${(s.negativeSpaceRatio * 0.55).toFixed(2)}
`).join('\n')}

# 4. Render Final Master 4K
filmcraft-cli export --project "workspace/runs/${songId}/assembly/MV_${songId}.fcproj" --preset "ProRes422HQ" --out "workspace/runs/${songId}/renders/master_${songId}_prores422hq.mov"
filmcraft-cli export --project "workspace/runs/${songId}/assembly/MV_${songId}.fcproj" --preset "H265_Broadcast" --bitrate 45M --out "workspace/runs/${songId}/renders/master_${songId}_4k60.mp4"
\`\`\`

---

## 4. Verification Gate
- [ ] Master video is exactly ${durationSec} seconds long.
- [ ] Audio and video are perfectly in sync with zero drift.
`
    });

    // ========================================================================
    // AGENT 07: FIVE-PILLAR QA & VERIFIER
    // ========================================================================
    promptList.push({
      id: "AGENT_07_QA_VERIFIER",
      filename: "AGENT_07_QA_VERIFIER.md",
      title: "Agent 07: Five-Pillar QA & Artifact Verifier",
      role: "Quality Assurance & Hit Architecture Compliance Auditor",
      shardPath: `workspace/runs/${songId}/qa/`,
      content: `# SUBAGENT 07: FIVE-PILLAR QA & MASTER ARTIFACT VERIFIER
**Project:** Gwyn Dorado Music Video Studio — *${title}* (${koreanTitle})
**Target Shard Directory:** \`workspace/runs/${songId}/qa/\`
**Exclusive Output Files:**
- \`workspace/runs/${songId}/qa/qa_audit_report.json\`
- \`workspace/runs/${songId}/qa/qa_audit_report.md\`
- \`workspace/runs/${songId}/qa/verification_matrix.csv\`

---

## 1. Zero-Friction Isolation Rules
1. **Read-Only Inspection:** Ingests all artifacts from Agents 01 through 06.
2. **Objective Verification:** Tests files against mathematical formulas and rules. Emits the final Go / No-Go verdict.

---

## 2. Five-Pillar Audit Checklist
| Pillar | Requirement | Threshold | Expected Value | Status |
|:---|:---|:---:|:---:|:---:|
| **1. The Confession Check** | Lyric proximity & diary phrasing | Required | 100% lyric coverage | PENDING |
| **2. The Anti-Spectacle Check** | Negative space per scene | >= 30% | Min: ${(Math.min(...scenes.map(s => s.negativeSpaceRatio)) * 100).toFixed(0)}% | PENDING |
| **2b. Anti-Spectacle (Seq Avg)**| Average negative space across MV | >= 50% | Avg: ${(scenes.reduce((a, s) => a + s.negativeSpaceRatio, 0) / scenes.length * 100).toFixed(0)}% | PENDING |
| **3. The Human Foundation Check** | Scene 1 conviction level | <= 35% | Intro: ${(scenes[0].convictionLevel * 100).toFixed(0)}% | PENDING |
| **3b. Human Foundation (Space)**| Scene 1 opening negative space | >= 65% | Intro: ${(scenes[0].negativeSpaceRatio * 100).toFixed(0)}% | PENDING |
| **4. The Blooming Arc Check** | Dynamic delta (Peak - Intro) | >= +0.45 | Delta: +${((scenes[6] ? scenes[6].convictionLevel : 0.95) - scenes[0].convictionLevel).toFixed(2)} | PENDING |
| **4b. Blooming Arc (Outro)** | Outro closing conviction | <= 35% | Outro: ${(scenes[scenes.length - 1].convictionLevel * 100).toFixed(0)}% | PENDING |
| **5. The Nuance Check** | Unique motif variety | >= 2 | Motifs: ${Array.from(new Set(scenes.map(s => s.svgMotif))).length} unique | PENDING |

---

## 3. Audio & Video Invariant Checks
- [ ] Audio loudness integrated: **-14.0 LUFS** (±0.5 LUFS)
- [ ] Max true peak: **<= -1.0 dBTP**
- [ ] Video resolution: **3840 x 2160** (4K UHD)
- [ ] Timeline frame continuity: **Zero gaps, zero overlaps** across ${durationSec} seconds
- [ ] Zero bitmap assets in SVG files

---

## 4. Final Verdict Emission
Output \`qa_audit_report.json\` containing composite score (0.0 to 1.0) and final release recommendation:
- \`APPROVED_FOR_RELEASE\`
- \`REVISION_REQUIRED\`
- \`REJECTED\`
`
    });

    return promptList;
  }

  /**
   * ==========================================================================
   * 4. HELPER DOWNLOAD & CONTROL BRIDGE METHODS
   * ==========================================================================
   */

  /**
   * Triggers a client-side download of any plain text, markdown, shell script,
   * or JSON file in the browser.
   * 
   * @param {string} filename - e.g. "assemble_filmcraft.sh"
   * @param {string} content - Raw string content
   * @param {string} [mimeType='text/plain;charset=utf-8']
   * @returns {boolean} Success state
   */
  function downloadTextFile(filename, content, mimeType) {
    const mime = mimeType || 'text/plain;charset=utf-8';

    if (typeof window === 'undefined' || typeof document === 'undefined') {
      console.log(`[StorytoldBridge.downloadTextFile] Headless environment: skipped download of ${filename}`);
      return false;
    }

    try {
      const blob = new Blob([content], { type: mime });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = filename;
      anchor.style.display = 'none';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      setTimeout(() => URL.revokeObjectURL(url), 2000);
      return true;
    } catch (err) {
      console.error(`[StorytoldBridge.downloadTextFile] Failed to download ${filename}:`, err);
      return false;
    }
  }

  /**
   * Exports a single unified `.json` bundle containing:
   *   - `song_director_bible.json`
   *   - All 7 subagent markdown instruction prompts
   *   - The complete `.ecproj` EffectCraft project file
   *   - The `filmcraft-cli` / `soundcraft-cli` scripts
   *   - VectorCraft commands
   * 
   * Triggers browser download of `<songId>_production_bundle.json`.
   * 
   * @param {Object} bible - Sequence Bible
   * @returns {Object} Bundle object
   */
  function exportFullBundleJSON(bible) {
    const b = resolveBible(bible);
    const songId = b.songId || "gwyn_dorado_mv";

    const prompts = generateParallelAgentPrompts(b);
    const promptMap = {};
    prompts.forEach(p => {
      promptMap[p.filename] = p.content;
    });

    const filmcraft = generateFilmCraftScript(b);
    const effectcraft = generateEffectCraftProject(b);
    const vectorcraft = generateVectorCraftCommands(b);
    const soundcraft = generateSoundCraftCommands(b);

    const bundle = {
      schemaVersion: "1.0.0",
      generator: "DoradoMotion Studio — Storytold Bridge & Multi-Provider Parallel Subagent Exporter",
      exportedAt: new Date().toISOString(),
      songDirectorBible: b,
      storytoldCatalog: STORYTOLD_REPOS,
      parallelSubagents: {
        count: prompts.length,
        manifest: prompts.map(p => ({
          id: p.id,
          filename: p.filename,
          title: p.title,
          role: p.role,
          shardPath: p.shardPath
        })),
        prompts: promptMap
      },
      storytoldProjects: {
        filmcraft: {
          shellScript: filmcraft.shellScript,
          jsonLines: filmcraft.jsonLines,
          commandList: filmcraft.commands
        },
        effectcraft: {
          ecproj: effectcraft.ecproj,
          cliCommands: effectcraft.cliCommands,
          script: effectcraft.script
        },
        vectorcraft: {
          commands: vectorcraft.commands,
          script: vectorcraft.script
        },
        soundcraft: {
          commands: soundcraft.commands,
          markers: soundcraft.markers,
          script: soundcraft.script
        }
      }
    };

    const filename = `${songId}_storytold_master_bundle.json`;
    const jsonStr = JSON.stringify(bundle, null, 2);
    downloadTextFile(filename, jsonStr, 'application/json;charset=utf-8');

    return bundle;
  }

  /**
   * Attempts a fetch / ping to `http://127.0.0.1:${port}` with an aggressive
   * timeout to detect running Storytold daemons without blocking the UI.
   * 
   * Returns `{ online: boolean, status: string, port: number, latencyMs: number }`.
   * 
   * @param {number} port - e.g. 9876, 9877, 9878, 7801, 9879
   * @returns {Promise<Object>}
   */
  async function pingControlPort(port) {
    const targetPort = Number(port) || 9876;
    const url = `http://127.0.0.1:${targetPort}/health`;
    const startTime = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();

    // Check if we are in browser with fetch available
    if (typeof fetch === 'undefined') {
      return {
        port: targetPort,
        online: false,
        status: "Offline — Using Built-in WebGL/SVG Engine",
        reason: "Environment lacks fetch API",
        timestamp: Date.now()
      };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 800);

      // Attempt fetch with mode: 'no-cors' so browser security doesn't block local daemon detection
      await fetch(url, {
        method: 'GET',
        mode: 'no-cors',
        cache: 'no-store',
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const endTime = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
      const latency = Math.round(endTime - startTime);

      return {
        port: targetPort,
        online: true,
        status: "Connected",
        latencyMs: latency,
        timestamp: Date.now()
      };
    } catch (err) {
      return {
        port: targetPort,
        online: false,
        status: "Offline — Using Built-in WebGL/SVG Engine",
        error: err.name === 'AbortError' ? 'Connection timed out (800ms)' : (err.message || 'Offline'),
        timestamp: Date.now()
      };
    }
  }

  /**
   * Pings all 5 Storytold control ports simultaneously and returns a status map.
   * 
   * @returns {Promise<Object>}
   */
  async function checkAllServices() {
    const results = {};
    const keys = Object.keys(STORYTOLD_REPOS);

    const checks = keys.map(async (key) => {
      const repo = STORYTOLD_REPOS[key];
      const ping = await pingControlPort(repo.defaultPort);
      results[key] = {
        name: repo.name,
        cli: repo.cli,
        port: repo.defaultPort,
        online: ping.online,
        status: ping.status,
        latencyMs: ping.latencyMs || null
      };
    });

    await Promise.all(checks);
    return results;
  }

  /**
   * Additional convenience downloaders for individual project artifacts.
   */
  function downloadSubagentPrompt(agentId, bible) {
    const prompts = generateParallelAgentPrompts(bible);
    const match = prompts.find(p => p.id === agentId || p.filename === agentId);
    if (!match) {
      console.warn(`[StorytoldBridge] Subagent prompt not found for: ${agentId}`);
      return false;
    }
    return downloadTextFile(match.filename, match.content, 'text/markdown;charset=utf-8');
  }

  function downloadAllSubagentPrompts(bible) {
    const prompts = generateParallelAgentPrompts(bible);
    prompts.forEach((p, idx) => {
      setTimeout(() => {
        downloadTextFile(p.filename, p.content, 'text/markdown;charset=utf-8');
      }, idx * 150);
    });
    return true;
  }

  function downloadFilmCraftScript(bible) {
    const b = resolveBible(bible);
    const fc = generateFilmCraftScript(b);
    return downloadTextFile(`assemble_${b.songId || 'filmcraft'}.sh`, fc.shellScript, 'application/x-sh;charset=utf-8');
  }

  function downloadFilmCraftJsonLines(bible) {
    const b = resolveBible(bible);
    const fc = generateFilmCraftScript(b);
    return downloadTextFile(`timeline_${b.songId || 'filmcraft'}.jsonl`, fc.jsonLines, 'application/x-ndjson;charset=utf-8');
  }

  function downloadEffectCraftProject(bible, activeScene) {
    const b = resolveBible(bible);
    const ec = generateEffectCraftProject(b, activeScene);
    return downloadTextFile(`project_${b.songId || 'effectcraft'}.ecproj`, ec.ecprojString, 'application/json;charset=utf-8');
  }

  function downloadVectorCraftCommands(bible, activeScene) {
    const b = resolveBible(bible);
    const vc = generateVectorCraftCommands(b, activeScene);
    return downloadTextFile(`artboards_${b.songId || 'vectorcraft'}.sh`, vc.script, 'application/x-sh;charset=utf-8');
  }

  function downloadSoundCraftCommands(bible) {
    const b = resolveBible(bible);
    const sc = generateSoundCraftCommands(b);
    return downloadTextFile(`daw_${b.songId || 'soundcraft'}.sh`, sc.script, 'application/x-sh;charset=utf-8');
  }

  /**
   * ==========================================================================
   * 5. ASSEMBLE PUBLIC INTERFACE
   * ==========================================================================
   */
  const StorytoldBridge = {
    // 1. Catalog
    STORYTOLD_REPOS: STORYTOLD_REPOS,
    getRepo: function (key) { return STORYTOLD_REPOS[key] || null; },
    getAllRepos: function () { return Object.values(STORYTOLD_REPOS); },

    // 2. Programmatic CLI & Project Generators
    generateFilmCraftScript: generateFilmCraftScript,
    generateEffectCraftProject: generateEffectCraftProject,
    generateVectorCraftCommands: generateVectorCraftCommands,
    generateSoundCraftCommands: generateSoundCraftCommands,

    // 3. Parallel Subagent Instruction Generator
    generateParallelAgentPrompts: generateParallelAgentPrompts,
    generateAllSubagentPrompts: generateParallelAgentPrompts,
    generateSubagentPrompt: function (agentId, bible) {
      const list = generateParallelAgentPrompts(bible);
      return list.find(p => p.id === agentId || p.id.startsWith(agentId) || p.id.includes(agentId)) || list[0];
    },

    // 4. Download & Control Bridge Methods
    downloadTextFile: downloadTextFile,
    exportFullBundleJSON: exportFullBundleJSON,
    pingControlPort: pingControlPort,
    checkAllServices: checkAllServices,

    // 5. Individual Downloaders
    downloadSubagentPrompt: downloadSubagentPrompt,
    downloadAllSubagentPrompts: downloadAllSubagentPrompts,
    downloadFilmCraftScript: downloadFilmCraftScript,
    downloadFilmCraftJsonLines: downloadFilmCraftJsonLines,
    downloadEffectCraftProject: downloadEffectCraftProject,
    downloadVectorCraftCommands: downloadVectorCraftCommands,
    downloadSoundCraftCommands: downloadSoundCraftCommands,

    // Internal Utility
    resolveBible: resolveBible,
    formatTimecode: formatTimecode
  };

  // Attach to window.DoradoStudio.StorytoldBridge
  DoradoStudio.StorytoldBridge = StorytoldBridge;

  // Node.js / CommonJS environment export for headless automated verification
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorytoldBridge;
  }

})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
