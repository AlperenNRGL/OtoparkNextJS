-- Veresiye tablosu oluşturma
-- Bu SQL'i Supabase Dashboard > SQL Editor'de çalıştırın

CREATE TABLE IF NOT EXISTS veresiye (
  id BIGSERIAL PRIMARY KEY,
  plaka VARCHAR(20) NOT NULL,
  date BIGINT NOT NULL,
  price VARCHAR(50) NOT NULL,
  "not" TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Index'ler (performans için)
CREATE INDEX IF NOT EXISTS idx_veresiye_plaka ON veresiye USING BTREE (plaka);
CREATE INDEX IF NOT EXISTS idx_veresiye_date ON veresiye USING BTREE (date);

-- Updated_at otomatik güncelleme için trigger
CREATE OR REPLACE FUNCTION update_veresiye_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_veresiye_updated_at BEFORE UPDATE ON veresiye
    FOR EACH ROW EXECUTE FUNCTION update_veresiye_updated_at_column();

-- Row Level Security (RLS) - Herkese izin ver
ALTER TABLE veresiye ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations" ON veresiye
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Örnek veri ekleme
INSERT INTO veresiye (plaka, date, price, "not") VALUES
('61 VV 333', 1767116843816, '100', 'adsdasdasd');

