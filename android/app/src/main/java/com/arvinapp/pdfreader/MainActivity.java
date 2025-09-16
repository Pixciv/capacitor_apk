package com.arvinapp.pdfreader;

import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.graphics.Color;
import androidx.annotation.Nullable;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Status bar ve navigation bar siyah yap
        getWindow().setStatusBarColor(Color.BLACK);
        getWindow().setNavigationBarColor(Color.BLACK);

        // WebView’in status/navigation bar’ın altında başlamasını engelle
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            getWindow().setDecorFitsSystemWindows(true);
        } else {
            // Eski sürümlerde layout çakışmalarını önlemek için
            getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
        }

        // Status bar ve nav bar ikonlarını beyaz yap
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            int flags = getWindow().getDecorView().getSystemUiVisibility();

            // LIGHT_STATUS_BAR ve LIGHT_NAVIGATION_BAR flag’lerini kaldır
            flags &= ~View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                flags &= ~View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
            }

            getWindow().getDecorView().setSystemUiVisibility(flags);
        }
    }
}
