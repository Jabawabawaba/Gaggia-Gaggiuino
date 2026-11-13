/* The runbook's step-by-step text, keyed by step id (runbook-phases.js has the steps themselves). Only the runbook loads it.
     Fields: need (what to have at hand), warn (a careful note, shown before the steps), how (the numbered steps),
     ok (how to know it worked), pics ([label, url, when] official photos), links ([label, key or url, when] pages on this site).
     A how item is a string, [text, when] (shown only when it applies), or {t: text or segments, w: when}. Text and segments
     follow machine.js (txt), plus the runbook's own scr:p4|s3|hl and mnt:front|funnel|rear. In the text, **x** is bold and
     [label](key#hash) links to a page on this site (a key in the runbook's L) or a full address.
     Written from the official Gaggiuino docs as read in November 2026; where a detail is this site's own advice, the text says so. */
  var PIC={
    labels:"https://gaggiuino.github.io/schematics/stm32_pcbv3_1_board_labels.png",
    lvGCP:"https://gaggiuino.github.io/schematics/stm32-lv/GCP_g3_5_PCBv4_LV.png",
    lvGC:"https://gaggiuino.github.io/schematics/stm32-lv/GC_g3_5_PCBv4_LV.png",
    bench:"https://github.com/user-attachments/assets/5ea67541-0cf4-4064-9f87-19ad900bef8b",
    tcFold:"https://github.com/user-attachments/assets/3cac0e03-e850-4f7b-844e-4c19971a8382",
    openGC:"https://user-images.githubusercontent.com/117388662/239368163-aa737736-51b5-43ed-86f9-cb834e031d2a.png",
    openGCP:"https://user-images.githubusercontent.com/117388662/243791638-b16cac88-6802-49a7-b1d8-13c04be99b96.png",
    pumpGC:"https://user-images.githubusercontent.com/117388662/239372268-1605be4b-5a0c-414d-bdc2-3524ef26b11e.png",
    pumpGCP:"https://user-images.githubusercontent.com/117388662/243792655-6a186fde-062c-4f2d-b3ed-cba5d3b0c6c8.png",
    siWires:"https://github.com/user-attachments/assets/09a876da-2380-4a97-9aad-7fbbed6007fa",
    jGC:"https://user-images.githubusercontent.com/117388662/239383435-9a3407bc-7455-4a2d-86db-e12ea441fcfc.png",
    jGCP:"https://user-images.githubusercontent.com/117388662/243794746-39d788cb-2b08-45ae-a08e-f1bb0907129d.png",
    tc:"https://github.com/user-attachments/assets/7eef096a-bcce-4d98-8a7d-ae898c3afec3",
    pAreaGC:"https://github.com/user-attachments/assets/08201c41-7c72-4839-b85b-654710d979d0",
    pAreaGCP:"https://github.com/user-attachments/assets/b8b0da1a-111e-4a19-8c0f-7b933b973026",
    ssrGC:"https://user-images.githubusercontent.com/117388662/239403962-c0ef2429-ec12-4d81-b56b-02c91cd702d3.png",
    ssrGCP:"https://user-images.githubusercontent.com/117388662/246569790-dfc78317-caef-4bba-a528-466affb516b1.png",
    ssrCW:"https://github.com/user-attachments/assets/94bcb6c1-6e65-4ced-957c-9c00551140b3",
    lGC:"https://user-images.githubusercontent.com/117388662/239404551-97d6f3e4-f62e-45c4-93d7-52d8ae373526.png",
    lGCP:"https://user-images.githubusercontent.com/117388662/243890489-77c730e4-20e3-4e6f-9cb5-6295780194fc.png",
    lvSwGC:"https://user-images.githubusercontent.com/117388662/239406277-7bdd8852-5fcb-454e-9521-cd9537543144.png",
    lvSwGCP:"https://user-images.githubusercontent.com/117388662/246567190-77c4ca27-fb2d-4105-bb41-cc5875a4cc50.png",
    xf:"https://github.com/GAGGIUINO/gaggiuino.github.io/assets/117388662/78d801f3-9c4f-4c17-8105-74e32711af09",
    xfGCP:"https://github.com/GAGGIUINO/gaggiuino.github.io/assets/117388662/f294cdb2-000b-4583-b258-8dd53854a2ec",
    teeGC:"https://user-images.githubusercontent.com/117388662/239457706-7ee5d101-d209-41b4-a3d3-ce159e98032f.png",
    teeGCP:"https://user-images.githubusercontent.com/117388662/246573952-ca092066-d107-46e6-85f1-e2a7b19865e0.png",
    foam:"https://user-images.githubusercontent.com/117388662/239457402-b58dfe55-6572-45b7-8960-2a4d1f9d5753.png",
    ptbA:"https://github.com/user-attachments/assets/14188d93-508f-4ab4-b003-80f8aeb243a8",
    inl:"https://github.com/user-attachments/assets/12e2f8d8-5313-4f5d-b932-4b213ebf22e8",
    ptbC:"https://github.com/user-attachments/assets/8cf1157b-b990-41c1-9770-24d7ac5af067",
    ptbF:"https://github.com/user-attachments/assets/53026edc-2026-4144-9714-200cdb2ebf51",
    finGC:"https://user-images.githubusercontent.com/117388662/239461982-54c2c808-9597-4fe2-8bee-3a759064d065.png",
    finGCP:"https://user-images.githubusercontent.com/117388662/246574886-6a137c93-dc74-4d76-9eff-661204bd7571.png",
    psm:"https://github.com/GAGGIUINO/gaggiuino.github.io/assets/117388662/3e99f5c4-f8e1-4413-b91b-2bf3890c3737",
    cciBlock:"https://github.com/GAGGIUINO/gaggiuino.github.io/assets/117388662/4c670b12-c555-4aab-91ad-5a9d8e9cec66",
    cci:"https://github.com/GAGGIUINO/gaggiuino.github.io/assets/117388662/83f63c3a-9919-4c99-b01e-34eacba4ff71",
    opv:"https://github.com/GAGGIUINO/gaggiuino.github.io/assets/117388662/69a9cfbf-e2bc-4868-9f57-f510457fa61b",
    gnd1:"https://user-images.githubusercontent.com/117388662/236963585-40bd561b-2375-4878-adfa-3e8ca4631554.png",
    gnd2:"https://user-images.githubusercontent.com/117388662/236964221-30e21582-5bd8-422b-88eb-d9cb27d7ee52.png",
    gnd3:"https://user-images.githubusercontent.com/117388662/236964636-bf53e5ef-53aa-4f0c-ba69-a9c23222c644.png",
    gnd4:"https://user-images.githubusercontent.com/117388662/236979713-6508871f-8405-4e0c-b4ed-e7ab59904ad6.png",
    gnd5:"https://user-images.githubusercontent.com/117388662/237005812-6b360577-e91f-4ba1-a1ca-83480e9c50cf.png",
    ap:"https://github.com/user-attachments/assets/af24bb4e-1608-4b45-b78d-ccb7d15bec18",
    about:"https://gaggiuino.github.io/manual/gen3/mbed/003_006_settings_about.png",
    ota1:"https://github.com/user-attachments/assets/0c7114ec-6e85-4894-bfc8-d779a8de38b5",
    ota2:"https://github.com/user-attachments/assets/f70a4726-daa2-459b-aacc-4167444edf87",
    ota3:"https://github.com/user-attachments/assets/faba0d3e-15fd-4324-a28f-f170c0950757",
    cmp:"https://gaggiuino.github.io/media/screen_compare_g_3.webp",
    m35:"https://gaggiuino.github.io/media/screen_mounts_g_3_5.webp",
    m3:"https://gaggiuino.github.io/media/screen_mounts_g_3.webp",
    h35:"https://gaggiuino.github.io/media/screen_g_3_5_housing_assembly.webp",
    fMag:"https://github.com/user-attachments/assets/ead5c319-6b55-48c7-8b6b-0f29e8354e0f",
    fGap:"https://github.com/user-attachments/assets/588d2c45-c75d-4f03-a2a2-f3a7fb753912",
    fW35:"https://gaggiuino.github.io/media/screen_g_3_5_frontmount_wires.jpg",
    fA35:"https://gaggiuino.github.io/media/screen_g_3_5_front_assembly.webp",
    fOn:"https://github.com/user-attachments/assets/2a1c65f7-1ec7-46a0-bfa5-59710317190d",
    nPry:"https://github.com/user-attachments/assets/99be6c31-095a-4fbf-ba57-a0f48e4b8bd4",
    nLatch:"https://github.com/user-attachments/assets/6b5498d2-14ce-473d-86b5-116dd9999caa",
    nVent:"https://github.com/user-attachments/assets/8c1e694a-89a4-4cce-9641-f92db90aab87",
    adj35:"https://gaggiuino.github.io/media/screen_g_3_5_adj_assembly.webp",
    swiv:"https://github.com/user-attachments/assets/9bc40925-76a9-4868-bed5-2a554826f1b7",
    nZip35:"https://gaggiuino.github.io/media/screen_g_3_5_funnel_ziptie.jpg",
    rVent:"https://github.com/user-attachments/assets/1ecfdfb7-cd2e-49c0-895f-76fc201f7e7c",
    rMount:"https://github.com/user-attachments/assets/69b796ea-27e1-4fb2-a55e-b474187ac989",
    rOn:"https://github.com/user-attachments/assets/d8067907-8ccb-4b46-b1b2-455515eea056",
    fPlug3:"https://github.com/user-attachments/assets/028e9195-825e-48e4-b37b-14276b37e91b",
    nPlug3:"https://github.com/user-attachments/assets/99454a58-6f10-4422-9010-ad2a61bfa8cc",
    rPlug3:"https://github.com/user-attachments/assets/8724315e-99c0-4e59-8242-e98b0531ee6c",
    posts3:"https://github.com/user-attachments/assets/2d059c58-a688-409c-9bd9-183443854bc7",
    cover3:"https://github.com/user-attachments/assets/fc37622f-ee69-4ec3-af85-874e8c00d273",
    fClip3:"https://github.com/user-attachments/assets/343d150b-3509-481a-80a5-b4e811b0ea3c",
    adj3:"https://github.com/user-attachments/assets/d9653f52-dd7f-4593-b4bb-dfeb9fba9cd2",
    nZip3:"https://github.com/user-attachments/assets/bc3a08cb-6f48-489a-9d2c-367b53e5f1c9",
    nOn:"https://github.com/user-attachments/assets/8f151c1e-93fa-4e46-81d0-cb45a3dc9d63",
    cupOn:"https://github.com/user-attachments/assets/44cd4587-2e95-4c72-bc0c-595ed9d91755",
    hlMag:"https://github.com/user-attachments/assets/da035af4-4fdf-4b69-9bea-01b531723385",
    hlRoute:"https://github.com/user-attachments/assets/ac94b5ae-ba9a-4b9a-9ed9-bf49a61af009",
    hlSeat:"https://github.com/user-attachments/assets/5170f195-5679-455e-b4b4-b5720fe875c0",
    hlOn:"https://github.com/user-attachments/assets/54b5debf-994f-40e8-8ae9-ceb904187f19"
  };
  var HOW={
    /* ---------------- Phase 0 ---------------- */
    p0v:{
      need:"The machine, and a phone to photograph its rating label.",
      how:[
        "Empty the water tank and drip tray, then tip the machine back gently and find the rating label underneath. Photograph it.",
        "Note the model number (SIN035R, RI9380 and so on) and the mains voltage: 100 to 120 V or 220 to 240 V.",
        "Check the number against the [Which Gaggia](which) page, which lists every compatible model and tells look-alikes apart.",
        "Tap **Your Gaggia** in the top bar and set the model and voltage.",
        "A 230 V Pro-family machine also asks about the Eco board: a label reading SIN035UR, or a power switch that springs back when you let go, means you have one.",
        "Pick the install path there too once you've read the next steps. From then on this page, the wiring pages and the checks show only what applies to your machine."
      ],
      ok:"The top bar names your machine, for example Classic Pro E24 · 120 V."
    },
    p0x:{
      how:[
        "Read the model number on the rating label.",
        "SIN035U with RI9403 is the Classic V2 (230 V, sold 2015 to 2018). It has no 3-way valve and Gaggiuino doesn't support it: don't order parts for it.",
        "SIN035 RI9303 is the Classic Gaggiuino supports (230 V machines from 1991 to 2014)."
      ]
    },
    p0p:{
      how:[
        "**Stock wiring integration:** the machine's own wiring stays. You add seven short new wires (J, Sa, Sb, 3, P, L and N), move a few connectors on the switches, and add the low-voltage switch wires. Less wiring, but the official guide warns it's more confusing and has more places for a fault, and some stock connectors stay in the machine unplugged and still live.",
        "**Custom wiring:** the whole stock harness comes out and a new one goes in. More crimping, but every wire is new, labeled and follows one drawing. The official guide calls Plug-and-Play/custom wiring the standard path, and sells a ready-made Plug-and-Play harness through its approved suppliers.",
        "What this site covers: stock wiring, wire by wire. Its custom wiring pages follow the official May 2024 custom drawing (now in the official archive). A Plug-and-Play harness follows the newer official drawing instead, with different wire names.",
        "Pick the one you're more comfortable with, then set **Install path** in Your Gaggia. A 230 V Pro-family machine goes custom whatever you pick (next steps)."
      ],
      ok:"Install path is set in Your Gaggia."
    },
    p0e:{
      how:[
        "You have the Eco board if your 230 V Pro-family machine's label reads SIN035UR, or its power switch springs back when you let go.",
        "It switches the machine off after 20 idle minutes, and Gaggiuino needs 10 to 15 minutes to settle, so the Eco board comes out with the stock harness.",
        "Plan on custom wiring: the official guide doesn't recommend stock wiring with the Eco board.",
        "Plan the power switch mod (Phase 2): one spring comes out so the switch stays on.",
        "Set Eco board to Yes in Your Gaggia."
      ]
    },
    p0w:{
      how:[
        "There's no official stock wiring drawing for a 230 V Classic Pro, Eco, Evo or E24, so the official guide sends them to custom wiring.",
        "Set Install path to custom wiring in Your Gaggia. If you leave it on stock wiring, this runbook and the wiring, cut list, labels and checks pages show custom wiring for your machine anyway."
      ]
    },
    p0g:{
      how:[
        "Look at the plug: two flat pins and no round earth pin means the case isn't earthed. Most US Classics were sold that way.",
        "Order the grounding parts (all on the [Parts tracker](tracker)): a C14 three-pin panel inlet for 1.2 to 1.5 mm panels (Schurter 6100.4312 or 6100.4315), a right-angle 5-15P to C13 cord of 14 to 16 gauge, 0.4 m or more of 16 to 18 AWG silicone wire, and four 6.3 mm female spades.",
        "You'll fit them in Phase 2, before any other wiring.",
        "The official guide also recommends powering an espresso machine through a GFCI-protected outlet."
      ],
      warn:"Earth is not the same as the PCB's 5 V GND. The two never connect."
    },
    p0o:{
      how:[
        "Pick one: a new 12 bar OPV spring, or three or four M3 washers to preload the 9 bar spring.",
        "Washers must be 300-series stainless, 6.9 to 7.1 mm across, with a 3.0 to 3.6 mm hole, 0.5 to 0.8 mm thick.",
        "You'll start with 4 washers if they're 0.5 mm thick, or 3 if they're 0.8 mm. Buy a few spares: you may add one after the pressure test in Phase 5."
      ]
    },
    p0c:{
      how:[
        "Self-fusing silicone tape, 25 mm wide and 1.5 m or longer, or 6 mm silicone heat shrink tube and a heat gun.",
        "An oil-based permanent marker: it writes on silicone.",
        "In Phase 2 each connector comes out of the shared block, gets its own insulation and a label."
      ]
    },
    p0t:{
      how:[
        "**A multimeter** that reads resistance (Ω) and beeps for continuity. The official guide calls it optional; this runbook's power-on checks need one, because they prove the wiring is safe before the first plug-in.",
        "**Crimpers:** a ratcheting crimper for insulated terminals (its dies are color-coded red and blue, like the spades); an open-barrel crimper for the bare spades at the boiler; and an uninsulated-terminal crimper, or a punch and block, for BN butt splices if a wire needs lengthening.",
        "**Wire strippers** and side cutters.",
        "**Spanners:** a 17 mm spanner for the thermostats, a 4 mm Allen key for the boiler's screws, and an adjustable spanner, or two, for the pressure sensor's fittings.",
        "**Screwdrivers:** Phillips for the case, a long thin one with a magnetic tip for screws deep in the back, and a tiny flat one for the PCB's thermocouple clamp.",
        "**Heat:** a heat gun, or a flameless lighter, for heat shrink.",
        "**Consumables:** self-fusing silicone tape, an oil-based marker, Kapton tape, zip ties, thermal paste rated for 180 °C or more (only needed if the thermostat's old paste has dried out), a towel and a few cups for screws.",
        "**For first power-on:** a {outlet}.",
        "**Optional:** a soldering iron, only if your kit's low-voltage wires need joining (the funnel mount also uses one for its heat-set insert)."
      ],
      ok:"Everything is on the bench, and the meter beeps when you touch its probes together.",
      links:[["Part guide: making the wires (which crimper is which)","gwire"]]
    },
    p0k:{
      how:[
        "**Electronics (the kit):** PCB v4 and its housing, the screen and its cable (or the headless board), the M4 ungrounded K-type thermocouple, the pressure sensor with its small flat white O-ring, the SSR-40DA, and the low-voltage cables for the switches (J7) and the SSR (J9).",
        "**SSR hardware:** an M4 × 10 screw, washer and nut, or an 8-32 set from a hardware store.",
        "**ST-Link programmer:** on the official parts list, but PCB v4 updates over Wi-Fi, so it's only needed for a wired recovery.",
        ["**Stock wiring:** the seven integration wires (J, Sa, Sb, 3, P, L and N), made up, or 2 m or more of 18 AWG silicone wire (1 m each of red, black and white is plenty), 6.3 mm male and female spades, uninsulated spades and silicone sleeve for the boiler ends, one piggyback spade and SV1.25-5 fork terminals.","wpath:SI"],
        ["**Custom wiring:** a Plug-and-Play harness from an official supplier, or everything on this site's [cut list](cut): 18 AWG silicone wire in the drawing's colors, insulated and bare 6.3 mm spades, SV1.25-5 and SV2-5 forks, BN1.25 and BN2 butt splices, and silicone heat shrink or self-fusing tape.","wpath:CW"],
        "**Pressure plumbing, one of:** the pressure tap block kit (the block, a PC 6-M5 fitting, a PLF 6-02 fitting, 4 × 6 mm PTFE tube, an 010 silicone O-ring and two M5 × 25 screws), or a T-fitting kit.",
        ["**Pro-family T-fitting:** a 6 mm barbed T, a 6 mm barb to 1/4 inch sensor fitting, high-pressure braided hose (Saeco 996530009505) and hose clamps with their pliers.","fam:GCP"],
        ["**Classic T-fitting:** a PE 6 mm push-to-connect T, a PLF 6-02 sensor fitting and 4 × 6 mm PTFE tube.","fam:GC"],
        "**Printed parts:** the PCB housing, and the housing and mount for your screen (the Gen 3.5 and Gen 3 screens have different housings; the three mounts fit both), or the headless housing.",
        ["**OPV:** the 12 bar spring or the M3 washers.","opv9"],
        ["**Grounding:** the inlet, cord, wire and spades from the grounding step.","ground"],
        ["**Evo and E24:** self-fusing silicone tape or 6 mm silicone heat shrink.","model:EVO,E24"],
        "**Optional:** a microSD card (1 to 8 GB, FAT32) for shot history, a ToFnLED, hardware scales."
      ],
      ok:"Everything for your path is in hand, or ordered with a date. The Parts tracker keeps the list."
    },
    p0h:{
      how:[
        "Join the Gaggiuino Discord: [discord.gg/gaggiuino](https://discord.gg/gaggiuino).",
        ["Open **one** help thread in #install-help-gc for a Classic, or #install-help-gcp for the Pro family (Pro, Eco, Evo, E24).","unset:model"],
        ["Open **one** help thread in #install-help-gc.","set:model;fam:GC"],
        ["Open **one** help thread in #install-help-gcp.","set:model;fam:GCP"],
        "Title it [username][machine type][control system] and a short title, for example [yourname][GCP E24 120V][PCBv4] Stock wiring install.",
        "Ask every question in that one thread, with photos, and rename the short title as your question changes.",
        "There are no official build videos. If a video disagrees with this page or the official guide, don't follow the video."
      ]
    },
    p0l:{
      how:[
        "Open [Wire labels](labels) with Your Gaggia set and download its PDF.",
        "Print it at 100% (actual size), not fit to page. Plain paper with clear tape over it works; full-sheet sticker paper is quicker.",
        "Cut the labels out. Each one wraps around its wire about 3 cm from the end, the two halves folded together, text outward.",
        "Ends that sit on or beside the boiler get their name written on the silicone jacket with an oil-based marker instead: paper and tape don't last there.",
        "You'll label every stock connector before you move it (Phase 2), never after."
      ]
    },
    p0s:{links:[["Part guide: Shelly","gshl"]]},
    /* ---------------- Phase 1 ---------------- */
    p1a:{
      how:[
        "Clear a table and lay down something that doesn't conduct: a wooden board, cardboard or a silicone mat. No screws, wire offcuts or tools underneath.",
        "Put the PCB in its printed housing if you have it.",
        ["Rest the screen face up on a soft cloth.","scr:p4,s3"],
        "This phase runs on USB power only. Nothing here touches mains."
      ],
      warn:"Keep the boards off anything metal while they're powered: a stray screw under the PCB can short it."
    },
    p1b:{
      need:["The PCB, the thermocouple, the pressure sensor, the SSR and its control cable,",["the screen and its cable,","scr:p4,s3"],["the headless board and its cable,","scr:hl"],"the ToFnLED if you have one, and a tiny flat screwdriver."],
      how:[
        "Find the sockets on the PCB; each is labeled on the board: J1 (screen, 4 pins), J4 (thermocouple, two small screw clamps marked − and +), J6 (pressure sensor, 3 pins), J9 (SSR, 3 pins), J7 (switches) and J2 (ToFnLED, a tiny socket on the back). The four large tabs, J10 to J13, are for mains: leave them empty.",
        "**Thermocouple into J4:** the next step shows how to clamp its two bare wires.",
        "**Pressure sensor into J6:** push its 3-pin plug in. These plugs only fit one way round: if one won't go, turn it over rather than force it.",
        ["**Screen into J1:** the cable's larger plug goes in J1. Its small plug goes into the 4-pin socket on the back of the screen marked 5V, IO28, IO27, GND.","scr:p4"],
        ["**Screen into J1:** the cable's larger plug goes in J1. Its two small plugs go into the screen's two sockets on its back; the next-but-one step checks which wire lands where.","scr:s3"],
        ["**Headless board into J1:** its cable plugs into J1 at one end and the board's 4-pin socket (5V, TX, RX, GND) at the other.","scr:hl"],
        "**SSR control into J9:** J9's R1 wire goes under the SSR's + screw and J9's GND wire under its − screw. Those two are the DC control side, usually marked 3 (+) and 4 (−). The other two screws, the AC load side (usually 1 and 2), are for mains later: leave them empty.",
        "**ToFnLED into J2,** if you have one: its Qwiic cable plugs into J2 on the back of the PCB.",
        "Leave J7 unplugged: its wires go to the machine's switches in Phase 4."
      ],
      ok:"Every plug pushed fully home, J10 to J13 empty, and nothing touching metal.",
      pics:[["Bench test set-up","BENCH"],["PCB socket labels","LABELS"],["Low-voltage drawing, Pro family","LVGCP","fam:GCP"],["Low-voltage drawing, Classic","LVGC","fam:GC"]]
    },
    p1c:{
      how:[
        "Loosen both of J4's screws a couple of turns with the tiny flat screwdriver.",
        "Fold each bare thermocouple wire back on itself, so the bare end is doubled.",
        "Push one wire into + and the other into −. Only bare metal goes into the clamp: keep the insulation out. The official drawing shows the red lead on +, but lead colors vary between makers: the warm-hand test in a few steps tells you if they're swapped.",
        "Tighten each screw gently, then tug each wire: it mustn't move."
      ],
      ok:"Both wires held firmly, no insulation under the clamps, and the two wires not touching each other.",
      pics:[["Folded thermocouple wires","TCFOLD"]]
    },
    p1d:{
      how:[
        "The kit's screen cable comes made up. Don't take it apart or move its pins to make the colors match.",
        "On the PCB, J1's pins are marked GND, TX, RX and 5V.",
        ["On the Gen 3.5 screen, the socket is marked 5V, IO28, IO27, GND. Follow the 5V wire and the GND wire from J1: each must land on the pin with the same name. The other two wires are the data pair.","scr:p4"],
        ["On the Gen 3 screen, J1's 5V and GND go to the socket marked GND, RXD, TXD, 5V, and the data pair (TX and RX) to IO18 and IO17 on the socket marked UART1. Follow the 5V and GND wires: each must land on the pin with the same name.","scr:s3"],
        ["On the headless board, the socket is marked 5V, TX, RX, GND. Follow the 5V and GND wires from J1: each must land on the pin with the same name.","scr:hl"],
        "If the colors don't match the official drawing, that's normal: blue and yellow have been swapped between cable batches. Where each wire lands is what counts."
      ],
      ok:"5V reaches 5V and GND reaches GND, end to end."
    },
    p1e:{
      how:[
        "Plug a USB-C cable into the PCB's own USB-C port, not one on the screen.",
        "Power it from a USB charger or a computer.",
        "That's the only power in this phase: the mains tabs stay empty and the machine stays closed."
      ]
    },
    p1f:{
      how:[
        ["The screen lights and shows \"Initialization in progress\" for a few seconds, then it clears.","scr:p4,s3"],
        ["Headless: you'll see these messages in the web UI once you've joined its Wi-Fi (two steps down). Come back and tick this one then.","scr:hl"],
        "A few seconds after boot, \"Filling boiler\" shows, and a red LED on the underside of the PCB lights at the same moment. On the bench that's expected: there's no boiler to fill.",
        "Stuck on \"Initialization in progress\"? Recheck J1 pin by pin (previous step). If the ToFnLED is turned on in the software but not plugged in, it won't start either. Then see the firmware step at the end of this phase: the core and screen firmware may be from different releases."
      ],
      ok:"Initialization clears, Filling boiler shows, and the red LED under the PCB is on.",
      links:[["Troubleshooting","trouble"]]
    },
    p1g:{
      how:[
        "Find the temperature on the home screen: it's the boiler temperature, in °C.",
        "Hold the thermocouple's metal tip between your fingers for 20 seconds or so.",
        "The reading should climb a few degrees. If it falls instead, the two wires are swapped: loosen J4's screws, swap them, retighten and try again.",
        "Write down which lead color ended up on + in the notes at the bottom of this phase. It goes back the same way in the machine."
      ],
      ok:"Warm the tip and the number goes up."
    },
    p1h:{
      how:[
        "Look at the small LED on the SSR. With the probe at room temperature, far below the brew target, it's on: Gaggiuino is calling for heat. Near the target it flashes.",
        "Pressure reads 0.0 bar and doesn't wander.",
        "The target temperature shown is the brew temperature, not the steam temperature.",
        "If you built hardware scales, you can test them now too, and even calibrate them (Phase 6 shows how)."
      ],
      ok:"SSR LED on, pressure a steady 0.0 bar, brew temperature as the target.",
      links:[["Troubleshooting","trouble"]]
    },
    p1j:{
      need:"A phone or laptop with Wi-Fi, and your home Wi-Fi password.",
      how:[
        "On the phone or laptop, open the Wi-Fi list and join **Gaggiuino AP**. At first it may show up as ESP_ followed by letters and numbers instead.",
        "Its password is **Gaggiuin0AP**: the network's name with a zero in place of the o, and no space.",
        "Open a browser and go to http://gaggiuino.local. That's the web UI, with the same controls as the screen.",
        "To put Gaggiuino on your home network: Settings in the web UI (the gear icon on the screen), then System, then Connect. Pick your network's 2.4 GHz band and enter its password.",
        "If your password has a character the screen's keyboard lacks, do the step above from the web UI instead.",
        "Once it's on your network, open http://gaggiuino.local from any device on that network. If a phone won't open it, try a laptop: some phones can't open .local addresses (this site's tip, not the official guide's)."
      ],
      ok:"The web UI opens at gaggiuino.local. On your home network, it also gets the right time for shot history.",
      pics:[["The Gaggiuino AP in a Wi-Fi list","AP"]]
    },
    p1i:{
      how:[
        "Settings, About (the gear icon on the screen, or Settings in the web UI). Note the build numbers for Core, Mbed (the screen or headless board) and Web.",
        "Compare them with each other and with the latest release on the [Gaggiuino releases page](https://github.com/Zer0-bit/gaggiuino/releases/latest). If all three match the release, you're done.",
        "If your About page has an **Update All** button, you can use it instead, with Gaggiuino on your home Wi-Fi: the official firmware reset page uses it to bring every part up to date. Older firmware may not have it.",
        "Otherwise update by hand: from the latest release, download the core file for PCB v4 (performance, pcb, then pca or ncp to match a ToFnLED's LED chip; without a ToFnLED either works) and the two screen files (ui-embedded and ui-web; headless uses ui-headless and ui-web).",
        "In the web UI, Settings, OTA Update: choose **Core Upgrade Package**, SELECT FILE, pick the core file, then UPLOAD. The screen goes black while it flashes and reboots.",
        "Then START OVER, choose **LCD Upgrade Package** and upload ui-embedded (or ui-headless); START OVER again for ui-web. The order is core, then ui-embedded, then ui-web, unless the release notes say otherwise. Refresh the browser after ui-web.",
        "Back in About, all three build numbers should now match.",
        "Bench test done: unplug the USB cable, then unplug each part from the PCB and loosen J4's screws to free the thermocouple. Each part goes into the machine on its own, and everything plugs back into the PCB at the end of Phase 4 (the official custom wiring guide calls this the easiest way)."
      ],
      warn:"Don't power off during an update. A failed or cancelled one falls back to the old firmware by itself. If updates keep failing on your home network, join Gaggiuino AP directly and try again.",
      pics:[["About page","ABOUT"],["OTA Update section","OTA1"],["Choosing the package","OTA2"],["START OVER","OTA3"]]
    },
    /* ---------------- Phase 2 ---------------- */
    p2a:{
      need:"A Phillips screwdriver, a towel and a cup for the screws.",
      warn:"Unplug first, every time the machine is open. Let it cool if it's been on: the boiler stays hot for a long time.",
      how:[
        "Switch off, pull the plug from the wall, then pull the cord out of the machine too.",
        "Empty and take out the water tank and the drip tray.",
        "Undo the two screws on top that hold the top cover, the cup warmer plate.",
        "Lift the plate gently. If an earth wire is plugged onto a tab underneath it, photograph it, pull that connector straight off, and set the plate aside.",
        "Lift out the water funnel under it the same way: if an earth wire is plugged onto it, photograph it and pull it off first."
      ],
      ok:"You're looking at the inside of the machine, as in the official photo.",
      pics:[["Opened Classic Pro","OPENGCP","fam:GCP"],["Opened Classic","OPENGC","fam:GC"]]
    },
    p2p:{
      how:[
        "Before you unplug anything, photograph every connection, each from two angles: the backs of the switches, the pump and its connectors, the boiler top and both thermostats, the inlet, the valve, and anything else with a wire on it.",
        "Get close enough that each switch's spade numbers and each wire's color can be read.",
        "Keep them in one album. They're how you put anything back."
      ]
    },
    p2b:{
      need:"An oil-based permanent marker, or the printed labels.",
      how:[
        "Use the official names: they're the ones this runbook, the wiring page and the checks use.",
        "Switches: P (power), B (brew) and S (steam), with each spade numbered 1 to 6. Heaters: H1 to H4. Steam thermostat: Sa and Sb. Brew thermostat: Ba and Bb. Valve: Va and Vb.",
        "Pump: Pa is the lead from the pump's thermal fuse; Pb is the single 18 gauge wire on most machines.",
        ["On stock wiring, these are the ones that move: Ba, Bb, Sa, Sb, Pb and Pa, B4 (brew spade 4), S4 and S5 (steam spades 4 and 5). Label those first.","wpath:SI"],
        "Write on the connector or the wire just behind it, or wrap a printed label on. One connector at a time: label it before it moves, never after."
      ],
      ok:"Every connector you'll move carries its name."
    },
    p2b2:{
      need:"An oil-based permanent marker, or the printed labels.",
      how:[
        "Use the official names: they're the ones this runbook, the wiring page and the checks use.",
        "Switch assembly: the numbered connectors 1, 2, 3, 6, 7 and 8, and P(1-2), P(3-4), P(5-6) and P(7-8) (the official photo shows which is which). Heaters: H1 to H4. Steam thermostat: Sa and Sb. Brew thermostat: Ba and Bb. Valve: Va and Vb. Pump: Pa and Pb. Pump fuse: F, a connector holding two wires.",
        ["On stock wiring, these are the ones that move: Ba, Bb, Sa, Sb, Pb, Pa, P1-2, 1, 2, 3 and P3-4. Label those first.","wpath:SI"],
        "Write on the connector or the wire just behind it, or wrap a printed label on. One connector at a time: label it before it moves, never after."
      ],
      ok:"Every connector you'll move carries its name."
    },
    p2c:{
      how:[
        "Open the [wiring page](wiring) with Your Gaggia set. Its map shows your machine's stock connectors and where each new wire goes.",
        "Check each labeled connector sits where the drawing shows it, especially at the pump: stock wire colors and positions don't always match the drawings.",
        "Anything different from the drawing: stop, and ask in your help thread with photos before you move anything."
      ],
      warn:"The official guide's warning: misidentifying a connection can damage the control board.",
      pics:[["Stock pump connections, Classic Pro","PUMPGCP","fam:GCP"],["Stock pump connections, Classic","PUMPGC","fam:GC"]]
    },
    p2d:{
      need:"Self-fusing silicone tape (or 6 mm silicone heat shrink and the heat gun), a small flat screwdriver and the oil-based marker.",
      how:[
        "It's easier with the switch, or the boiler, out of the way.",
        "Find the combined block on the back of the switches.",
        "Take one connector out: push the small screwdriver into the block to press that connector's locking tab, then pull the connector out of the back of the block.",
        "Label it straight away with the switch and spade it came from (for example B4), using the names from the labeling step.",
        "Insulate it on its own: wrap its metal in self-fusing silicone tape, stretching the tape as you wrap and overlapping each turn, or shrink a piece of 6 mm silicone heat shrink over it. Leave its mouth open so it still plugs on.",
        "Repeat for each connector, one at a time, so none gets mixed up."
      ],
      ok:"Every connector out of the block, insulated on its own and labeled.",
      pics:[["The combined block","CCIBLOCK"],["Connectors insulated and labeled","CCI"],["Video: taking a connector out of the block (from 0:59)","https://www.youtube.com/watch?v=8DB7vQm0_38&t=59s"]]
    },
    p2e:{
      how:[
        "Label and unplug the power switch's connectors, then take the switch out of the panel.",
        "Gently press one side wall in with a thin pry tool until its locking tabs release, then the other side.",
        "Open it and take out the third spring (the official photo shows which).",
        "Put it back together, fit it in the panel and plug its connectors back as labeled."
      ],
      ok:"Press it on and it stays on; press again and it stays off.",
      pics:[["Power switch, opened","PSM"],["Video: removing the spring (1:39 to 2:31)","https://www.youtube.com/watch?v=WNs3uSLA4Ts&t=99s"]]
    },
    p2f:{
      need:"The C14 inlet, the grounded cord, 0.4 m of green 16 to 18 AWG silicone wire, four 6.3 mm female spades (uninsulated for the boiler end) and wide-jaw pliers.",
      how:[
        "Note where the two wires on the old two-pin socket go, and check against the drawing: on many machines line and neutral are swapped.",
        "Pull the wires off the old socket.",
        "Squeeze the socket's retaining tabs with the wide-jaw pliers and push it out, working the top and bottom pairs of tabs in turn with a little wiggle.",
        "Push the new three-pin inlet into the hole until all its locking tabs seat.",
        ["Cut two wires of about 200 mm: one from the inlet's earth tab to the boiler's fuse clip (its earth connector), one from there on to the cup warmer plate's tab. Crimp spades on, uninsulated at the boiler end.","wpath:SI"],
        ["On custom wiring, the earth wires come from the custom drawing instead (G1 to G3 on the wiring page): fit just the inlet now.","wpath:CW"],
        "Connect line, neutral and earth to the new inlet. On Gaggia's 2009 120 V drawing, neutral (blue) goes to the thermal fuse on top of the boiler and line (gray) to the top of the power switch, but colors vary by year: go by your notes and the drawing."
      ],
      warn:"Insulated spades melt at the boiler: bare ones there. And earth never connects to the PCB's 5 V GND.",
      pics:[["Wires off the old socket","GND1"],["The socket's retaining tabs","GND2"],["New inlet seated","GND3"],["Ground wires","GND4"],["Line, neutral and earth","GND5"]]
    },
    p2g:{
      need:"The 12 bar spring, or the M3 washers.",
      how:[
        "Find the OPV on the pump, with its tube running back to the water tank.",
        "Open it to reach its spring. The official guide links a short video showing how on a Classic Pro or Evo: [watch it](https://www.youtube.com/watch?v=Kyjpe3SdSsE) before you start.",
        "Either swap in the 12 bar spring, or add the washers with the 9 bar spring as the official photo shows, so they press it harder: 4 if they're 0.5 mm thick, 3 if they're 0.8 mm.",
        "Close it up and push back any tube that came off, fully home.",
        "You'll test it with a blank basket in Phase 5, and can add a washer then if it reads low."
      ],
      pics:[["Washers with the 9 bar spring","OPV"]]
    },
    p2w:{
      need:"2 m or more of 18 AWG silicone wire (red, black and white), 6.3 mm male and female spades, uninsulated 6.3 mm male spades and silicone heat shrink for J, one piggyback spade, SV1.25-5 forks, and the crimpers and strippers.",
      how:[
        "If your kit came with these made up, lay them out and check each one against this list, then go on to the low-voltage ends.",
        "**J:** 70 mm of red, an uninsulated 6.3 mm male spade on each end with silicone heat shrink slid over each. It sits on the boiler.",
        "**Sa and Sb:** 100 mm of red each, a fork (SV1.25-5) on one end for the SSR and a 6.3 mm male spade on the other. If those male ends will sit on or against the boiler, use bare spades under silicone there, as for J.",
        "**3:** 350 mm of red, a 6.3 mm female spade on the PCB end and a male spade on the other, for Pb.",
        "**P:** 300 mm of red, a 6.3 mm female spade on each end.",
        ["**L:** 350 mm of black, a female spade on the PCB end and a male spade on the other, for B4.","fam:GCP"],
        ["**L:** 350 mm of black, a female spade on the PCB end and a male spade on the other, for P1-2.","fam:GC"],
        "**N:** 300 mm of white, a female spade on the PCB end and a piggyback spade on the pump end.",
        "The lengths are generous. If you like, route each wire in the machine first, then trim it before crimping.",
        "**To crimp an insulated spade:** strip 6 mm, set the spade in the crimper die that matches its color (red for one 18 AWG wire), push the wire fully in, and squeeze until the ratchet lets go. Then tug it.",
        ["**Low-voltage ends:** J7's three wires (B, GND, S) and a short ground jumper get 6.3 mm female spades, with J7 GND and the jumper sharing one (it goes on brew spade 2). J9's two wires get SV1.25 forks for the SSR.","fam:GCP"],
        ["**Low-voltage ends:** J7's three wires (B, GND, S) and a short ground jumper get 6.3 mm female spades, with J7 GND and the jumper sharing one (it goes on steam P(3-4)). J9's two wires get SV1.25 forks for the SSR.","fam:GC"],
        "A single 22 AWG wire is too thin for a spade on its own: strip four times as much and fold the copper back on itself, or join it to 18 AWG first. Two 22 AWG wires together fill a red spade.",
        "Label both ends of every wire as you go."
      ],
      ok:"Seven wires and the low-voltage ends, each labeled at both ends, each crimp surviving a firm tug.",
      pics:[["The integration wires","SIWIRES"]],
      links:[["Part guide: making the wires","gwire"]]
    },
    p2h:{
      how:[
        "**Bought the official Plug-and-Play harness?** It follows the newer official drawing, from October 2026, whose wire names differ from this site's pages. Fit it by [that drawing](https://gaggiuino.github.io/#/guides-stm32/3pln-custom-wiring?id=wire-harness-schematics) instead, and skip this step and the next two.",
        "Building your own: open the [cut list](cut) and the [wiring page](wiring) with Your Gaggia set. They follow the official May 2024 custom wiring drawing for your model and voltage, which the official site keeps in its archive.",
        "Take out the stock harness, keeping the stock parts the cut list reuses: the lamps with their leads, each heating element connector with about 80 mm of its lead, the boiler fuse's connectors and the pump fuse's lead. If the Eco board is fitted, it comes out now. The thermostats come out in Phase 3.",
        "Cut each run to its cut-list length (they're generous: route it first, then trim) and label both ends before you crimp.",
        "Crimp each end as its row says: red insulated spades for one 18 AWG wire and blue for two; bare spades under silicone at the boiler and the valve; forks at the SSR; butt splices where the drawing joins wires.",
        "For a butt splice (BN1.25, or BN2 for two 18 AWG wires a side): slide silicone heat shrink on first, push each wire in to the splice's middle stop, crimp each half with the uninsulated-terminal crimper, then shrink the sleeve over it. Mains wires are crimped, never soldered.",
        "Tick each run off on the cut list as it's made."
      ],
      ok:"Every run on the cut list made, labeled at both ends and pull-tested.",
      links:[["Part guide: making the wires","gwire"],["Official May 2024 custom wiring (archived)","https://gaggiuino.github.io/#/archive/3pln-custom-wiring-2024"]]
    },
    p2i:{
      how:[
        "Each SSR screw takes a fork: SV1.25-5 (red) for one 18 AWG wire, SV2-5 (blue) where two wires share a screw.",
        ["Pro family: the right load screw takes AC2 and AC4 together in one SV2 fork; the left takes AC11, or the resettable fuse's run if you fit one (AC17 at 120 V, AC16 at 230 V).","fam:GCP"],
        ["Classic: the right load screw takes AC2 and AC3 together in one SV2 fork; the left takes AC6.","fam:GC"],
        "The control wires, J9 R1 and J9 GND, get SV1.25 forks. They're 22 AWG: fold the stripped end back on itself first, or join it to 18 AWG."
      ]
    },
    p2j:{
      how:[
        "Anything on or near the boiler, or on the valve, gets an uninsulated spade under silicone: insulated ones melt there.",
        "Slide a piece of silicone heat shrink onto the wire first.",
        "Lay the end in the spade with the bare copper under the front tabs and the insulation under the rear tabs, and squeeze it in the open-barrel crimper's matching die.",
        "Slide the sleeve over and shrink it with the heat gun, or wrap the spade in self-fusing silicone tape.",
        "Two wires on one terminal: a spade sized for two, or a BN2 splice to one lead."
      ],
      links:[["Part guide: making the wires","gwire"]]
    },
    p2s:{links:[["Part guide: Shelly","gshl"]]},
    p2k:{
      how:[
        "Hold each connector and pull its wire firmly.",
        "If it moves, cut the connector off and crimp a new one.",
        "Check no bare strands show behind an insulated spade, and cover any bare metal that isn't meant to be bare."
      ],
      ok:"Every crimp survives a firm tug."
    },
    /* ---------------- Phase 3 ---------------- */
    p3a:{
      need:"A 17 mm spanner and a 4 mm Allen key.",
      warn:"Machine unplugged and the boiler cold.",
      how:[
        "Tip the boiler up first. It's the recommended way: the official tools page says attempts without removing the boiler have damaged thermocouples.",
        "Take off the steam knob and the steam wand, then undo the four 4 mm socket head screws that come up into the boiler from under the sheet metal. Lift and tip the boiler a little, leaving its hoses and wires attached. The official tools page links a [video of a Gaggia boiler coming out](https://www.youtube.com/watch?v=JTTLYj1l0KI&t=204s).",
        "Find the brew thermostat on the boiler and pull its two connectors, Ba and Bb, straight off. Grip the connector, not the wire.",
        "Unscrew the thermostat with the 17 mm spanner. There should be high-temperature thermal paste under it: you'll move it onto the thermocouple. If there's none, or it has dried out, you'll need fresh paste rated for 180 °C or more.",
        ["Custom wiring: unscrew the steam thermostat too. The official guide takes out all the stock wiring and both thermostats: the SSR and Gaggiuino control the heat.","wpath:CW"],
        "Leave the boiler's thermal fuse alone: it stays in the circuit.",
        "If the thermocouple is still clamped in the PCB's J4 from the bench test, loosen J4's screws and free it first."
      ],
      pics:[["Thermocouple in the brew thermostat's place","TC"]],
      links:[["Part guide: thermocouple","gtc"]]
    },
    p3b:{
      how:[
        "Take wire J (70 mm, an uninsulated male spade on each end).",
        "Push connector Ba onto one end of J and Bb onto the other.",
        "Cover each joint: slide its silicone heat shrink over and shrink it, or wrap it in self-fusing silicone tape.",
        "That path is now always closed: Gaggiuino controls the temperature instead of this thermostat."
      ],
      warn:"Nylon-insulated spades melt at the boiler (they're rated to 105 °C). Bare spades under silicone only.",
      pics:[["Jumper J, Classic Pro","JGCP","fam:GCP"],["Jumper J, Classic","JGC","fam:GC"]]
    },
    p3c:{
      need:"The M4 ungrounded K-type thermocouple, and thermal paste rated for 180 °C or more if the old paste has dried out.",
      how:[
        "Put thermal paste on the thermocouple's thread: move the old thermostat's paste across, or use fresh paste with a working temperature of 180 °C or more if the old paste was missing or dried out. The official guide lists Thermal Grizzly Kryonaut, Noctua NT-H2, SYY-157 and GELID GC-Extreme.",
        "Let its lead hang free, so it can turn with the probe as you screw it in.",
        "Screw it into the brew thermostat's hole by hand, gently, and stop as soon as it seats: **barely finger tight**.",
        "No spanner, ever. The M4 thread is small and the boiler's thread is soft."
      ],
      ok:"The probe is seated, finger tight, and its lead turns freely.",
      pics:[["Thermocouple install","TC"]],
      links:[["Part guide: thermocouple","gtc"]]
    },
    p3r:{
      how:[
        "Skip this if your kit has no resettable fuse: the boiler's stock 184 °C fuse stays and does the same job.",
        ["On stock wiring this is this site's suggestion: the official stock wiring guide doesn't fit one. The official wiring basics page says a kit's resettable fuse goes in the steam thermostat's hole as a replacement for the stock fuse.","wpath:SI"],
        "If it's still in, pull the steam thermostat's two leads off (Sa and Sb, labeled) and unscrew it with the 17 mm spanner.",
        "A thin film of the same 180 °C paste on the fuse's stud and face, then screw it into the steam thermostat's hole by hand until it seats. Its body is ceramic: no spanner.",
        "Then move the stock fuse's wires onto it, as the [resettable fuse guide](gfuse) shows step by step, and check it reads under 1 Ω across its spades."
      ],
      warn:"It replaces the stock fuse in the circuit; nothing ever bypasses a thermal fuse."
    },
    p3k:{
      how:[
        "If you tipped the boiler up: lower it back onto its seat, keeping wires and hoses from getting pinched.",
        "Refit the four 4 mm screws from below, snug and even.",
        "Refit the steam wand and knob."
      ],
      ok:"The boiler sits square, nothing is pinched, and the thermocouple's lead is still free."
    },
    p3d:{
      how:[
        "Run the thermocouple lead to the front of the machine, around the boiler, and back along the right side to where the PCB will sit.",
        "Don't take it back behind the pump area.",
        "Mains wires run on the left side and above this lead; low-voltage wires and sensors stay on the right."
      ],
      links:[["Part guide: thermocouple","gtc#tc/5"]]
    },
    p3e:{
      how:[
        "**Pressure tap block:** a small block clamped between the group head and its inlet connector, with the sensor on a short tube. No hose cutting.",
        "**T-fitting:** the line from the pump to the boiler is cut and a T goes in, with the sensor on a short branch.",
        "Use the one your kit came with. Both fit every Classic and Pro-family model, and both are on the next steps."
      ],
      links:[["Part guide: pressure sensor","gps"]]
    },
    p3i:{
      need:"The pressure sensor, its fitting, the small flat white O-ring (11 mm across), and a spanner.",
      how:[
        "Press the white O-ring into the fitting's threaded socket and push it down until it sits flush at the bottom.",
        "Screw the sensor in by hand until it stops.",
        "At most a quarter turn more with a spanner, and only if you want it. Never more."
      ],
      warn:"Overtightening crushes the O-ring or stops the reading. The sensor's own green base O-ring often can't reach the fitting's face: the white one makes the seal.",
      pics:[["Sensor and fittings","XF"],["Sensor and fittings, Pro-family T","XFGCP","fam:GCP"]]
    },
    p3h:{
      need:"The tap block, its two fittings, 4 × 6 mm PTFE tube, the 010 O-ring, two M5 × 25 screws, a sharp blade and a towel.",
      how:[
        "Skip this step if you're using a T-fitting.",
        "Cut 40 mm of PTFE tube with both ends square.",
        "Screw the small push-in fitting (PC 6-M5) into the block, hand tight. Look along the block's water hole: the fitting's thread may poke into it by less than 1 mm, a quarter of the hole, no more.",
        "Push the tube fully into the fitting, and fit the O-ring in the block.",
        "Towel under the group: undo the two M5 screws that hold the inlet connector to the group, and take it off. A little water will run out.",
        ["On a Classic, the inlet connector is the metal OPV: the block goes between it and the group.","fam:GC"],
        "Clamp the block between the group and the inlet connector with the two M5 × 25 screws, both O-rings facing the group. Tighten the two screws evenly.",
        "Push the sensor's fitting onto the tube until the tube is fully home. The sensor mustn't touch any metal."
      ],
      pics:[["Block and tube","PTBA"],["Inlet connector off","INL"],["Block clamped in","PTBC"],["Finished","PTBF"]],
      links:[["Part guide: pressure sensor","gps"]]
    },
    p3f:{
      need:"The PE 6 mm push-to-connect T, the PLF 6-02 sensor fitting, 4 × 6 mm PTFE tube and a sharp blade.",
      how:[
        "Skip this step if you're using the tap block.",
        "Find the PTFE tube from the pump to the boiler.",
        "Cut it square, nearer the boiler but high enough that the T will stand mostly upright, not lying flat.",
        "Push each cut end into the T until it goes past the ring of teeth and then the O-ring inside. Push hard: a rubber glove or a wrap of silicone tape helps your grip. Not fully home means a leak.",
        "Cut 200 to 250 mm of PTFE tube for the branch, and push it fully into the T's third port and into the sensor's fitting."
      ],
      pics:[["Classic T-fitting","TEEGC"]],
      links:[["Part guide: pressure sensor","gps"]]
    },
    p3g:{
      need:"The 6 mm barbed T, the barbed sensor fitting, high-pressure braided hose, hose clamps and their pliers, and a sharp blade.",
      how:[
        "Skip this step if you're using the tap block.",
        "Find the braided hose from the pump to the boiler.",
        "Cut it square about 65 mm above where it joins the boiler.",
        "Slide a loose hose clamp onto each cut end.",
        "Push the barbed T into both ends, all the way over the barbs. A rubber glove helps your grip, and a little water-based lubricant if it won't go.",
        "Set each clamp over the middle of its barb and close it with the pliers.",
        "Cut 200 to 250 mm of the same hose for the branch, and clamp it onto the T's third barb and the sensor fitting the same way."
      ],
      pics:[["Pro-family T-fitting","TEEGCP"]],
      links:[["Part guide: pressure sensor","gps"]]
    },
    p3j:{
      how:[
        "Lay the sensor at the base of the machine, lower than the T or the block.",
        "It mustn't touch metal.",
        "If its readings turn out noisy later, wrap it in foam or fix it to the frame with adhesive.",
        "Run its cable along the right side, with the other low-voltage wires."
      ],
      pics:[["Foam-wrapped sensor","FOAM"]]
    },
    /* ---------------- Phase 4 ---------------- */
    p4a:{
      need:"The SSR, an M4 × 10 (or 8-32) screw, washer and nut, and a screwdriver.",
      how:[
        "Hold the SSR against the back wall, its metal base flat on the metal.",
        ["Leave room above it for the funnel piece and its screw.","fam:GCP"],
        "Keep it clear of the pump and its housing.",
        "Put the screw through the SSR's mounting hole and the wall, add the washer and nut on the other side, and tighten."
      ],
      ok:"The SSR doesn't move, and nothing touches its terminals.",
      pics:[["SSR on the back wall, Classic Pro","SSRGCP","fam:GCP"],["SSR on the back wall, Classic","SSRGC","fam:GC"]]
    },
    p4b:{
      need:"Wires Sa and Sb.",
      how:[
        "Pull Sa and Sb off the steam thermostat on the boiler, if they aren't off already.",
        "Put wire Sa's fork under one of the SSR's two AC load screws (usually marked 1 and 2), and wire Sb's fork under the other. Either way round.",
        "Tighten each screw firmly on its fork.",
        "Push stock connector Sa onto wire Sa's male spade, and Sb onto wire Sb's.",
        "The steam thermostat is now out of the circuit: leave it in place, or unscrew it with the 17 mm spanner."
      ],
      warn:"Joints that sit on or near the boiler need bare spades under silicone, not nylon-insulated ones.",
      pics:[["Sa and Sb on the SSR, Classic Pro","SSRGCP","fam:GCP"],["Sa and Sb on the SSR, Classic","SSRGC","fam:GC"]],
      links:[["Part guide: SSR","gssr#ssr/SI/3"]]
    },
    p4c:{
      need:"Wires 3, P and N.",
      how:[
        "Unplug the stock wire Pb from the pump.",
        "Push Pb onto wire 3's male spade. Wire 3's other end goes on the PCB's 3 tab (J13) in a later step.",
        "Push wire P's female spade onto the pump terminal Pb came off. Its other end goes on the PCB's P tab (J12).",
        ["Pull Pa off the pump's other terminal, push wire N's piggyback spade onto that terminal, then plug Pa back onto the piggyback's tab. N's other end goes on the PCB's N tab (J10).","fam:GCP"],
        ["Pull the stock connector off the pump's other terminal (Pa on a 120 V Classic, F on a 230 V one), push wire N's piggyback spade onto that terminal, then plug the stock connector back onto the piggyback's tab. N's other end goes on the PCB's N tab (J10).","fam:GC"]
      ],
      ok:"Pb on wire 3, wire P on the pump, and N sharing the pump's other terminal.",
      pics:[["Pump area, Classic Pro","PAREAGCP","fam:GCP"],["Pump area, Classic","PAREAGC","fam:GC"]]
    },
    p4d:{
      how:[
        "Unplug P1-2, the brew switch's common, from the switch housing, and plug it onto wire L's male spade. L's other end goes on the PCB's L tab (J11).",
        "Unplug connectors 1, 2, 3 and P3-4 and park them: cover each end with silicone tape or heat shrink, and tie it down where it can't touch anything. Where a connector holds two wires, leave them joined in it.",
        ["At 120 V, connectors 2 and 3 still join wires that carry heater current (3 links the power switch to Ba, 2 links Sa to an element): don't cut either off.","volts:120"],
        ["At 230 V, connector 3 still joins the power switch to P1-2, so L's feed passes through it: don't cut it off.","volts:230"]
      ],
      warn:"All four parked connectors stay live whenever the machine is on. Steam P(5-6) and 6 still carry mains too: the valve's feed runs through them.",
      pics:[["Line to the brew switch, Classic","LGC"]]
    },
    p4e:{
      how:[
        ["Evo and E24: the connectors are already out of their block, insulated and labeled (Phase 2).","model:EVO,E24"],
        "Brew switch: unplug B4 from spade 4 and plug it onto wire L's male spade. L's other end goes on the PCB's L tab (J11). Spade 4 stays empty.",
        "Steam switch: move S4 from spade 4 to spade 1.",
        "Steam switch: unplug S5 and park it: cover its end with silicone tape or heat shrink, and tie it down where it can't touch anything.",
        "Brew spades 1 and 2 and steam spades 4 and 5 are now free for the low-voltage wires."
      ],
      warn:"Brew spade 4 stays live whenever brew is on and the valve is open. S5, and steam spades 1 to 3, carry mains. Keep everything clear of them.",
      pics:[["Line to the brew switch, Classic Pro","LGCP"]],
      links:[["Part guide: switches","gsw"]]
    },
    p4f:{
      how:[
        ["J7 B onto brew spade 1.","fam:GCP"],
        ["J7 GND and the ground jumper, sharing one spade, onto brew spade 2. The jumper's other end onto steam spade 5.","fam:GCP"],
        ["J7 S onto steam spade 4.","fam:GCP"],
        ["J7 B onto brew spade 1, and J7 S onto steam spade 3.","fam:GC"],
        ["J7 GND and the ground jumper, sharing one spade, onto steam P(3-4). The jumper's other end onto brew P(1-2).","fam:GC"],
        "Run these wires down the right side, away from the mains wires. Their plug goes into J7 when everything goes into the PCB.",
        "Unplugged, with the J7 plug out: brew on reads close to 0 Ω from J7 B to J7 GND, and open with brew off. Steam does the same on J7 S."
      ],
      warn:"Low-voltage wires go only on the spades named here. The others still carry mains.",
      ok:"Checks [f1](checks#f1) to [f4](checks#f4) pass.",
      pics:[["Low-voltage switch wires, Classic Pro","LVSWGCP","fam:GCP"],["Low-voltage switch wires, Classic","LVSWGC","fam:GC"]],
      links:[["Part guide: switches","gsw"]]
    },
    p4g:{
      how:[
        ["Every stock connector you unplugged and didn't reconnect: S5.","fam:GCP"],
        ["Every stock connector you unplugged and didn't reconnect: 1, 2, 3 and P3-4.","fam:GC"],
        "Cover all its metal with self-fusing silicone tape or heat shrink, leaving nothing exposed.",
        "Zip-tie it where it can't drift onto the boiler, the wand or another spade."
      ],
      warn:"They're still live whenever the machine is on."
    },
    p4h:{
      need:"The SSR, an M4 × 10 (or 8-32) screw, washer and nut, and a screwdriver.",
      how:[
        "Hold the SSR against the back wall, its metal base flat on the metal, with its mounting hole over a vent slot.",
        ["Leave room above it for the funnel piece and its screw.","fam:GCP"],
        "Keep it clear of the pump and the pump housing.",
        "Put the screw through the SSR and the vent slot, add the washer and nut, and tighten."
      ],
      ok:"The SSR doesn't move, and nothing touches its terminals.",
      pics:[["SSR mounted","SSRCW"]],
      links:[["Part guide: SSR","gssr#ssr/CW/1"]]
    },
    p4i:{
      how:[
        "Work from the [wiring page](wiring) with Your Gaggia set: its list gives every run with both ends, and its map shows where each lands.",
        "Fit one run at a time, and tick it off on the [cut list](cut).",
        "Mains runs on the left side, above the thermocouple lead; low-voltage wires on the right.",
        "Where two runs share a terminal, they share one spade or fork sized for two.",
        "The PCB's four mains tabs go last: N (J10), L (J11), P (J12) and 3 (J13). Check each against the wiring page before you push it on."
      ],
      ok:"Every run on the cut list is ticked, and each end matches the wiring page.",
      links:[["Cut list","cut"]]
    },
    p4s:{links:[["Part guide: Shelly","gshl"]]},
    p4s2:{links:[["Part guide: Shelly","gshl"]]},
    p4p:{
      how:[
        "Put the PCB in its printed housing, if it isn't already.",
        "Set it in the control area on the right side of the case, where the thermocouple lead and the low-voltage wires arrive, clear of the boiler, the pump and anything that can drip on it.",
        "Fix it so it can't slide around. The official guide only asks that it be held securely; heat-rated double-sided tape, or a zip tie through the housing, are common ways (this site's suggestion)."
      ],
      pics:[["Finished inside, Classic Pro","FINGCP","fam:GCP"],["Finished inside, Classic","FINGC","fam:GC"]]
    },
    p4q:{
      how:[
        "Thermocouple into J4, as on the bench: folded ends, and + and − the way they passed the warm-hand test.",
        "Pressure sensor into J6, screen cable into J1, switch wires into J7, SSR control into J9, and the ToFnLED into J2 if you have one.",
        ["The mains wires onto the PCB's tabs: N on J10, L on J11, P on J12 and 3 on J13.","wpath:SI"],
        "Leave a little slack on each, so the PCB can come out without pulling anything."
      ],
      ok:"Every plug fully home, and the four mains tabs match the wiring page: check [g10](checks#g10)."
    },
    p4k:{
      how:[
        "Mains wires go on the left side of the case, above the thermocouple lead.",
        "Low-voltage wires (switches, SSR control, sensors, screen) go on the right.",
        "Look at every wire near the boiler and the steam wand: only silicone-jacketed wire rated to 200 °C may touch them."
      ]
    },
    p4l:{
      how:[
        "The cable's PCB end is already in J1. Feed its screen end out through the vent your mount uses (Phase 5's photos show each). The small screen-end plug fits through gaps the PCB end won't.",
        "Where it passes the vent's sharp edge, slide a short length of heat shrink over the cable and leave it unshrunk: a sleeve, so the edge can't cut the soft silicone jacket (this site's advice; check g13 asks for it).",
        ["Headless: route the cable to where the board will sit. The official guide recommends the left vent on every Classic model.","scr:hl"],
        "No ST-Link needs to stay inside: PCB v4 updates over Wi-Fi. If your kit came with one, keep it in a drawer for a wired recovery."
      ]
    },
    p4m:{
      how:[
        "Zip-tie the mains bundle and the low-voltage bundle, each on its own side.",
        "Nothing loose may be able to drift onto the boiler, the wand or a spade.",
        "Trim the zip-tie tails."
      ],
      pics:[["Finished inside, Classic Pro","FINGCP","fam:GCP"],["Finished inside, Classic","FINGC","fam:GC"]]
    },
    p4z:{
      how:[
        "Open [Power-on checks](checks) with Your Gaggia set, on a phone or tablet beside the machine: it shows only your checks.",
        "Cord out of the wall and out of the machine for every check in this phase.",
        "Set the meter to its lowest Ω range, or continuity. Touch the probes together and enter that reading where the page asks.",
        "Work through each section in order up to Covers on. Type each reading in and the page marks it pass or fail.",
        "A fail: use the hint under that check to fix it, then measure again. Don't skip past a fail.",
        "A few checks ask you to unclamp the thermocouple from J4, or unplug J7 and J9, for a moment. Put each back as it was straight after, with the same + and − on J4.",
        "Have someone else trace the wiring against the wiring page too: a second pair of eyes catches what you've stopped seeing.",
        "Covers on, the last section, waits for Phase 5."
      ],
      warn:"Don't plug in until every check passes, Covers on included."
    },
    /* ---------------- Phase 5 ---------------- */
    p5a:{
      need:[["The printed housing for your screen and the mount you're using, Kapton tape, a small screwdriver,","scr:p4,s3"],["and six 20 × 10 × 3 mm magnets with super glue or epoxy (front mount; on a case magnets won't stick to, double-sided tape rated for 80 °C or more instead),","scr:p4,s3;mnt:front"],["and three M3 × 30 socket head screws, five M3 washers (7 mm across or less), five M3 split lock washers, two M3 nylock nuts, one M3 heat-set insert and super glue or epoxy, plus a soldering iron if the insert isn't in yet (funnel mount),","scr:p4,s3;mnt:funnel"],["and two M3 × 30 socket head screws, four M3 washers (7 mm across or less), four M3 split lock washers and two M3 nylock nuts (rear mount).","scr:p4,s3;mnt:rear"],["The headless board and its housing. The vent-clip housing, recommended for every Classic, needs nothing else; the magnet version needs two magnets and super glue or high-temperature double-sided tape.","scr:hl"]],
      how:[
        ["The cable's PCB end is already in J1 and its screen end out of the machine (Phase 4).","scr:p4,s3"],
        ["Assemble the screen housing: the screen goes into the printed housing with four small screws, as the official photo shows. Dry-fit it first and peel the adhesive's release liner only when everything lines up: once it's stuck, it's hard to take apart without damaging the adhesive.","scr:p4"],
        ["Over a steel surface, glue the magnets into the front mount, two per pocket.","scr:p4,s3;mnt:front"],
        ["Route the wires through the gap in the housing, as the official photo shows.","scr:p4,s3;mnt:front"],
        ["Pass the cable through the front mount, then the housing back, and plug it into the screen's socket marked 5V, IO28, IO27, GND, pin by pin. Keep the wires off the screen board's large components; Kapton tape can hold them.","scr:p4;mnt:front"],
        ["Pass the cable through the front mount, then the housing back, and plug its two small plugs into the screen, pin by pin, as on the bench. Keep the wires off the large components; Kapton tape can hold them.","scr:s3;mnt:front"],
        ["Put a screwdriver in the pry slot on the back of the funnel cover and gently slide its lid off.","scr:p4,s3;mnt:funnel"],
        ["If the heat-set insert isn't already in, set it with the soldering iron. Then press the latch into the cover plate by hand. It locks the screen's rotation; pressing it lets you swing the screen aside to fill the tank.","scr:p4,s3;mnt:funnel"],
        ["Route the wires through the vent as the official photo shows. Centered works; shifted to one side gives more clearance from the mains wiring.","scr:p4,s3;mnt:funnel"],
        ["Route the wires through the back vent in exactly the spot, and on the side of the rear mount, that the official photo shows: that's what centers the screen.","scr:p4,s3;mnt:rear"],
        ["Plug the cable into the screen's socket marked 5V, IO28, IO27, GND, pin by pin. The official photos show the socket reachable through the opening at the top of the housing back.","scr:p4;mnt:funnel"],
        ["Pass the cable through the housing back and plug its two small plugs into the screen, pin by pin. Keep the wires off the large components; Kapton tape can hold them.","scr:s3;mnt:funnel"],
        ["Pass the cable through the rear mount, then the housing back, and plug its two small plugs into the screen, pin by pin. Keep the wires off the large components; Kapton tape can hold them.","scr:s3;mnt:rear"],
        ["Set the screen onto the housing's upper posts first (they hold it), then lower it in. The wires must sit below the surface of the housing and the screen board, not pinched under the connectors.","scr:s3"],
        ["Front cover on: top edge first, the side with the thinner bezel. Check no wire is in the way, then snap the bottom edge on. To take it off later, use the fingernail slots.","scr:s3"],
        ["Line the mount up with the housing, press its clip down gently, and push the mount forward until the clip springs back into place. Keep the wires centered, without much slack, so they don't get pinched.","scr:p4,s3;mnt:front"],
        ["Stand it on the front of the machine, where the magnets hold it. Tidy the cable as the official photo shows, feed the spare length back inside, and tape the cable down with Kapton or another high-temperature tape.","scr:p4,s3;mnt:front"],
        ["Line the adjustable plate up with the housing, press its clip down gently, and push the plate forward until the clip springs back into place.","scr:p4;mnt:funnel,rear"],
        ["Tape the wires in place, line the adjustable plate up with the housing, press its clip down gently, and push the plate forward until the clip springs back. Check the wires are in the gap, then take the tape off.","scr:s3;mnt:funnel,rear"],
        ["Bring the screen wires up through the right side of the rear mount, then plug the cable into the screen's socket marked 5V, IO28, IO27, GND, pin by pin, through the opening at the top of the housing back.","scr:p4;mnt:rear"],
        ["Fix the swivel to the plate with the screws, washers, lock washers and nylock nuts, in the washer order the official photo shows, so the lock washers can't cut into the print. The lock washers act as springs: tighten until the angle moves by hand and stays where you leave it.","scr:p4,s3;mnt:funnel"],
        ["Fix the rear mount to the plate with the screws, washers, lock washers and nylock nuts, in the washer order the official photo shows. The lock washers act as springs: tighten until the angle moves by hand and stays where you leave it.","scr:p4,s3;mnt:rear"],
        ["Zip-tie the wires in place, if you like. If the swivel's screw works loose over time, a tiny drop of plastic-safe threadlocker on the insert's thread holds it.","scr:p4,s3;mnt:funnel"],
        ["The mount goes onto the machine once the funnel and cup warmer are back on: that's the next step.","scr:p4,s3;mnt:funnel,rear"],
        ["Magnet version: glue the magnets to the back of the housing with super glue or high-temperature double-sided tape.","scr:hl"],
        ["The cable's PCB end is already in J1, routed to where the board will sit.","scr:hl"],
        ["Plug the cable into the headless board first, then slide the board into its housing until it's fully seated. The housing is made so its cover can't close if the board isn't in place.","scr:hl"],
        ["Close the cover and fix the housing to the machine: clip it into the vent, or set the magnets on the case. The official guide recommends the left vent on every Classic.","scr:hl"]
      ],
      ok:[["The screen sits square on its mount, with no wire pinched and the cable taped down where it runs outside.","scr:p4,s3"],["The headless housing is closed and fixed, its cable clear of anything hot.","scr:hl"]],
      pics:[["Gen 3.5 and Gen 3 screens side by side","CMP"],["Mounts for the Gen 3.5 screen","M35","scr:p4"],["Mounts for the Gen 3 screen","M3","scr:s3"],["Gen 3.5 housing assembly","H35","scr:p4"],["Front mount magnets","FMAG","scr:p4,s3;mnt:front"],["Wires through the housing gap","FGAP","scr:p4,s3;mnt:front"],["Gen 3.5 front mount wires","FW35","scr:p4;mnt:front"],["Gen 3.5 front mount clipped on","FA35","scr:p4;mnt:front"],["Gen 3 cable plugged in, front mount","FPLUG3","scr:s3;mnt:front"],["Gen 3 front mount clipped on","FCLIP3","scr:s3;mnt:front"],["Front mount on the machine","FON","scr:p4,s3;mnt:front"],["Funnel cover's pry slot","NPRY","scr:p4,s3;mnt:funnel"],["Insert and latch","NLATCH","scr:p4,s3;mnt:funnel"],["Wires through the vent, funnel mount","NVENT","scr:p4,s3;mnt:funnel"],["Gen 3 cable plugged in, funnel mount","NPLUG3","scr:s3;mnt:funnel"],["Wires through the vent, rear mount","RVENT","scr:p4,s3;mnt:rear"],["Gen 3 cable plugged in, rear mount","RPLUG3","scr:s3;mnt:rear"],["Gen 3 screen onto its posts","POSTS3","scr:s3"],["Gen 3 front cover","COVER3","scr:s3"],["Gen 3.5 adjustable plate","ADJ35","scr:p4;mnt:funnel,rear"],["Gen 3 adjustable plate","ADJ3","scr:s3;mnt:funnel,rear"],["Swivel washer order","SWIV","scr:p4,s3;mnt:funnel"],["Rear mount washer order","RMOUNT","scr:p4,s3;mnt:rear"],["Gen 3.5 funnel wires tied","NZIP35","scr:p4;mnt:funnel"],["Gen 3 funnel wires tied","NZIP3","scr:s3;mnt:funnel"],["Headless magnets","HLMAG","scr:hl"],["Headless cable to the left vent","HLROUTE","scr:hl"],["Headless board seated","HLSEAT","scr:hl"],["Headless housing on the machine","HLON","scr:hl"]]
    },
    p5b:{
      how:[
        "Put the water funnel back, then the cup warmer plate. Reconnect every earth wire you unplugged in Phase 2 as its part goes on: your photos show where (check h1).",
        "Refit the two top screws.",
        ["Set the funnel mount onto the funnel.","scr:p4,s3;mnt:funnel"],
        ["Hook the rear mount's upper features into the vent, clip its bottom side in, and push on the back of the latch handles until they're fully home.","scr:p4,s3;mnt:rear"],
        "Cord still out: run **Covers on**, the last section of the [power-on checks](checks). It proves the cup warmer is earthed again and nothing got pinched as the covers went on."
      ],
      warn:"An earth wire left off leaves that metal unearthed. Check [h2](checks#h2) catches it on the cup warmer.",
      ok:"Every Covers on check passes.",
      pics:[["Cup warmer back on","CUPON"],["Funnel mount on the funnel","NON","scr:p4,s3;mnt:funnel"],["Rear mount clipped into the vent","RON","scr:p4,s3;mnt:rear"]]
    },
    p5c:{
      how:[
        "Fill the water tank and put it back.",
        "Drip tray in.",
        "Portafilter out, and a cup or jug under the group head.",
        "Steam knob closed."
      ]
    },
    p5d:{
      how:[
        "Plug the cord into the machine first, then into a {outlet}.",
        "Stay within reach of the plug for this whole first session.",
        "Switch on. The lamps and the screen come on, and the screen shows \"Filling boiler\".",
        "At any smell, smoke, crackle, a tripped breaker or {gfci}, or an odd noise: unplug at the wall first, find out why after."
      ],
      warn:"Never run it with a cover off or a check unpassed."
    },
    p5e:{
      how:[
        "On the home screen, tap **Flush**. The circle inside the button lights green: flush mode is on.",
        "Turn the brew switch on. The pump runs and fills the boiler first.",
        "Keep it running until water comes out of the group head for 5 seconds or more.",
        "Turn brew off, then tap Flush again to leave flush mode.",
        "No water after about 30 seconds? Brew off, check the tank is seated and its tube is in the water, and try again (this site's tip)."
      ],
      ok:"Water ran from the group for 5 seconds or more: the boiler is full."
    },
    p5f:{
      how:[
        "Watch the temperature on the home screen. With the boiler full, it must climb while the SSR's LED is on.",
        "If it falls instead, switch off and unplug at once: the thermocouple wires are reversed at J4. Swap them (unplugged), and rerun Covers on before you plug back in.",
        "It reaches the brew target in a few minutes and holds there."
      ],
      ok:"The temperature climbs and settles on the target."
    },
    p5g:{
      how:[
        "Skip this if you used the tap block.",
        "In the web UI, open the community profiles and download **[UT] Tube Fill**. They're also on the [Gaggiuino GitHub](https://github.com/Zer0-bit/gaggiuino/tree/community/profiles).",
        "Select it as the active profile, put a cup under the group with the portafilter out, and run it with the brew switch, following any instructions it shows.",
        "Brew off when it's done."
      ],
      ok:"The branch to the sensor is full of water, with no air: the pressure reading moves smoothly."
    },
    p5h:{
      how:[
        "Skip this if you used a T-fitting.",
        "Portafilter out, a cup under the group: tap Flush, run it for 10 seconds with the brew switch, brew off. That fills the block and its tube.",
        "Lock in a portafilter with a blank basket and run Flush again: the pressure should rise. The next step is the real test."
      ]
    },
    p5i:{
      need:"A portafilter with a blank (blind) basket.",
      how:[
        "Lock the portafilter with the blank basket into the group.",
        "Download **[UT] Test OPV** from the community profiles, select it, and run it with the brew switch.",
        "Watch the pressure: its peak must land between 10.5 and 13 bar.",
        "While it runs, water should move through the OPV's tube, and nothing may leak.",
        "Brew off, then take the portafilter out carefully: it's hot."
      ],
      ok:"Peak 10.5 to 13 bar, water moving through the OPV tube, no leaks."
    },
    p5j:{
      how:[
        "Switch off, unplug, and let it cool.",
        "Open the OPV, add one more M3 washer, close it up.",
        "Close the machine and rerun Covers on before plugging back in.",
        "Run [UT] Test OPV again. The machine-specific guide aims the OPV itself at 10 to 12 bar; the 10.5 to 13 bar test is the one to pass."
      ]
    },
    p5k:{
      how:[
        "Switch off and unplug from the wall first.",
        "Undo the two top screws and lift the cup warmer just enough to see in.",
        "Touch a dry paper towel to each new joint: the T or the tap block, the sensor and its fitting, the thermocouple. A damp spot is a leak.",
        "Reseat or snug that joint, unplugged. Never more than a quarter turn past hand tight on the sensor.",
        {t:["Close it up, earth wires on, and rerun Covers on, h1 to h6",[", and h7 for the Shelly,","shelly"],"before you plug back in."]}
      ]
    },
    p5l:{
      how:[
        "Brew on with a cup under the group: the pump runs and water comes through the group. Brew off.",
        "Steam on: the target switches to the steam temperature, and the temperature ring pulses above 120 °C as a warning. Steam off.",
        "Brew and steam on together: hot water mode, the same as the stock machine. Both off."
      ],
      warn:"Above 120 °C, steam, the wand and the group head can burn."
    },
    p5m:{
      how:[
        "Leave it on, untouched, for 10 to 15 minutes: that's how long a Gaggia with Gaggiuino takes to reach thermal equilibrium.",
        "Anything odd, from a dark screen to a temperature that won't settle: [Troubleshooting](trouble) goes symptom by symptom."
      ]
    },
    /* ---------------- Phase 6 ---------------- */
    p6a:{
      how:[
        "In the web UI, download **[UT] PZ Cal** from the community profiles and select it.",
        "Follow the instructions in the profile.",
        "The result is Pump Zero: how much water your pump moves per pulse at 0 bar. It's under Settings, System.",
        "Later, with hardware or Bluetooth scales, you can refine it: compare pump flow with weight flow during a steady shot above 4 bar and 1 ml/s (the manual's tip)."
      ]
    },
    p6b:{
      how:[
        "Settings, Boiler: leave Steam Temperature, DreamSteam, Temperature Offset, Brew Delta and the Advanced values (HPWR, Main Divider, Brew Divider) as they are.",
        "The manual recommends the defaults for the Gaggia Classic and the Classic Pro family."
      ]
    },
    p6c:{
      how:[
        "Temperature Offset corrects the brew temperature against the real temperature at the puck.",
        "Leave it at its default unless you can measure at the group head, for example with a Scace-type device."
      ]
    },
    p6d:{
      how:[
        "Settings, System: set the time zone offset, in minutes.",
        "Keep Gaggiuino on your home Wi-Fi, so it can fetch the time.",
        "For shot history: with the machine off, put a microSD card (1 to 8 GB, formatted FAT32) in the interface's SD card slot.",
        ["The official low-voltage drawing shows the slot on the back of the Gen 3.5 screen.","scr:p4"],
        ["The official low-voltage drawing shows the slot on the back of the headless board.","scr:hl"],
        ["The official drawing doesn't show where the Gen 3 screen's slot is: ask in your help thread if you can't find it.","scr:s3"],
        "After changing settings, tap the save icon once: \"Settings persisted\" confirms it."
      ]
    },
    p6e:{
      how:[
        "Web UI, Settings, Scales: enable hardware scales, turn the other scale types off, and open Calibrate.",
        "Find which load cell is which, then calibrate each against a known 200 to 400 g object, as the [scales guide](gscl#scl/11) shows.",
        "Save, and wait for \"Persisted settings\"."
      ]
    },
    p6f:{
      how:[
        "Tank level shows on the home screen in percent, with a reminder below 20%.",
        "Settings, LED: Enable, then choose a color and brightness.",
        "If the level reads wrong, check the sensor's protective film is off and nothing sits in its view: the [ToFnLED guide](gtof) has the details."
      ]
    },
    /* ---------------- Phase 7 ---------------- */
    p7a:{
      how:[
        "Switch off and unplug from the wall first.",
        "Zip ties where they're needed, and Kapton tape to hold the screen cable where it runs.",
        {t:["Close it up, earth wires on, and rerun Covers on, h1 to h6",[", and h7 for the Shelly,","shelly"],"before you plug back in."]}
      ]
    },
    p7f:{
      how:[
        "Pick a profile on the home screen: swipe across the profile names.",
        "Dial in by the profile's targets, not a stock 25 to 30 second shot time.",
        "Profiles with pre-infusion and soak need a finer grind than stock to reach the same pressure.",
        "With stop-on-weight, the shot stops a little early on purpose: the last of it is still on its way to the cup.",
        "With Brew Delta on, the boiler reads high after a shot: wait for it to settle before the next one."
      ]
    },
    p7b:{
      how:[
        "Film your first start: switch-on to heated up.",
        "Film your first shot.",
        "Post them in #first-start and #first-shot on the Gaggiuino Discord."
      ]
    },
    p7c:{
      how:[
        "**Backflush:** blind basket in the portafilter, and optionally the shower screen off and some Cafiza in the basket. Lock it in, tap Flush, brew on, and let it cycle until the water runs clear. Brew off, then tap Flush to leave flush mode.",
        "**Descale, part 1:** empty the drip tray. Fill the tank to the max line with descaling solution (water and citric acid). Lock in the blind basket, put a 2 L container under the steam wand, and open the steam knob a quarter turn.",
        "**Descale, part 2:** tap Descale (its circle turns green) and turn brew on. It runs until the tank is empty, about 30 minutes. With a ToFnLED it stops by itself.",
        "**Descale, part 3:** brew off. Clean the tank, fill it with fresh water to the max line, and run the cycle again with the brew switch until the tank is empty."
      ]
    },
    p7d:{
      how:[
        "Pump Zero, any offset you set, your favorite profiles and grind settings.",
        "Anything you'd do differently next time, and which wire colors ended where."
      ]
    },
    p7e:{
      how:[
        "Hardware scales: the [scales guide](gscl) on this site, step by step.",
        "ToFnLED: the [ToFnLED guide](gtof) on this site."
      ]
    }
  };
  /* photo keys in pics resolve to the addresses above */
  var PICL={};Object.keys(PIC).forEach(function(k){PICL[k.toLowerCase()]=PIC[k]});
  Object.keys(HOW).forEach(function(k){var h=HOW[k];if(h.pics)h.pics=h.pics.map(function(p){var u=PICL[String(p[1]).toLowerCase()];return u?[p[0],u,p[2]]:p})});
