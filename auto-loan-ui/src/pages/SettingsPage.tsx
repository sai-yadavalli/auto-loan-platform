import { useState, useEffect, FormEvent } from 'react'
import { useAuthenticator } from '@aws-amplify/ui-react'
import {
  fetchUserAttributes,
  updateUserAttributes,
  confirmUserAttribute,
  updatePassword,
  deleteUser,
} from 'aws-amplify/auth'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { cn } from '@/lib/utils'

// ─── Shared UI primitives ───────────────────────────────────────────────────

function SectionCard({ title, description, children }: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500 mt-0.5">{description}</p>
      </div>
      {children}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  )
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        'w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
        'disabled:bg-gray-50 disabled:text-gray-400',
        props.className,
      )}
    />
  )
}

function SaveButton({ loading, label = 'Save changes' }: { loading: boolean; label?: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="mt-4 px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors duration-150"
    >
      {loading ? 'Saving…' : label}
    </button>
  )
}

function StatusMessage({ type, message }: { type: 'success' | 'error'; message: string }) {
  return (
    <p className={cn('text-sm mt-2', type === 'success' ? 'text-green-600' : 'text-red-600')}>
      {message}
    </p>
  )
}

// ─── Profile section ─────────────────────────────────────────────────────────

function ProfileSection() {
  const [givenName, setGivenName] = useState('')
  const [familyName, setFamilyName] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    fetchUserAttributes().then((attrs) => {
      setGivenName(attrs.given_name ?? '')
      setFamilyName(attrs.family_name ?? '')
    })
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setStatus(null)
    try {
      await updateUserAttributes({
        userAttributes: { given_name: givenName, family_name: familyName },
      })
      setStatus({ type: 'success', message: 'Profile updated.' })
    } catch (err) {
      setStatus({ type: 'error', message: (err as Error).message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <SectionCard title="Profile" description="Update your display name.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="First name">
            <Input
              value={givenName}
              onChange={(e) => setGivenName(e.target.value)}
              placeholder="First name"
              required
            />
          </Field>
          <Field label="Last name">
            <Input
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              placeholder="Last name"
              required
            />
          </Field>
        </div>
        {status && <StatusMessage {...status} />}
        <SaveButton loading={loading} />
      </form>
    </SectionCard>
  )
}

// ─── Contact section ──────────────────────────────────────────────────────────

type ContactField = 'email' | 'phone_number'

function ContactSection() {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [pending, setPending] = useState<ContactField | null>(null)
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    fetchUserAttributes().then((attrs) => {
      setEmail(attrs.email ?? '')
      setPhone(attrs.phone_number ?? '')
    })
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setStatus(null)
    try {
      await updateUserAttributes({
        userAttributes: { email, phone_number: phone || undefined } as Record<string, string>,
      })
      // Cognito sends verification codes — prompt user to confirm email first
      setPending('email')
      setStatus({ type: 'success', message: 'Verification code sent to your new email.' })
    } catch (err) {
      setStatus({ type: 'error', message: (err as Error).message })
    } finally {
      setLoading(false)
    }
  }

  async function handleConfirm(e: FormEvent) {
    e.preventDefault()
    if (!pending) return
    setLoading(true)
    setStatus(null)
    try {
      await confirmUserAttribute({ userAttributeKey: pending, confirmationCode: code })
      setStatus({ type: 'success', message: 'Contact info verified and updated.' })
      setPending(null)
      setCode('')
    } catch (err) {
      setStatus({ type: 'error', message: (err as Error).message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <SectionCard
      title="Contact Information"
      description="Changes to email or phone require verification."
    >
      {!pending ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="Email address">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </Field>
          <Field label="Phone number (optional)">
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 555 000 0000"
            />
          </Field>
          {status && <StatusMessage {...status} />}
          <SaveButton loading={loading} />
        </form>
      ) : (
        <form onSubmit={handleConfirm} className="flex flex-col gap-4">
          <p className="text-sm text-gray-600">
            Enter the verification code sent to your new {pending === 'email' ? 'email' : 'phone'}.
          </p>
          <Field label="Verification code">
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="6-digit code"
              required
              autoFocus
            />
          </Field>
          {status && <StatusMessage {...status} />}
          <div className="flex items-center gap-3">
            <SaveButton loading={loading} label="Confirm" />
            <button
              type="button"
              onClick={() => { setPending(null); setStatus(null) }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </SectionCard>
  )
}

// ─── Security section ─────────────────────────────────────────────────────────

function SecuritySection() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', message: 'New passwords do not match.' })
      return
    }
    setLoading(true)
    setStatus(null)
    try {
      await updatePassword({ oldPassword: currentPassword, newPassword })
      setStatus({ type: 'success', message: 'Password updated.' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setStatus({ type: 'error', message: (err as Error).message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <SectionCard title="Security" description="Change your account password.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Current password">
          <Input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </Field>
        <Field label="New password">
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </Field>
        <Field label="Confirm new password">
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </Field>
        {status && <StatusMessage {...status} />}
        <SaveButton loading={loading} label="Update password" />
      </form>
    </SectionCard>
  )
}

// ─── Danger Zone section ──────────────────────────────────────────────────────

function DangerZoneSection() {
  const { signOut } = useAuthenticator()
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    setLoading(true)
    setError(null)
    try {
      await deleteUser()
      signOut()
      navigate('/', { replace: true })
    } catch (err) {
      setError((err as Error).message)
      setLoading(false)
    }
  }

  return (
    <>
      <SectionCard
        title="Danger Zone"
        description="Permanently delete your account and all associated data."
      >
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="px-5 py-2 rounded-lg border border-red-300 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors duration-150"
        >
          Delete account
        </button>
      </SectionCard>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-2">Delete account?</h3>
            <p className="text-sm text-gray-500 mb-6">
              This is permanent and cannot be undone. All your data will be erased.
            </p>
            {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                disabled={loading}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors duration-150"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors duration-150"
              >
                {loading ? 'Deleting…' : 'Yes, delete my account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="w-full max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <ProfileSection />
        <ContactSection />
        <SecuritySection />
        <DangerZoneSection />
      </main>
    </div>
  )
}
