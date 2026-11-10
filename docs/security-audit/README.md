# Security Audit — run 1 (2026-11-10)

Source-only security audit of commit `0cddb71` run with the
[Cloudflare security-audit-skill](https://github.com/cloudflare/security-audit-skill) methodology
(quick profile: reconnaissance → coverage ledger → hunting wave → independent verification →
validated findings → report).

| File | Contents |
| --- | --- |
| [REPORT.md](./REPORT.md) | Executive report: posture summary, leads table, hardening notes, coverage summary |
| [NEEDS-VALIDATION.md](./NEEDS-VALIDATION.md) | The 6 prioritized leads with traces, blockers and validation plans |
| [FINDINGS-DETAIL.md](./FINDINGS-DETAIL.md) | Confirmed-findings detail (empty — 0 confirmed; all leads pending validation) |
| findings.json | Machine-readable records (schema-validated by the skill's validator) |
| coverage-ledger.json | Deterministic coverage claim: 19 units (10 covered, 6 candidates, 1 deferred, 2 out-of-scope) |
| architecture.md | Trust boundaries, entry surfaces, control map |
| run-metadata.json | Run provenance (profile, source ref, execution policy, disclosed deviations) |

**Outcome:** 0 confirmed findings; core trust boundaries verified sound (auth on every Convex
function, owner-scoped rows, server-side price recomputation, PSP verification, idempotent orders).
6 deployment-observable leads recorded — 3 already fixed in source (commit `96464c5`: SDK env mode,
frame-ancestors headers, email validation); the remaining 3 are production steps listed in
[SETUP.md](../../SETUP.md) §Going live and NEEDS-VALIDATION.md.

This copy is frozen at the audited commit; the live working copy (for future re-runs) lives in
`~/security-audit-skill/lips-brand/`.
