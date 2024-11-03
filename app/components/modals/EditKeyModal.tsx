import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState, useEffect } from 'react'
import { ApiKey } from '@/app/types/api'

interface EditKeyModalProps {
  isEditing: boolean
  setIsEditing: (value: boolean) => void
  editingKeyData: ApiKey | null
  updateApiKey: (id: string, name: string, monthlyLimit: number) => Promise<void>
}

export function EditKeyModal({
  isEditing,
  setIsEditing,
  editingKeyData,
  updateApiKey,
}: EditKeyModalProps) {
  const [name, setName] = useState(editingKeyData?.name || '')
  const [monthlyLimit, setMonthlyLimit] = useState(editingKeyData?.monthly_limit || 1000)

  useEffect(() => {
    if (editingKeyData) {
      setName(editingKeyData.name)
      setMonthlyLimit(editingKeyData.monthly_limit || 1000)
    }
  }, [editingKeyData])

  if (!isEditing || !editingKeyData) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-[500px] max-w-full mx-4">
        <h2 className="text-xl font-semibold mb-4">Edit API key</h2>
        <p className="text-gray-600 mb-6">Update the name and limit for this API key.</p>

        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="font-medium">Key Name</label>
              <span className="text-gray-500">— A unique name to identify this key</span>
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                id="limitUsage"
                checked={true}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                disabled
              />
              <label htmlFor="limitUsage" className="font-medium">Limit monthly usage*</label>
            </div>
            <input
              type="number"
              value={monthlyLimit}
              onChange={(e) => setMonthlyLimit(Number(e.target.value))}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-2">
              *If the combined usage of all your keys exceeds your plan's limit, all requests will be rejected.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-full"
          >
            Cancel
          </button>
          <button
            onClick={() => updateApiKey(editingKeyData.id, name, monthlyLimit)}
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
} 