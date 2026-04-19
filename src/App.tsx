import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import { Step1PersonalDetails } from '@/components/steps/Step1PersonalDetails'
import { Step2CurrentElections } from '@/components/steps/Step2CurrentElections'
import { Step3NewPlans } from '@/components/steps/Step3NewPlans'
import { Step4Review } from '@/components/steps/Step4Review'
import { Button } from '@/components/ui/button'
import {
  mockEmployee,
  mockDependents,
  mockCurrentElections,
  healthPlans,
  dentalPlans,
  visionPlans,
} from '@/data/mockData'
import type { Dependent, NewElections, CoverageTier } from '@/types'

function computeCoverageTier(dependents: Dependent[]): CoverageTier {
  const hasSpouse = dependents.some(d => d.relationship === 'Spouse' || d.relationship === 'Domestic Partner')
  const hasChild = dependents.some(d => d.relationship === 'Child')

  if (hasSpouse && hasChild) return 'Family'
  if (hasSpouse) return 'Employee + Spouse'
  if (hasChild) return 'Employee + Children'
  return 'Employee Only'
}

const TOTAL_STEPS = 4

export default function App() {
  const [currentStep, setCurrentStep] = useState(1)
  const [dependents, setDependents] = useState<Dependent[]>(mockDependents)
  const [elections, setElections] = useState<NewElections>({
    health: null,
    dental: null,
    vision: null,
  })
  const [enrolled, setEnrolled] = useState(false)

  const coverageTier = computeCoverageTier(dependents)
  const previousMonthlyTotal = mockCurrentElections.reduce((sum, e) => sum + e.monthlyPremium, 0)

  function handleElectionChange(type: 'health' | 'dental' | 'vision', planId: string) {
    setElections(prev => ({
      ...prev,
      [type]: prev[type] === planId ? null : planId,
    }))
  }

  function canAdvance(): boolean {
    if (currentStep === 3) {
      return !!(elections.health && elections.dental && elections.vision)
    }
    return true
  }

  function handleNext() {
    if (currentStep < TOTAL_STEPS) setCurrentStep(s => s + 1)
  }

  function handleBack() {
    if (currentStep > 1) setCurrentStep(s => s - 1)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar currentStep={currentStep} onStepClick={setCurrentStep} />

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Header employee={mockEmployee} currentStep={currentStep} />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-8 py-8">
            {/* Step content */}
            {currentStep === 1 && (
              <Step1PersonalDetails
                employee={mockEmployee}
                dependents={dependents}
                onDependentsChange={setDependents}
              />
            )}

            {currentStep === 2 && (
              <Step2CurrentElections elections={mockCurrentElections} />
            )}

            {currentStep === 3 && (
              <Step3NewPlans
                healthPlans={healthPlans}
                dentalPlans={dentalPlans}
                visionPlans={visionPlans}
                elections={elections}
                coverageTier={coverageTier}
                onElectionChange={handleElectionChange}
              />
            )}

            {currentStep === 4 && (
              <Step4Review
                employee={mockEmployee}
                dependents={dependents}
                elections={elections}
                coverageTier={coverageTier}
                healthPlans={healthPlans}
                dentalPlans={dentalPlans}
                visionPlans={visionPlans}
                previousMonthlyTotal={previousMonthlyTotal}
                onConfirm={() => setEnrolled(true)}
              />
            )}

            {/* Navigation */}
            {!enrolled && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i + 1 === currentStep
                          ? 'bg-blue-600 w-6'
                          : i + 1 < currentStep
                          ? 'bg-emerald-500'
                          : 'bg-slate-300'
                      }`}
                    />
                  ))}
                </div>

                {currentStep < TOTAL_STEPS ? (
                  <Button onClick={handleNext} disabled={!canAdvance()} className="gap-2">
                    {currentStep === 3 && !canAdvance()
                      ? 'Select all plans to continue'
                      : 'Continue'}
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <div className="w-24" /> // spacer to keep back button aligned left
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
