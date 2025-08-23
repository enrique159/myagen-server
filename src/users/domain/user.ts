export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  lastName: string;
  phoneNumber: string | null;
  profileImageUrl: string | null;
  status: UserStatus;
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
