# SUBAGENT 02: CREATIVE DIRECTOR & SEQUENCE BIBLE ORCHESTRATOR
**Project:** Gwyn Dorado Music Video Studio — *Losing My Heart* (마음을 놓치다)
**Target Shard Directory:** `workspace/runs/gwyn_dorado_mv/`
**Exclusive Output Files:**
- `workspace/runs/gwyn_dorado_mv/song_director_bible.json`
- `workspace/runs/gwyn_dorado_mv/blooming_arc_audit.json`
- `workspace/runs/gwyn_dorado_mv/scene_breakdown.csv`

---

## 1. Zero-Friction Isolation Rules
1. **Directory Quarantine:** You have **EXCLUSIVE WRITE PERMISSION** for the master metadata files in `workspace/runs/gwyn_dorado_mv/`.
2. **Immutable Downstream Contract:** Once `song_director_bible.json` is emitted, it serves as the immutable read-only contract for all parallel shard workers (Agents 03, 04, 05, 06).

---

## 2. Sequence Breakdown & Timeline
| Scene ID | Section | Time Window | Conviction | Negative Space | SVG Motif | Camera Motion |
|:---|:---|:---|:---:|:---:|:---|:---|
| `scene_01` | **Intro** | 0s – 8s | 16% | 84% | `ink_confession` | `slow_breathe` |
| `scene_02` | **Verse 1** | 8s – 16s | 24% | 78% | `window_rain` | `gentle_drift_right` |
| `scene_03` | **Pre-Chorus** | 16s – 24s | 48% | 62% | `acoustic_strings` | `parallax_rise` |
| `scene_04` | **Chorus 1** | 24s – 32s | 76% | 44% | `celestial_bloom` | `orbital_bloom` |
| `scene_05` | **Verse 2** | 32s – 40s | 40% | 70% | `ink_confession` | `slow_breathe` |
| `scene_06` | **Chorus 2** | 40s – 48s | 84% | 38% | `window_rain` | `orbital_bloom` |
| `scene_07` | **Bridge** | 48s – 56s | 95% | 34% | `celestial_bloom` | `parallax_rise` |
| `scene_08` | **Outro** | 56s – 64s | 15% | 86% | `ink_confession` | `fade_still` |

---

## 3. The 5 Gwyn Dorado Pillars (Formal Criteria)
1. **The Confession Check:** Every scene rationale must tie directly to interior psychological states, avoiding generic spectacle.
2. **The Anti-Spectacle Check:**
   - Every single scene MUST maintain at least **30% negative space**.
   - Sequence-wide average negative space MUST be **>= 50%** (Current plan: ~62%).
3. **The Human Foundation Check:** Scene 01 opening conviction MUST be **<= 35%** (Current: 16%) with negative space **>= 65%**.
4. **The Blooming Arc Check:**
   - Dynamic Delta = `Peak Conviction (Bridge) - Scene 01 Conviction` MUST be **>= +0.45** (Current: +0.79).
   - Outro scene conviction MUST drop back to **<= 35%** (Current: 15%).
5. **The Nuance Check:** Every scene must have a unique epistemic rationale.

---

## 4. Execution Step-by-Step Instructions
1. Audit and write `song_director_bible.json` conforming to the schema.
2. Generate `blooming_arc_audit.json` recording the math verification for each of the 5 pillars.
3. Export `scene_breakdown.csv` for downstream visual verification.
