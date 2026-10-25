# SUBAGENT 03: CODE-SVG SCENE ARTBOARD CRAFTERS
**Project:** Gwyn Dorado Music Video Studio — *Losing My Heart* (마음을 놓치다)
**Target Shard Directories:** `workspace/runs/gwyn_dorado_mv/shards/scene_01/` through `scene_08/`
**Exclusive Output Files:**
- `workspace/runs/gwyn_dorado_mv/shards/scene_01/artboard.svg`
- `workspace/runs/gwyn_dorado_mv/shards/scene_02/artboard.svg`
- `workspace/runs/gwyn_dorado_mv/shards/scene_03/artboard.svg`
- `workspace/runs/gwyn_dorado_mv/shards/scene_04/artboard.svg`
- `workspace/runs/gwyn_dorado_mv/shards/scene_05/artboard.svg`
- `workspace/runs/gwyn_dorado_mv/shards/scene_06/artboard.svg`
- `workspace/runs/gwyn_dorado_mv/shards/scene_07/artboard.svg`
- `workspace/runs/gwyn_dorado_mv/shards/scene_08/artboard.svg`
- `workspace/runs/gwyn_dorado_mv/shards/svg_manifest.json`

---

## 1. Zero-Friction Isolation Rules
1. **Parallel Worker Architecture:** You may launch 8 independent parallel scene workers. Each worker writes **ONLY** to its assigned shard directory (`scene_01/`, `scene_02/`, etc.).
2. **No Bitmap Ingestion:** Strict Code-SVG rule! All visual assets must be 100% scalable vector code (bezier curves, polygon strokes, gradient meshes). No JPEG, PNG, or base64 raster blobs.

---

## 2. Technical Artboard Specifications
- **Canvas Resolution:** 3840 x 2160 pixels
- **ViewBox:** `viewBox="0 0 3840 2160"`
- **SVG Layer Hierarchy:**
  1. `<g id="bg-negative-space">` — Deep indigo/black background polygon (#05070B)
  2. `<g id="motif-elements">` — Procedural motif geometry (`ink_confession, window_rain, acoustic_strings, celestial_bloom, ink_confession, window_rain, celestial_bloom, ink_confession`)
  3. `<g id="performer-silhouette">` — Gwyn Dorado contour strokes with organic line variation
  4. `<g id="atmospheric-particles">` — Delicate vector stardust and mist motes
- **Stroke Style:** `stroke-linecap="round"`, `stroke-linejoin="round"`, organic hand-drawn ink quality.

---

## 3. Scene-by-Scene Vector Directives
### SCENE_01: Intro (0s – 8s)
- **Motif:** `ink_confession`
- **Negative Space Target:** 84% (DO NOT fill the center or edges beyond 16% coverage)
- **Conviction / Stroke Weight:** 16% (Stroke width: 1.0px)
- **Rationale:** Sparse single-stroke calligraphy on dark parchment establishes the private confession premise with 84% negative space.
- **CLI Generator:**
  ```bash
  vectorcraft-cli artboard new "Artboard_scene_01" --width 3840 --height 2160 --viewbox "0 0 3840 2160" --background "#05070B"
  vectorcraft-cli layer add "Motif_ink_confession" --artboard "Artboard_scene_01"
  vectorcraft-cli export --artboard "Artboard_scene_01" --out "workspace/runs/gwyn_dorado_mv/shards/scene_01/artboard.svg"
  ```

### SCENE_02: Verse 1 (8s – 16s)
- **Motif:** `window_rain`
- **Negative Space Target:** 78% (DO NOT fill the center or edges beyond 22% coverage)
- **Conviction / Stroke Weight:** 24% (Stroke width: 1.2px)
- **Rationale:** Delicate condensation droplets slide down cool glass; the stripped-back human foundation honors close vocal intimacy.
- **CLI Generator:**
  ```bash
  vectorcraft-cli artboard new "Artboard_scene_02" --width 3840 --height 2160 --viewbox "0 0 3840 2160" --background "#05070B"
  vectorcraft-cli layer add "Motif_window_rain" --artboard "Artboard_scene_02"
  vectorcraft-cli export --artboard "Artboard_scene_02" --out "workspace/runs/gwyn_dorado_mv/shards/scene_02/artboard.svg"
  ```

### SCENE_03: Pre-Chorus (16s – 24s)
- **Motif:** `acoustic_strings`
- **Negative Space Target:** 62% (DO NOT fill the center or edges beyond 38% coverage)
- **Conviction / Stroke Weight:** 48% (Stroke width: 1.5px)
- **Rationale:** Resonating string vectors radiate through subtle mist as harmonic tension builds towards the first confession crest.
- **CLI Generator:**
  ```bash
  vectorcraft-cli artboard new "Artboard_scene_03" --width 3840 --height 2160 --viewbox "0 0 3840 2160" --background "#05070B"
  vectorcraft-cli layer add "Motif_acoustic_strings" --artboard "Artboard_scene_03"
  vectorcraft-cli export --artboard "Artboard_scene_03" --out "workspace/runs/gwyn_dorado_mv/shards/scene_03/artboard.svg"
  ```

### SCENE_04: Chorus 1 (24s – 32s)
- **Motif:** `celestial_bloom`
- **Negative Space Target:** 44% (DO NOT fill the center or edges beyond 56% coverage)
- **Conviction / Stroke Weight:** 76% (Stroke width: 1.9px)
- **Rationale:** Luminescent celestial flower blooms outwards, emotional release framed within deep indigo negative space.
- **CLI Generator:**
  ```bash
  vectorcraft-cli artboard new "Artboard_scene_04" --width 3840 --height 2160 --viewbox "0 0 3840 2160" --background "#05070B"
  vectorcraft-cli layer add "Motif_celestial_bloom" --artboard "Artboard_scene_04"
  vectorcraft-cli export --artboard "Artboard_scene_04" --out "workspace/runs/gwyn_dorado_mv/shards/scene_04/artboard.svg"
  ```

### SCENE_05: Verse 2 (32s – 40s)
- **Motif:** `ink_confession`
- **Negative Space Target:** 70% (DO NOT fill the center or edges beyond 30% coverage)
- **Conviction / Stroke Weight:** 40% (Stroke width: 1.4px)
- **Rationale:** Dynamic breath and contrast recovery; single ink drops disperse into parchment as the memory is confronted alone.
- **CLI Generator:**
  ```bash
  vectorcraft-cli artboard new "Artboard_scene_05" --width 3840 --height 2160 --viewbox "0 0 3840 2160" --background "#05070B"
  vectorcraft-cli layer add "Motif_ink_confession" --artboard "Artboard_scene_05"
  vectorcraft-cli export --artboard "Artboard_scene_05" --out "workspace/runs/gwyn_dorado_mv/shards/scene_05/artboard.svg"
  ```

### SCENE_06: Chorus 2 (40s – 48s)
- **Motif:** `window_rain`
- **Negative Space Target:** 38% (DO NOT fill the center or edges beyond 62% coverage)
- **Conviction / Stroke Weight:** 84% (Stroke width: 2.1px)
- **Rationale:** Heightened rainfall refracting starlight; vocal resonance deepens with full conviction while negative space avoids visual noise.
- **CLI Generator:**
  ```bash
  vectorcraft-cli artboard new "Artboard_scene_06" --width 3840 --height 2160 --viewbox "0 0 3840 2160" --background "#05070B"
  vectorcraft-cli layer add "Motif_window_rain" --artboard "Artboard_scene_06"
  vectorcraft-cli export --artboard "Artboard_scene_06" --out "workspace/runs/gwyn_dorado_mv/shards/scene_06/artboard.svg"
  ```

### SCENE_07: Bridge (48s – 56s)
- **Motif:** `celestial_bloom`
- **Negative Space Target:** 34% (DO NOT fill the center or edges beyond 66% coverage)
- **Conviction / Stroke Weight:** 95% (Stroke width: 2.2px)
- **Rationale:** The Peak of Stage-Level Conviction: celestial gold burst breaking the darkness, reaching maximum dynamic power.
- **CLI Generator:**
  ```bash
  vectorcraft-cli artboard new "Artboard_scene_07" --width 3840 --height 2160 --viewbox "0 0 3840 2160" --background "#05070B"
  vectorcraft-cli layer add "Motif_celestial_bloom" --artboard "Artboard_scene_07"
  vectorcraft-cli export --artboard "Artboard_scene_07" --out "workspace/runs/gwyn_dorado_mv/shards/scene_07/artboard.svg"
  ```

### SCENE_08: Outro (56s – 64s)
- **Motif:** `ink_confession`
- **Negative Space Target:** 86% (DO NOT fill the center or edges beyond 14% coverage)
- **Conviction / Stroke Weight:** 15% (Stroke width: 1.0px)
- **Rationale:** Return to the intimate whisper; ink strokes dissolve into pure silence and 86% negative space on dark parchment.
- **CLI Generator:**
  ```bash
  vectorcraft-cli artboard new "Artboard_scene_08" --width 3840 --height 2160 --viewbox "0 0 3840 2160" --background "#05070B"
  vectorcraft-cli layer add "Motif_ink_confession" --artboard "Artboard_scene_08"
  vectorcraft-cli export --artboard "Artboard_scene_08" --out "workspace/runs/gwyn_dorado_mv/shards/scene_08/artboard.svg"
  ```


---

## 4. Verification Gate
- [ ] All 8 `artboard.svg` files exist and are valid standalone SVGs (viewable in browser).
- [ ] Negative space ratio passes the anti-spectacle check (>= 30% per file).
