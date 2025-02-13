import { HasherPort } from '../../../../../core/ports';
import { CoreService } from '../../../../../core/shared/services/core.service';
import { EUserRoles, User, UserRepository } from '../../../../../domain/users';
import { PASSWORD_SIZE_ERROR, USER_ALREADY_EXISTS_ERROR } from '../../errors';

type Request = {
  name: string;
  email: string;
  password: string;
  role?: EUserRoles;
};

type Response = User;

export class CreateUserService implements CoreService<Request, Response> {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly hasherPort: HasherPort,
  ) {}

  async execute(payload: Request): Promise<Response> {
    if (payload.password.length < 8) {
      throw PASSWORD_SIZE_ERROR;
    }

    const userAlreadyExists = await this.usersRepository.find({
      where: { email: payload.email },
    });

    if (userAlreadyExists) {
      throw USER_ALREADY_EXISTS_ERROR;
    }

    const hashedPassword = await this.hasherPort.hash(payload.password);

    const user = new User({
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      ...(payload.role && { role: payload.role }),
    });

    await this.usersRepository.store(user);

    return user;
  }
}
