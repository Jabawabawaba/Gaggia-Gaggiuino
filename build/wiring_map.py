"""Wiring maps for the Gaggia wiring page.

One SVG per official schematic in wiring-data.json. Parts sit where the official drawing puts them (scaled), so the map
can be read side by side with the reference. Every run is routed automatically between the two terminals its ends name,
so a map can only show what the data says. Run `python3 wiring_map.py` to rebuild wiring-maps.json; it also prints any
end it could not place, and fails if one is missing.
"""
import heapq
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
W, H = 1400, 900
G = 8  # router grid, px


def esc(s):
    return str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")


def text(x, y, s, cls="t", anchor="middle", extra=""):
    return f'<text x="{x}" y="{y}" class="{cls}" text-anchor="{anchor}"{extra}>{esc(s)}</text>'


class Map:
    def __init__(self, key, title):
        self.key = key
        self.title = title
        self.parts = []          # (id, name, note, svg, bbox)
        self.term = {}           # name -> (x, y, dir, part)
        self.obs = []            # (x0, y0, x1, y1, part)
        self.links = []          # stock leads on the stock-wiring maps: (from terminal, to terminal, moved?)

    # a part: its drawing, a click box and an obstacle box for the router
    def part(self, pid, name, svg, bbox, note="", block=True, faded=False, obs=None):
        cls = "part" + (" idle" if faded else "")
        x0, y0, x1, y1 = bbox
        hit = f'<rect x="{x0}" y="{y0}" width="{x1 - x0}" height="{y1 - y0}" class="phit"/>'
        self.parts.append((pid, name, note, f'<g class="{cls}" data-part="{pid}">{svg}{hit}</g>', bbox))
        if block:
            for (a, b, c, d) in (obs or [bbox]):
                self.obs.append((a, b, c, d, pid))

    def t(self, name, x, y, d, part):
        self.term[name] = (x, y, d, part)


# ---------- drawing pieces ----------
def box(x, y, w, h, cls="box", rx=6):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" class="{cls}"/>'


def spade(x, y, w=22, h=9, cls="sp"):
    return f'<rect x="{x - w / 2}" y="{y - h / 2}" width="{w}" height="{h}" rx="1.5" class="{cls}"/>'


def pin(x, y):
    return f'<circle cx="{x}" cy="{y}" r="3.5" class="pin"/>'


def lamp(m, pid, name, sub, cx, leads, used=True):
    """a neon lamp with two leads hanging down (leads: [(term name, label)] or [])"""
    s = box(cx - 12, 64, 24, 36, "box", 4) + box(cx - 8, 100, 16, 10, "box", 2)
    s += text(cx, 40, name, "nm") + (text(cx, 53, sub, "tiny") if sub else "")
    for i, (tn, lab) in enumerate(leads):
        x = cx - 8 + 16 * i
        s += f'<path d="M{x},110 V{128}" class="lead"/>' + text(x, 140, lab, "pinl")
        m.t(tn, x, 128, "d", pid)
    m.part(pid, name, s, (cx - 28, 24, cx + 28, 114), faded=not used)


def rocker(m, pid, name, sub, x0, prefix, used):
    """a Pro-family rocker viewed from the back: spades 1-3 down the left, 4-6 down the right"""
    s = box(x0, 56, 80, 96) + text(x0 + 40, 30, name, "nm") + text(x0 + 40, 44, sub, "tiny")
    for i, n in enumerate((1, 2, 3)):
        y = 72 + 32 * i
        for col, num, d in ((x0 + 16, n, "l"), (x0 + 64, n + 3, "r")):
            on = num in used
            s += spade(col, y, 22, 9, "sp" if on else "sp sp-idle")
            s += text(col + (-14 if d == "l" else 14), y + 3.5, str(num), "pinl", "end" if d == "l" else "start")
            m.t(f"{prefix}{num}", col, y, d, pid)
    m.part(pid, name, s, (x0, 20, x0 + 80, 152))


def housing(m, x0, used, y0=72):
    """the original Classic's switch housing viewed from the back: Brew, Steam, spare, On/Off, each top, P, bottom"""
    secs = (("Brew", "1", "2"), ("Steam", "3", "4"), ("", "5", "6"), ("On/Off", "7", "8"))
    s = box(x0, y0, 256, 120) + text(x0 + 128, 30, "Switch housing", "nm") + text(x0 + 128, 44, "view: back", "tiny")
    exits = {"Brew": ("u", "l", "d"), "Steam": ("u", "d", "d"), "": ("u", "d", "d"), "On/Off": ("r", "r", "r")}
    for i, (nm, a, b) in enumerate(secs):
        cx = x0 + 32 + 64 * i
        if i:
            s += f'<line x1="{x0 + 64 * i}" y1="{y0 + 6}" x2="{x0 + 64 * i}" y2="{y0 + 114}" class="div"/>'
        for j, (lab, y) in enumerate(((a, y0 + 24), ("P", y0 + 56), (b, y0 + 88))):
            key = f"{nm or 'Spare'} {lab}"
            on = key in used
            s += spade(cx, y, 24, 9, "sp" if on else "sp sp-idle")
            s += text(cx - 16, y + 3.5, lab, "pinl", "end")
            m.t(f"hs:{key}", cx, y, exits[nm][j], "housing")
        if nm:
            s += text(cx, y0 + 112, nm, "tiny")
    m.part("housing", "Switch housing", s, (x0, 20, x0 + 256, y0 + 120),
           obs=[(x0, y0, x0 + 256, y0 + 120), (x0 + 72, 20, x0 + 184, 50)])


def cup_warmer(m, faded=False, at=(48, 304)):
    x, y = at
    s = (f'<path d="M{x},{y + 24} L{x + 128},{y} V{y + 112} L{x},{y + 88} Z" class="box"/>'
         + spade(x + 120, y + 52, 18, 9, "sp sp-idle") + spade(x + 120, y + 80, 18, 9)
         + text(x + 56, y + 52, "Cup warmer", "nm") + text(x + 56, y + 66, "ground spade", "tiny"))
    m.t("cup", x + 128, y + 80, "r", "cup")
    m.part("cup", "Cup warmer ground", s, (x, y, x + 128, y + 112), faded=faded)


def boiler(m, si=False):
    x0, y0 = 120, 552
    s = box(x0, y0, 280, 280, "box", 26) + f'<circle cx="{x0 + 140}" cy="{y0 + 140}" r="120" class="inner"/>'
    for (cx, cy) in ((x0 + 24, y0 + 24), (x0 + 256, y0 + 24), (x0 + 24, y0 + 256), (x0 + 256, y0 + 256)):
        s += f'<circle cx="{cx}" cy="{cy}" r="9" class="inner"/>'
    s += f'<path d="M{x0 + 88},{y0 + 128} l10,-14 l12,28 l12,-28 l12,28 l12,-28 l12,28 l12,-28 l10,14" class="elem"/>'
    s += f'<path d="M{x0 + 88},{y0 + 212} l10,-14 l12,28 l12,-28 l12,28 l12,-28 l12,28 l12,-28 l10,14" class="elem"/>'
    # thermal fuse across the top, ground spade above it
    s += box(x0 + 80, y0 + 64, 128, 24, "fuse", 3) + text(x0 + 144, y0 + 80, "184 °C fuse", "tiny")
    s += spade(x0 + 144, y0 + 32, 18, 9) + text(x0 + 168, y0 + 36, "gnd", "tiny", "start")
    m.t("b:gnd", x0 + 144, y0 + 24, "u", "boiler")
    m.t("b:fuseL", x0 + 80, y0 + 80, "l", "boiler")
    m.t("b:fuseR", x0 + 208, y0 + 80, "r", "boiler")
    for tn, (dx, dy, d) in {"b:TL": (64, 48, "l"), "b:TR": (216, 48, "r"), "b:BL": (64, 248, "l"), "b:BR": (216, 248, "r")}.items():
        cx, cy = x0 + dx, y0 + dy
        s += f'<circle cx="{cx}" cy="{cy}" r="7" class="term"/>'
        m.t(tn, cx, cy, d, "boiler")
    s += text(x0 + 64, y0 + 66, "TL", "pinl") + text(x0 + 216, y0 + 66, "TR", "pinl")
    s += text(x0 + 64, y0 + 236, "BL", "pinl") + text(x0 + 216, y0 + 236, "BR", "pinl")
    s += text(x0 + 140, y0 + 300, "Boiler", "nm") + text(x0 + 140, y0 + 314, "view: top · two elements", "tiny")
    if si:
        s += text(x0 + 140, y0 + 176, "elements and fuse stay as they are", "tiny")
        s += f'<polygon points="{x0 + 104},{y0 - 6} {x0 + 120},{y0 - 6} {x0 + 126},{y0 + 6} {x0 + 120},{y0 + 18} {x0 + 104},{y0 + 18} {x0 + 98},{y0 + 6}" class="term"/>'
        s += text(x0 + 92, y0 - 12, "brew thermostat, out", "tiny", "end")
        s += f'<polygon points="{x0 + 276},{y0 + 128} {x0 + 292},{y0 + 128} {x0 + 298},{y0 + 140} {x0 + 292},{y0 + 152} {x0 + 276},{y0 + 152} {x0 + 270},{y0 + 140}" class="term"/>'
        s += text(x0 + 304, y0 + 172, "steam thermostat", "tiny", "start")
        m.t("b:bt", x0 + 112, y0 - 8, "u", "boiler")
        m.t("b:st", x0 + 296, y0 + 140, "r", "boiler")
    m.part("boiler", "Boiler", s, (x0, y0, x0 + 280, y0 + 280), block=False)
    m.obs.append((x0 + 76, y0 + 60, x0 + 212, y0 + 92, "boiler"))  # the fuse body


def splice(m, pid, name, x, y, horiz=True, label=""):
    if horiz:
        s = f'<rect x="{x - 10}" y="{y - 6}" width="20" height="12" rx="2" class="splice"/>'
        m.t(pid + ":in", x - 16, y, "l", pid)
        m.t(pid + ":out", x + 16, y, "r", pid)
        bb = (x - 12, y - 8, x + 12, y + 8)
    else:
        s = f'<rect x="{x - 6}" y="{y - 10}" width="12" height="20" rx="2" class="splice"/>'
        m.t(pid + ":in", x, y - 16, "u", pid)
        m.t(pid + ":out", x, y + 16, "d", pid)
        bb = (x - 8, y - 12, x + 8, y + 12)
    s += text(x + (0 if horiz else 12), y + (-12 if horiz else 4), label or name, "tiny", "middle" if horiz else "start")
    if not horiz:
        bb = (x - 8, y - 12, x + 12 + 7 * len(label or name), y + 12)
    else:
        bb = (x - 12, y - 22, x + 12, y + 8)
    m.part(pid, name, s, bb)


def ssr(m, x0, y0):
    s = box(x0, y0, 120, 136)
    s += f'<line x1="{x0}" y1="{y0 + 36}" x2="{x0 + 120}" y2="{y0 + 36}" class="div"/><line x1="{x0}" y1="{y0 + 100}" x2="{x0 + 120}" y2="{y0 + 100}" class="div"/>'
    for (dx, dy) in ((24, 16), (96, 16), (24, 120), (96, 120)):
        s += f'<circle cx="{x0 + dx}" cy="{y0 + dy}" r="8" class="term"/>'
    s += text(x0 + 24, y0 + 52, "+ control", "tiny") + text(x0 + 96, y0 + 52, "− control", "tiny")
    s += text(x0 + 60, y0 + 72, "SSR-40DA", "nm") + text(x0 + 60, y0 + 86, "view: top", "tiny")
    s += text(x0 + 24, y0 + 96, "load", "tiny") + text(x0 + 96, y0 + 96, "load", "tiny")
    m.t("ssr:+", x0 + 24, y0 + 16 - 8, "u", "ssr")
    m.t("ssr:-", x0 + 96, y0 + 16 - 8, "u", "ssr")
    m.t("ssr:L", x0 + 24, y0 + 120 + 8, "d", "ssr")
    m.t("ssr:R", x0 + 96, y0 + 120 + 8, "d", "ssr")
    m.part("ssr", "Solid-state relay (SSR)", s, (x0, y0, x0 + 120, y0 + 136))


def solenoid(m, x0, y0, faded=False):
    s = box(x0, y0, 80, 80) + spade(x0 + 40, y0 + 10, 18, 8)
    s += spade(x0 + 16, y0 + 72, 8, 16) + spade(x0 + 64, y0 + 72, 8, 16)
    s += text(x0 + 40, y0 + 40, "3-way valve", "nm") + text(x0 + 40, y0 + 53, "connector side", "tiny")
    s += text(x0 + 40, y0 + 25, "gnd", "tiny") + text(x0 + 16, y0 + 66, "L", "pinl") + text(x0 + 64, y0 + 66, "R", "pinl")
    m.t("sol:gnd", x0 + 40, y0, "u", "sol")
    m.t("sol:L", x0 + 16, y0 + 80, "d", "sol")
    m.t("sol:R", x0 + 64, y0 + 80, "d", "sol")
    m.part("sol", "3-way solenoid valve", s, (x0, y0, x0 + 80, y0 + 80), faded=faded)


def chassis(m, x, y, faded=False):
    s = (f'<path d="M{x - 24},{y - 16} l8,8 h12 v-8 h8 v8 h12 l8,-8" class="lead"/>' + spade(x, y, 9, 16)
         + text(x, y - 24, "Chassis ground", "tiny"))
    m.t("chassis", x, y + 8, "d", "chassis")
    m.part("chassis", "Chassis ground", s, (x - 28, y - 30, x + 28, y + 8), faded=faded)


def socket(m, x0, y0, faded=False):
    s = box(x0, y0, 96, 64)
    for (dx, lab, tn) in ((16, "L", "sock:L"), (48, "GND", "sock:G"), (80, "N", "sock:N")):
        s += spade(x0 + dx, y0 + 8, 9, 16) + text(x0 + dx, y0 + 34, lab, "pinl")
        m.t(tn, x0 + dx, y0, "u", "sock")
    s += text(x0 + 48, y0 + 52, "Power socket", "nm") + text(x0 + 48, y0 + 80, "IEC inlet · view: ground up", "tiny")
    m.part("sock", "Power socket", s, (x0 - 24, y0, x0 + 120, y0 + 88), faded=faded)


def pump(m, x0, y0, fam, si=False, faded=False):
    s = box(x0, y0, 96, 176) + box(x0 + 32, y0 + 176, 32, 40, "box", 3)
    s += spade(x0 + 24, y0 + 16, 9, 16) + spade(x0 + 48, y0 + 16, 9, 16)
    s += text(x0 + 24, y0 + 40, "A", "pinl") + text(x0 + 48, y0 + 40, "B", "pinl")
    s += box(x0 + 60, y0 + 24, 24, 28, "fuse", 2) + text(x0 + 72, y0 + 64, "110 °C", "tiny")
    s += text(x0 + 48, y0 + 104, "Ulka pump", "nm") + text(x0 + 48, y0 + 118, "connector side", "tiny")
    m.t("pump:A", x0 + 24, y0, "u", "pump")
    m.t("pump:B", x0 + 48, y0, "u", "pump")
    m.t("pf:in", x0 + 64, y0 + 24, "u", "pump")
    m.t("pf:out", x0 + 80, y0 + 24, "u", "pump")
    m.part("pump", "Pump and its 110 °C fuse", s, (x0, y0, x0 + 96, y0 + 216), faded=faded)


def inline_spade(m, x, y):
    s = f'<rect x="{x - 8}" y="{y - 5}" width="16" height="10" rx="2" class="splice"/>' + text(x, y - 10, "inline spade", "tiny")
    m.t("inl", x, y, "u", "inl")
    m.part("inl", "Inline spade at the pump", s, (x - 30, y - 22, x + 30, y + 6))


def sensor(m, x0, y0):
    s = box(x0, y0, 56, 64) + box(x0 + 12, y0 + 64, 32, 32, "box", 3)
    s += text(x0 + 28, y0 + 30, "Pressure", "tiny") + text(x0 + 28, y0 + 42, "sensor", "tiny")
    for i, lab in enumerate(("OUT", "GND", "5V")):
        x = x0 + 8 + 16 * i
        s += f'<path d="M{x},{y0} V{y0 - 8}" class="lead"/>'
        m.t("ps:" + lab, x, y0 - 8, "u", "psens")
    m.part("psens", "Pressure sensor", s, (x0, y0 - 8, x0 + 56, y0 + 96))


def thermocouple(m, x, y):
    s = (f'<path d="M{x},{y} V{y + 40}" class="lead"/><rect x="{x - 6}" y="{y + 40}" width="12" height="28" rx="2" class="box"/>'
         f'<path d="M{x},{y + 68} V{y + 84}" class="lead"/>' + text(x + 12, y + 54, "Thermocouple", "tiny", "start")
         + text(x + 12, y + 66, "in the brew thermostat's hole", "tiny", "start"))
    m.t("tc", x, y, "u", "tc")
    m.part("tc", "Thermocouple", s, (x - 8, y, x + 160, y + 84))


def screen(m, x0, y0):
    s = box(x0, y0, 184, 120, "box", 10) + text(x0 + 92, y0 + 52, "4.3 in screen", "nm") + text(x0 + 92, y0 + 68, "view: back", "tiny")
    for i, lab in enumerate(("GND", "IO18", "IO17", "5V")):
        x = x0 + 24 + 32 * i
        s += pin(x, y0 + 120) + text(x, y0 + 110, lab, "pinl")
        m.t("scr:" + lab, x, y0 + 120, "d", "screen")
    m.part("screen", "Screen", s, (x0, y0, x0 + 184, y0 + 120))


def pcb(m, x0=1176, y0=296):
    s = box(x0, y0, 200, 536, "pcb", 8)
    s += text(x0 + 188, y0 + 508, "Gaggiuino PCB", "nm", "end") + text(x0 + 188, y0 + 522, "v3.1 / v4 · view: top", "tiny", "end")
    heads = [
        ("J6", "Pressure", [("5V", 336), ("GND", 352), ("P", 368)], True),
        ("J7", "Switches", [("GND", 408), ("S", 424), ("B", 440)], True),
        ("J5", "Extra IO, unused", [("GND", 480), ("B15", 496), ("A12", 512)], False),
        ("J9", "SSR", [("GND", 552), ("R1", 568), ("R2", 584)], True),
        ("J4", "Thermocouple", [("−", 624), ("+", 640)], True),
    ]
    for j, name, plist, on in heads:
        ys = [p[1] for p in plist]
        s += f'<rect x="{x0 + 4}" y="{min(ys) - 9}" width="44" height="{max(ys) - min(ys) + 18}" rx="3" class="hdr{"" if on else " hdr-opt"}"/>'
        for lab, y in plist:
            s += pin(x0, y) + text(x0 + 12, y + 3.5, lab, "pinl", "start")
            m.t(f"{j}:{lab}", x0, y, "l", "pcb")
        mid = (min(ys) + max(ys)) / 2
        s += text(x0 + 60, mid + 4, j, "jn", "start") + text(x0 + 92, mid + 4, name, "t" if on else "tiny", "start")
    for lab, y, j, name in (("3", 704, "J13", "Solenoid"), ("P", 728, "J12", "Pump"), ("L", 752, "J11", "AC line"), ("N", 776, "J10", "AC neutral")):
        s += spade(x0 + 14, y, 26, 9) + text(x0 + 34, y + 4, lab, "pinl", "start")
        s += text(x0 + 60, y + 4, j, "jn", "start") + text(x0 + 100, y + 4, name, "t", "start")
        m.t(f"{j}:{lab}", x0, y, "l", "pcb")
    for i, lab in enumerate(("GND", "TX", "RX", "5V")):
        x = x0 + 32 + 32 * i
        s += pin(x, y0) + text(x, y0 + 18, lab, "pinl")
        m.t(f"J1:{lab}", x, y0, "u", "pcb")
    s += text(x0 + 168, y0 + 22, "J1", "jn", "start")
    s += f'<rect x="{x0 + 4}" y="{y0 + 362}" width="44" height="22" rx="3" class="hdr hdr-opt"/>' + text(x0 + 60, y0 + 377, "J8", "jn", "start") + text(x0 + 92, y0 + 377, "Scales, optional", "tiny", "start")
    m.part("pcb", "Gaggiuino PCB", s, (x0, y0, x0 + 200, y0 + 536))


def flag(m, fid, x, y, d, note, faded=False):
    """a stock connector end: drawn as a small tab with its name; d is the side its new wire leaves from"""
    w = 16 * -(-(14 + 8 * len(fid)) // 16)
    s = f'<rect x="{x - w / 2}" y="{y - 8}" width="{w}" height="16" rx="3" class="flag"/>' + text(x, y + 4, fid, "flagt")
    off = {"l": (-w / 2, 0), "r": (w / 2, 0), "u": (0, -8), "d": (0, 8)}[d]
    m.t("f:" + fid, x + off[0], y + off[1], d, "f:" + fid)
    m.part("f:" + fid, "Stock connector " + fid, s, (x - w / 2, y - 8, x + w / 2, y + 8), note=note, faded=faded)


# ---------- layouts ----------
def layout_gcp(key, title, si, data):
    m = Map(key, title)
    used_sw = {"steam": (1, 2) if not si else (4, 5, 1), "brew": (1, 2), "pwr": (4, 5) if not si else ()}
    lamp(m, "lampS", "Steam lamp", "now the boiler lamp", 360, [("lampS:A", "A"), ("lampS:B", "B")], used=not si)
    rocker(m, "swS", "Steam switch", "DPDT · view: back", 424, "steam", used_sw["steam"])
    lamp(m, "lampB", "Brew lamp", "unused", 568, [], used=False)
    rocker(m, "swB", "Brew switch", "DPST · view: back", 616, "brew", used_sw["brew"])
    lamp(m, "lampP", "Power lamp", "", 760, [("lampP:A", "A"), ("lampP:B", "B")], used=not si)
    rocker(m, "swP", "Power switch", "DPST · view: back", 808, "pwr", used_sw["pwr"])
    screen(m, 1184, 48)
    pcb(m)
    sensor(m, 1040, 384)
    if si:
        cup_warmer(m, faded=True, at=(640, 760))
        boiler(m, si=True)
        thermocouple(m, 248, 432)
        ssr(m, 480, 336)
        solenoid(m, 656, 392, faded=True)
        chassis(m, 728, 560, faded=True)
        socket(m, 544, 760, faded=True)
        pump(m, 824, 600, "GCP", si=True)
        flag(m, "Ba", 336, 416, "r", data["Ba"])
        flag(m, "Bb", 408, 416, "l", data["Bb"])
        flag(m, "Sb", 472, 560, "u", data["Sb"])
        flag(m, "Sa", 536, 576, "u", data["Sa"])
        flag(m, "Pb", 824, 544, "r", data["Pb"])
        flag(m, "B4", 968, 584, "r", data["B4"])
        flag(m, "Pa", 896, 576, "u", data["Pa"])
        flag(m, "S4", 384, 176, "u", data["S4"], faded=True)
        flag(m, "S5", 440, 192, "u", data["S5"], faded=True)
        m.links += [("f:Ba", "b:bt", True), ("f:Bb", "b:bt", True), ("f:Sa", "b:st", True), ("f:Sb", "b:st", True),
                    ("f:Pb", "pump:A", True), ("f:Pa", "pump:B", False), ("f:B4", "brew4", True), ("f:S4", "steam1", False)]
    else:
        cup_warmer(m)
        boiler(m)
        thermocouple(m, 456, 424)
        ssr(m, 552, 296)
        solenoid(m, 760, 352)
        chassis(m, 896, 408)
        socket(m, 744, 712)
        pump(m, 920, 632, "GCP")
        inline_spade(m, 1056, 600)
        splice(m, "s3", "BN2 S3 lamp junction", 800, 200, label="BN2 S3")
        splice(m, "s1", "BN1.25 S1", 296, 232, horiz=False, label="BN1.25 S1")
        splice(m, "s2", "BN1.25 S2", 728, 232, horiz=False, label="BN1.25 S2")
        splice(m, "s4", "BN2 S4 boiler line-side splice", 96, 704, label="BN2 S4")
        splice(m, "s5", "BN2 S5 boiler neutral-side splice", 456, 704, label="BN2 S5")
        rf = (box(472, 744, 136, 88, "opt", 8) + f'<circle cx="540" cy="784" r="14" class="term"/>'
              + spade(504, 800, 18, 9) + spade(576, 800, 18, 9) + text(540, 762, "Resettable fuse, optional", "tiny"))
        m.t("rf:L", 496, 800, "l", "rf")
        m.t("rf:R", 584, 800, "r", "rf")
        m.part("rf", "Resettable fuse (optional)", rf, (472, 744, 608, 832))
    return m


def layout_gc(key, title, si, data, volts):
    m = Map(key, title)
    if si:
        used = {"Brew 1", "Brew P", "Steam 3", "Steam P"}
    else:
        used = {"Brew 1", "Brew P", "Steam 3", "Steam P", "On/Off 7", "On/Off P", "On/Off 8"}
    il = box(536, 64, 56, 96, "opt", 6) + text(564, 40, "Brew lamp", "nm") + text(564, 53, "inside, unused", "tiny")
    m.part("lampB", "Internal brew lamp (unused)", il, (528, 24, 600, 160), faded=True, obs=[(536, 24, 592, 56)])
    housing(m, 616, used)
    ip = box(896, 64, 56, 96, "opt", 6) + text(924, 40, "Power lamp", "nm") + text(924, 53, "inside" if si else "now the boiler lamp", "tiny")
    m.part("lampP", "Internal power lamp", ip, (888, 24, 960, 160), obs=[(896, 24, 952, 56)])
    screen(m, 1184, 48)
    pcb(m)
    sensor(m, 1040, 384)
    boiler(m, si=si)
    if si:
        thermocouple(m, 248, 432)
        ssr(m, 480, 336)
        cup_warmer(m, faded=True, at=(640, 760))
        solenoid(m, 656, 392, faded=True)
        socket(m, 544, 760, faded=True)
        pump(m, 824, 600, "GC", si=True)
        flag(m, "Ba", 336, 416, "r", data["Ba"])
        flag(m, "Bb", 408, 416, "l", data["Bb"])
        flag(m, "Sb", 472, 560, "u", data["Sb"])
        flag(m, "Sa", 536, 592, "u", data["Sa"])
        flag(m, "P1-2", 824, 544, "r", data["P1-2"])
        flag(m, "Pb", 824, 576, "r", data["Pb"])
        if "Pa" in data:
            flag(m, "Pa", 896, 584, "u", data["Pa"])
            flag(m, "F", 896, 552, "u", data["F"], faded=True)
        else:
            flag(m, "F", 896, 584, "u", data["F"])
        for i, fid in enumerate(("1", "2", "3", "P3-4")):
            flag(m, fid, 528 + 48 * (i % 2), 216 + 28 * (i // 2), "u", data[fid], faded=True)
        m.links += [("f:Ba", "b:bt", True), ("f:Bb", "b:bt", True), ("f:Sa", "b:st", True), ("f:Sb", "b:st", True),
                    ("f:Pb", "pump:A", True), ("f:P1-2", "hs:Brew P", True)]
        m.links += [("f:Pa", "pump:B", False)] if "Pa" in data else [("f:F", "pump:B", False)]
    else:
        thermocouple(m, 456, 424)
        ssr(m, 568, 296)
        cup_warmer(m)
        pump(m, 664, 600, "GC")
        solenoid(m, 816, 600)
        socket(m, 936, 712)
        inline_spade(m, 776, 576)
        splice(m, "s5", "BN2 splice", 496, 736, label="BN2")
        rf = (box(472, 760, 136, 80, "opt", 8) + f'<circle cx="540" cy="796" r="13" class="term"/>'
              + text(540, 778, "Resettable fuse, optional", "tiny"))
        m.part("rf", "Resettable fuse (optional, not wired here)", rf, (472, 760, 608, 840), faded=True)
    return m


# ---------- which terminal each end names ----------
END = {
    # stock wiring, both families
    "Ba": "f:Ba", "Bb": "f:Bb", "Sa": "f:Sa", "Sb": "f:Sb", "Pb": "f:Pb", "Pa": "f:Pa", "B4": "f:B4", "P1-2": "f:P1-2",
    "Pump": "pump:A", "Pump, with F": "f:F",
    "J13 3": "J13:3", "J12 P": "J12:P", "J11 L": "J11:L", "J10 N": "J10:N",
    "J7 B": "J7:B", "J7 S": "J7:S", "J7 GND": "J7:GND", "J9 R1": "J9:R1", "J9 GND": "J9:GND",
    "SSR +": "ssr:+", "SSR −": "ssr:-",
    "Brew sw 1": "brew1", "Brew sw 2": "brew2", "Steam sw 4": "steam4", "Steam sw 5": "steam5",
    # Classic stock wiring: the switch housing
    "Steam sw 3": "hs:Steam 3", "Steam sw P(3-4)": "hs:Steam P", "Brew sw P(1-2)": "hs:Brew P",
    # custom wiring, Pro family
    "Power Socket L": "sock:L", "Power Socket N": "sock:N", "Power Socket GND": "sock:G",
    "Power Switch terminal 5": "pwr5", "Power Switch terminal 4": "pwr4",
    "SSR load right terminal": "ssr:R", "SSR load left terminal": "ssr:L",
    "BN2 S3 lamp junction (right side)": "s3:out", "BN2 S3 lamp junction (left side)": "s3:in",
    "PCB J11 AC Line L": "J11:L", "PCB J12 Pump P": "J12:P", "PCB J13 Solenoid 3": "J13:3", "PCB J10 AC Neutral N": "J10:N",
    "Power Lamp lead A": "lampP:A", "Power Lamp lead B": "lampP:B", "Steam Lamp lead A": "lampS:A", "Steam Lamp lead B": "lampS:B",
    "Pump left spade": "pump:A", "Pump right spade": "pump:B",
    "Solenoid right spade": "sol:R", "Solenoid left spade (neutral)": "sol:L", "Solenoid Gnd spade": "sol:gnd",
    "BN2 S4 boiler line-side splice (left side)": "s4:in", "BN2 S4 boiler line-side splice (right side)": "s4:out",
    "BN2 S5 boiler neutral-side splice (left side)": "s5:in", "BN2 S5 boiler neutral-side splice (right side)": "s5:out",
    "Stock Boiler Thermal Fuse, right end": "b:fuseR", "Stock Boiler Thermal Fuse, left end": "b:fuseL",
    "Boiler element terminal TL (top-left)": "b:TL", "Boiler element terminal TR (top-right)": "b:TR",
    "Boiler element terminal BL (bottom-left)": "b:BL", "Boiler element terminal BR (bottom-right)": "b:BR",
    "Re-settable Fuse right spade": "rf:R", "Re-settable Fuse left spade": "rf:L",
    "Spade 6.3mm inline connector at pump": "inl",
    "Chassis Ground spade": "chassis", "Boiler GND spade": "b:gnd", "Cup Heater Ground (lower spade)": "cup",
    "PCB J9 R1": "J9:R1", "PCB J9 GND": "J9:GND", "SSR + (control)": "ssr:+", "SSR - (control)": "ssr:-",
    "PCB J7 S": "J7:S", "PCB J7 B": "J7:B", "PCB J7 GND": "J7:GND",
    "Steam Switch terminal 1": "steam1", "Steam Switch terminal 2": "steam2",
    "Brew Switch terminal 1": "brew1", "Brew Switch terminal 2": "brew2",
    # custom wiring, Classic
    "Switch Housing On/Off 7": "hs:On/Off 7", "Switch Housing On/Off P": "hs:On/Off P", "Switch Housing On/Off 8": "hs:On/Off 8",
    "Switch Housing Brew 1": "hs:Brew 1", "Switch Housing Brew P": "hs:Brew P",
    "Switch Housing Steam 3": "hs:Steam 3", "Switch Housing Steam P (left pole)": "hs:Steam P",
    "SSR load, right screw": "ssr:R", "SSR load, left screw": "ssr:L",
    "PCB J11 AC Line (L)": "J11:L", "PCB J12 Pump (P)": "J12:P", "PCB J13 Solenoid (3)": "J13:3", "PCB J10 AC Neutral (N)": "J10:N",
    "Pump terminal A (left spade)": "pump:A", "Pump terminal B (second spade)": "pump:B",
    "Solenoid left spade": "sol:L", "Solenoid right spade (neutral)": "sol:R", "Solenoid GND spade": "sol:gnd",
    "Stock Thermal Fuse, right end": "b:fuseR", "Stock Thermal Fuse, left end": "b:fuseL",
    "Boiler element pin TL (top-left)": "b:TL", "Boiler element pin TR (top-right)": "b:TR",
    "Boiler element pin BL (bottom-left)": "b:BL", "Boiler element pin BR (bottom-right)": "b:BR",
    "BN2 splice, side A": "s5:in", "BN2 splice, side B": "s5:out",
    "Pump Thermal Fuse lead, inline Spade 6.3mm": "inl", "inline Spade 6.3mm (joins R12)": "inl", "inline Spade 6.3mm (joins R11)": "inl",
    "Pump Thermal Fuse 110C, leg 1": "pf:in", "Pump Thermal Fuse 110C, leg 2": "pf:out",
    "Cup Heater Ground, lower spade": "cup", "Boiler GND tab": "b:gnd",
}
# ends that name a splice or fuse without saying which side: the run that arrives takes one side, the run that leaves the other
SIDED = {"BN1.25 S1": "s1", "BN1.25 S2": "s2", "Pump Thermal Fuse 110C": "pf"}
# the SSR load terminal on the stock-wiring drawings: Sb comes off the left screw, Sa off the right
SSR_LOAD = {"Sb": "ssr:L", "Sa": "ssr:R"}
CABLES = {
    "TC": ("Thermocouple to J4", [("tc", "J4:+"), ("tc", "J4:−")]),
    "PS": ("Pressure sensor to J6", [("ps:5V", "J6:5V"), ("ps:GND", "J6:GND"), ("ps:OUT", "J6:P")]),
    "SCR": ("Screen to J1", [("scr:GND", "J1:GND"), ("scr:IO18", "J1:TX"), ("scr:IO17", "J1:RX"), ("scr:5V", "J1:5V")]),
}


# the Classic's stock-wiring drawing names its housing spades the short way
END_GC = {"Brew sw 1": "hs:Brew 1"}


def resolve(end, role, run, fam="GCP"):
    if fam == "GC" and end in END_GC:
        return END_GC[end]
    if end in SIDED:
        return SIDED[end] + (":in" if role == "to" else ":out")
    if end == "SSR load terminal":
        return SSR_LOAD[run["id"]]
    return END.get(end)


# ---------- router ----------
class Router:
    def __init__(self, m):
        self.m = m
        self.nx, self.ny = W // G + 1, H // G + 1
        self.block = [[False] * self.ny for _ in range(self.nx)]
        for (x0, y0, x1, y1, _) in m.obs:
            for i in range(max(0, int(x0 // G)), min(self.nx, -int(-x1 // G) + 1)):
                for j in range(max(0, int(y0 // G)), min(self.ny, -int(-y1 // G) + 1)):
                    self.block[i][j] = True
        for i in range(self.nx):
            for j in range(0, 3):
                self.block[i][j] = True
        self.occ = {}  # (i, j) -> list of (axis, run id, set of terminals)

    def stub(self, tn):
        """leave a terminal straight out of its part until clear of every obstacle; returns the cells"""
        x, y, d, part = self.m.term[tn]
        dx, dy = {"u": (0, -1), "d": (0, 1), "l": (-1, 0), "r": (1, 0)}[d]
        i, j = round(x / G), round(y / G)
        cells = [(i, j)]
        n = 0
        while True:
            i += dx
            j += dy
            n += 1
            cells.append((i, j))
            if n >= 2 and not self.block[i][j]:
                break
            if n > 40:
                break
        return cells, (dx, dy)

    def cost(self, cell, axis, nets):
        c = 0.0
        for (ax, rid, ts) in self.occ.get(cell, ()):
            if ts & nets:
                c += 0.15
            elif ax == axis:
                c += 9.0
            else:
                c += 2.5
        return c

    def route(self, a, b, rid):
        ca, da = self.stub(a)
        cb, db = self.stub(b)
        nets = {a, b}
        start, goal = ca[-1], cb[-1]
        dirs = ((1, 0), (-1, 0), (0, 1), (0, -1))
        sd = dirs.index(da)
        gd = dirs.index((-db[0], -db[1]))  # arrive moving toward the goal stub's terminal
        openq = [(0, 0, start, sd)]
        best = {(start, sd): 0}
        prev = {}
        endstate = None
        while openq:
            f, g, cell, di = heapq.heappop(openq)
            if cell == goal:
                endstate = (cell, di)
                break
            if g > best.get((cell, di), 1e18):
                continue
            for nd, (dx, dy) in enumerate(dirs):
                if (dx, dy) == (-dirs[di][0], -dirs[di][1]):
                    continue
                ni, nj = cell[0] + dx, cell[1] + dy
                if not (0 <= ni < self.nx and 0 <= nj < self.ny):
                    continue
                if self.block[ni][nj] and (ni, nj) != goal:
                    continue
                axis = "h" if dx else "v"
                step = 1 + self.cost((ni, nj), axis, nets) + (4 if nd != di else 0)
                if (ni, nj) == goal and nd != gd:
                    step += 6
                ng = g + step
                if ng < best.get(((ni, nj), nd), 1e18):
                    best[((ni, nj), nd)] = ng
                    prev[((ni, nj), nd)] = (cell, di)
                    h = abs(ni - goal[0]) + abs(nj - goal[1])
                    heapq.heappush(openq, (ng + h, ng, (ni, nj), nd))
        if not endstate:
            raise RuntimeError(f"{self.m.key}: no route for {rid} ({a} to {b})")
        path = [endstate[0]]
        st = endstate
        while st in prev:
            st = prev[st]
            path.append(st[0])
        path.reverse()
        cells = ca + path[1:] + list(reversed(cb[:-1]))
        for k in range(1, len(cells)):
            (i0, j0), (i1, j1) = cells[k - 1], cells[k]
            axis = "h" if i0 != i1 else "v"
            for c in ((i0, j0), (i1, j1)):
                self.occ.setdefault(c, []).append((axis, rid, nets))
        # exact terminal points at the ends, grid in between
        pts = [(c[0] * G, c[1] * G) for c in cells]
        ax, ay = self.m.term[a][:2]
        bx, by = self.m.term[b][:2]
        pts[0] = (ax, ay)
        pts[-1] = (bx, by)
        pts = straighten(pts)
        return pts


def straighten(pts):
    """keep the ends exact: nudge the neighbouring points so every segment stays horizontal or vertical, then drop
    points in the middle of straight runs"""
    if len(pts) > 2:
        (x0, y0), (x1, y1) = pts[0], pts[1]
        if pts[1][0] == pts[2][0]:  # second segment vertical, so the first is horizontal
            pts[1] = (x1, y0)
        else:
            pts[1] = (x0, y1)
        (xa, ya), (xb, yb) = pts[-1], pts[-2]
        if pts[-2][0] == pts[-3][0]:
            pts[-2] = (xb, ya)
        else:
            pts[-2] = (xa, yb)
    out = [pts[0]]
    for p in pts[1:]:
        if p == out[-1]:
            continue
        if len(out) >= 2 and (out[-2][0] == out[-1][0] == p[0] or out[-2][1] == out[-1][1] == p[1]):
            out[-1] = p
        else:
            out.append(p)
    return out


def d_of(pts):
    s = f"M{pts[0][0]:g},{pts[0][1]:g}"
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        s += f" H{x1:g}" if y0 == y1 else (f" V{y1:g}" if x0 == x1 else f" L{x1:g},{y1:g}")
    return s


WIRECOL = {"red": "#C2412F", "orange": "#E08A1E", "blue": "#2F5FB3", "green": "#2D7A4C", "white": "#F4F4F2", "black": "#1B1D20",
           "yellow": "#E3C21A", "purple": "#7A4FC0", "brown": "#7A4A2A", "gray": "#8C939A", "magenta": "#C2389B"}


def build_variant(key, v):
    flags = {f["id"]: f["l1"] + "; " + f["l2"] for f in v.get("flags", [])}
    si = v["path"] == "SI"
    title = v["name"]
    if v["fam"] == "GCP":
        m = layout_gcp(key, title, si, flags)
    else:
        m = layout_gc(key, title, si, flags, v["volts"])
    r = Router(m)
    runs = []
    missing = []
    for run in v["runs"]:
        a = resolve(run["frm"], "frm", run, v["fam"])
        b = resolve(run["to"], "to", run, v["fam"])
        for end, t in ((run["frm"], a), (run["to"], b)):
            if not t or t not in m.term:
                missing.append(f'{key} {run["id"]}: "{end}" -> {t}')
        runs.append((run, a, b))
    if missing:
        raise SystemExit("unplaced ends:\n  " + "\n  ".join(missing))
    order = {"H": 0, "L": 1, "N": 2, "E": 3, "LV": 4, "LVG": 4}
    def dist(x):
        (ax, ay), (bx, by) = m.term[x[1]][:2], m.term[x[2]][:2]
        return abs(ax - bx) + abs(ay - by)
    paths = {}
    for run, a, b in sorted(runs, key=lambda x: (order.get(x[0]["sys"], 5), dist(x))):
        paths[run["id"]] = r.route(a, b, run["id"])
    links = []
    for (fa, fb, moved) in m.links:
        links.append((fa, fb, moved, r.route(fa, fb, "stock:" + fa)))
    m.routed_links = links
    cab = {}
    if v.get("cables"):
        for cid, (nm, legs) in CABLES.items():
            cab[cid] = [r.route(a, b, cid) for a, b in legs]
    return m, runs, paths, cab


def place_tags(m, runs, paths, cab):
    tags = {}
    taken = [(x0, y0, x1, y1) for (_, _, _, _, (x0, y0, x1, y1)) in m.parts]
    def free(x, y, w):
        bb = (x - w / 2 - 3, y - 11, x + w / 2 + 3, y + 11)
        for t in taken:
            if bb[0] < t[2] and bb[2] > t[0] and bb[1] < t[3] and bb[3] > t[1]:
                return False
        return True
    items = [(run["id"], [paths[run["id"]]]) for run, _, _ in runs] + [(cid, legs) for cid, legs in cab.items()]
    for rid, legs in items:
        w = 8 + 7 * len(rid)
        segs = []
        for pts in legs:
            for p, q in zip(pts, pts[1:]):
                segs.append((abs(p[0] - q[0]) + abs(p[1] - q[1]), p, q))
        segs.sort(key=lambda s: -s[0])
        spot = None
        for ln, p, q in segs:
            for f in (0.5, 0.35, 0.65, 0.2, 0.8, 0.1, 0.9):
                x, y = p[0] + (q[0] - p[0]) * f, p[1] + (q[1] - p[1]) * f
                if free(x, y, w):
                    spot = (x, y)
                    break
            if spot:
                break
        if not spot:
            ln, p, q = segs[0]
            spot = ((p[0] + q[0]) / 2, (p[1] + q[1]) / 2)
        tags[rid] = spot
        taken.append((spot[0] - w / 2, spot[1] - 9, spot[0] + w / 2, spot[1] + 9))
    return tags


def svg_variant(key, v):
    m, runs, paths, cab = build_variant(key, v)
    tags = place_tags(m, runs, paths, cab)
    o = [f'<svg viewBox="0 0 {W} {H}" class="dia" data-map="{key}" role="img" aria-labelledby="t-{key}" xmlns="http://www.w3.org/2000/svg">']
    o.append(f'<title id="t-{key}">Wiring map: {esc(v["name"])}. Parts are placed as the official schematic places them; tap a wire or a part.</title>')
    o.append('<g class="parts">')
    o.extend(p[3] for p in m.parts)
    o.append('</g><g class="stocks">')
    for (fa, fb, moved, pts) in getattr(m, "routed_links", []):
        o.append(f'<path d="{d_of(pts)}" class="stk{" moved" if moved else ""}" data-part="{fa}"/>')
    o.append('</g><g class="wires">')
    seq = sorted(runs, key=lambda x: {"LV": 0, "LVG": 0, "E": 1, "N": 2, "L": 3, "H": 4}.get(x[0]["sys"], 0))
    for cid, legs in cab.items():
        o.append(f'<g class="run s-S cab" data-run="{cid}" style="--wc:#5CC3C9">')
        for k in ("case", "halo", "wire", "flow", "hit"):
            for pts in legs:
                o.append(f'<path d="{d_of(pts)}" class="{k}"/>')
        o.append('</g>')
    for run, a, b in seq:
        pts = paths[run["id"]]
        col = WIRECOL.get((run.get("color") or "").lower(), "#8C939A")
        opt = " opt" if run.get("opt") else ""
        o.append(f'<g class="run s-{run["sys"]}{opt}" data-run="{esc(run["id"])}" data-a="{esc(m.term[a][3])}" data-b="{esc(m.term[b][3])}" style="--wc:{col}">')
        d = d_of(pts)
        for k in ("case", "halo", "wire", "flow", "hit"):
            o.append(f'<path d="{d}" class="{k}"/>')
        o.append('</g>')
    o.append('</g><g class="tags">')
    allsys = {run["id"]: run["sys"] for run, _, _ in runs}
    for rid, (x, y) in tags.items():
        w = 8 + 7 * len(rid)
        sysc = allsys.get(rid, "S")
        opt = " opt" if any(run["id"] == rid and run.get("opt") for run, _, _ in runs) else ""
        o.append(f'<g class="tag s-{sysc}{opt}" data-run="{esc(rid)}"><rect x="{x - w / 2:g}" y="{y - 8:g}" width="{w}" height="16" rx="4"/>'
                 f'<text x="{x:g}" y="{y + 3.6:g}" text-anchor="middle">{esc(rid)}</text></g>')
    o.append('</g></svg>')
    parts = {p[0]: {"name": p[1], "note": p[2]} for p in m.parts}
    ends = {run["id"]: [m.term[a][3], m.term[b][3]] for run, a, b in runs}
    for cid, legs in cab.items():
        ends[cid] = [m.term[CABLES[cid][1][0][0]][3], "pcb"]
    return "".join(o), parts, ends, paths, m


def main():
    data = json.load(open(os.path.join(HERE, "wiring-data.json")))
    out = {}
    for key, v in data["variants"].items():
        svg, parts, ends, paths, m = svg_variant(key, v)
        out[key] = {"svg": svg, "parts": parts, "ends": ends,
                    "cables": {cid: CABLES[cid][0] for cid in CABLES} if v.get("cables") else {}}
        print(key, len(v["runs"]), "runs drawn", len(svg) // 1024, "KB")
    json.dump(out, open(os.path.join(HERE, "wiring-maps.json"), "w"), ensure_ascii=False, separators=(",", ":"))


if __name__ == "__main__":
    main()
