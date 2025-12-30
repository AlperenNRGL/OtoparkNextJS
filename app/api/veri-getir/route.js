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

// GET request - Tüm verileri getir
export async function GET() {
  try {
    const supabase = createSupabaseAdmin()

    // Sadece gerekli kolonları seç (performans için)
    const { data, error } = await supabase
      .from('veri')
      .select('id, data, created_at, updated_at')
      .order('created_at', { ascending: false })
      .limit(1000) // Limit ekle (çok veri varsa yavaşlamasın)

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

    // Response'u MongoDB formatına benzet (data içindeki veriyi dışarı çıkar)
    const formattedData = data.map(item => ({
      id: item.id,
      ...item.data,
      created_at: item.created_at,
      updated_at: item.updated_at
    }))

    return NextResponse.json(formattedData, {
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

// POST request - Plaka ile filtreleme
export async function POST(request) {
  try {
    const body = await request.json()
    const supabase = createSupabaseAdmin()

    let query = supabase
      .from('veri')
      .select('id, data, created_at, updated_at')
      .order('created_at', { ascending: false })
      .limit(1000)

    // Eğer plaka varsa, Supabase'de filtrele (daha hızlı)
    if (body.plaka) {
      // JSONB içinden plaka ile filtrele
      query = query.eq('data->>plaka', body.plaka)
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

    // Response'u MongoDB formatına benzet (data içindeki veriyi dışarı çıkar)
    const formattedData = data.map(item => ({
      id: item.id,
      ...item.data,
      created_at: item.created_at,
      updated_at: item.updated_at
    }))

    return NextResponse.json(formattedData, {
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
