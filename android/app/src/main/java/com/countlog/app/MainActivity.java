package com.countlog.app;

import android.os.Bundle;

import androidx.appcompat.app.AppCompatDelegate;
import androidx.webkit.WebSettingsCompat;
import androidx.webkit.WebViewFeature;
import androidx.core.view.WindowCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO);
    super.onCreate(savedInstanceState);
    WindowCompat.enableEdgeToEdge(getWindow());

    if (WebViewFeature.isFeatureSupported(WebViewFeature.FORCE_DARK)) {
      WebSettingsCompat.setForceDark(bridge.getWebView().getSettings(), WebSettingsCompat.FORCE_DARK_OFF);
    }
  }
}
