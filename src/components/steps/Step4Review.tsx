import { useState } from 'react'
import {
  HeartPulse, Smile, Eye, Check, Users, ShieldCheck,
  AlertCircle, FileText, DollarSign, TrendingUp, TrendingDown, Minus
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import type { Employee, Dependent, NewElections, CoverageTier, HealthPlan, DentalPlan, VisionPlan } from '@/types'

interface Step4Props {
  employee: Employee
  dependents: Dependent[]
  elections: NewElections
  coverageTier: CoverageTier
  healthPlans: HealthPlan[]
  dentalPlans: DentalPlan[]
  visionPlans: VisionPlan[]
  previousMonthlyTotal: number
  onConfirm: () => void
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n)
}

function getPremiumForTier(
  plan: { monthlyPremium: { employeeOnly: number; employeeSpouse: number; employeeChildren: number; family: number } },
  tier: CoverageTier
): number {
  switch (tier) {
    case 'Employee Only': return plan.monthlyPremium.employeeOnly
    case 'Employee + Spouse': return plan.monthlyPremium.employeeSpouse
    case 'Employee + Children': return plan.monthlyPremium.employeeChildren
    case 'Family': return plan.monthlyPremium.family
  }
}

const planTypeConfig = {
  health: { label: 'Medical', icon: HeartPulse, color: 'text-rose-600', bg: 'bg-rose-100' },
  dental: { label: 'Dental', icon: Smile, color: 'text-sky-600', bg: 'bg-sky-100' },
  vision: { label: 'Vision', icon: Eye, color: 'text-violet-600', bg: 'bg-violet-100' },
}

export function Step4Review({
  employee,
  dependents,
  elections,
  coverageTier,
  healthPlans,
  dentalPlans,
  visionPlans,
  previousMonthlyTotal,
  onConfirm,
}: Step4Props) {
  const [agreed, setAgreed] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const selectedHealth = healthPlans.find(p => p.id === elections.health)
  const selectedDental = dentalPlans.find(p => p.id === elections.dental)
  const selectedVision = visionPlans.find(p => p.id === elections.vision)

  const healthPremium = selectedHealth ? getPremiumForTier(selectedHealth, coverageTier) : 0
  const dentalPremium = selectedDental ? getPremiumForTier(selectedDental, coverageTier) : 0
  const visionPremium = selectedVision ? getPremiumForTier(selectedVision, coverageTier) : 0
  const totalMonthly = healthPremium + dentalPremium + visionPremium
  const annualTotal = totalMonthly * 12
  const monthlyDiff = totalMonthly - previousMonthlyTotal
  const pctChange = previousMonthlyTotal > 0 ? (monthlyDiff / previousMonthlyTotal) * 100 : 0

  const selectedPlans = [
    selectedHealth ? { plan: selectedHealth, premium: healthPremium, type: 'health' as const } : null,
    selectedDental ? { plan: selectedDental, premium: dentalPremium, type: 'dental' as const } : null,
    selectedVision ? { plan: selectedVision, premium: visionPremium, type: 'vision' as const } : null,
  ].filter(Boolean) as { plan: HealthPlan | DentalPlan | VisionPlan; premium: number; type: 'health' | 'dental' | 'vision' }[]

  if (confirmed) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
          <Check className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Enrollment Confirmed!</h2>
        <p className="text-muted-foreground max-w-md mb-2">
          Your 2026 benefits enrollment has been successfully submitted. A confirmation email has been sent to{' '}
          <strong>{employee.email}</strong>.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          Coverage begins <strong>January 1, 2026</strong>.
        </p>

        <div className="w-full max-w-sm bg-muted/50 rounded-xl p-5 text-left space-y-3">
          <p className="text-sm font-semibold text-center mb-4">Confirmation Summary</p>
          {selectedPlans.map(({ plan, premium, type }) => {
            const config = planTypeConfig[type]
            const Icon = config.icon
            return (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${config.color}`} />
                  <span className="text-sm font-medium">{plan.name}</span>
                </div>
                <span className="text-sm font-semibold">{formatCurrency(premium)}/mo</span>
              </div>
            )
          })}
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Total Monthly</span>
            <span className="text-sm font-bold text-blue-600">{formatCurrency(totalMonthly)}/mo</span>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <Button variant="outline" className="gap-2">
            <FileText className="w-4 h-4" />
            Download Summary PDF
          </Button>
          <Button className="gap-2">
            <ShieldCheck className="w-4 h-4" />
            View Benefits Portal
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 bg-gradient-to-br from-blue-600 to-blue-700 text-white col-span-1 md:col-span-2">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-blue-200">2026 Monthly Premium</p>
                <p className="text-3xl font-bold mt-0.5">{formatCurrency(totalMonthly)}</p>
                <p className="text-sm text-blue-200 mt-0.5">{formatCurrency(annualTotal)} annually</p>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${
                  monthlyDiff < 0 ? 'bg-emerald-500/20 text-emerald-200' :
                  monthlyDiff > 0 ? 'bg-red-500/20 text-red-200' :
                  'bg-white/10 text-blue-200'
                }`}>
                  {monthlyDiff < 0 ? <TrendingDown className="w-4 h-4" /> :
                   monthlyDiff > 0 ? <TrendingUp className="w-4 h-4" /> :
                   <Minus className="w-4 h-4" />}
                  {monthlyDiff === 0 ? 'No change' :
                   `${monthlyDiff > 0 ? '+' : ''}${formatCurrency(monthlyDiff)}/mo vs 2025`}
                </div>
                <p className="text-xs text-blue-300 mt-1.5">
                  {Math.abs(pctChange).toFixed(1)}% {monthlyDiff >= 0 ? 'increase' : 'decrease'} from last year
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Medical', value: formatCurrency(healthPremium) },
                { label: 'Dental', value: formatCurrency(dentalPremium) },
                { label: 'Vision', value: formatCurrency(visionPremium) },
              ].map(item => (
                <div key={item.label} className="bg-white/10 rounded-lg p-2 text-center">
                  <p className="text-xs text-blue-300">{item.label}</p>
                  <p className="text-sm font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                <Users className="w-4 h-4 text-violet-600" />
              </div>
              <div>
                <CardTitle className="text-sm">Coverage</CardTitle>
                <CardDescription className="text-xs">Who's covered</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <Badge variant="secondary" className="w-full justify-center py-1">{coverageTier}</Badge>
            <div className="space-y-1.5 mt-2">
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="font-medium">{employee.firstName} {employee.lastName}</span>
                <Badge variant="outline" className="text-xs ml-auto">Employee</Badge>
              </div>
              {dependents.map(dep => (
                <div key={dep.id} className="flex items-center gap-2 text-sm">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{dep.firstName} {dep.lastName}</span>
                  <Badge variant="outline" className="text-xs ml-auto">{dep.relationship}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Plans */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Selected Plans</CardTitle>
          <CardDescription>Your 2026 benefit elections effective January 1, 2026</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedPlans.map(({ plan, premium, type }, index) => {
            const config = planTypeConfig[type]
            const Icon = config.icon

            return (
              <div key={type}>
                {index > 0 && <Separator className="mb-4" />}
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold">{plan.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{plan.carrier}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-lg font-bold text-foreground">{formatCurrency(premium)}<span className="text-xs font-normal text-muted-foreground">/mo</span></p>
                        <p className="text-xs text-muted-foreground">{formatCurrency(premium * 12)}/yr</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {plan.features.slice(0, 3).map(f => (
                        <Badge key={f} variant="secondary" className="text-xs font-normal">{f}</Badge>
                      ))}
                      {plan.features.length > 3 && (
                        <Badge variant="secondary" className="text-xs font-normal">+{plan.features.length - 3} more</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Cost Comparison */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <CardTitle className="text-base">Month-over-Month Cost Comparison</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-muted/50">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">2025 Monthly</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(previousMonthlyTotal)}</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className={`flex items-center gap-1 text-sm font-semibold px-3 py-1.5 rounded-full ${
                monthlyDiff <= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
              }`}>
                {monthlyDiff < 0 ? <TrendingDown className="w-4 h-4" /> :
                 monthlyDiff > 0 ? <TrendingUp className="w-4 h-4" /> :
                 <Minus className="w-4 h-4" />}
                {monthlyDiff >= 0 ? '+' : ''}{formatCurrency(monthlyDiff)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{Math.abs(pctChange).toFixed(1)}% {monthlyDiff >= 0 ? '↑' : '↓'}</p>
            </div>
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
              <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">2026 Monthly</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">{formatCurrency(totalMonthly)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legal Acknowledgment */}
      <Card className="border-amber-200 bg-amber-50/50">
        <CardContent className="pt-5">
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Important Notice</p>
              <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                By confirming your enrollment, you acknowledge that benefit elections are binding for the plan
                year (January 1 – December 31, 2026) and can only be changed during a qualifying life event
                (QLE) or the next open enrollment period. Your pre-tax contributions will be reflected in your
                first paycheck of 2026.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-amber-200">
            <Checkbox
              id="agree"
              checked={agreed}
              onCheckedChange={v => setAgreed(Boolean(v))}
            />
            <Label htmlFor="agree" className="cursor-pointer text-sm font-medium">
              I have reviewed my elections and agree to the terms above. I understand my elections are
              effective January 1, 2026.
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Confirm Button */}
      <div className="flex flex-col items-center gap-3">
        <Button
          size="lg"
          className="w-full md:w-auto md:min-w-64 gap-2"
          disabled={!agreed}
          onClick={() => { setConfirmed(true); onConfirm() }}
        >
          <ShieldCheck className="w-5 h-5" />
          Confirm Enrollment
        </Button>
        {!agreed && (
          <p className="text-xs text-muted-foreground">Please check the acknowledgment box to continue</p>
        )}
      </div>
    </div>
  )
}
