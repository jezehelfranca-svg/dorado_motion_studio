# SUBAGENT 07: FIVE-PILLAR QA & MASTER ARTIFACT VERIFIER
**Project:** Gwyn Dorado Music Video Studio — *Losing My Heart* (마음을 놓치다)
**Target Shard Directory:** `workspace/runs/gwyn_dorado_mv/qa/`
**Exclusive Output Files:**
- `workspace/runs/gwyn_dorado_mv/qa/qa_audit_report.json`
- `workspace/runs/gwyn_dorado_mv/qa/qa_audit_report.md`
- `workspace/runs/gwyn_dorado_mv/qa/verification_matrix.csv`

---

## 1. Zero-Friction Isolation Rules
1. **Read-Only Inspection:** Ingests all artifacts from Agents 01 through 06.
2. **Objective Verification:** Tests files against mathematical formulas and rules. Emits the final Go / No-Go verdict.

---

## 2. Five-Pillar Audit Checklist
| Pillar | Requirement | Threshold | Expected Value | Status |
|:---|:---|:---:|:---:|:---:|
| **1. The Confession Check** | Lyric proximity & diary phrasing | Required | 100% lyric coverage | PENDING |
| **2. The Anti-Spectacle Check** | Negative space per scene | >= 30% | Min: 34% | PENDING |
| **2b. Anti-Spectacle (Seq Avg)**| Average negative space across MV | >= 50% | Avg: 62% | PENDING |
| **3. The Human Foundation Check** | Scene 1 conviction level | <= 35% | Intro: 16% | PENDING |
| **3b. Human Foundation (Space)**| Scene 1 opening negative space | >= 65% | Intro: 84% | PENDING |
| **4. The Blooming Arc Check** | Dynamic delta (Peak - Intro) | >= +0.45 | Delta: +0.79 | PENDING |
| **4b. Blooming Arc (Outro)** | Outro closing conviction | <= 35% | Outro: 15% | PENDING |
| **5. The Nuance Check** | Unique motif variety | >= 2 | Motifs: 4 unique | PENDING |

---

## 3. Audio & Video Invariant Checks
- [ ] Audio loudness integrated: **-14.0 LUFS** (±0.5 LUFS)
- [ ] Max true peak: **<= -1.0 dBTP**
- [ ] Video resolution: **3840 x 2160** (4K UHD)
- [ ] Timeline frame continuity: **Zero gaps, zero overlaps** across 64 seconds
- [ ] Zero bitmap assets in SVG files

---

## 4. Final Verdict Emission
Output `qa_audit_report.json` containing composite score (0.0 to 1.0) and final release recommendation:
- `APPROVED_FOR_RELEASE`
- `REVISION_REQUIRED`
- `REJECTED`
