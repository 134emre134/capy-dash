'use strict';
// =====================================================================
// Translations: English, Deutsch, Türkçe
// =====================================================================
const LANGS = ['en', 'de', 'tr'];
const STR = {
  en: {
    langName: 'ENGLISH', play: 'PLAY', settings: 'SETTINGS', controls: 'CONTROLS', notes: 'PATCH NOTES', subtitle: 'A TINY PLATFORMER',
    hintKeys: '↑↓ CHOOSE · ENTER SELECT · M MUTE', hintTap: 'TAP TO CHOOSE', back: 'BACK',
    language: 'LANGUAGE', sound: 'SOUND', vibration: 'VIBRATION', touch: 'TOUCH CONTROLS', on: 'ON', off: 'OFF', auto: 'AUTO',
    chooseHero: 'CHOOSE YOUR HERO', next: 'NEXT', special: 'SPECIAL', speed: 'SPEED', jump: 'JUMP',
    hintSelect: '← → CHOOSE · ENTER NEXT · ESC BACK', chooseLevel: 'CHOOSE A LEVEL', start: 'START', hintLevel: '← → CHOOSE · ENTER START · ESC BACK',
    par: 'PAR {0}s', best: 'BEST {0} · {1}', noBest: 'NO BEST YET', falls: 'FALLS {0}', score: 'SCORE {0}',
    crossStart: 'CROSS THE START LINE!', checkpoint: 'CHECKPOINT!', gateOpen: 'THE GATE IS OPEN! RUN!', courseClear: 'COURSE CLEAR!',
    paused: 'PAUSED', resume: 'RESUME', restart: 'RESTART', mainMenu: 'MAIN MENU', nextLevel: 'NEXT LEVEL', playAgain: 'PLAY AGAIN', changeHero: 'CHANGE HERO',
    coinsRow: 'COINS {0} × 100', timeRow: 'TIME {0} (PAR {1}s)', scoreRow: 'SCORE', newBest: 'NEW BEST!', rotate: 'ROTATE YOUR DEVICE', rotate2: 'CAPY DASH IS PLAYED IN LANDSCAPE',
    archStart: 'START', archFinish: 'FINISH', hintSpecialKeys: 'C / LEFT CLICK: {0}', hintSpecialTouch: 'B BUTTON: {0}',
    c_move: 'MOVE', c_jump: 'JUMP', c_run: 'RUN', c_special: 'SPECIAL', c_kerim: 'KERIM SLAM', c_pause: 'PAUSE', c_mute: 'MUTE',
    k_jump: 'SPACE / ↑ / W / Z', k_special: 'C / LEFT CLICK', k_kerim: '↓ / S IN THE AIR', t_move: '◀ ▶  (HOLD LONGER TO RUN)',
    c_tip: 'HOLD JUMP TO JUMP HIGHER · STOMP BEETLES',
    h_capy: 'CAPYBARA', h_owl: 'AYS', h_mole: 'KERIM', h_coon: 'ROCCO',
    tag_capy: 'CHILL & STEADY', tag_owl: 'SHARP-EYED OWL', tag_mole: 'HARD-HAT MOLE', tag_coon: 'RACCOON WITH A PAN',
    sp_capy: 'AIR DASH', sp_owl: 'SPIT SHOT', sp_mole: 'SHOCK SLAM', sp_coon: 'PAN SWING',
    l1: 'SUNNY HILLS', l2: 'MOONLIT WEB', l3: 'FROST PEAK', l1d: 'THE ORIGINAL TEST LEVEL', l2d: 'NIGHT STAGE + SPIDER BOSS', l3d: 'ICE, SNOW + SNOWMAN BOSS',
    iosHint: 'FULLSCREEN: TAP SHARE, THEN "ADD TO HOME SCREEN"', boss_spider: 'MOONWEAVER', boss_snowman: 'GRIMFROST', ab_spider: 'WEB STORM!', ab_snowman: 'ICICLE RAIN!'
  },
  de: {
    langName: 'DEUTSCH', play: 'SPIELEN', settings: 'EINSTELLUNGEN', controls: 'STEUERUNG', notes: 'PATCH-NOTIZEN', subtitle: 'EIN KLEINER PLATFORMER',
    hintKeys: '↑↓ WÄHLEN · ENTER OK · M TON AUS', hintTap: 'TIPPEN ZUM WÄHLEN', back: 'ZURÜCK',
    language: 'SPRACHE', sound: 'TON', vibration: 'VIBRATION', touch: 'TOUCH-STEUERUNG', on: 'AN', off: 'AUS', auto: 'AUTO',
    chooseHero: 'WÄHLE DEINEN HELDEN', next: 'WEITER', special: 'SPEZIAL', speed: 'TEMPO', jump: 'SPRUNG',
    hintSelect: '← → WÄHLEN · ENTER WEITER · ESC ZURÜCK', chooseLevel: 'WÄHLE EIN LEVEL', start: 'LOS', hintLevel: '← → WÄHLEN · ENTER LOS · ESC ZURÜCK',
    par: 'ZIELZEIT {0}s', best: 'REKORD {0} · {1}', noBest: 'NOCH KEIN REKORD', falls: 'STÜRZE {0}', score: 'PUNKTE {0}',
    crossStart: 'ÜBERQUERE DIE STARTLINIE!', checkpoint: 'CHECKPOINT!', gateOpen: 'DAS TOR IST OFFEN! LAUF!', courseClear: 'STRECKE GESCHAFFT!',
    paused: 'PAUSE', resume: 'WEITER', restart: 'NEUSTART', mainMenu: 'HAUPTMENÜ', nextLevel: 'NÄCHSTES LEVEL', playAgain: 'NOCHMAL', changeHero: 'HELD WECHSELN',
    coinsRow: 'MÜNZEN {0} × 100', timeRow: 'ZEIT {0} (ZIEL {1}s)', scoreRow: 'PUNKTE', newBest: 'NEUER REKORD!', rotate: 'GERÄT DREHEN', rotate2: 'CAPY DASH WIRD IM QUERFORMAT GESPIELT',
    archStart: 'START', archFinish: 'ZIEL', hintSpecialKeys: 'C / LINKSKLICK: {0}', hintSpecialTouch: 'B-TASTE: {0}',
    c_move: 'BEWEGEN', c_jump: 'SPRINGEN', c_run: 'RENNEN', c_special: 'SPEZIAL', c_kerim: 'KERIM-STAMPFER', c_pause: 'PAUSE', c_mute: 'TON AUS',
    k_jump: 'LEERTASTE / ↑ / W / Z', k_special: 'C / LINKSKLICK', k_kerim: '↓ / S IN DER LUFT', t_move: '◀ ▶  (LÄNGER HALTEN = RENNEN)',
    c_tip: 'SPRUNG HALTEN = HÖHER SPRINGEN · KÄFER PLATTMACHEN',
    h_capy: 'CAPYBARA', h_owl: 'AYS', h_mole: 'KERIM', h_coon: 'ROCCO',
    tag_capy: 'ENTSPANNT & SOLIDE', tag_owl: 'SCHARFÄUGIGE EULE', tag_mole: 'MAULWURF MIT HELM', tag_coon: 'WASCHBÄR MIT PFANNE',
    sp_capy: 'LUFTSPRINT', sp_owl: 'SPUCKSCHUSS', sp_mole: 'SCHOCKSTAMPFER', sp_coon: 'PFANNENHIEB',
    l1: 'SONNENHÜGEL', l2: 'MONDNETZ', l3: 'FROSTGIPFEL', l1d: 'DAS ORIGINALE TESTLEVEL', l2d: 'NACHTLEVEL + SPINNEN-BOSS', l3d: 'EIS, SCHNEE + SCHNEEMANN-BOSS',
    iosHint: 'VOLLBILD: TEILEN TIPPEN, DANN "ZUM HOME-BILDSCHIRM"', boss_spider: 'MONDWEBERIN', boss_snowman: 'GRIMMFROST', ab_spider: 'NETZSTURM!', ab_snowman: 'EISZAPFENREGEN!'
  },
  tr: {
    langName: 'TÜRKÇE', play: 'OYNA', settings: 'AYARLAR', controls: 'KONTROLLER', notes: 'GÜNCELLEME NOTLARI', subtitle: 'KÜÇÜK BİR PLATFORM OYUNU',
    hintKeys: '↑↓ SEÇ · ENTER ONAYLA · M SESSİZ', hintTap: 'SEÇMEK İÇİN DOKUN', back: 'GERİ',
    language: 'DİL', sound: 'SES', vibration: 'TİTREŞİM', touch: 'DOKUNMATİK KONTROL', on: 'AÇIK', off: 'KAPALI', auto: 'OTOMATİK',
    chooseHero: 'KAHRAMANINI SEÇ', next: 'İLERİ', special: 'ÖZEL', speed: 'HIZ', jump: 'ZIPLAMA',
    hintSelect: '← → SEÇ · ENTER İLERİ · ESC GERİ', chooseLevel: 'BÖLÜM SEÇ', start: 'BAŞLA', hintLevel: '← → SEÇ · ENTER BAŞLA · ESC GERİ',
    par: 'HEDEF {0}sn', best: 'REKOR {0} · {1}', noBest: 'HENÜZ REKOR YOK', falls: 'DÜŞÜŞ {0}', score: 'PUAN {0}',
    crossStart: 'BAŞLANGIÇ ÇİZGİSİNİ GEÇ!', checkpoint: 'KONTROL NOKTASI!', gateOpen: 'KAPI AÇILDI! KOŞ!', courseClear: 'BÖLÜM TAMAM!',
    paused: 'DURAKLATILDI', resume: 'DEVAM', restart: 'YENİDEN BAŞLAT', mainMenu: 'ANA MENÜ', nextLevel: 'SONRAKİ BÖLÜM', playAgain: 'TEKRAR OYNA', changeHero: 'KAHRAMAN DEĞİŞTİR',
    coinsRow: 'ALTIN {0} × 100', timeRow: 'SÜRE {0} (HEDEF {1}sn)', scoreRow: 'PUAN', newBest: 'YENİ REKOR!', rotate: 'CİHAZI YAN ÇEVİR', rotate2: 'CAPY DASH YATAY EKRANDA OYNANIR',
    archStart: 'BAŞLA', archFinish: 'BİTİŞ', hintSpecialKeys: 'C / SOL TIK: {0}', hintSpecialTouch: 'B TUŞU: {0}',
    c_move: 'HAREKET', c_jump: 'ZIPLA', c_run: 'KOŞ', c_special: 'ÖZEL', c_kerim: 'KERİM DARBESİ', c_pause: 'DURAKLAT', c_mute: 'SESSİZ',
    k_jump: 'BOŞLUK / ↑ / W / Z', k_special: 'C / SOL TIK', k_kerim: 'HAVADA ↓ / S', t_move: '◀ ▶  (KOŞMAK İÇİN UZUN BAS)',
    c_tip: 'DAHA YÜKSEK İÇİN ZIPLAMAYI BASILI TUT · BÖCEKLERİ EZ',
    h_capy: 'KAPİBARA', h_owl: 'AYS', h_mole: 'KERİM', h_coon: 'ROCCO',
    tag_capy: 'SAKİN VE SAĞLAM', tag_owl: 'KESKİN GÖZLÜ BAYKUŞ', tag_mole: 'BARETLİ KÖSTEBEK', tag_coon: 'TAVALI RAKUN',
    sp_capy: 'HAVA ATILIMI', sp_owl: 'TÜKÜRÜK ATIŞI', sp_mole: 'ŞOK DARBESİ', sp_coon: 'TAVA SALLAMA',
    l1: 'GÜNEŞLİ TEPELER', l2: 'AY IŞIĞI AĞI', l3: 'AYAZ ZİRVESİ', l1d: 'ORİJİNAL TEST BÖLÜMÜ', l2d: 'GECE BÖLÜMÜ + ÖRÜMCEK BOSS', l3d: 'BUZ, KAR + KARDAN ADAM BOSS',
    iosHint: 'TAM EKRAN: PAYLAŞ, SONRA "ANA EKRANA EKLE"', boss_spider: 'AY DOKUYUCU', boss_snowman: 'KARA AYAZ', ab_spider: 'AĞ FIRTINASI!', ab_snowman: 'BUZ SARKITI YAĞMURU!'
  }
};
function t(key, ...a) {
  const s = (STR[SETTINGS.lang] && STR[SETTINGS.lang][key]) || STR.en[key] || key;
  return s.replace(/\{(\d)\}/g, (_, i) => a[+i]);
}

// Patch notes: ['#', header] or a bullet line (wrapped automatically)
const NOTES = {
  en: [
    ['#', 'v0.5  MOBILE & FROST'],
    'Capy Dash is now an app: Android/iOS project (Capacitor) and an installable web app (PWA) that works offline',
    'Built for phones: landscape lock, fullscreen, wide screens, new touch controls (hold a direction longer to run), vibration',
    'New settings menu with languages: English, Deutsch, Türkçe',
    'New pixel font with German and Turkish letters',
    'Kerim\'s slam is now a SHOCK SLAM: a shockwave hits everything around him',
    'Mochi the frog is replaced by AYS the owl, who spits yellow seeds (B button / left click / C)',
    'Moonweaver: less HP (4) and a new WEB STORM attack below half HP',
    'Level 3 FROST PEAK: snow, slippery ice and the boss GRIMFROST, an evil snowman who throws snowballs and calls down icicles when he gets angry',
    ['#', 'v0.4  NIGHT & STEEL'],
    'Hand-made pixel sprites', 'New hero Rocco with a frying pan swing', 'Capybara air dash',
    'Score: 100 per coin + time bonus under par, ranks S-C, best scores', 'Level 2 MOONLIT WEB with the Moonweaver boss', 'Level select and patch notes',
    ['#', 'v0.3  RETRO LOOK'], 'Half-resolution pixel renderer, fixed colour palette, dithered overlays',
    ['#', 'v0.2  KERIM'], 'New hero Kerim, the hard-hat mole with a ground pound',
    ['#', 'v0.1  FIRST PLAYABLE'], 'Main menu, hero select, test level with start line, checkpoint and finish, coins, blocks, beetles and a pause menu'
  ],
  de: [
    ['#', 'v0.5  MOBIL & FROST'],
    'Capy Dash ist jetzt eine App: Android/iOS-Projekt (Capacitor) und eine installierbare Web-App (PWA), die offline läuft',
    'Für Handys gebaut: Querformat-Sperre, Vollbild, Breitbild, neue Touch-Steuerung (Richtung länger halten zum Rennen), Vibration',
    'Neues Einstellungsmenü mit Sprachen: English, Deutsch, Türkçe',
    'Neue Pixelschrift mit deutschen und türkischen Buchstaben',
    'Kerims Stampfer ist jetzt ein SCHOCKSTAMPFER: eine Schockwelle trifft alles um ihn herum',
    'Frosch Mochi wurde durch die Eule AYS ersetzt, die gelbe Körner spuckt (B-Taste / Linksklick / C)',
    'Mondweberin: weniger LP (4) und ein neuer NETZSTURM-Angriff unter halber LP',
    'Level 3 FROSTGIPFEL: Schnee, rutschiges Eis und der Boss GRIMMFROST, ein böser Schneemann, der Schneebälle wirft und wütend Eiszapfen herabregnen lässt',
    ['#', 'v0.4  NACHT & STAHL'],
    'Handgezeichnete Pixel-Sprites', 'Neuer Held Rocco mit Pfannenhieb', 'Luftsprint für das Capybara',
    'Punkte: 100 pro Münze + Zeitbonus unter der Zielzeit, Ränge S-C, Rekorde', 'Level 2 MONDNETZ mit der Mondweberin als Boss', 'Levelauswahl und Patch-Notizen',
    ['#', 'v0.3  RETRO-LOOK'], 'Pixel-Renderer in halber Auflösung, feste Farbpalette, gerasterte Overlays',
    ['#', 'v0.2  KERIM'], 'Neuer Held Kerim, der Maulwurf mit Helm und Stampfattacke',
    ['#', 'v0.1  ERSTE SPIELBARE VERSION'], 'Hauptmenü, Heldenauswahl, Testlevel mit Startlinie, Checkpoint und Ziel, Münzen, Blöcke, Käfer und Pausenmenü'
  ],
  tr: [
    ['#', 'v0.5  MOBİL & AYAZ'],
    'Capy Dash artık bir uygulama: Android/iOS projesi (Capacitor) ve çevrimdışı çalışan yüklenebilir web uygulaması (PWA)',
    'Telefonlar için tasarlandı: yatay ekran kilidi, tam ekran, geniş ekran desteği, yeni dokunmatik kontroller (koşmak için yöne uzun bas), titreşim',
    'Dil seçenekli yeni ayarlar menüsü: English, Deutsch, Türkçe',
    'Almanca ve Türkçe harfleri içeren yeni piksel yazı tipi',
    'Kerim\'in darbesi artık bir ŞOK DARBESİ: şok dalgası etrafındaki her şeye çarpar',
    'Kurbağa Mochi\'nin yerini sarı tohumlar tüküren baykuş AYS aldı (B tuşu / sol tık / C)',
    'Ay Dokuyucu: daha az can (4) ve canı yarının altına inince yeni AĞ FIRTINASI saldırısı',
    'Bölüm 3 AYAZ ZİRVESİ: kar, kaygan buz ve kartopu atan, sinirlenince buz sarkıtları yağdıran kötü kardan adam KARA AYAZ',
    ['#', 'v0.4  GECE & ÇELİK'],
    'Elle çizilmiş piksel karakterler', 'Tava sallayan yeni kahraman Rocco', 'Kapibara için hava atılımı',
    'Puan: altın başına 100 + hedef sürenin altında süre bonusu, S-C dereceleri, rekorlar', 'Ay Dokuyucu boss\'lu Bölüm 2 AY IŞIĞI AĞI', 'Bölüm seçimi ve güncelleme notları',
    ['#', 'v0.3  RETRO GÖRÜNÜM'], 'Yarı çözünürlükte piksel çizimi, sabit renk paleti, desenli karartma',
    ['#', 'v0.2  KERİM'], 'Yeni kahraman: yere çakılma saldırısı yapan baretli köstebek Kerim',
    ['#', 'v0.1  İLK OYNANABİLİR SÜRÜM'], 'Ana menü, kahraman seçimi, başlangıç çizgisi, kontrol noktası ve bitişi olan test bölümü, altınlar, bloklar, böcekler ve duraklatma menüsü'
  ]
};
