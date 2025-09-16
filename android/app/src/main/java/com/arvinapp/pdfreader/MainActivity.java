package com.arvinapp.pdfreader;

import android.os.Bundle;
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

        // İkonları beyaz yap
        // (LIGHT_STATUS_BAR ve LIGHT_NAVIGATION_BAR kaldırıldı, böylece ikonlar beyaz kalır)
        int flags = getWindow().getDecorView().getSystemUiVisibility();
        getWindow().getDecorView().setSystemUiVisibility(flags);

        // WebView artık status/navigation bar'ın üstüne düşmez, normal layout gibi davranır
        // Tam ekran veya setDecorFitsSystemWindows(false) yok
    }
}
