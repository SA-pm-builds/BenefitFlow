import { Bell, HelpCircle, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Employee } from '@/types'

interface HeaderProps {
  employee: Employee
  currentStep: number
}

const stepTitles = [
  '',
  'Personal Details & Dependents',
  'Current Benefit Elections',
  'Select New Plans',
  'Review & Confirm Enrollment',
]

export function Header({ employee, currentStep }: HeaderProps) {
  const initials = `${employee.firstName[0]}${employee.lastName[0]}`

  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-8 sticky top-0 z-10">
      <div>
        <h1 className="text-base font-semibold text-foreground">{stepTitles[currentStep]}</h1>
        <p className="text-xs text-muted-foreground">{employee.enrollmentPeriod}</p>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <HelpCircle className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-blue-500 rounded-full" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
            {initials}
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium leading-none">{employee.firstName} {employee.lastName}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{employee.employeeId}</p>
          </div>
        </div>

        <Button variant="ghost" size="icon" className="text-muted-foreground ml-1">
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </header>
  )
}
