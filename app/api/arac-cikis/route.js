import { createSupabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// CORS headers helper
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// OPTIONS request (preflight)
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

// POST request - Plakanın veresiyeleri ve bugünkü işlemleri
export async function POST(request) {
  try {
    const body = await request.json()
    const { plaka } = body

    if (!plaka) {
      return NextResponse.json(
        { error: 'Plaka parametresi gerekli' },
        { 
          status: 400,
          headers: corsHeaders
        }
      )
    }

    const supabase = createSupabaseAdmin()

    // Bugünün başlangıcı ve sonu
    const bugun = new Date()
    const gunBaslangici = new Date(bugun.setHours(0, 0, 0, 0))
    const gunSonu = new Date(bugun.setHours(23, 59, 59, 999))
    const gunBaslangiciTimestamp = gunBaslangici.getTime()
    const gunSonuTimestamp = gunSonu.getTime()

    // 1. Plakanın tüm veresiyelerini getir
    const { data: veresiyeler, error: veresiyeError } = await supabase
      .from('veresiye')
      .select('*')
      .eq('plaka', plaka)
      .order('created_at', { ascending: false })

    if (veresiyeError) {
      console.error('Veresiye error:', veresiyeError)
      return NextResponse.json(
        { error: veresiyeError.message },
        { 
          status: 400,
          headers: corsHeaders
        }
      )
    }

    // 2. Bugünkü işlemleri kontrol et (veri tablosundan)
    // Sadece bugün içinde çıkış veya veresiye işlemi olanlar
    let bugunIslemler = []
    
    try {
      // Önce JSONB sorgusu ile deneyelim
      let { data: tumVeriler, error: veriError } = await supabase
        .from('veri')
        .select('id, data, created_at, updated_at')
        .order('created_at', { ascending: false })
        .limit(5000)

      // Eğer JSONB sorgusu çalışmazsa, tüm verileri çekip JavaScript'te filtrele
      if (veriError) {
        console.log('JSONB sorgusu hatası, tüm veriler çekiliyor:', veriError.message)
        const { data: allData, error: allError } = await supabase
          .from('veri')
          .select('id, data, created_at, updated_at')
          .order('created_at', { ascending: false })
          .limit(5000)
        
        if (allError) {
          console.error('Veri çekme hatası:', allError)
          tumVeriler = []
        } else {
          tumVeriler = allData
        }
      }

      if (tumVeriler && tumVeriler.length > 0) {
        // JavaScript'te bugünkü işlemleri filtrele
        bugunIslemler = tumVeriler
          .map(item => {
            try {
              return {
                id: item.id,
                ...(item.data || {}),
                created_at: item.created_at,
                updated_at: item.updated_at
              }
            } catch (e) {
              console.error('Veri parse hatası:', e)
              return null
            }
          })
          .filter(item => {
            if (!item) return false
            
            // Plaka kontrolü
            if (item.plaka !== plaka) return false
            
            // İşlem kontrolü - sadece "cıkıs" veya "veresiye" olanlar
            if (!item.islem) return false
            const islem = String(item.islem).toLowerCase().trim()
            if (islem !== 'cıkıs' && islem !== 'veresiye') {
              return false
            }
            
            // Tarih kontrolü - date alanı timestamp ise
            let itemDate = null
            
            if (item.date) {
              // Date alanı string, number veya Date objesi olabilir
              if (typeof item.date === 'number') {
                itemDate = item.date
              } else if (typeof item.date === 'string') {
                itemDate = new Date(item.date).getTime()
              } else {
                itemDate = item.date.getTime ? item.date.getTime() : null
              }
            }
            
            // Eğer date yoksa veya geçersizse created_at'e bak
            if (!itemDate || isNaN(itemDate)) {
              if (item.created_at) {
                itemDate = new Date(item.created_at).getTime()
              } else {
                return false
              }
            }
            
            // Bugünkü tarih kontrolü
            return itemDate >= gunBaslangiciTimestamp && itemDate <= gunSonuTimestamp
          })
        
        console.log(`Bugünkü işlemler bulundu: ${bugunIslemler.length} adet`)
      } else {
        console.log('Veri tablosunda kayıt bulunamadı')
      }
    } catch (error) {
      console.error('Bugünkü işlemler kontrolü hatası:', error)
      // Hata olsa bile devam et, sadece bugünkü işlemler boş kalır
    }

    return NextResponse.json({
      plaka: plaka,
      veresiyeler: veresiyeler || [],
      bugunIslemler: bugunIslemler
    }, {
      headers: {
        ...corsHeaders,
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=60'
      }
    })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: corsHeaders
      }
    )
  }
}


