import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'

interface CreateKeyModalProps {
  isCreating: boolean
  setIsCreating: (value: boolean) => void
  newKeyName: string
  setNewKeyName: (value: string) => void
  newKeyLimit: number
  setNewKeyLimit: (value: number) => void
  createApiKey: (name: string, monthlyLimit: number) => Promise<any>
}

export function CreateKeyModal({
  isCreating,
  setIsCreating,
  newKeyName,
  setNewKeyName,
  newKeyLimit,
  setNewKeyLimit,
  createApiKey,
}: CreateKeyModalProps) {
  if (!isCreating) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-[500px] max-w-full mx-4">
        <h2 className="text-xl font-semibold mb-4">Create a new API key</h2>
        <p className="text-gray-600 mb-6">Enter a name and limit for the new API key.</p>

        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="font-medium">Key Name</label>
              <span className="text-gray-500">— A unique name to identify this key</span>
            </div>
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Key Name"
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
              value={newKeyLimit}
              onChange={(e) => setNewKeyLimit(Number(e.target.value))}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="1000"
            />
            <p className="text-sm text-gray-500 mt-2">
              *If the combined usage of all your keys exceeds your plan's limit, all requests will be rejected.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={() => setIsCreating(false)}
            className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-full"
          >
            Cancel
          </button>
          <button
            onClick={() => createApiKey(newKeyName, newKeyLimit)}
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  )
} 