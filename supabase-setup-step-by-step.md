# Supabase Tablo Oluşturma - Adım Adım

Eğer SQL Editor takılıyorsa, bu adımları izleyin:

## Yöntem 1: Table Editor (En Kolay)

1. Supabase Dashboard → Sol menüden **Table Editor**
2. **New Table** butonuna tıklayın
3. Tablo adı: `veri`
4. Kolonları ekleyin:
   - `id` → Type: `int8`, Primary Key: ✅, Is Identity: ✅
   - `data` → Type: `jsonb`, Default Value: `{}`
   - `created_at` → Type: `timestamptz`, Default Value: `now()`
   - `updated_at` → Type: `timestamptz`, Default Value: `now()`
5. **Save** butonuna tıklayın

## Yöntem 2: SQL Editor (Parça Parça)

Eğer SQL Editor çalışıyorsa, şu adımları sırayla yapın:

### Adım 1: Tablo Oluştur
```sql
CREATE TABLE IF NOT EXISTS veri (
  id BIGSERIAL PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```
**Run** butonuna tıklayın.

### Adım 2: Index Ekle (Opsiyonel)
```sql
CREATE INDEX IF NOT EXISTS idx_veri_plaka ON veri USING GIN ((data->>'plaka'));
CREATE INDEX IF NOT EXISTS idx_veri_data ON veri USING GIN (data);
```
**Run** butonuna tıklayın.

### Adım 3: RLS (Row Level Security) Aç
```sql
ALTER TABLE veri ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations" ON veri
    FOR ALL
    USING (true)
    WITH CHECK (true);
```
**Run** butonuna tıklayın.

## Yöntem 3: Tarayıcı Değiştir

1. Farklı bir tarayıcı deneyin (Chrome, Firefox, Safari)
2. Veya gizli/incognito modda açın
3. SQL Editor'ü tekrar deneyin

## Kontrol

Tablo oluşturuldu mu kontrol etmek için:
1. **Table Editor**'a gidin
2. `veri` tablosunu görmelisiniz
3. Veya SQL Editor'de şunu çalıştırın:
```sql
SELECT * FROM veri LIMIT 1;
```

