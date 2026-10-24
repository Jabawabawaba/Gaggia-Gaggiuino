"""Add-ons to the official wiring: wiring-data.json keeps each one as a list of changes to an official schematic
(addons.<name>.variants.<schematic key>), and expand() builds the full schematic from it, so the official runs
stay written once. site.py (for the pages) and wiring_map.py (for the maps) read the data through expand().

A change list can drop runs, edit fields of a run, add runs (each after the run its "after" names, or at the end)
and set fields of the schematic itself. Added runs get the defaults below for anything they leave out. The new
schematic's key is the official one plus "-" and the add-on's key; it carries base (the official key), addon (the
add-on's name) and <name>: true.
"""
import copy

DEFAULTS = {"tid": "", "hot": "", "share": [[], []], "note": "", "opt": False, "stock": False, "repl": "",
            "conf": "clear", "hdr": "", "wire": "18 AWG silicone", "mm": None}


def expand(data):
    data = copy.deepcopy(data)
    for name, ad in data.pop("addons", {}).items():
        for base, ch in ad["variants"].items():
            v = copy.deepcopy(data["variants"][base])
            key = base + "-" + ad["key"]
            runs = [r for r in v["runs"] if r["id"] not in ch.get("drop", [])]
            byid = {r["id"]: r for r in runs}
            for rid, fields in ch.get("edit", {}).items():
                assert rid in byid, f"{key}: no run {rid} to edit"
                byid[rid].update(copy.deepcopy(fields))
            for add in ch.get("add", []):
                r = dict(DEFAULTS, **{k: copy.deepcopy(x) for k, x in add.items() if k != "after"})
                assert r["id"] not in byid, f"{key}: {r['id']} already exists"
                at = add.get("after")
                i = next(i for i, x in enumerate(runs) if x["id"] == at) + 1 if at else len(runs)
                runs.insert(i, r)
                byid[r["id"]] = r
            v["runs"] = runs
            v.update(copy.deepcopy(ch.get("set", {})))
            v.update({"key": key, "base": base, "addon": name, name: True})
            data["variants"][key] = v
    return data
