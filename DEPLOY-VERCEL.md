# 🚀 Vercel'de Deployment - Hızlı Rehber

## Adım 1: GitHub'a Push

Terminal'de şu komutları çalıştırın:

```bash
cd /Users/alperennuroglu/Desktop/nextjs

# Git başlat (eğer yoksa)
git init

# Tüm dosyaları ekle
git add .

# Commit yap
git commit -m "Next.js + Supabase project ready for deployment"

# GitHub'da yeni repository oluşturun, sonra:
git remote add origin https://github.com/KULLANICIADI/REPO-ADI.git
git branch -M main
git push -u origin main
```

**Not:** GitHub'da repository oluştururken README, .gitignore, license eklemeyin (zaten var).

## Adım 2: Vercel'de Deploy

1. **Vercel'e gidin:** https://vercel.com
2. **GitHub ile giriş yapın**
3. **"Add New Project"** butonuna tıklayın
4. **Repository'nizi seçin** (az önce push ettiğiniz)
5. **Framework Preset:** Next.js (otomatik algılanır)
6. **Root Directory:** `./` (boş bırakın)
7. **Build Command:** `npm run build` (otomatik)
8. **Output Directory:** `.next` (otomatik)

## Adım 3: Environment Variables Ekleme

Vercel'de proje ayarlarına gidin:

1. **Settings** → **Environment Variables**
2. Şu değişkenleri ekleyin:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Önemli:** 
- Her birini **Production**, **Preview**, ve **Development** için ekleyin
- Değerleri `.env.local` dosyanızdan kopyalayın

## Adım 4: Deploy!

1. **"Deploy"** butonuna tıklayın
2. 1-2 dakika bekleyin
3. ✅ **Başarılı!** Artık projeniz canlıda!

## Adım 5: Domain Ayarlama (Opsiyonel)

1. Vercel Dashboard → **Settings** → **Domains**
2. Custom domain ekleyebilirsiniz (ücretsiz SSL otomatik)

## ✅ API Endpoints

Deploy sonrası API'leriniz şu adreslerde olacak:

- `https://your-project.vercel.app/api/veri-ekle`
- `https://your-project.vercel.app/api/veri-getir`
- `https://your-project.vercel.app/api/veri-getir/10` (10 kayıt)

## 🔄 Otomatik Deployments

Her `git push` yaptığınızda Vercel otomatik olarak yeni bir deployment oluşturur!

## 📝 Notlar

- **Ücretsiz:** Vercel free tier yeterli
- **SSL:** Otomatik HTTPS
- **CDN:** Global CDN (hızlı erişim)
- **Bandwidth:** 100 GB/ay ücretsiz

## 🐛 Sorun Giderme

### Build hatası alıyorsanız:
- Environment variables'ların doğru olduğundan emin olun
- Vercel logs'u kontrol edin (Deployments → Logs)

### API çalışmıyorsa:
- Supabase keys'lerin doğru olduğundan emin olun
- CORS ayarlarını kontrol edin (zaten ekli)

---

**Hazırsınız! 🎉**



