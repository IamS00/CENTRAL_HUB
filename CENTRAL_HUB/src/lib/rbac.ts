// Placeholder for RBAC utilities
// Will be implemented with NextAuth in later phases

export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
}

export function isAdmin(user: User | null): boolean {
  return user?.role === 'ADMIN';
}

export function hasAccess(user: User | null, requiredRole: UserRole): boolean {
  if (!user) return false;
  if (requiredRole === 'USER') return true;
  return user.role === requiredRole;
}

export function checkAdminEmail(email: string): boolean {
  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
  return adminEmails.includes(email);
}
