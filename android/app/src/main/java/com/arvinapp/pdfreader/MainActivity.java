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

        // Status bar ve navigation bar siyah, ikonlar beyaz
        applyEdgeToEdgeBlackBars(window);
    }

    private void applyEdgeToEdgeBlackBars(Window window) {
        final int blackColor = Color.BLACK;

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.ICE_CREAM_SANDWICH) { // Android 15+
            window.getDecorView().setOnApplyWindowInsetsListener((view, insets) -> {
                int statusBarHeight = insets.getInsets(WindowInsets.Type.statusBars()).top;
                int navBarHeight = insets.getInsets(WindowInsets.Type.navigationBars()).bottom;

                // Arka planı siyah ve padding ayarla
                view.setBackgroundColor(blackColor);
                view.setPadding(0, statusBarHeight, 0, navBarHeight);

                return insets;
            });

            // Status bar ve navigation bar ikonları beyaz
            int flags = View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                      | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                      | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION;
            window.getDecorView().setSystemUiVisibility(flags);

            window.setStatusBarColor(blackColor);
            window.setNavigationBarColor(blackColor);
        } else {
            // Android 15 ve altı
            window.setStatusBarColor(blackColor);
            window.setNavigationBarColor(blackColor);
            window.getDecorView().setSystemUiVisibility(0); // ikonlar beyaz
        }
    }
}
