import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowInsets;
import androidx.core.view.WindowCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Sistemin pencereyi tam ekran yapmasını engelle.
        WindowCompat.setDecorFitsSystemWindows(getWindow(), true);

        // Web içeriğini barındıran view'ı bul.
        final View rootView = findViewById(android.R.id.content);

        // Bu listener, sistem barlarının boyutları değiştiğinde tetiklenir
        // ve içeriğe uygun boşluk (padding) ekler.
        rootView.setOnApplyWindowInsetsListener(new View.OnApplyWindowInsetsListener() {
            @Override
            public WindowInsets onApplyWindowInsets(View view, WindowInsets insets) {
                // Güvenli alan (safe area) insets'lerini al
                int statusBarHeight = insets.getSystemWindowInsetTop();
                int navigationBarHeight = insets.getSystemWindowInsetBottom();

                // Web içeriğinin olduğu view'a bu boşlukları uygula
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
