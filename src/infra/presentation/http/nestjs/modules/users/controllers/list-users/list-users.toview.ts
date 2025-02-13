import { User } from 'src/domain/users';

export type ListUsersToViewResponse = {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: Date;
  updated_at: Date;
}[];

export class ListUsersToView {
  static toView(user: User[]): ListUsersToViewResponse {
    return user.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    }));
  }
}
