import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HasherPort } from '@/core/ports';
import { JwtPort } from '@/core/ports/jwt.port';
import { EUserRoles, UserRepository } from '@/domain/users';

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
    role: EUserRoles;
  };
};

@Injectable()
class AuthenticateUserService {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly hashPort: HasherPort,
    private readonly jwtPort: JwtPort,
  ) {}

  async execute({ email, password }: Request): Promise<Response> {
    const user = await this.usersRepository.find({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await this.hashPort.compare(
      password,
      user.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtPort.sign({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
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
