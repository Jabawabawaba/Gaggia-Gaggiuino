# Contributing

The official Gaggiuino guide is the instructions; this site organizes it and adds tools around it. The most useful contributions are corrections and real-world data from finished builds. Open an issue with:

- **Your machine:** model (Classic, Classic Pro, Eco, Evo Pro or E24), the model number on the rating label, voltage, and any earlier mods.
- **Your install path:** stock wiring integration or custom wiring, and T-fitting or pressure tap block.
- **Lengths you actually used**, by the wire or run ID on the wiring and cut list pages.
- **Screen mount and cable length.**
- **Corrections.** If a step, a check or a price is wrong, say which page and which item, and what the official docs or your machine show instead.

When the official guide changes, the links and summaries here should follow it. If you spot a step that has drifted from the guide, an issue pointing at both is the most helpful report there is.

To change a page:

- Every page is built from `build/`. The runbook steps are in `runbook-phases.js`, the links into the official guide in `official-links.js`, the power-on checks, cut list, troubleshooting, which Gaggia and the home page are templates there, and the budget, used checklist and parts tracker pages are in `build/pages/`. Edit the source, run `python3 site.py` in `build/`, and send the source change with the rebuilt pages.
- Don't edit the built `.html` files at the repo root by hand; the next build overwrites them.
- Keep the mains-voltage warnings and the "unofficial" labeling. Don't copy text, photos or schematics from the official docs; summarize and link instead.

Everything contributed is published under CC BY-NC-SA 4.0 with credit to you by whatever name you give.
