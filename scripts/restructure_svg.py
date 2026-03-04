#!/usr/bin/env python3
"""
Parse flat SVG with repeated path sequences (sad/mid/happy variants)
and restructure into <g> groups: el_0_sad, el_0_mid, el_0_happy, etc.
"""
import re
import json
from pathlib import Path

ELEMENT_NAMES = [
    "big_couch", "big_plant", "frame", "little_couch",
    "little_plant", "table", "pillow", "sun"
]
VARIANTS = ["sad", "mid", "happy"]

def extract_paths(svg_content):
    """Extract path elements with their d attribute and full line."""
    paths = []
    for line in svg_content.splitlines():
        if "<path" not in line:
            continue
        d_m = re.search(r'd="([^"]+)"', line)
        fill_m = re.search(r'fill="([^"]+)"', line)
        if d_m and fill_m:
            paths.append({
                "d": d_m.group(1),
                "fill": fill_m.group(1),
                "full": line.strip()
            })
    return paths

def find_element_boundaries(paths, num_background=2):
    """Find where each element's 3 variants start/end by detecting repeated d sequences."""
    element_paths = paths[num_background:]
    if not element_paths:
        return []

    boundaries = []  # list of (el_idx, variant, start_idx, end_idx, path_count)
    i = 0
    el_idx = 0

    while i < len(element_paths):
        # Find block size: when does the current path's d appear again?
        first_d = element_paths[i]["d"]
        block_size = None
        for j in range(i + 1, min(i + 500, len(element_paths))):
            if element_paths[j]["d"] == first_d:
                block_size = j - i
                break
        if block_size is None:
            # Last element - take remaining and assume 3 variants
            remaining = len(element_paths) - i
            block_size = remaining // 3
            if block_size == 0:
                block_size = 1

        # We have block_size paths per variant, 3 variants per element
        for v_idx, variant in enumerate(VARIANTS):
            start = i + v_idx * block_size
            end = min(start + block_size, len(element_paths))
            if start < len(element_paths):
                boundaries.append({
                    "el_idx": el_idx,
                    "el_name": ELEMENT_NAMES[el_idx] if el_idx < len(ELEMENT_NAMES) else f"el_{el_idx}",
                    "variant": variant,
                    "start": num_background + start,
                    "end": num_background + end,
                    "path_count": end - start
                })
        i += 3 * block_size
        el_idx += 1

    return boundaries

def build_restructured_svg(paths, boundaries, svg_header):
    """Build new SVG with <g> groups."""
    lines = [svg_header]

    # Background
    lines.append('  <g id="background">')
    for p in paths[:2]:
        lines.append("    " + p["full"])
    lines.append("  </g>")

    # Elements by variant - we need to show only one variant per element at a time
    # For scene logic: each el_X_variant is a group. Default: show happy for all.
    for b in boundaries:
        g_id = f"el_{b['el_idx']}_{b['variant']}"
        lines.append(f'  <g id="{g_id}">')
        for idx in range(b["start"], b["end"]):
            lines.append("    " + paths[idx]["full"])
        lines.append("  </g>")

    return "\n".join(lines)

def main():
    base = Path(__file__).parent.parent
    src = base / "data" / "21438087_Boho_interior_with_sofa_and_armchair 10.22.19 1.svg"
    out = base / "data" / "scene_variants.svg"

    content = src.read_text(encoding="utf-8")
    svg_header = content.split("<path")[0].rstrip()

    paths = extract_paths(content)
    print(f"Total paths: {len(paths)}")
    print(f"Background: 2 paths")

    boundaries = find_element_boundaries(paths)
    print(f"\nElement boundaries ({len(boundaries)} groups):")

    # Build summary for scene logic
    summary = {"background": {"lines": "2-3", "path_count": 2}}
    for b in boundaries:
        key = f"el_{b['el_idx']}_{b['variant']}"
        summary[key] = {
            "lines": f"{b['start']+1}-{b['end']}",
            "path_count": b["path_count"],
            "element": b["el_name"]
        }
        print(f"  {key}: lines {b['start']+1}-{b['end']}, {b['path_count']} paths")

    # Path counts per element per variant
    path_counts = {}
    for b in boundaries:
        el_key = b["el_name"]
        if el_key not in path_counts:
            path_counts[el_key] = {}
        path_counts[el_key][b["variant"]] = b["path_count"]

    print("\n--- Path counts per element per variant (for scene logic) ---")
    print(json.dumps(path_counts, indent=2))

    # Write restructured SVG
    new_svg = build_restructured_svg(paths, boundaries, svg_header)
    out.write_text(new_svg, encoding="utf-8")
    print(f"\nSaved restructured SVG to {out}")

    # Save summary JSON for scene logic
    summary_path = base / "data" / "scene_variants_map.json"
    summary_path.write_text(json.dumps({
        "path_counts": path_counts,
        "boundaries": boundaries,
        "element_names": ELEMENT_NAMES
    }, indent=2), encoding="utf-8")
    print(f"Saved scene map to {summary_path}")

if __name__ == "__main__":
    main()
