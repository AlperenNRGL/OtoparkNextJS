-- BASİT VERSİYON - Önce bunu çalıştırın
-- Eğer SQL Editor takılıyorsa, bu basit versiyonu deneyin

-- 1. Tablo oluşturma
CREATE TABLE IF NOT EXISTS veri (
  id BIGSERIAL PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Index'ler (opsiyonel, performans için)
-- JSONB için genel index
CREATE INDEX IF NOT EXISTS idx_veri_data ON veri USING GIN (data);
-- Plaka için text index (eşitlik aramaları için)
CREATE INDEX IF NOT EXISTS idx_veri_plaka ON veri USING BTREE ((data->>'plaka'));

-- 3. RLS (Row Level Security) - Herkese izin ver
ALTER TABLE veri ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations" ON veri
    FOR ALL
    USING (true)
    WITH CHECK (true);

