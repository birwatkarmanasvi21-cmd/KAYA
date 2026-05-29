'use client'

import { Message } from '@/app/health-context'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import React from 'react'

interface ChatMessageProps {
  message: Message
  allergens: string[]
}

const SEVERITY_COLORS = {
  low: 'severity-low',
  medium: 'severity-medium',
  high: 'severity-high',
  critical: 'severity-critical',
}

const formatBoldText = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>
    }
    return <React.Fragment key={i}>{part}</React.Fragment>
  })
}

export function ChatMessage({ message, allergens }: ChatMessageProps) {
  const isUser = message.role === 'user'
  const hasAllergyWarning =
    message.remedies?.some((remedy) =>
      remedy.allergens.some((allergen) =>
        allergens.some((userAllergen) =>
          userAllergen.toLowerCase() === allergen.toLowerCase()
        )
      )
    ) || false

  const contentBlocks = isUser ? [message.content] : message.content.split('\n\n').filter(b => b.trim().length > 0)

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} gap-4 animate-fadeInUp`}
    >
      <div className={`flex flex-col gap-3 max-w-sm md:max-w-md w-full`}>
        {/* Main message */}
        {contentBlocks.map((block, idx) => (
          <div
            key={idx}
            className={`rounded-2xl px-5 py-4 backdrop-blur-lg border transition-all ${
              isUser
                ? 'bg-gradient-to-br from-emerald-500/40 to-teal-500/30 border-emerald-400/50 shadow-lg hover:shadow-emerald-300/30 animate-softGlow'
                : 'bg-white/25 border-white/35 shadow-md hover:bg-white/30 animate-breatheScale'
            }`}
          >
            <p className={`text-sm leading-relaxed font-medium whitespace-pre-wrap ${isUser ? 'text-emerald-900' : 'text-foreground'}`}>
              {formatBoldText(block)}
            </p>
          </div>
        ))}

        {/* Metadata */}
        {!isUser && (
          <div className="space-y-3 px-1">
            {/* Severity Badge */}
            {message.severity && (
              <div
                className={`inline-block rounded-full px-3 py-1 text-xs font-medium w-fit ${
                  SEVERITY_COLORS[message.severity]
                }`}
              >
                {message.severity === 'critical' && (
                  <span className="flex items-center gap-1.5">
                    <AlertCircle className="w-3 h-3" />
                    Critical Concern
                  </span>
                )}
                {message.severity === 'high' && `High Concern`}
                {message.severity === 'medium' && `Moderate Concern`}
                {message.severity === 'low' && `Minor Issue`}
              </div>
            )}

            {/* Confidence Rating */}
            {message.confidenceRating !== undefined && (
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white/40 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      message.confidenceRating >= 0.8
                        ? 'bg-green-500'
                        : message.confidenceRating >= 0.6
                          ? 'bg-yellow-500'
                          : 'bg-orange-500'
                    }`}
                    style={{
                      width: `${message.confidenceRating * 100}%`,
                    }}
                  />
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  {Math.round(message.confidenceRating * 100)}%
                </span>
              </div>
            )}

            {/* Allergen Warning */}
            {hasAllergyWarning && (
              <div className="bg-red-100/80 border border-red-300 rounded-lg px-3 py-2 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-700 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-800">
                  Warning: One or more remedies may contain allergens for you.
                  Please review carefully.
                </p>
              </div>
            )}

            {/* Remedies */}
            {message.remedies && message.remedies.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-foreground">
                  Suggested Remedies:
                </p>
                {message.remedies.map((remedy, idx) => (
                  <div
                    key={idx}
                    className="bg-white/30 border border-white/50 rounded-xl p-3 space-y-2 backdrop-blur-sm hover:bg-white/35 transition-all animate-floatingDrift shadow-sm hover:shadow-md"
                    style={{ animationDelay: `${idx * 0.2}s` }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-medium text-foreground">
                        {remedy.name}
                      </h4>
                      <span className="text-xs font-bold text-green-700 bg-green-100 rounded px-2 py-1">
                        {Math.round(remedy.confidence * 100)}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {remedy.description}
                    </p>
                    {remedy.allergens.length > 0 && (
                      <div className="flex items-center gap-2 pt-1">
                        <AlertCircle className="w-3 h-3 text-yellow-600" />
                        <span className="text-xs text-yellow-700">
                          May contain: {remedy.allergens.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
