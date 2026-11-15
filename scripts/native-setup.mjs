// Forces landscape in the native projects created by `npx cap add android|ios`.
// Safe to run repeatedly (npm run sync calls it every time).
import fs from 'fs';

const manifest = 'android/app/src/main/AndroidManifest.xml';
if (fs.existsSync(manifest)) {
  let xml = fs.readFileSync(manifest, 'utf8');
  xml = xml.replace(/android:screenOrientation="[^"]*"\s*/g, '');
  xml = xml.replace(/<activity(\s)/, '<activity android:screenOrientation="sensorLandscape"$1');
  fs.writeFileSync(manifest, xml);
  console.log('Android: locked to landscape (sensorLandscape)');
}

const plist = 'ios/App/App/Info.plist';
if (fs.existsSync(plist)) {
  let p = fs.readFileSync(plist, 'utf8');
  const arr = '<array>\n\t\t<string>UIInterfaceOrientationLandscapeLeft</string>\n\t\t<string>UIInterfaceOrientationLandscapeRight</string>\n\t</array>';
  for (const key of ['UISupportedInterfaceOrientations', 'UISupportedInterfaceOrientations~ipad']) {
    const re = new RegExp('(<key>' + key.replace('~', '\\~') + '</key>\\s*)<array>[\\s\\S]*?</array>');
    if (re.test(p)) p = p.replace(re, '$1' + arr);
  }
  if (!p.includes('UIStatusBarHidden')) p = p.replace('</dict>\n</plist>', '\t<key>UIStatusBarHidden</key>\n\t<true/>\n\t<key>UIViewControllerBasedStatusBarAppearance</key>\n\t<false/>\n</dict>\n</plist>');
  fs.writeFileSync(plist, p);
  console.log('iOS: locked to landscape, status bar hidden');
}

// Android: immersive fullscreen (hides status bar AND navigation buttons; swipe from the edge shows them briefly)
const cfg = JSON.parse(fs.readFileSync('capacitor.config.json', 'utf8'));
const javaDir = 'android/app/src/main/java/' + cfg.appId.replace(/\./g, '/');
const mainActivity = javaDir + '/MainActivity.java';
if (fs.existsSync(mainActivity) && !fs.readFileSync(mainActivity, 'utf8').includes('hideSystemBars')) {
  fs.writeFileSync(mainActivity, `package ${cfg.appId};

import android.os.Bundle;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    hideSystemBars();
  }

  @Override
  public void onWindowFocusChanged(boolean hasFocus) {
    super.onWindowFocusChanged(hasFocus);
    if (hasFocus) hideSystemBars();
  }

  private void hideSystemBars() {
    WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
    WindowInsetsControllerCompat c = WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
    c.hide(WindowInsetsCompat.Type.systemBars());
    c.setSystemBarsBehavior(WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
  }
}
`);
  console.log('Android: immersive fullscreen enabled');
}
