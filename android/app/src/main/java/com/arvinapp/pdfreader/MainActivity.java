package com.arvinapp.pdfreader;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Status bar alanını ayrı bırak, web içerik altından başlasın
    getWindow().setDecorFitsSystemWindows(true);

    // İsteğe bağlı: status bar rengini beyaz yap (değiştirebilirsin)
    getWindow().setStatusBarColor(android.graphics.Color.WHITE);
  }
}
