import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import { Authenticator } from '@aws-amplify/ui-react'
import { Car, Shield, Clock, ChevronRight, CheckCircle, TrendingDown, Calculator } from 'lucide-react'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import ErrorBoundary from '@/components/ErrorBoundary'
import { LoginPage } from '@/pages/LoginPage'
import SettingsPage from '@/pages/SettingsPage'
import { FormProvider } from '@/context/FormContext'
import ApplyPage from '@/pages/ApplyPage'
import Step1Page from '@/pages/steps/Step1Page'
import Step2Page from '@/pages/steps/Step2Page'
import Step3Page from '@/pages/steps/Step3Page'
import Step4Page from '@/pages/steps/Step4Page'
import Step5Page from '@/pages/steps/Step5Page'

const APR_RATES = [
  { tier: 'Excellent', range: '760+',     auto: 6.5,  moto: 8.5  },
  { tier: 'Good',      range: '720–759',  auto: 8.5,  moto: 10.5 },
  { tier: 'Fair',      range: '680–719',  auto: 12.0, moto: 14.0 },
  { tier: 'Below Fair',range: '640–679',  auto: 16.0, moto: 18.0 },
  { tier: 'Poor',      range: 'below 640',auto: 20.0, moto: 22.0 },
]

const CREDIT_OPTIONS = [
  { value: 'excellent',  label: 'Excellent (760+)',    aprAuto: 6.5,  aprMoto: 8.5  },
  { value: 'good',       label: 'Good (720–759)',       aprAuto: 8.5,  aprMoto: 10.5 },
  { value: 'fair',       label: 'Fair (680–719)',        aprAuto: 12.0, aprMoto: 14.0 },
  { value: 'below-fair', label: 'Below Fair (640–679)', aprAuto: 16.0, aprMoto: 18.0 },
  { value: 'poor',       label: 'Poor (below 640)',      aprAuto: 20.0, aprMoto: 22.0 },
]

const TERM_OPTS = [12, 24, 36, 48, 60, 72] as const

function getAgeAdj(year: number): number {
  const age = new Date().getFullYear() - year
  if (age <= 1) return 0
  if (age <= 5) return 0.5
  if (age <= 10) return 1.5
  return 3.0
}

function calcMonthlyPayment(principal: number, annualRatePct: number, months: number): number {
  const r = annualRatePct / 100 / 12
  if (r === 0) return principal / months
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
}

function fmtUSD(n: number): string {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function HomePage() {
  const [vehicleType, setVehicleType] = useState<'auto' | 'motorcycle'>('auto')
  const [modelYear, setModelYear] = useState('')
  const [loanAmount, setLoanAmount] = useState('')
  const [loanTerm, setLoanTerm] = useState('')
  const [creditScore, setCreditScore] = useState('')

  const CURRENT_YEAR = new Date().getFullYear()

  const estimate = (() => {
    const year = parseInt(modelYear)
    const amount = parseFloat(loanAmount)
    const term = parseInt(loanTerm)
    const credit = CREDIT_OPTIONS.find((c) => c.value === creditScore)
    if (!credit || !loanTerm || isNaN(year) || isNaN(amount)) return null
    if (amount < 1000 || amount > 250000) return null
    if (year < 1990 || year > CURRENT_YEAR + 1) return null
    const baseApr = vehicleType === 'auto' ? credit.aprAuto : credit.aprMoto
    const apr = baseApr + getAgeAdj(year)
    const monthly = calcMonthlyPayment(amount, apr, term)
    const totalCost = monthly * term
    const totalInterest = totalCost - amount
    return { apr, monthly, totalCost, totalInterest }
  })()

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-100 bg-white/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-sm">
              <Car className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg tracking-tight">AutoLoan</span>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-950 via-primary-800 to-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-6 py-16 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-primary-100 text-sm font-medium px-4 py-2 rounded-full mb-8 border border-white/10">
            <CheckCircle className="w-4 h-4" />
            Secure &middot; Fast &middot; 100% Online
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
            Get the auto loan<br />you deserve
          </h1>
          <p className="text-primary-200 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Apply online in minutes. Upload your documents, review your terms,
            and get a decision — all without leaving home.
          </p>
          <Link
            to="/apply/step-1"
            className="inline-flex items-center gap-2.5 bg-white text-primary-700 font-bold px-8 py-4 rounded-xl shadow-2xl hover:bg-primary-50 active:scale-95 transition-all duration-150 text-lg"
          >
            Start Your Application
            <ChevronRight className="w-5 h-5" />
          </Link>
          <p className="mt-5 text-primary-300 text-sm">No hard credit pull to apply</p>
        </div>
      </section>

      {/* Steps Preview */}
      <section className="py-14 px-6 bg-gray-50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-bold text-primary-600 uppercase tracking-widest mb-10">
            How It Works — 5 Simple Steps
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              'Loan Details',
              'Vehicle Info',
              'Personal Details',
              'Upload Docs',
              'Review & Submit',
            ].map((step, i) => (
              <div key={step} className="flex flex-col items-center text-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-600 text-white text-sm font-bold flex items-center justify-center shadow-md">
                  {i + 1}
                </div>
                <span className="text-xs font-medium text-gray-600 leading-snug">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">Built for borrowers</h2>
          <p className="text-center text-gray-500 mb-14 max-w-xl mx-auto">
            Everything you need to apply confidently — from first click to final confirmation.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Clock,
                title: '5-Minute Application',
                desc: 'Our guided form walks you through every step — no guesswork, no jargon.',
                iconClass: 'bg-blue-50 text-blue-600',
              },
              {
                icon: Shield,
                title: 'Bank-Level Security',
                desc: 'Your documents are encrypted end-to-end and stored securely in the cloud.',
                iconClass: 'bg-emerald-50 text-emerald-600',
              },
              {
                icon: Car,
                title: 'Purchase or Refinance',
                desc: 'New, used, or refinance — we support all loan types with a single application.',
                iconClass: 'bg-violet-50 text-violet-600',
              },
            ].map(({ icon: Icon, title, desc, iconClass }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${iconClass}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APR Rates Section */}
      <section className="py-16 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-primary-100 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Estimated APR Rates</h2>
          </div>
          <p className="text-sm text-gray-500 mb-8 ml-12">
            Rates shown are estimates for new vehicles. Older vehicles may carry slightly higher rates.
          </p>

          <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
            <table className="w-full text-sm bg-white">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Credit Score
                  </th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-primary-600 uppercase tracking-wider">
                    Auto Loan
                  </th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-violet-600 uppercase tracking-wider">
                    Motorcycle Loan
                  </th>
                </tr>
              </thead>
              <tbody>
                {APR_RATES.map((row, i) => (
                  <tr
                    key={row.tier}
                    className={`border-b border-gray-50 last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                  >
                    <td className="px-5 py-3.5">
                      <span className="font-medium text-gray-800">{row.tier}</span>
                      <span className="ml-2 text-xs text-gray-400">{row.range}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold text-primary-700">
                      {row.auto.toFixed(1)}%
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold text-violet-700">
                      {row.moto.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Payment Estimator Section */}
      <section className="py-16 px-6 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-primary-100 rounded-xl flex items-center justify-center">
              <Calculator className="w-5 h-5 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Estimate Your Monthly Payment</h2>
          </div>
          <p className="text-sm text-gray-500 mb-10 ml-12">
            Fill in the details below to get an instant payment estimate.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Estimator form */}
            <div className="space-y-5">
              {/* Vehicle type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What type of vehicle are you looking to buy?
                </label>
                <div className="flex gap-3">
                  {(['auto', 'motorcycle'] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setVehicleType(v)}
                      aria-pressed={vehicleType === v}
                      className={`px-5 py-2.5 rounded-lg border text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 ${
                        vehicleType === v
                          ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400 hover:text-primary-600'
                      }`}
                    >
                      {v === 'auto' ? 'Auto' : 'Motorcycle'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Model year */}
              <div>
                <label htmlFor="est-year" className="block text-sm font-medium text-gray-700 mb-2">
                  What is the model year of the vehicle?
                </label>
                <input
                  id="est-year"
                  type="number"
                  min={1990}
                  max={CURRENT_YEAR + 1}
                  value={modelYear}
                  onChange={(e) => setModelYear(e.target.value)}
                  placeholder={String(CURRENT_YEAR)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Loan amount */}
              <div>
                <label htmlFor="est-amount" className="block text-sm font-medium text-gray-700 mb-2">
                  How much would you like to borrow?
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
                  <input
                    id="est-amount"
                    type="number"
                    min={1000}
                    max={250000}
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    placeholder="e.g. 25000"
                    className="w-full border border-gray-300 rounded-lg pl-7 pr-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Loan term */}
              <div>
                <label htmlFor="est-term" className="block text-sm font-medium text-gray-700 mb-2">
                  In how many months would you like to pay off your loan?
                </label>
                <select
                  id="est-term"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                >
                  <option value="">Select a term</option>
                  {TERM_OPTS.map((m) => (
                    <option key={m} value={m}>
                      {m} months ({(m / 12).toFixed(m % 12 === 0 ? 0 : 1)} yr{m !== 12 ? 's' : ''})
                    </option>
                  ))}
                </select>
              </div>

              {/* Credit score */}
              <div>
                <label htmlFor="est-credit" className="block text-sm font-medium text-gray-700 mb-2">
                  Credit score estimate?
                </label>
                <select
                  id="est-credit"
                  value={creditScore}
                  onChange={(e) => setCreditScore(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                >
                  <option value="">Select your credit tier</option>
                  {CREDIT_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Result */}
            <div>
              {estimate ? (
                <div className="rounded-2xl border border-primary-100 bg-primary-50 p-6">
                  <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-5">
                    Your Estimate
                  </p>
                  <div className="mb-5">
                    <p className="text-xs text-gray-500 mb-1">Estimated Monthly Payment</p>
                    <p className="text-4xl font-bold text-primary-700">
                      ${fmtUSD(estimate.monthly)}
                    </p>
                  </div>
                  <div className="space-y-3 border-t border-primary-100 pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Estimated APR</span>
                      <span className="font-semibold text-gray-900">{estimate.apr.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Interest</span>
                      <span className="font-semibold text-gray-900">${fmtUSD(estimate.totalInterest)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Cost</span>
                      <span className="font-semibold text-gray-900">${fmtUSD(estimate.totalCost)}</span>
                    </div>
                  </div>
                  <p className="mt-4 text-xs text-gray-400 leading-relaxed">
                    This is an estimate only. Actual rates depend on creditworthiness, loan terms, and lender policies.
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4">
                    <Calculator className="w-6 h-6 text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-400 max-w-[200px] leading-relaxed">
                    Fill in all fields to see your estimated monthly payment
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary-600 rounded flex items-center justify-center">
              <Car className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-gray-700 text-sm">AutoLoan Platform</span>
          </div>
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Auto Loan Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <Authenticator.Provider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/apply"
              element={
                <ProtectedRoute>
                  <FormProvider>
                    <ApplyPage />
                  </FormProvider>
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="step-1" replace />} />
              <Route path="step-1" element={<Step1Page />} />
              <Route path="step-2" element={<Step2Page />} />
              <Route path="step-3" element={<Step3Page />} />
              <Route path="step-4" element={<Step4Page />} />
              <Route path="step-5" element={<Step5Page />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </Authenticator.Provider>
    </ErrorBoundary>
  )
}
