export type UserRole = "user" | "moderator" | "admin";
export type UserPlan = "free" | "pro" | "studio";
export type UserStatus = "active" | "suspended" | "pending";
export type AuthProviderId = "password" | "google.com" | "username";

export interface UserProfile {
  uid: string;
  username: string;
  usernameLower: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  provider: AuthProviderId;
  verified: boolean;
  role: UserRole;
  plan: UserPlan;
  status: UserStatus;
  bio?: string;
  birthday?: string | null;
  country?: string | null;
  timezone?: string | null;
  theme?: string | null;
  onboarded: boolean;
  createdAt: number;
  updatedAt: number;
  lastLogin: number;
}

export interface UsernameDoc {
  uid: string;
  username: string;
  createdAt: number;
}
