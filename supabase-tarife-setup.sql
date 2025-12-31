-- Tarife Tabloları - Ayrı Tablolar
-- Bu SQL'i Supabase Dashboard > SQL Editor'de çalıştırın

-- 1. Taksi Tarife Tablosu
CREATE TABLE IF NOT EXISTS tarife_taksi (
  id BIGSERIAL PRIMARY KEY,
  saat INTEGER NOT NULL,
  ucret VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(saat) -- Her saat için tek bir kayıt
);

-- 2. Kamyonet Tarife Tablosu
CREATE TABLE IF NOT EXISTS tarife_kamyonet (
  id BIGSERIAL PRIMARY KEY,
  saat INTEGER NOT NULL,
  ucret VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(saat) -- Her saat için tek bir kayıt
);

-- Index'ler (performans için)
CREATE INDEX IF NOT EXISTS idx_tarife_taksi_saat ON tarife_taksi USING BTREE (saat);
CREATE INDEX IF NOT EXISTS idx_tarife_kamyonet_saat ON tarife_kamyonet USING BTREE (saat);

-- Updated_at otomatik güncelleme için trigger fonksiyonu
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger'lar
CREATE TRIGGER update_tarife_taksi_updated_at BEFORE UPDATE ON tarife_taksi
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tarife_kamyonet_updated_at BEFORE UPDATE ON tarife_kamyonet
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) - Herkese izin ver
ALTER TABLE tarife_taksi ENABLE ROW LEVEL SECURITY;
ALTER TABLE tarife_kamyonet ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations" ON tarife_taksi
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations" ON tarife_kamyonet
    FOR ALL USING (true) WITH CHECK (true);

-- Örnek veri - Taksi tarifesi
INSERT INTO tarife_taksi (saat, ucret) VALUES
(1, '50'),
(2, '100'),
(3, '150'),
(4, '200'),
(5, '250'),
(6, '300')
ON CONFLICT (saat) DO UPDATE SET ucret = EXCLUDED.ucret;

-- Örnek veri - Kamyonet tarifesi
INSERT INTO tarife_kamyonet (saat, ucret) VALUES
(1, '80'),
(2, '160'),
(3, '240'),
(4, '320'),
(5, '400'),
(6, '480')
ON CONFLICT (saat) DO UPDATE SET ucret = EXCLUDED.ucret;
