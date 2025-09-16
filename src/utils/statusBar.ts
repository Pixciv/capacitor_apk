import { StatusBar, Style } from '@capacitor/status-bar';

export const configureStatusBar = async () => {
  try {
    // Status bar'ı göster
    await StatusBar.show();
    
    // Stili ayarla (beyaz ikonlar için DARK)
    await StatusBar.setStyle({ style: Style.Dark });
    
    // Arkaplan rengini siyah yap
    await StatusBar.setBackgroundColor({ color: '#000000' });
    
    console.log('Status bar configured successfully');
  } catch (error) {
    console.error('Error configuring status bar:', error);
  }
};
