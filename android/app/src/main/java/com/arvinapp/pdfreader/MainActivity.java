package com.arvinapp.pdfreader;

import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowInsets;
import android.view.WindowManager;
import androidx.core.view.WindowCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // STATÜS BAR SİYAH - BEYAZ İKONLAR İÇİN KESİN ÇÖZÜM
        setStatusBarBlackWithWhiteIcons();
        
        // Diğer kodlarınız aynen kalıyor...
        WindowCompat.setDecorFitsSystemWindows(getWindow(), true);

        final View rootView = findViewById(android.R.id.content);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            rootView.setOnApplyWindowInsetsListener(new View.OnApplyWindowInsetsListener() {
                @Override
                public WindowInsets onApplyWindowInsets(View view, WindowInsets insets) {
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
    
    private void setStatusBarBlackWithWhiteIcons() {
        // Status bar arkaplanını SİYAH yap
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            Window window = getWindow();
            window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
            window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
            window.setStatusBarColor(Color.BLACK); // SİYAH arkaplan
        }
        
        // İkonları BEYAZ yap (Light status bar modunu KAPAT)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            View decorView = getWindow().getDecorView();
            int flags = decorView.getSystemUiVisibility();
            flags &= ~View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR; // Bu satır ÇOK ÖNEMLİ!
            decorView.setSystemUiVisibility(flags);
        }
    }
}
