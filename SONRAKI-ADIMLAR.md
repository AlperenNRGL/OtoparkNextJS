# 🚀 Sonraki Adımlar

## 1️⃣ Supabase API Keys'lerini Alın

1. Supabase Dashboard'da **Settings** (Ayarlar) → **API** bölümüne gidin
2. Şu bilgileri kopyalayın:
   - **Project URL** (sayfanın üstünde, örn: `https://xxxxx.supabase.co`)
   - **anon public** key (ilk key, "public" yazıyor)
   - **service_role** key (ikinci key, "secret" yazıyor, yanında "Reveal" butonu var)

## 2️⃣ .env.local Dosyası Oluşturun

Proje klasöründe `.env.local` dosyası oluşturun ve şunları ekleyin:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Not:** `SUPABASE_SERVICE_ROLE_KEY` bulamazsanız sadece ilk iki satırı ekleyin, kod otomatik olarak anon key kullanacaktır.

## 3️⃣ Bağımlılıkları Yükleyin

Terminal'de:
```bash
npm install
```

## 4️⃣ Projeyi Çalıştırın

```bash
npm run dev
```

Tarayıcıda açın: http://localhost:3000

## 5️⃣ API Test Edin

### Veri Ekleme Testi:
```bash
curl -X POST http://localhost:3000/api/veri-ekle \
  -H "Content-Type: application/json" \
  -d '{"plaka": "61 VV 111", "tip": "taksi", "date": "2025-12-28T06:55:12.927Z", "islem": "giris"}'
```

### Veri Getirme Testi:
```bash
curl http://localhost:3000/api/veri-getir
```

### Plaka ile Filtreleme:
```bash
curl -X POST http://localhost:3000/api/veri-getir \
  -H "Content-Type: application/json" \
  -d '{"plaka": "61 VV 111"}'
```

## ✅ Başarılı!

Eğer her şey çalışıyorsa, artık Vercel'de deploy edebilirsiniz!

