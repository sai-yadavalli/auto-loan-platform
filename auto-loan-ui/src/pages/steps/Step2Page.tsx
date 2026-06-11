import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Car } from 'lucide-react'
import { useFormContext } from '@/context/FormContext'
import { vehicleDetailsSchema, type VehicleDetailsSchema } from '@/lib/validators'

const CURRENT_YEAR = new Date().getFullYear()

const inputClass =
  'w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'

export default function Step2Page() {
  const { formData, setVehicleDetails } = useFormContext()
  const navigate = useNavigate()

  const v = formData.vehicleDetails

  const {
    control,
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<VehicleDetailsSchema>({
    resolver: zodResolver(vehicleDetailsSchema),
    defaultValues: {
      vin: v.vin,
      make: v.make,
      model: v.model,
      year: v.year !== '' ? v.year : undefined,
      mileage: v.mileage !== '' ? v.mileage : undefined,
      purchasePrice: v.purchasePrice !== '' ? v.purchasePrice : undefined,
      isDealer: v.isDealer,
    },
  })

  function onSubmit(data: VehicleDetailsSchema) {
    setVehicleDetails(data)
    navigate('/apply/step-3')
  }

  function handleBack() {
    const vals = getValues()
    setVehicleDetails({
      vin: vals.vin ?? '',
      make: vals.make ?? '',
      model: vals.model ?? '',
      year: Number.isFinite(vals.year) ? vals.year : '',
      mileage: Number.isFinite(vals.mileage) ? vals.mileage : '',
      purchasePrice: Number.isFinite(vals.purchasePrice) ? vals.purchasePrice : '',
      isDealer: vals.isDealer ?? false,
    })
    navigate('/apply/step-1')
  }

  return (
    <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-5 sm:p-8">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
          <Car className="w-4 h-4 text-primary-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Vehicle Details</h2>
      </div>
      <p className="text-sm text-gray-500 mb-8">Tell us about the vehicle you're financing.</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
        {/* VIN */}
        <div>
          <label htmlFor="vin" className="block text-sm font-medium text-gray-700 mb-1.5">
            VIN <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-400 mb-2">17-character Vehicle Identification Number</p>
          <Controller
            name="vin"
            control={control}
            render={({ field }) => (
              <input
                id="vin"
                type="text"
                maxLength={17}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                onBlur={field.onBlur}
                placeholder="e.g. 1HGBH41JXMN109186"
                aria-invalid={!!errors.vin}
                aria-describedby={errors.vin ? 'vin-error' : undefined}
                className={`${inputClass} font-mono tracking-widest`}
              />
            )}
          />
          {errors.vin && <p id="vin-error" className="mt-1.5 text-sm text-red-600">{errors.vin.message}</p>}
        </div>

        {/* Make / Model */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-1.5">
              Make <span className="text-red-500">*</span>
            </label>
            <input
              id="make"
              type="text"
              {...register('make')}
              aria-invalid={!!errors.make}
              aria-describedby={errors.make ? 'make-error' : undefined}
              placeholder="e.g. Toyota"
              className={inputClass}
            />
            {errors.make && <p id="make-error" className="mt-1.5 text-sm text-red-600">{errors.make.message}</p>}
          </div>
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1.5">
              Model <span className="text-red-500">*</span>
            </label>
            <input
              id="model"
              type="text"
              {...register('model')}
              aria-invalid={!!errors.model}
              aria-describedby={errors.model ? 'model-error' : undefined}
              placeholder="e.g. Camry"
              className={inputClass}
            />
            {errors.model && <p id="model-error" className="mt-1.5 text-sm text-red-600">{errors.model.message}</p>}
          </div>
        </div>

        {/* Year / Mileage */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1.5">
              Year <span className="text-red-500">*</span>
            </label>
            <input
              id="year"
              type="number"
              min={1900}
              max={CURRENT_YEAR + 1}
              {...register('year', { valueAsNumber: true })}
              aria-invalid={!!errors.year}
              aria-describedby={errors.year ? 'year-error' : undefined}
              placeholder={String(CURRENT_YEAR)}
              className={inputClass}
            />
            {errors.year && <p id="year-error" className="mt-1.5 text-sm text-red-600">{errors.year.message}</p>}
          </div>
          <div>
            <label htmlFor="mileage" className="block text-sm font-medium text-gray-700 mb-1.5">
              Mileage <span className="text-red-500">*</span>
            </label>
            <input
              id="mileage"
              type="number"
              min={0}
              {...register('mileage', { valueAsNumber: true })}
              aria-invalid={!!errors.mileage}
              aria-describedby={errors.mileage ? 'mileage-error' : undefined}
              placeholder="e.g. 12000"
              className={inputClass}
            />
            {errors.mileage && <p id="mileage-error" className="mt-1.5 text-sm text-red-600">{errors.mileage.message}</p>}
          </div>
        </div>

        {/* Purchase Price */}
        <div>
          <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700 mb-1.5">
            Purchase Price <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
            <input
              id="purchasePrice"
              type="number"
              min={1}
              {...register('purchasePrice', { valueAsNumber: true })}
              aria-invalid={!!errors.purchasePrice}
              aria-describedby={errors.purchasePrice ? 'purchasePrice-error' : undefined}
              placeholder="Enter purchase price"
              className={`${inputClass} pl-7`}
            />
          </div>
          {errors.purchasePrice && (
            <p id="purchasePrice-error" className="mt-1.5 text-sm text-red-600">{errors.purchasePrice.message}</p>
          )}
        </div>

        {/* Dealer indicator */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Buying from <span className="text-red-500">*</span>
          </label>
          <Controller
            name="isDealer"
            control={control}
            render={({ field }) => (
              <div className="flex gap-3" role="group" aria-label="Seller type">
                {([
                  { label: 'Dealership', value: true },
                  { label: 'Private Party', value: false },
                ] as const).map((opt) => (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => field.onChange(opt.value)}
                    aria-pressed={field.value === opt.value}
                    className={`px-5 py-2.5 rounded-lg border text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 ${
                      field.value === opt.value
                        ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400 hover:text-primary-600'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          />
          {errors.isDealer && (
            <p className="mt-1.5 text-sm text-red-600">{errors.isDealer.message}</p>
          )}
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
            Next: Personal Details →
          </button>
        </div>
      </form>
    </div>
  )
}
