import { CoreService } from '@/core/shared/services/core.service';
import { User, UserRepository } from '@/domain/users';
import { USER_NOT_FOUND_ERROR } from '../../errors';

type Request = {
  id: string;
};

type Response = User;

export class UserProfileService implements CoreService<Request, Response> {
  constructor(private readonly usersRepository: UserRepository) {}

  async execute({ id }: Request): Promise<Response> {
    const user = await this.usersRepository.find({ where: { id } });

    if (!user) throw USER_NOT_FOUND_ERROR;

    return user;
  }
}
