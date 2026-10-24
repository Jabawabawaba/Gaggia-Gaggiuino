# Gaggia Gaggiuino Toolkit

Unofficial tools for fitting [Gaggiuino](https://gaggiuino.github.io/) (Gen 3, PCB v4) to the **Gaggia Classic family**: the original Classic, the Classic Pro, the Eco-board Pro, the Evo Pro and the E24. The 2015 Classic (V2) has no 3-way valve and isn't supported.

Gaggiuino was built for the Gaggia Classic, and its official guide covers the install step by step. This site doesn't replace that guide. It keeps your place in it, shows which steps and mods your model needs, and adds the planning, checking and troubleshooting tools around it.

**Site:** https://jabawabawaba.github.io/Gaggia-Gaggiuino/ (GitHub Pages, served from this repo's root)

## What's here

| Page | For | What it does |
|---|---|---|
| `index.html` | Everyone | The tools in build order, what changes for your model, getting help, known gaps, sources |
| `conversion.html` | Everyone | A scroll-driven animation of the whole conversion on a Classic Pro, from the stock machine to a profiled shot, each step linked to its page |
| `how-gaggia-works.html` | Learning | The stock Classic Pro as an animated x-ray you can run through heating, brewing, hot water and steam; every part explained; a live ladder diagram of the stock circuit you can switch |
| `how-gaggiuino-works.html` | Learning | What the PCB, sensors and SSR take over, how Gaggiuino holds the temperature and drives the pump, the new parts and mods, and why the low-voltage side floats, with interactive figures |
| `barista-school.html` | Learning | Hands-on lessons on the stock machine: temperature surfing for light, medium and dark roasts, steaming milk for two, getting back to brew temperature after steaming, and cleaning, with a live temperature map and a coach that grades every shot |
| `glossary.html` | Reference | 145 abbreviations and shop words used across the site, searchable, each with a plain definition and links |
| `budget.html` | Planning | Cost builder: used or new machine, kit supplier, scales and extras; enter real quotes |
| `used-checklist.html` | Buying used | Inspection checklist per listing, with a price gauge |
| `which-gaggia.html` | Planning | Tell the Classic, V2, Pro, Eco, Evo and E24 apart from the rating label, and what each changes for the build |
| `model-notes.html` | Reference | Every model difference that matters for the install, each marked with its source |
| `parts-tracker.html` | Ordering | The parts list with links, status, price paid and box contents |
| `test-yourself.html` | Before opening the machine | Questions on everything on the site, matched to your machine, each linked to where to review it; clear every topic, then pass a final exam for a certificate that you're ready to start the modifications |
| `runbook.html` | Install day | Eight phases of tickable steps, each linked to its section of the official guide, with a stop point before first power-on; prints as one checklist |
| `part-guides.html` | Install day | The thermocouple, pressure sensor, resettable fuse, wires, SSR and switches, each drawn step by step, following your model and install path |
| `wiring.html` | Install day | Every wire for your model, voltage and install path, taken from the official schematic: ends, color, connectors and length |
| `cut-list.html` | Install day | Wire to buy by color, connectors to crimp, and every wire to cut, with adjustable extra length |
| `wire-labels.html` | Install day | Printable flag labels for each wire end, PDF for Letter or A4 |
| `power-on-checks.html` | Before plugging in | About 63 unplugged multimeter and visual checks, picked for your schematic, that mark themselves pass or fail; prints with blanks for readings |
| `troubleshooting.html` | After | Symptoms with likely causes and checks, linked to check and wire IDs |
| `docs/gaggia-models.md` | Reference | The model notes as Markdown |

Every page is a single self-contained HTML file. Ticks, readings and prices are saved in your own browser (localStorage), so nothing leaves your machine and nothing is shared between devices.

**Your Gaggia.** Set your model, mains voltage and install path (stock wiring integration or custom wiring) from "Your Gaggia" in the top bar or on the home page. The runbook, wiring, cut list, labels, checks and troubleshooting pages then show only what applies to your machine, and use GFCI or RCD wording to match your voltage. With nothing set, every note shows with a tag saying which machines it's for.

**Shelly smart relay (optional, unofficial).** Under Extras in Your Gaggia you can add a Shelly 1PM, a Wi-Fi relay that switches the machine on and off from a phone or a schedule, with the power switch as its input. It's drawn for Pro-family machines on custom wiring, from fusio's build on the Gaggiuino Discord. Its wires, map, checks, runbook steps, part guide, parts and questions show only once you add it. Nothing about it is in the official docs.

**Printing.** The runbook prints every phase as one checklist with your settings and blank lines for notes. The power-on checks print with a reading blank and pass or fail boxes on every item, or with your recorded readings if you've entered them. The cut list prints as a shopping and cutting sheet. Use your browser's print command on the published site.

## Safety

This conversion involves mains voltage. Work only with the cord out of the wall. Pass every power-on check before first plug-in, use a GFCI outlet (an RCD-protected socket on 230 V) and keep the covers on. Nothing here has been reviewed by the Gaggiuino project; if anything disagrees with the [official docs](https://gaggiuino.github.io/) or with your own reading of your machine, trust those. You are responsible for your own build.

## Known gaps

- The current official guide has no stock-integration drawing for 230 V Pro-family machines, so the site points them to custom wiring, as the guide does for Eco boards.
- Wire lengths come from the official schematics' tables. Cut long and trim.
- The Learn pages describe the heating and pump control from the public Gen 2 firmware, because Gen 3's source isn't published; Gen 3 uses the same settings. The stock circuit is redrawn from Gaggia's 2018 wiring diagram for the 120 V Classic Pro. Where the tank and some parts sit inside the case isn't published, so the drawings place them approximately.
- Prices are from October 2026 and go stale.

If you have a finished build, your lengths, photos and corrections are exactly what's missing. See `CONTRIBUTING.md`.

## Rebuilding the pages

`build/` holds the generators. `wiring-data.json` is the single source of truth for the wires: every run for each official schematic (stock wiring integration and custom wiring, by model family and voltage), and `wiring.html`, `wire-labels.html`, `cut-list.html` and the power-on checks read it. The site-only pages (home, which Gaggia, cut list, troubleshooting, the Learn pages and the glossary) are templates in `build/` that share `base.css`; the scroll animation on `conversion.html` is `story.tpl.html`, and `img/` holds the still the home page uses for it. The runbook steps are in `runbook-phases.js` and the links into the official guide in `official-links.js`. The Learn pages pull their parts from `learn-*.html`, `learn-*.css` and `learn-*.js`, and the glossary entries live in `gen_glossary.py`. `machine.js` is the "Your Gaggia" picker, inlined into every page. Add-ons to the official wiring (the Shelly) are change lists under `addons` in `wiring-data.json`, which `addons.py` turns into whole schematics; `gen_part_shelly.py` draws the Shelly guide. The Part guides drawings come from `gen_part_svgs.py` (it writes the `part-*.svg.html` files), animated by `part-guides.js`.

```
cd build
python3 site.py https://github.com/Jabawabawaba/Gaggia-Gaggiuino   # builds every page into ../site/ with nav, footer and relative links
```

Then copy the contents of `site/` over the repo root. The budget, used checklist and parts tracker pages are edited directly in `build/pages/`. `build.py` on its own only makes the standalone versions of the install pages, which you don't need for the site.

## Credits

- The [Gaggiuino project](https://gaggiuino.github.io/) and its official docs, schematics and Discord.
- [GaggiMate](https://docs.gaggimate.eu/)'s Classic and Classic Pro install docs, a different mod project, for where the parts sit.
- Whole Latte Love, Shades of Coffee, Coffeeblog, CoffeeGeek and Coffee Forums, for the model history, parts and service information.

## License

Content and code in this repo: [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). See `LICENSE`.
