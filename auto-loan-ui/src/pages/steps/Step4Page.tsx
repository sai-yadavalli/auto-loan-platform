import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchAuthSession } from 'aws-amplify/auth'
import { Upload, CheckCircle2, AlertCircle, FileText, X } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_BASE_URL
const MAX_FILE_SIZE = 10 * 1024 * 1024
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png']

type DocType = 'drivers-license' | 'proof-of-income'

type UploadState = {
  file: File | null
  status: 'idle' | 'uploading' | 'done' | 'error'
  error: string | null
  s3Key: string | null
}

const BLANK: UploadState = { file: null, status: 'idle', error: null, s3Key: null }

async function getAuthHeaders(): Promise<Record<string, string>> {
  const session = await fetchAuthSession()
  const token = session.tokens?.accessToken?.toString()
  if (!token) throw new Error('Not authenticated')
  return { Authorization: `Bearer ${token}` }
}

async function requestUploadUrl(
  fileName: string,
  fileType: string,
  documentType: DocType,
  authHeaders: Record<string, string>,
): Promise<{ uploadUrl: string; key: string }> {
  const res = await fetch(`${API_BASE}/upload-url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders },
    body: JSON.stringify({ fileName, fileType, documentType }),
  })
  if (!res.ok) throw new Error('Failed to get upload URL')
  return res.json()
}

async function putToS3(uploadUrl: string, file: File): Promise<void> {
  const res = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  })
  if (!res.ok) throw new Error('S3 upload failed')
}

async function confirmUpload(
  key: string,
  documentType: DocType,
  authHeaders: Record<string, string>,
): Promise<void> {
  const res = await fetch(`${API_BASE}/confirm-upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders },
    body: JSON.stringify({ key, documentType }),
  })
  if (!res.ok) throw new Error('Failed to confirm upload')
}

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function UploadSlot({
  docType,
  hint,
  state,
  onFile,
  onReset,
}: {
  docType: DocType
  hint: string
  state: UploadState
  onFile: (docType: DocType, file: File) => void
  onReset: (docType: DocType) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const { file, status, error } = state

  if (status === 'done' && file) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-900">{file.name}</p>
            <p className="text-xs text-gray-500">{formatBytes(file.size)} · Uploaded</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onReset(docType)}
          className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          Replace
        </button>
      </div>
    )
  }

  if (status === 'uploading') {
    return (
      <div className="rounded-xl border border-primary-200 bg-primary-50 p-4 flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin shrink-0" />
        <div>
          <p className="text-sm font-medium text-gray-900">{file?.name}</p>
          <p className="text-xs text-primary-600">Uploading…</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          const f = e.dataTransfer.files[0]
          if (f) onFile(docType, f)
        }}
        className={`rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-150 ${
          dragging
            ? 'border-primary-400 bg-primary-50'
            : error
            ? 'border-red-300 bg-red-50'
            : 'border-gray-300 bg-gray-50 hover:border-primary-400 hover:bg-primary-50/40'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) onFile(docType, f)
            e.target.value = ''
          }}
        />
        <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 ${
          error ? 'bg-red-100' : 'bg-white shadow-sm'
        }`}>
          {error
            ? <AlertCircle className="w-5 h-5 text-red-500" />
            : <Upload className="w-5 h-5 text-primary-500" />
          }
        </div>
        <p className="text-sm font-medium text-gray-700 mb-1">
          {error ? 'Try again' : 'Drop file here or click to browse'}
        </p>
        <p className="text-xs text-gray-400">{hint}</p>
      </div>
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  )
}

export default function Step4Page() {
  const navigate = useNavigate()

  const [uploads, setUploads] = useState<Record<DocType, UploadState>>({
    'drivers-license': { ...BLANK },
    'proof-of-income': { ...BLANK },
  })

  const allDone =
    uploads['drivers-license'].status === 'done' &&
    uploads['proof-of-income'].status === 'done'

  async function handleFile(docType: DocType, file: File) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploads((prev) => ({
        ...prev,
        [docType]: { file, status: 'error', error: 'File must be PDF, JPEG, or PNG', s3Key: null },
      }))
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setUploads((prev) => ({
        ...prev,
        [docType]: { file, status: 'error', error: 'File must be 10 MB or smaller', s3Key: null },
      }))
      return
    }

    setUploads((prev) => ({
      ...prev,
      [docType]: { file, status: 'uploading', error: null, s3Key: null },
    }))

    try {
      const authHeaders = await getAuthHeaders()
      const { uploadUrl, key } = await requestUploadUrl(file.name, file.type, docType, authHeaders)
      await putToS3(uploadUrl, file)
      await confirmUpload(key, docType, authHeaders)
      setUploads((prev) => ({
        ...prev,
        [docType]: { file, status: 'done', error: null, s3Key: key },
      }))
    } catch {
      setUploads((prev) => ({
        ...prev,
        [docType]: { file, status: 'error', error: 'Upload failed. Please try again.', s3Key: null },
      }))
    }
  }

  function handleReset(docType: DocType) {
    setUploads((prev) => ({ ...prev, [docType]: { ...BLANK } }))
  }

  return (
    <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-8">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
          <FileText className="w-4 h-4 text-primary-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Upload Documents</h2>
      </div>
      <p className="text-sm text-gray-500 mb-8">
        Please upload clear, legible copies. Files are encrypted and stored securely.
      </p>

      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1.5">
            Driver's License <span className="text-red-500">*</span>
          </p>
          <UploadSlot
            docType="drivers-license"
            hint="Front of your license — PDF, JPEG, or PNG, max 10 MB"
            state={uploads['drivers-license']}
            onFile={handleFile}
            onReset={handleReset}
          />
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-1.5">
            Proof of Income <span className="text-red-500">*</span>
          </p>
          <UploadSlot
            docType="proof-of-income"
            hint="Recent pay stub, W-2, or tax return — PDF, JPEG, or PNG, max 10 MB"
            state={uploads['proof-of-income']}
            onFile={handleFile}
            onReset={handleReset}
          />
        </div>
      </div>

      <div className="flex justify-between items-center pt-8">
        <button
          type="button"
          onClick={() => navigate('/apply/step-3')}
          className="text-sm font-semibold text-gray-600 px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 active:scale-95 transition-all duration-150"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={() => navigate('/apply/step-5')}
          disabled={!allDone}
          className="bg-primary-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-primary-700 active:scale-95 transition-all duration-150 shadow-sm text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          Next: Review & Submit →
        </button>
      </div>
    </div>
  )
}
