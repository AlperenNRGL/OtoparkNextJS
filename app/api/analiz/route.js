import { createSupabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}





export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const supabase = createSupabaseAdmin()






    // Tarih filtreleri
    const baslangic = searchParams.get('baslangic')
    const bitis = searchParams.get('bitis')
    if (baslangic) query = query.gte('date', baslangic)
    if (bitis) query = query.lte('date', bitis)


    const fetchAllData = async () => {
      let allData = [];
      let from = 0;
      let step = 1000; // Her seferinde kaç satır çekilecek
      let hasMore = true;

      while (hasMore) {
        const { data, error } = await supabase
          .from('veri')
          .select('date, islem, price') // Sadece analiz için gerekenler
          .order('date', { ascending: true })
          .range(from, from + step - 1);

        if (error) {
          console.error("Hata:", error);
          break;
        }

        if (data.length > 0) {
          allData = [...allData, ...data]; // Gelen veriyi ana diziye ekle
          from += step; // Başlangıç noktasını kaydır
        }

        // Eğer gelen veri step'ten azsa, çekilecek başka veri kalmamıştır
        if (data.length < step) {
          hasMore = false;
        }
      }

      console.log("Toplam Çekilen Veri:", allData.length);
      return allData;
    };

    const data = await fetchAllData()



    // İstatistik objesi - Değişken ismini isGunuSayisi olarak düzelttik
    const stats = {
      gunluk: {},
      saatlik: { giris: {}, cikis: {} },
      isGunuSayisi: 0
    }

    const formatter = new Intl.DateTimeFormat('tr-TR', {
      day: 'numeric', month: 'long', weekday: 'long'
    })

    data.forEach(item => {
      // Date alanı BIGINT (timestamp) olarak geliyor, doğru şekilde parse et
      // const timestamp = typeof item.date === 'number' ? item.date : parseInt(item.date)
      const d = new Date(item.date)

      // Geçersiz tarih kontrolü
      if (isNaN(d.getTime())) {
        console.warn('Geçersiz tarih:', item.date)
        return
      }

      const dayOfWeek = d.getDay()
      const hour = d.getHours()

      // Pazar günlerini (0) tamamen devre dışı bırakıyoruz
      if (dayOfWeek === 0) return

      // Local timezone'a göre tarih key'i oluştur (YYYY-MM-DD formatında)
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      const dayKey = `${year}-${month}-${day}`

      const price = parseInt(item.price) || 0

      // Günlük veriyi ilklendir
      if (!stats.gunluk[dayKey]) {
        stats.gunluk[dayKey] = { label: formatter.format(d), cikis: 0, veresiye: 0, toplam: 0 }
      }


      // İşlem tipine göre tek döngüde hesapla
      switch (item.islem) {
        case 'cıkıs':
          stats.gunluk[dayKey].cikis += price
          stats.gunluk[dayKey].toplam += price
          if (hour >= 8 && hour < 21) {
            stats.saatlik.cikis[hour] = (stats.saatlik.cikis[hour] || 0) + 1
          }
          break
        case 'veresiye':
          if (price <= 500) { // 500 TL sınırı
            stats.gunluk[dayKey].veresiye += price
            stats.gunluk[dayKey].toplam += price
          }
          break
        case 'veresiye-sil':
          if (price <= 500) {
            stats.gunluk[dayKey].veresiye -= price
            stats.gunluk[dayKey].toplam -= price
          }
          break
        case 'giris':
          if (hour >= 8 && hour < 21) {
            stats.saatlik.giris[hour] = (stats.saatlik.giris[hour] || 0) + 1
          }
          break
      }
    })

    // İş günü sayısını hesapla ve saatlik ortalamaları al
    stats.isGunuSayisi = Object.keys(stats.gunluk).length

    if (stats.isGunuSayisi > 0) {
      for (let h = 8; h < 21; h++) {
        if (stats.saatlik.giris[h]) stats.saatlik.giris[h] = Math.round(stats.saatlik.giris[h] / stats.isGunuSayisi)
        if (stats.saatlik.cikis[h]) stats.saatlik.cikis[h] = Math.round(stats.saatlik.cikis[h] / stats.isGunuSayisi)
      }
    }

    return NextResponse.json(stats, { headers: corsHeaders })

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders })
  }
}

