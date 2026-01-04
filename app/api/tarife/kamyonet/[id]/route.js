import { createSupabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// CORS headers helper
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// OPTIONS request (preflight)
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

// PUT request - Kamyonet tarifesi güncelleme
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const { saat, ucret } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID parametresi gerekli' },
        { 
          status: 400,
          headers: corsHeaders
        }
      )
    }

    if (!saat || !ucret) {
      return NextResponse.json(
        { error: 'saat ve ucret alanları zorunludur' },
        { 
          status: 400,
          headers: corsHeaders
        }
      )
    }

    const supabase = createSupabaseAdmin()

    const { data, error } = await supabase
      .from('tarife_kamyonet')
      .update({ saat, ucret })
      .eq('id', id)
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

    if (data.length === 0) {
      return NextResponse.json(
        { error: 'Tarife bulunamadı' },
        { 
          status: 404,
          headers: corsHeaders
        }
      )
    }

    return NextResponse.json(
      { message: 'Kamyonet tarifesi güncellendi', data: data[0] },
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

// DELETE request - Kamyonet tarifesi silme
export async function DELETE(request, { params }) {
  try {
    const { id } = params
    const supabase = createSupabaseAdmin()

    if (!id) {
      return NextResponse.json(
        { error: 'ID parametresi gerekli' },
        { 
          status: 400,
          headers: corsHeaders
        }
      )
    }

    const { data, error } = await supabase
      .from('tarife_kamyonet')
      .delete()
      .eq('id', id)
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

    if (data.length === 0) {
      return NextResponse.json(
        { error: 'Tarife bulunamadı' },
        { 
          status: 404,
          headers: corsHeaders
        }
      )
    }

    return NextResponse.json(
      { message: 'Kamyonet tarifesi silindi', data: data[0] },
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






