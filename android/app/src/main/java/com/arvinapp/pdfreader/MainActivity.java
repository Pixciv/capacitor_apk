package com.arvinapp.pdfreader;

import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowInsets;
import androidx.annotation.Nullable;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Capacitor WebView için tam ekran
        getWindow().setDecorFitsSystemWindows(false);

        // Status bar ve navigation bar ikon renkleri
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            // Status bar ikonları koyu (light content: false → beyaz ikon)
            int flags = getWindow().getDecorView().getSystemUiVisibility();
            getWindow().getDecorView().setSystemUiVisibility(flags & ~View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            // Navigation bar ikonları beyaz
            int flags = getWindow().getDecorView().getSystemUiVisibility();
            getWindow().getDecorView().setSystemUiVisibility(flags & ~View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR);
        }

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
