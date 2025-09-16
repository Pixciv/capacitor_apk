package com.arvinapp.pdfreader;

import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowInsets;
import android.graphics.Color;
import androidx.annotation.Nullable;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Capacitor WebView için tam ekran
        getWindow().setDecorFitsSystemWindows(false);

        // Status bar ve navigation bar siyah yap
        getWindow().setStatusBarColor(Color.BLACK);
        getWindow().setNavigationBarColor(Color.BLACK);

        // Status bar ve nav bar ikonlarını beyaz yap (tüm flagleri birleştirerek)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            int flags = getWindow().getDecorView().getSystemUiVisibility();
            
            // LIGHT_STATUS_BAR ve LIGHT_NAVIGATION_BAR flag'lerini kaldır
            flags &= ~View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                flags &= ~View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
            }
            
            // FULLSCREEN veya diğer immersive flag’leri kaldır (bazı cihazlarda override edebiliyor)
            flags &= ~View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN;
            flags &= ~View.SYSTEM_UI_FLAG_LAYOUT_STABLE;

            getWindow().getDecorView().setSystemUiVisibility(flags);
        }
    }
}
