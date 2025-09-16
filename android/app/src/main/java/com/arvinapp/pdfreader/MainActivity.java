package com.arvinapp.pdfreader;

import android.os.Bundle;
import android.view.View;
import android.view.WindowInsets;
import androidx.annotation.Nullable;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Bu satır Capacitor WebView için tam ekran
        getWindow().setDecorFitsSystemWindows(false);

        // Root view bul
        View rootView = findViewById(android.R.id.content);

        // Status bar + navigation bar yüksekliği kadar padding ekle
        rootView.setOnApplyWindowInsetsListener((v, insets) -> {
            int top = insets.getInsets(WindowInsets.Type.statusBars()).top;
            int bottom = insets.getInsets(WindowInsets.Type.navigationBars()).bottom;

            v.setPadding(0, top, 0, bottom);
            return insets;
        });
    }
}
