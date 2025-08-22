import { User } from '@/users/user.entity';

const modelFields = [
  'id',
  'email',
  'name',
  'lastName',
  'twoFactorEnabled',
  'phoneNumber',
  'profileImageUrl',
  'lastLoginAt',
  'onboardingCompleted',
  'createdAt',
  'updatedAt',
] as const;

export class CreateUserResponseDto {
  user: User;

  constructor(user: User) {
    this.user = user;
  }

  public returnCreateUserResponse() {
    const filteredUser = {} as Record<(typeof modelFields)[number], any>;

    for (const field of modelFields) {
      if (field in this.user) {
        filteredUser[field] = this.user[field];
      }
    }

    return filteredUser;
  }
}
