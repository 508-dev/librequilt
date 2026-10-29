# Observation protocol: a sampler quilt in NiftyFifty

Written 2026-10-28 for a human tester. It carries out the charter's first research task: design one
sampler quilt with sashing, an on-point setting and one foundation-pieced block in the free
proprietary browser tool, and record step by step what works and what does not. The result shows
what a free and open tool must do to be worth switching to.

Plan on about three hours, in up to three sittings. Quilting experience helps but is not required;
a tester who has never used design software is just as useful, and should say so.

## Rules before you start

This is lawful observation under the hub's
[clean-room policy](https://github.com/508-dev/genairosity/blob/main/docs/clean-room.md).

1. **Read NiftyFifty's terms of use and privacy policy first.** Record the URLs, the date, whether an
   account is needed, and anything about permitted use, benchmarking, reverse engineering, or who
   owns your designs and exports. If the terms forbid this kind of evaluation, stop and tell the
   maintainer.
2. **Use the tool normally.** No developer tools, page source, network inspection, or looking inside
   exported project files.
3. **Describe what happens in your own words.** Write about functions ("I could rotate a block but not
   mirror it"), not the look. Do not copy the tool's wording, layout, icons or help text into the
   report. Block names, fabric measurements and numbers are facts and may be recorded.
4. **Keep raw evidence private.** Screenshots, exported PDFs and project files go in the git-ignored
   folder `.context/observations/niftyfifty-<date>/`. Do not commit them, attach them to issues, or
   give them to an AI model. They exist so the maintainer can check the report.
5. Use only your own fabric photo and the design below. The report is research input; it is not
   given to whoever later writes the code.

## What you need

- A computer with a current browser, and a printer with Letter or A4 paper.
- A quilting ruler or other ruler marked in 1/16 inch or millimetres.
- A photo of a printed fabric you own, taken flat in daylight with a ruler visible in the frame.
- A timer, and the report template at the end of this file.
- Optional: an iPad, for part D.

## The design

| Item | Specification |
| --- | --- |
| Layout | 2 blocks across, 3 down, straight set; every block 12 in finished |
| Blocks | Nine Patch, Churn Dash, Ohio Star, Sawtooth Star (from the library); Friendship Star (drawn by you); one foundation-pieced block (part C) |
| Sashing | 2 in finished, between and around all blocks, with 2 in cornerstones |
| Border | One 4 in border |
| Fabrics | Background: cream solid. Red, blue and gold solids. Your fabric photo. |
| Fabric use | Blocks: background plus any solids. Sashing blue, cornerstones red, border your photo fabric, binding gold. |

## Tasks

For every task record the result (done alone, done after looking for help, partly, could not), the
minutes taken, how many wrong turns, what help you used (none, the tool's help, a web search, a
video), and any problem with its severity (blocker, major, minor).

### Part 0: setup (10 minutes)

- **0.1** Terms of use, as in rule 1.
- **0.2** Record device, operating system, browser and version, printer, and paper size.
- **0.3** Record whether you had to make an account and what personal details it asked for.

### Part A: straight-set sampler (about 90 minutes)

- **A1** Start a new quilt with the layout above.
- **A2** Place the four library blocks. If one is missing or named differently, record the name the tool uses.
- **A3** Draw Friendship Star yourself, not from the library: a 3 by 3 grid with plain corner squares,
  a plain centre square, and four half-square triangles around the centre with their points turning
  in one direction, like a pinwheel. Record how drawing works: grid, snapping, triangle tools, rotate
  and mirror, undo, and what went wrong.
- **A4** Leave the sixth slot empty, or put any block there, until part C.
- **A5** Add the sashing, cornerstones and border.
- **A6** Colour the quilt with the fabrics above. Record whether solids come from named fabric lines or
  any colour; how the photo is imported; whether the tool asks for the fabric's real size or repeat;
  and whether the print looks the right scale in the quilt.
- **A7** Note the finished size the tool reports.
- **A8** Get the yardage estimate. Record each fabric's figure, the usable fabric width the tool assumes
  and whether you can change it, and whether binding and backing are included.
- **A9** Get the rotary-cutting chart. Copy the counts and sizes for the pieces in the reference table
  below. If the tool uses a different method, such as cutting oversized and trimming, record the method.
- **A10** Print the cutting chart and one block template at 100 percent or actual size. Measure a known
  length with your ruler, record expected and measured, and record the print settings it took.
- **A11** Save, close the tab, and reopen. Does the design come back? Which export formats are offered
  (PDF, image, project file)? Can you import your own export back in?

### Part B: on-point setting (about 30 minutes)

- **B1** Copy the quilt and change it to an on-point setting, 2 blocks across and 3 down, without sashing.
- **B2** Record how the tool fills the gaps between blocks and the setting-triangle cut sizes it gives.
  Cutting setting triangles slightly large so the blocks float is a valid choice; record it if so.
- **B3** Try adding sashing to the on-point layout. Record what happens.

### Part C: one foundation-pieced block (about 45 minutes)

- **C1** Make one 12 in foundation-pieced block, preferably your own simple design with angled lines,
  such as a star with sharp points. If you cannot draw one, use a supplied one and say so.
- **C2** Record how the block is split into sections, who decides the sewing order (you or the tool),
  and whether the tool warns you when a design cannot be sewn.
- **C3** Print the pattern at actual size. Check: is it a mirror image of the finished block? Are
  sections lettered and pieces numbered? Is there a seam-allowance line? Is there a test square,
  and what does it measure?
- **C4** Optional and valuable: sew the block from your printout and record any mistakes in the pattern.
- **C5** Put the block in the sixth slot of the part A quilt. Do the yardage and cutting chart include
  it, and how?

### Part D: iPad (optional, about 30 minutes)

The project will be a browser app, so iPad behaviour matters. In Safari on an iPad, open your saved
design if you can, then repeat A3 (draw by touch), A8 and A10 (print from the iPad). Record the
differences.

### Part E: overall

In your own words: the five things that worked best, the five biggest frustrations, what you needed
help with, whether you would use this instead of graph paper or another program, and what a free,
open tool would have to do better before you would switch.

## Reference numbers

Worked out by hand and checked with a script, for comparison with what the tool says. Inches;
1/4 inch seam allowance. Yardage is left out on purpose because it depends on the fabric width a tool
assumes; record the tool's figure and its assumption instead.

| Item | Expected |
| --- | --- |
| Quilt top inside the border | 30 x 44 in |
| Finished quilt | 38 x 52 in |
| Sashing | 17 rectangles, cut 2 1/2 x 12 1/2 in |
| Cornerstones | 12 squares, cut 2 1/2 in |
| Border, butted corners, sides first | 2 strips 4 1/2 x 44 1/2 in, then 2 strips 4 1/2 x 38 1/2 in. 44 1/2 in is longer than a 42 in fabric width, so the tool must join strips or cut along the length; record which. |
| Binding, 2 1/2 in strips | Perimeter 180 in, so 5 strips across the fabric width |
| Nine Patch | 9 squares, cut 4 1/2 in |
| Churn Dash | Half-square triangles from 4 7/8 in squares (2 per colour); 8 rectangles 2 1/2 x 4 1/2 in; centre 4 1/2 in |
| Ohio Star | Quarter-square triangles from 5 1/4 in squares cut twice diagonally; 4 corners and 1 centre, 4 1/2 in |
| Sawtooth Star | Centre 6 1/2 in; 4 flying-geese rectangles 6 1/2 x 3 1/2 in with 8 corner squares 3 1/2 in; 4 corners 3 1/2 in |
| Friendship Star | Half-square triangles from 4 7/8 in squares (2 per colour); 4 corners and 1 centre, 4 1/2 in |
| On point, 2 across by 3 down | 8 block positions (6 blocks plus 2 plain alternates), 6 side and 4 corner setting triangles |
| On-point size | About 33 15/16 x 50 15/16 in before the border; block diagonal 16.97 in |
| Side setting triangles | 2 squares cut 18 1/4 in, each cut twice diagonally (8 triangles, 6 used) |
| Corner setting triangles | 2 squares cut 9 3/8 in, each cut once diagonally (4 triangles) |

## What to hand back

1. **The report**, filled in from the template below, saved as
   `docs/observations/niftyfifty-sampler-<YYYY-MM-DD>.md` and submitted in a pull request. Own words,
   numbers and measurements; no screenshots and no copied text.
2. **Private evidence** in `.context/observations/niftyfifty-<YYYY-MM-DD>/`, never committed. List the
   file names in the report so the maintainer can ask to see them.

The maintainer then adds the report to the evidence register in [research](../research.md).

## Report template

```markdown
# NiftyFifty sampler observation, <YYYY-MM-DD>

Tester: <name or handle>. Quilting experience: <years; design tools used before>.
Tool: NiftyFifty, <URL of each part used>, used on <dates>.
Device, operating system, browser and version: <...>
Printer and paper: <...>
Terms read: <URLs>, on <date>. Account needed: <yes/no; details asked>. Relevant terms, in my words: <...>

## Task log

| Task | Result | Minutes | Wrong turns | Help used | Problem and severity | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| 0.1 | | | | | | |
| A1 | | | | | | |
| ... through E | | | | | | |

## Numbers

| Item | Reference | Tool's figure | Method or assumption if different |
| --- | --- | --- | --- |
| Finished size | 38 x 52 in | | |
| Sashing | 17 at 2 1/2 x 12 1/2 in | | |
| ... every row of the reference table | | | |

| Fabric | Used for | Tool's yardage | Fabric width assumed | Notes |
| --- | --- | --- | --- | --- |

| What I measured on paper | Expected | Measured | Print settings needed |
| --- | --- | --- | --- |

## Fabric photo

## Foundation paper piecing

## Saving, files and export

## iPad (if done)

## Overall
Worked best:
Biggest frustrations:
Needed help with:
Would I switch, and what a free, open tool must do better:

## Private evidence kept
<file names in .context/observations/...>
```
