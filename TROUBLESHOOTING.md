# Next.js Başlatma Sorunları - Çözüm Adımları

## Problem: `npm run dev` sessiz kalıyor, hiçbir çıktı yok

### Çözüm 1: Cache Temizleme

Terminal'de şu komutları sırayla çalıştırın:

```bash
# .next klasörünü sil (cache)
rm -rf .next

# node_modules'i temizle (opsiyonel, ama bazen gerekli)
rm -rf node_modules
rm package-lock.json

# Bağımlılıkları yeniden yükle
npm install

# Tekrar başlat
npm run dev
```

### Çözüm 2: Farklı Port Dene

```bash
# Port 3001'de başlat
npx next dev -p 3001
```

### Çözüm 3: Verbose Mode (Detaylı Log)

```bash
# Daha detaylı log için
DEBUG=* npm run dev
```

### Çözüm 4: Node.js Versiyonu Kontrol

```bash
# Node.js versiyonunu kontrol et (18.17.0+ olmalı)
node --version

# Eğer 16 veya daha düşükse, güncelle
nvm use 20
# veya
nvm install 20
nvm use 20
```

### Çözüm 5: Environment Variables Kontrol

`.env.local` dosyasının doğru olduğundan emin olun:
- Dosya var mı?
- Keys'ler doğru mu?
- Format doğru mu? (tırnak işareti yok)

### Çözüm 6: Manuel Başlatma

```bash
# Next.js'i direkt çalıştır
npx next dev
```

Eğer hala çalışmazsa, hata mesajını paylaşın.

