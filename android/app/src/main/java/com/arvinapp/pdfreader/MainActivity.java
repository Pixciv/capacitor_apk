import android.view.View;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.widget.FrameLayout;

@Override
protected void onCreate(Bundle savedInstanceState) {
  super.onCreate(savedInstanceState);

  getWindow().setDecorFitsSystemWindows(false);

  // Root view bul
  View rootView = findViewById(android.R.id.content);

  // Insets (status bar + nav bar) dinle
  rootView.setOnApplyWindowInsetsListener((v, insets) -> {
      int top = insets.getInsets(WindowInsets.Type.statusBars()).top;
      int bottom = insets.getInsets(WindowInsets.Type.navigationBars()).bottom;

      // WebView içine padding ver
      v.setPadding(0, top, 0, bottom);
      return insets;
  });
}
