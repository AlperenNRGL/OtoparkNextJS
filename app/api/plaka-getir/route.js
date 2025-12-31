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

    // Bugünün başlangıcı ve sonu
    const arananGun = new Date()
    const gunBaslangici = new Date(arananGun.setHours(0, 0, 0, 0))
    const gunSonu = new Date(arananGun.setHours(23, 59, 59, 999))

    const supabase = createSupabaseAdmin()

    // Supabase'de JSONB içinden plaka ve date ile filtreleme
    // JSONB içindeki date alanını timestamp'e çevirip karşılaştır
    let query = supabase
      .from('veri')
      .select('id, data, created_at, updated_at')
      .eq('data->>plaka', plaka) // Plaka eşleşmesi
      .gte('data->>date', gunBaslangici.toISOString()) // Tarih >= bugün başlangıcı
      .lte('data->>date', gunSonu.toISOString()) // Tarih <= bugün sonu
      .order('created_at', { ascending: false })

    const { data, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      
      // Eğer JSONB sorgulama çalışmazsa, tüm verileri çekip JavaScript'te filtrele
      const { data: allData, error: allError } = await supabase
        .from('veri')
        .select('id, data, created_at, updated_at')
        .order('created_at', { ascending: false })
        .limit(10000) // Yeterince büyük limit

      if (allError) {
        return NextResponse.json(
          { error: allError.message },
          { 
            status: 400,
            headers: corsHeaders
          }
        )
      }

      // JavaScript'te filtrele
      const filteredData = allData
        .map(item => ({
          id: item.id,
          ...item.data,
          created_at: item.created_at,
          updated_at: item.updated_at
        }))
        .filter(item => {
          // Plaka kontrolü
          if (item.plaka !== plaka) return false
          
          // Tarih kontrolü
          if (!item.date) return false
          const itemDate = new Date(item.date)
          return itemDate >= gunBaslangici && itemDate <= gunSonu
        })

      return NextResponse.json(filteredData, {
        headers: {
          ...corsHeaders,
          'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=60'
        }
      })
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



