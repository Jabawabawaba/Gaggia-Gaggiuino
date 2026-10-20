"""Drawings for the Part guides page (part-guides.tpl.html).

Writes part-defs.svg.html (shared gradients and patterns) and one scene per guide: part-tc.svg.html (thermocouple),
part-ptb.svg.html (pressure sensor on the tap block), part-tee.svg.html (pressure sensor on a T-fitting) and
part-fuse.svg.html (resettable fuse). Each moving piece carries data-k, the key part-guides.js animates; data-v and
data-fam pieces show only for one wiring path or one Gaggia family; data-loop pieces run only during the steps that
name them. Run `python3 gen_part_svgs.py` after editing, then build the site. Drawings are illustrations, not to scale.
"""
import os

HERE = os.path.dirname(os.path.abspath(__file__))


def zig(x0, x1, y, h, step=4, horiz=True):
    """thread teeth along a wall: from x0 to x1 at height y, teeth h tall (negative = up)"""
    pts, x, up = [f"M{x0},{y}"], x0, True
    while x + step / 2 <= x1 + 0.01:
        x += step / 2
        pts.append(f"L{x:g},{y + (h if up else 0):g}")
        up = not up
    return "".join(pts)


def zigv(y0, y1, x, w, step=4):
    """the same down a vertical wall"""
    pts, y, out = [f"M{x},{y0}"], y0, True
    while y + step / 2 <= y1 + 0.01:
        y += step / 2
        pts.append(f"L{x + (w if out else 0):g},{y:g}")
        out = not out
    return "".join(pts)


def ticks(x0, x1, y0, y1, step=4):
    """slanted thread lines across a stud lying along x"""
    return "".join(f"M{x:g},{y0}L{x + 2:g},{y1}" for x in range(int(x0) + 2, int(x1) - 1, step))


def ticksv(y0, y1, x0, x1, step=4):
    return "".join(f"M{x0},{y:g}L{x1},{y + 2:g}" for y in range(int(y0) + 2, int(y1) - 1, step))


def spanner(x, y, sc=1.0, slash=False):
    s = (f'<g transform="translate({x} {y}) scale({sc})"><path class="spn" d="M-22,6 L10,-6 A9,9 0 1,1 16,4 L10,0 L6,4 L10,9 '
         f'A9,9 0 0,1 2,6 L-20,14 Z"/>')
    if slash:
        s += '<circle class="nono" cx="-2" cy="4" r="24"/><path class="nono" d="M-19,-13 L15,21"/>'
    return s + "</g>"


def arrow_ellipse(cx, cy, rx, ry, key, rev=False):
    """a flowing arc with an arrowhead around a part being turned"""
    if not rev:
        d = f"M{cx - rx},{cy} A{rx},{ry} 0 1,1 {cx},{cy + ry}"
        head = f"M{cx},{cy + ry} l7,-4 M{cx},{cy + ry} l7,5"
    else:
        d = f"M{cx + rx},{cy} A{rx},{ry} 0 1,0 {cx},{cy + ry}"
        head = f"M{cx},{cy + ry} l-7,-4 M{cx},{cy + ry} l-7,5"
    return f'<g data-loop="{key}" class="turn"><path class="turnarc" d="{d}"/><path class="turnhd" d="{head}"/></g>'


DEFS = """<svg class="pg-defs" width="0" height="0" aria-hidden="true" focusable="false"><defs>
<linearGradient id="pg-alu" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E3E7EA"/><stop offset=".55" stop-color="#C6CCD1"/><stop offset="1" stop-color="#A9B1B8"/></linearGradient>
<linearGradient id="pg-brass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F0CF7A"/><stop offset=".5" stop-color="#D2A443"/><stop offset="1" stop-color="#A97A22"/></linearGradient>
<linearGradient id="pg-copper" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EDB081"/><stop offset=".5" stop-color="#C77A45"/><stop offset="1" stop-color="#94532A"/></linearGradient>
<linearGradient id="pg-steel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EEF1F3"/><stop offset=".5" stop-color="#C3CAD0"/><stop offset="1" stop-color="#959EA6"/></linearGradient>
<linearGradient id="pg-steelh" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9AA3AB"/><stop offset=".35" stop-color="#EEF1F3"/><stop offset="1" stop-color="#A3ACB4"/></linearGradient>
<linearGradient id="pg-hue" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FF3B30"/><stop offset=".2" stop-color="#FFCC00"/><stop offset=".4" stop-color="#34C759"/><stop offset=".6" stop-color="#32ADE6"/><stop offset=".8" stop-color="#5856D6"/><stop offset="1" stop-color="#FF2D55"/></linearGradient>
<pattern id="pg-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="7" stroke="#8D959C" stroke-width="1.2" opacity=".55"/></pattern>
<pattern id="pg-keep" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)"><line x1="0" y1="0" x2="0" y2="8" stroke="#B13A2F" stroke-width="1.4" opacity=".35"/></pattern>
</defs></svg>"""


# ---------------------------------------------------------------- thermocouple
def tc():
    s = ['<svg id="pg-tc" viewBox="0 0 480 300" role="img" aria-labelledby="pg-tc-t"><title id="pg-tc-t">Thermocouple install, drawn step by step: '
         'the brew thermostat comes out of its hole in the boiler wall, the thermocouple goes in with thermal paste, finger tight, '
         'its lead runs around the front of the boiler to the control box, and it clamps into J4.</title>']
    # close-up of the boiler wall
    s.append('<g data-k="close">')
    s.append('<rect class="water" x="0" y="30" width="40" height="240"/><text class="cap" x="20" y="286" text-anchor="middle">water</text>')
    s.append('<rect class="alu" x="40" y="30" width="80" height="240"/><rect class="hatch" x="40" y="30" width="80" height="240"/>')
    s.append('<text class="cap" x="80" y="22" text-anchor="middle">boiler wall</text>')
    s.append('<rect class="hole" x="84" y="138" width="36" height="24"/>')
    s.append(f'<path class="thr" d="{zig(84, 120, 138, -3)}{zig(84, 120, 162, 3)}"/>')
    s.append('<rect data-k="oldpaste" class="paste" x="86" y="140.5" width="34" height="19" rx="2"/>')
    # brew thermostat
    s.append('<g data-k="bt"><rect class="brass" x="84" y="141" width="36" height="18"/>'
             f'<path class="thrl" d="{ticks(84, 120, 141, 159)}"/>'
             '<rect class="brass" x="120" y="116" width="14" height="68" rx="2"/><path class="facet" d="M120,133H134M120,167H134"/>'
             '<rect class="tbody" x="134" y="122" width="60" height="56" rx="8"/><path class="facet" d="M146,122V178"/>'
             '<rect class="tab" x="194" y="130" width="24" height="6" rx="1"/><rect class="tab" x="194" y="164" width="24" height="6" rx="1"/>'
             '<text class="cap" x="170" y="204" text-anchor="middle">brew thermostat</text></g>')
    s.append('<g data-k="ba"><path class="wire-m" d="M232,133 C280,133 300,90 360,80 S440,70 486,70"/>'
             '<rect class="conn" x="206" y="126" width="26" height="14" rx="2"/><text class="lbl" x="252" y="121">Ba</text></g>')
    s.append('<g data-k="bb"><path class="wire-m" d="M232,167 C280,167 300,210 360,220 S440,230 486,230"/>'
             '<rect class="conn" x="206" y="160" width="26" height="14" rx="2"/><text class="lbl" x="252" y="194">Bb</text></g>')
    s.append('<g data-k="j" data-v="SI"><path class="jumper" d="M330,99 H310 V201 H330"/><text class="lbl jl" x="292" y="155">J</text></g>')
    # thermocouple
    s.append('<g data-k="tc"><path class="braid" d="M166,150 C220,150 236,134 286,134 S356,166 406,160 S458,148 486,150"/>'
             '<path class="braid2" d="M166,150 C220,150 236,134 286,134 S356,166 406,160 S458,148 486,150"/>'
             '<rect class="copper" x="84" y="142" width="36" height="16"/>'
             f'<path class="thrl" d="{ticks(84, 120, 142, 158)}"/>'
             '<rect data-k="paste" data-origin="left center" class="paste pasteon" x="84" y="141.5" width="36" height="17" rx="2"/>'
             '<rect class="copper" x="120" y="132" width="12" height="36" rx="2"/><path class="facet" d="M120,144H132M120,156H132"/>'
             '<rect class="copper" x="132" y="138" width="16" height="24" rx="3"/><rect class="steel" x="148" y="142" width="18" height="16" rx="3"/>'
             '<g data-k="syr"><rect class="syr" x="74" y="64" width="20" height="44" rx="3"/><rect class="syrp" x="78" y="54" width="12" height="12" rx="2"/>'
             '<path class="syr" d="M79,108 L89,108 L85.5,135 L82.5,135 Z"/><circle class="paste" cx="84" cy="138" r="3"/></g>'
             + arrow_ellipse(126, 150, 15, 40, "spinF") + '</g>')
    s.append(arrow_ellipse(127, 150, 16, 42, "spinR", rev=True))
    s.append('<g data-k="nosp">' + spanner(212, 64, 0.95, slash=True) + '<text class="cap" x="212" y="104" text-anchor="middle">no spanner</text></g>')
    s.append('</g>')
    # route, top view
    s.append('<g data-k="route"><rect class="chassis" x="60" y="34" width="360" height="236" rx="14"/>'
             '<text class="cap" x="240" y="290" text-anchor="middle">front of the machine</text><text class="cap" x="240" y="26" text-anchor="middle">back</text>'
             '<rect class="keep" x="330" y="166" width="80" height="86" rx="6"/><text class="cap" x="370" y="206" text-anchor="middle">pump</text>'
             '<text class="cap" x="370" y="220" text-anchor="middle">area</text>'
             '<path class="wire-m" d="M96,48 V252"/><text class="cap" x="104" y="60">mains</text>'
             '<rect class="alu" x="170" y="96" width="120" height="114" rx="18"/><text class="lbl onmetal" x="230" y="158" text-anchor="middle">boiler</text>'
             '<rect class="pcb" x="338" y="56" width="70" height="76" rx="6"/><text class="lbl" x="373" y="92" text-anchor="middle">PCB</text>'
             '<text class="cap onpcb" x="373" y="108" text-anchor="middle">J4</text>'
             '<path data-k="rlead" class="tclead draw" pathLength="1" d="M160,132 H134 V238 H312 V102 H338"/>'
             '<rect class="copper" x="158" y="126" width="12" height="12" rx="2"/>'
             '<text class="cap" x="230" y="256" text-anchor="middle">around the front</text></g>')
    # J4 and the two meter checks
    s.append('<g data-k="j4v"><rect class="pcb" x="40" y="56" width="170" height="92" rx="8"/><text class="lbl" x="56" y="78">J4</text>'
             '<rect class="term" x="70" y="88" width="50" height="48" rx="4"/><rect class="term" x="130" y="88" width="50" height="48" rx="4"/>'
             '<g data-k="sc1" data-origin="center"><circle class="screw" cx="95" cy="104" r="10"/><path class="slot" d="M88,104H102"/></g>'
             '<g data-k="sc2" data-origin="center"><circle class="screw" cx="155" cy="104" r="10"/><path class="slot" d="M148,104H162"/></g>'
             '<text class="lbl onpcb" x="95" y="130" text-anchor="middle">−</text><text class="lbl onpcb" x="155" y="130" text-anchor="middle">+</text>'
             '<g data-k="tcw"><path class="tcwire" d="M95,138 V214 C95,236 120,244 125,262 V300"/><path class="tcwire" d="M155,138 V214 C155,236 130,244 125,262 V300"/>'
             '<path class="braid" d="M125,262 V300"/></g>'
             '<g data-k="ma"><rect class="meter" x="240" y="40" width="104" height="128" rx="12"/><rect class="lcd" x="252" y="54" width="80" height="34" rx="4"/>'
             '<text class="lcdt" x="292" y="79" text-anchor="middle">OL</text><circle class="jack" cx="272" cy="146" r="6"/><circle class="jack r" cx="312" cy="146" r="6"/>'
             '<text class="cap" x="292" y="188" text-anchor="middle">either wire</text><text class="cap" x="292" y="202" text-anchor="middle">to the boiler</text></g>'
             '<g data-k="mb"><rect class="meter" x="360" y="40" width="104" height="128" rx="12"/><rect class="lcd" x="372" y="54" width="80" height="34" rx="4"/>'
             '<text class="lcdt" x="412" y="79" text-anchor="middle">3.1 Ω</text><circle class="jack" cx="392" cy="146" r="6"/><circle class="jack r" cx="432" cy="146" r="6"/>'
             '<text class="cap" x="412" y="188" text-anchor="middle">wire to wire</text><text class="cap" x="412" y="202" text-anchor="middle">a few ohms</text></g>'
             '</g>')
    s.append('</svg>')
    return "".join(s)


# ---------------------------------------------------------------- pressure sensor on the tap block
def sensor_asm(caps=True):
    """the transducer in its push-in fitting, port up at (100,34)"""
    s = ['<g data-k="sasm" data-box="view" data-origin="100px 34px">']
    s.append('<rect class="hole" x="95" y="30" width="10" height="48"/>'
             '<rect class="collet" x="88" y="34" width="24" height="10" rx="2"/>'
             '<rect class="brass" x="78" y="44" width="44" height="30" rx="3"/><path class="facet" d="M92,44V74M108,44V74"/>'
             '<rect class="brass" x="80" y="74" width="40" height="38"/>'
             '<rect class="hole" x="89" y="78" width="22" height="34"/>'
             f'<path class="thr" d="{zigv(80, 112, 89, 3)}{zigv(80, 112, 111, -3)}"/>'
             '<rect class="hole" x="95" y="40" width="10" height="38"/>')
    s.append('<g data-k="or1"><rect class="oring-w" x="89.5" y="78" width="6.5" height="6" rx="1.2"/><rect class="oring-w" x="104" y="78" width="6.5" height="6" rx="1.2"/></g>')
    s.append('<g data-loop="pulseR" class="pulse"><circle cx="100" cy="81" r="20"/></g>')
    s.append('<g data-k="sen"><path class="cable" d="M100,212 V236 C100,258 64,262 40,262 H-6"/>'
             '<rect class="steel" x="90" y="84" width="20" height="30"/>'
             f'<path class="thrl" d="{ticksv(84, 114, 90, 110)}"/>'
             '<rect class="oring-g" x="84" y="114" width="32" height="4" rx="2"/>'
             '<rect class="steel" x="76" y="118" width="48" height="18" rx="2"/><path class="facet" d="M90,118V136M110,118V136"/>'
             '<rect class="steel2" x="80" y="136" width="40" height="76" rx="6"/>'
             + arrow_ellipse(100, 127, 34, 9, "spinS") + '</g>')
    s.append('<g data-k="gap"><path class="mark" d="M126,111 h6 M126,119 h6 M129,111 V119"/><text class="cap" x="136" y="118">gap</text></g>')
    s.append('<g data-k="qt">' + spanner(160, 128, 0.7) + '<text class="lbl" x="160" y="162" text-anchor="middle">¼ max</text></g>')
    if caps:
        s.append('<g data-k="lcaps"><text class="cap" x="128" y="56">fitting</text><path class="lead" d="M126,52 L114,52"/>'
                 '<text class="cap" x="6" y="76">flat O-ring</text><path class="lead" d="M70,73 L88,80"/>'
                 '<text class="cap" x="128" y="190">sensor</text><text class="cap" x="128" y="204">1.2 MPa</text></g>')
    s.append('</g>')
    return "".join(s)


def ptb():
    s = ['<svg id="pg-ptb" viewBox="0 0 480 380" role="img" aria-labelledby="pg-ptb-t"><title id="pg-ptb-t">Pressure sensor on the tap block, drawn step by step: '
         'the flat O-ring goes into the sensor fitting and the sensor screws in; the push-in fitting and 40 mm of tube go into the block; '
         'the inlet fitting comes off the group, the block clamps in between with longer screws and both O-rings facing the group, '
         'and the sensor plugs onto the tube.</title>']
    s.append('<g data-k="Lw">' + sensor_asm() + '</g>')
    s.append('<g data-k="R">')
    s.append('<rect class="alu" x="222" y="56" width="30" height="180"/><rect class="hatch" x="222" y="56" width="30" height="180"/>'
             '<rect class="hole" x="222" y="112" width="30" height="16"/><text class="cap" x="237" y="48" text-anchor="middle">group</text>')
    # the tap block assembly (block, its O-ring, push-in fitting, tube)
    s.append('<g data-k="ptb"><rect class="steel" x="252" y="70" width="38" height="80" rx="3"/><rect class="hole" x="252" y="112" width="38" height="16"/>'
             '<rect class="hole" x="265" y="128" width="10" height="22"/>'
             '<g data-k="or2"><rect class="oring-d" x="247" y="102" width="6" height="8" rx="3"/><rect class="oring-d" x="247" y="130" width="6" height="8" rx="3"/></g>'
             '<g data-k="pc6"><rect class="brass" x="266" y="126" width="8" height="24"/>'
             f'<path class="thrl" d="{ticksv(126, 150, 266, 274, 3)}"/>'
             '<rect class="brass" x="257" y="150" width="26" height="20" rx="2"/><path class="facet" d="M265,150V170M275,150V170"/>'
             '<rect class="collet" x="261" y="170" width="18" height="8" rx="2"/>'
             + arrow_ellipse(270, 160, 22, 6, "spinP") + '</g>'
             '<g data-k="tube"><rect class="ptfe" x="265" y="160" width="10" height="70" rx="2"/></g>'
             '<g data-k="dim"><path class="dimln" d="M250,162 V230 M245,162 H255 M245,230 H255"/><text class="lbl" x="242" y="200" text-anchor="end">40 mm</text></g>'
             '</g>')
    # the group's inlet fitting, its O-ring and the hose
    s.append('<g data-k="inl"><path class="hose" d="M362,120 C410,120 424,84 486,74"/><path class="hose2" d="M362,120 C410,120 424,84 486,74"/>'
             '<rect class="brass" x="332" y="114" width="30" height="12"/><path class="facet" d="M340,114V126M348,114V126M356,114V126"/>'
             '<rect class="brass" x="290" y="80" width="42" height="80" rx="3"/><rect class="hole" x="290" y="112" width="42" height="16"/>'
             '<g data-k="or3"><rect class="oring-d" x="286" y="102" width="6" height="8" rx="3"/><rect class="oring-d" x="286" y="130" width="6" height="8" rx="3"/></g>'
             '<text class="cap" x="311" y="176" text-anchor="middle">inlet</text></g>')
    s.append('<g data-k="ss"><rect class="steel" x="228" y="90" width="66" height="6"/><rect class="steel" x="228" y="144" width="66" height="6"/>'
             '<rect class="cap-screw" x="294" y="86" width="10" height="14" rx="2"/><rect class="cap-screw" x="294" y="140" width="10" height="14" rx="2"/></g>')
    s.append('<g data-k="ls"><rect class="steel" x="228" y="90" width="106" height="6"/><rect class="steel" x="228" y="144" width="106" height="6"/>'
             '<rect class="cap-screw" x="334" y="86" width="10" height="14" rx="2"/><rect class="cap-screw" x="334" y="140" width="10" height="14" rx="2"/>'
             '<text class="cap" x="318" y="76">M5 × 25</text></g>')
    s.append('<g data-loop="pulseO" class="pulse"><circle cx="250" cy="120" r="24"/><circle cx="289" cy="120" r="24"/></g>')
    s.append('<g data-k="drip" data-loop="drip" class="drips"><path class="drop" d="M246,140 q4,7 0,10 q-4,-3 0,-10"/><path class="drop d2" d="M240,140 q4,7 0,10 q-4,-3 0,-10"/></g>')
    s.append('<g data-k="water"><rect class="wfill" x="222" y="114" width="110" height="12"/><rect class="wfill" x="267" y="128" width="6" height="100"/></g>')
    s.append('</g>')
    # magnifier for the thread check
    s.append('<g data-k="mag"><clipPath id="pg-magc"><circle cx="330" cy="282" r="46"/></clipPath>'
             '<g clip-path="url(#pg-magc)"><rect class="steel" x="284" y="236" width="92" height="92"/><rect class="hole" x="284" y="262" width="92" height="18"/>'
             '<rect class="hole" x="318" y="280" width="24" height="48"/><rect class="brass" x="320" y="275" width="20" height="53"/>'
             f'<path class="thrl" d="{ticksv(276, 328, 320, 340, 5)}"/></g>'
             '<circle class="magring" cx="330" cy="282" r="46"/><path class="dimln acc" d="M352,275 V281 M348,275 H356 M348,281 H356"/>'
             '<text class="lbl" x="382" y="282">&lt; 1 mm</text><text class="cap" x="330" y="346" text-anchor="middle">thread into the bore</text></g>')
    s.append('<g data-k="gauge"><rect class="meter" x="384" y="300" width="88" height="54" rx="10"/><rect class="lcd" x="392" y="308" width="72" height="28" rx="4"/>'
             '<text class="lcdt" data-k="pval" x="428" y="328" text-anchor="middle">0 bar</text><text class="cap" x="428" y="372" text-anchor="middle">blank basket</text></g>')
    s.append('</svg>')
    return "".join(s)


# ---------------------------------------------------------------- pressure sensor on a T-fitting
def tee():
    s = ['<svg id="pg-tee" viewBox="0 0 480 340" role="img" aria-labelledby="pg-tee-t"><title id="pg-tee-t">Pressure sensor on a T-fitting, drawn step by step: '
         'the line from the pump to the boiler is cut, a T goes in, a branch runs down to the sensor, which sits low in the machine, and the branch is filled with water.</title>']
    s.append('<rect class="alu" x="170" y="14" width="140" height="40" rx="8"/><text class="lbl onmetal" x="240" y="39" text-anchor="middle">boiler</text>'
             '<rect class="brass" x="230" y="54" width="20" height="14"/>'
             '<rect class="pumpb" x="30" y="262" width="120" height="56" rx="10"/><text class="lbl" x="90" y="295" text-anchor="middle">pump</text>'
             '<rect class="brass" x="150" y="282" width="14" height="12"/>')
    for fam, cls in (("GCP", "hoseB"), ("GC", "ptfeL")):
        s.append(f'<g data-fam="{fam}"><g data-k="hu{fam}"><path class="{cls}" d="M240,68 V150"/></g>'
                 f'<g data-k="hl{fam}"><path class="{cls}" d="M240,150 V250 C240,288 204,288 164,288"/></g></g>')
    s.append('<g data-k="dim"><g data-fam="GCP"><path class="dimln" d="M266,68 V140 M261,68 H271 M261,140 H271"/><text class="lbl" x="274" y="108">≈ 65 mm</text></g>'
             '<g data-fam="GC"><text class="cap" x="262" y="104">near the boiler,</text><text class="cap" x="262" y="118">T upright</text></g></g>')
    s.append('<g data-k="cut"><path class="cutln" d="M222,150 H258"/><path class="mark" d="M200,142 l10,8 l-10,8 M214,142 l-4,8 l4,8"/></g>')
    s.append('<g data-k="tee"><g data-fam="GCP"><rect class="brass" x="233" y="132" width="14" height="36" rx="2"/><rect class="brass" x="247" y="143" width="26" height="14" rx="2"/>'
             '<path class="facet" d="M233,138H247M233,162H247M263,143V157"/></g>'
             '<g data-fam="GC"><rect class="pushT" x="230" y="134" width="20" height="32" rx="3"/><rect class="pushT" x="250" y="141" width="26" height="18" rx="3"/>'
             '<rect class="collet" x="232" y="130" width="16" height="5" rx="1"/><rect class="collet" x="232" y="165" width="16" height="5" rx="1"/><rect class="collet" x="275" y="142" width="5" height="16" rx="1"/></g></g>')
    s.append('<g data-k="cl1" data-fam="GCP"><rect class="clamp" x="232" y="134" width="16" height="6" rx="2"/><rect class="clamp" x="232" y="160" width="16" height="6" rx="2"/></g>')
    s.append('<g data-fam="GCP"><path data-k="brGCP" class="hoseB draw" pathLength="1" d="M273,150 H322 C356,150 366,176 366,206 V232"/></g>'
             '<g data-fam="GC"><path data-k="brGC" class="ptfeL draw" pathLength="1" d="M278,150 H322 C356,150 366,176 366,206 V232"/></g>')
    s.append('<path data-k="brw" class="waterln draw" pathLength="1" d="M276,150 H322 C356,150 366,176 366,206 V232"/>')
    s.append('<g data-k="cl2" data-fam="GCP"><rect class="clamp" x="280" y="142" width="6" height="16" rx="2"/><rect class="clamp" x="358" y="222" width="16" height="6" rx="2"/></g>')
    s.append('<g data-k="tsen"><rect class="brass" x="356" y="230" width="20" height="18" rx="2"/><rect class="steel" x="352" y="248" width="28" height="10" rx="2"/>'
             '<rect class="steel2" x="354" y="258" width="24" height="48" rx="5"/><path class="cable" d="M366,306 V332"/>'
             '<text class="cap" x="392" y="276">sensor</text><text class="cap" x="392" y="290">below the T</text></g>')
    s.append('<g data-k="foam"><rect class="foam" x="346" y="244" width="40" height="68" rx="10"/><text class="cap" x="340" y="326" text-anchor="end">foam if it reads noisy</text></g>')
    s.append('<g data-loop="bub" class="bubs"><circle cx="366" cy="226" r="3"/><circle class="b2" cx="366" cy="226" r="2.4"/><circle class="b3" cx="366" cy="226" r="2"/></g>')
    s.append('</svg>')
    return "".join(s)


# ---------------------------------------------------------------- resettable fuse
def fuse():
    s = ['<svg id="pg-fuse" viewBox="0 0 480 300" role="img" aria-labelledby="pg-fuse-t"><title id="pg-fuse-t">Resettable fuse install, drawn step by step on the top of the boiler: '
         'the steam thermostat comes out of its hole, the resettable fuse screws in with paste, and the wires that fed the stock one-shot fuse move onto its two spades.</title>']
    s.append('<rect class="alu" x="24" y="24" width="252" height="252" rx="28"/><circle class="ring" cx="150" cy="150" r="112"/>'
             '<text class="cap" x="24" y="16">boiler, top</text>')
    for x, y in ((95, 78), (205, 78), (95, 222), (205, 222)):
        s.append(f'<circle class="pin" cx="{x}" cy="{y}" r="9"/><circle class="pinc" cx="{x}" cy="{y}" r="3"/>')
    s.append('<circle class="hole" cx="232" cy="176" r="10"/><circle class="thrc" cx="232" cy="176" r="7"/>')
    # wires that fed the stock fuse
    s.append('<g data-k="ow"><path class="wire-m" d="M92,120 H40 C28,120 20,110 10,102"/><path class="wire-m" d="M208,120 H226 C242,120 248,104 248,60 V8"/></g>')
    s.append('<g data-k="of"><path class="wire-m" d="M96,120 H92 M204,120 H208"/><rect class="sleeve" x="96" y="114" width="20" height="12" rx="2"/>'
             '<rect class="sleeve" x="184" y="114" width="20" height="12" rx="2"/><path class="lead2" d="M116,120 H126 M174,120 H184"/>'
             '<rect class="ceramic2" x="126" y="110" width="48" height="20" rx="10"/><text class="tiny" x="150" y="124" text-anchor="middle">184 °C</text>'
             '<text class="cap onmetal" x="150" y="104" text-anchor="middle">stock one-shot fuse</text></g>')
    s.append('<g data-k="snip"><path class="mark" d="M86,106 l12,12 M98,106 l-12,12 M202,106 l12,12 M214,106 l-12,12"/></g>')
    # steam thermostat and its leads
    s.append('<g data-k="stl"><path class="wire-m" d="M225.5,188 C225,228 196,250 186,302"/><path class="wire-m" d="M238.5,188 C239,228 266,250 278,302"/>'
             '<g data-v="SI"><text class="lbl" x="160" y="280">Sa</text><text class="lbl" x="284" y="280">Sb</text></g></g>')
    s.append('<g data-k="st" data-origin="center"><circle class="tbody" cx="232" cy="176" r="26"/><circle class="tcap" cx="232" cy="176" r="17"/>'
             '<rect class="tab" x="224" y="164" width="3" height="24"/><rect class="tab" x="237" y="164" width="3" height="24"/>'
             '<text class="cap onmetal" x="150" y="252" text-anchor="middle">steam thermostat</text></g>')
    s.append(arrow_ellipse(232, 176, 36, 36, "spinR", rev=True))
    # the new fuse, top view
    s.append('<g data-k="nf" data-origin="center"><circle class="steelc" cx="232" cy="176" r="25"/><circle class="ceramic" cx="232" cy="176" r="21"/>'
             '<rect class="tab" x="221" y="163" width="3" height="26"/><rect class="tab" x="239" y="163" width="3" height="26"/>'
             '<circle class="rbtn" cx="232" cy="176" r="5"/></g>')
    s.append(arrow_ellipse(232, 176, 36, 36, "spinF"))
    # stock wiring: the same wires, rerouted onto its spades
    s.append('<g data-v="SI"><path data-k="nw1" class="wire-m draw" pathLength="1" d="M92,120 C128,120 160,140 180,160 C196,178 212,196 222.5,192"/>'
             '<path data-k="nw2" class="wire-m draw" pathLength="1" d="M208,120 C232,124 246,140 240.5,162"/>'
             '<g data-k="sp1"><rect class="sleeveS" x="216" y="178" width="13" height="20" rx="4"/><rect class="spade" x="219" y="182" width="7" height="12" rx="1"/></g>'
             '<g data-k="sp2"><rect class="sleeveS" x="234" y="154" width="13" height="20" rx="4"/><rect class="spade" x="237" y="158" width="7" height="12" rx="1"/></g>'
             '<g data-k="xt"><text class="cap onmetal" x="40" y="246">extend with</text><text class="cap onmetal" x="40" y="260">18 AWG if short</text></g></g>')
    # custom wiring: the harness runs that went to the stock fuse
    s.append('<g data-v="CW"><path data-k="cw1" class="wire-m draw" pathLength="1" d="M110,302 C120,250 190,222 222.5,192"/>'
             '<path data-k="cw2" class="wire-m draw" pathLength="1" d="M300,150 C272,150 250,150 240.5,162"/>'
             '<g data-k="cwl"><g data-fam="GCP"><g data-volts="120"><text class="lbl" x="120" y="296">AC18</text><text class="lbl" x="282" y="140">AC17</text></g><g data-volts="230"><text class="lbl" x="120" y="296">AC17</text><text class="lbl" x="282" y="140">AC16</text></g></g>'
             '<g data-fam="GC"><text class="lbl" x="120" y="296">AC8 (AC9)</text><text class="lbl" x="280" y="140">AC6, AC7</text></g></g>'
             '<g data-k="spc"><rect class="sleeveS" x="216" y="178" width="13" height="20" rx="4"/><rect class="spade" x="219" y="182" width="7" height="12" rx="1"/>'
             '<rect class="sleeveS" x="234" y="154" width="13" height="20" rx="4"/><rect class="spade" x="237" y="158" width="7" height="12" rx="1"/></g></g>')
    # side view of the fuse
    s.append('<g class="side"><text class="cap" x="385" y="40" text-anchor="middle">side view</text>'
             '<rect class="tab" x="356" y="56" width="6" height="34" rx="1"/><rect class="tab" x="408" y="56" width="6" height="34" rx="1"/>'
             '<g data-k="rb" data-run="press"><rect class="rbtn" x="377" y="74" width="16" height="16" rx="3"/></g>'
             '<rect class="ceramic" x="338" y="88" width="94" height="54" rx="10"/><text class="tiny" x="385" y="112" text-anchor="middle">185 °C</text>'
             '<text class="tiny" x="385" y="126" text-anchor="middle">250 V 16 A</text>'
             '<rect class="steel" x="332" y="142" width="106" height="14" rx="3"/>'
             '<rect class="steel" x="378" y="156" width="14" height="36"/>'
             f'<path class="thrl" d="{ticksv(156, 192, 378, 392)}"/>'
             '<g data-k="fpaste" data-origin="center top"><rect class="paste pasteon" x="376" y="155" width="18" height="38" rx="2"/><rect class="paste pasteon" x="334" y="154" width="102" height="3" rx="1"/></g>'
             '<text class="cap" x="440" y="80">reset</text><path class="lead" d="M438,77 L396,80"/><text class="cap" x="402" y="190">M4</text></g>')
    s.append('<g data-k="fm"><rect class="meter" x="330" y="216" width="110" height="62" rx="10"/><rect class="lcd" x="340" y="226" width="90" height="30" rx="4"/>'
             '<text class="lcdt" x="385" y="248" text-anchor="middle">0.2 Ω</text><text class="cap" x="385" y="292" text-anchor="middle">across its spades</text></g>')
    s.append('</svg>')
    return "".join(s)



# ---------------------------------------------------------------- making the wires
def copper(x0, x1, y, h=8):
    """bare stranded copper, centred on y"""
    t = y - h / 2
    lines = "".join(f"M{x0},{t + k:g}H{x1}" for k in (h * .25, h * .5, h * .75))
    return f'<rect class="cu" x="{x0}" y="{t}" width="{x1 - x0}" height="{h}" rx="2"/><path class="strand" d="{lines}"/>'


def jaws(key, x0, x1, y, gap, die=None, hump=False, label=None):
    """a crimper's two jaws closing on y; die is a colour dot on the top jaw"""
    mid = (x0 + x1) / 2
    if hump:
        top = f"M{x0},{y - 80} H{x1} V{y - gap} Q{mid + (x1 - mid) / 2},{y - gap + 8} {mid},{y - gap} Q{mid - (mid - x0) / 2},{y - gap + 8} {x0},{y - gap} Z"
    else:
        top = f"M{x0},{y - 80} H{x1} V{y - gap} Q{mid},{y - gap + 7} {x0},{y - gap} Z"
    bot = f"M{x0},{y + 80} H{x1} V{y + gap} Q{mid},{y + gap - 7} {x0},{y + gap} Z"
    s = f'<g data-k="{key}T"><path class="jaw" d="{top}"/>'
    if die:
        s += f'<circle class="die-{die}" cx="{mid}" cy="{y - 64}" r="5"/>'
    if label:
        s += f'<text class="cap" x="{mid}" y="{y - 88}" text-anchor="middle">{label}</text>'
    return s + f'</g><g data-k="{key}B"><path class="jaw" d="{bot}"/></g>'


def heat(key, xs, y):
    return f'<g data-loop="{key}" class="heatw">' + "".join(f'<path d="M{x},{y} q6,-8 0,-16 q-6,-8 0,-16"/>' for x in xs) + '</g>'


def wires():
    s = ['<svg id="pg-wire" viewBox="0 30 480 220" role="img" aria-labelledby="pg-wire-t"><title id="pg-wire-t">Making the wires, drawn step by step: '
         'cut and label, strip 6 mm, crimp insulated spades and forks, crimp bare spades for the boiler under silicone, two wires or a thin one, '
         'the piggyback spade on the pump, a butt splice, and the pull test.</title>']
    # 1 cut and label
    s.append('<g data-k="wv1"><rect class="ins-r" x="20" y="134" width="282" height="12" rx="5"/>'
             '<g data-k="waste"><rect class="ins-r" x="300" y="134" width="70" height="12" rx="5"/></g>'
             '<g data-k="cutT"><path class="blade" d="M286,40 L314,40 L304,138 L298,138 Z"/></g><g data-k="cutB"><path class="blade" d="M286,240 L314,240 L304,142 L298,142 Z"/></g>'
             '<g data-k="flag"><rect class="flagw" x="62" y="96" width="46" height="30" rx="3"/><text class="lbl onmetal" x="85" y="117" text-anchor="middle">J</text>'
             '<rect class="flagw" x="78" y="126" width="14" height="26" rx="2"/></g>'
             '<g data-k="wd1"><path class="dimln" d="M20,176 V188 M300,176 V188 M20,182 H300"/><text class="cap" x="160" y="204" text-anchor="middle">length from the cut list</text></g></g>')
    # 2 strip
    s.append('<g data-k="wv2">' + copper(262, 300, 140) + '<rect class="ins-r" x="20" y="134" width="244" height="12" rx="3"/>'
             '<g data-k="slug"><rect class="ins-r" x="262" y="134" width="38" height="12" rx="3"/></g>'
             '<g data-k="sjT"><path class="jaw" d="M255,50 H269 V128 L264,133 H260 L255,128 Z"/></g><g data-k="sjB"><path class="jaw" d="M255,230 H269 V152 L264,147 H260 L255,152 Z"/></g>'
             '<g data-k="wd2"><path class="dimln" d="M262,108 V118 M300,108 V118 M262,113 H300"/><text class="lbl" x="281" y="102" text-anchor="middle">6 mm</text></g></g>')
    # 3 insulated spade
    s.append('<g data-k="wv3"><rect class="ins-r" x="20" y="134" width="216" height="12" rx="3"/>' + copper(234, 264, 140) +
             '<g data-k="isp"><rect class="metal" x="266" y="132" width="46" height="16" rx="2"/><path class="facet" d="M266,136 H312 M266,144 H312"/>'
             '<path class="isl" d="M228,130.5 H262 L268,134 V146 L262,149.5 H228 Z"/><rect data-k="dimp" class="dimple" x="240" y="130.5" width="14" height="19" rx="3"/></g>'
             + jaws("cj", 234, 260, 140, 12, die="r", label="red die") +
             '<text class="cap" x="380" y="120">nylon spade:</text><text class="cap" x="380" y="134">105 °C max</text></g>')
    # 4 bare spade for the boiler
    s.append('<g data-k="wv4"><rect class="ins-r" x="20" y="134" width="218" height="12" rx="3"/>' + copper(236, 264, 140) +
             '<g data-k="slv"><rect class="slv" x="110" y="129" width="72" height="22" rx="7"/></g>'
             '<g data-k="bsp"><rect class="metal" x="266" y="133" width="42" height="14" rx="2"/><rect class="metal" x="222" y="146" width="46" height="4"/>'
             '<g data-k="wo"><path class="wing" d="M246,148 V122 M262,148 V122 M226,148 V116 M240,148 V116"/></g>'
             '<g data-k="wc"><rect class="metal" x="244" y="133" width="22" height="14" rx="5"/><rect class="metal" x="222" y="131" width="20" height="18" rx="6"/></g>'
             '<g data-k="wcap"><text class="cap" x="254" y="198" text-anchor="middle">copper</text><text class="cap" x="230" y="212" text-anchor="middle">insulation</text></g></g>'
             + jaws("oj", 220, 268, 140, 13, hump=True, label="open-barrel die") +
             '<g data-k="hgun"><path class="gun" d="M352,44 H446 V72 H384 L374,100 H356 Z"/>' + heat("heat", (266, 284, 302), 118) + '</g></g>')
    # 5 two wires, or a thin one
    s.append('<g data-k="wv5"><rect class="ins-r" x="20" y="92" width="120" height="11" rx="3"/><rect class="ins-k" x="20" y="108" width="120" height="11" rx="3"/>'
             + copper(138, 160, 105.5, 14) +
             '<g data-k="tsp"><rect class="metal" x="186" y="96" width="46" height="19" rx="2"/><path class="isl-b" d="M132,93 H180 L188,97 V114 L180,118 H132 Z"/></g>'
             '<text class="cap" x="160" y="74" text-anchor="middle">two 18 AWG wires: blue spade</text>'
             '<rect class="ins-p" x="250" y="186" width="112" height="7" rx="3"/>' + copper(360, 390, 189.5, 5) +
             '<g data-k="fold" data-box="view" data-origin="390px 189.5px">' + copper(390, 420, 189.5, 5) + '</g>'
             '<g data-k="fk"><rect class="metal" x="392" y="181" width="40" height="17" rx="2"/><rect class="hole" x="414" y="186" width="20" height="7" rx="3"/>'
             '<path class="isl" d="M350,182 H386 L392,185 V194 L386,197 H350 Z"/></g>'
             '<text class="cap" x="330" y="230" text-anchor="middle">22 AWG: strip 4× as much, fold it back</text></g>')
    # 6 piggyback on the pump
    s.append('<g data-k="wv6"><rect class="pumpb" x="302" y="70" width="168" height="150" rx="12"/><text class="lbl" x="386" y="150" text-anchor="middle" fill="#E7E9EB">pump</text>'
             '<rect class="metal" x="272" y="136" width="30" height="8"/>'
             '<g data-k="pgy"><path class="wire-w" d="M222,140 H10"/><text class="lbl" x="30" y="128">N</text>'
             '<rect class="metal" x="220" y="135" width="20" height="10" rx="2"/><rect class="metal" x="238" y="132" width="36" height="16" rx="2"/>'
             '<rect class="metal" x="250" y="102" width="8" height="30"/></g>'
             '<g data-k="pa"><path class="wire-m" d="M254,96 C254,72 200,64 120,64 H10"/><text class="lbl" x="30" y="56">Pa</text>'
             '<rect class="metal" x="244" y="96" width="20" height="24" rx="2"/></g></g>')
    # 7 butt splice
    s.append('<g data-k="wv7"><g data-k="bl"><rect class="ins-r" x="10" y="134" width="188" height="12" rx="3"/>' + copper(196, 236, 140) + '</g>'
             '<g data-k="br"><rect class="ins-r" x="282" y="134" width="188" height="12" rx="3"/>' + copper(244, 284, 140) + '</g>'
             '<rect class="metal" x="192" y="132" width="96" height="16" rx="3"/><path class="facet" d="M240,132 V148"/>'
             '<rect data-k="bd1" class="dimple" x="208" y="131" width="16" height="18" rx="3"/><rect data-k="bd2" class="dimple" x="256" y="131" width="16" height="18" rx="3"/>'
             '<text class="cap" x="240" y="196" text-anchor="middle">bare BN1.25</text>'
             '<g data-k="hs"><rect class="slv" x="70" y="128" width="112" height="24" rx="7"/></g>'
             + jaws("bj", 204, 228, 140, 12) + '<g data-k="hg2">' + heat("heat2", (214, 240, 266), 116) + '</g></g>')
    # 8 pull test
    s.append('<g data-k="wv8"><g data-loop="jig" class="jig"><rect class="ins-r" x="40" y="134" width="196" height="12" rx="3"/>'
             '<rect class="metal" x="266" y="132" width="46" height="16" rx="2"/><path class="isl" d="M228,130.5 H262 L268,134 V146 L262,149.5 H228 Z"/>'
             '<rect class="dimple" x="240" y="130.5" width="14" height="19" rx="3"/></g>'
             '<g data-loop="tug" class="tug"><path d="M30,140 H-2 M8,130 L-2,140 L8,150"/><path d="M322,140 H360 M350,130 L360,140 L350,150"/></g>'
             '<g data-k="okm"><circle class="okc" cx="420" cy="80" r="22"/><path class="okt" d="M409,80 l8,8 l14,-16"/></g>'
             '<text class="cap" x="176" y="196" text-anchor="middle">a gentle pull: nothing moves</text></g>')
    s.append('</svg>')
    return "".join(s)


# ---------------------------------------------------------------- SSR
def ssr_top(x, y):
    """the SSR seen from above, control screws at the top, load screws at the bottom"""
    return (f'<rect class="ssrb" x="{x}" y="{y}" width="200" height="200" rx="8"/>'
            f'<text class="ssrt" x="{x + 100}" y="{y + 104}" text-anchor="middle">SSR-40DA</text>'
            f'<text class="ssrs" x="{x + 100}" y="{y + 70}" text-anchor="middle">DC control</text><text class="ssrs" x="{x + 100}" y="{y + 138}" text-anchor="middle">AC load</text>')


def screw(key, cx, cy, r):
    return (f'<rect class="plate" x="{cx - r - 5}" y="{cy - r - 5}" width="{2 * r + 10}" height="{2 * r + 10}" rx="3"/>'
            f'<g data-k="{key}" data-origin="center"><circle class="screw" cx="{cx}" cy="{cy}" r="{r}"/><path class="slot" d="M{cx - r + 3},{cy}H{cx + r - 3}M{cx},{cy - r + 3}V{cy + r - 3}"/></g>')


def fork(cx, cy, up=True, cls="isl", two=False):
    """an insulated fork terminal around a screw at (cx,cy); its wire leaves downward (up=False: upward)"""
    d = 1 if up else -1
    tip = cy
    s = (f'<path class="metal" d="M{cx - 11},{tip - 4 * d} V{tip + 18 * d} H{cx + 11} V{tip - 4 * d} H{cx + 5} V{tip + 6 * d} H{cx - 5} V{tip - 4 * d} Z"/>')
    y0 = tip + 18 * d
    s += f'<rect class="{"isl-b" if two else cls}" x="{cx - 8}" y="{min(y0, y0 + 24 * d)}" width="16" height="24" rx="4"/>'
    return s


def ssr():
    s = ['<svg id="pg-ssr" viewBox="0 0 480 300" role="img" aria-labelledby="pg-ssr-t"><title id="pg-ssr-t">SSR install, drawn step by step: '
         'its place on the back wall below the funnel piece, the screw, washer and nut through a vent slot, forks on the load and control screws, and the cover closed.</title>']
    # 1 where it goes
    s.append('<g data-k="sv1"><rect class="wallp" x="30" y="16" width="420" height="268" rx="6"/><text class="cap onmetal" x="44" y="274">back wall, from inside</text>')
    for row in range(5):
        for col in range(7):
            s.append(f'<rect class="vent" x="{150 + col * 40}" y="{126 + row * 26}" width="26" height="9" rx="4"/>')
    s.append('<path class="funnel" d="M150,16 H330 L310,74 H170 Z"/><text class="lbl onmetal" x="240" y="48" text-anchor="middle">funnel piece</text>'
             '<circle class="screw" cx="240" cy="94" r="7"/><path class="slot" d="M235,94 H245"/>'
             '<rect class="pumpb" x="330" y="216" width="112" height="68" rx="8"/><text class="lbl" x="386" y="256" text-anchor="middle" fill="#E7E9EB">pump</text>'
             '<g data-k="ssr1"><rect class="ssrb" x="196" y="134" width="88" height="74" rx="5"/><text class="ssrs" x="240" y="176" text-anchor="middle">SSR</text></g>'
             '<g data-k="clr"><path class="dimln acc" d="M262,104 V132 M256,104 H268 M256,132 H268"/><text class="cap onmetal" x="274" y="100">room for the</text>'
             '<text class="cap onmetal" x="274" y="114">funnel\'s screw</text></g></g>')
    # 2 screw through a vent slot, in section
    s.append('<g data-k="sv2"><text class="cap" x="150" y="34" text-anchor="middle">inside</text><text class="cap" x="350" y="34" text-anchor="middle">outside</text>'
             '<rect class="wallp" x="250" y="44" width="12" height="104"/><rect class="wallp" x="250" y="172" width="12" height="104"/>'
             '<rect class="hatch" x="250" y="44" width="12" height="104"/><rect class="hatch" x="250" y="172" width="12" height="104"/>'
             '<rect class="ssrb" x="130" y="96" width="108" height="128" rx="6"/><rect class="metal" x="238" y="92" width="12" height="136" rx="2"/>'
             '<text class="ssrs" x="184" y="166" text-anchor="middle">SSR</text>'
             '<g data-k="scw"><rect class="steel" x="226" y="155" width="70" height="10"/><rect class="cap-screw" x="214" y="148" width="12" height="24" rx="3"/></g>'
             '<g data-k="wsh"><rect class="steel" x="262" y="146" width="5" height="28" rx="1"/></g>'
             '<g data-k="nut"><rect class="steel" x="267" y="149" width="14" height="22" rx="2"/><path class="facet" d="M267,156 H281 M267,164 H281"/></g>'
             + arrow_ellipse(274, 160, 12, 22, "nutspin") +
             '<text class="lbl" x="150" y="250" text-anchor="middle">M4 or 8-32</text><text class="cap" x="150" y="266" text-anchor="middle">through a vent slot</text></g>')
    # 3-5 the SSR from above
    s.append('<g data-k="sv3">' + ssr_top(140, 50) +
             '<circle data-k="led" data-run="blink" class="led" cx="240" cy="98" r="5"/>' + screw("sc1", 190, 90, 10) + screw("sc2", 290, 90, 10) + screw("sl1", 190, 210, 13) + screw("sl2", 290, 210, 13) +
             '<text class="lbl onssr" x="168" y="94" text-anchor="end">+</text><text class="lbl onssr" x="312" y="94">−</text>')
    # load side, stock wiring
    s.append('<g data-v="SI"><g data-k="lw1">' + fork(190, 210) + '<path class="wire-m" d="M190,252 V300"/><text class="lbl" x="172" y="290" text-anchor="end">Sa</text></g>'
             '<g data-k="lw2">' + fork(290, 210) + '<path class="wire-m" d="M290,252 V300"/><text class="lbl" x="308" y="290">Sb</text></g></g>')
    # load side, custom wiring: one run on the fuse side, two on the line side in one fork
    s.append('<g data-v="CW"><g data-k="lw1">' + fork(190, 210) + '<path class="wire-m" d="M190,252 V300"/>'
             '<g data-fam="GCP"><text class="lbl" x="172" y="290" text-anchor="end">AC11</text></g><g data-fam="GC"><text class="lbl" x="172" y="290" text-anchor="end">AC6</text></g></g>'
             '<g data-k="lw2">' + fork(290, 210, two=True) + '<path class="wire-m" d="M286,252 V300 M294,252 V300"/>'
             '<g data-fam="GCP"><text class="lbl" x="308" y="290">AC2 + AC4</text></g><g data-fam="GC"><text class="lbl" x="308" y="290">AC2 + AC3</text></g></g></g>')
    # control side
    s.append('<g data-k="cwp">' + fork(190, 90, up=False, cls="isl") + '<path class="lvw" d="M190,48 V0"/><text class="lbl" x="172" y="18" text-anchor="end">J9 R1</text></g>'
             '<g data-k="cwm">' + fork(290, 90, up=False, cls="isl") + '<path class="lvg" d="M290,48 V0"/><text class="lbl" x="308" y="18">J9 GND</text></g>')
    s.append('<g data-k="cov"><rect class="cover" x="134" y="44" width="212" height="212" rx="10"/></g></g>')
    s.append('</svg>')
    return "".join(s)


# ---------------------------------------------------------------- switches, stock wiring
def spade_tab(x, y, n, faded=False, lab="l"):
    t = f'<rect class="tab{" fadedtab" if faded else ""}" x="{x - 11}" y="{y - 5}" width="22" height="10" rx="1"/>'
    tx = x - 18 if lab == "l" else x + 18
    return t + f'<text class="cap onmetal" x="{tx}" y="{y + 4}" text-anchor="{"end" if lab == "l" else "start"}">{n}</text>'


def conn(key, x, y, wire_d, label=None, lx=0, ly=0, cls="wire-m", sleeve=False):
    s = f'<g data-k="{key}"><path class="{cls}" d="{wire_d}"/><rect class="conn" x="{x - 14}" y="{y - 8}" width="28" height="16" rx="3"/>'
    if sleeve:
        s += f'<rect data-k="{key}s" class="slv" x="{x - 18}" y="{y - 12}" width="36" height="24" rx="7"/>'
    if label:
        s += f'<g class="tagg" data-k="{key}t"><rect class="tagb" x="{x + lx - 15}" y="{y + ly - 10}" width="30" height="16" rx="3"/><text class="tagt" x="{x + lx}" y="{y + ly + 2}" text-anchor="middle">{label}</text></g>'
    return s + "</g>"


def lvwire(key, d, cls, end, cap=None, capxy=None):
    """a low-voltage wire drawn in, ending in a small female spade at end=(x,y)"""
    x, y = end
    s = f'<g data-k="{key}"><path class="{cls}" d="{d}"/><rect class="conn lvc" x="{x - 12}" y="{y - 7}" width="24" height="14" rx="3"/>'
    if cap:
        s += f'<text class="lbl" x="{capxy[0]}" y="{capxy[1]}">{cap}</text>'
    return s + "</g>"


def meters(prefix, a, b):
    """two meter readouts for the switch checks"""
    s = f'<g data-k="{prefix}"><rect class="wallbg" x="0" y="0" width="480" height="300"/>'
    for i, (val, l1, l2) in enumerate((a, b)):
        x = 90 + i * 190
        s += (f'<rect class="meter" x="{x}" y="60" width="110" height="140" rx="12"/><rect class="lcd" x="{x + 12}" y="74" width="86" height="36" rx="4"/>'
              f'<text class="lcdt" x="{x + 55}" y="100" text-anchor="middle">{val}</text><circle class="jack" cx="{x + 34}" cy="176" r="6"/><circle class="jack r" cx="{x + 76}" cy="176" r="6"/>'
              f'<text class="cap" x="{x + 55}" y="222" text-anchor="middle">{l1}</text><text class="cap" x="{x + 55}" y="236" text-anchor="middle">{l2}</text>')
    return s + '<text class="cap" x="240" y="270" text-anchor="middle">unplugged, J7 plug off, probes on its pins</text></g>'


def switches_gcp():
    s = ['<svg id="pg-swp" viewBox="0 0 480 300" role="img" aria-labelledby="pg-swp-t"><title id="pg-swp-t">Classic Pro family switches on stock wiring, seen from the back, drawn step by step: '
         'B4 moves onto wire L, S4 moves to steam spade 1, S5 is insulated and parked, and the low-voltage wires go on brew spades 1 and 2 and steam spades 4 and 5.</title>']
    # Evo and E24: the combined connector block
    s.append('<g data-k="blk"><rect class="blkh" x="120" y="96" width="240" height="56" rx="6"/><text class="cap" x="240" y="40" text-anchor="middle">combined connector block</text>')
    for i in range(4):
        x = 150 + i * 60
        s.append(f'<g data-k="bc{i}"><path class="wire-m" d="M{x},152 V300"/><rect class="conn" x="{x - 12}" y="104" width="24" height="40" rx="3"/>'
                 f'<g data-k="bs{i}"><rect class="slv" x="{x - 15}" y="100" width="30" height="64" rx="7"/></g></g>')
    s.append('<text class="cap" x="240" y="60" text-anchor="middle">each one out the back, taped and labeled</text></g>')
    s.append('<g data-k="swv"><text class="cap" x="8" y="292">seen from the back</text>'
             '<rect class="swbody" x="40" y="58" width="160" height="176" rx="10"/><text class="lbl" x="120" y="256" text-anchor="middle">Steam switch</text>'
             '<rect class="swbody" x="280" y="58" width="160" height="176" rx="10"/><text class="lbl" x="360" y="256" text-anchor="middle">Brew switch</text>')
    sp = {}
    for nm, x0 in (("s", 80), ("b", 320)):
        for k, (dx, dy) in enumerate(((0, 95), (0, 145), (0, 195), (80, 95), (80, 145), (80, 195))):
            sp[nm + str(k + 1)] = (x0 + dx, dy)
    for key, (x, y) in sp.items():
        n = key[1:]
        used = key in ("s1", "s2", "s3", "s4", "s5", "b1", "b2", "b4", "b5")
        s.append(spade_tab(x, y, n, faded=not used, lab="l" if int(n) <= 3 else "r"))
    # stock connectors that stay
    s.append(conn("s2c", 80, 145, "M66,145 H0", cls="wire-g") + conn("s3c", 80, 195, "M66,195 H0", cls="wire-g") + conn("b5c", 400, 145, "M414,145 H480", cls="wire-g"))
    # the ones that move
    s.append(conn("b4", 400, 95, "M400,87 V0", "B4", -34, 0))
    s.append('<g data-k="Lw"><path class="wire-m" d="M480,30 H446"/><rect class="tab" x="424" y="26" width="22" height="8" rx="1"/><text class="lbl" x="474" y="20" text-anchor="end">L</text>'
             '<text class="cap" x="474" y="50" text-anchor="end">to J11</text></g>')
    s.append(conn("s4", 160, 95, "M160,87 V0", "S4", 0, -20))
    s.append(conn("s5", 160, 145, "M174,145 C186,145 196,120 198,0", "S5", 0, 24))
    s.append('<g data-k="s5s"><rect class="slv" x="132" y="16" width="36" height="24" rx="7"/><path class="tie" d="M156,12 V44"/><text class="cap" x="178" y="32">live: insulate, tie down</text></g>')
    s.append('<g data-k="b4note"><text class="cap onmetal" x="396" y="76" text-anchor="middle">empty, live</text></g>')
    # low-voltage wires
    s.append(lvwire("lv1", "M268,300 V95 H308", "lvw", (320, 95)))
    s.append(lvwire("lv2", "M258,300 V145 H308 M306,152 C290,160 270,164 240,164 C210,164 186,158 172,152", "lvg", (320, 145)))
    s.append('<g data-k="lv3"><rect class="conn lvc" x="148" y="138" width="24" height="14" rx="3"/></g>')
    s.append(lvwire("lv4", "M230,300 V95 H172", "lvw", (160, 95)))
    s.append('<g data-k="lvcap"><text class="cap" x="276" y="292">to J7: S, GND, B</text></g>')
    s.append('</g>')
    s.append(meters("swm", ("0.3 Ω", "brew ON:", "J7 B to GND"), ("OL", "brew OFF:", "J7 B to GND")))
    s.append('</svg>')
    return "".join(s)


def switches_gc():
    s = ['<svg id="pg-swc" viewBox="0 0 480 300" role="img" aria-labelledby="pg-swc-t"><title id="pg-swc-t">Original Classic switch housing on stock wiring, seen from the back, drawn step by step: '
         'P1-2 moves onto wire L, connectors 1, 2, 3 and P3-4 are insulated and parked, and the low-voltage wires go on spades 1, 3, P(1-2) and P(3-4).</title>']
    s.append('<g data-k="swv"><text class="cap" x="291" y="14" text-anchor="middle">seen from the back</text>'
             '<rect class="swbody" x="30" y="70" width="420" height="160" rx="10"/>'
             '<text class="lbl" x="70" y="256" text-anchor="middle">Brew</text><text class="lbl" x="250" y="256" text-anchor="middle">Steam</text>'
             '<text class="lbl" x="380" y="256" text-anchor="middle">On/Off</text>')
    cols = ((80, ("1", "P", "2")), (180, ("3", "P", "4")), (280, ("5", "P", "6")), (380, ("7", "P", "8")))
    used = {"1", "3", "P12", "P34", "2", "P56", "6"}
    for cx, names in cols:
        for (y, n) in zip((100, 145, 190), names):
            key = n if n != "P" else "P" + names[0] + names[2]
            s.append(spade_tab(cx, y, n, faded=key not in used))
    s.append(conn("c56", 280, 145, "M294,145 C330,145 340,60 360,0", cls="wire-g") + conn("c6", 280, 190, "M294,190 C340,190 350,60 380,0", cls="wire-g"))
    s.append(conn("cp12", 80, 145, "M80,137 V0", "P1-2", 36, 0))
    s.append('<g data-k="Lw"><path class="wire-m" d="M0,30 H34"/><rect class="tab" x="34" y="26" width="22" height="8" rx="1"/><text class="lbl" x="8" y="20">L</text><text class="cap" x="8" y="52">to J11</text></g>')
    s.append(conn("c1", 80, 100, "M94,100 C120,100 130,40 140,0", "1", 34, 0, sleeve=True))
    s.append(conn("c2", 80, 190, "M94,190 C120,190 128,260 140,300", "2", 34, 0, sleeve=True))
    s.append(conn("c3", 180, 100, "M194,100 C214,100 220,40 226,0", "3", 0, -22, sleeve=True))
    s.append(conn("cp34", 180, 145, "M194,145 C214,145 220,240 230,300", "P3-4", 0, 24, sleeve=True))
    s.append('<g data-k="park"><text class="cap" x="472" y="272" text-anchor="end">parked: live,</text><text class="cap" x="472" y="286" text-anchor="end">insulated, tied down</text></g>')
    s.append(lvwire("lv1", "M44,300 V100 H68", "lvw", (80, 100)))
    s.append(lvwire("lv2", "M140,300 V100 H168", "lvw", (180, 100)))
    s.append(lvwire("lv3", "M200,300 V145 H192 M168,152 C150,170 110,170 92,152", "lvg", (180, 145)))
    s.append('<g data-k="lv4"><rect class="conn lvc" x="68" y="138" width="24" height="14" rx="3"/></g>')
    s.append('<g data-k="lvcap"><text class="cap" x="50" y="292">J7 B</text><text class="cap" x="146" y="292">J7 S</text><text class="cap" x="206" y="292">J7 GND</text></g>')
    s.append('</g>')
    s.append(meters("swm", ("0.3 Ω", "brew ON:", "J7 B to GND"), ("OL", "brew OFF:", "J7 B to GND")))
    s.append('</svg>')
    return "".join(s)


def main():
    out = {"part-defs.svg.html": DEFS, "part-tc.svg.html": tc(), "part-ptb.svg.html": ptb(), "part-tee.svg.html": tee(), "part-fuse.svg.html": fuse(), "part-wire.svg.html": wires(), "part-ssr.svg.html": ssr(), "part-swp.svg.html": switches_gcp(), "part-swc.svg.html": switches_gc()}
    for name, body in out.items():
        open(os.path.join(HERE, name), "w").write(body + "\n")
        print(name, len(body), "bytes")


if __name__ == "__main__":
    main()
