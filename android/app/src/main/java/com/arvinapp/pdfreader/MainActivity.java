package com.arvinapp.pdfreader;

import android.os.Bundle;
import androidx.annotation.Nullable;
import com.getcapacitor.BridgeActivity;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // İçeriğin ekranın kenarlarına kadar uzamasını sağlar
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);

        // Status bar ve navigasyon barı renklerini ayarla
        WindowInsetsControllerCompat windowInsetsController =
                WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());

        // Status bar'ı siyah yapar
        getWindow().setStatusBarColor(getResources().getColor(android.R.color.black));
        // Status bar ikonlarını beyaz yapar (açık stil kapalı)
        windowInsetsController.setAppearanceLightStatusBars(false);

        // Navigasyon barı siyah yapar
        getWindow().setNavigationBarColor(getResources().getColor(android.R.color.black));
        // Navigasyon barı ikonlarını beyaz yapar (açık stil kapalı)
        windowInsetsController.setAppearanceLightNavigationBars(false);
    }
}
