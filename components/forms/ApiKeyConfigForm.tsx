'use client'

import { useState, useEffect } from 'react'
import { saveApiKey, getApiKey, removeApiKey, hasApiKey, type ProviderId } from '@/lib/api-key-storage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ProviderConfig {
  id: ProviderId
  name: string
  placeholder: string
  docsUrl: string
  keyPattern: RegExp
  patternHint: string
}

const PROVIDER_CONFIGS: ProviderConfig[] = [
  {
    id: 'anthropic',
    name: 'Anthropic (Claude)',
    placeholder: 'sk-ant-...',
    docsUrl: 'https://console.anthropic.com/account/keys',
    keyPattern: /^sk-ant-/,
    patternHint: 'Should start with sk-ant-',
  },
  {
    id: 'openai',
    name: 'OpenAI (GPT-4)',
    placeholder: 'sk-...',
    docsUrl: 'https://platform.openai.com/api-keys',
    keyPattern: /^sk-/,
    patternHint: 'Should start with sk-',
  },
  {
    id: 'google',
    name: 'Google (Gemini)',
    placeholder: 'AIza...',
    docsUrl: 'https://aistudio.google.com/app/apikey',
    keyPattern: /^AIza/,
    patternHint: 'Should start with AIza',
  },
]

interface KeyState {
  value: string
  visible: boolean
  status: 'idle' | 'testing' | 'valid' | 'invalid' | 'error'
  statusMessage: string
  saved: boolean
}

function useKeyState(provider: ProviderId): [KeyState, (updates: Partial<KeyState>) => void] {
  const [state, setState] = useState<KeyState>(() => ({
    value: '',
    visible: false,
    status: 'idle',
    statusMessage: '',
    saved: hasApiKey(provider),
  }))

  const update = (updates: Partial<KeyState>) =>
    setState((prev) => ({ ...prev, ...updates }))

  return [state, update]
}

interface ApiKeyRowProps {
  config: ProviderConfig
  onSaved?: () => void
}

function ApiKeyRow({ config, onSaved }: ApiKeyRowProps) {
  const [state, update] = useKeyState(config.id)
  const [hasSavedKey, setHasSavedKey] = useState(false)

  // Load saved state on mount
  useEffect(() => {
    const saved = hasApiKey(config.id)
    setHasSavedKey(saved)
  }, [config.id])

  const handleSave = () => {
    if (!state.value.trim()) return
    if (!config.keyPattern.test(state.value.trim())) {
      update({ status: 'invalid', statusMessage: config.patternHint })
      return
    }
    saveApiKey(config.id, state.value.trim())
    update({ value: '', status: 'valid', statusMessage: 'API key saved successfully' })
    setHasSavedKey(true)
    onSaved?.()
  }

  const handleRemove = () => {
    removeApiKey(config.id)
    update({ value: '', status: 'idle', statusMessage: '' })
    setHasSavedKey(false)
    onSaved?.()
  }

  const handleTest = async () => {
    const keyToTest = state.value.trim() || (hasSavedKey ? getApiKey(config.id) : '')
    if (!keyToTest) {
      update({ status: 'invalid', statusMessage: 'Enter an API key to test' })
      return
    }

    update({ status: 'testing', statusMessage: 'Testing connection...' })
    try {
      const response = await fetch('/api/providers/test-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: config.id, apiKey: keyToTest }),
      })
      const data = await response.json()
      if (data.valid) {
        update({ status: 'valid', statusMessage: data.message || 'API key is valid' })
      } else {
        update({ status: 'invalid', statusMessage: data.message || 'Invalid API key' })
      }
    } catch {
      update({ status: 'error', statusMessage: 'Connection test failed' })
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">{config.name}</h3>
          <a
            href={config.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-ps-orange hover:underline"
          >
            Get API key →
          </a>
        </div>
        {hasSavedKey && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Configured
          </span>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`key-${config.id}`}>
          {hasSavedKey ? 'Update API Key' : 'API Key'}
        </Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              id={`key-${config.id}`}
              type={state.visible ? 'text' : 'password'}
              value={state.value}
              onChange={(e) => update({ value: e.target.value, status: 'idle', statusMessage: '' })}
              placeholder={hasSavedKey ? '(key saved — enter new key to update)' : config.placeholder}
              className="pr-10"
              autoComplete="off"
            />
            <button
              type="button"
              onClick={() => update({ visible: !state.visible })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={state.visible ? 'Hide API key' : 'Show API key'}
            >
              {state.visible ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          <Button
            type="button"
            onClick={handleSave}
            disabled={!state.value.trim()}
          >
            Save
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleTest}
            disabled={state.status === 'testing' || (!state.value.trim() && !hasSavedKey)}
          >
            {state.status === 'testing' ? 'Testing...' : 'Test'}
          </Button>
          {hasSavedKey && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleRemove}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {state.statusMessage && (
        <div
          className={`text-sm rounded-md px-3 py-2 flex items-start gap-2 ${
            state.status === 'valid'
              ? 'text-green-700 bg-green-50 border border-green-200'
              : state.status === 'invalid' || state.status === 'error'
              ? 'text-red-700 bg-red-50 border border-red-200'
              : 'text-blue-700 bg-blue-50 border border-blue-200'
          }`}
          role="alert"
        >
          {state.statusMessage}
        </div>
      )}
    </div>
  )
}

interface ApiKeyConfigFormProps {
  onKeysChanged?: () => void
}

export function ApiKeyConfigForm({ onKeysChanged }: ApiKeyConfigFormProps) {
  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
        <div className="flex items-start gap-2">
          <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-semibold">Security Notice</p>
            <p className="mt-1">
              API keys are stored in your browser&apos;s local storage with basic obfuscation. They are
              transmitted over HTTPS to the server only when generating content. Do not use this on
              shared or public computers.
            </p>
          </div>
        </div>
      </div>

      {PROVIDER_CONFIGS.map((config) => (
        <ApiKeyRow key={config.id} config={config} onSaved={onKeysChanged} />
      ))}
    </div>
  )
}
