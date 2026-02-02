// Placeholder for NextAuth configuration
// Will be implemented in later phases

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  image?: string;
  role: 'USER' | 'ADMIN';
}

// Placeholder for auth utilities
export async function getSession() {
  // Will be implemented with NextAuth
  return null;
}

export async function getServerSession() {
  // Will be implemented with NextAuth
  return null;
}
