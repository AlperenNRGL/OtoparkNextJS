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

// POST request - Plaka ve bugünün tarihine göre filtreleme
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

    // Bugünün başlangıcı ve sonu (timestamp olarak)
    const bugun = new Date()
    const gunBaslangici = new Date(bugun.setHours(0, 0, 0, 0))
    const gunSonu = new Date(bugun.setHours(23, 59, 59, 999))
    const gunBaslangiciTimestamp = gunBaslangici.getTime()
    const gunSonuTimestamp = gunSonu.getTime()

    const supabase = createSupabaseAdmin()

    // Normal kolonlar ile filtreleme
    let query = supabase
      .from('veri')
      .select('id, date, plaka, islem, tip, giris, price, created_at, updated_at')
      .eq('plaka', plaka) // Plaka eşleşmesi
      .gte('date', gunBaslangiciTimestamp) // Tarih >= bugün başlangıcı
      .lte('date', gunSonuTimestamp) // Tarih <= bugün sonu
      .order('created_at', { ascending: false })

    const { data, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: error.message },
        { 
          status: 400,
          headers: corsHeaders
        }
      )
    }

    return NextResponse.json(data, {
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



