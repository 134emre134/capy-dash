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
    highscores: 'HIGH SCORES · LEVEL', iosHint: 'FULLSCREEN: TAP SHARE, THEN "ADD TO HOME SCREEN"', boss_spider: 'MOONWEAVER', boss_snowman: 'GRIMFROST', ab_spider: 'WEB STORM!', ab_snowman: 'ICICLE RAIN!'
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
    highscores: 'REKORDE · LEVEL', iosHint: 'VOLLBILD: TEILEN TIPPEN, DANN "ZUM HOME-BILDSCHIRM"', boss_spider: 'MONDWEBERIN', boss_snowman: 'GRIMMFROST', ab_spider: 'NETZSTURM!', ab_snowman: 'EISZAPFENREGEN!'
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
    highscores: 'REKORLAR · BÖLÜM', iosHint: 'TAM EKRAN: PAYLAŞ, SONRA "ANA EKRANA EKLE"', boss_spider: 'AY DOKUYUCU', boss_snowman: 'KARA AYAZ', ab_spider: 'AĞ FIRTINASI!', ab_snowman: 'BUZ SARKITI YAĞMURU!'
  }
};
function t(key, ...a) {
  const s = (STR[SETTINGS.lang] && STR[SETTINGS.lang][key]) || STR.en[key] || key;
  return s.replace(/\{(\d)\}/g, (_, i) => a[+i]);
}

// Patch notes (gameplay changes only): ['#', header] or a bullet line (wrapped automatically)
const NOTES = {
  en: [
    ['#', 'v1.0  RELEASE'],
    'Capybara: the AIR DASH now makes you invincible for a moment - dash through beetles, webs, snowballs and spikes',
    'Rocco: the PAN SWING reaches much further',
    'Ays: SPIT SHOT seeds fly slower, don\'t go as far and need a bit longer to recharge',
    'Kerim jumps higher',
    ['#', 'v0.5  FROST'],
    'Kerim\'s slam became the SHOCK SLAM: a shockwave hits everything around him',
    'New hero AYS the owl replaces Mochi the frog and spits yellow seeds that hit enemies, bosses, webs and bricks',
    'Moonweaver: less HP (4) and a new WEB STORM attack below half HP',
    'New level 3 FROST PEAK with slippery ice and the boss GRIMFROST, an evil snowman who throws snowballs, jumps at you and calls down icicles when he gets angry',
    ['#', 'v0.4  NIGHT & STEEL'],
    'New hero Rocco the raccoon with a frying pan swing',
    'Capybara AIR DASH',
    'New scoring: 100 per coin + time bonus under par, ranks S to C',
    'New level 2 MOONLIT WEB with the spider boss Moonweaver',
    ['#', 'v0.2  KERIM'], 'New hero Kerim, the hard-hat mole with a ground pound',
    ['#', 'v0.1  FIRST PLAYABLE'], 'Heroes Capybara and Mochi, test level with start line, checkpoint and finish, coins, star blocks, bricks, spikes, pits and beetles'
  ],
  de: [
    ['#', 'v1.0  RELEASE'],
    'Capybara: der LUFTSPRINT macht dich kurz unverwundbar - sprinte durch Käfer, Netze, Schneebälle und Stacheln',
    'Rocco: der PFANNENHIEB hat jetzt eine viel größere Reichweite',
    'Ays: die Körner des SPUCKSCHUSS fliegen langsamer, weniger weit und laden etwas länger nach',
    'Kerim springt höher',
    ['#', 'v0.5  FROST'],
    'Kerims Stampfer wurde zum SCHOCKSTAMPFER: eine Schockwelle trifft alles um ihn herum',
    'Neue Heldin AYS, die Eule, ersetzt Frosch Mochi und spuckt gelbe Körner, die Gegner, Bosse, Netze und Ziegel treffen',
    'Mondweberin: weniger LP (4) und ein neuer NETZSTURM-Angriff unter halber LP',
    'Neues Level 3 FROSTGIPFEL mit rutschigem Eis und dem Boss GRIMMFROST, einem bösen Schneemann, der Schneebälle wirft, auf dich springt und wütend Eiszapfen herabregnen lässt',
    ['#', 'v0.4  NACHT & STAHL'],
    'Neuer Held Rocco, der Waschbär mit Pfannenhieb',
    'LUFTSPRINT für das Capybara',
    'Neue Punktewertung: 100 pro Münze + Zeitbonus unter der Zielzeit, Ränge S bis C',
    'Neues Level 2 MONDNETZ mit der Spinnen-Bossin Mondweberin',
    ['#', 'v0.2  KERIM'], 'Neuer Held Kerim, der Maulwurf mit Helm und Stampfattacke',
    ['#', 'v0.1  ERSTE SPIELBARE VERSION'], 'Helden Capybara und Mochi, Testlevel mit Startlinie, Checkpoint und Ziel, Münzen, Sternblöcke, Ziegel, Stacheln, Abgründe und Käfer'
  ],
  tr: [
    ['#', 'v1.0  ÇIKIŞ'],
    'Kapibara: HAVA ATILIMI artık seni kısa süre ölümsüz yapıyor - böceklerin, ağların, kartopların ve dikenlerin içinden geç',
    'Rocco: TAVA SALLAMA artık çok daha uzağa ulaşıyor',
    'Ays: TÜKÜRÜK ATIŞI tohumları daha yavaş ve daha kısa mesafeye gidiyor, dolması biraz daha uzun sürüyor',
    'Kerim daha yükseğe zıplıyor',
    ['#', 'v0.5  AYAZ'],
    'Kerim\'in darbesi ŞOK DARBESİ oldu: şok dalgası etrafındaki her şeye çarpar',
    'Yeni kahraman baykuş AYS, kurbağa Mochi\'nin yerini aldı; düşmanlara, bosslara, ağlara ve tuğlalara çarpan sarı tohumlar tükürür',
    'Ay Dokuyucu: daha az can (4) ve canı yarının altına inince yeni AĞ FIRTINASI saldırısı',
    'Yeni Bölüm 3 AYAZ ZİRVESİ: kaygan buz ve kartopu atan, üstüne zıplayan, sinirlenince buz sarkıtları yağdıran kötü kardan adam boss KARA AYAZ',
    ['#', 'v0.4  GECE & ÇELİK'],
    'Tava sallayan yeni kahraman rakun Rocco',
    'Kapibara için HAVA ATILIMI',
    'Yeni puanlama: altın başına 100 + hedef sürenin altında süre bonusu, S\'den C\'ye dereceler',
    'Örümcek boss Ay Dokuyucu ile yeni Bölüm 2 AY IŞIĞI AĞI',
    ['#', 'v0.2  KERİM'], 'Yeni kahraman: yere çakılma saldırısı yapan baretli köstebek Kerim',
    ['#', 'v0.1  İLK OYNANABİLİR SÜRÜM'], 'Kahramanlar Kapibara ve Mochi; başlangıç çizgisi, kontrol noktası ve bitişi olan test bölümü, altınlar, yıldız blokları, tuğlalar, dikenler, çukurlar ve böcekler'
  ]
};
