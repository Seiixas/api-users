import { AuthenticateUserService } from './authenticate-user.service';
import { User, UserRepository } from '../../../../../domain/users';
import { InMemoryUserRepository } from '../../../../../infra/persistence/in-memory/in-memory-users.repository';
import { InMemoryJwtAdapter } from '../../../../../infra/adapters/jwt.adapter';
import { JwtPort } from '../../../../../core/ports/jwt.port';
import { HasherPort } from '../../../../../core/ports';
import { InMemoryHasherAdapter } from '../../../../../infra/adapters/hasher.adapter';
import { UNAUTHORIZED_AUTH_ERROR } from '../../errors';

let authenticateUserService: AuthenticateUserService;
let usersRepository: UserRepository;
let jwtAdapter: JwtPort;
let hasherAdapter: HasherPort;

describe('Authenticate User Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUserRepository();
    jwtAdapter = new InMemoryJwtAdapter();
    hasherAdapter = new InMemoryHasherAdapter();

    authenticateUserService = new AuthenticateUserService(
      usersRepository,
      hasherAdapter,
      jwtAdapter,
    );

    usersRepository.store(
      new User({
        name: 'John Doe',
        email: 'john@doe.com',
        password: await hasherAdapter.hash('my-secret-password'),
        role: 'admin',
      }),
    );
  });

  it('should be able to authenticate a user', async () => {
    const token = await authenticateUserService.execute({
      email: 'john@doe.com',
      password: 'my-secret-password',
    });

    expect(token).toBeDefined();
  });

  it('should not be able to authenticate a user with wrong password', async () => {
    await expect(
      authenticateUserService.execute({
        email: 'john@doe.com',
        password: 'wrong-password',
      }),
    ).rejects.toBe(UNAUTHORIZED_AUTH_ERROR);
  });

  it('should not be able to authenticate a user with wrong e-mail', async () => {
    await expect(
      authenticateUserService.execute({
        email: 'john-wrong@doe.com',
        password: 'my-secret-password',
      }),
    ).rejects.toBe(UNAUTHORIZED_AUTH_ERROR);
  });
});
