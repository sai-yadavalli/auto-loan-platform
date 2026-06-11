import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { User } from 'lucide-react'
import { useFormContext } from '@/context/FormContext'
import { personalDetailsSchema, type PersonalDetailsSchema } from '@/lib/validators'

const US_STATES = [
  ['AL', 'Alabama'], ['AK', 'Alaska'], ['AZ', 'Arizona'], ['AR', 'Arkansas'],
  ['CA', 'California'], ['CO', 'Colorado'], ['CT', 'Connecticut'], ['DE', 'Delaware'],
  ['DC', 'District of Columbia'], ['FL', 'Florida'], ['GA', 'Georgia'], ['HI', 'Hawaii'],
  ['ID', 'Idaho'], ['IL', 'Illinois'], ['IN', 'Indiana'], ['IA', 'Iowa'],
  ['KS', 'Kansas'], ['KY', 'Kentucky'], ['LA', 'Louisiana'], ['ME', 'Maine'],
  ['MD', 'Maryland'], ['MA', 'Massachusetts'], ['MI', 'Michigan'], ['MN', 'Minnesota'],
  ['MS', 'Mississippi'], ['MO', 'Missouri'], ['MT', 'Montana'], ['NE', 'Nebraska'],
  ['NV', 'Nevada'], ['NH', 'New Hampshire'], ['NJ', 'New Jersey'], ['NM', 'New Mexico'],
  ['NY', 'New York'], ['NC', 'North Carolina'], ['ND', 'North Dakota'], ['OH', 'Ohio'],
  ['OK', 'Oklahoma'], ['OR', 'Oregon'], ['PA', 'Pennsylvania'], ['RI', 'Rhode Island'],
  ['SC', 'South Carolina'], ['SD', 'South Dakota'], ['TN', 'Tennessee'], ['TX', 'Texas'],
  ['UT', 'Utah'], ['VT', 'Vermont'], ['VA', 'Virginia'], ['WA', 'Washington'],
  ['WV', 'West Virginia'], ['WI', 'Wisconsin'], ['WY', 'Wyoming'],
] as const

const MAX_DOB = (() => {
  const d = new Date()
  d.setFullYear(d.getFullYear() - 18)
  return d.toISOString().split('T')[0]
})()

function formatSsn(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 9)
  if (digits.length <= 3) return digits
  if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'

function SsnInput({
  value,
  onChange,
  onBlur,
  hasError,
}: {
  value: string
  onChange: (v: string) => void
  onBlur: () => void
  hasError?: boolean
}) {
  const [focused, setFocused] = useState(false)

  const displayValue =
    !focused && /^\d{3}-\d{2}-\d{4}$/.test(value)
      ? `***-**-${value.slice(-4)}`
      : value

  return (
    <input
      type="text"
      inputMode="numeric"
      value={displayValue}
      onChange={(e) => onChange(formatSsn(e.target.value))}
      onFocus={() => setFocused(true)}
      onBlur={() => { setFocused(false); onBlur() }}
      placeholder="XXX-XX-XXXX"
      autoComplete="off"
      maxLength={11}
      aria-invalid={hasError}
      aria-describedby={hasError ? 'ssn-error' : undefined}
      className={inputClass}
    />
  )
}

export default function Step3Page() {
  const { formData, setPersonalDetails } = useFormContext()
  const navigate = useNavigate()

  const p = formData.personalDetails

  const {
    control,
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<PersonalDetailsSchema>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: {
      firstName: p.firstName,
      lastName: p.lastName,
      dob: p.dob,
      ssn: p.ssn,
      address: p.address,
      city: p.city,
      state: p.state,
      zip: p.zip,
      employmentStatus:
        (p.employmentStatus as PersonalDetailsSchema['employmentStatus']) || undefined,
      annualIncome: p.annualIncome !== '' ? p.annualIncome : undefined,
    },
  })

  function onSubmit(data: PersonalDetailsSchema) {
    setPersonalDetails(data)
    navigate('/apply/step-4')
  }

  function handleBack() {
    const vals = getValues()
    setPersonalDetails({
      firstName: vals.firstName ?? '',
      lastName: vals.lastName ?? '',
      dob: vals.dob ?? '',
      ssn: vals.ssn ?? '',
      address: vals.address ?? '',
      city: vals.city ?? '',
      state: vals.state ?? '',
      zip: vals.zip ?? '',
      employmentStatus: vals.employmentStatus ?? '',
      annualIncome: Number.isFinite(vals.annualIncome) ? vals.annualIncome : '',
    })
    navigate('/apply/step-2')
  }

  return (
    <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-5 sm:p-8">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
          <User className="w-4 h-4 text-primary-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Personal Details</h2>
      </div>
      <p className="text-sm text-gray-500 mb-8">Tell us a bit about yourself.</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">

        {/* ── Personal Information ── */}
        <div className="space-y-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Personal Information
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1.5">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                id="firstName"
                type="text"
                {...register('firstName')}
                aria-invalid={!!errors.firstName}
                aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                placeholder="Jane"
                className={inputClass}
              />
              {errors.firstName && (
                <p id="firstName-error" className="mt-1.5 text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1.5">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                id="lastName"
                type="text"
                {...register('lastName')}
                aria-invalid={!!errors.lastName}
                aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                placeholder="Smith"
                className={inputClass}
              />
              {errors.lastName && (
                <p id="lastName-error" className="mt-1.5 text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1.5">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                id="dob"
                type="date"
                max={MAX_DOB}
                {...register('dob')}
                aria-invalid={!!errors.dob}
                aria-describedby={errors.dob ? 'dob-error' : undefined}
                className={inputClass}
              />
              {errors.dob && (
                <p id="dob-error" className="mt-1.5 text-sm text-red-600">{errors.dob.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="ssn" className="block text-sm font-medium text-gray-700 mb-1.5">
                Social Security Number <span className="text-red-500">*</span>
              </label>
              <Controller
                name="ssn"
                control={control}
                render={({ field }) => (
                  <SsnInput
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    hasError={!!errors.ssn}
                  />
                )}
              />
              {errors.ssn && (
                <p id="ssn-error" className="mt-1.5 text-sm text-red-600">{errors.ssn.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* ── Home Address ── */}
        <div className="space-y-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Home Address
          </p>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1.5">
              Street Address <span className="text-red-500">*</span>
            </label>
            <input
              id="address"
              type="text"
              {...register('address')}
              aria-invalid={!!errors.address}
              aria-describedby={errors.address ? 'address-error' : undefined}
              placeholder="123 Main St"
              className={inputClass}
            />
            {errors.address && (
              <p id="address-error" className="mt-1.5 text-sm text-red-600">{errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1.5">
                City <span className="text-red-500">*</span>
              </label>
              <input
                id="city"
                type="text"
                {...register('city')}
                aria-invalid={!!errors.city}
                aria-describedby={errors.city ? 'city-error' : undefined}
                placeholder="Austin"
                className={inputClass}
              />
              {errors.city && (
                <p id="city-error" className="mt-1.5 text-sm text-red-600">{errors.city.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1.5">
                State <span className="text-red-500">*</span>
              </label>
              <select
                id="state"
                {...register('state')}
                aria-invalid={!!errors.state}
                aria-describedby={errors.state ? 'state-error' : undefined}
                className={`${inputClass} bg-white`}
              >
                <option value="">Select</option>
                {US_STATES.map(([abbr, name]) => (
                  <option key={abbr} value={abbr}>{name}</option>
                ))}
              </select>
              {errors.state && (
                <p id="state-error" className="mt-1.5 text-sm text-red-600">{errors.state.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1.5">
                ZIP Code <span className="text-red-500">*</span>
              </label>
              <input
                id="zip"
                type="text"
                maxLength={10}
                {...register('zip')}
                aria-invalid={!!errors.zip}
                aria-describedby={errors.zip ? 'zip-error' : undefined}
                placeholder="78701"
                className={inputClass}
              />
              {errors.zip && (
                <p id="zip-error" className="mt-1.5 text-sm text-red-600">{errors.zip.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* ── Employment ── */}
        <div className="space-y-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Employment
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="employmentStatus" className="block text-sm font-medium text-gray-700 mb-1.5">
                Employment Status <span className="text-red-500">*</span>
              </label>
              <select
                id="employmentStatus"
                {...register('employmentStatus')}
                aria-invalid={!!errors.employmentStatus}
                aria-describedby={errors.employmentStatus ? 'employmentStatus-error' : undefined}
                className={`${inputClass} bg-white`}
              >
                <option value="">Select status</option>
                <option value="employed">Employed</option>
                <option value="self-employed">Self-Employed</option>
                <option value="unemployed">Unemployed</option>
                <option value="retired">Retired</option>
                <option value="student">Student</option>
              </select>
              {errors.employmentStatus && (
                <p id="employmentStatus-error" className="mt-1.5 text-sm text-red-600">{errors.employmentStatus.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="annualIncome" className="block text-sm font-medium text-gray-700 mb-1.5">
                Annual Income <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                  $
                </span>
                <input
                  id="annualIncome"
                  type="number"
                  min={1}
                  {...register('annualIncome', { valueAsNumber: true })}
                  aria-invalid={!!errors.annualIncome}
                  aria-describedby={errors.annualIncome ? 'annualIncome-error' : undefined}
                  placeholder="e.g. 75000"
                  className={`${inputClass} pl-7`}
                />
              </div>
              {errors.annualIncome && (
                <p id="annualIncome-error" className="mt-1.5 text-sm text-red-600">{errors.annualIncome.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-2">
          <button
            type="button"
            onClick={handleBack}
            className="text-sm font-semibold text-gray-600 px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 active:scale-95 transition-all duration-150"
          >
            ← Back
          </button>
          <button
            type="submit"
            className="bg-primary-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-primary-700 active:scale-95 transition-all duration-150 shadow-sm text-sm"
          >
            Next: Upload Documents →
          </button>
        </div>
      </form>
    </div>
  )
}
