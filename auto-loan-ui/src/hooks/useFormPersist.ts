import { useEffect } from 'react';
import { useFormContext, FormData } from '@/context/FormContext';

const STORAGE_KEY = 'auto-loan-form';

// SSN must never be persisted — strip it before saving, restore as empty string
function sanitize(data: FormData): Omit<FormData, 'personalDetails'> & {
  personalDetails: Omit<FormData['personalDetails'], 'ssn'> & { ssn: '' };
} {
  return {
    ...data,
    personalDetails: { ...data.personalDetails, ssn: '' },
  };
}

function loadFromStorage(): Partial<FormData> | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<FormData>;
  } catch {
    return null;
  }
}

export function useFormPersist() {
  const { formData, setLoanDetails, setVehicleDetails, setPersonalDetails } = useFormContext();

  // Restore persisted data on mount (SSN will be '' as it was never saved)
  useEffect(() => {
    const saved = loadFromStorage();
    if (!saved) return;
    if (saved.loanDetails) setLoanDetails(saved.loanDetails);
    if (saved.vehicleDetails) setVehicleDetails(saved.vehicleDetails);
    if (saved.personalDetails) setPersonalDetails(saved.personalDetails);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist whenever form data changes, always stripping SSN
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(sanitize(formData)));
  }, [formData]);
}

export function clearFormPersistence() {
  sessionStorage.removeItem(STORAGE_KEY);
}
