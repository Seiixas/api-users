import { HasherPort } from 'src/core/ports';
import { JwtPort } from 'src/core/ports/jwt.port';
import { UserRepository } from 'src/domain/users';
import { UNAUTHORIZED_AUTH_ERROR } from '../../errors/unauthorized-auth.error';
import { CoreService } from 'src/core/shared/services/core.service';

type Request = {
  email: string;
  password: string;
};

type Response = {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
};

class AuthenticateUserService implements CoreService<Request, Response> {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly hashPort: HasherPort,
    private readonly jwtPort: JwtPort,
  ) {}

  async execute({ email, password }: Request): Promise<Response> {
    const user = await this.usersRepository.find({ where: { email } });

    if (!user) throw UNAUTHORIZED_AUTH_ERROR;

    const passwordMatches = this.hashPort.compare(password, user.password);

    if (!passwordMatches) throw UNAUTHORIZED_AUTH_ERROR;

    const token = this.jwtPort.sign({
      email: user.email,
      id: user.id,
    });

    return {
      accessToken: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}

export { AuthenticateUserService };
