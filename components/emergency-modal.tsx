'use client'

import { useHealth } from '@/app/health-context'
import { AlertTriangle, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'

const CRITICAL_SYMPTOMS = [
  'chest pain',
  'difficulty breathing',
  'severe bleeding',
  'loss of consciousness',
  'severe allergic reaction',
  'poisoning',
  'severe burns',
]

export function EmergencyModal() {
  const { showEmergencyModal, setShowEmergencyModal, emergencySymptoms } =
    useHealth()

  if (!showEmergencyModal) return null

  const isCritical = CRITICAL_SYMPTOMS.some((symptom) =>
    emergencySymptoms.toLowerCase().includes(symptom)
  )

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass rounded-2xl max-w-md w-full p-8 space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="bg-red-100 rounded-full p-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-serif font-bold text-foreground">
            {isCritical ? 'Medical Emergency' : 'Urgent Medical Concern'}
          </h2>
          <p className="text-muted-foreground text-sm">
            {isCritical
              ? 'You reported critical symptoms that require immediate medical attention.'
              : 'These symptoms suggest you should seek medical care promptly.'}
          </p>
        </div>

        {/* Symptoms Summary */}
        <div className="bg-red-100/50 border border-red-300 rounded-lg p-4">
          <p className="text-sm text-red-900">
            <span className="font-medium">Reported Symptoms:</span>{' '}
            {emergencySymptoms}
          </p>
        </div>

        {/* Guidance */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">
            Recommended Actions:
          </p>
          <ul className="space-y-2 text-sm text-foreground">
            <li className="flex items-start gap-3">
              <span className="text-red-600 font-bold mt-1">1.</span>
              <span>
                {isCritical
                  ? 'Call 102 or 108 (emergency services) immediately'
                  : 'Contact your doctor or visit an urgent care clinic'}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-600 font-bold mt-1">2.</span>
              <span>
                Do not drive yourself if experiencing severe symptoms
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-600 font-bold mt-1">3.</span>
              <span>
                Have your health information available when speaking with medical
                professionals
              </span>
            </li>
          </ul>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-xs text-yellow-900">
            <span className="font-semibold">Disclaimer:</span> This assessment is
            for informational purposes only and does not replace professional
            medical advice. Always consult a healthcare provider for proper
            diagnosis and treatment.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setShowEmergencyModal(false)}
            className="flex-1"
          >
            I&apos;ll Seek Help
          </Button>
          <a
            href="tel:102"
            className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Phone className="w-4 h-4" />
            Call 102
          </a>
        </div>

        {/* Close button */}
        <button
          onClick={() => setShowEmergencyModal(false)}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
