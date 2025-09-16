package com.arvinapp.pdfreader;

import android.graphics.Color;
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

        // Status bar ve navigation bar rengini tam siyah yap
        getWindow().setStatusBarColor(Color.BLACK);
        getWindow().setNavigationBarColor(Color.BLACK);

        // Status bar ve navigation bar ikonlarını beyaz yap
        WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView())
                .setAppearanceLightStatusBars(false);
        WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView())
                .setAppearanceLightNavigationBars(false);
        
        // Uygulama içeriğinin sistem barlarıyla çakışmasını engelle
        final View rootView = findViewById(android.R.id.content);
        
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
