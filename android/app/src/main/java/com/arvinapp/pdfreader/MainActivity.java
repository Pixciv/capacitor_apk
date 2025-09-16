package com.arvinapp.pdfreader;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Status bar ve navigation bar alanlarını ayrı bırak, web içerik altından başlasın
    getWindow().setDecorFitsSystemWindows(true);

    // Status bar rengini ayarla (istediğin renge çevirebilirsin)
    getWindow().setStatusBarColor(android.graphics.Color.BLACK);

    // Navigation bar rengini ayarla (opsiyonel)
    getWindow().setNavigationBarColor(android.graphics.Color.BLACK);
  }
}
