import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { ApiKey } from '@/app/types/api'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: Request) {
  try {
    const { apiKey } = await request.json()
    
    // Query Supabase for the API key using the name field
    const { data: apiKeys, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('name', apiKey)
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return new NextResponse(
        JSON.stringify({ 
          success: false,
          message: 'Error validating API key'
        }), 
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    if (apiKeys) {
      // API key exists and is valid
      return new NextResponse(
        JSON.stringify({ 
          success: true,
          message: 'API key is valid',
          key: apiKeys
        }), 
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    } else {
      // API key not found
      return new NextResponse(
        JSON.stringify({ 
          success: false,
          message: 'Invalid API key'
        }), 
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
  } catch (error) {
    console.error('Validation error:', error)
    return new NextResponse(
      JSON.stringify({ 
        success: false,
        message: 'Server error during validation'
      }), 
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
} 