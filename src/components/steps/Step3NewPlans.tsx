import { HeartPulse, Smile, Eye, Check, Star, Info, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import type { HealthPlan, DentalPlan, VisionPlan, NewElections, CoverageTier } from '@/types'

interface Step3Props {
  healthPlans: HealthPlan[]
  dentalPlans: DentalPlan[]
  visionPlans: VisionPlan[]
  elections: NewElections
  coverageTier: CoverageTier
  onElectionChange: (type: 'health' | 'dental' | 'vision', planId: string) => void
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n)
}

const tierColors = {
  Bronze: 'bronze',
  Silver: 'silver',
  Gold: 'gold',
  Platinum: 'platinum',
} as const

function getPremiumForTier(plan: { monthlyPremium: { employeeOnly: number; employeeSpouse: number; employeeChildren: number; family: number } }, tier: CoverageTier): number {
  switch (tier) {
    case 'Employee Only': return plan.monthlyPremium.employeeOnly
    case 'Employee + Spouse': return plan.monthlyPremium.employeeSpouse
    case 'Employee + Children': return plan.monthlyPremium.employeeChildren
    case 'Family': return plan.monthlyPremium.family
  }
}

// Health Plan Card
function HealthPlanCard({
  plan,
  isSelected,
  coverageTier,
  onSelect,
}: {
  plan: HealthPlan
  isSelected: boolean
  coverageTier: CoverageTier
  onSelect: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const premium = getPremiumForTier(plan, coverageTier)

  return (
    <Card className={cn(
      'relative transition-all duration-200 cursor-pointer hover:shadow-lg',
      isSelected
        ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/10'
        : 'hover:border-slate-300'
    )} onClick={onSelect}>
      {plan.isRecommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <Badge className="gap-1 bg-blue-600 text-white border-0 shadow-md px-3">
            <Star className="w-3 h-3 fill-current" /> Recommended
          </Badge>
        </div>
      )}

      <CardHeader className="pb-3 pt-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={tierColors[plan.tier]}>{plan.tier}</Badge>
              {plan.hsa && <Badge variant="success" className="text-xs">HSA-Eligible</Badge>}
              {isSelected && <Badge variant="default" className="text-xs gap-1"><Check className="w-3 h-3" /> Selected</Badge>}
            </div>
            <CardTitle className="text-base leading-tight">{plan.name}</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">{plan.carrier} · {plan.network}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-2xl font-bold text-foreground">{formatCurrency(premium)}</p>
            <p className="text-xs text-muted-foreground">/month</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <PlanStat label="Individual Deductible" value={plan.deductible.individual === 0 ? '$0' : formatCurrency(plan.deductible.individual)} />
          <PlanStat label="OOP Maximum" value={formatCurrency(plan.oopMax.individual)} />
          <PlanStat label="Coinsurance" value={`${plan.coinsurance}%`} />
        </div>

        <button
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors w-full text-left"
          onClick={e => { e.stopPropagation(); setExpanded(v => !v) }}
        >
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          {expanded ? 'Hide' : 'Show'} plan details
        </button>

        {expanded && (
          <div className="pt-1 space-y-3">
            <Separator />
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">What's included</p>
              <div className="grid grid-cols-1 gap-1.5">
                {plan.features.map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <PlanStat label="Family Deductible" value={plan.deductible.family === 0 ? '$0' : formatCurrency(plan.deductible.family)} />
              <PlanStat label="Family OOP Max" value={formatCurrency(plan.oopMax.family)} />
            </div>
          </div>
        )}

        <Button
          variant={isSelected ? 'default' : 'outline'}
          className="w-full"
          onClick={e => { e.stopPropagation(); onSelect() }}
        >
          {isSelected ? <><Check className="w-4 h-4" /> Selected</> : 'Select This Plan'}
        </Button>
      </CardContent>
    </Card>
  )
}

// Dental Plan Card
function DentalPlanCard({
  plan,
  isSelected,
  coverageTier,
  onSelect,
}: {
  plan: DentalPlan
  isSelected: boolean
  coverageTier: CoverageTier
  onSelect: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const premium = getPremiumForTier(plan, coverageTier)

  return (
    <Card className={cn(
      'relative transition-all duration-200 cursor-pointer hover:shadow-lg',
      isSelected ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/10' : 'hover:border-slate-300'
    )} onClick={onSelect}>
      {plan.isRecommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <Badge className="gap-1 bg-blue-600 text-white border-0 shadow-md px-3">
            <Star className="w-3 h-3 fill-current" /> Recommended
          </Badge>
        </div>
      )}

      <CardHeader className="pb-3 pt-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {isSelected && <Badge variant="default" className="text-xs gap-1"><Check className="w-3 h-3" /> Selected</Badge>}
            </div>
            <CardTitle className="text-base leading-tight">{plan.name}</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">{plan.carrier}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-2xl font-bold text-foreground">{formatCurrency(premium)}</p>
            <p className="text-xs text-muted-foreground">/month</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <PlanStat label="Annual Max" value={formatCurrency(plan.annualMaximum)} />
          <PlanStat label="Preventive" value={plan.preventive.split('(')[0].trim()} />
          <PlanStat label="Basic" value={plan.basic.split(' ')[0]} />
        </div>

        <button
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors w-full text-left"
          onClick={e => { e.stopPropagation(); setExpanded(v => !v) }}
        >
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          {expanded ? 'Hide' : 'Show'} plan details
        </button>

        {expanded && (
          <div className="pt-1 space-y-3">
            <Separator />
            <div className="grid grid-cols-2 gap-3">
              <PlanStat label="Major Services" value={plan.major.split(' ')[0]} />
              <PlanStat label="Orthodontia" value={plan.orthodontia ?? 'Not covered'} />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">What's included</p>
              {plan.features.map(f => (
                <div key={f} className="flex items-center gap-2 text-sm mb-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button
          variant={isSelected ? 'default' : 'outline'}
          className="w-full"
          onClick={e => { e.stopPropagation(); onSelect() }}
        >
          {isSelected ? <><Check className="w-4 h-4" /> Selected</> : 'Select This Plan'}
        </Button>
      </CardContent>
    </Card>
  )
}

// Vision Plan Card
function VisionPlanCard({
  plan,
  isSelected,
  coverageTier,
  onSelect,
}: {
  plan: VisionPlan
  isSelected: boolean
  coverageTier: CoverageTier
  onSelect: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const premium = getPremiumForTier(plan, coverageTier)

  return (
    <Card className={cn(
      'relative transition-all duration-200 cursor-pointer hover:shadow-lg',
      isSelected ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/10' : 'hover:border-slate-300'
    )} onClick={onSelect}>
      {plan.isRecommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <Badge className="gap-1 bg-blue-600 text-white border-0 shadow-md px-3">
            <Star className="w-3 h-3 fill-current" /> Recommended
          </Badge>
        </div>
      )}

      <CardHeader className="pb-3 pt-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {isSelected && <Badge variant="default" className="text-xs gap-1"><Check className="w-3 h-3" /> Selected</Badge>}
            </div>
            <CardTitle className="text-base leading-tight">{plan.name}</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">{plan.carrier}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-2xl font-bold text-foreground">{formatCurrency(premium)}</p>
            <p className="text-xs text-muted-foreground">/month</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <PlanStat label="Exam Copay" value={plan.examCopay === 0 ? '$0' : `$${plan.examCopay}`} />
          <PlanStat label="Frame Allow." value={formatCurrency(plan.frameAllowance)} />
          <PlanStat label="Contact Allow." value={formatCurrency(plan.contactAllowance)} />
        </div>

        <button
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors w-full text-left"
          onClick={e => { e.stopPropagation(); setExpanded(v => !v) }}
        >
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          {expanded ? 'Hide' : 'Show'} plan details
        </button>

        {expanded && (
          <div className="pt-1 space-y-3">
            <Separator />
            <PlanStat label="Lens Coverage" value={plan.lensCoinsurance} />
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">What's included</p>
              {plan.features.map(f => (
                <div key={f} className="flex items-center gap-2 text-sm mb-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button
          variant={isSelected ? 'default' : 'outline'}
          className="w-full"
          onClick={e => { e.stopPropagation(); onSelect() }}
        >
          {isSelected ? <><Check className="w-4 h-4" /> Selected</> : 'Select This Plan'}
        </Button>
      </CardContent>
    </Card>
  )
}

function PlanStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-muted/60 rounded-lg p-2.5 text-center">
      <p className="text-xs text-muted-foreground leading-tight">{label}</p>
      <p className="text-sm font-semibold mt-0.5">{value}</p>
    </div>
  )
}

export function Step3NewPlans({
  healthPlans,
  dentalPlans,
  visionPlans,
  elections,
  coverageTier,
  onElectionChange,
}: Step3Props) {
  const selectionCount = [elections.health, elections.dental, elections.vision].filter(Boolean).length

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
        <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-blue-800">Select Your 2026 Plans</p>
          <p className="text-sm text-blue-700 mt-0.5">
            Choose a plan for each benefit type. Coverage tier is set to <strong>{coverageTier}</strong> based
            on your dependents. Premiums shown reflect your employee share.
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-sm font-bold text-blue-800">{selectionCount}/3</p>
          <p className="text-xs text-blue-600">selected</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="health">
        <TabsList className="w-full h-12 p-1">
          <TabsTrigger value="health" className="flex-1 gap-2 data-[state=active]:text-rose-600">
            <HeartPulse className="w-4 h-4" />
            Medical
            {elections.health && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
          </TabsTrigger>
          <TabsTrigger value="dental" className="flex-1 gap-2 data-[state=active]:text-sky-600">
            <Smile className="w-4 h-4" />
            Dental
            {elections.dental && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
          </TabsTrigger>
          <TabsTrigger value="vision" className="flex-1 gap-2 data-[state=active]:text-violet-600">
            <Eye className="w-4 h-4" />
            Vision
            {elections.vision && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="health" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3">
            {healthPlans.map(plan => (
              <HealthPlanCard
                key={plan.id}
                plan={plan}
                isSelected={elections.health === plan.id}
                coverageTier={coverageTier}
                onSelect={() => onElectionChange('health', plan.id)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="dental" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-3">
            {dentalPlans.map(plan => (
              <DentalPlanCard
                key={plan.id}
                plan={plan}
                isSelected={elections.dental === plan.id}
                coverageTier={coverageTier}
                onSelect={() => onElectionChange('dental', plan.id)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="vision" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-3">
            {visionPlans.map(plan => (
              <VisionPlanCard
                key={plan.id}
                plan={plan}
                isSelected={elections.vision === plan.id}
                coverageTier={coverageTier}
                onSelect={() => onElectionChange('vision', plan.id)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
