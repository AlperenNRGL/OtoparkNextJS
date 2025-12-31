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

// POST request - Toplu veresiye ekleme
export async function POST(request) {
  try {
    const body = await request.json()
    
    // Body bir array olmalı
    if (!Array.isArray(body) || body.length === 0) {
      return NextResponse.json(
        { error: 'Body bir array olmalı ve en az bir veresiye içermelidir' },
        { 
          status: 400,
          headers: corsHeaders
        }
      )
    }

    const supabase = createSupabaseAdmin()

    // Verileri hazırla ve validasyon yap
    const veresiyeDataList = body.map((item, index) => {
      const { plaka, date, price, not } = item

      // Zorunlu alanları kontrol et
      if (!plaka || !date || !price) {
        throw new Error(`Index ${index}: Plaka, date ve price alanları zorunludur`)
      }

      return {
        plaka: plaka,
        date: date,
        price: price,
        not: not || null
      }
    })

    const { data, error } = await supabase
      .from('veresiye')
      .insert(veresiyeDataList)
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
      { 
        message: `${data.length} adet veresiye eklendi`, 
        count: data.length,
        data: data 
      },
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

