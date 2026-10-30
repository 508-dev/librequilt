# Project charter

Drafted 2026-10-13 by the hub's orchestrating agent from the nomination research, for the
maintainer to edit. The project is in research: nothing here is an approved scope. Sourced
statements carry a link; the fuller evidence register is in [research.md](research.md).

## User and workflow

**User.** A quilter who designs her own quilts. A 2020 industry survey puts North America
at 9 to 11 million quilters and describes the average one as a retired woman in her
sixties who starts eight to ten quilts a year
([Craft Industry Alliance](https://craftindustryalliance.org/quilting-trends-survey-results-2020/)).
The survey was paid for by a company that owns quilting brands. A smaller group designs
patterns to sell or teaches.

**Task.** Draw or choose blocks, lay them out with sashing and borders, try fabrics
against each other, and print a chart that says how much fabric to buy and how to cut it.

**Why it matters.** The long-standing tool, Electric Quilt 8, costs US$239.95 for a
single-user licence with two activations
([vendor](https://electricquilt.com/online-shop/electric-quilt-8/)) and runs only on
Windows and macOS. On Apple-silicon Macs it needs Rosetta
([vendor](https://support.electricquilt.com/articles/what-is-rosetta/)), which Apple
restricts to certain older games from macOS 28
([Apple](https://support.apple.com/en-us/102527)); the vendor says it will have a
solution in place before then
([vendor](https://support.electricquilt.com/articles/macos-28-compatibility-with-eq/)).
The research found no maintained free and open-source quilt-design tool.

**Not yet established.** Whether quilters would move for freedom alone. A free
proprietary browser tool already offers block design, layout, yardage and cutting charts
([NiftyFifty](https://niftyfiftyquilting.com/quilt-design-software/eq8-alternatives)), so
"also free" is not a reason to switch. No quilter has been interviewed.

## Accepted nomination

Hub nomination: <https://github.com/508-dev/genairosity/issues/71>.

The founding maintainer asked for this repository on 2026-10-13, after a reviewed research
summary was posted on that issue. The issue then carried the `nomination:researching`
label; the acceptance comment and label change are the maintainer's to record. This
repository is not yet registered in the hub's `projects.json`.

## Scope and exclusions

**Proposed first workflow**, pending a maintainer scope decision and an approved specification:

1. Draw a block on a grid from squares, triangles and strips, with mirroring and rotation.
2. Start from a small library of traditional blocks, each defined as geometry.
3. Lay blocks out in a quilt: straight or on-point setting, sashing, cornerstones, borders.
4. Colour the pieces with solid colours or with photographs of the quilter's own fabric.
5. Print a yardage estimate and a rotary-cutting chart with seam allowances, as PDF or SVG.
6. Save the design in an open, documented file format.

**Scope decisions** (maintainer, 2026-10-30; see [decisions](decisions.md)):

- About 40 traditional blocks that need only straight seams and no set-in seams, drawn
  from sources published before 1931.
- Foundation paper piecing is not in the first version. The first addition after it is
  printing patterns whose sections and sewing order the quilter marks.

**Exclusions:**

- Opening or writing the incumbent's project files. No public specification was found,
  and a proprietary competitor already opens them.
- Export to computer-guided quilting machines, whose formats are proprietary.
- Manufacturers' fabric images and commercial block encyclopedias. A free project cannot
  ship them; users bring their own fabric photos.
- A pattern marketplace or any hosted service.
- Feature parity with the incumbent.

## Existing FOSS and upstream opportunities

| Project | License | What it does | Fit |
| --- | --- | --- | --- |
| [Seamly2D](https://github.com/FashionFreedom/Seamly2D) | GPL-3.0, active | Garment pattern drafting | A different craft |
| [Ink/Stitch](https://github.com/inkstitch/inkstitch) | GPL-3.0, active | Machine embroidery | A different craft |
| [svg_quilter](https://github.com/neonfuzz/svg_quilter) | MIT, last pushed 2025-07 | Foundation-piecing sheets from a line drawing, on the command line | One function, no design tool |

Searches of GitHub in five languages and of GitLab, Codeberg, SourceForge, F-Droid and
Flathub found no maintained quilt-design tool. GitHub also holds a number of small quilt
projects created in 2026 that nobody has evaluated. An absence claim this broad stays
provisional.

## Platforms, usability, and performance

- **Platform: browser first** (maintainer decision, 2026-10-28; see
  [decisions](decisions.md)). The surveyed audience uses Windows, macOS and, increasingly,
  iPads; a browser reaches all of them and Linux too. A desktop wrapper may come later.
- **Usability.** The incumbent's most repeated complaint is its learning curve. The bar
  is that a quilter can lay out a first quilt and print its cutting chart without a manual.
- **Performance.** No targets yet.
- **Stack.** A web-only application in TypeScript (maintainer decision, 2026-10-30; see
  [decisions](decisions.md)). No server is needed to design a quilt. No AI feature is planned.
- **Data handling.** Designs and fabric photographs stay on the quilter's device.

## Ownership and mission

The maintainer is recorded in genairosity.json. Work is selected by interest,
evidence, and available time; profitability is not required. No warranty is provided.

The first research task, from the nomination research: design one sampler quilt with
sashing, an on-point setting and one foundation-pieced block in the free proprietary
browser tool, and record step by step what works and what does not. That shows what a
free and open tool must do to be worth switching to.
