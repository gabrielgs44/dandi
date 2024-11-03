'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Toast } from '../components/Toast'
import { ApiKey } from '../types/api'

export default function PlaygroundPage() {
  const [apiKey, setApiKey] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/validate-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey }),
      })

      const data = await response.json()
      
      if (response.status === 200) {
        // Store the validated API key in session storage for protected routes
        sessionStorage.setItem('validatedApiKey', apiKey)
        
        setToastType('success')
        setToastMessage('Valid API key, /protected can be accessed')
        setShowToast(true)
        setTimeout(() => {
          router.push('/protected')
        }, 1000)
      } else {
        setToastType('error')
        setToastMessage(data.message || 'Invalid API Key')
        setShowToast(true)
      }
    } catch (error) {
      console.error('Error during validation:', error)
      setToastType('error')
      setToastMessage('Error validating API key')
      setShowToast(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold mb-6">API Playground</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
            Enter your API Key
          </label>
          <input
            type="text"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter API key name"
            required
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`
            w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
            ${isLoading 
              ? 'bg-indigo-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700'
            }
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
          `}
        >
          {isLoading ? 'Validating...' : 'Validate Key'}
        </button>
      </form>

      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  )
} 