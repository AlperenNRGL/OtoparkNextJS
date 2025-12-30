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

export async function POST(request) {
  try {
    const body = await request.json()
    const supabase = createSupabaseAdmin()

    // Eğer body bir array ise, her birini ekle
    const dataToInsert = Array.isArray(body) ? body : [body]
    
    // Verileri hazırla - MongoDB'den gelen __v alanını temizle ve JSONB'ye koy
    const preparedData = dataToInsert.map(item => {
      const { __v, ...cleanData } = item
      // Tüm veriyi data JSONB kolonuna koy (MongoDB gibi esnek yapı)
      return {
        data: cleanData
      }
    })
    
    const { data, error } = await supabase
      .from('veri')
      .insert(preparedData)
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

    // Response'u MongoDB formatına benzet (data içindeki veriyi dışarı çıkar)
    const formattedData = data.map(item => ({
      id: item.id,
      ...item.data,
      created_at: item.created_at,
      updated_at: item.updated_at
    }))

    return NextResponse.json(
      { message: 'newProduct', data: formattedData },
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

