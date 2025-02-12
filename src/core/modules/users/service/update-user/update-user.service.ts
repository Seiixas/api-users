import { CoreService } from '../../../../../core/shared/services/core.service';
import { User, UserRepository } from '../../../../../domain/users';
import {
  PASSWORD_SIZE_ERROR,
  USER_ALREADY_EXISTS_ERROR,
  USER_NOT_FOUND_ERROR,
} from '../../errors';
import { HasherPort } from '../../../../../core/ports';

type Request = {
  id: string;
  name?: string;
  email?: string;
  password?: string;
  role?: string;
};

type Response = User;

export class UpdateUserService implements CoreService<Request, Response> {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly hasherPort: HasherPort,
  ) {}

  async execute(request: Request): Promise<Response> {
    const user = await this.usersRepository.find({ where: { id: request.id } });

    if (!user) throw USER_NOT_FOUND_ERROR;

    const userAlreadyExists = await this.usersRepository.find({
      where: { email: request.email },
    });

    if (userAlreadyExists && userAlreadyExists.id !== user.id) {
      throw USER_ALREADY_EXISTS_ERROR;
    }

    user.name = request.name || user.name;
    user.email = request.email || user.email;
    user.role = request.role || user.role;

    if (request.password) {
      if (request.password.length < 8) throw PASSWORD_SIZE_ERROR;
      user.password = await this.hasherPort.hash(request.password);
    }

    const userUpdated = new User(user);

    await this.usersRepository.update(user, userUpdated);

    return user;
  }
}
