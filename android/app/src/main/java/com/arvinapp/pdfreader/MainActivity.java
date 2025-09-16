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
        
        // DİĞER TÜM KODLARI SİLİYORUZ, SADECE BUNU EKLİYORUZ
        setStatusBarBlackWithWhiteIcons();
    }
    
    private void setStatusBarBlackWithWhiteIcons() {
        try {
            Window window = getWindow();
            
            // 1. ÖNCE TÜM AYARLARI TEMİZLE
            window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
            
            // 2. SADECE SİYAH RENK YAP
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
                window.setStatusBarColor(Color.parseColor("#FF000000")); // Tam opak siyah
            }
            
            // 3. BEYAZ İKONLAR İÇİN SADECE BU SATIR
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                View decorView = window.getDecorView();
                decorView.setSystemUiVisibility(View.SYSTEM_UI_FLAG_VISIBLE); // Tüm sistem UI ayarlarını sıfırla
            }
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
