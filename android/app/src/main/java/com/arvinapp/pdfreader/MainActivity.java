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

        // --- STATUS BAR ---
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.ICE_CREAM_SANDWICH) { // Android 15+
            window.getDecorView().setOnApplyWindowInsetsListener((view, insets) -> {
                int statusBarHeight = insets.getInsets(WindowInsets.Type.statusBars()).top;
                view.setBackgroundColor(Color.BLACK);
                view.setPadding(0, statusBarHeight, 0, 0);
                return insets;
            });
            window.getDecorView().setSystemUiVisibility(0); // beyaz ikonlar
        } else {
            window.setStatusBarColor(Color.BLACK);
            window.getDecorView().setSystemUiVisibility(0); // beyaz ikonlar
        }

        // --- NAVIGATION BAR ---
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.ICE_CREAM_SANDWICH) { // Android 15+
            window.getDecorView().setOnApplyWindowInsetsListener((view, insets) -> {
                int navBarHeight = insets.getInsets(WindowInsets.Type.navigationBars()).bottom;
                view.setPadding(0, view.getPaddingTop(), 0, navBarHeight);
                view.setBackgroundColor(Color.BLACK); // arka plan siyah
                return insets;
            });
            window.getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR); // ikon beyaz
        } else {
            window.setNavigationBarColor(Color.BLACK);
            window.getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR); // ikon beyaz
        }
    }
}
