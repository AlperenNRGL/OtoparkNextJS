# 🚀 Hızlı Deployment - Adım Adım

## ✅ Kontrol Listesi

- [x] Tüm API endpoints hazır
- [x] CORS ayarları yapıldı
- [x] Supabase bağlantısı test edildi
- [ ] GitHub'a push
- [ ] Vercel'de deploy
- [ ] Environment variables ekle

## 1️⃣ GitHub'a Push

Terminal'de:

```bash
cd /Users/alperennuroglu/Desktop/nextjs

# Git durumunu kontrol et
git status

# Eğer git yoksa başlat
git init

# Tüm değişiklikleri ekle
git add .

# Commit yap
git commit -m "Updated Next.js project with all API endpoints"

# Eğer remote yoksa ekle (GitHub'da repo oluşturduktan sonra)
git remote add origin https://github.com/KULLANICIADI/REPO-ADI.git

# Push yap
git push -u origin main
```

**Not:** Eğer repo zaten varsa:
```bash
git add .
git commit -m "Update: New API endpoints and fixes"
git push
```

## 2️⃣ Vercel'de Deploy

### Yeni Proje İse:
1. https://vercel.com → GitHub ile giriş
2. **"Add New Project"**
3. Repository seçin
4. **Environment Variables** ekleyin (aşağıya bakın)
5. **Deploy**

### Mevcut Proje İse:
- Otomatik deploy olur (git push sonrası)
- Veya manuel: Vercel Dashboard → **Deployments** → **Redeploy**

## 3️⃣ Environment Variables

Vercel'de **Settings** → **Environment Variables**:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Önemli:** Her birini **Production**, **Preview**, **Development** için ekleyin!

## 4️⃣ Test

Deploy sonrası test edin:
- `https://your-project.vercel.app/api/veri-getir`
- `https://your-project.vercel.app/api/veri-getir/10`
- `https://your-project.vercel.app/api/plaka-getir` (POST)

## 🎉 Tamamlandı!

Projeniz artık canlıda!


