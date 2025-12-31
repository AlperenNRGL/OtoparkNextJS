-- Yeni Veri Tablosu - Normal Kolonlar ile
-- Bu SQL'i Supabase Dashboard > SQL Editor'de çalıştırın
-- ÖNEMLİ: Eski veri tablosunu silmeden önce verilerinizi yedekleyin!

-- Eski tabloyu sil (dikkatli olun, veriler silinir!)
-- DROP TABLE IF EXISTS veri CASCADE;

-- Yeni tablo oluşturma
CREATE TABLE IF NOT EXISTS veri (
  id BIGSERIAL PRIMARY KEY,
  date BIGINT NOT NULL,
  plaka VARCHAR(20) NOT NULL,
  islem VARCHAR(50) NOT NULL,
  tip VARCHAR(50),
  giris BIGINT,
  price VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Index'ler (performans için)
CREATE INDEX IF NOT EXISTS idx_veri_plaka ON veri USING BTREE (plaka);
CREATE INDEX IF NOT EXISTS idx_veri_date ON veri USING BTREE (date);
CREATE INDEX IF NOT EXISTS idx_veri_islem ON veri USING BTREE (islem);
CREATE INDEX IF NOT EXISTS idx_veri_plaka_date ON veri USING BTREE (plaka, date);

-- Updated_at otomatik güncelleme için trigger
CREATE OR REPLACE FUNCTION update_veri_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_veri_updated_at BEFORE UPDATE ON veri
    FOR EACH ROW EXECUTE FUNCTION update_veri_updated_at_column();

-- Row Level Security (RLS) - Herkese izin ver
ALTER TABLE veri ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations" ON veri
    FOR ALL
    USING (true)
    WITH CHECK (true);

