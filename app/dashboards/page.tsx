'use client'

import { useState } from 'react'
import { EyeIcon, ClipboardIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

interface ApiKey {
  id: string
  name: string
  key: string
  createdAt: string
  usage: number
}

export default function DashboardPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'default',
      key: 'tvly-8x7n9v2m4k5l3j1h6g4f9d8s7a5',
      createdAt: '2024-03-15T10:00:00.000Z',
      usage: 0
    },
    {
      id: '2',
      name: 'tetette',
      key: 'tvly-2p9m4k5l8x7n3j1h6g4f9d8s7a5',
      createdAt: '2024-03-16T15:30:00.000Z',
      usage: 0
    }
  ])

  const [isCreating, setIsCreating] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [editingKey, setEditingKey] = useState<string | null>(null)

  const createApiKey = () => {
    if (!newKeyName) return
    
    const newKey = {
      id: Math.random().toString(),
      name: newKeyName,
      key: `tvly-${Math.random().toString(36).slice(2)}`,
      createdAt: new Date().toISOString(),
      usage: 0
    }
    
    setApiKeys([...apiKeys, newKey])
    setNewKeyName('')
    setIsCreating(false)
  }

  const updateApiKey = (id: string, newName: string) => {
    setApiKeys(apiKeys.map(key => 
      key.id === id ? { ...key, name: newName } : key
    ))
    setEditingKey(null)
  }

  const deleteApiKey = (id: string) => {
    if (confirm('Are you sure you want to delete this API key?')) {
      setApiKeys(apiKeys.filter(key => key.id !== id))
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You might want to add a toast notification here
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50/50">
      <div className="max-w-[1200px] mx-auto px-8 pb-16">
        {/* Breadcrumb and Title */}
        <div className="py-8">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <span>Pages</span>
            <span className="mx-2">/</span>
            <span>Overview</span>
          </div>
          <h1 className="text-3xl font-bold">Overview</h1>
        </div>

        {/* Current Plan Card - Updated styling */}
        <div className="mb-8 p-12 rounded-3xl bg-gradient-to-r from-rose-200 via-purple-200 to-blue-200">
          <div className="space-y-8">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-4">
                <span className="bg-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full w-fit backdrop-blur-sm">
                  CURRENT PLAN
                </span>
                <h2 className="text-5xl font-bold text-white">Researcher</h2>
              </div>
              
              <button className="bg-white/20 text-white px-6 py-2 rounded-full text-sm font-medium flex items-center gap-2 backdrop-blur-sm hover:bg-white/30 transition-colors">
                <span>Manage Plan</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-white font-medium">API Limit</span>
                <span className="text-white text-xs border border-white/30 rounded-full w-5 h-5 inline-flex items-center justify-center">
                  ⓘ
                </span>
              </div>
              <div className="bg-white/20 rounded-full h-2">
                <div className="bg-white h-2 rounded-full w-[0%]" />
              </div>
              <div className="text-sm text-white">0/1,000 Requests</div>
            </div>
          </div>
        </div>

        {/* API Keys Section - Updated styling */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">API Keys</h2>
              <button 
                onClick={() => setIsCreating(true)}
                className="w-8 h-8 rounded-full border border-gray-200 inline-flex items-center justify-center text-gray-500 hover:text-gray-700 hover:border-gray-300 text-xl"
              >
                +
              </button>
            </div>
          </div>

          {isCreating && (
            <div className="mb-4 p-4 border rounded-lg">
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="Enter API key name"
                className="border rounded px-3 py-2 mr-2"
              />
              <button
                onClick={createApiKey}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setIsCreating(false)
                  setNewKeyName('')
                }}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          )}

          <div className="text-sm text-gray-600 mb-6">
            The key is used to authenticate your requests to the <a href="#" className="text-blue-600 hover:text-blue-700">Research API</a>. 
            To learn more, see the <a href="#" className="text-blue-600 hover:text-blue-700">documentation</a> page.
          </div>

          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-100">
                <th className="py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage
                </th>
                <th className="py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Key
                </th>
                <th className="py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Options
                </th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.map((key) => (
                <tr key={key.id} className="border-b border-gray-100">
                  <td className="py-4 px-4 text-gray-900">
                    {editingKey === key.id ? (
                      <input
                        type="text"
                        defaultValue={key.name}
                        onBlur={(e) => updateApiKey(key.id, e.target.value)}
                        className="border rounded-lg px-3 py-1.5"
                        autoFocus
                      />
                    ) : (
                      key.name
                    )}
                  </td>
                  <td className="py-4 px-4 text-gray-900">{key.usage}</td>
                  <td className="py-4 px-4">
                    <span className="font-mono text-gray-600 bg-gray-50 rounded-lg px-3 py-1.5 inline-block">
                      tvly-************************
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-4">
                      <button 
                        onClick={() => alert(key.key)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => copyToClipboard(key.key)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <ClipboardIcon className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => setEditingKey(key.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => deleteApiKey(key.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Contact Us Section - Added bottom margin */}
        <div className="mt-16 py-6 px-6 bg-white rounded-2xl flex items-center justify-between shadow-[0_2px_8px_0px_rgba(0,0,0,0.04)]">
          <p className="text-gray-600 text-sm">
            Have any questions, feedback or need support? We'd love to hear from you!
          </p>
          <button className="px-6 py-2.5 rounded-full bg-white text-sm border border-gray-200 text-gray-900 hover:bg-gray-50 transition-colors">
            Contact us
          </button>
        </div>
      </div>
    </div>
  )
}