#!/bin/bash
set -e

# Arşiv dosyası
ARCHIVE="capacitor_apk_full.tar.gz"
TEMP_DIR="temp_unpack"

# Geçici klasör oluştur
mkdir -p $TEMP_DIR

# Arşivi aç
tar -xzf $ARCHIVE -C $TEMP_DIR

# Eğer iç klasör varsa (ör: capacitor_apk), içini repo köküne taşı
if [ -d "$TEMP_DIR/capacitor_apk" ]; then
    mv $TEMP_DIR/capacitor_apk/* ./
else
    mv $TEMP_DIR/* ./
fi

# Geçici klasörü temizle
rm -rf $TEMP_DIR
