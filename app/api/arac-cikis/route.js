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
      // Normal kolonlar ile sorgu
      const { data: tumVeriler, error: veriError } = await supabase
        .from('veri')
        .select('id, date, plaka, islem, tip, giris, price, created_at, updated_at')
        .eq('plaka', plaka)
        .gte('date', gunBaslangiciTimestamp)
        .lte('date', gunSonuTimestamp)
        .in('islem', ['cıkıs', 'veresiye'])
        .order('created_at', { ascending: false })
        .limit(1000)

      if (veriError) {
        console.error('Veri çekme hatası:', veriError)
      } else if (tumVeriler && tumVeriler.length > 0) {
        bugunIslemler = tumVeriler
        console.log(`Bugünkü işlemler bulundu: ${bugunIslemler.length} adet`)
      } else {
        console.log('Bugünkü işlem bulunamadı')
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


