import { cn } from '@/lib/utils'
import { Check, User, ClipboardList, ShieldCheck, FileCheck } from 'lucide-react'

interface Step {
  number: number
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

const steps: Step[] = [
  {
    number: 1,
    title: 'Personal Details',
    description: 'Review your info & dependents',
    icon: User,
  },
  {
    number: 2,
    title: 'Current Elections',
    description: 'View your 2024 coverage',
    icon: ClipboardList,
  },
  {
    number: 3,
    title: 'Select New Plans',
    description: 'Choose 2025 benefits',
    icon: ShieldCheck,
  },
  {
    number: 4,
    title: 'Review & Confirm',
    description: 'Finalize your enrollment',
    icon: FileCheck,
  },
]

interface SidebarProps {
  currentStep: number
  onStepClick: (step: number) => void
}

export function Sidebar({ currentStep, onStepClick }: SidebarProps) {
  return (
    <aside className="w-72 min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-slate-700/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight">BenefitFlow</span>
            <p className="text-xs text-slate-400 font-normal">Open Enrollment 2025</p>
          </div>
        </div>
      </div>

      {/* Enrollment Deadline Banner */}
      <div className="mx-4 mt-4 px-3 py-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
        <p className="text-xs text-amber-400 font-medium">Enrollment Deadline</p>
        <p className="text-sm text-amber-200 font-semibold">November 15, 2024</p>
        <p className="text-xs text-amber-400/80 mt-0.5">27 days remaining</p>
      </div>

      {/* Steps */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 mb-3">
          Enrollment Steps
        </p>
        {steps.map((step) => {
          const isCompleted = currentStep > step.number
          const isActive = currentStep === step.number
          const isUpcoming = currentStep < step.number
          const Icon = step.icon

          return (
            <button
              key={step.number}
              onClick={() => isCompleted ? onStepClick(step.number) : undefined}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200',
                isActive && 'bg-blue-600 shadow-lg shadow-blue-600/20',
                isCompleted && 'hover:bg-slate-800/80 cursor-pointer',
                isUpcoming && 'opacity-50 cursor-not-allowed'
              )}
              disabled={isUpcoming}
            >
              {/* Step indicator */}
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold transition-all',
                  isActive && 'bg-white text-blue-600',
                  isCompleted && 'bg-emerald-500 text-white',
                  isUpcoming && 'bg-slate-700 text-slate-500'
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>

              {/* Step info */}
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    'text-sm font-medium truncate',
                    isActive && 'text-white',
                    isCompleted && 'text-slate-200',
                    isUpcoming && 'text-slate-500'
                  )}
                >
                  {step.title}
                </p>
                <p
                  className={cn(
                    'text-xs truncate mt-0.5',
                    isActive && 'text-blue-200',
                    isCompleted && 'text-slate-400',
                    isUpcoming && 'text-slate-600'
                  )}
                >
                  {step.description}
                </p>
              </div>

              {/* Completed badge */}
              {isCompleted && (
                <span className="text-xs text-emerald-400 font-medium flex-shrink-0">Done</span>
              )}
            </button>
          )
        })}

        {/* Connector lines between steps */}
        <div className="absolute" />
      </nav>

      {/* Progress indicator */}
      <div className="px-6 py-4 border-t border-slate-700/60">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-slate-400">Progress</span>
          <span className="text-xs font-semibold text-slate-200">
            {currentStep - 1} of {steps.length} complete
          </span>
        </div>
        <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep - 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </aside>
  )
}
