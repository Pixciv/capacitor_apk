package com.arvinapp.pdfreader;

import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowInsets;
import android.graphics.Color;
import androidx.annotation.Nullable;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Window window = getWindow();

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.ICE_CREAM_SANDWICH) { // Android 15+ için
            window.getDecorView().setOnApplyWindowInsetsListener((view, insets) -> {
                // Status bar yüksekliğini al
                int statusBarHeight = insets.getInsets(WindowInsets.Type.statusBars()).top;
                
                // View arka planını siyah yap
                view.setBackgroundColor(Color.BLACK);

                // İçeriğin status bar ile çakışmaması için padding ekle
                view.setPadding(0, statusBarHeight, 0, 0);

                return insets;
            });

            // Status bar ikonlarını beyaz yap
            window.getDecorView().setSystemUiVisibility(0);
        } else {
            // Android 15 altı cihazlar
            window.setStatusBarColor(Color.BLACK);
            // Beyaz ikonlar için legacy flag
            window.getDecorView().setSystemUiVisibility(0);
        }

        // Navigation bar siyah ve ikonlar beyaz
        window.setNavigationBarColor(Color.BLACK);
        window.getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR);
    }
}
