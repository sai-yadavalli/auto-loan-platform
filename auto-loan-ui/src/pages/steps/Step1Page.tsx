import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useFormContext } from '@/context/FormContext'
import { loanDetailsSchema, type LoanDetailsSchema } from '@/lib/validators'

const TERM_OPTIONS = [12, 24, 36, 48, 60, 72] as const

function ToggleGroup<T extends string>({
  options,
  value,
  onChange,
  error,
}: {
  options: { label: string; value: T }[]
  value: T | ''
  onChange: (v: T) => void
  error?: string
}) {
  return (
    <div>
      <div className="flex gap-3 flex-wrap">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`px-5 py-2.5 rounded-lg border text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 ${
              value === opt.value
                ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400 hover:text-primary-600'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  )
}

export default function Step1Page() {
  const { formData, setLoanDetails } = useFormContext()
  const navigate = useNavigate()

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LoanDetailsSchema>({
    resolver: zodResolver(loanDetailsSchema),
    defaultValues: {
      loanType: formData.loanDetails.loanType || undefined,
      vehicleType: formData.loanDetails.vehicleType || undefined,
      amount: formData.loanDetails.amount || undefined,
      term: formData.loanDetails.term || undefined,
    },
  })

  const amountValue = watch('amount')

  // Keep slider and number input in sync when typing in the input
  useEffect(() => {}, [amountValue])

  function onSubmit(data: LoanDetailsSchema) {
    setLoanDetails(data)
    navigate('/apply/step-2')
  }

  return (
    <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Loan Details</h2>
      <p className="text-sm text-gray-500 mb-8">Tell us about the loan you're looking for.</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
        {/* Loan Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Loan Type <span className="text-red-500">*</span>
          </label>
          <Controller
            name="loanType"
            control={control}
            render={({ field }) => (
              <ToggleGroup
                options={[
                  { label: 'Purchase', value: 'purchase' },
                  { label: 'Refinance', value: 'refinance' },
                ]}
                value={field.value ?? ''}
                onChange={field.onChange}
                error={errors.loanType?.message}
              />
            )}
          />
        </div>

        {/* Vehicle Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Vehicle Type <span className="text-red-500">*</span>
          </label>
          <Controller
            name="vehicleType"
            control={control}
            render={({ field }) => (
              <ToggleGroup
                options={[
                  { label: 'New', value: 'new' },
                  { label: 'Used', value: 'used' },
                ]}
                value={field.value ?? ''}
                onChange={field.onChange}
                error={errors.vehicleType?.message}
              />
            )}
          />
        </div>

        {/* Loan Amount */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label htmlFor="amount" className="text-sm font-medium text-gray-700">
              Loan Amount <span className="text-red-500">*</span>
            </label>
            <span className="text-sm font-semibold text-primary-700 bg-primary-50 px-3 py-1 rounded-full">
              {amountValue
                ? `$${Number(amountValue).toLocaleString()}`
                : '$—'}
            </span>
          </div>

          {/* Slider */}
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <input
                type="range"
                min={1000}
                max={250000}
                step={1000}
                value={field.value ?? 1000}
                onChange={(e) => {
                  field.onChange(Number(e.target.value))
                  setValue('amount', Number(e.target.value))
                }}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600 mb-3"
              />
            )}
          />

          <div className="flex justify-between text-xs text-gray-400 mb-4">
            <span>$1,000</span>
            <span>$250,000</span>
          </div>

          {/* Manual input */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
            <input
              id="amount"
              type="number"
              min={1000}
              max={250000}
              step={1000}
              {...register('amount', { valueAsNumber: true })}
              placeholder="Enter amount"
              className="w-full pl-7 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          {errors.amount && (
            <p className="mt-1.5 text-sm text-red-600">{errors.amount.message}</p>
          )}
        </div>

        {/* Loan Term */}
        <div>
          <label htmlFor="term" className="block text-sm font-medium text-gray-700 mb-3">
            Loan Term <span className="text-red-500">*</span>
          </label>
          <select
            id="term"
            {...register('term', { valueAsNumber: true })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
          >
            <option value="">Select a term</option>
            {TERM_OPTIONS.map((months) => (
              <option key={months} value={months}>
                {months} months ({(months / 12).toFixed(months % 12 === 0 ? 0 : 1)} yr
                {months !== 12 ? 's' : ''})
              </option>
            ))}
          </select>
          {errors.term && (
            <p className="mt-1.5 text-sm text-red-600">{errors.term.message}</p>
          )}
        </div>

        {/* Next */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="bg-primary-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-primary-700 active:scale-95 transition-all duration-150 shadow-sm text-sm"
          >
            Next: Vehicle Info →
          </button>
        </div>
      </form>
    </div>
  )
}
