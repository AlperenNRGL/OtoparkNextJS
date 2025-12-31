-- Giris alanını VARCHAR'dan BIGINT'e çevirme migration
-- Eğer tablo zaten oluşturulmuşsa bu SQL'i çalıştırın

-- Önce mevcut giris verilerini kontrol edin (opsiyonel)
-- SELECT id, giris FROM veri WHERE giris IS NOT NULL;

-- Giris kolonunu BIGINT'e çevir
-- NOT: Mevcut VARCHAR verileri kaybolacak, sadece yeni veriler için geçerli
ALTER TABLE veri 
ALTER COLUMN giris TYPE BIGINT 
USING CASE 
  WHEN giris IS NULL THEN NULL
  WHEN giris ~ '^[0-9]+$' THEN giris::BIGINT
  ELSE NULL
END;

-- Veya eğer mevcut verileri korumak istemiyorsanız (tüm giris verileri silinir):
-- ALTER TABLE veri ALTER COLUMN giris TYPE BIGINT USING NULL;

