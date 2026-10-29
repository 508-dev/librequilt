#!/usr/bin/env python3
"""Mechanical review of spec-research outputs. Usage: check-track.py A-math B-blocks ...

For each track: file sizes, links that do not resolve, GitHub repositories that do not exist
(with their real licence, stars, last push), and claims whose quoted sentence is not found on the
cited page. A quote miss is a lead to check by hand, not proof of fabrication: pages change and
some sites refuse automated requests. Adapted from the hub's research kit.
"""
import html, re, subprocess, sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

HERE = Path(__file__).resolve().parent
URL = re.compile(r"https?://[^\s)>\]|\"'`]+")
UA = "Mozilla/5.0 (X11; Linux x86_64) librequilt-research-check"


def fetch(url):
    r = subprocess.run(["curl", "-s", "-L", "--max-time", "20", "-A", UA, "-w", "\n%{http_code}", url],
                       capture_output=True, text=True, errors="replace")
    body, _, code = r.stdout.rpartition("\n")
    return code.strip() or "000", body


def probe(url):
    url = url.rstrip(".,;:*")
    m = re.match(r"https://github\.com/([\w.-]+)/([\w.-]+)/?$", url)
    if m:
        r = subprocess.run(["gh", "api", f"repos/{m.group(1)}/{m.group(2)}", "--jq",
                            '[(.license.spdx_id // "none"), (.stargazers_count|tostring), .pushed_at[0:10], (.archived|tostring)] | @tsv'],
                           capture_output=True, text=True)
        return url, ("repo " + r.stdout.strip().replace("\t", " | ") if r.returncode == 0 else "REPO NOT FOUND")
    return url, fetch(url)[0]


def norm(s):
    s = html.unescape(re.sub(r"<[^>]+>", " ", s))
    s = s.replace("″", '"').replace("’", "'").replace("‘", "'").replace("“", '"').replace("”", '"')
    return re.sub(r"\s+", " ", s).lower()


def check_quotes(claims_text):
    """Pair each quoted sentence with the nearest preceding URL and look for it on that page."""
    out, url = [], None
    for line in claims_text.splitlines():
        urls = URL.findall(line)
        if urls:
            url = urls[-1].rstrip(".,;:*")
        for q in re.findall(r'[“"]([^”"]{25,})[”"]', line):
            if not url:
                continue
            code, body = fetch(url)
            frag = norm(q)[:60]
            out.append(("found" if frag in norm(body) else f"MISS ({code})", url, q[:90]))
    return out


def main(track):
    findings, claims = HERE / f"{track}-findings.md", HERE / f"{track}-claims.md"
    print(f"===== {track}")
    for f in (findings, claims):
        print(f"  {f.name}: {'%d words' % len(f.read_text(encoding='utf-8').split()) if f.exists() else 'MISSING'}")
    if not findings.exists():
        return
    text = findings.read_text(encoding="utf-8") + (claims.read_text(encoding="utf-8") if claims.exists() else "")
    urls = sorted({u.rstrip(".,;:*") for u in URL.findall(text)})
    with ThreadPoolExecutor(10) as ex:
        results = list(ex.map(probe, urls))
    bad = [(u, s) for u, s in results if s in ("000", "404", "410", "REPO NOT FOUND")]
    print(f"  links probed: {len(results)}; failing: {len(bad)}  (000 and 403 can mean a site refuses bots)")
    for u, s in bad:
        print(f"    {s}  {u}")
    for u, s in results:
        if s.startswith("repo "):
            print(f"    {u.replace('https://github.com/', '')}: licence | stars | last push | archived = {s[5:]}")
    if claims.exists():
        qs = check_quotes(claims.read_text(encoding="utf-8"))
        print(f"  claim quotes: {sum(r[0] == 'found' for r in qs)}/{len(qs)} found verbatim on the cited page")
        for status, u, q in qs:
            if status != "found":
                print(f"    {status}  {u}\n        \"{q}\"")


if __name__ == "__main__":
    for t in sys.argv[1:]:
        main(t)
