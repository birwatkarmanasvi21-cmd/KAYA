'use client'

import { useHealth } from '@/app/health-context'

const SUGGESTIONS = [
  'I have a cold',
  'Headache and fatigue',
  'Allergic reaction',
  'Muscle pain',
  'Sleep issues',
  'General wellness',
]

interface SuggestionChipsProps {
  onSuggest: (text: string) => void
}

export function SuggestionChips({ onSuggest }: SuggestionChipsProps) {
  const { chatHistory } = useHealth()

  if (chatHistory.length > 0) return null

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {SUGGESTIONS.map((suggestion) => (
        <button
          key={suggestion}
          onClick={() => onSuggest(suggestion)}
          className="glass rounded-full px-4 py-2 text-sm transition-all hover:bg-white/50 border border-white/30 text-foreground"
        >
          {suggestion}
        </button>
      ))}
    </div>
  )
}
