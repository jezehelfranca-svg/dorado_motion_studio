/**
 * ============================================================================
 * GWYN DORADO MOTION STUDIO — CREATIVE DIRECTION & SEQUENCE PLANNER ENGINE
 * Module: 01_creative_director.js
 * Namespace: window.DoradoStudio.CreativeDirector
 * 
 * CORE PHILOSOPHY:
 * "A private confession delivered with stage-level conviction."
 * 
 * This engine formalizes the 5 Gwyn Dorado Creative Pillars, curates the 5
 * canonical OST & competition presets, transforms raw lyrics into mathematically
 * synchronized Sequence Bibles along the Blooming Arc curve, and audits visual
 * sequences against negative-space and emotional invariants.
 * ============================================================================
 */

(function (global) {
  'use strict';

  // Ensure root namespace exists
  const DoradoStudio = global.DoradoStudio = global.DoradoStudio || {};

  /**
   * ==========================================================================
   * 1. THE 5 GWYN DORADO CREATIVE PILLARS
   * ==========================================================================
   */
  const PILLARS = Object.freeze({
    confession: Object.freeze({
      id: "confession",
      name: "The Confession Check",
      tagline: "A private letter, never a generic broadcast",
      description: "Reads like a private letter or whispered observation, never a generic broadcast. Every lyric and visual motif stems from authentic interiority.",
      benchmark: "Vocal mic proximity, interior monologue cadence, diary entry phrasing.",
      targetCriteria: {
        minRationaleLength: 15,
        requiredTone: "intimate_authentic",
        bannedTropes: ["generic_pop_shout", "unmotivated_lens_flare", "crowd_pandering"]
      }
    }),
    antiSpectacle: Object.freeze({
      id: "antiSpectacle",
      name: "The Anti-Spectacle Check",
      tagline: "Pure emotional communication through generous negative space",
      description: "Pure emotional communication with generous negative space (30%–85%), avoiding chaotic clutter. The frame breathes with the silence between words.",
      benchmark: "Minimum 30% negative space at all times; sequence average >= 50%.",
      targetCriteria: {
        minNegativeSpace: 0.30,
        maxNegativeSpace: 0.90,
        minAverageNegativeSpace: 0.50
      }
    }),
    humanFoundation: Object.freeze({
      id: "humanFoundation",
      name: "The Human Foundation Check",
      tagline: "Acoustic warmth & hand-drawn ink before spectacle",
      description: "Begins stripped-back (hand-drawn Code-SVG ink & acoustic warmth) to honor vocal phrasing before any visual or musical crescendo.",
      benchmark: "Scene 1 (Intro/Verse 1) conviction <= 0.35, negative space >= 0.65.",
      targetCriteria: {
        maxOpeningConviction: 0.35,
        minOpeningNegativeSpace: 0.65,
        requiredInitialMotifs: ["ink_confession", "acoustic_strings", "window_rain"]
      }
    }),
    bloomingArc: Object.freeze({
      id: "bloomingArc",
      name: "The Blooming Arc Check",
      tagline: "Quiet vulnerability to stage conviction, fading to an intimate whisper",
      description: "Builds organically from Verse quiet vulnerability to Bridge stage-level conviction, then fades back to an intimate whisper in the Outro.",
      benchmark: "Dynamic delta (Peak - Intro) >= +0.45; final scene conviction <= 0.35.",
      targetCriteria: {
        minDynamicDelta: 0.45,
        maxOutroConviction: 0.35,
        minOutroNegativeSpace: 0.70
      }
    }),
    nuance: Object.freeze({
      id: "nuance",
      name: "The Nuance Check",
      tagline: "Visual motifs & epistemic rationale tied to lyrical micro-moments",
      description: "Visual motifs & epistemic rationale tied directly to lyrical micro-moments, ensuring every camera motion, SDF shader, and color shift is poetically motivated.",
      benchmark: "100% lyric coverage, motif progression across sections, unique rationale per scene.",
      targetCriteria: {
        minMotifVariety: 2,
        requireFullLyricCoverage: true
      }
    })
  });

  /**
   * Recognized Motifs, SDF Presets, Camera Motions, and Oklab Profiles
   */
  const VALID_MOTIFS = Object.freeze([
    "ink_confession",
    "window_rain",
    "whale_gem",
    "royal_lotus",
    "acoustic_strings",
    "celestial_bloom"
  ]);

  const VALID_SDF_PRESETS = Object.freeze([
    "moonlit_mist",
    "whale_gem_sdf",
    "seoul_dusk",
    "warm_parchment",
    "golden_bloom"
  ]);

  const VALID_CAMERA_MOTIONS = Object.freeze([
    "slow_breathe",
    "gentle_drift_right",
    "parallax_rise",
    "orbital_bloom",
    "fade_still"
  ]);

  const VALID_OKLAB_PALETTES = Object.freeze([
    "moonlit_confession",
    "whale_bioluminescence",
    "acoustic_parchment",
    "seoul_dusk_purple",
    "stage_conviction_gold"
  ]);

  /**
   * ==========================================================================
   * 2. CANONICAL PRESET SONGS
   * 5 Richly Curated Presets: losing_my_heart, light_of_love, on_my_way,
   * purple_love, light_up. Each with 8 contiguous scenes (0 to 64s).
   * ==========================================================================
   */
  const PRESET_SONGS = Object.freeze({
    // ------------------------------------------------------------------------
    // PRESET 1: Losing My Heart (마음을 놓치다)
    // ------------------------------------------------------------------------
    losing_my_heart: Object.freeze({
      id: "losing_my_heart",
      title: "Losing My Heart",
      koreanTitle: "마음을 놓치다",
      album: "Famous Singers 4: OST (Studio Slam / JTBC)",
      bpm: 68,
      key: "Ab Major",
      durationSec: 64,
      defaultOklabProfile: "moonlit_confession",
      styleDna: "Intimate Korean acoustic ballad; breathless close-mic vocal, gentle fingerstyle acoustic guitar, melancholic rain textures, and moonlit ink calligraphy dissolving into dark indigo parchment.",
      rawLyrics: `[Intro]
조용한 밤, 숨결만 남은 텅 빈 방 안
A quiet night, only breath remains in this empty room

[Verse 1]
달빛 아래 숨겨둔 마음, 차가운 창가에 기대어
A quiet heart hidden beneath the moonlight, leaning against the cold window

[Pre-Chorus]
점점 번져가는 그림자 속으로 나를 놓쳐버릴까 봐
Fearing I might lose myself in the deepening shadows

[Chorus 1]
마음을 놓치다, 너의 손끝이 닿았던 그 자리에서
Losing my heart, right where your fingertips once lingered

[Verse 2]
비워낸 가슴에 고인 너의 이름, 지우려 애써도 선명해
Your name pools inside my hollowed chest; no matter how I try, it stays vivid

[Chorus 2]
다시 널 부르다 무너져도, 이 아픔마저 너라면
Even if I crumble calling you again, if this pain is yours, I accept it

[Bridge]
온 세상을 다 주어도 바꿀 수 없던 너라는 단 하나의 빛!
The single light that all the world could never replace—it was always you!

[Outro]
달빛마저 잠든 밤... 안녕, 내 사랑
Even the moonlight falls asleep tonight... goodbye, my quiet love`,
      scenes: Object.freeze([
        Object.freeze({
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
        }),
        Object.freeze({
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
        }),
        Object.freeze({
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
        }),
        Object.freeze({
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
        }),
        Object.freeze({
          id: "scene_05",
          index: 4,
          section: "Verse 2",
          startSec: 32,
          endSec: 40,
          lyricOriginal: "비워낸 가슴에 고인 너의 이름, 지우려 애써도 선명해",
          lyricEn: "Your name pools inside my hollowed chest; no matter how I try, it stays vivid",
          convictionLevel: 0.40,
          negativeSpaceRatio: 0.70,
          svgMotif: "ink_confession",
          sdfPreset: "moonlit_mist",
          oklabPalette: "moonlit_confession",
          cameraMotion: "slow_breathe",
          strokeSpeed: 0.9,
          particleDensity: 0.30,
          rationale: "Dynamic breath and contrast recovery; single ink drops disperse into parchment as the memory is confronted alone."
        }),
        Object.freeze({
          id: "scene_06",
          index: 5,
          section: "Chorus 2",
          startSec: 40,
          endSec: 48,
          lyricOriginal: "다시 널 부르다 무너져도, 이 아픔마저 너라면",
          lyricEn: "Even if I crumble calling you again, if this pain is yours, I accept it",
          convictionLevel: 0.84,
          negativeSpaceRatio: 0.38,
          svgMotif: "window_rain",
          sdfPreset: "moonlit_mist",
          oklabPalette: "moonlit_confession",
          cameraMotion: "orbital_bloom",
          strokeSpeed: 1.65,
          particleDensity: 0.76,
          rationale: "Heightened rainfall refracting starlight; vocal resonance deepens with full conviction while negative space avoids visual noise."
        }),
        Object.freeze({
          id: "scene_07",
          index: 6,
          section: "Bridge",
          startSec: 48,
          endSec: 56,
          lyricOriginal: "온 세상을 다 주어도 바꿀 수 없던 너라는 단 하나의 빛!",
          lyricEn: "The single light that all the world could never replace—it was always you!",
          convictionLevel: 0.95,
          negativeSpaceRatio: 0.34,
          svgMotif: "celestial_bloom",
          sdfPreset: "golden_bloom",
          oklabPalette: "stage_conviction_gold",
          cameraMotion: "parallax_rise",
          strokeSpeed: 2.0,
          particleDensity: 0.92,
          rationale: "The Peak of Stage-Level Conviction: celestial gold burst breaking the darkness, reaching maximum dynamic power."
        }),
        Object.freeze({
          id: "scene_08",
          index: 7,
          section: "Outro",
          startSec: 56,
          endSec: 64,
          lyricOriginal: "달빛마저 잠든 밤... 안녕, 내 사랑",
          lyricEn: "Even the moonlight falls asleep tonight... goodbye, my quiet love",
          convictionLevel: 0.15,
          negativeSpaceRatio: 0.86,
          svgMotif: "ink_confession",
          sdfPreset: "moonlit_mist",
          oklabPalette: "moonlit_confession",
          cameraMotion: "fade_still",
          strokeSpeed: 0.6,
          particleDensity: 0.10,
          rationale: "Return to the intimate whisper; ink strokes dissolve into pure silence and 86% negative space on dark parchment."
        })
      ])
    }),

    // ------------------------------------------------------------------------
    // PRESET 2: Light of Love (사랑의 빛)
    // ------------------------------------------------------------------------
    light_of_love: Object.freeze({
      id: "light_of_love",
      title: "Light of Love",
      koreanTitle: "사랑의 빛",
      album: "Famous Singers 4: OST (Studio Slam / JTBC)",
      bpm: 74,
      key: "Eb Major",
      durationSec: 64,
      defaultOklabProfile: "whale_bioluminescence",
      styleDna: "Cinematic oceanic pop ballad; deep bioluminescent oceanic indigo, soaring falsetto transitioning to grand chest resonance, glowing abyssal whale gem silhouettes, and phosphorescent tide blooms.",
      rawLyrics: `[Intro]
심해의 적막, 푸른 어둠 속에 감춰진 떨림
Deep sea silence, a hidden tremor in the blue abyss

[Verse 1]
얼어붙은 파도 끝에 닿은 작은 손, 숨죽인 바다의 노래
A small hand touching the frozen wave's edge, a muted ocean song

[Pre-Chorus]
수면 위로 떠오르는 푸른 고래의 숨결처럼 차오르는 빛
Light swelling like the breath of an ancient blue whale rising to the surface

[Chorus 1]
어둠을 가르는 사랑의 빛, 차가운 심해를 물들이다
The light of love cutting through darkness, coloring the icy deep

[Verse 2]
헤엄쳐 갈수록 선명해지는 너의 온기, 길을 잃지 않아
The further I swim, the clearer your warmth becomes; I will not lose my way

[Chorus 2]
거센 해류에 부딪혀도 영원히 꺼지지 않을 우리의 궤적
Even striking heavy ocean currents, our trajectory will never be extinguished

[Bridge]
가장 깊은 바다 밑바닥에서도 찬란히 타오르는 단 하나의 심장!
Even at the seabed of the deepest ocean, the single heart burning in brilliance!

[Outro]
물결 위로 부서지는 별빛... 너에게 닿기를
Starlight shattering across gentle waves... may it reach you`,
      scenes: Object.freeze([
        Object.freeze({
          id: "scene_01",
          index: 0,
          section: "Intro",
          startSec: 0,
          endSec: 8,
          lyricOriginal: "심해의 적막, 푸른 어둠 속에 감춰진 떨림...",
          lyricEn: "Deep sea silence, a hidden tremor in the blue abyss...",
          convictionLevel: 0.18,
          negativeSpaceRatio: 0.82,
          svgMotif: "whale_gem",
          sdfPreset: "whale_gem_sdf",
          oklabPalette: "whale_bioluminescence",
          cameraMotion: "slow_breathe",
          strokeSpeed: 0.75,
          particleDensity: 0.18,
          rationale: "Faint luminescent silhouette of an abyssal whale gem floating in vast negative oceanic space."
        }),
        Object.freeze({
          id: "scene_02",
          index: 1,
          section: "Verse 1",
          startSec: 8,
          endSec: 16,
          lyricOriginal: "얼어붙은 파도 끝에 닿은 작은 손, 숨죽인 바다의 노래",
          lyricEn: "A small hand touching the frozen wave's edge, a muted ocean song",
          convictionLevel: 0.26,
          negativeSpaceRatio: 0.76,
          svgMotif: "acoustic_strings",
          sdfPreset: "whale_gem_sdf",
          oklabPalette: "whale_bioluminescence",
          cameraMotion: "gentle_drift_right",
          strokeSpeed: 0.95,
          particleDensity: 0.25,
          rationale: "Acoustic plucked vibrations manifest as bioluminescent rippling currents along the deep seabed."
        }),
        Object.freeze({
          id: "scene_03",
          index: 2,
          section: "Pre-Chorus",
          startSec: 16,
          endSec: 24,
          lyricOriginal: "수면 위로 떠오르는 푸른 고래의 숨결처럼 차오르는 빛",
          lyricEn: "Light swelling like the breath of an ancient blue whale rising to the surface",
          convictionLevel: 0.50,
          negativeSpaceRatio: 0.60,
          svgMotif: "whale_gem",
          sdfPreset: "whale_gem_sdf",
          oklabPalette: "whale_bioluminescence",
          cameraMotion: "parallax_rise",
          strokeSpeed: 1.3,
          particleDensity: 0.45,
          rationale: "Rising vertical bioluminescent plume mirrors the vocal ascent into head voice."
        }),
        Object.freeze({
          id: "scene_04",
          index: 3,
          section: "Chorus 1",
          startSec: 24,
          endSec: 32,
          lyricOriginal: "어둠을 가르는 사랑의 빛, 차가운 심해를 물들이다",
          lyricEn: "The light of love cutting through darkness, coloring the icy deep",
          convictionLevel: 0.78,
          negativeSpaceRatio: 0.42,
          svgMotif: "celestial_bloom",
          sdfPreset: "whale_gem_sdf",
          oklabPalette: "whale_bioluminescence",
          cameraMotion: "orbital_bloom",
          strokeSpeed: 1.55,
          particleDensity: 0.70,
          rationale: "Bioluminescent cyan and seafoam bloom ignites the frame, maintaining high-contrast negative perimeter."
        }),
        Object.freeze({
          id: "scene_05",
          index: 4,
          section: "Verse 2",
          startSec: 32,
          endSec: 40,
          lyricOriginal: "헤엄쳐 갈수록 선명해지는 너의 온기, 길을 잃지 않아",
          lyricEn: "The further I swim, the clearer your warmth becomes; I will not lose my way",
          convictionLevel: 0.42,
          negativeSpaceRatio: 0.68,
          svgMotif: "whale_gem",
          sdfPreset: "whale_gem_sdf",
          oklabPalette: "whale_bioluminescence",
          cameraMotion: "gentle_drift_right",
          strokeSpeed: 1.0,
          particleDensity: 0.35,
          rationale: "Gentle undersea drift; single guiding gem pulse reflects determined lyrical reassurance."
        }),
        Object.freeze({
          id: "scene_06",
          index: 5,
          section: "Chorus 2",
          startSec: 40,
          endSec: 48,
          lyricOriginal: "거센 해류에 부딪혀도 영원히 꺼지지 않을 우리의 궤적",
          lyricEn: "Even striking heavy ocean currents, our trajectory will never be extinguished",
          convictionLevel: 0.85,
          negativeSpaceRatio: 0.38,
          svgMotif: "whale_gem",
          sdfPreset: "whale_gem_sdf",
          oklabPalette: "whale_bioluminescence",
          cameraMotion: "orbital_bloom",
          strokeSpeed: 1.7,
          particleDensity: 0.80,
          rationale: "Twin spiral filaments wrap around the whale gem icon, channeling heightened choral intensity."
        }),
        Object.freeze({
          id: "scene_07",
          index: 6,
          section: "Bridge",
          startSec: 48,
          endSec: 56,
          lyricOriginal: "가장 깊은 바다 밑바닥에서도 찬란히 타오르는 단 하나의 심장!",
          lyricEn: "Even at the seabed of the deepest ocean, the single heart burning in brilliance!",
          convictionLevel: 0.96,
          negativeSpaceRatio: 0.32,
          svgMotif: "celestial_bloom",
          sdfPreset: "golden_bloom",
          oklabPalette: "stage_conviction_gold",
          cameraMotion: "parallax_rise",
          strokeSpeed: 2.1,
          particleDensity: 0.95,
          rationale: "Absolute emotional transcendence: deep water gives way to radiant golden marine corona at stage conviction peak."
        }),
        Object.freeze({
          id: "scene_08",
          index: 7,
          section: "Outro",
          startSec: 56,
          endSec: 64,
          lyricOriginal: "물결 위로 부서지는 별빛... 너에게 닿기를",
          lyricEn: "Starlight shattering across gentle waves... may it reach you",
          convictionLevel: 0.16,
          negativeSpaceRatio: 0.85,
          svgMotif: "whale_gem",
          sdfPreset: "whale_gem_sdf",
          oklabPalette: "whale_bioluminescence",
          cameraMotion: "fade_still",
          strokeSpeed: 0.65,
          particleDensity: 0.12,
          rationale: "Deceleration into phosphorescent silence; minimal solitary light gem settling into 85% negative blue space."
        })
      ])
    }),

    // ------------------------------------------------------------------------
    // PRESET 3: On My Way (나의 길로)
    // ------------------------------------------------------------------------
    on_my_way: Object.freeze({
      id: "on_my_way",
      title: "On My Way",
      koreanTitle: "나의 길로",
      album: "Famous Singers 4: Competition Original",
      bpm: 82,
      key: "F Major",
      durationSec: 64,
      defaultOklabProfile: "acoustic_parchment",
      styleDna: "Acoustic folk-pop anthem; warm vintage wood tones, driving acoustic guitar arpeggios, gritty vocal determination, and parchment ink lines mapping a solitary journey through morning mist.",
      rawLyrics: `[Intro]
먼지 쌓인 기타를 꺼내 조율하는 아침의 정적
Morning silence, tuning a dust-covered guitar

[Verse 1]
낡은 가방 하나 메고 문을 열어, 젖은 아스팔트 위의 첫 발자국
Shouldering a worn bag, opening the door; first footsteps on wet asphalt

[Pre-Chorus]
누구도 가르쳐주지 않던 길, 바람이 등을 밀어줄 때
A road nobody taught me to walk, when the wind nudges my back

[Chorus 1]
나의 길로 걸어가리, 두려움마저 품에 안은 채
I will walk upon my way, embracing even fear within my chest

[Verse 2]
넘어질 때마다 굳은살이 박혀 더 단단해진 나의 발걸음
Calluses hardening with every stumble, making my stride steadfast

[Chorus 2]
비바람 몰아쳐도 멈추지 않아, 이 길이 내 노래니까
Rain and wind may rage, but I will not stop; this path is my song

[Bridge]
벼랑 끝에 서서 마주한 새벽, 온몸으로 노래하는 나의 증명!
Dawn faced at the cliff's edge, my life's proof sung with my whole body!

[Outro]
지평선 너머로 이어지는 길... 내일을 향해
The road unrolling beyond the horizon... toward tomorrow`,
      scenes: Object.freeze([
        Object.freeze({
          id: "scene_01",
          index: 0,
          section: "Intro",
          startSec: 0,
          endSec: 8,
          lyricOriginal: "먼지 쌓인 기타를 꺼내 조율하는 아침의 정적...",
          lyricEn: "Morning silence, tuning a dust-covered guitar...",
          convictionLevel: 0.18,
          negativeSpaceRatio: 0.82,
          svgMotif: "acoustic_strings",
          sdfPreset: "warm_parchment",
          oklabPalette: "acoustic_parchment",
          cameraMotion: "slow_breathe",
          strokeSpeed: 0.8,
          particleDensity: 0.16,
          rationale: "Hand-drawn vibrating string line across warm parchment, tactile human presence before instrumentation."
        }),
        Object.freeze({
          id: "scene_02",
          index: 1,
          section: "Verse 1",
          startSec: 8,
          endSec: 16,
          lyricOriginal: "낡은 가방 하나 메고 문을 열어, 젖은 아스팔트 위의 첫 발자국",
          lyricEn: "Shouldering a worn bag, opening the door; first footsteps on wet asphalt",
          convictionLevel: 0.28,
          negativeSpaceRatio: 0.74,
          svgMotif: "ink_confession",
          sdfPreset: "warm_parchment",
          oklabPalette: "acoustic_parchment",
          cameraMotion: "gentle_drift_right",
          strokeSpeed: 1.0,
          particleDensity: 0.26,
          rationale: "Clean linear calligraphic strokes depict a solitary traveler's path across muted morning beige."
        }),
        Object.freeze({
          id: "scene_03",
          index: 2,
          section: "Pre-Chorus",
          startSec: 16,
          endSec: 24,
          lyricOriginal: "누구도 가르쳐주지 않던 길, 바람이 등을 밀어줄 때",
          lyricEn: "A road nobody taught me to walk, when the wind nudges my back",
          convictionLevel: 0.52,
          negativeSpaceRatio: 0.58,
          svgMotif: "acoustic_strings",
          sdfPreset: "warm_parchment",
          oklabPalette: "acoustic_parchment",
          cameraMotion: "parallax_rise",
          strokeSpeed: 1.35,
          particleDensity: 0.44,
          rationale: "Arpeggiated acoustic rhythm reflected in intersecting geometric string vectors lifting upwards."
        }),
        Object.freeze({
          id: "scene_04",
          index: 3,
          section: "Chorus 1",
          startSec: 24,
          endSec: 32,
          lyricOriginal: "나의 길로 걸어가리, 두려움마저 품에 안은 채",
          lyricEn: "I will walk upon my way, embracing even fear within my chest",
          convictionLevel: 0.75,
          negativeSpaceRatio: 0.45,
          svgMotif: "celestial_bloom",
          sdfPreset: "warm_parchment",
          oklabPalette: "acoustic_parchment",
          cameraMotion: "orbital_bloom",
          strokeSpeed: 1.5,
          particleDensity: 0.64,
          rationale: "Warm ochre bloom radiating forward, expressing resilient courage while preserving parchment textures."
        }),
        Object.freeze({
          id: "scene_05",
          index: 4,
          section: "Verse 2",
          startSec: 32,
          endSec: 40,
          lyricOriginal: "넘어질 때마다 굳은살이 박혀 더 단단해진 나의 발걸음",
          lyricEn: "Calluses hardening with every stumble, making my stride steadfast",
          convictionLevel: 0.44,
          negativeSpaceRatio: 0.66,
          svgMotif: "ink_confession",
          sdfPreset: "warm_parchment",
          oklabPalette: "acoustic_parchment",
          cameraMotion: "gentle_drift_right",
          strokeSpeed: 1.1,
          particleDensity: 0.34,
          rationale: "Weathered ink contour detailing organic growth; grounding breath between chorus surges."
        }),
        Object.freeze({
          id: "scene_06",
          index: 5,
          section: "Chorus 2",
          startSec: 40,
          endSec: 48,
          lyricOriginal: "비바람 몰아쳐도 멈추지 않아, 이 길이 내 노래니까",
          lyricEn: "Rain and wind may rage, but I will not stop; this path is my song",
          convictionLevel: 0.82,
          negativeSpaceRatio: 0.40,
          svgMotif: "acoustic_strings",
          sdfPreset: "warm_parchment",
          oklabPalette: "acoustic_parchment",
          cameraMotion: "orbital_bloom",
          strokeSpeed: 1.65,
          particleDensity: 0.74,
          rationale: "Dual interlocking string curves vibrating in unison with Gwyn's soaring belt."
        }),
        Object.freeze({
          id: "scene_07",
          index: 6,
          section: "Bridge",
          startSec: 48,
          endSec: 56,
          lyricOriginal: "벼랑 끝에 서서 마주한 새벽, 온몸으로 노래하는 나의 증명!",
          lyricEn: "Dawn faced at the cliff's edge, my life's proof sung with my whole body!",
          convictionLevel: 0.94,
          negativeSpaceRatio: 0.35,
          svgMotif: "celestial_bloom",
          sdfPreset: "golden_bloom",
          oklabPalette: "stage_conviction_gold",
          cameraMotion: "parallax_rise",
          strokeSpeed: 2.0,
          particleDensity: 0.90,
          rationale: "Dawn breaks into incandescent amber glory; stage-level conviction achieved at the dynamic apex."
        }),
        Object.freeze({
          id: "scene_08",
          index: 7,
          section: "Outro",
          startSec: 56,
          endSec: 64,
          lyricOriginal: "지평선 너머로 이어지는 길... 내일을 향해",
          lyricEn: "The road unrolling beyond the horizon... toward tomorrow",
          convictionLevel: 0.17,
          negativeSpaceRatio: 0.83,
          svgMotif: "acoustic_strings",
          sdfPreset: "warm_parchment",
          oklabPalette: "acoustic_parchment",
          cameraMotion: "fade_still",
          strokeSpeed: 0.7,
          particleDensity: 0.14,
          rationale: "A single lingering acoustic string vibration fading into quiet horizon parchment."
        })
      ])
    }),

    // ------------------------------------------------------------------------
    // PRESET 4: Purple Love (보라빛 사랑)
    // ------------------------------------------------------------------------
    purple_love: Object.freeze({
      id: "purple_love",
      title: "Purple Love",
      koreanTitle: "보라빛 사랑",
      album: "Famous Singers 4: Semifinals Masterpiece",
      bpm: 70,
      key: "Db Major",
      durationSec: 64,
      defaultOklabProfile: "seoul_dusk_purple",
      styleDna: "Sophisticated Neo-Soul R&B ballad; twilight violet hues, subtle electric piano chords, sensual velvet vocal textures, and sacred royal lotus silhouettes unfolding against a Seoul skyline dusk.",
      rawLyrics: `[Intro]
노을이 내려앉은 빌딩 숲, 보라색 어둠이 차오르는 시간
Seoul skyline dusk settling over high-rises, violet shadows rising

[Verse 1]
가로등 불빛이 하나둘 켜질 때, 네 귓가에 속삭이던 약속
As streetlights flicker to life one by one, the promise whispered in your ear

[Pre-Chorus]
낮과 밤의 경계에서 흔들리는 우리 마음의 보랏빛 파동
The violet tremor of our hearts hovering on the frontier of day and night

[Chorus 1]
물들어가는 보라빛 사랑, 너와 나의 온도로 번지는 밤
Purple love spreading wide, a twilight night dyed with our shared warmth

[Verse 2]
차가운 바람 사이로 맞잡은 손, 침묵마저 달콤했던 순간
Hands intertwined in the chill wind, even silence tasted sweet

[Chorus 2]
세상이 모두 잠들어도 우리만의 색채로 빛나는 이 도시
Even when the world falls asleep, this city shines in our private hue

[Bridge]
수많은 별빛보다 찬란한 네 눈동자, 영원 속에 피어난 연꽃!
Brighter than a thousand stars, your gaze—a sacred lotus blooming in eternity!

[Outro]
보라색 안개 속으로... 영원히 남을 향기
Into the violet haze... an enduring fragrance that never fades`,
      scenes: Object.freeze([
        Object.freeze({
          id: "scene_01",
          index: 0,
          section: "Intro",
          startSec: 0,
          endSec: 8,
          lyricOriginal: "노을이 내려앉은 빌딩 숲, 보라색 어둠이 차오르는 시간...",
          lyricEn: "Seoul skyline dusk settling over high-rises, violet shadows rising...",
          convictionLevel: 0.17,
          negativeSpaceRatio: 0.83,
          svgMotif: "royal_lotus",
          sdfPreset: "seoul_dusk",
          oklabPalette: "seoul_dusk_purple",
          cameraMotion: "slow_breathe",
          strokeSpeed: 0.8,
          particleDensity: 0.16,
          rationale: "Closed royal lotus outline resting in dusk violet negative space, evoking whispered nocturnal secrecy."
        }),
        Object.freeze({
          id: "scene_02",
          index: 1,
          section: "Verse 1",
          startSec: 8,
          endSec: 16,
          lyricOriginal: "가로등 불빛이 하나둘 켜질 때, 네 귓가에 속삭이던 약속",
          lyricEn: "As streetlights flicker to life one by one, the promise whispered in your ear",
          convictionLevel: 0.25,
          negativeSpaceRatio: 0.77,
          svgMotif: "ink_confession",
          sdfPreset: "seoul_dusk",
          oklabPalette: "seoul_dusk_purple",
          cameraMotion: "gentle_drift_right",
          strokeSpeed: 0.95,
          particleDensity: 0.24,
          rationale: "Violet ink bleed tracing the soft contour of a city evening; close mic vocal delivery respected."
        }),
        Object.freeze({
          id: "scene_03",
          index: 2,
          section: "Pre-Chorus",
          startSec: 16,
          endSec: 24,
          lyricOriginal: "낮과 밤의 경계에서 흔들리는 우리 마음의 보랏빛 파동",
          lyricEn: "The violet tremor of our hearts hovering on the frontier of day and night",
          convictionLevel: 0.49,
          negativeSpaceRatio: 0.61,
          svgMotif: "royal_lotus",
          sdfPreset: "seoul_dusk",
          oklabPalette: "seoul_dusk_purple",
          cameraMotion: "parallax_rise",
          strokeSpeed: 1.25,
          particleDensity: 0.42,
          rationale: "The lotus petals begin their slow, graceful separation as neo-soul Rhodes harmonies widen the field."
        }),
        Object.freeze({
          id: "scene_04",
          index: 3,
          section: "Chorus 1",
          startSec: 24,
          endSec: 32,
          lyricOriginal: "물들어가는 보라빛 사랑, 너와 나의 온도로 번지는 밤",
          lyricEn: "Purple love spreading wide, a twilight night dyed with our shared warmth",
          convictionLevel: 0.77,
          negativeSpaceRatio: 0.43,
          svgMotif: "royal_lotus",
          sdfPreset: "seoul_dusk",
          oklabPalette: "seoul_dusk_purple",
          cameraMotion: "orbital_bloom",
          strokeSpeed: 1.5,
          particleDensity: 0.66,
          rationale: "Royal lotus fully unfurls with soft magenta and deep amethyst luminous halo."
        }),
        Object.freeze({
          id: "scene_05",
          index: 4,
          section: "Verse 2",
          startSec: 32,
          endSec: 40,
          lyricOriginal: "차가운 바람 사이로 맞잡은 손, 침묵마저 달콤했던 순간",
          lyricEn: "Hands intertwined in the chill wind, even silence tasted sweet",
          convictionLevel: 0.39,
          negativeSpaceRatio: 0.71,
          svgMotif: "window_rain",
          sdfPreset: "seoul_dusk",
          oklabPalette: "seoul_dusk_purple",
          cameraMotion: "slow_breathe",
          strokeSpeed: 0.9,
          particleDensity: 0.30,
          rationale: "Twilight condensation motes shimmer softly; negative space expands to preserve vocal sensitivity."
        }),
        Object.freeze({
          id: "scene_06",
          index: 5,
          section: "Chorus 2",
          startSec: 40,
          endSec: 48,
          lyricOriginal: "세상이 모두 잠들어도 우리만의 색채로 빛나는 이 도시",
          lyricEn: "Even when the world falls asleep, this city shines in our private hue",
          convictionLevel: 0.83,
          negativeSpaceRatio: 0.39,
          svgMotif: "royal_lotus",
          sdfPreset: "seoul_dusk",
          oklabPalette: "seoul_dusk_purple",
          cameraMotion: "orbital_bloom",
          strokeSpeed: 1.65,
          particleDensity: 0.76,
          rationale: "Twin concentric lotus halos pulse in synchronization with Gwyn's passionate vocal runs."
        }),
        Object.freeze({
          id: "scene_07",
          index: 6,
          section: "Bridge",
          startSec: 48,
          endSec: 56,
          lyricOriginal: "수많은 별빛보다 찬란한 네 눈동자, 영원 속에 피어난 연꽃!",
          lyricEn: "Brighter than a thousand stars, your gaze—a sacred lotus blooming in eternity!",
          convictionLevel: 0.95,
          negativeSpaceRatio: 0.33,
          svgMotif: "celestial_bloom",
          sdfPreset: "golden_bloom",
          oklabPalette: "stage_conviction_gold",
          cameraMotion: "parallax_rise",
          strokeSpeed: 2.05,
          particleDensity: 0.92,
          rationale: "Stage conviction climax: royal violet converts into blinding celestial starlight petal fireworks."
        }),
        Object.freeze({
          id: "scene_08",
          index: 7,
          section: "Outro",
          startSec: 56,
          endSec: 64,
          lyricOriginal: "보라색 안개 속으로... 영원히 남을 향기",
          lyricEn: "Into the violet haze... an enduring fragrance that never fades",
          convictionLevel: 0.15,
          negativeSpaceRatio: 0.87,
          svgMotif: "royal_lotus",
          sdfPreset: "seoul_dusk",
          oklabPalette: "seoul_dusk_purple",
          cameraMotion: "fade_still",
          strokeSpeed: 0.6,
          particleDensity: 0.10,
          rationale: "Petals fold gracefully back into a quiet solitary bud, settling into 87% violet-dusk negative space."
        })
      ])
    }),

    // ------------------------------------------------------------------------
    // PRESET 5: Light Up (빛을 밝혀)
    // ------------------------------------------------------------------------
    light_up: Object.freeze({
      id: "light_up",
      title: "Light Up",
      koreanTitle: "빛을 밝혀",
      album: "Famous Singers 4: Finals Showcase",
      bpm: 88,
      key: "Bb Major",
      durationSec: 64,
      defaultOklabProfile: "stage_conviction_gold",
      styleDna: "Empowering gospel-infused orchestral pop ballad; shimmering amber golds, triumphant vocal runs, celestial bloom explosions, and radiant golden embers illuminating the journey of personal rebirth.",
      rawLyrics: `[Intro]
짙은 장막을 걷어내는 한 줄기 빛의 숨결
A breath of light lifting the heavy velvet curtain

[Verse 1]
주저앉았던 무대 위, 어둠 속에서 내 이름을 부르던 목소리
On the stage where I once stumbled, the voice calling my name through the shadows

[Pre-Chorus]
가슴 깊은 곳에서 움트는 작은 불씨, 이제 타오를 준비를 해
A small ember sprouting deep in my chest, now ready to ignite

[Chorus 1]
빛을 밝혀, 어둠을 넘어 온 세상을 가득 채울 노래로!
Light up! A song to transcend darkness and fill the entire world!

[Verse 2]
상처 입은 날개라도 다시 펼칠 수 있어, 너라는 바람이 부니까
Even with scarred wings I can spread them wide, because your wind blows

[Chorus 2]
더 높이 날아올라 타오르는 불꽃처럼 타협 없는 나의 선언
Soaring higher like a blazing flame, my uncompromising declaration

[Bridge]
모든 한계를 부수고 울려 퍼지는 승리의 멜로디, 이것이 나의 영혼!
Shattering every limit, the victory melody resounding—this is my soul!

[Outro]
금빛 불씨가 내려앉은 평화... 찬란히 빛나리
Peace where golden embers settle gently... shining forever bright`,
      scenes: Object.freeze([
        Object.freeze({
          id: "scene_01",
          index: 0,
          section: "Intro",
          startSec: 0,
          endSec: 8,
          lyricOriginal: "짙은 장막을 걷어내는 한 줄기 빛의 숨결...",
          lyricEn: "A breath of light lifting the heavy velvet curtain...",
          convictionLevel: 0.19,
          negativeSpaceRatio: 0.81,
          svgMotif: "ink_confession",
          sdfPreset: "golden_bloom",
          oklabPalette: "stage_conviction_gold",
          cameraMotion: "slow_breathe",
          strokeSpeed: 0.85,
          particleDensity: 0.18,
          rationale: "A single razor-fine golden hairline emerges from deep amber-black velvet, initiating the awakening."
        }),
        Object.freeze({
          id: "scene_02",
          index: 1,
          section: "Verse 1",
          startSec: 8,
          endSec: 16,
          lyricOriginal: "주저앉았던 무대 위, 어둠 속에서 내 이름을 부르던 목소리",
          lyricEn: "On the stage where I once stumbled, the voice calling my name through the shadows",
          convictionLevel: 0.27,
          negativeSpaceRatio: 0.75,
          svgMotif: "acoustic_strings",
          sdfPreset: "warm_parchment",
          oklabPalette: "stage_conviction_gold",
          cameraMotion: "gentle_drift_right",
          strokeSpeed: 1.0,
          particleDensity: 0.26,
          rationale: "Vibrating bronze strings represent the raw human vulnerability before public rebirth."
        }),
        Object.freeze({
          id: "scene_03",
          index: 2,
          section: "Pre-Chorus",
          startSec: 16,
          endSec: 24,
          lyricOriginal: "가슴 깊은 곳에서 움트는 작은 불씨, 이제 타오를 준비를 해",
          lyricEn: "A small ember sprouting deep in my chest, now ready to ignite",
          convictionLevel: 0.52,
          negativeSpaceRatio: 0.58,
          svgMotif: "celestial_bloom",
          sdfPreset: "golden_bloom",
          oklabPalette: "stage_conviction_gold",
          cameraMotion: "parallax_rise",
          strokeSpeed: 1.35,
          particleDensity: 0.45,
          rationale: "Swelling embers rise rhythmically; negative space tightens as gospel chords announce transformation."
        }),
        Object.freeze({
          id: "scene_04",
          index: 3,
          section: "Chorus 1",
          startSec: 24,
          endSec: 32,
          lyricOriginal: "빛을 밝혀, 어둠을 넘어 온 세상을 가득 채울 노래로!",
          lyricEn: "Light up! A song to transcend darkness and fill the entire world!",
          convictionLevel: 0.79,
          negativeSpaceRatio: 0.41,
          svgMotif: "celestial_bloom",
          sdfPreset: "golden_bloom",
          oklabPalette: "stage_conviction_gold",
          cameraMotion: "orbital_bloom",
          strokeSpeed: 1.6,
          particleDensity: 0.72,
          rationale: "Radiant golden sunburst erupts; full chest resonance visualizer surrounded by warm amber corona."
        }),
        Object.freeze({
          id: "scene_05",
          index: 4,
          section: "Verse 2",
          startSec: 32,
          endSec: 40,
          lyricOriginal: "상처 입은 날개라도 다시 펼칠 수 있어, 너라는 바람이 부니까",
          lyricEn: "Even with scarred wings I can spread them wide, because your wind blows",
          convictionLevel: 0.43,
          negativeSpaceRatio: 0.67,
          svgMotif: "ink_confession",
          sdfPreset: "golden_bloom",
          oklabPalette: "stage_conviction_gold",
          cameraMotion: "gentle_drift_right",
          strokeSpeed: 1.05,
          particleDensity: 0.36,
          rationale: "Golden calligraphy traces feather motifs; contemplative breath preceding the final ascent."
        }),
        Object.freeze({
          id: "scene_06",
          index: 5,
          section: "Chorus 2",
          startSec: 40,
          endSec: 48,
          lyricOriginal: "더 높이 날아올라 타오르는 불꽃처럼 타협 없는 나의 선언",
          lyricEn: "Soaring higher like a blazing flame, my uncompromising declaration",
          convictionLevel: 0.86,
          negativeSpaceRatio: 0.36,
          svgMotif: "celestial_bloom",
          sdfPreset: "golden_bloom",
          oklabPalette: "stage_conviction_gold",
          cameraMotion: "orbital_bloom",
          strokeSpeed: 1.8,
          particleDensity: 0.82,
          rationale: "Expanded multi-layered golden rings pulsate in sync with soaring gospel ad-libs."
        }),
        Object.freeze({
          id: "scene_07",
          index: 6,
          section: "Bridge",
          startSec: 48,
          endSec: 56,
          lyricOriginal: "모든 한계를 부수고 울려 퍼지는 승리의 멜로디, 이것이 나의 영혼!",
          lyricEn: "Shattering every limit, the victory melody resounding—this is my soul!",
          convictionLevel: 0.98,
          negativeSpaceRatio: 0.30,
          svgMotif: "celestial_bloom",
          sdfPreset: "golden_bloom",
          oklabPalette: "stage_conviction_gold",
          cameraMotion: "parallax_rise",
          strokeSpeed: 2.2,
          particleDensity: 0.96,
          rationale: "Absolute Pinnacle of Stage-Level Conviction: blinding golden crescendo reaching the 30% negative space barrier."
        }),
        Object.freeze({
          id: "scene_08",
          index: 7,
          section: "Outro",
          startSec: 56,
          endSec: 64,
          lyricOriginal: "금빛 불씨가 내려앉은 평화... 찬란히 빛나리",
          lyricEn: "Peace where golden embers settle gently... shining forever bright",
          convictionLevel: 0.16,
          negativeSpaceRatio: 0.84,
          svgMotif: "ink_confession",
          sdfPreset: "golden_bloom",
          oklabPalette: "stage_conviction_gold",
          cameraMotion: "fade_still",
          strokeSpeed: 0.65,
          particleDensity: 0.12,
          rationale: "Golden embers gently float down into obsidian velvet; returning to quiet contemplation with 84% negative space."
        })
      ])
    })
  });

  /**
   * ==========================================================================
   * 3. THE BLOOMING ARC CURVE & GENERATOR
   * ==========================================================================
   */

  /**
   * Canonical 8-point Blooming Arc reference template.
   * Defines standard conviction and negative space profiles.
   */
  const BLOOMING_ARC_PROFILE = Object.freeze([
    { section: "Intro", conviction: 0.17, negSpace: 0.83, motif: "ink_confession", motion: "slow_breathe" },
    { section: "Verse 1", conviction: 0.25, negSpace: 0.77, motif: "window_rain", motion: "gentle_drift_right" },
    { section: "Pre-Chorus", conviction: 0.50, negSpace: 0.60, motif: "acoustic_strings", motion: "parallax_rise" },
    { section: "Chorus 1", conviction: 0.76, negSpace: 0.44, motif: "celestial_bloom", motion: "orbital_bloom" },
    { section: "Verse 2", conviction: 0.40, negSpace: 0.70, motif: "ink_confession", motion: "slow_breathe" },
    { section: "Chorus 2", conviction: 0.84, negSpace: 0.38, motif: "celestial_bloom", motion: "orbital_bloom" },
    { section: "Bridge", conviction: 0.95, negSpace: 0.34, motif: "celestial_bloom", motion: "parallax_rise" },
    { section: "Outro", conviction: 0.15, negSpace: 0.86, motif: "ink_confession", motion: "fade_still" }
  ]);

  /**
   * Helper: Parse raw lyrics text into structured sections.
   * Supports `[Section]` headers, unbracketed section headers, stanzas, or line pairs.
   * Intelligently maps to the 8 canonical sections if raw input is sparse.
   * 
   * @param {string} rawText 
   * @returns {Array<{ section: string, lyricOriginal: string, lyricEn: string }>}
   */
  function parseRawLyrics(rawText) {
    if (!rawText || typeof rawText !== 'string' || !rawText.trim()) {
      return [];
    }

    const trimmed = rawText.trim();
    const lines = trimmed.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return [];

    const canonicalSections = [
      "Intro", "Verse 1", "Pre-Chorus", "Chorus 1",
      "Verse 2", "Chorus 2", "Bridge", "Outro"
    ];

    // 1. Check if bracketed sections exist: [Intro], [Verse 1], etc.
    const bracketRegex = /^\[([^\]]+)\]$/;
    const hasBrackets = lines.some(l => bracketRegex.test(l));

    if (hasBrackets) {
      const sections = [];
      let currentSection = null;
      let currentOriginal = [];
      let currentEn = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const match = line.match(bracketRegex);

        if (match) {
          if (currentSection) {
            sections.push({
              section: currentSection,
              lyricOriginal: currentOriginal.join(' ') || currentSection,
              lyricEn: currentEn.join(' ') || ""
            });
          }
          currentSection = match[1].trim();
          currentOriginal = [];
          currentEn = [];
        } else {
          if (!currentSection) currentSection = "Verse 1";
          const isAscii = /^[\x00-\x7F\s.,!?'"()-]+$/.test(line);
          if (isAscii && currentOriginal.length > 0) {
            currentEn.push(line);
          } else {
            currentOriginal.push(line);
          }
        }
      }
      if (currentSection) {
        sections.push({
          section: currentSection,
          lyricOriginal: currentOriginal.join(' ') || currentSection,
          lyricEn: currentEn.join(' ') || ""
        });
      }
      if (sections.length >= 4) {
        return sections;
      }
    }

    // 2. Check for named section headers without brackets: e.g. "Intro:", "Verse 1:", "Bridge", etc.
    const namedHeaderRegex = /^(Intro|Verse\s*\d*|Pre-Chorus\s*\d*|Chorus\s*\d*|Bridge\s*\d*|Outro|Interlude|Hook\s*\d*):?$/i;
    const hasNamedHeaders = lines.some(l => namedHeaderRegex.test(l));

    if (hasNamedHeaders) {
      const sections = [];
      let currentSection = null;
      let currentOriginal = [];
      let currentEn = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const match = line.match(namedHeaderRegex);

        if (match) {
          if (currentSection) {
            sections.push({
              section: currentSection,
              lyricOriginal: currentOriginal.join(' ') || currentSection,
              lyricEn: currentEn.join(' ') || ""
            });
          }
          currentSection = match[1].trim();
          currentOriginal = [];
          currentEn = [];
        } else {
          if (!currentSection) currentSection = "Verse 1";
          const isAscii = /^[\x00-\x7F\s.,!?'"()-]+$/.test(line);
          if (isAscii && currentOriginal.length > 0) {
            currentEn.push(line);
          } else {
            currentOriginal.push(line);
          }
        }
      }
      if (currentSection) {
        sections.push({
          section: currentSection,
          lyricOriginal: currentOriginal.join(' ') || currentSection,
          lyricEn: currentEn.join(' ') || ""
        });
      }
      if (sections.length >= 4) {
        return sections;
      }
    }

    // 3. Check for multi-stanza lyrics separated by double newlines
    const stanzas = trimmed.split(/\r?\n\s*\r?\n/).map(s => s.trim()).filter(Boolean);
    if (stanzas.length >= 4 && stanzas.length <= 12) {
      return stanzas.map((stanza, idx) => {
        const sLines = stanza.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        const sectionName = canonicalSections[idx] || `Section ${idx + 1}`;
        return {
          section: sectionName,
          lyricOriginal: sLines[0] || sectionName,
          lyricEn: sLines.slice(1).join(' ') || ""
        };
      });
    }

    // 4. Default: Distribute available lyric lines evenly across the 8 canonical Blooming Arc sections
    const sections = [];
    const totalLines = lines.length;

    for (let idx = 0; idx < canonicalSections.length; idx++) {
      const sectionName = canonicalSections[idx];
      let assignedOriginal = "";
      let assignedEn = "";

      if (totalLines > 0) {
        const lineIdx = Math.floor((idx / canonicalSections.length) * totalLines);
        assignedOriginal = lines[lineIdx] || `${sectionName} lyric line`;
        if (lineIdx + 1 < totalLines && /^[\x00-\x7F\s.,!?'"()-]+$/.test(lines[lineIdx + 1])) {
          assignedEn = lines[lineIdx + 1];
        }
      } else {
        assignedOriginal = `달빛 아래 흐르는 ${sectionName}의 고백...`;
        assignedEn = `A quiet confession of ${sectionName} beneath the moonlight...`;
      }

      sections.push({
        section: sectionName,
        lyricOriginal: assignedOriginal,
        lyricEn: assignedEn
      });
    }

    return sections;
  }

  /**
   * Computes an interpolated Blooming Arc point for an arbitrary fractional position t in [0, 1].
   * Curves organically from 0.17 -> 0.25 -> 0.50 -> 0.77 -> 0.40 -> 0.84 -> 0.95 -> 0.15.
   * 
   * @param {number} t - Progress through sequence [0, 1]
   * @returns {{ conviction: number, negSpace: number }}
   */
  function evaluateBloomingCurve(t) {
    const clampedT = Math.max(0, Math.min(1, t));
    let conviction;

    if (clampedT < 0.125) {
      // Intro: 0.16 -> 0.20
      conviction = 0.16 + (clampedT / 0.125) * 0.04;
    } else if (clampedT < 0.25) {
      // Verse 1: 0.20 -> 0.28
      conviction = 0.20 + ((clampedT - 0.125) / 0.125) * 0.08;
    } else if (clampedT < 0.375) {
      // Pre-Chorus: 0.28 -> 0.52
      conviction = 0.28 + ((clampedT - 0.25) / 0.125) * 0.24;
    } else if (clampedT < 0.50) {
      // Chorus 1: 0.52 -> 0.76
      conviction = 0.52 + ((clampedT - 0.375) / 0.125) * 0.24;
    } else if (clampedT < 0.625) {
      // Verse 2 trough: 0.76 -> 0.40
      conviction = 0.76 - ((clampedT - 0.50) / 0.125) * 0.36;
    } else if (clampedT < 0.75) {
      // Chorus 2: 0.40 -> 0.85
      conviction = 0.40 + ((clampedT - 0.625) / 0.125) * 0.45;
    } else if (clampedT < 0.875) {
      // Bridge peak: 0.85 -> 0.96
      conviction = 0.85 + ((clampedT - 0.75) / 0.125) * 0.11;
    } else {
      // Outro descent: 0.96 -> 0.15
      conviction = 0.96 - ((clampedT - 0.875) / 0.125) * 0.81;
    }

    conviction = Math.round(conviction * 100) / 100;
    // Negative space is inversely related, strictly clamped between 0.30 and 0.88
    let negSpace = Math.round((1.0 - (conviction * 0.72)) * 100) / 100;
    negSpace = Math.max(0.30, Math.min(0.88, negSpace));

    return { conviction, negSpace };
  }

  /**
   * Selects an appropriate visual motif based on section and conviction level.
   */
  function pickMotif(sectionName, conviction) {
    const s = (sectionName || "").toLowerCase();
    if (s.includes("intro") || s.includes("outro")) {
      return "ink_confession";
    }
    if (s.includes("bridge") || conviction >= 0.90) {
      return "celestial_bloom";
    }
    if (s.includes("chorus") || conviction >= 0.70) {
      return "celestial_bloom";
    }
    if (s.includes("pre-chorus") || (conviction >= 0.45 && conviction < 0.70)) {
      return "acoustic_strings";
    }
    if (s.includes("verse 1")) {
      return "window_rain";
    }
    if (s.includes("verse 2")) {
      return "ink_confession";
    }
    return "ink_confession";
  }

  /**
   * Selects camera motion matching the dynamic intensity of the section.
   */
  function pickCameraMotion(sectionName, conviction) {
    const s = (sectionName || "").toLowerCase();
    if (s.includes("outro")) return "fade_still";
    if (s.includes("intro")) return "slow_breathe";
    if (conviction >= 0.88 || s.includes("bridge")) return "parallax_rise";
    if (conviction >= 0.70 || s.includes("chorus")) return "orbital_bloom";
    if (s.includes("pre-chorus")) return "parallax_rise";
    return "gentle_drift_right";
  }

  /**
   * Generates a poetic epistemic rationale for each scene.
   */
  function buildSceneRationale(section, conviction, negSpace, motif) {
    const negPercent = Math.round(negSpace * 100);
    const convPercent = Math.round(conviction * 100);

    const motifNames = {
      ink_confession: "Hand-drawn ink calligraphy",
      window_rain: "Rain streaks on cold glass",
      whale_gem: "Abyssal whale gem silhouette",
      royal_lotus: "Sacred royal lotus geometry",
      acoustic_strings: "Resonating acoustic string vectors",
      celestial_bloom: "Incandescent celestial bloom"
    };

    const motifLabel = motifNames[motif] || "Visual motif";

    if (section.toLowerCase().includes("intro")) {
      return `${motifLabel} emerges against silence, establishing the private confession premise with ${negPercent}% negative space.`;
    }
    if (section.toLowerCase().includes("verse 1")) {
      return `Vocal proximity kept stripped-back and vulnerable; ${motifLabel} honors acoustic phrasing with ${negPercent}% negative space.`;
    }
    if (section.toLowerCase().includes("pre-chorus")) {
      return `Harmonic tension rises as ${motifLabel} gathers velocity, gently narrowing negative space to ${negPercent}%.`;
    }
    if (section.toLowerCase().includes("chorus")) {
      return `Emotional crest at ${convPercent}% conviction: ${motifLabel} opens in vibrant color while preserved dark borders prevent spectacle clutter.`;
    }
    if (section.toLowerCase().includes("verse 2")) {
      return `Dynamic trough after chorus release: negative space widens back to ${negPercent}%, centering solitary reflection.`;
    }
    if (section.toLowerCase().includes("bridge")) {
      return `The Peak of Stage-Level Conviction (${convPercent}%): full kinetic power channeled into ${motifLabel}, anchored by ${negPercent}% negative space.`;
    }
    if (section.toLowerCase().includes("outro")) {
      return `Final fade to an intimate whisper: remaining particles decelerate into quiet dark space (${negPercent}% negative ratio).`;
    }
    return `Balanced emotional articulation with ${convPercent}% conviction and ${negPercent}% negative space.`;
  }

  /**
   * Generates a complete Sequence Bible from song metadata and raw lyrics.
   * Guarantees zero gaps across `durationSec`.
   * 
   * @param {Object} songMeta - { id, title, koreanTitle, bpm, defaultOklabProfile, styleDna }
   * @param {string} rawLyricsText - Multiline string or sections
   * @param {number} [durationSec=64] - Total duration in seconds
   * @returns {Object} Complete Sequence Bible
   */
  function generateSequenceBible(songMeta, rawLyricsText, durationSec) {
    const meta = songMeta || {};
    const totalDuration = (typeof durationSec === 'number' && durationSec > 0) ? durationSec : 64;
    const songId = meta.id || "custom_song_" + Date.now();
    const title = meta.title || "Untitled Confession";
    const koreanTitle = meta.koreanTitle || "무제 (Untitled)";
    const bpm = meta.bpm || 72;
    const defaultOklab = meta.defaultOklabProfile || "moonlit_confession";
    const styleDna = meta.styleDna || "Private confession delivered with stage-level conviction; organic Blooming Arc.";

    // Parse lyrics or fall back to default 8-section layout
    let parsedSections = parseRawLyrics(rawLyricsText);

    if (parsedSections.length === 0) {
      parsedSections = BLOOMING_ARC_PROFILE.map((p, idx) => ({
        section: p.section,
        lyricOriginal: `달빛 아래 흐르는 ${p.section}의 고백...`,
        lyricEn: `A quiet confession of ${p.section} beneath the moonlight...`
      }));
    }

    const sceneCount = parsedSections.length;
    const baseDuration = totalDuration / sceneCount;
    const scenes = [];

    for (let i = 0; i < sceneCount; i++) {
      const sectionData = parsedSections[i];
      const startSec = Math.round((i * baseDuration) * 100) / 100;
      const endSec = (i === sceneCount - 1)
        ? totalDuration
        : Math.round(((i + 1) * baseDuration) * 100) / 100;

      const progressT = (sceneCount > 1) ? (i / (sceneCount - 1)) : 0.5;
      const { conviction, negSpace } = evaluateBloomingCurve(progressT);

      const sectionName = sectionData.section || `Scene ${i + 1}`;
      const motif = pickMotif(sectionName, conviction);
      const cameraMotion = pickCameraMotion(sectionName, conviction);
      const sdfPreset = (conviction >= 0.88)
        ? "golden_bloom"
        : (defaultOklab === "whale_bioluminescence" ? "whale_gem_sdf" : (defaultOklab === "seoul_dusk_purple" ? "seoul_dusk" : (defaultOklab === "acoustic_parchment" ? "warm_parchment" : "moonlit_mist")));
      
      const strokeSpeed = Math.round((0.7 + (conviction * 1.3)) * 100) / 100;
      const particleDensity = Math.round((0.15 + (conviction * 0.78)) * 100) / 100;
      const rationale = buildSceneRationale(sectionName, conviction, negSpace, motif);

      scenes.push({
        id: `scene_${String(i + 1).padStart(2, '0')}`,
        index: i,
        section: sectionName,
        startSec: startSec,
        endSec: endSec,
        lyricOriginal: sectionData.lyricOriginal || "",
        lyricEn: sectionData.lyricEn || "",
        convictionLevel: conviction,
        negativeSpaceRatio: negSpace,
        svgMotif: motif,
        sdfPreset: sdfPreset,
        oklabPalette: (conviction >= 0.90) ? "stage_conviction_gold" : defaultOklab,
        cameraMotion: cameraMotion,
        strokeSpeed: strokeSpeed,
        particleDensity: particleDensity,
        rationale: rationale
      });
    }

    return {
      songId: songId,
      title: title,
      koreanTitle: koreanTitle,
      bpm: bpm,
      durationSec: totalDuration,
      defaultOklabProfile: defaultOklab,
      styleDna: styleDna,
      createdAt: new Date().toISOString(),
      scenes: scenes
    };
  }

  /**
   * ==========================================================================
   * 4. FIVE PILLARS AUDITOR
   * Evaluates any Sequence Bible against the 5 Gwyn Dorado Creative Pillars.
   * Returns precise numeric scores [0.0 - 1.0], statuses, and diagnostics.
   * ==========================================================================
   */
  function auditFivePillars(bible) {
    if (!bible || !Array.isArray(bible.scenes) || bible.scenes.length === 0) {
      return {
        passed: false,
        compositeScore: 0.0,
        pillars: {
          confession: { score: 0.0, status: "FAIL", note: "No scenes found in sequence bible." },
          antiSpectacle: { score: 0.0, status: "FAIL", note: "No scenes found." },
          humanFoundation: { score: 0.0, status: "FAIL", note: "No scenes found." },
          bloomingArc: { score: 0.0, status: "FAIL", note: "No scenes found." },
          nuance: { score: 0.0, status: "FAIL", note: "No scenes found." }
        }
      };
    }

    const scenes = bible.scenes;
    const n = scenes.length;

    // ------------------------------------------------------------------------
    // Pillar 1: The Confession Check
    // - Every scene must have an epistemic rationale (min 15 chars)
    // - No empty lyrics
    // - Intimate interiority
    // ------------------------------------------------------------------------
    let rationaleValidCount = 0;
    scenes.forEach(s => {
      if (s.rationale && typeof s.rationale === 'string' && s.rationale.trim().length >= 15) {
        rationaleValidCount++;
      }
    });
    const confessionScore = Math.round((rationaleValidCount / n) * 100) / 100;
    const confessionStatus = confessionScore >= 0.90 ? "PASS" : (confessionScore >= 0.70 ? "WARN" : "FAIL");
    const confessionNote = confessionScore >= 0.90
      ? `All ${n} scenes provide articulated epistemic rationale tied to private confession.`
      : `${rationaleValidCount}/${n} scenes have sufficient epistemic rationale.`;

    // ------------------------------------------------------------------------
    // Pillar 2: The Anti-Spectacle Check
    // - Every scene must have negativeSpaceRatio >= 0.30
    // - Sequence average negative space >= 0.50
    // - Negative space upper bound >= 0.75 in quiet sections
    // ------------------------------------------------------------------------
    let minNegSpace = 1.0;
    let maxNegSpace = 0.0;
    let sumNegSpace = 0.0;
    let violations = 0;

    scenes.forEach(s => {
      const ns = typeof s.negativeSpaceRatio === 'number' ? s.negativeSpaceRatio : 0.5;
      if (ns < minNegSpace) minNegSpace = ns;
      if (ns > maxNegSpace) maxNegSpace = ns;
      sumNegSpace += ns;
      if (ns < 0.30) {
        violations++;
      }
    });

    const avgNegSpace = Math.round((sumNegSpace / n) * 100) / 100;
    let antiSpectacleScore = 1.0;
    if (violations > 0) {
      antiSpectacleScore -= (violations / n) * 0.5;
    }
    if (avgNegSpace < 0.50) {
      antiSpectacleScore -= 0.3;
    }
    if (maxNegSpace < 0.70) {
      antiSpectacleScore -= 0.2;
    }
    antiSpectacleScore = Math.max(0, Math.min(1.0, Math.round(antiSpectacleScore * 100) / 100));
    const antiSpectacleStatus = (violations === 0 && avgNegSpace >= 0.50) ? "PASS" : (antiSpectacleScore >= 0.70 ? "WARN" : "FAIL");
    const antiSpectacleNote = violations === 0
      ? `Maintains generous negative space throughout (avg: ${(avgNegSpace * 100).toFixed(1)}%, min: ${(minNegSpace * 100).toFixed(1)}%, max: ${(maxNegSpace * 100).toFixed(1)}%).`
      : `${violations} scenes violated the 30% negative space minimum barrier!`;

    // ------------------------------------------------------------------------
    // Pillar 3: The Human Foundation Check
    // - Scene 1 (Intro or Verse 1) conviction <= 0.35
    // - Scene 1 negative space >= 0.65
    // - Stripped-back motif
    // ------------------------------------------------------------------------
    const firstScene = scenes[0];
    const openConviction = (firstScene && typeof firstScene.convictionLevel === 'number') ? firstScene.convictionLevel : 0.5;
    const openNegSpace = (firstScene && typeof firstScene.negativeSpaceRatio === 'number') ? firstScene.negativeSpaceRatio : 0.5;
    const initialMotifs = ["ink_confession", "acoustic_strings", "window_rain", "whale_gem", "royal_lotus"];

    let humanFoundationScore = 1.0;
    if (openConviction > 0.35) {
      humanFoundationScore -= Math.min(0.5, (openConviction - 0.35) * 1.5);
    }
    if (openNegSpace < 0.65) {
      humanFoundationScore -= Math.min(0.4, (0.65 - openNegSpace) * 1.5);
    }
    if (firstScene && !initialMotifs.includes(firstScene.svgMotif)) {
      humanFoundationScore -= 0.2;
    }
    humanFoundationScore = Math.max(0, Math.min(1.0, Math.round(humanFoundationScore * 100) / 100));
    const humanFoundationStatus = humanFoundationScore >= 0.85 ? "PASS" : (humanFoundationScore >= 0.70 ? "WARN" : "FAIL");
    const humanFoundationNote = humanFoundationScore >= 0.85
      ? `Begins stripped-back (conviction: ${openConviction.toFixed(2)}, negSpace: ${(openNegSpace * 100).toFixed(1)}%) honoring vocal intimacy.`
      : `Opening scene conviction (${openConviction.toFixed(2)}) or negative space (${(openNegSpace * 100).toFixed(1)}%) deviates from stripped-back acoustic baseline.`;

    // ------------------------------------------------------------------------
    // Pillar 4: The Blooming Arc Check
    // - Peak conviction >= opening conviction + 0.45
    // - Final scene (Outro) conviction <= 0.35
    // - Final scene negative space >= 0.70
    // ------------------------------------------------------------------------
    let peakConviction = 0.0;
    scenes.forEach(s => {
      const c = typeof s.convictionLevel === 'number' ? s.convictionLevel : 0.0;
      if (c > peakConviction) peakConviction = c;
    });

    const lastScene = scenes[n - 1];
    const outroConviction = (lastScene && typeof lastScene.convictionLevel === 'number') ? lastScene.convictionLevel : 0.5;
    const outroNegSpace = (lastScene && typeof lastScene.negativeSpaceRatio === 'number') ? lastScene.negativeSpaceRatio : 0.5;

    const dynamicDelta = peakConviction - openConviction;
    let bloomingArcScore = 1.0;

    if (dynamicDelta < 0.45) {
      bloomingArcScore -= Math.min(0.5, (0.45 - dynamicDelta) * 1.5);
    }
    if (outroConviction > 0.35) {
      bloomingArcScore -= Math.min(0.35, (outroConviction - 0.35) * 1.5);
    }
    if (outroNegSpace < 0.70) {
      bloomingArcScore -= Math.min(0.25, (0.70 - outroNegSpace) * 1.0);
    }
    bloomingArcScore = Math.max(0, Math.min(1.0, Math.round(bloomingArcScore * 100) / 100));
    const bloomingArcStatus = bloomingArcScore >= 0.85 ? "PASS" : (bloomingArcScore >= 0.70 ? "WARN" : "FAIL");
    const bloomingArcNote = bloomingArcScore >= 0.85
      ? `Full dynamic blooming arc confirmed (Opening: ${openConviction.toFixed(2)} -> Peak: ${peakConviction.toFixed(2)} [Δ+${dynamicDelta.toFixed(2)}] -> Outro: ${outroConviction.toFixed(2)}).`
      : `Blooming arc requires wider dynamic contrast (Δ+${dynamicDelta.toFixed(2)}, outro conviction: ${outroConviction.toFixed(2)}).`;

    // ------------------------------------------------------------------------
    // Pillar 5: The Nuance Check
    // - Lyrical coverage
    // - Motif variety across sections (>= 2 unique motifs)
    // - Camera motion progression
    // ------------------------------------------------------------------------
    const uniqueMotifs = new Set(scenes.map(s => s.svgMotif).filter(Boolean));
    const uniqueMotions = new Set(scenes.map(s => s.cameraMotion).filter(Boolean));
    let lyricsPresentCount = 0;
    scenes.forEach(s => {
      if ((s.lyricOriginal && s.lyricOriginal.trim().length > 0) || (s.lyricEn && s.lyricEn.trim().length > 0)) {
        lyricsPresentCount++;
      }
    });

    let nuanceScore = 1.0;
    if (uniqueMotifs.size < 2 && n >= 3) {
      nuanceScore -= 0.35;
    }
    if (uniqueMotions.size < 2 && n >= 3) {
      nuanceScore -= 0.25;
    }
    if (lyricsPresentCount < n) {
      nuanceScore -= ((n - lyricsPresentCount) / n) * 0.4;
    }
    nuanceScore = Math.max(0, Math.min(1.0, Math.round(nuanceScore * 100) / 100));
    const nuanceStatus = nuanceScore >= 0.85 ? "PASS" : (nuanceScore >= 0.70 ? "WARN" : "FAIL");
    const nuanceNote = nuanceScore >= 0.85
      ? `Nuance confirmed: ${uniqueMotifs.size} distinct visual motifs, ${uniqueMotions.size} camera motions, 100% lyric synchronization.`
      : `Nuance flags: ${uniqueMotifs.size} motifs, ${lyricsPresentCount}/${n} scenes with lyrics.`;

    // ------------------------------------------------------------------------
    // Composite Calculation
    // ------------------------------------------------------------------------
    const compositeScore = Math.round(
      ((confessionScore + antiSpectacleScore + humanFoundationScore + bloomingArcScore + nuanceScore) / 5) * 100
    ) / 100;

    const passed = compositeScore >= 0.80 &&
      confessionScore >= 0.70 &&
      antiSpectacleScore >= 0.70 &&
      humanFoundationScore >= 0.70 &&
      bloomingArcScore >= 0.70 &&
      nuanceScore >= 0.70;

    return {
      passed: passed,
      compositeScore: compositeScore,
      pillars: {
        confession: { score: confessionScore, status: confessionStatus, note: confessionNote },
        antiSpectacle: { score: antiSpectacleScore, status: antiSpectacleStatus, note: antiSpectacleNote },
        humanFoundation: { score: humanFoundationScore, status: humanFoundationStatus, note: humanFoundationNote },
        bloomingArc: { score: bloomingArcScore, status: bloomingArcStatus, note: bloomingArcNote },
        nuance: { score: nuanceScore, status: nuanceStatus, note: nuanceNote }
      }
    };
  }

  /**
   * ==========================================================================
   * 5. HELPER UTILITIES & EXPORT INTERFACE
   * ==========================================================================
   */

  /**
   * Retrieves a deep clone of a preset song by ID.
   * @param {string} presetId 
   * @returns {Object|null}
   */
  function getPresetSong(presetId) {
    const preset = PRESET_SONGS[presetId];
    if (!preset) return null;
    return JSON.parse(JSON.stringify(preset));
  }

  /**
   * Lists summary metadata for all preset songs.
   * @returns {Array<Object>}
   */
  function listPresetSongs() {
    return Object.keys(PRESET_SONGS).map(id => {
      const p = PRESET_SONGS[id];
      return {
        id: p.id,
        title: p.title,
        koreanTitle: p.koreanTitle,
        album: p.album,
        bpm: p.bpm,
        durationSec: p.durationSec,
        defaultOklabProfile: p.defaultOklabProfile,
        sceneCount: p.scenes.length
      };
    });
  }

  /**
   * Exports a Sequence Bible to a formatted JSON string.
   */
  function exportSequenceBibleJson(bible) {
    return JSON.stringify(bible, null, 2);
  }

  /**
   * Parses and validates a JSON string as a Sequence Bible.
   */
  function importSequenceBibleJson(jsonStr) {
    try {
      const parsed = JSON.parse(jsonStr);
      if (!parsed || !Array.isArray(parsed.scenes)) {
        throw new Error("Invalid sequence bible: missing 'scenes' array.");
      }
      return parsed;
    } catch (err) {
      console.error("[CreativeDirector] Failed to import sequence bible JSON:", err);
      return null;
    }
  }

  // Assemble the Public Interface
  const CreativeDirector = {
    PILLARS: PILLARS,
    PRESET_SONGS: PRESET_SONGS,
    VALID_MOTIFS: VALID_MOTIFS,
    VALID_SDF_PRESETS: VALID_SDF_PRESETS,
    VALID_CAMERA_MOTIONS: VALID_CAMERA_MOTIONS,
    VALID_OKLAB_PALETTES: VALID_OKLAB_PALETTES,
    BLOOMING_ARC_PROFILE: BLOOMING_ARC_PROFILE,
    generateSequenceBible: generateSequenceBible,
    auditFivePillars: auditFivePillars,
    auditPillars: auditFivePillars,
    getPresetSong: getPresetSong,
    getPreset: getPresetSong,
    listPresetSongs: listPresetSongs,
    exportSequenceBibleJson: exportSequenceBibleJson,
    importSequenceBibleJson: importSequenceBibleJson,
    autoChoreographFromLyrics: function (lyricsText, options = {}) {
      const bible = generateSequenceBible(
        { title: options.title || 'Choreographed Sequence', bpm: options.bpm || 72 },
        lyricsText,
        options.durationSec || 64
      );
      return bible && bible.scenes ? bible.scenes : [];
    }
  };

  // Attach to window.DoradoStudio.CreativeDirector
  DoradoStudio.CreativeDirector = CreativeDirector;

  // CommonJS / Node environment support for automated headless verification
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = CreativeDirector;
  }

})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
