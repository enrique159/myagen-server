export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  lastName: string;
  phoneNumber: string | null;
  profileImageUrl: string | null;
  emailVerifiedAt: Date;
  twoFactorEnabled: boolean;
  twoFactorSecret: string | null;
  status: UserStatus;
  lastLoginAt: Date | null;
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
}

export interface UserToken {
  id: string;
  email: string;
}
