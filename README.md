# Capy Dash v1.0

A tiny retro pixel platformer: 4 heroes, 3 levels, 2 bosses, English / Deutsch / Türkçe.
Built for phones in landscape, also plays with keyboard and mouse.

## Project layout

```
www/                 the game (plain JS, no build step)
  index.html
  manifest.webmanifest, sw.js, icons/   -> installable, offline web app (PWA)
  js/engine.js       renderer, input (keys / mouse / touch), audio, fullscreen + landscape + haptics
  js/font.js         5x7 pixel font (incl. ä ö ü ç ğ ı İ ş)
  js/i18n.js         all texts + patch notes in EN / DE / TR
  js/sprites.js      pixel art (heroes, enemies, bosses, tiles)
  js/levels.js       level layouts + tile physics
  js/game.js         gameplay, bosses, abilities, menu logic
  js/ui.js           drawing, HUD, menus, touch buttons, main loop
  js/palette.js      generated colour palette (npm run palette)
capacitor.config.json, package.json      -> native Android / iOS app
scripts/native-setup.mjs              -> locks the native apps to landscape
tools/gen-palette.js                     -> rebuilds palette.js after you add colours
```

## Play in the browser

Open `www/index.html` directly, or serve it (needed for offline install):

```
npm start            # http://localhost:8080
# or: python -m http.server 8080 --directory www
```

## Install on a phone without an app store (PWA)

Host the `www` folder on any HTTPS host (GitHub Pages, Netlify, ...), open it on the phone,
then "Add to Home screen" (Chrome: menu > Install app). It opens fullscreen in landscape and works offline.

## Build the Android app (APK)

Needs Node.js 20+ and Android Studio.

```
npm install
npm run android:init     # once: creates android/ and locks it to landscape
npm run android          # syncs the game and opens Android Studio
```

In Android Studio: Build > Build App Bundle(s) / APK(s) > Build APK(s), or press Run with your phone connected (USB debugging on).

## Build the iOS app

Needs a Mac with Xcode: `npm install`, `npm run ios:init`, `npm run ios`.

## After changing the game

Edit files in `www/js/`. If you add new colours, run `npm run palette` (the renderer snaps every pixel to the palette).
For the native apps run `npm run sync` again.
