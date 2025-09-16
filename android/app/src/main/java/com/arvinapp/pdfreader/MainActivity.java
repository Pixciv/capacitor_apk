package com.arvinapp.pdfreader;

import android.os.Bundle;
import android.graphics.Color;
import androidx.annotation.Nullable;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Status bar ve navigation bar renklerini manuel ayarlama
        // Bu satırlar kaldırıldı veya yorum satırı yapıldı
        // getWindow().setStatusBarColor(Color.BLACK);
        // getWindow().setNavigationBarColor(Color.BLACK);

        // İkonları beyaz yap
        int flags = getWindow().getDecorView().getSystemUiVisibility();
        getWindow().getDecorView().setSystemUiVisibility(flags);
    }
}
