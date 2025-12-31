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
    
    // Verileri hazırla - Normal kolonlar ile
    const preparedData = dataToInsert.map((item, index) => {
      const { date, plaka, islem, tip, giris, price } = item

      // Zorunlu alanları kontrol et
      if (!date || !plaka || !islem) {
        throw new Error(`Index ${index}: date, plaka ve islem alanları zorunludur`)
      }

      // Date alanını timestamp'e çevir (string ise)
      let dateTimestamp = date
      if (typeof date === 'string') {
        dateTimestamp = new Date(date).getTime()
        if (isNaN(dateTimestamp)) {
          throw new Error(`Index ${index}: Geçersiz tarih formatı: ${date}`)
        }
      } else if (typeof date !== 'number') {
        throw new Error(`Index ${index}: Date alanı number veya string olmalıdır`)
      }

      // Giris alanını timestamp'e çevir (string ise ve varsa)
      let girisTimestamp = null
      if (giris) {
        if (typeof giris === 'string') {
          girisTimestamp = new Date(giris).getTime()
          if (isNaN(girisTimestamp)) {
            throw new Error(`Index ${index}: Geçersiz giris tarih formatı: ${giris}`)
          }
        } else if (typeof giris === 'number') {
          girisTimestamp = giris
        } else {
          throw new Error(`Index ${index}: Giris alanı number veya string olmalıdır`)
        }
      }

      return {
        date: dateTimestamp,
        plaka: plaka,
        islem: islem,
        tip: tip || null,
        giris: girisTimestamp,
        price: price || null
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

    return NextResponse.json(
      { message: 'Veri eklendi', data: data },
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

