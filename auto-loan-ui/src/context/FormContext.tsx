import { createContext, useContext, useState, ReactNode } from 'react';

// Step 1 — Loan Details
export interface LoanDetailsData {
  loanType: 'purchase' | 'refinance' | '';
  vehicleType: 'new' | 'used' | '';
  amount: number | '';
  term: 12 | 24 | 36 | 48 | 60 | 72 | '';
}

// Step 2 — Vehicle Details
export interface VehicleDetailsData {
  vin: string;
  make: string;
  model: string;
  year: number | '';
  mileage: number | '';
  purchasePrice: number | '';
  isDealer: boolean;
}

// Step 3 — Personal Details
// SSN is intentionally excluded from persistence (see useFormPersist)
export interface PersonalDetailsData {
  firstName: string;
  lastName: string;
  dob: string;
  ssn: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  employmentStatus: string;
  annualIncome: number | '';
}

export interface FormData {
  loanDetails: LoanDetailsData;
  vehicleDetails: VehicleDetailsData;
  personalDetails: PersonalDetailsData;
}

const initialFormData: FormData = {
  loanDetails: {
    loanType: '',
    vehicleType: '',
    amount: '',
    term: '',
  },
  vehicleDetails: {
    vin: '',
    make: '',
    model: '',
    year: '',
    mileage: '',
    purchasePrice: '',
    isDealer: false,
  },
  personalDetails: {
    firstName: '',
    lastName: '',
    dob: '',
    ssn: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    employmentStatus: '',
    annualIncome: '',
  },
};

interface FormContextValue {
  formData: FormData;
  setLoanDetails: (data: LoanDetailsData) => void;
  setVehicleDetails: (data: VehicleDetailsData) => void;
  setPersonalDetails: (data: PersonalDetailsData) => void;
  resetForm: () => void;
}

const FormContext = createContext<FormContextValue | null>(null);

export function FormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const setLoanDetails = (data: LoanDetailsData) =>
    setFormData((prev) => ({ ...prev, loanDetails: data }));

  const setVehicleDetails = (data: VehicleDetailsData) =>
    setFormData((prev) => ({ ...prev, vehicleDetails: data }));

  const setPersonalDetails = (data: PersonalDetailsData) =>
    setFormData((prev) => ({ ...prev, personalDetails: data }));

  const resetForm = () => setFormData(initialFormData);

  return (
    <FormContext.Provider
      value={{ formData, setLoanDetails, setVehicleDetails, setPersonalDetails, resetForm }}
    >
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error('useFormContext must be used within FormProvider');
  return ctx;
}
