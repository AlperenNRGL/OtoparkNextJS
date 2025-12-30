# Deployment Rehberi

Bu projeyi Supabase ve Vercel'de ücretsiz olarak yayınlamak için adımlar:

## 1. Supabase Kurulumu

### a) Supabase Hesabı Oluşturma
1. [Supabase](https://supabase.com) sitesine gidin
2. "Start your project" butonuna tıklayın
3. GitHub hesabınızla giriş yapın (ücretsiz)
4. Yeni bir proje oluşturun
5. Proje adı ve şifre belirleyin
6. Region seçin (en yakın bölgeyi seçin)

### b) Database Tablosu Oluşturma
1. Supabase Dashboard'da projenize gidin
2. Sol menüden "SQL Editor" seçin
3. `supabase-setup.sql` dosyasındaki SQL kodunu kopyalayın
4. SQL Editor'de yapıştırın ve "Run" butonuna tıklayın

### c) API Keys Alma
1. Dashboard'da "Settings" (Ayarlar) > "API" bölümüne gidin
2. Şu bilgileri kopyalayın:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL` (sayfanın üstünde görünür)
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY` (ilk key, "public" yazıyor)
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (ikinci key, "secret" yazıyor, yanında "Reveal" butonu var - tıklayarak görebilirsiniz)

**Önemli:** Eğer `service_role` key'i bulamıyorsanız:
- "API Keys" bölümünde iki key görmelisiniz: `anon` ve `service_role`
- `service_role` key'in yanında "Reveal" butonu varsa tıklayın
- Eğer hala göremiyorsanız, sadece `anon` key ile de çalışabilir (kod güncellendi)
- Ancak `service_role` key daha güçlü yetkilere sahiptir ve önerilir

## 2. Local Development

### a) Environment Variables
Proje klasöründe `.env.local` dosyası oluşturun:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Not:** `SUPABASE_SERVICE_ROLE_KEY` opsiyoneldir. Eğer bulamazsanız sadece ilk iki değişkeni ekleyin, kod otomatik olarak `anon` key kullanacaktır.

### b) Bağımlılıkları Yükleme
```bash
npm install
```

### c) Development Server
```bash
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini açın.

## 3. Vercel Deployment (Ücretsiz)

### a) GitHub'a Push
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/kullaniciadi/proje-adi.git
git push -u origin main
```

### b) Vercel'de Deploy
1. [Vercel](https://vercel.com) sitesine gidin
2. GitHub hesabınızla giriş yapın
3. "Add New Project" butonuna tıklayın
4. GitHub repository'nizi seçin
5. Framework Preset: **Next.js** (otomatik algılanır)
6. "Environment Variables" bölümüne tıklayın ve şunları ekleyin:
   - `NEXT_PUBLIC_SUPABASE_URL` → Supabase Project URL (zorunlu)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Supabase anon key (zorunlu)
   - `SUPABASE_SERVICE_ROLE_KEY` → Supabase service_role key (opsiyonel, ama önerilir)
7. "Deploy" butonuna tıklayın

### c) Otomatik Deployments
Her `git push` yaptığınızda Vercel otomatik olarak yeni bir deployment oluşturur.

## 4. Ücretsiz Limitler

### Supabase (Free Tier)
- ✅ 500 MB database storage
- ✅ 2 GB bandwidth
- ✅ 50,000 monthly active users
- ✅ Unlimited API requests

### Vercel (Free Tier)
- ✅ 100 GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Automatic SSL
- ✅ Global CDN

## 5. Sorun Giderme

### API Hatası Alıyorsanız
- Environment variables'ların doğru olduğundan emin olun
- Supabase'de tablonun oluşturulduğunu kontrol edin
- Browser console'da hata mesajlarını kontrol edin

### Database Bağlantı Hatası
- Supabase dashboard'da database'in aktif olduğunu kontrol edin
- SQL Editor'de tabloyu kontrol edin: `SELECT * FROM veri LIMIT 1;`

### CORS Hatası
- Next.js API routes CORS'u otomatik handle eder, ekstra yapılandırma gerekmez

## 6. Güvenlik Notları

- `SUPABASE_SERVICE_ROLE_KEY` asla client-side'da kullanmayın
- Production'da Row Level Security (RLS) politikalarını düzenleyin
- Environment variables'ları asla commit etmeyin (`.env.local` zaten `.gitignore`'da)

## 7. Sonraki Adımlar

- [ ] Authentication ekleme (Supabase Auth)
- [ ] File storage ekleme (Supabase Storage)
- [ ] Real-time subscriptions (Supabase Realtime)
- [ ] Custom domain ekleme (Vercel)

