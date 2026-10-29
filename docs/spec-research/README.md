# Specification research, 2026-10-28

Five research tracks run in preparation for the functional specification. Each was a separate,
locally initiated agent working from the shared brief in [RULES.md](RULES.md) and its own list of
questions below. Every agent wrote a findings report, with an evidence register, and a claims file
quoting the exact sentence behind each load-bearing claim.

The consolidated summary, the orchestrator's corrections, the candidate requirements and the open
decisions are in [research.md](../research.md#specification-research-2026-10-28). Read that first;
these reports are the evidence behind it.

## Process

1. The orchestrating session wrote the shared brief and launched one agent per track through Paseo,
   using lower-cost models: DeepSeek V4 Pro for tracks A to D and GPT-6-Sol (Codex) for track E.
   Two first attempts failed and were relaunched on DeepSeek: Kimi K3 for track B hit a usage limit,
   and GLM 5.3 for track C had no account funds.
2. Agents could read public web pages and use read-only GitHub queries. They wrote only to a
   git-ignored scratch folder. They were told to cite only pages they opened, to describe
   proprietary products functionally in their own words, and to give no legal conclusions.
3. [check-track.py](check-track.py) probed every link, looked up every cited GitHub repository's
   licence and last push, and checked that each claim's quoted sentence appears on the cited page.
   Usage: `python3 docs/spec-research/check-track.py A-math B-blocks C-users D-geometry E-platform`.
   A quote that is not found is a lead, not proof of a problem: some sites refuse automated requests.
4. The orchestrator read each report's summary, proposals and open decisions; re-derived the
   formulas the proposals depend on; and recorded corrections in a note at the top of each report
   and in research.md.

## Tracks and their questions

| Track | Files | Questions |
| --- | --- | --- |
| A, quilting arithmetic | [findings](A-math-findings.md), [claims](A-math-claims.md), [examples](A-math-examples.py) | Units and rounding, including metric; cut sizes for squares, rectangles, half- and quarter-square triangles, flying geese, corners and strip sets; layout arithmetic and on-point setting triangles; yardage, backing, batting and binding; how patterns present cutting charts; whether cutting is a known optimisation problem, and any FOSS calculators; ten worked examples |
| B, traditional blocks | [findings](B-blocks-findings.md), [claims](B-blocks-claims.md) | Block families and the shapes they need; public-domain catalogues and their copyright status; the copyright, compilation and trademark questions; openly licensed block data; 40 to 60 candidate blocks with a public-domain source for each |
| C, users and usability | [findings](C-users-findings.md), [claims](C-users-claims.md) | The design workflow as quilters describe it; what existing tools offer, described functionally; complaints and wishes; devices; accessibility for older adults; international and metric users; a small usability-test protocol |
| D, layouts, paper piecing, printing | [findings](D-geometry-findings.md), [claims](D-geometry-claims.md) | Layout types; foundation paper piecing, its literature and FOSS, and the effort of manual versus automatic splitting; scaling fabric photos; printing at true scale; a data model in prose |
| E, platform, stack, file format | [findings](E-platform-findings.md), [claims](E-platform-claims.md) | Browsers on iPad, Mac, Windows and Chromebook; Rust browser frameworks; a later desktop wrapper; Rust libraries; a TypeScript baseline; an open file format; static hosting and privacy |
