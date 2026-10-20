# What each Gaggia changes for the build

The official Gaggiuino guide is written for the Gaggia Classic family, so every supported model has an official install path. What changes from one model to the next is small but easy to miss: grounding, the over-pressure valve, the Eco board, the switch connectors and how the pressure sensor taps in. This page collects those differences in one place. Sources are marked **[Official]** (gaggiuino.github.io, read October 2026 at commit acc4258 of the docs repo), **[Gaggia]** (Gaggia's 2018 service manual, its factory wiring diagrams and parts lists) or **[Owners]** (retailers, Coffee Forums and Coffeeblog). See `which-gaggia.html` to identify your machine.

## The models at a glance

| Model | Years | Label | What it needs |
|---|---|---|---|
| Classic, 120 V | 1991 to 2018 | SIN035, RI9303 | The grounding retrofit if it still has a two-pin cord |
| Classic, 230 V | 1991 to 2014 | SIN035, RI9303 | Nothing extra |
| Classic 2015 / V2 | 2015 to 2018 | SIN035U, RI9403 | Not supported: no 3-way valve |
| Classic Pro, 120 V | 2019 to 2022 | SIN035R, RI9380 | Nothing extra |
| Classic Pro, 230 V without Eco board | 2019 to 2022 | SIN035R, RI9380 | Nothing extra; uncommon |
| Classic Pro Eco, 230 V | 2019 to 2022 | SIN035UR, RI9480 | Power switch mod; custom wiring recommended |
| Evo Pro and E24, 120 V | 2023 on | SIN035R, RI9380 | OPV raised to 10 to 12 bar; combined connectors insulated for stock integration |
| Evo and E24, 230 V | 2023 on | SIN035UR, RI9481 | Power switch mod; custom wiring recommended |

**[Official]** The table follows the compatibility table in the docs. The docs group the machines as the Gaggia Classic (GC) and the Gaggia Classic Pro (GCP), which "generally includes the Pro, Eco, Evo, and E24 models", and the Discord help channels split the same way: #install-help-gc and #install-help-gcp.

## Install path

- **Stock wiring integration** keeps the factory harness and adds seven wires: J, Sa, Sb, 3, P, L and N. Official drawings exist for the 120 V Classic Pro family and the Classic at 120 V and 230 V. **[Official]**
- **Custom wiring** replaces the harness with a new one, using the stock lamps, element leads and fuses. Official drawings exist for both families at both voltages. **[Official]**
- **230 V Pro family with the Eco board:** the docs say stock integration "is not recommended" and point to custom wiring, which leaves the board out of the circuit. The current guide has no stock integration drawing for any 230 V Pro-family machine; the docs' archive keeps an older Eco-board one alongside the same advice to use custom wiring. **[Official]**
- Stock wiring colors and connector positions vary between machines, especially at the pump. Check yours against the drawing before moving anything. **[Official]** The [wiring map](wiring.html#map?path=SI) shows the drawing for your model.

## Classic (1991 to 2014, US to 2018)

- **Grounding.** Most US Classics left the factory with a two-pin cord and no earth. The official retrofit: a C14 three-pin panel inlet (Schurter 6100.4312 or 6100.4315), a right-angle 5-15P to C13 cord of 14 to 16 gauge, and green 16 to 18 AWG silicone wire from the inlet to the boiler fuse clip and on to the cup tray. Spades on the boiler must be uninsulated, because pre-insulated spade insulation melts there. **[Official]**
- **Live and neutral can be swapped at the inlet** on a number of machines. It makes no difference stock, but it can for stock integration, so trace yours. **[Official]**
- **The boiler's 184 °C thermal fuse sits in the neutral feed to the whole machine**, on top of the boiler. If it blows, everything goes dark, the PCB included, because in stock integration the PCB's neutral comes through it. **[Gaggia]** drawing 17800009, traced; **[Official]** stock integration drawings.
- **The power switch is single-pole**, and the three switches share one molded housing with the lamps inside. **[Gaggia]**
- **Stock integration** unplugs P1-2 (the brew switch's common) onto wire L, and parks connectors 1, 2, 3 and P3-4. All four stay live. On 120 V, 2 and 3 each still join two wires that carry heater current; on 230 V, 3 carries the PCB's line. Insulate them and tie them down, and never cut them off. The guide's wire table says "B4" for L's far end, which is the Pro's name; on the Classic drawings L meets P1-2. **[Official]** drawings, traced.
- **OPV.** A metal valve bolted to the group inlet beside the solenoid, adjustable under a 17 mm cap with a 5 mm hex key. One owners' guide reports about 14 bar from the factory; the official startup test wants a peak of 10.5 to 13 bar, so check yours and turn it down if it's high. **[Owners]** Coffee Forums; **[Official]** startup steps.
- **Pressure sensor.** Cut the PTFE tube between pump and boiler, nearer the boiler but high enough that the T stands mostly upright, and fit a push-to-connect T (PE/6 mm). A 200 to 250 mm length of tube runs down to the sensor. Or fit the pressure tap block between the group and that metal valve. **[Official]**
- **Power** on 230 V machines was 1425 W on early ones, then 1300 W, then 1200 W on late ones (the change dates are owners' estimates). US 120 V machines are labeled 1425 W, which includes the 55 W pump: the heater is about 1370 W, about 10.5 Ω for the pair. **[Owners]** Coffee Forums; Whole Latte Love's repair wiki.

## Classic Pro family (2019 on)

- **Power switch** is double-pole and, stock, breaks line and neutral. The 184 °C fuse sits in the switched line, after the power lamp, and feeds everything else. **[Gaggia]** 2018 wiring diagram, traced.
- **Stock integration** moves B4 off the brew switch onto wire L, moves S4 from steam switch spade 4 to spade 1, and parks S5, which stays live. Brew switch spade 5 and steam switch spades 1 to 3 still carry mains afterward; the low-voltage wires go only on the spades this frees (brew 1 and 2, steam 4 and 5). **[Official]** drawing, traced.
- **In stock integration the SSR switches the elements' neutral side**, as the thermostats did: the elements stay connected to line whenever the machine is on. The power-on checks account for this. **[Gaggia]** and **[Official]** drawings, traced.
- **Lamps.** The steam lamp becomes a boiler lamp, lit while the boiler isn't heating. The brew lamp stays dark. **[Official]**
- **OPV.** A black valve on top of the pump that returns to the tank. Gaggia's specification is 11 bar (+1, −0.5), inside the 10 to 12 bar Gaggiuino wants; reviewers report 12 to 14. Owners often swap in 9 bar springs, so test it. US Evo Pros and E24s ship with a 9 bar valve instead (below). **[Gaggia]**, **[Owners]**
- **Pressure sensor.** Cut the braided pump hose about 65 mm above the boiler connection, fit a barbed 6 mm T with a clamp on each tube, and run 200 to 250 mm of hose to the sensor, clamped at each end. The docs' hose is the Saeco OEM braided tube, Gaggia part 996530009505. Or fit the pressure tap block. **[Official]**
- **SSR** mounts to the back wall with an M4 (or 8-32) screw; leave room above it for the funnel piece and its screw. **[Official]** Its wires: [wiring map](wiring.html#map?part=ssr&path=SI).

## Eco board (230 V Pro family in the EU and UK)

- **What it is.** A 20-minute auto-off relay board ("S-OFF board") on the pump bracket, fed straight from the mains inlet, with a spring-return power button that works through it. The board's circuit isn't published, so treat the button's wires as mains. Fitted to European and UK RI9480 and RI9481 machines; not to any US or Canadian machine, and not to the 230 V RI9380s Gaggia made for markets such as Australia. Whether every RI9481, including the Australian E24, has it isn't confirmed, so check yours. **[Gaggia]** service manual and parts lists.
- **Power switch mod.** Take the switch out, release its locking tabs one side at a time with a thin pry tool, remove the third spring and reassemble, so the button latches. **[Official]**
- **Custom wiring** feeds the power switch straight from the inlet, so the board drops out. Afterwards the machine never switches itself off; Gaggiuino only puts the screen to sleep. **[Official]** schematics and manual.

## Evo Pro and E24 (2023 on)

- **9 bar OPV on US machines.** Gaggiuino needs the valve at least 1 bar above your highest shot pressure, so 10 to 12 bar for 9 bar profiles: it can't tell when the valve starts to open. Fit a 12 bar spring, or put three or four stainless M3 washers (6.9 to 7.1 mm across, 0.5 to 0.8 mm thick) behind the 9 bar one: four if they're 0.5 mm, three if 0.8 mm. Test with a blank basket afterward. **[Official]**
- **Combined connector block.** On most Evo and E24 machines, each switch's connectors sit together in one shielded block. Take each connector out (a small screwdriver releases its locking tab), insulate it on its own with self-fusing silicone tape or 6 mm silicone heat shrink, and label it with an oil-based marker. This matters most for stock integration, because some connectors stay in the machine unplugged. **[Official]**
- **Boilers.** The 2023 Evo's aluminum boiler has a coating inside that can flake on some machines ("Boilergate"); Gaggia blamed how the coating was applied, and later Evos reportedly went back to uncoated aluminum (no date is given). The E24 has a lead-free brass boiler, just over 100 ml. Neither changes the thermocouple, which still screws into the brew thermostat's M4 hole. **[Owners]** Coffeeblog, Whole Latte Love.
- **Telling them apart.** Both use RI9380 in the US and RI9481 in Europe, so check the boiler under the top cover (aluminum for the Evo, brass for the E24) or the serial: the first four digits are the year and week. **[Owners]**

## The same on every supported model

- **Thermostats and fuse.** A 107 °C brew thermostat and a 145 °C steam thermostat screw into the boiler; both leave the circuit. The 184 °C one-shot thermal fuse stays. The custom wiring guide lists a resettable 185 °C fuse (NC, 16 A, M4) as an option, fitted in the steam thermostat's boss in place of the stock fuse. **[Gaggia]**, **[Official]**
- **Thermocouple.** An ungrounded K-type with an M4 thread, in the brew thermostat's hole, with thermal paste rated for at least 180 °C, barely finger tight. It's easier with the boiler out: four cap screws up from under the frame. **[Official]**
- **Pump.** An Ulka vibratory pump (EP5 at 230 V, EAP5 or EFP5 at 120 V) with a small thermal protector on its neutral lead, 110 °C on the official drawings. Some 230 V Classic drawings show none. **[Gaggia]**, **[Official]**
- **Elements.** Two, one on each side of the boiler: in parallel on 120 V machines and in series on 230 V ones. From the rated power, the pair works out to about 10.7 Ω on a 120 V Pro or E24 (1350 W) and about 44 Ω on a 230 V one (1200 W), so each element is about 21 to 22 Ω. A label total of 1425 W includes the 55 W pump; don't use it for the resistance. **[Gaggia]** service manual, Gaggia's E24 page.
- **Earth and the 5 V side.** Earth must never touch the PCB's 5 V ground; the low-voltage side floats so the thermocouple reads correctly. **[Official]**
- **Settings.** The Gen 3 manual recommends the default boiler settings for the Classic and the Pro family. **[Official]**

## Sources

- Gaggiuino docs: the compatibility table and parts list (https://gaggiuino.github.io/#/), stock wiring integration (https://gaggiuino.github.io/#/guides-stm32/3pln-stock-wiring-integration), custom wiring (https://gaggiuino.github.io/#/guides-stm32/3pln-custom-wiring) and the machine-specific guide (https://gaggiuino.github.io/#/guides/machine-specific-guide), with their schematics.
- Gaggia's service manual for the Classic 2018, hosted by Whole Latte Love: https://support.wholelattelove.com/hc/en-us/article_attachments/22569918987411
- Whole Latte Love parts diagrams for the Classic Pro (https://www.wholelattelove.com/products/gaggia-classic-pro-stainless-steel-part-diagram-eg1001) and the Evo Pro (https://www.wholelattelove.com/products/gaggia-classic-evo-pro-part-diagram-eg1003).
- Coffeeblog on the Evo's boiler: https://coffeeblog.co.uk/boilergate-gaggia-classic-pro-evo-boiler-problems/
- Coffee Forums on adjusting the older Classic's OPV: https://www.coffeeforums.co.uk/topic/3412-adjusting-the-opv-over-pressure-valve-gaggia-classic
