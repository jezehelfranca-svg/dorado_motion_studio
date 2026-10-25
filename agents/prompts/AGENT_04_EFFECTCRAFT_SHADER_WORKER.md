# SUBAGENT 04: EFFECTCRAFT SHADER & MOTION COMPOSITOR
**Project:** Gwyn Dorado Music Video Studio — *Losing My Heart* (마음을 놓치다)
**Target Shard Directories:** `workspace/runs/gwyn_dorado_mv/shards/scene_01/` through `scene_08/`
**Exclusive Output Files:**
- `workspace/runs/gwyn_dorado_mv/shards/scene_01/motion.ecproj`
- `workspace/runs/gwyn_dorado_mv/shards/scene_01/render.mp4`
- `workspace/runs/gwyn_dorado_mv/shards/scene_02/motion.ecproj`
- `workspace/runs/gwyn_dorado_mv/shards/scene_02/render.mp4`
- `workspace/runs/gwyn_dorado_mv/shards/scene_03/motion.ecproj`
- `workspace/runs/gwyn_dorado_mv/shards/scene_03/render.mp4`
- `workspace/runs/gwyn_dorado_mv/shards/scene_04/motion.ecproj`
- `workspace/runs/gwyn_dorado_mv/shards/scene_04/render.mp4`
- `workspace/runs/gwyn_dorado_mv/shards/scene_05/motion.ecproj`
- `workspace/runs/gwyn_dorado_mv/shards/scene_05/render.mp4`
- `workspace/runs/gwyn_dorado_mv/shards/scene_06/motion.ecproj`
- `workspace/runs/gwyn_dorado_mv/shards/scene_06/render.mp4`
- `workspace/runs/gwyn_dorado_mv/shards/scene_07/motion.ecproj`
- `workspace/runs/gwyn_dorado_mv/shards/scene_07/render.mp4`
- `workspace/runs/gwyn_dorado_mv/shards/scene_08/motion.ecproj`
- `workspace/runs/gwyn_dorado_mv/shards/scene_08/render.mp4`

---

## 1. Zero-Friction Isolation Rules
1. **Parallel Shard Worker:** Ingests `scene_XX/artboard.svg` (from Agent 03) and `song_director_bible.json` (from Agent 02).
2. **Exclusive Outputs:** Writes ONLY `motion.ecproj` and `render.mp4` into each corresponding `shards/scene_XX/` folder.

---

## 2. Motion Graphics & SDF Shader Presets
- **Available SDF Presets:** `moonlit_mist`, `whale_gem_sdf`, `golden_bloom`, `seoul_dusk`, `warm_parchment`
- **Resolution:** 3840 x 2160 | **FPS:** 30 | **Codec:** H.264 / H.265 visually lossless

---

## 3. Scene Motion Profiles
### SCENE_01 (Intro)
- **Camera Motion:** `slow_breathe`
- **SDF Atmosphere:** `moonlit_mist` (Particle density: 0.15)
- **Oklab Grading:** `moonlit_confession`
- **EffectCraft CLI Command:**
  ```bash
  effectcraft-cli comp add "Comp_scene_01" --width 3840 --height 2160 --duration 8.0
  effectcraft-cli set "Comp_scene_01" '#1' transform/camera "slow_breathe"
  effectcraft-cli set "Comp_scene_01" '#2' effects/sdf/preset "moonlit_mist"
  effectcraft-cli render --comp "Comp_scene_01" --out "workspace/runs/gwyn_dorado_mv/shards/scene_01/render.mp4" --bitrate 45M
  ```

### SCENE_02 (Verse 1)
- **Camera Motion:** `gentle_drift_right`
- **SDF Atmosphere:** `moonlit_mist` (Particle density: 0.22)
- **Oklab Grading:** `moonlit_confession`
- **EffectCraft CLI Command:**
  ```bash
  effectcraft-cli comp add "Comp_scene_02" --width 3840 --height 2160 --duration 8.0
  effectcraft-cli set "Comp_scene_02" '#1' transform/camera "gentle_drift_right"
  effectcraft-cli set "Comp_scene_02" '#2' effects/sdf/preset "moonlit_mist"
  effectcraft-cli render --comp "Comp_scene_02" --out "workspace/runs/gwyn_dorado_mv/shards/scene_02/render.mp4" --bitrate 45M
  ```

### SCENE_03 (Pre-Chorus)
- **Camera Motion:** `parallax_rise`
- **SDF Atmosphere:** `moonlit_mist` (Particle density: 0.38)
- **Oklab Grading:** `moonlit_confession`
- **EffectCraft CLI Command:**
  ```bash
  effectcraft-cli comp add "Comp_scene_03" --width 3840 --height 2160 --duration 8.0
  effectcraft-cli set "Comp_scene_03" '#1' transform/camera "parallax_rise"
  effectcraft-cli set "Comp_scene_03" '#2' effects/sdf/preset "moonlit_mist"
  effectcraft-cli render --comp "Comp_scene_03" --out "workspace/runs/gwyn_dorado_mv/shards/scene_03/render.mp4" --bitrate 45M
  ```

### SCENE_04 (Chorus 1)
- **Camera Motion:** `orbital_bloom`
- **SDF Atmosphere:** `moonlit_mist` (Particle density: 0.65)
- **Oklab Grading:** `moonlit_confession`
- **EffectCraft CLI Command:**
  ```bash
  effectcraft-cli comp add "Comp_scene_04" --width 3840 --height 2160 --duration 8.0
  effectcraft-cli set "Comp_scene_04" '#1' transform/camera "orbital_bloom"
  effectcraft-cli set "Comp_scene_04" '#2' effects/sdf/preset "moonlit_mist"
  effectcraft-cli render --comp "Comp_scene_04" --out "workspace/runs/gwyn_dorado_mv/shards/scene_04/render.mp4" --bitrate 45M
  ```

### SCENE_05 (Verse 2)
- **Camera Motion:** `slow_breathe`
- **SDF Atmosphere:** `moonlit_mist` (Particle density: 0.3)
- **Oklab Grading:** `moonlit_confession`
- **EffectCraft CLI Command:**
  ```bash
  effectcraft-cli comp add "Comp_scene_05" --width 3840 --height 2160 --duration 8.0
  effectcraft-cli set "Comp_scene_05" '#1' transform/camera "slow_breathe"
  effectcraft-cli set "Comp_scene_05" '#2' effects/sdf/preset "moonlit_mist"
  effectcraft-cli render --comp "Comp_scene_05" --out "workspace/runs/gwyn_dorado_mv/shards/scene_05/render.mp4" --bitrate 45M
  ```

### SCENE_06 (Chorus 2)
- **Camera Motion:** `orbital_bloom`
- **SDF Atmosphere:** `moonlit_mist` (Particle density: 0.76)
- **Oklab Grading:** `moonlit_confession`
- **EffectCraft CLI Command:**
  ```bash
  effectcraft-cli comp add "Comp_scene_06" --width 3840 --height 2160 --duration 8.0
  effectcraft-cli set "Comp_scene_06" '#1' transform/camera "orbital_bloom"
  effectcraft-cli set "Comp_scene_06" '#2' effects/sdf/preset "moonlit_mist"
  effectcraft-cli render --comp "Comp_scene_06" --out "workspace/runs/gwyn_dorado_mv/shards/scene_06/render.mp4" --bitrate 45M
  ```

### SCENE_07 (Bridge)
- **Camera Motion:** `parallax_rise`
- **SDF Atmosphere:** `golden_bloom` (Particle density: 0.92)
- **Oklab Grading:** `stage_conviction_gold`
- **EffectCraft CLI Command:**
  ```bash
  effectcraft-cli comp add "Comp_scene_07" --width 3840 --height 2160 --duration 8.0
  effectcraft-cli set "Comp_scene_07" '#1' transform/camera "parallax_rise"
  effectcraft-cli set "Comp_scene_07" '#2' effects/sdf/preset "golden_bloom"
  effectcraft-cli render --comp "Comp_scene_07" --out "workspace/runs/gwyn_dorado_mv/shards/scene_07/render.mp4" --bitrate 45M
  ```

### SCENE_08 (Outro)
- **Camera Motion:** `fade_still`
- **SDF Atmosphere:** `moonlit_mist` (Particle density: 0.1)
- **Oklab Grading:** `moonlit_confession`
- **EffectCraft CLI Command:**
  ```bash
  effectcraft-cli comp add "Comp_scene_08" --width 3840 --height 2160 --duration 8.0
  effectcraft-cli set "Comp_scene_08" '#1' transform/camera "fade_still"
  effectcraft-cli set "Comp_scene_08" '#2' effects/sdf/preset "moonlit_mist"
  effectcraft-cli render --comp "Comp_scene_08" --out "workspace/runs/gwyn_dorado_mv/shards/scene_08/render.mp4" --bitrate 45M
  ```


---

## 4. Verification Gate
- [ ] All 8 `render.mp4` clips exist and play smoothly at 30fps.
- [ ] Duration of each clip matches exactly `endSec - startSec`.
