import { CoreService } from 'src/core/shared/services/core.service';
import { User, UserRepository } from 'src/domain/users';

type Request = void;

type Response = User[];

export class ListUsersService implements CoreService<Request, Response> {
  constructor(private readonly usersRepository: UserRepository) {}

  async execute(): Promise<Response> {
    const users = await this.usersRepository.all();

    return users;
  }
}
