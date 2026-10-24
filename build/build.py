"""Generate the install pages that also work as standalone claude.ai artifacts.

  python3 build.py [labels checks runbook]   -> artifact versions next to build/
  (site.py calls render(name, "site") for the GitHub Pages versions)

wiring-data.json (built by research/tools/gg_wiring.py from the official schematics) is the single source of
truth for wires; the wiring, cut list and labels pages read it through wiring-core.js. Its add-ons (the Shelly) are
change lists that addons.py turns into whole schematics.
"""
import json, os, sys
sys.path.insert(0, os.path.dirname(__file__))

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.dirname(HERE)
LINKS_FILE = os.path.join(HERE, "links.json")
ART = json.load(open(LINKS_FILE)) if os.path.exists(LINKS_FILE) else {}
SITE = {"WIRING": "wiring.html", "LABELS": "wire-labels.html", "CHECKS": "power-on-checks.html",
        "RUNBOOK": "runbook.html", "CUTLIST": "cut-list.html", "TROUBLE": "troubleshooting.html",
        "WHICH": "which-gaggia.html", "TRACKER": "parts-tracker.html", "MODELS": "model-notes.html",
        "BUDGET": "budget.html", "USED": "used-checklist.html", "HOME": "index.html"}
ART_EXTRA = {}
FILES = {"labels": ("labels.tpl.html", "gaggia-wire-labels.html"),
         "checks": ("checks.tpl.html", "gaggia-power-on-checks.html"),
         "runbook": ("runbook.tpl.html", "gaggia-install-runbook.html")}


def _includes(s, depth=0):
    """%%INCLUDE:file%% pulls in a file from build/ (shared scripts such as official-links.js)."""
    import re
    if depth >= 5:
        return s
    return re.sub(r"%%INCLUDE:([A-Za-z0-9_.-]+)%%", lambda m: _includes(open(os.path.join(HERE, m.group(1))).read(), depth + 1), s)


def render(name, mode="artifact"):
    tpl, _ = FILES[name]
    s = _includes(open(os.path.join(HERE, tpl)).read())
    links = SITE if mode == "site" else dict(ART_EXTRA, **ART)
    for k in SITE:
        s = s.replace("%%LINK_" + k + "%%", links.get(k, "#"))
    s = s.replace("%%MODE%%", mode)
    if "%%WIRING_DATA%%" in s:
        import addons
        data = addons.expand(json.load(open(os.path.join(HERE, "wiring-data.json"))))
        s = s.replace("%%WIRING_DATA%%", json.dumps(data, ensure_ascii=False, separators=(",", ":")))
    if "%%WIRING_MAPS%%" in s:
        s = s.replace("%%WIRING_MAPS%%", open(os.path.join(HERE, "wiring-maps.json")).read())
    return s


if __name__ == "__main__":
    targets = [a for a in sys.argv[1:] if a in FILES] or list(FILES)
    for t in targets:
        open(os.path.join(OUT, FILES[t][1]), "w").write(render(t, "artifact"))
    print("built", targets)
