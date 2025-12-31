import { createSupabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// CORS headers helper
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// OPTIONS request (preflight)
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

// GET request - Bütün veresiyeleri getir veya plakaya göre filtrele
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const plaka = searchParams.get('plaka')

    const supabase = createSupabaseAdmin()

    let query = supabase
      .from('veresiye')
      .select('*')
      .order('created_at', { ascending: false })

    // Eğer plaka parametresi varsa, filtrele
    if (plaka) {
      query = query.eq('plaka', plaka)
    }

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

// POST request - Veresiye ekleme
export async function POST(request) {
  try {
    const body = await request.json()
    const { plaka, date, price, not } = body

    // Zorunlu alanları kontrol et
    if (!plaka || !date || !price) {
      return NextResponse.json(
        { error: 'Plaka, date ve price alanları zorunludur' },
        { 
          status: 400,
          headers: corsHeaders
        }
      )
    }

    const supabase = createSupabaseAdmin()

    // Veriyi hazırla
    const veresiyeData = {
      plaka: plaka,
      date: date,
      price: price,
      not: not || null
    }

    const { data, error } = await supabase
      .from('veresiye')
      .insert(veresiyeData)
      .select()

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

    return NextResponse.json(
      { message: 'Veresiye eklendi', data: data[0] },
      { headers: corsHeaders }
    )
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

