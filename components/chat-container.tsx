'use client'

import { useState, useRef, useEffect } from 'react'
import { useHealth } from '@/app/health-context'
import { ChatMessage } from './chat-message'
import { SuggestionChips } from './suggestion-chips'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, AlertCircle } from 'lucide-react'

const CRITICAL_KEYWORDS = [
  'chest pain',
  'difficulty breathing',
  'severe bleeding',
  'loss of consciousness',
  'severe allergic',
  'poisoning',
  'severe burns',
  'stroke',
]

export function ChatContainer() {
  const {
    chatHistory,
    addMessage,
    userProfile,
    setShowEmergencyModal,
    setEmergencySymptoms,
  } = useHealth()

  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isCritical, setIsCritical] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatHistory])

  const checkForCriticalSymptoms = (text: string): boolean => {
    return CRITICAL_KEYWORDS.some((keyword) =>
      text.toLowerCase().includes(keyword)
    )
  }

  const handleSuggest = (suggestion: string) => {
    setInput(suggestion)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Check for critical symptoms
    if (checkForCriticalSymptoms(input)) {
      setEmergencySymptoms(input)
      setShowEmergencyModal(true)
      setInput('')
      return
    }

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: input,
      timestamp: new Date(),
    }
    addMessage(userMessage)
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userProfile.userId || 1,
          message: input,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const aiMessage = {
          id: Date.now().toString(),
          role: 'assistant' as const,
          content: data.content,
          timestamp: new Date(),
          severity: data.severity,
          confidenceRating: data.confidence,
          remedies: data.remedies,
        }
        addMessage(aiMessage)
      } else {
        console.error("Failed to get AI response from backend")
        addMessage(generateMockResponse(input))
      }
    } catch (error) {
      console.error("API error", error)
      addMessage(generateMockResponse(input))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col relative bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Ethereal background effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/3 w-96 h-96 rounded-full bg-emerald-200/8 blur-3xl animate-floatingDrift" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-teal-200/8 blur-3xl animate-floatingDrift" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-10 w-72 h-72 rounded-full bg-green-200/6 blur-3xl animate-breatheScale" />
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 md:p-6 relative z-10">
        {chatHistory.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center">
            <div className="space-y-4 max-w-sm backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/20 animate-fadeInUp">
              <h2 className="text-2xl font-serif font-bold text-foreground">
                Welcome back{userProfile.name ? `, ${userProfile.name}` : ''}
              </h2>
              <p className="text-muted-foreground">
                Describe your symptoms or health concerns, and I&apos;ll provide
                guidance. Remember: for emergencies, always call 911.
              </p>
              <div className="pt-4 space-y-2 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium">Age:</span> {userProfile.age}
                </p>
                {userProfile.allergens.length > 0 && (
                  <p>
                    <span className="font-medium">Allergens:</span>{' '}
                    {userProfile.allergens.join(', ')}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          chatHistory.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              allergens={userProfile.allergens}
            />
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="glass rounded-2xl px-4 py-3 bg-secondary/20 border-secondary/30">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-secondary rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-secondary rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-emerald-200/30 p-4 md:p-6 space-y-4 bg-gradient-to-t from-white/10 to-transparent backdrop-blur-lg relative z-10">
        {isCritical && (
          <div className="bg-gradient-to-r from-red-100 to-orange-100 border-2 border-red-300 rounded-xl px-4 py-3 flex items-start gap-3 shadow-lg shadow-red-200/50 animate-scaleIn">
            <AlertCircle className="w-6 h-6 text-red-700 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 font-semibold">
              <span>🚨 Emergency Detected:</span> If you reported critical symptoms, please call 911 immediately.
            </p>
          </div>
        )}

        <SuggestionChips onSuggest={handleSuggest} />

        <form onSubmit={handleSubmit} className="flex gap-3">
          <Input
            placeholder="Describe your symptoms..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="bg-white/40 backdrop-blur-lg border-white/50 rounded-xl flex-1 py-3 px-4 shadow-lg placeholder:text-slate-400"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-emerald-300/50 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  )
}

function generateMockResponse(input: string) {
  const messages = [
    {
      content:
        'Thank you for sharing your symptoms. Based on your description, this appears to be a common condition. Staying hydrated and getting adequate rest are important. However, if symptoms persist, please consult with a healthcare professional.',
      severity: 'low' as const,
      confidence: 0.75,
    },
    {
      content:
        'I understand your concern. These symptoms warrant closer attention. I recommend contacting your doctor within 24 hours to get a proper evaluation and diagnosis.',
      severity: 'medium' as const,
      confidence: 0.68,
    },
    {
      content:
        'Given the nature of your symptoms, it\'s important to seek medical attention. Your doctor can provide a proper diagnosis and recommend the best course of treatment.',
      severity: 'high' as const,
      confidence: 0.82,
    },
  ]

  const randomResponse = messages[Math.floor(Math.random() * messages.length)]

  return {
    id: Date.now().toString(),
    role: 'assistant' as const,
    content: randomResponse.content,
    timestamp: new Date(),
    severity: randomResponse.severity,
    confidenceRating: randomResponse.confidence,
    remedies: [
      {
        name: 'Rest & Recovery',
        description:
          'Ensure adequate sleep and allow your body time to heal naturally.',
        allergens: [],
        confidence: 0.9,
      },
      {
        name: 'Stay Hydrated',
        description: 'Drink plenty of water throughout the day.',
        allergens: [],
        confidence: 0.95,
      },
      {
        name: 'Monitor Symptoms',
        description:
          'Keep track of any changes or new symptoms and report to your doctor.',
        allergens: [],
        confidence: 0.88,
      },
    ],
  }
}
