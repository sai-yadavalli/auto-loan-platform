import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle2, ClipboardList } from 'lucide-react'
import { fetchAuthSession } from 'aws-amplify/auth'
import { useFormContext } from '@/context/FormContext'
import { clearFormPersistence } from '@/hooks/useFormPersist'

const API_BASE = import.meta.env.VITE_API_BASE_URL

async function getAuthHeaders(): Promise<Record<string, string>> {
  const session = await fetchAuthSession()
  const token = session.tokens?.accessToken?.toString()
  if (!token) throw new Error('Not authenticated')
  return { Authorization: `Bearer ${token}` }
}

function fmt(val: string): string {
  return val.charAt(0).toUpperCase() + val.slice(1).replace(/-/g, ' ')
}

function fmtCurrency(val: number): string {
  return `$${val.toLocaleString()}`
}

function ReviewSection({
  title,
  editPath,
  children,
}: {
  title: string
  editPath: string
  children: ReactNode
}) {
  return (
    <div className="rounded-xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <Link
          to={editPath}
          className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
        >
          Edit
        </Link>
      </div>
      {children}
    </div>
  )
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start py-2 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-xs font-medium text-gray-800 text-right max-w-[55%]">{value}</span>
    </div>
  )
}

export default function Step5Page() {
  const { formData, resetForm } = useFormContext()
  const navigate = useNavigate()
  const { loanDetails: ld, vehicleDetails: vd, personalDetails: pd } = formData

  const [consent, setConsent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [applicationId, setApplicationId] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  async function handleSubmit() {
    if (!consent || submitting) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const authHeaders = await getAuthHeaders()
      const res = await fetch(`${API_BASE}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({ loanDetails: ld, vehicleDetails: vd, personalDetails: pd }),
      })
      if (!res.ok) throw new Error('Submission failed')
      const data = await res.json()
      clearFormPersistence()
      resetForm()
      setApplicationId(data.applicationId)
    } catch {
      setSubmitError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (applicationId) {
    return (
      <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6 sm:p-8 text-center">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
        <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
          Your application has been received and is under review.
        </p>
        <div className="inline-block bg-gray-50 border border-gray-200 rounded-xl px-6 py-3 mb-8">
          <p className="text-xs text-gray-500 mb-0.5">Application ID</p>
          <p className="text-sm font-mono font-semibold text-gray-900 tracking-wide">
            {applicationId}
          </p>
        </div>
        <div className="text-left bg-primary-50 rounded-xl p-5 mb-8 max-w-sm mx-auto">
          <p className="text-xs font-semibold text-primary-700 uppercase tracking-widest mb-3">
            What happens next
          </p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-2">
              <span className="text-primary-500 shrink-0">·</span>
              We'll review your application within 1–2 business days
            </li>
            <li className="flex gap-2">
              <span className="text-primary-500 shrink-0">·</span>
              You'll receive an email with your decision
            </li>
            <li className="flex gap-2">
              <span className="text-primary-500 shrink-0">·</span>
              If approved, a loan officer will reach out to finalize terms
            </li>
          </ul>
        </div>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="bg-primary-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-primary-700 transition-colors text-sm shadow-sm"
        >
          Return to Home
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-5 sm:p-8">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
          <ClipboardList className="w-4 h-4 text-primary-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Review & Submit</h2>
      </div>
      <p className="text-sm text-gray-500 mb-8">
        Please review your application before submitting.
      </p>

      <div className="space-y-4">
        <ReviewSection title="Loan Details" editPath="/apply/step-1">
          <ReviewRow label="Loan Type" value={ld.loanType ? fmt(ld.loanType) : '—'} />
          <ReviewRow label="Vehicle Type" value={ld.vehicleType ? fmt(ld.vehicleType) : '—'} />
          <ReviewRow
            label="Amount"
            value={ld.amount !== '' ? fmtCurrency(ld.amount) : '—'}
          />
          <ReviewRow
            label="Term"
            value={ld.term !== '' ? `${ld.term} months` : '—'}
          />
        </ReviewSection>

        <ReviewSection title="Vehicle Details" editPath="/apply/step-2">
          <ReviewRow label="VIN" value={vd.vin || '—'} />
          <ReviewRow
            label="Make / Model"
            value={vd.make && vd.model ? `${vd.make} ${vd.model}` : '—'}
          />
          <ReviewRow label="Year" value={vd.year !== '' ? String(vd.year) : '—'} />
          <ReviewRow
            label="Mileage"
            value={vd.mileage !== '' ? `${Number(vd.mileage).toLocaleString()} mi` : '—'}
          />
          <ReviewRow
            label="Purchase Price"
            value={vd.purchasePrice !== '' ? fmtCurrency(Number(vd.purchasePrice)) : '—'}
          />
          <ReviewRow label="Seller" value={vd.isDealer ? 'Dealership' : 'Private Party'} />
        </ReviewSection>

        <ReviewSection title="Personal Details" editPath="/apply/step-3">
          <ReviewRow
            label="Name"
            value={
              pd.firstName && pd.lastName ? `${pd.firstName} ${pd.lastName}` : '—'
            }
          />
          <ReviewRow label="Date of Birth" value={pd.dob || '—'} />
          <ReviewRow
            label="SSN"
            value={pd.ssn ? `***-**-${pd.ssn.slice(-4)}` : '—'}
          />
          <ReviewRow
            label="Address"
            value={
              pd.address
                ? `${pd.address}, ${pd.city}, ${pd.state} ${pd.zip}`
                : '—'
            }
          />
          <ReviewRow
            label="Employment"
            value={pd.employmentStatus ? fmt(pd.employmentStatus) : '—'}
          />
          <ReviewRow
            label="Annual Income"
            value={pd.annualIncome !== '' ? fmtCurrency(Number(pd.annualIncome)) : '—'}
          />
        </ReviewSection>
      </div>

      <label className="flex items-start gap-3 mt-6 cursor-pointer group">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
        />
        <span className="text-sm text-gray-600 leading-snug group-hover:text-gray-900 transition-colors">
          I certify that the information provided is accurate and complete. I authorize the
          lender to verify my information and perform a credit inquiry.
        </span>
      </label>

      {submitError && (
        <p className="mt-3 text-sm text-red-600">{submitError}</p>
      )}

      <div className="flex justify-between items-center pt-6">
        <button
          type="button"
          onClick={() => navigate('/apply/step-4')}
          className="text-sm font-semibold text-gray-600 px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 active:scale-95 transition-all duration-150"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!consent || submitting}
          className="bg-primary-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-primary-700 active:scale-95 transition-all duration-150 shadow-sm text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center gap-2"
        >
          {submitting && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {submitting ? 'Submitting…' : 'Submit Application'}
        </button>
      </div>
    </div>
  )
}
