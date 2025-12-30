-- Supabase'de veri tablosu oluşturma
-- Bu SQL'i Supabase Dashboard > SQL Editor'de çalıştırın

-- ESNEK YAPI: MongoDB gibi her türlü veriyi kabul eder (JSONB kullanarak)
-- Tüm veriler data JSONB kolonunda saklanır, böylece yapı değişken olabilir
CREATE TABLE IF NOT EXISTS veri (
  id BIGSERIAL PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tüm JSONB için genel index (en önemli - tüm JSONB sorguları için)
CREATE INDEX IF NOT EXISTS idx_veri_data ON veri USING GIN (data);

-- Plaka için text index (hızlı eşitlik aramaları için)
CREATE INDEX IF NOT EXISTS idx_veri_plaka ON veri USING BTREE ((data->>'plaka'));

-- İşlem ve tip için text index (opsiyonel, performans için)
CREATE INDEX IF NOT EXISTS idx_veri_islem ON veri USING BTREE ((data->>'islem'));
CREATE INDEX IF NOT EXISTS idx_veri_tip ON veri USING BTREE ((data->>'tip'));

-- Updated_at otomatik güncelleme için trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_veri_updated_at BEFORE UPDATE ON veri
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) - İsterseniz kapatabilirsiniz
ALTER TABLE veri ENABLE ROW LEVEL SECURITY;

-- Herkese okuma ve yazma izni (güvenlik için daha sonra kısıtlayabilirsiniz)
CREATE POLICY "Allow all operations" ON veri
    FOR ALL
    USING (true)
    WITH CHECK (true);

