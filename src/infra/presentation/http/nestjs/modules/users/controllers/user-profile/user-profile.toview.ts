import { User } from '@/domain/users';

export type UserProfileToViewResponse = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  created_at: Date;
  updated_at: Date;
};

export class UserProfileToView {
  static toView(user: User): UserProfileToViewResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    };
  }
}
