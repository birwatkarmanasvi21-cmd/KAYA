'use client'

import React, { createContext, useContext, useState } from 'react'

export interface UserProfile {
  name: string
  age: number | null
  sex: 'male' | 'female' | 'other' | null
  chronicConditions: string[]
  allergens: string[]
  onboardingComplete: boolean
  userId?: number
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  confidenceRating?: number
  severity?: 'low' | 'medium' | 'high' | 'critical'
  remedies?: Remedy[]
}

export interface Remedy {
  name: string
  description: string
  allergens: string[]
  confidence: number
}

interface HealthContextType {
  userProfile: UserProfile
  setUserProfile: (profile: UserProfile) => void
  chatHistory: Message[]
  addMessage: (message: Message) => void
  clearChat: () => void
  showEmergencyModal: boolean
  setShowEmergencyModal: (show: boolean) => void
  emergencySymptoms: string
  setEmergencySymptoms: (symptoms: string) => void
}

const HealthContext = createContext<HealthContextType | undefined>(undefined)

export function HealthProvider({ children }: { children: React.ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    age: null,
    sex: null,
    chronicConditions: [],
    allergens: [],
    onboardingComplete: false,
    userId: undefined,
  })

  const [chatHistory, setChatHistory] = useState<Message[]>([])
  const [showEmergencyModal, setShowEmergencyModal] = useState(false)
  const [emergencySymptoms, setEmergencySymptoms] = useState('')

  const addMessage = (message: Message) => {
    setChatHistory((prev) => [...prev, message])
  }

  const clearChat = () => {
    setChatHistory([])
  }

  return (
    <HealthContext.Provider
      value={{
        userProfile,
        setUserProfile,
        chatHistory,
        addMessage,
        clearChat,
        showEmergencyModal,
        setShowEmergencyModal,
        emergencySymptoms,
        setEmergencySymptoms,
      }}
    >
      {children}
    </HealthContext.Provider>
  )
}

export function useHealth() {
  const context = useContext(HealthContext)
  if (!context) {
    throw new Error('useHealth must be used within HealthProvider')
  }
  return context
}
