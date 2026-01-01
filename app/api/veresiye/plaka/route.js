import { createSupabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// CORS headers helper
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// OPTIONS request (preflight)
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

// DELETE request - Plakaya ait tüm veresiyeleri silme
export async function DELETE(request) {
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

    // Önce silinecek verileri getir (response için)
    const { data: dataToDelete, error: selectError } = await supabase
      .from('veresiye')
      .select('*')
      .eq('plaka', plaka)

    if (selectError) {
      console.error('Supabase select error:', selectError)
      return NextResponse.json(
        { error: selectError.message },
        { 
          status: 400,
          headers: corsHeaders
        }
      )
    }

    // Verileri sil
    const { data, error } = await supabase
      .from('veresiye')
      .delete()
      .eq('plaka', plaka)
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
        message: `${data.length} adet veresiye silindi`, 
        deletedCount: data.length,
        data: data 
      },
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




