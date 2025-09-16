package com.arvinapp.pdfreader;

import android.os.Bundle;
import androidx.annotation.Nullable;
import androidx.core.view.WindowCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Bu satır, web içeriğinizin sistem barlarının (status ve navigation) 
        // altına taşmasını engeller ve içeriği barlara göre ayırır.
        WindowCompat.setDecorFitsSystemWindows(getWindow(), true);
    }
}
