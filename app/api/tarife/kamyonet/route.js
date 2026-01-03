import { createSupabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// CORS headers helper
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// OPTIONS request (preflight)
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

// GET request - Tüm kamyonet tarifelerini getir
export async function GET() {
  try {
    const supabase = createSupabaseAdmin()

    const { data, error } = await supabase
      .from('tarife_kamyonet')
      .select('*')
      .order('saat', { ascending: true })

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

// POST request - Yeni kamyonet tarifesi ekleme
export async function POST(request) {
  try {
    const body = await request.json()
    const { saat, ucret } = body

    // Zorunlu alanları kontrol et
    if (!saat || !ucret) {
      return NextResponse.json(
        { error: 'saat ve ucret alanları zorunludur' },
        { 
          status: 400,
          headers: corsHeaders
        }
      )
    }

    // Saat kontrolü (1-6 arası)
    if (saat < 1 || saat > 6) {
      return NextResponse.json(
        { error: 'saat 1 ile 6 arasında olmalıdır' },
        { 
          status: 400,
          headers: corsHeaders
        }
      )
    }

    const supabase = createSupabaseAdmin()

    const { data, error } = await supabase
      .from('tarife_kamyonet')
      .insert({ saat, ucret })
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
      { message: 'Kamyonet tarifesi eklendi', data: data[0] },
      { headers: corsHeaders }
    )
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { 
        status: 500,
        headers: corsHeaders
      }
    )
  }
}




