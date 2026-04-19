export interface Address {
  street: string
  city: string
  state: string
  zip: string
}

export interface Employee {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: string
  age: number
  email: string
  employeeId: string
  department: string
  jobTitle: string
  address: Address
  isSmoker: boolean
  hireDate: string
  enrollmentPeriod: string
}

export type RelationshipType = 'Spouse' | 'Domestic Partner' | 'Child'

export interface Dependent {
  id: string
  firstName: string
  lastName: string
  relationship: RelationshipType
  dateOfBirth: string
  age: number
  isSmoker: boolean
}

export type PlanType = 'health' | 'dental' | 'vision'
export type CoverageTier = 'Employee Only' | 'Employee + Spouse' | 'Employee + Children' | 'Family'

export interface PlanPremium {
  employeeOnly: number
  employeeSpouse: number
  employeeChildren: number
  family: number
}

export interface HealthPlan {
  id: string
  type: 'health'
  name: string
  carrier: string
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum'
  network: string
  monthlyPremium: PlanPremium
  deductible: { individual: number; family: number }
  oopMax: { individual: number; family: number }
  coinsurance: number
  features: string[]
  isRecommended?: boolean
  hsa?: boolean
}

export interface DentalPlan {
  id: string
  type: 'dental'
  name: string
  carrier: string
  monthlyPremium: PlanPremium
  annualMaximum: number
  deductible: { individual: number; family: number }
  preventive: string
  basic: string
  major: string
  orthodontia?: string
  features: string[]
  isRecommended?: boolean
}

export interface VisionPlan {
  id: string
  type: 'vision'
  name: string
  carrier: string
  monthlyPremium: PlanPremium
  examCopay: number
  frameAllowance: number
  lensCoinsurance: string
  contactAllowance: number
  features: string[]
  isRecommended?: boolean
}

export type Plan = HealthPlan | DentalPlan | VisionPlan

export interface CurrentElection {
  planType: PlanType
  planId: string
  planName: string
  carrier: string
  coverageTier: CoverageTier
  effectiveDate: string
  monthlyPremium: number
  annualPremium: number
}

export interface NewElections {
  health: string | null
  dental: string | null
  vision: string | null
}

export interface EnrollmentState {
  employee: Employee
  dependents: Dependent[]
  currentElections: CurrentElection[]
  newElections: NewElections
  coverageTier: CoverageTier
  currentStep: number
}
