'use client'

import { useState, useEffect } from 'react'
import { EyeIcon, ClipboardIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Dialog } from '@headlessui/react'
import { supabase } from '@/lib/supabase'

interface ApiKey {
  id: string
  created_at: string
  name: string
  value: string
  usage: number
  monthly_limit: number
}

const CreateKeyModal = ({
  isCreating,
  setIsCreating,
  newKeyName,
  setNewKeyName,
  newKeyLimit,
  setNewKeyLimit,
  createApiKey
}: {
  isCreating: boolean
  setIsCreating: (value: boolean) => void
  newKeyName: string
  setNewKeyName: (value: string) => void
  newKeyLimit: number
  setNewKeyLimit: (value: number) => void
  createApiKey: () => void
}) => (
  <Dialog open={isCreating} onClose={() => setIsCreating(false)} className="relative z-50">
    <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
    
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-md">
        <Dialog.Title className="text-xl font-semibold mb-4">Create a new API key</Dialog.Title>
        <p className="text-sm text-gray-600 mb-6">Enter a name and limit for the new API key.</p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Key Name
            </label>
            <div className="text-xs text-gray-500 mb-2">— A unique name to identify this key</div>
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Key Name"
            />
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="rounded border-gray-300"
                checked={true}
                readOnly
              />
              <span className="text-sm font-medium text-gray-700">Limit monthly usage*</span>
            </label>
            <input
              type="number"
              value={newKeyLimit}
              onChange={(e) => setNewKeyLimit(Number(e.target.value))}
              className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2"
            />
            <p className="mt-2 text-xs text-gray-500">
              *If the combined usage of all your keys exceeds your plan's limit, all requests will be rejected.
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              onClick={createApiKey}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create
            </button>
          </div>
        </div>
      </Dialog.Panel>
    </div>
  </Dialog>
)

const EditKeyModal = ({
  isEditing,
  setIsEditing,
  editingKeyData,
  updateApiKey
}: {
  isEditing: boolean
  setIsEditing: (value: boolean) => void
  editingKeyData: ApiKey | null
  updateApiKey: (id: string, newName: string, newLimit: number) => void
}) => {
  const [editName, setEditName] = useState(editingKeyData?.name || '')
  const [editLimit, setEditLimit] = useState(editingKeyData?.monthly_limit || 1000)

  useEffect(() => {
    if (editingKeyData) {
      setEditName(editingKeyData.name)
      setEditLimit(editingKeyData.monthly_limit || 1000)
    }
  }, [editingKeyData])

  const handleUpdate = () => {
    if (editingKeyData && editName) {
      updateApiKey(editingKeyData.id, editName, editLimit)
      setIsEditing(false)
    }
  }

  return (
    <Dialog open={isEditing} onClose={() => setIsEditing(false)} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-md">
          <Dialog.Title className="text-xl font-semibold mb-4">Edit API key</Dialog.Title>
          <p className="text-sm text-gray-600 mb-6">Update the name and limit for this API key.</p>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Key Name
              </label>
              <div className="text-xs text-gray-500 mb-2">— A unique name to identify this key</div>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Key Name"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  checked={true}
                  readOnly
                />
                <span className="text-sm font-medium text-gray-700">Limit monthly usage*</span>
              </label>
              <input
                type="number"
                value={editLimit}
                onChange={(e) => setEditLimit(Number(e.target.value))}
                className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2"
              />
              <p className="mt-2 text-xs text-gray-500">
                *If the combined usage of all your keys exceeds your plan's limit, all requests will be rejected.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

export default function DashboardPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])

  const [isCreating, setIsCreating] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [newKeyLimit, setNewKeyLimit] = useState<number>(1000)
  const [isEditing, setIsEditing] = useState(false)
  const [editingKeyData, setEditingKeyData] = useState<ApiKey | null>(null)
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetchApiKeys()
  }, [])

  const fetchApiKeys = async () => {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching API keys:', error)
      return
    }

    setApiKeys(data)
  }

  const createApiKey = async () => {
    if (!newKeyName) return
    
    const newKey = {
      name: newKeyName,
      value: `tvly-${Math.random().toString(36).slice(2)}`,
      usage: 0,
      monthly_limit: newKeyLimit
    }
    
    const { data, error } = await supabase
      .from('api_keys')
      .insert([newKey])
      .select()
      .single()

    if (error) {
      console.error('Error creating API key:', error)
      return
    }

    setApiKeys([data, ...apiKeys])
    setNewKeyName('')
    setNewKeyLimit(1000)
    setIsCreating(false)
  }

  const updateApiKey = async (id: string, newName: string, newLimit: number) => {
    const { error } = await supabase
      .from('api_keys')
      .update({ 
        name: newName, 
        monthly_limit: newLimit 
      })
      .eq('id', id)

    if (error) {
      console.error('Error updating API key:', error)
      return
    }

    setApiKeys(apiKeys.map(key => 
      key.id === id ? { ...key, name: newName, monthly_limit: newLimit } : key
    ))
    setEditingKeyData(null)
  }

  const handleEditClick = (key: ApiKey) => {
    setEditingKeyData(key)
    setIsEditing(true)
  }

  const deleteApiKey = async (id: string) => {
    if (!confirm('Are you sure you want to delete this API key?')) return

    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting API key:', error)
      return
    }

    setApiKeys(apiKeys.filter(key => key.id !== id))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You might want to add a toast notification here
  }

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }))
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
                        onBlur={(e) => updateApiKey(key.id, e.target.value, key.monthly_limit || 1000)}
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
                      {visibleKeys[key.id] ? key.value : `${key.value.slice(0, 5)}************************`}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-4">
                      <button 
                        onClick={() => toggleKeyVisibility(key.id)}
                        className="text-gray-400 hover:text-gray-600"
                        title={visibleKeys[key.id] ? "Hide API Key" : "Show API Key"}
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => copyToClipboard(key.value)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <ClipboardIcon className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleEditClick(key)}
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
      <CreateKeyModal
        isCreating={isCreating}
        setIsCreating={setIsCreating}
        newKeyName={newKeyName}
        setNewKeyName={setNewKeyName}
        newKeyLimit={newKeyLimit}
        setNewKeyLimit={setNewKeyLimit}
        createApiKey={createApiKey}
      />
      <EditKeyModal
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        editingKeyData={editingKeyData}
        updateApiKey={updateApiKey}
      />
    </div>
  )
}