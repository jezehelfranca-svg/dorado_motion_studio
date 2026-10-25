# SUBAGENT 06: FILMCRAFT NLE TIMELINE MASTER ASSEMBLER
**Project:** Gwyn Dorado Music Video Studio — *Losing My Heart* (마음을 놓치다)
**Target Shard Directories:** `workspace/runs/gwyn_dorado_mv/assembly/` and `workspace/runs/gwyn_dorado_mv/renders/`
**Exclusive Output Files:**
- `workspace/runs/gwyn_dorado_mv/assembly/MV_gwyn_dorado_mv.fcproj`
- `workspace/runs/gwyn_dorado_mv/assembly/filmcraft_timeline.jsonl`
- `workspace/runs/gwyn_dorado_mv/assembly/assemble_master.sh`
- `workspace/runs/gwyn_dorado_mv/renders/master_gwyn_dorado_mv_prores422hq.mov`
- `workspace/runs/gwyn_dorado_mv/renders/master_gwyn_dorado_mv_4k60.mp4`

---

## 1. Zero-Friction Isolation Rules
1. **Downstream Master Assembly:** Ingests rendered video shards from Agent 04 and master normalized audio from Agent 01.
2. **Timeline Integrity:** Assembles all 8 clips contiguously along the exact beat and frame grid with ZERO gaps.

---

## 2. NLE Track Layout
- **Track V1 (Video Shards):** `scene_01/render.mp4` through `scene_08/render.mp4`
- **Track V2 (Typography Overlay):** `scene_01/lyrics.svg` through `scene_08/lyrics.svg`
- **Track A1 (Audio Master):** `workspace/runs/gwyn_dorado_mv/audio/master_normalized_-14LUFS.wav`

---

## 3. FilmCraft CLI Assembly Commands
```bash
#!/usr/bin/env bash
set -euo pipefail

# 1. Create Project
filmcraft-cli project new "MV_gwyn_dorado_mv" --width 3840 --height 2160 --fps 30 --colorspace "ACEScg"

# 2. Place Audio Master
filmcraft-cli timeline place --track A1 --asset "workspace/runs/gwyn_dorado_mv/audio/master_normalized_-14LUFS.wav" --start 0.0 --duration 64

# 3. Place Visual Shards
filmcraft-cli timeline place --track V1 --asset "workspace/runs/gwyn_dorado_mv/shards/scene_01/render.mp4" --start 0 --duration 8.0
filmcraft-cli effects set-param --track V1 --clip 0 --effect lumetri --param exposure 0.14
filmcraft-cli effects set-param --track V1 --clip 0 --effect lumetri --param contrast 1.09
filmcraft-cli effects set-param --track V1 --clip 0 --effect lumetri --param vignette 0.46

filmcraft-cli timeline place --track V1 --asset "workspace/runs/gwyn_dorado_mv/shards/scene_02/render.mp4" --start 8 --duration 8.0
filmcraft-cli effects set-param --track V1 --clip 1 --effect lumetri --param exposure 0.16
filmcraft-cli effects set-param --track V1 --clip 1 --effect lumetri --param contrast 1.10
filmcraft-cli effects set-param --track V1 --clip 1 --effect lumetri --param vignette 0.43

filmcraft-cli timeline place --track V1 --asset "workspace/runs/gwyn_dorado_mv/shards/scene_03/render.mp4" --start 16 --duration 8.0
filmcraft-cli effects set-param --track V1 --clip 2 --effect lumetri --param exposure 0.22
filmcraft-cli effects set-param --track V1 --clip 2 --effect lumetri --param contrast 1.16
filmcraft-cli effects set-param --track V1 --clip 2 --effect lumetri --param vignette 0.34

filmcraft-cli timeline place --track V1 --asset "workspace/runs/gwyn_dorado_mv/shards/scene_04/render.mp4" --start 24 --duration 8.0
filmcraft-cli effects set-param --track V1 --clip 3 --effect lumetri --param exposure 0.29
filmcraft-cli effects set-param --track V1 --clip 3 --effect lumetri --param contrast 1.22
filmcraft-cli effects set-param --track V1 --clip 3 --effect lumetri --param vignette 0.24

filmcraft-cli timeline place --track V1 --asset "workspace/runs/gwyn_dorado_mv/shards/scene_05/render.mp4" --start 32 --duration 8.0
filmcraft-cli effects set-param --track V1 --clip 4 --effect lumetri --param exposure 0.20
filmcraft-cli effects set-param --track V1 --clip 4 --effect lumetri --param contrast 1.14
filmcraft-cli effects set-param --track V1 --clip 4 --effect lumetri --param vignette 0.39

filmcraft-cli timeline place --track V1 --asset "workspace/runs/gwyn_dorado_mv/shards/scene_06/render.mp4" --start 40 --duration 8.0
filmcraft-cli effects set-param --track V1 --clip 5 --effect lumetri --param exposure 0.31
filmcraft-cli effects set-param --track V1 --clip 5 --effect lumetri --param contrast 1.23
filmcraft-cli effects set-param --track V1 --clip 5 --effect lumetri --param vignette 0.21

filmcraft-cli timeline place --track V1 --asset "workspace/runs/gwyn_dorado_mv/shards/scene_07/render.mp4" --start 48 --duration 8.0
filmcraft-cli effects set-param --track V1 --clip 6 --effect lumetri --param exposure 0.34
filmcraft-cli effects set-param --track V1 --clip 6 --effect lumetri --param contrast 1.26
filmcraft-cli effects set-param --track V1 --clip 6 --effect lumetri --param vignette 0.19

filmcraft-cli timeline place --track V1 --asset "workspace/runs/gwyn_dorado_mv/shards/scene_08/render.mp4" --start 56 --duration 8.0
filmcraft-cli effects set-param --track V1 --clip 7 --effect lumetri --param exposure 0.14
filmcraft-cli effects set-param --track V1 --clip 7 --effect lumetri --param contrast 1.08
filmcraft-cli effects set-param --track V1 --clip 7 --effect lumetri --param vignette 0.47


# 4. Render Final Master 4K
filmcraft-cli export --project "workspace/runs/gwyn_dorado_mv/assembly/MV_gwyn_dorado_mv.fcproj" --preset "ProRes422HQ" --out "workspace/runs/gwyn_dorado_mv/renders/master_gwyn_dorado_mv_prores422hq.mov"
filmcraft-cli export --project "workspace/runs/gwyn_dorado_mv/assembly/MV_gwyn_dorado_mv.fcproj" --preset "H265_Broadcast" --bitrate 45M --out "workspace/runs/gwyn_dorado_mv/renders/master_gwyn_dorado_mv_4k60.mp4"
```

---

## 4. Verification Gate
- [ ] Master video is exactly 64 seconds long.
- [ ] Audio and video are perfectly in sync with zero drift.
