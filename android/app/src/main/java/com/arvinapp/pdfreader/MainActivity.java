package com.arvinapp.pdfreader;

import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowInsets;
import androidx.core.view.WindowCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Sistemin pencereyi tam ekran yapmasını engelle.
        WindowCompat.setDecorFitsSystemWindows(getWindow(), true);

        // Status bar rengini siyah yap
        getWindow().setStatusBarColor(Color.BLACK);

        // Status bar ikonlarını (zaman, pil simgesi vs.) beyaz yap
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            View decorView = getWindow().getDecorView();
            decorView.setSystemUiVisibility(decorView.getSystemUiVisibility() & ~View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
        }

        // Web içeriğini barındıran view'ı bul.
        final View rootView = findViewById(android.R.id.content);

        // Bu listener, sistem barlarının boyutları değiştiğinde tetiklenir
        // ve içeriğe uygun boşluk (padding) ekler.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            rootView.setOnApplyWindowInsetsListener(new View.OnApplyWindowInsetsListener() {
                @Override
                public WindowInsets onApplyWindowInsets(View view, WindowInsets insets) {
                    // Güncel API kullanımı
                    int statusBarHeight = insets.getInsets(WindowInsets.Type.systemBars()).top;
                    int navigationBarHeight = insets.getInsets(WindowInsets.Type.systemBars()).bottom;

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
