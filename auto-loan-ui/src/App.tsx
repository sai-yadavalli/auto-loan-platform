import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import { Authenticator } from '@aws-amplify/ui-react'
import { Car, Shield, Clock, ChevronRight, CheckCircle } from 'lucide-react'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { LoginPage } from '@/pages/LoginPage'
import { FormProvider } from '@/context/FormContext'
import ApplyPage from '@/pages/ApplyPage'
import Step1Page from '@/pages/steps/Step1Page'
import Step2Page from '@/pages/steps/Step2Page'
import Step3Page from '@/pages/steps/Step3Page'
import Step4Page from '@/pages/steps/Step4Page'
import Step5Page from '@/pages/steps/Step5Page'

function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-100 bg-white/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-sm">
              <Car className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg tracking-tight">AutoLoan</span>
          </div>
          <Link
            to="/apply/step-1"
            className="bg-primary-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-primary-700 transition-colors duration-150 shadow-sm"
          >
            Apply Now
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-950 via-primary-800 to-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-6 py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-primary-100 text-sm font-medium px-4 py-2 rounded-full mb-8 border border-white/10">
            <CheckCircle className="w-4 h-4" />
            Secure &middot; Fast &middot; 100% Online
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
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

      {/* CTA Banner */}
      <section className="py-16 px-6 bg-primary-600">
        <div className="max-w-2xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-primary-100 mb-8 text-lg">
            Join thousands of borrowers who've secured their vehicle financing online.
          </p>
          <Link
            to="/apply/step-1"
            className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-8 py-4 rounded-xl hover:bg-primary-50 transition-colors duration-150 text-lg shadow-xl"
          >
            Apply Now — It&apos;s Free
            <ChevronRight className="w-5 h-5" />
          </Link>
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
    // Authenticator.Provider makes useAuthenticator available throughout the entire tree,
    // including ProtectedRoute and Navbar (which live outside <Authenticator>)
    <Authenticator.Provider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
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
  )
}
