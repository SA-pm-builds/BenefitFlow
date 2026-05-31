import { HeartPulse, Smile, Eye, Calendar, DollarSign, Info, BarChart3, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { CurrentElection, PlanType } from '@/types'

interface Step2Props {
  elections: CurrentElection[]
}

const planTypeConfig: Record<PlanType, {
  label: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bg: string
}> = {
  health: { label: 'Medical', icon: HeartPulse, color: 'text-rose-600', bg: 'bg-rose-100' },
  dental: { label: 'Dental', icon: Smile, color: 'text-sky-600', bg: 'bg-sky-100' },
  vision: { label: 'Vision', icon: Eye, color: 'text-violet-600', bg: 'bg-violet-100' },
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function Step2CurrentElections({ elections }: Step2Props) {
  const totalMonthly = elections.reduce((sum, e) => sum + e.monthlyPremium, 0)
  const totalAnnual = elections.reduce((sum, e) => sum + e.annualPremium, 0)

  return (
    <div className="space-y-6">
      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
        <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-blue-800">Your Current 2025 Coverage</p>
          <p className="text-sm text-blue-700 mt-0.5">
            Review your existing benefit elections below. In the next step, you'll have the opportunity to
            select new plans for 2026. Your current plans will expire on December 31, 2025.
          </p>
        </div>
      </div>

      {/* Cost Summary */}
      <Card className="border-0 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 font-medium">2025 Total Premium</p>
              <p className="text-3xl font-bold mt-1">{formatCurrency(totalMonthly)}<span className="text-lg font-normal text-slate-400">/mo</span></p>
              <p className="text-sm text-slate-400 mt-1">{formatCurrency(totalAnnual)} annually</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
                <DollarSign className="w-4 h-4 text-slate-300" />
                <span className="text-sm font-medium text-slate-200">Employee Portion</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">Employer covers 70% of total premium</p>
            </div>
          </div>

          <Separator className="my-4 bg-white/10" />

          <div className="grid grid-cols-3 gap-4">
            {elections.map(election => {
              const config = planTypeConfig[election.planType]
              return (
                <div key={election.planType} className="text-center">
                  <p className="text-xs text-slate-400">{config.label}</p>
                  <p className="text-lg font-semibold text-white mt-0.5">
                    {formatCurrency(election.monthlyPremium)}
                    <span className="text-xs font-normal text-slate-400">/mo</span>
                  </p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Individual plan cards */}
      <div className="grid gap-4">
        {elections.map(election => {
          const config = planTypeConfig[election.planType]
          const Icon = config.icon

          return (
            <Card key={election.planType} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${config.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-base">{config.label} Coverage</CardTitle>
                      <CardDescription>{election.carrier}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="success" className="text-xs">Active</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <ElectionField label="Plan Name" value={election.planName} />
                  <ElectionField label="Coverage Tier" value={election.coverageTier} />
                  <ElectionField
                    label="Effective Date"
                    value={formatDate(election.effectiveDate)}
                  />
                  <ElectionField
                    label="Monthly Premium"
                    value={formatCurrency(election.monthlyPremium)}
                    highlight
                  />
                </div>

                <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-100">
                  <Calendar className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <p className="text-xs text-amber-700">
                    This plan expires <strong>December 31, 2025</strong>. You must re-enroll to maintain coverage in 2026.
                  </p>
                  <ArrowRight className="w-4 h-4 text-amber-500 ml-auto flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Coverage breakdown note */}
      <Card className="border-dashed">
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
            <p className="text-sm font-medium text-muted-foreground">Coverage Summary</p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-muted-foreground">Plans Active</p>
              <p className="text-xl font-bold text-foreground mt-0.5">{elections.length}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Coverage Tier</p>
              <p className="text-sm font-bold text-foreground mt-0.5">{elections[0]?.coverageTier ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Annual Premium</p>
              <p className="text-xl font-bold text-foreground mt-0.5">{formatCurrency(totalAnnual)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ElectionField({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className={`text-sm font-semibold mt-0.5 ${highlight ? 'text-blue-600' : ''}`}>{value}</p>
    </div>
  )
}
