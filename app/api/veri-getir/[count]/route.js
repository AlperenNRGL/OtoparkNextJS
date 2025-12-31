import { createSupabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// CORS headers helper
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// OPTIONS request (preflight)
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

// GET request - Belirli sayıda veri getir
export async function GET(request, { params }) {
  try {
    const { count } = params
    
    // Count'u number'a çevir ve kontrol et
    const dataCount = parseInt(count, 10)
    
    if (isNaN(dataCount) || dataCount < 1) {
      return NextResponse.json(
        { error: 'Invalid count parameter. Must be a positive number.' },
        { 
          status: 400,
          headers: corsHeaders
        }
      )
    }

    const supabase = createSupabaseAdmin()

    // Belirtilen sayıda veri getir - created_at'e göre tersten (en yeni önce)
    const { data, error } = await supabase
      .from('veri')
      .select('id, date, plaka, islem, tip, giris, price, created_at, updated_at')
      .order('created_at', { ascending: false })
      .limit(dataCount)

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

