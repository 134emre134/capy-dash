# CLAUDE.md

Capy Dash: a small retro pixel platformer in plain JavaScript (no build step, no framework, no tests).
It runs in the browser, installs as a PWA, and is wrapped for Android / iOS with Capacitor.
See README.md for how to build the native apps.

## Run it

```bash
npm start        # http://localhost:8080 (or just open www/index.html)
```

There is no test suite. To check a change, load the page and look for errors. Headless Chromium + Playwright works well:
load `www/index.html`, call globals from `page.evaluate` (`startGame(heroIndex, levelIndex)`, `update()`, `render()`,
`G`, `held`/`hit`), then take a screenshot. Run `node --check www/js/*.js` for syntax.

## Layout

All game code is in `www/js/`. The files are classic scripts that share globals, and `index.html` loads them in this order:

| file | contents |
|---|---|
| `palette.js` | **generated**: every colour the game may use. Don't edit by hand. |
| `engine.js` | settings, low-res renderer + palette quantizer, input (keys / mouse / touch), haptics, audio (`SFX`) |
| `i18n.js` | all UI text in `STR.en/de/tr` + patch notes `NOTES` (newest first) |
| `font.js` | 5x7 bitmap font (uppercases everything; supports ä ö ü ç ğ ı İ ş) |
| `sprites.js` | pixel art built from string rows (`makeSprite`, `heroSet`), tile sets per theme (`tileSet`) |
| `levels.js` | level layouts (`buildLevelN`), `LEVELS` list, tile collision (`moveBody`) |
| `game.js` | `CHARS` (heroes + stats), player physics, hero specials, enemies, bosses, hazards, menu logic, `update()` |
| `ui.js` | all drawing: backgrounds, world, bosses, HUD, menus, touch overlay, main loop |

## Rules that are easy to break

- **Colours:** the renderer snaps every pixel to `PALETTE_HEX`. After using a new `#rrggbb` anywhere in `www/js`,
  run `npm run palette` (or `node tools/gen-palette.js`), or the new colour shows up as its nearest palette colour.
- **Every text is translated.** When you add a `t('key')`, add the key to `en`, `de` and `tr` in `i18n.js`.
  Gameplay changes get a patch-notes bullet in all three languages, under a new version header at the top of `NOTES`.
  Bump the version in `ui.js` (`renderMenu` subtitle), `package.json` and the README title.
- **Coordinates:** logical view 960x520 (wider on wide phones, `VW`), tiles are `TS = 40` px, the ground is tile row 11
  (`11 * TS`). Sprites are drawn at `PX = 2` (1 sprite pixel = 2 logical px). Use `snap()` for pixel-aligned positions.
- **Fixed timestep:** `update()` runs at 60 steps/s, so all speeds and timers are per frame.
- **Sprite rows** in one sprite must all be the same width; `mirror = true` mirrors the left half.
- **Service worker** (`www/sw.js`) caches a fixed file list. Add any new file there.

## Game concepts

- **Heroes** (`CHARS` in game.js): `id`, `special`, physics, and `stats = [SPEED, JUMP, POWER]` (1-5 bars on the select
  screen). Keep the stats consistent with the physics and with the animal. Current heroes:
  capy (AIR DASH), owl "Ays" (SPIT SHOT), mole "Fred" (SHOCK SLAM, also ↓ in the air), coon "Rocco" (PAN SWING),
  bear "Cheemus" (BEAR ROLL). Names live in `i18n.js` as `h_<id>`, `tag_<id>`, `sp_<id>`.
  Adding a hero means: a `CHARS` entry, a `HERO.<id>` sprite set, the special in `updateGame`, the texts,
  and a spot in `menuBackdrop` (ui.js).
- **Invincibility:** `safe(p)` = respawn blink (`p.inv`) or dash/roll i-frames (`p.dashInv`).
  While `dashing(p)` (capy dash / bear roll), `dashStrike` kills enemies, smashes hazards and hits the boss once per dash.
- **Tiles** (levels.js): `#` ground, `X` stone, `B` brick, `?` coin block, `U` used block, `G` gate, `I` ice,
  `o` coin, `^` spikes, `~` lava (not solid, kills; drawn live by `drawLava`). Solid set: `SOLID`.
- **Themes:** 0 day, 1 night, 2 snow, 3 forest, 4 lava. A theme touches `tileSet` (sprites.js), `SKY`/`drawSky`,
  the weather overlay in `renderWorld`, `levelPreview` and `drawBeetle` (ui.js).
- **Bosses:** a level with `boss` has an arena (`arenaX0..arenaX1`) that closes on entry and opens via `openGate()`.
  Each boss type has `newBoss` data, an `update<Type>` state machine (game.js) and a `draw<Type>` (ui.js), dispatched by
  `B.type`. `hurtBoss` turns on `phase2` at half HP (banner `ab_<type>`). Contact uses `bossContact` (stomp from above).
  Bosses: spider (L2), snowman (L3), snake (L4), ape (L5).
- **Every boss jump shows a landing marker.** Plan jumps with `planJump(B, lv, targetX, vy, gravity, maxVx)`, which sets
  `B.landX`, and draw `landMark(B.landX)` during the wind-up and the jump. Falling projectiles use `landMark(x, false)`.
- **Hazards** (`G.haz`): boss projectiles (`web`, `snow`, `ice`, `venom`, `bomb`) that kill on touch unless `safe(p)`.
  Give a new type a colour in `HAZ_COL` and a draw case in `drawHazards`.
- **Scores** are saved per level and hero in localStorage (`capydash_v2_<level>_<hero>`), so hero ids and level order matter.
