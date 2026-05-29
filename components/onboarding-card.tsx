'use client'

import { useState } from 'react'
import { useHealth, type UserProfile } from '@/app/health-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const CHRONIC_CONDITIONS = [
  'Diabetes',
  'Hypertension',
  'Asthma',
  'Arthritis',
  'Thyroid Disorder',
  'Heart Disease',
  'COPD',
  'IBS',
]

export function OnboardingCard() {
  const { userProfile, setUserProfile } = useHealth()
  const [step, setStep] = useState(1)
  const [allergenInput, setAllergenInput] = useState('')

  const handleNameChange = (name: string) => {
    setUserProfile({ ...userProfile, name })
  }

  const handleAgeChange = (age: string) => {
    const ageNum = parseInt(age)
    if (!isNaN(ageNum) && ageNum > 0 && ageNum < 150) {
      setUserProfile({ ...userProfile, age: ageNum })
    }
  }

  const handleSexChange = (sex: 'male' | 'female' | 'other') => {
    setUserProfile({ ...userProfile, sex })
  }

  const toggleCondition = (condition: string) => {
    const conditions = userProfile.chronicConditions.includes(condition)
      ? userProfile.chronicConditions.filter((c) => c !== condition)
      : [...userProfile.chronicConditions, condition]
    setUserProfile({ ...userProfile, chronicConditions: conditions })
  }

  const addAllergen = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && allergenInput.trim()) {
      const allergen = allergenInput.trim()
      if (!userProfile.allergens.includes(allergen)) {
        setUserProfile({
          ...userProfile,
          allergens: [...userProfile.allergens, allergen],
        })
      }
      setAllergenInput('')
    }
  }

  const removeAllergen = (allergen: string) => {
    setUserProfile({
      ...userProfile,
      allergens: userProfile.allergens.filter((a) => a !== allergen),
    })
  }

  const handleComplete = async () => {
    if (userProfile.age && userProfile.sex) {
      try {
        const response = await fetch('http://localhost:8000/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: userProfile.name,
            age: userProfile.age,
            sex: userProfile.sex,
            allergens: userProfile.allergens,
          }),
        })
        
        if (response.ok) {
          const data = await response.json()
          setUserProfile({ ...userProfile, onboardingComplete: true, userId: data.user_id })
        } else {
          console.error("Failed to save user profile")
          setUserProfile({ ...userProfile, onboardingComplete: true })
        }
      } catch (error) {
        console.error("API error", error)
        setUserProfile({ ...userProfile, onboardingComplete: true })
      }
    }
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Ethereal atmospheric effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft light orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-emerald-300/8 blur-3xl animate-floatingDrift" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-teal-300/8 blur-3xl animate-floatingDrift" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-10 w-72 h-72 rounded-full bg-green-200/6 blur-3xl animate-breatheScale" />
        <div className="absolute -bottom-20 left-20 w-96 h-96 rounded-full bg-emerald-200/5 blur-3xl animate-floatingDrift" style={{ animationDelay: '4s' }} />
      </div>
      
      <div className="glass-premium rounded-3xl p-8 md:p-12 space-y-8 max-w-2xl w-full animate-fadeInUp ethereal-container relative z-10 backdrop-blur-xl border border-white/50 shadow-2xl" style={{ boxShadow: '0 0 60px rgba(34, 197, 94, 0.1), inset 0 0 40px rgba(255, 255, 255, 0.3)' }}>
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-4 mx-auto animate-floatingOrb">
            <span className="text-6xl">💚</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-serif font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent animate-gradientShift" style={{ backgroundSize: '200% 200%' }}>
            KAYA
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Your personalized wellness companion
          </p>
          <div className="flex justify-center gap-3 pt-4">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`rounded-full transition-all duration-500 ${
                  s <= step 
                    ? 'w-8 h-2 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 shadow-lg shadow-emerald-300/50 animate-softGlow' 
                    : 'w-2 h-2 bg-slate-300/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Name */}
        {step === 1 && (
          <div className="space-y-6 animate-slideInRight">
            <label className="block">
              <span className="text-lg font-medium text-foreground mb-3 block">
                What is your name?
              </span>
              <Input
                type="text"
                placeholder="Enter your name"
                value={userProfile.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="bg-white/50 backdrop-blur-sm border-white/40 text-lg py-3 px-4 rounded-xl"
              />
            </label>
            <Button
              onClick={() => setStep(2)}
              disabled={!userProfile.name.trim()}
              className="w-full disabled:opacity-50 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-emerald-300/50 hover:scale-105 active:scale-95 disabled:hover:scale-100"
            >
              Next
            </Button>
          </div>
        )}

        {/* Step 2: Age */}
        {step === 2 && (
          <div className="space-y-6 animate-slideInRight">
            <label className="block">
              <span className="text-lg font-medium text-foreground mb-3 block">
                How old are you?
              </span>
              <Input
                type="number"
                placeholder="Enter your age"
                value={userProfile.age || ''}
                onChange={(e) => handleAgeChange(e.target.value)}
                className="bg-white/50 backdrop-blur-sm border-white/40 text-lg py-3 px-4 rounded-xl"
              />
            </label>
            <div className="flex gap-3 pt-2">
              <Button onClick={() => setStep(1)} variant="outline" className="flex-1 rounded-xl border-2 border-emerald-200 hover:bg-white/30">
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!userProfile.age}
                className="flex-1 disabled:opacity-50 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-emerald-300/50 hover:scale-105 active:scale-95 disabled:hover:scale-100"
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Sex */}
        {step === 3 && (
          <div className="space-y-6 animate-slideInRight">
            <p className="text-lg font-medium text-foreground">
              How do you identify?
            </p>
            <div className="grid grid-cols-3 gap-4">
              {(['male', 'female', 'other'] as const).map((option) => (
                <button
                  key={option}
                  onClick={() => handleSexChange(option)}
                  className={`p-4 rounded-xl border-2 transition-all capitalize font-semibold text-base ${
                    userProfile.sex === option
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-600 shadow-lg shadow-emerald-300/50 animate-softGlow'
                      : 'border-white/40 bg-white/25 backdrop-blur-md hover:bg-white/35 hover:border-white/50 hover:shadow-lg'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={() => setStep(2)} variant="outline" className="flex-1 rounded-xl border-2 border-emerald-200 hover:bg-white/30">
                Back
              </Button>
              <Button onClick={() => setStep(4)} className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-emerald-300/50 hover:scale-105 active:scale-95">
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Conditions & Allergens */}
        {step === 4 && (
          <div className="space-y-6 animate-slideInRight">
            {/* Chronic Conditions */}
            <div className="space-y-4">
              <p className="text-lg font-medium text-foreground">
                Any chronic conditions? <span className="text-muted-foreground font-normal">(optional)</span>
              </p>
              <div className="grid grid-cols-2 gap-3">
                {CHRONIC_CONDITIONS.map((condition) => (
                  <button
                    key={condition}
                    onClick={() => toggleCondition(condition)}
                    className={`p-4 rounded-xl text-sm font-medium transition-all border-2 ${
                      userProfile.chronicConditions.includes(condition)
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-600 shadow-lg shadow-emerald-300/50 animate-softGlow'
                        : 'border-white/40 bg-white/25 backdrop-blur-md hover:bg-white/35 hover:border-white/50'
                    }`}
                  >
                    {condition}
                  </button>
                ))}
              </div>
            </div>

            {/* Allergens */}
            <div className="space-y-4">
              <p className="text-lg font-medium text-foreground">
                Known allergens? <span className="text-muted-foreground font-normal">(optional)</span>
              </p>
              <Input
                placeholder="Type allergen and press Enter"
                value={allergenInput}
                onChange={(e) => setAllergenInput(e.target.value)}
                onKeyDown={addAllergen}
                className="bg-white/50 backdrop-blur-sm border-white/40 py-3 px-4 rounded-xl"
              />
              {userProfile.allergens.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {userProfile.allergens.map((allergen) => (
                    <div
                      key={allergen}
                      className="bg-gradient-to-r from-red-100 to-orange-100 border border-red-300 rounded-full px-4 py-2 text-sm font-medium text-red-700 flex items-center gap-2 shadow-sm"
                    >
                      {allergen}
                      <button
                        onClick={() => removeAllergen(allergen)}
                        className="text-red-500 hover:text-red-700 font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={() => setStep(3)} variant="outline" className="flex-1 rounded-xl border-2 border-emerald-200 hover:bg-white/30">
                Back
              </Button>
              <Button onClick={handleComplete} className="flex-1 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-emerald-300/50 hover:scale-105 active:scale-95 animate-softGlow">
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
