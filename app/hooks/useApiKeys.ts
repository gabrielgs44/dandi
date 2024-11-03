import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { ApiKey } from '../types/api'

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])

  useEffect(() => {
    fetchApiKeys()
  }, [])

  const fetchApiKeys = async () => {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
    
    if (error) {
      console.error('Error fetching API keys:', error)
      return
    }
    
    setApiKeys(data || [])
  }

  const createApiKey = async (name: string, monthlyLimit: number) => {
    const newKey = {
      name,
      monthly_limit: monthlyLimit,
      value: `sk_${Math.random().toString(36).substr(2, 32)}`,
      usage: 0
    }

    const { data, error } = await supabase
      .from('api_keys')
      .insert([newKey])
      .select()

    if (error) {
      console.error('Error creating API key:', error)
      return null
    }

    setApiKeys(prev => [...prev, data[0]])
    return data[0]
  }

  const updateApiKey = async (id: string, name: string, monthlyLimit: number) => {
    const { data, error } = await supabase
      .from('api_keys')
      .update({ name, monthly_limit: monthlyLimit })
      .eq('id', id)
      .select()

    if (error) {
      console.error('Error updating API key:', error)
      return false
    }

    setApiKeys(prevKeys => 
      prevKeys.map(key => 
        key.id === id ? { ...key, name, monthly_limit: monthlyLimit } : key
      )
    )
    
    return true
  }

  const deleteApiKey = async (id: string) => {
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting API key:', error)
      return
    }

    setApiKeys(prev => prev.filter(key => key.id !== id))
  }

  return { apiKeys, createApiKey, updateApiKey, deleteApiKey }
}