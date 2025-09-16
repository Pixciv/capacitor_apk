package com.arvinapp.pdfreader;

import android.os.Bundle;
import androidx.core.view.WindowCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Bu ayar, web içeriğinin sistem barlarının altına taşmasını engeller.
        WindowCompat.setDecorFitsSystemWindows(getWindow(), true);
    }
}
