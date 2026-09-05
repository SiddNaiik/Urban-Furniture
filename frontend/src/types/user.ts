export type Role = 'admin' | 'manager' | 'accountant' | 'sales' | 'inventory' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  created_at?: string;
  updated_at?: string;
}

export interface UserCreateInput {
  name: string;
  email: string;
  password?: string;
  role: Role;
}
