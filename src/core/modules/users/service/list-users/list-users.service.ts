import { CoreService } from '@/core/shared/services/core.service';
import { EUserRoles, User, UserRepository } from '@/domain/users';

type Request = {
  page: number;
  limit: number;
  name?: string;
  role?: EUserRoles;
};

type Response = [User[], number];

export class ListUsersService implements CoreService<Request, Response> {
  constructor(private readonly usersRepository: UserRepository) {}

  async execute({ page, limit, name, role }: Request): Promise<Response> {
    const users = await this.usersRepository.all({
      page,
      limit,
      name,
      role,
    });

    return users;
  }
}
