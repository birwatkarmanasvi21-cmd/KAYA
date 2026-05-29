'use client'

import { HealthProvider, useHealth } from './health-context'
import { OnboardingCard } from '@/components/onboarding-card'
import { ChatSidebar } from '@/components/chat-sidebar'
import { ChatContainer } from '@/components/chat-container'
import { EmergencyModal } from '@/components/emergency-modal'

function PageContent() {
  const { userProfile } = useHealth()

  if (!userProfile.onboardingComplete) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <OnboardingCard />
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col md:flex-row gap-4 md:gap-0 p-4 md:p-0">
      <ChatSidebar />
      <ChatContainer />
      <EmergencyModal />
    </main>
  )
}

export default function Page() {
  return (
    <HealthProvider>
      <PageContent />
    </HealthProvider>
  )
}
