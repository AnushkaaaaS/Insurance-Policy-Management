export interface Policy {
  id: string;

  policyType: string;

  premium: number;

  policyTerm: number;

  premiumFrequency: string;

  startDate: string;

  status: string;

  customer: {
    id: string;
    name: string;
    mobile: string;
    aadhaar: string;
    pan: string | null;
  };
}

export interface PolicyResponse {
  count: number;
  policies: Policy[];
}

export interface PolicyForm {
  customerId: string;
  policyType: string;
  premium: number;
  policyTerm: number;
  premiumFrequency: string;
  startDate: string;
}

export interface ValidationErrors {
  customerId?: string;
  policyType?: string;
  premium?: string;
  policyTerm?: string;
  premiumFrequency?: string;
  startDate?: string;
  pan?: string;
}