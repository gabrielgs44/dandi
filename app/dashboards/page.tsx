'use client'

import { useState } from 'react'
import { EyeIcon, ClipboardIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { CreateKeyModal } from '../components/modals/CreateKeyModal'
import { EditKeyModal } from '../components/modals/EditKeyModal'
import { Toast } from '../components/Toast'
import { useApiKeys } from '../hooks/useApiKeys'
import { ApiKey } from '../types/api'

export default function DashboardPage() {
  const { apiKeys, createApiKey, updateApiKey, deleteApiKey } = useApiKeys()
  const [isCreating, setIsCreating] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [newKeyLimit, setNewKeyLimit] = useState<number>(1000)
  const [isEditing, setIsEditing] = useState(false)
  const [editingKeyData, setEditingKeyData] = useState<ApiKey | null>(null)
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({})
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null)

  const copyToClipboard = async (text: string, keyId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKeyId(keyId)
      displayToast('Copied API Key to clipboard', 'success')
      setTimeout(() => setCopiedKeyId(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }))
  }

  const displayToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleEditClick = (key: ApiKey) => {
    setEditingKeyData(key)
    setIsEditing(true)
  }

  const handleCreate = async () => {
    try {
      const result = await createApiKey(newKeyName, newKeyLimit)
      if (result) {
        displayToast('API Key created successfully', 'success')
        setIsCreating(false)
      } else {
        displayToast('Failed to create API Key', 'error')
      }
    } catch (error) {
      console.error('Error creating API key:', error)
      displayToast('Failed to create API Key', 'error')
    }
  }

  const handleEdit = async (id: string, name: string, monthlyLimit: number) => {
    try {
      const success = await updateApiKey(id, name, monthlyLimit)
      if (success) {
        displayToast('API Key updated successfully', 'success')
        setIsEditing(false)
        setEditingKeyData(null)
      } else {
        displayToast('Failed to update API Key', 'error')
      }
    } catch (error) {
      console.error('Error updating API key:', error)
      displayToast('Failed to update API Key', 'error')
    }
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
                    {key.name}
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
                        onClick={() => copyToClipboard(key.value, key.id)}
                        className="text-gray-400 hover:text-gray-600 relative group"
                        title="Copy API Key"
                      >
                        <ClipboardIcon className="w-5 h-5" />
                        {copiedKeyId === key.id && (
                          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                            Copied!
                          </span>
                        )}
                      </button>
                      <button 
                        onClick={() => handleEditClick(key)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={async () => {
                          try {
                            await deleteApiKey(key.id)
                            displayToast('API Key deleted successfully', 'error')
                          } catch (error) {
                            displayToast('Failed to delete API Key', 'error')
                          }
                        }}
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
        createApiKey={handleCreate}
      />
      <EditKeyModal
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        editingKeyData={editingKeyData}
        updateApiKey={handleEdit}
      />
      {showToast && (
        <Toast message={toastMessage} type={toastType} onClose={() => setShowToast(false)} />
      )}
    </div>
  )
}