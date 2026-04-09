# Auto Loan Platform — Phase 1 Frontend Roadmap

## Overview
React + Vite + TypeScript SPA inside `auto-loan-ui/`. Each stage is one feature branch → PR → merge into `main`.

**Branch naming:** `feature/<name>`

---

## Design & Tech Constraints
- **Styling:** Tailwind CSS v4 — deep blue primary palette, Inter font, rounded corners, smooth transitions
- **Icons:** Lucide React (`<Car />` Step 2, `<User />` Step 3)
- **Validation:** React Hook Form + Zod
  - VIN: 17 chars, regex `/^[A-HJ-NPR-Z0-9]{17}$/i` (rejects I, O, Q)
  - SSN: masked to `***-**-XXXX` on blur; never stored in `localStorage`
- **Auth:** Amplify `<Authenticator>` component with `VITE_` env vars — NOT generic OIDC redirect
- **Security:** `.env` never committed; `.env.example` with placeholders committed instead

---

## Stages

| # | Branch | Scope | Status |
|---|--------|-------|--------|
| 1 | `feature/scaffold` | Vite + TS + Tailwind v4 + all deps, folder structure, landing page | ✅ Merged |
| 2 | `feature/auth` | Amplify Authenticator, ProtectedRoute, 30-min idle timeout, Navbar | ✅ Merged |
| 3 | `feature/form-shell` | Multi-step layout, StepProgressIndicator, sessionStorage persistence, FormContext, routing | ✅ Merged |
| 4 | `feature/step1-loan-details` | Loan type, vehicle type, amount ($1k–$250k), term dropdown + Zod validation | ⬜ Pending |
| 5 | `feature/step2-vehicle-details` | VIN, make/model/year/mileage, purchase price, dealer indicator | ⬜ Pending |
| 6 | `feature/step3-personal-details` | Name/DOB/SSN (masked), address, employment, income | ⬜ Pending |
| 7 | `feature/step4-document-upload` | Pre-signed S3 upload, file validation (PDF/JPEG/PNG ≤10 MB), confirm-upload API | ⬜ Pending |
| 8 | `feature/step5-review-submit` | Review summary + edit links, consent checkbox, POST /applications, confirmation screen | ⬜ Pending |
| 9 | `feature/polish` | Responsive (320px min), error boundaries, loading states, accessibility | ⬜ Pending |

---

## Key Files
| File | Purpose |
|------|---------|
| `auto-loan-ui/src/lib/amplifyConfig.ts` | Amplify.configure with VITE_ vars (created Stage 2) |
| `auto-loan-ui/src/context/FormContext.tsx` | Shared multi-step form state (created Stage 3) |
| `auto-loan-ui/src/hooks/useFormPersist.ts` | sessionStorage persistence hook (created Stage 3) |
| `auto-loan-ui/src/components/StepProgressIndicator.tsx` | Progress bar, syncs on back-nav (created Stage 3) |
| `auto-loan-ui/src/lib/validators.ts` | Shared Zod schemas — VIN, SSN, etc. (created Stage 4+) |
| `auto-loan-ui/src/lib/utils.ts` | `cn()` helper (clsx + tailwind-merge) |

---

## GitHub Workflow Per Stage
1. Create `feature/<name>` branch from `main`
2. Implement the stage
3. Open PR against `main`
4. Review → merge
5. Start next stage from updated `main`

---

## API Endpoints Used (Phase 1 Backend)
| Method | Path | Stage |
|--------|------|-------|
| POST | `/upload-url` | 7 |
| POST | `/confirm-upload` | 7 |
| POST | `/applications` | 8 |
| GET | `/applications/{id}` | 8 |
