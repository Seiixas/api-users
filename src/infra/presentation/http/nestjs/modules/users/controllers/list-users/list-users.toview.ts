import { User } from '@/domain/users';

export type ListUsersToViewResponse = [
  {
    id: string;
    name: string;
    email: string;
    role: string;
    created_at: Date;
    updated_at: Date;
  }[],
  number,
];

export class ListUsersToView {
  static toView(user: User[], total: number): ListUsersToViewResponse {
    return [
      user.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        created_at: u.createdAt,
        updated_at: u.updatedAt,
      })),
      total,
    ];
  }
}
