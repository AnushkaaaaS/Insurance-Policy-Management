export interface Customer {
  id: string;
  name: string;
  age: number;
  mobile: string;
  aadhaar: string;
  pan: string | null;
  nominee: string;
}

export interface CustomerResponse {
  count: number;
  customers: Customer[];
}

export interface CustomerForm {
  name: string;
  age: number;
  mobile: string;
  aadhaar: string;
  pan: string;
  nominee: string;
}

export interface ValidationErrors {
  name?: string;
  age?: string;
  mobile?: string;
  aadhaar?: string;
  pan?: string;
  nominee?: string;
}