import { CoreService } from 'src/core/shared/services/core.service';
import { USER_NOT_FOUND_ERROR } from '../../errors';
import { UserRepository } from 'src/domain/users';

type Request = {
  id: string;
};

type Response = void;

export class DeleteUserService implements CoreService<Request, Response> {
  constructor(private readonly usersRepository: UserRepository) {}

  async execute({ id }: Request): Promise<Response> {
    const user = await this.usersRepository.find({ where: { id } });

    if (!user) throw USER_NOT_FOUND_ERROR;

    await this.usersRepository.remove(user);
  }
}
