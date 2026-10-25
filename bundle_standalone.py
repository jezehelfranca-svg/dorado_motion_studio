import pathlib

root = pathlib.Path(__file__).resolve().parent
workspace = root.parent

css_path = root / "css" / "studio.css"
js_files = [
    root / "js" / "01_creative_director.js",
    root / "js" / "02_audio_engine.js",
    root / "js" / "03_svg_motion_engine.js",
    root / "js" / "04_webgl_oklab_compositor.js",
    root / "js" / "05_storytold_bridge.js",
    root / "js" / "06_ui_shell.js",
]

css_content = css_path.read_text(encoding="utf-8") if css_path.exists() else ""
js_blocks = []
for jf in js_files:
    if jf.exists():
        js_blocks.append(f"/* === {jf.name} === */\n" + jf.read_text(encoding="utf-8"))
    else:
        raise FileNotFoundError(f"Missing module: {jf}")

standalone_html = f"""<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>DoradoMotion Studio — Gwyn Dorado Music Video Sequence Planner & Code-SVG/WebGL Studio</title>
  <style>
{css_content}
  </style>
</head>
<body>
  <div id="dorado-studio-root"></div>
  <script>
{chr(10).join(js_blocks)}

window.addEventListener('DOMContentLoaded', () => {{
  if (window.DoradoStudio && window.DoradoStudio.UI && typeof window.DoradoStudio.UI.mount === 'function') {{
    window.DoradoStudio.UI.mount(document.getElementById('dorado-studio-root'));
  }}
}});
  </script>
</body>
</html>
"""

out_path = workspace / "gwyn_dorado_mv_studio.html"
out_path.write_text(standalone_html, encoding="utf-8")
print(f"Bundled standalone HTML app: {out_path} ({out_path.stat().st_size:,} bytes)")
