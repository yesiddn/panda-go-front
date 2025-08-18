export interface ResponseLogin {
  access: string;
  refresh: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  password2?: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  // locality_id can be either the numeric id or the full object returned by the autocomplete
  locality_id?: number | { id: number } | null;
  companyId?: number | null;
}

export interface RegisterResponse {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}
