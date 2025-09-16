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
        
        // STATÜS BAR SİYAH - BEYAZ İKONLAR İÇİN MUTLAK ÇÖZÜM
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
        Window window = getWindow();
        
        // 1. ÖNCE TÜM BAYRAKLARI TEMİZLE
        window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
        
        // 2. STATUS BAR RENGİNİ SİYAH YAP (Tüm Android versiyonları için)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
            window.setStatusBarColor(Color.BLACK); // SİYAH arkaplan
        } else {
            // Eski Android için
            window.addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
        }
        
        // 3. İKONLARI BEYAZ YAP - EN KRİTİK KISIM!
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            View decorView = window.getDecorView();
            int systemUiVisibility = decorView.getSystemUiVisibility();
            
            // Işık status bar modunu KESİNLİKLE KAPAT
            systemUiVisibility &= ~View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
            
            // Fullscreen modundan çıkar
            systemUiVisibility &= ~View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN;
            systemUiVisibility &= ~View.SYSTEM_UI_FLAG_FULLSCREEN;
            
            decorView.setSystemUiVisibility(systemUiVisibility);
        }
        
        // 4. LIGHT STATUS BAR ÖZELLİĞİNİ ZORLA KAPAT
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            WindowManager.LayoutParams params = window.getAttributes();
            params.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_DEFAULT;
            window.setAttributes(params);
        }
    }
    
    // Aktivite yeniden başladığında da ayarları uygula
    @Override
    protected void onResume() {
        super.onResume();
        setStatusBarBlackWithWhiteIcons();
    }
}
