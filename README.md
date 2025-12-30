# Blog App - Next.js + Supabase

Bu proje Express.js'den Next.js'e çevrilmiş ve Supabase ile entegre edilmiştir.

## Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Environment variables oluşturun:
`.env.local` dosyası oluşturun ve aşağıdaki değişkenleri ekleyin:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

3. Supabase'de tablo oluşturun:
- Supabase Dashboard'a gidin
- SQL Editor'ü açın
- `supabase-setup.sql` dosyasındaki SQL kodunu kopyalayın ve çalıştırın

Tablo yapısı:
- `data` (JSONB) - Tüm veriler burada saklanır (MongoDB gibi esnek yapı)
- `created_at` (TIMESTAMP) - Oluşturulma tarihi
- `updated_at` (TIMESTAMP) - Güncellenme tarihi

**Not:** Veri yapısı değişken olduğu için JSONB kullanılmaktadır. Bazı kayıtlarda `tip`, `giris`, `price` gibi alanlar olabilir, bazılarında olmayabilir. MongoDB'deki gibi esnek bir yapıdır.

## Geliştirme

```bash
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini açın.

## Production Build

```bash
npm run build
npm start
```

## Deployment (Vercel)

1. Projeyi GitHub'a push edin
2. [Vercel](https://vercel.com) hesabınızla giriş yapın
3. "New Project" butonuna tıklayın
4. GitHub repository'nizi seçin
5. Environment variables'ları ekleyin:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
6. Deploy butonuna tıklayın

## API Endpoints

### POST /api/veri-ekle
Veri ekleme endpoint'i

**Request Body (örnekler):**

Tek kayıt:
```json
{
  "plaka": "61 VV 111",
  "tip": "taksi",
  "date": "2025-12-28T06:55:12.927Z",
  "islem": "cıkıs",
  "giris": 1766904904921,
  "price": "70"
}
```

Veya farklı alanlarla:
```json
{
  "plaka": "61 SA 123",
  "date": "2025-12-28T06:55:09.265Z",
  "price": "70",
  "islem": "veresiye"
}
```

Array olarak birden fazla kayıt:
```json
[
  { "plaka": "61 VV 111", "tip": "taksi", "islem": "giris" },
  { "plaka": "61 SA 123", "islem": "veresiye", "price": "70" }
]
```

**Not:** Veri yapısı esnektir, istediğiniz alanları ekleyebilirsiniz. `__v` alanı otomatik olarak temizlenir.

### GET /api/veri-getir
Tüm verileri getirme

### POST /api/veri-getir
Plaka ile filtreleme

**Request Body:**
```json
{
  "plaka": "34ABC123"
}
```

## Notlar

- MongoDB yerine Supabase PostgreSQL kullanılmaktadır
- Eski `index.js` dosyası artık kullanılmamaktadır (yedek olarak saklanabilir)
- Supabase'de tablo yapısını ihtiyacınıza göre özelleştirebilirsiniz

# OtoparkNextJS
