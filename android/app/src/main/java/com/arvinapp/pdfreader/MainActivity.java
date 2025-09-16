package com.arvinapp.pdfreader;

import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowInsets;
import android.view.WindowManager;
import androidx.core.view.WindowCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Sistemin pencereyi tam ekran yapmasını engelle.
        WindowCompat.setDecorFitsSystemWindows(getWindow(), true);

        // Status bar ve navigation bar rengini tam siyah yap
        getWindow().setStatusBarColor(Color.BLACK);
        getWindow().setNavigationBarColor(Color.BLACK);

        // Status bar ikonlarını beyaz yap
        // Bu, farklı API seviyelerinde çalışacak en güvenilir yollardan biridir.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            getWindow().getDecorView().setSystemUiVisibility(getWindow().getDecorView().getSystemUiVisibility() & ~View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
        }

        final View rootView = findViewById(android.R.id.content);

        // Bu listener, sistem barlarının boyutları değiştiğinde tetiklenir
        // ve içeriğe uygun boşluk (padding) ekler.
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.Q) {
            rootView.setOnApplyWindowInsetsListener(new View.OnApplyWindowInsetsListener() {
                @Override
                public WindowInsets onApplyWindowInsets(View view, WindowInsets insets) {
                    int statusBarHeight = insets.getSystemWindowInsets().top;
                    int navigationBarHeight = insets.getSystemWindowInsets().bottom;

                    view.setPadding(
                        view.getPaddingLeft(),
                        statusBarHeight,
                        view.getPaddingRight(),
                        navigationBarHeight
                    );

                    return insets;
                }
            });
        }
    }
}
