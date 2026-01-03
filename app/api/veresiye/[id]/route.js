import { createSupabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// CORS headers helper
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'DELETE, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// OPTIONS request (preflight)
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

// DELETE request - Veresiye silme
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
      .from('veresiye')
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
        { error: 'Veresiye bulunamadı' },
        { 
          status: 404,
          headers: corsHeaders
        }
      )
    }

    return NextResponse.json(
      { message: 'Veresiye silindi', data: data[0] },
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

// PATCH request - Veresiye not güncelleme
export async function PATCH(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const { not } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID parametresi gerekli' },
        { 
          status: 400,
          headers: corsHeaders
        }
      )
    }

    if (not === undefined) {
      return NextResponse.json(
        { error: 'Not parametresi gerekli' },
        { 
          status: 400,
          headers: corsHeaders
        }
      )
    }

    const supabase = createSupabaseAdmin()

    const { data, error } = await supabase
      .from('veresiye')
      .update({ not: not })
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
        { error: 'Veresiye bulunamadı' },
        { 
          status: 404,
          headers: corsHeaders
        }
      )
    }

    return NextResponse.json(
      { message: 'Veresiye not güncellendi', data: data[0] },
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






