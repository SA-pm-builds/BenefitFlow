import { useState } from 'react'
import { Plus, Pencil, Trash2, User, MapPin, Briefcase, Users, AlertCircle, Baby, Heart } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import type { Employee, Dependent, RelationshipType } from '@/types'

interface Step1Props {
  employee: Employee
  dependents: Dependent[]
  onDependentsChange: (dependents: Dependent[]) => void
}

const relationshipIcons: Record<RelationshipType, React.ComponentType<{ className?: string }>> = {
  Spouse: Heart,
  'Domestic Partner': Heart,
  Child: Baby,
}

function getAge(dob: string): number {
  const birth = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const emptyDependent = {
  firstName: '',
  lastName: '',
  relationship: '' as RelationshipType,
  dateOfBirth: '',
  isSmoker: false,
}

export function Step1PersonalDetails({ employee, dependents, onDependentsChange }: Step1Props) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyDependent)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function openAdd() {
    setForm(emptyDependent)
    setEditingId(null)
    setErrors({})
    setDialogOpen(true)
  }

  function openEdit(dep: Dependent) {
    setForm({
      firstName: dep.firstName,
      lastName: dep.lastName,
      relationship: dep.relationship,
      dateOfBirth: dep.dateOfBirth,
      isSmoker: dep.isSmoker,
    })
    setEditingId(dep.id)
    setErrors({})
    setDialogOpen(true)
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!form.firstName.trim()) e.firstName = 'First name is required'
    if (!form.lastName.trim()) e.lastName = 'Last name is required'
    if (!form.relationship) e.relationship = 'Relationship is required'
    if (!form.dateOfBirth) e.dateOfBirth = 'Date of birth is required'
    else if (new Date(form.dateOfBirth) > new Date()) e.dateOfBirth = 'Date cannot be in the future'
    return e
  }

  function handleSave() {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }

    const age = getAge(form.dateOfBirth)
    if (editingId) {
      onDependentsChange(
        dependents.map(d =>
          d.id === editingId ? { ...d, ...form, age } : d
        )
      )
    } else {
      const newDep: Dependent = {
        id: `dep-${Date.now()}`,
        ...form,
        age,
      }
      onDependentsChange([...dependents, newDep])
    }
    setDialogOpen(false)
  }

  function handleDelete(id: string) {
    onDependentsChange(dependents.filter(d => d.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Employee Info */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-base">Personal Information</CardTitle>
              <CardDescription>Review your details on file. Contact HR to make changes.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Name & ID */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InfoField label="First Name" value={employee.firstName} />
            <InfoField label="Last Name" value={employee.lastName} />
            <InfoField label="Employee ID" value={employee.employeeId} />
            <InfoField label="Date of Birth" value={formatDate(employee.dateOfBirth)} />
          </div>

          <Separator />

          {/* Work Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Briefcase className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Employment</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <InfoField label="Department" value={employee.department} />
              <InfoField label="Job Title" value={employee.jobTitle} />
              <InfoField label="Hire Date" value={formatDate(employee.hireDate)} />
            </div>
          </div>

          <Separator />

          {/* Address */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Home Address</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="col-span-2">
                <InfoField label="Street" value={employee.address.street} />
              </div>
              <InfoField label="City" value={employee.address.city} />
              <InfoField label="State / ZIP" value={`${employee.address.state} ${employee.address.zip}`} />
            </div>
          </div>

          <Separator />

          {/* Health Factors */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Tobacco / Smoker Status</p>
              <p className="text-xs text-muted-foreground mt-0.5">Affects premium calculation</p>
            </div>
            <Badge variant={employee.isSmoker ? 'warning' : 'success'} className="text-xs">
              {employee.isSmoker ? 'Tobacco User' : 'Non-Tobacco User'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Dependents */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                <Users className="w-4 h-4 text-violet-600" />
              </div>
              <div>
                <CardTitle className="text-base">Dependents</CardTitle>
                <CardDescription>
                  {dependents.length === 0
                    ? 'No dependents on file'
                    : `${dependents.length} dependent${dependents.length > 1 ? 's' : ''} enrolled`}
                </CardDescription>
              </div>
            </div>
            <Button onClick={openAdd} size="sm" className="gap-1.5">
              <Plus className="w-4 h-4" />
              Add Dependent
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {dependents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No dependents added yet.</p>
              <p className="text-xs mt-1">Add a spouse, domestic partner, or children to include them in your coverage.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {dependents.map(dep => {
                const Icon = relationshipIcons[dep.relationship] ?? User
                return (
                  <div
                    key={dep.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border/50 hover:border-border transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center text-sm font-semibold text-muted-foreground">
                        {dep.firstName[0]}{dep.lastName[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold">{dep.firstName} {dep.lastName}</p>
                          <Badge variant="secondary" className="text-xs gap-1">
                            <Icon className="w-3 h-3" />
                            {dep.relationship}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <p className="text-xs text-muted-foreground">
                            DOB: {formatDate(dep.dateOfBirth)} · Age {dep.age}
                          </p>
                          {dep.relationship !== 'Child' && (
                            <Badge variant={dep.isSmoker ? 'warning' : 'success'} className="text-xs">
                              {dep.isSmoker ? 'Tobacco User' : 'Non-Tobacco'}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(dep)}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(dep.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {dependents.length > 0 && (
            <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-blue-50 border border-blue-100">
              <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-700">
                Coverage tier will be automatically calculated based on your dependents. Changes to dependents may affect your monthly premium.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dependent Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Dependent' : 'Add Dependent'}</DialogTitle>
            <DialogDescription>
              Enter the information for your dependent. They will be eligible for enrollment in your chosen plans.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={form.firstName}
                  onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                  placeholder="Jane"
                />
                {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={form.lastName}
                  onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                  placeholder="Chen"
                />
                {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Relationship</Label>
              <Select
                value={form.relationship}
                onValueChange={v => setForm(f => ({ ...f, relationship: v as RelationshipType }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Spouse">Spouse</SelectItem>
                  <SelectItem value="Domestic Partner">Domestic Partner</SelectItem>
                  <SelectItem value="Child">Child</SelectItem>
                </SelectContent>
              </Select>
              {errors.relationship && <p className="text-xs text-destructive">{errors.relationship}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={form.dateOfBirth}
                onChange={e => setForm(f => ({ ...f, dateOfBirth: e.target.value }))}
                max={new Date().toISOString().split('T')[0]}
              />
              {errors.dateOfBirth && <p className="text-xs text-destructive">{errors.dateOfBirth}</p>}
            </div>

            {form.relationship && form.relationship !== 'Child' && (
              <div className="flex items-center gap-2 p-3 rounded-lg border border-border bg-muted/30">
                <Checkbox
                  id="smoker"
                  checked={form.isSmoker}
                  onCheckedChange={v => setForm(f => ({ ...f, isSmoker: Boolean(v) }))}
                />
                <div>
                  <Label htmlFor="smoker" className="cursor-pointer">Tobacco user</Label>
                  <p className="text-xs text-muted-foreground">Check if this dependent uses tobacco products</p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingId ? 'Save Changes' : 'Add Dependent'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="text-sm font-medium mt-0.5">{value}</p>
    </div>
  )
}
