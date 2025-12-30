# 🚀 Projeyi Çalıştırma Adımları

## 1️⃣ Bağımlılıkları Yükleme
Terminal'de şu komutu çalıştırın:
```bash
npm install
```
Bu işlem 1-3 dakika sürebilir (internet hızınıza bağlı).

## 2️⃣ Supabase Kurulumu

### a) Supabase Hesabı Oluşturun
1. https://supabase.com → "Start your project"
2. GitHub ile giriş yapın
3. Yeni proje oluşturun
4. Proje adı ve şifre belirleyin

### b) API Keys'leri Alın
1. Dashboard → **Settings** → **API**
2. Şu bilgileri kopyalayın:
   - **Project URL** (sayfanın üstünde)
   - **anon public** key (ilk key)
   - **service_role** key (ikinci key, "Reveal" butonuna tıklayın)

### c) Database Tablosu Oluşturun
1. Dashboard → **SQL Editor**
2. `supabase-setup.sql` dosyasını açın
3. İçindeki SQL kodunu kopyalayın
4. SQL Editor'e yapıştırın ve **Run** butonuna tıklayın

## 3️⃣ Environment Variables Ayarlama

Proje klasöründe `.env.local` dosyası oluşturun:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Not:** `SUPABASE_SERVICE_ROLE_KEY` bulamazsanız sadece ilk iki satırı ekleyin.

## 4️⃣ Projeyi Çalıştırma

Terminal'de:
```bash
npm run dev
```

Tarayıcıda açın: http://localhost:3000

## 5️⃣ Test Etme

### API Test (Postman veya curl ile):

**Veri Ekleme:**
```bash
curl -X POST http://localhost:3000/api/veri-ekle \
  -H "Content-Type: application/json" \
  -d '{"plaka": "34ABC123", "test": "veri"}'
```

**Veri Getirme:**
```bash
curl http://localhost:3000/api/veri-getir
```

## 6️⃣ Vercel'de Deploy (Ücretsiz)

1. GitHub'a push edin:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/kullaniciadi/proje-adi.git
git push -u origin main
```

2. Vercel'de:
   - https://vercel.com → GitHub ile giriş
   - "Add New Project"
   - Repository seçin
   - Environment Variables ekleyin (Supabase keys)
   - Deploy!

## ✅ Tamamlandı!

Artık projeniz çalışıyor! 🎉

