package com.arvinapp.pdfreader;

import android.os.Bundle;
import android.view.WindowManager;
import androidx.core.splashscreen.SplashScreen;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.installSplashScreen(this);
        super.onCreate(savedInstanceState);
        
        getWindow().setStatusBarColor(getResources().getColor(android.R.color.black));
        getWindow().setNavigationBarColor(getResources().getColor(android.R.color.black));
        
        // Bu, status bar ikonlarını beyaz yapar
        getWindow().getDecorView().setSystemUiVisibility(getWindow().getDecorView().getSystemUiVisibility() | 
                                                     WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
    }
}
