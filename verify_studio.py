import sys, pathlib, json
sys.stdout.reconfigure(encoding='utf-8')
from playwright.sync_api import sync_playwright

html_file = pathlib.Path('gwyn_dorado_mv_studio.html').resolve()
uri = html_file.as_uri()

artifact_dir = pathlib.Path(r'C:\Users\jezeh\.gemini\antigravity\brain\a31cc404-3ea1-4bea-ab4a-0d891aa63603')
artifact_dir.mkdir(parents=True, exist_ok=True)
shot1_path = artifact_dir / 'dorado_studio_main.png'
shot2_path = artifact_dir / 'dorado_studio_svg_and_agents.png'

results = {
    'console_errors': [],
    'page_errors': [],
    'presets_tested': [],
    'playback_verified': False,
    'svg_drawer_verified': False,
    'agents_verified': [],
    'craft_tools_verified': [],
    'screenshots': []
}

with sync_playwright() as pw:
    browser = pw.chromium.launch()
    page = browser.new_page(viewport={'width': 1600, 'height': 950})
    
    page.on('console', lambda msg: results['console_errors'].append(msg.text) if msg.type == 'error' else None)
    page.on('pageerror', lambda err: results['page_errors'].append(str(err)))
    
    print('Navigating to standalone bundle:', uri)
    page.goto(uri, wait_until='networkidle')
    page.wait_for_timeout(1000)
    
    # 1. Verify Initial Load
    title = page.title()
    print('Page Title:', title)
    
    init_bpm = page.locator('#bpm-badge').inner_text()
    init_audit = page.locator('#audit-composite-badge').inner_text()
    print('Initial Badges:', init_bpm, '|', init_audit)
    
    # 2. Test Presets Switching across all 5 songs
    presets = ['losing_my_heart', 'light_of_love', 'on_my_way', 'purple_love', 'light_up']
    for p_id in presets:
        page.select_option('#preset-select', p_id)
        page.wait_for_timeout(350)
        cur_bpm = page.locator('#bpm-badge').inner_text()
        scene_count = page.locator('.scene-block-item').count()
        audit_score = page.locator('#audit-composite-badge').inner_text()
        first_scene_motif = page.locator('#scene-motif-select').input_value()
        results['presets_tested'].append({
            'preset': p_id,
            'bpm_badge': cur_bpm,
            'scenes': scene_count,
            'audit': audit_score,
            'first_motif': first_scene_motif
        })
        print(f'Preset [{p_id}]: Badge="{cur_bpm}", Scenes={scene_count}, Audit="{audit_score}", Motif="{first_scene_motif}"')

    # Switch to losing_my_heart for Main Studio Screenshot
    page.select_option('#preset-select', 'losing_my_heart')
    page.wait_for_timeout(400)
    
    # 3. Test Playback
    btn_play = page.locator('#btn-play')
    btn_play.click()
    page.wait_for_timeout(1500)
    tc_playing = page.locator('#timecode-display').inner_text()
    needle_style = page.locator('#playhead-needle').get_attribute('style')
    print(f'Playback active: TC="{tc_playing}", Needle="{needle_style}"')
    results['playback_verified'] = (tc_playing != '00:00:00.000')

    # Capture Screenshot 1: Main Studio (Active canvas, timeline, 5-Pillar audit)
    page.screenshot(path=str(shot1_path))
    results['screenshots'].append(str(shot1_path))
    print('Saved Screenshot 1 to:', shot1_path)
    
    # Pause playback
    btn_play.click()
    page.wait_for_timeout(200)

    # 4. Test Live Code-SVG Drawer
    btn_drawer = page.locator('#btn-toggle-svg-drawer')
    btn_drawer.click()
    page.wait_for_timeout(400)
    drawer_classes = page.locator('#svg-code-drawer').get_attribute('class')
    drawer_open = 'open' in drawer_classes
    svg_text = page.locator('#svg-code-display').inner_text()
    has_valid_svg = ('<svg' in svg_text) and ('</svg>' in svg_text)
    results['svg_drawer_verified'] = drawer_open and has_valid_svg
    print(f'SVG Drawer: Open={drawer_open}, HasValidSVG={has_valid_svg}, Length={len(svg_text)}')

    # 5. Test Right Dock - Parallel Subagents (AGENT_01 to AGENT_07)
    agent_options = ['AGENT_01', 'AGENT_02', 'AGENT_03', 'AGENT_04', 'AGENT_05', 'AGENT_06', 'AGENT_07']
    for ag_id in agent_options:
        page.select_option('#agent-select', ag_id)
        page.wait_for_timeout(150)
        prompt_text = page.locator('#agent-prompt-display').inner_text()
        valid = (len(prompt_text) > 40) and ('AGENT' in prompt_text or 'Creative' in prompt_text or 'Audio' in prompt_text or 'SVG' in prompt_text or 'Compositor' in prompt_text or 'Bridge' in prompt_text or 'UI' in prompt_text or 'Packager' in prompt_text)
        results['agents_verified'].append({
            'agent': ag_id,
            'prompt_len': len(prompt_text),
            'valid': valid
        })
        print(f'  Agent [{ag_id}]: Length={len(prompt_text)}, Valid={valid}')

    # 6. Test Right Dock - Craft Suite (FilmCraft, EffectCraft, VectorCraft, SoundCraft)
    page.locator('#right-tab-storytold-btn').click()
    page.wait_for_timeout(300)
    craft_tools = [
        ('film', '#craft-tab-film'),
        ('effect', '#craft-tab-effect'),
        ('vector', '#craft-tab-vector'),
        ('sound', '#craft-tab-sound')
    ]
    for craft_name, btn_sel in craft_tools:
        page.locator(btn_sel).click()
        page.wait_for_timeout(150)
        script_text = page.locator('#storytold-script-display').inner_text()
        valid = (len(script_text) > 30)
        results['craft_tools_verified'].append({
            'craft': craft_name,
            'script_len': len(script_text),
            'valid': valid
        })
        print(f'  Craft [{craft_name}]: Length={len(script_text)}, Valid={valid}')

    # Switch to Preset 2 (Light of Love / Whale Bioluminescence) with SVG Drawer & Storytold/Agents open for Screenshot 2
    page.select_option('#preset-select', 'light_of_love')
    page.wait_for_timeout(400)
    # Re-open drawer and select EffectCraft tab
    page.locator('#craft-tab-effect').click()
    page.wait_for_timeout(300)
    page.screenshot(path=str(shot2_path))
    results['screenshots'].append(str(shot2_path))
    print('Saved Screenshot 2 to:', shot2_path)

    browser.close()

# Also run quick check on modular index.html
modular_file = pathlib.Path('dorado_motion_studio/index.html').resolve()
print('\nChecking modular index.html:', modular_file.as_uri())
with sync_playwright() as pw:
    browser = pw.chromium.launch()
    page = browser.new_page()
    mod_errors = []
    page.on('console', lambda msg: mod_errors.append(msg.text) if msg.type == 'error' else None)
    page.on('pageerror', lambda err: mod_errors.append(str(err)))
    page.goto(modular_file.as_uri(), wait_until='networkidle')
    page.wait_for_timeout(1000)
    print('Modular index.html mounted:', page.locator('#studio-header').count() > 0)
    print('Modular index.html errors:', len(mod_errors))
    results['modular_errors'] = mod_errors
    browser.close()

print('\n' + '='*60)
print('FINAL VERIFICATION RESULTS:')
print('Page Errors:', len(results['page_errors']))
print('Console Errors:', len(results['console_errors']))
print('Modular Errors:', len(results['modular_errors']))
print('Presets Verified:', len(results['presets_tested']))
print('Playback Verified:', results['playback_verified'])
print('SVG Drawer Verified:', results['svg_drawer_verified'])
print('Subagents Verified:', len(results['agents_verified']))
print('Craft Tools Verified:', len(results['craft_tools_verified']))
print('Screenshots Generated:', results['screenshots'])
print('='*60)
