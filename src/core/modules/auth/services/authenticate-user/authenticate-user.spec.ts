import { HasherPort } from '@/core/ports';
import { JwtPort } from '@/core/ports/jwt.port';
import { EUserRoles, User, UserRepository } from '@/domain/users';
import { InMemoryHasherAdapter } from '@/infra/adapters/hasher.adapter';
import { InMemoryJwtAdapter } from '@/infra/adapters/jwt.adapter';
import { InMemoryUserRepository } from '@/infra/persistence/in-memory/in-memory-users.repository';

import { UNAUTHORIZED_AUTH_ERROR } from '../../errors';
import { ACCOUNT_NOT_ACTIVATED_ERROR } from '../../errors/account-not-activated.error';
import { AuthenticateUserService } from './authenticate-user.service';

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
        role: EUserRoles.STANDARD,
        isActivated: true,
      }),
    );

    usersRepository.store(
      new User({
        name: 'Mary Doe',
        email: 'mary@doe.com',
        password: await hasherAdapter.hash('my-secret-password'),
        role: EUserRoles.STANDARD,
        isActivated: false,
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
        email: 'mary@doe.com',
        password: 'my-secret-password',
      }),
    ).rejects.toBe(ACCOUNT_NOT_ACTIVATED_ERROR);
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

  it('should not be able to authenticate a user with wrong e-mail and password', async () => {
    await expect(
      authenticateUserService.execute({
        email: 'john-wrong@mail.com',
        password: 'wrong-pass',
      }),
    ).rejects.toBe(UNAUTHORIZED_AUTH_ERROR);
  });
});
