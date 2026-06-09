import { z } from 'zod'

// ── Step 1: Loan Details ──────────────────────────────────────────────────────

export const loanDetailsSchema = z.object({
  loanType: z.enum(['purchase', 'refinance'], {
    errorMap: () => ({ message: 'Please select a loan type' }),
  }),
  vehicleType: z.enum(['new', 'used'], {
    errorMap: () => ({ message: 'Please select a vehicle type' }),
  }),
  amount: z
    .number({ invalid_type_error: 'Please enter a loan amount' })
    .min(1000, 'Minimum loan amount is $1,000')
    .max(250000, 'Maximum loan amount is $250,000'),
  term: z.union(
    [
      z.literal(12),
      z.literal(24),
      z.literal(36),
      z.literal(48),
      z.literal(60),
      z.literal(72),
    ],
    { errorMap: () => ({ message: 'Please select a loan term' }) },
  ),
})

export type LoanDetailsSchema = z.infer<typeof loanDetailsSchema>

// ── Step 2: Vehicle Details ───────────────────────────────────────────────────

// VIN: 17 chars, no I, O, or Q
export const vinSchema = z
  .string()
  .length(17, 'VIN must be exactly 17 characters')
  .regex(/^[A-HJ-NPR-Z0-9]{17}$/i, 'VIN contains invalid characters (I, O, Q not allowed)')

// ── Step 3: Personal Details ──────────────────────────────────────────────────

// SSN: never stored in localStorage/sessionStorage — validated client-side only
export const ssnSchema = z
  .string()
  .regex(/^\d{3}-\d{2}-\d{4}$/, 'SSN must be in format XXX-XX-XXXX')
