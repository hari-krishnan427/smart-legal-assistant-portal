export type UserRole = 'ROLE_USER' | 'ROLE_LAWYER' | 'ROLE_ADMIN';

export interface User {
  id: number;
  email: String;
  fullName: string;
  role: UserRole;
  createdAt?: string;
}
