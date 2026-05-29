'use client'

import { useHealth } from '@/app/health-context'
import { Button } from '@/components/ui/button'
import { Plus, LogOut } from 'lucide-react'

export function ChatSidebar() {
  const { chatHistory, clearChat, userProfile, setUserProfile } = useHealth()

  const handleNewChat = () => {
    clearChat()
  }

  const handleLogout = () => {
    setUserProfile({
      age: null,
      sex: null,
      chronicConditions: [],
      allergens: [],
      onboardingComplete: false,
    })
  }

  return (
    <div className="glass w-full md:w-64 md:h-screen md:border-r border-b md:border-b-0 rounded-2xl md:rounded-none p-4 flex flex-col relative overflow-hidden group">
      {/* Atmospheric orbs in sidebar */}
      <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-emerald-200/10 blur-2xl group-hover:animate-floatingDrift pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-teal-200/8 blur-2xl pointer-events-none animate-breatheScale" />
      
      {/* Header */}
      <div className="space-y-4 mb-6 pb-6 border-b border-white/20 relative z-10">
        <h2 className="font-serif text-xl font-bold text-foreground animate-floatingDrift">
          KAYA
        </h2>
        <Button
          onClick={handleNewChat}
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2 hover:bg-white/30 hover:shadow-md transition-all animate-glowPulse"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto mb-6 space-y-2 relative z-10">
        {chatHistory.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-8">
            No conversations yet
          </p>
        ) : (
          chatHistory
            .filter((msg) => msg.role === 'user')
            .slice(-5)
            .map((msg, idx) => (
              <button
                key={msg.id}
                className="w-full text-left p-3 rounded-xl bg-white/20 hover:bg-white/35 transition-all text-sm text-foreground truncate backdrop-blur-sm border border-white/20 hover:border-white/30 animate-softGlow"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {msg.content.substring(0, 30)}...
              </button>
            ))
        )}
      </div>

      {/* Profile Info */}
      <div className="space-y-3 pt-6 border-t border-white/20 relative z-10 bg-white/5 rounded-xl p-4 backdrop-blur-sm animate-breatheScale border border-white/10">
        <div className="text-xs space-y-1">
          <p className="text-muted-foreground">
            <span className="font-medium">Age:</span> {userProfile.age}
          </p>
          <p className="text-muted-foreground capitalize">
            <span className="font-medium">Sex:</span> {userProfile.sex}
          </p>
          {userProfile.allergens.length > 0 && (
            <p className="text-muted-foreground">
              <span className="font-medium">Allergens:</span>{' '}
              {userProfile.allergens.join(', ')}
            </p>
          )}
          {userProfile.chronicConditions.length > 0 && (
            <p className="text-muted-foreground">
              <span className="font-medium">Conditions:</span>{' '}
              {userProfile.chronicConditions.join(', ')}
            </p>
          )}
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2 text-red-600 hover:text-red-700"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}
