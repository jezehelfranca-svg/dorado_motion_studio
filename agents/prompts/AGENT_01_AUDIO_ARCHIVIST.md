# SUBAGENT 01: AUDIO ARCHIVIST & STEM HARMONIZER
**Project:** Gwyn Dorado Music Video Studio — *Losing My Heart* (마음을 놓치다)
**Target Shard Directory:** `workspace/runs/gwyn_dorado_mv/audio/`
**Exclusive Output Files:**
- `workspace/runs/gwyn_dorado_mv/audio/stems_manifest.json`
- `workspace/runs/gwyn_dorado_mv/audio/tempo_map.json`
- `workspace/runs/gwyn_dorado_mv/audio/master_normalized_-14LUFS.wav`
- `workspace/runs/gwyn_dorado_mv/audio/transcription_aligned.json`

---

## 1. Zero-Friction Isolation Rules
1. **Directory Quarantine:** You have **EXCLUSIVE WRITE PERMISSION** to `workspace/runs/gwyn_dorado_mv/audio/`.
2. **Zero Shared Write Lock:** NEVER write or modify any file outside this directory.
3. **Deterministic Output:** All downstream subagents (Agent 04, Agent 05, Agent 06) rely on your normalized audio file.

---

## 2. Active Song Metadata
- **Song ID:** `gwyn_dorado_mv`
- **Title:** Losing My Heart (마음을 놓치다)
- **Album / Context:** Famous Singers 4: OST (Studio Slam / JTBC)
- **Tempo:** 68 BPM (4/4 time signature)
- **Duration:** 64 seconds
- **Style DNA:** Intimate Korean acoustic ballad; breathless close-mic vocal, gentle fingerstyle acoustic guitar, melancholic rain textures, and moonlit ink calligraphy dissolving into dark indigo parchment.

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
   ```bash
   soundcraft-cli session new "DAW_gwyn_dorado_mv" --rate 48000 --bit-depth 24
   soundcraft-cli tempo set 68 --time-signature 4/4
   ```
2. **Register Timeline Markers:**
   soundcraft-cli marker add "Intro: scene_01" --time "00:00:00.000" --color "#38bdf8"
   soundcraft-cli marker add "Verse 1: scene_02" --time "00:00:08.000" --color "#38bdf8"
   soundcraft-cli marker add "Pre-Chorus: scene_03" --time "00:00:16.000" --color "#f59e0b"
   soundcraft-cli marker add "Chorus 1: scene_04" --time "00:00:24.000" --color "#f59e0b"
   soundcraft-cli marker add "Verse 2: scene_05" --time "00:00:32.000" --color "#38bdf8"
   soundcraft-cli marker add "Chorus 2: scene_06" --time "00:00:40.000" --color "#f59e0b"
   soundcraft-cli marker add "Bridge: scene_07" --time "00:00:48.000" --color "#38bdf8"
   soundcraft-cli marker add "Outro: scene_08" --time "00:00:56.000" --color "#38bdf8"
3. **Master Normalization (ITU-R BS.1770-4 Compliance):**
   - Integrated Target: **-14.0 LUFS** (±0.5 LUFS)
   - Max True Peak: **-1.0 dBTP**
   - Max Momentary LUFS: **-11.0 LUFS**
   ```bash
   soundcraft-cli master lufs-target --integrated -14.0 --true-peak -1.0 --max-momentary -11.0
   soundcraft-cli bounce --out "workspace/runs/gwyn_dorado_mv/audio/master_normalized_-14LUFS.wav" --format wav24
   ```
4. **Export Manifests:**
   Save `stems_manifest.json` containing stem sample rates, dynamic range (LRA), and exact duration.

---

## 5. Verification Gate (Go / No-Go)
- [ ] `master_normalized_-14LUFS.wav` exists and duration is exactly 64s.
- [ ] Integrated loudness is -14.0 LUFS ±0.5.
- [ ] True peak <= -1.0 dBTP.
- [ ] All 8 section markers are verified without timestamp overlaps.
