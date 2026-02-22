'use client'

import { useState } from 'react'
import { ApiKeyConfigForm } from '@/components/forms/ApiKeyConfigForm'
import { removeAllApiKeys } from '@/lib/api-key-storage'
import { Button } from '@/components/ui/button'

export default function SettingsPage() {
  const [keysUpdated, setKeysUpdated] = useState(false)

  const handleKeysChanged = () => {
    setKeysUpdated(true)
    setTimeout(() => setKeysUpdated(false), 3000)
  }

  const handleClearAll = () => {
    removeAllApiKeys()
    handleKeysChanged()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">
          Configure your LLM provider API keys to unlock AI-powered Code Lab generation.
          Keys are stored locally in your browser.
        </p>
      </div>

      {keysUpdated && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800 flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          API keys updated successfully.
        </div>
      )}

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">LLM Provider API Keys</h2>
        <ApiKeyConfigForm onKeysChanged={handleKeysChanged} />
      </section>

      <section className="border-t border-gray-200 pt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Danger Zone</h2>
        <p className="text-sm text-gray-600 mb-4">
          Remove all stored API keys from this browser. You will need to re-enter them to use AI providers.
        </p>
        <Button variant="destructive" onClick={handleClearAll}>
          Clear All API Keys
        </Button>
      </section>
    </div>
  )
}
