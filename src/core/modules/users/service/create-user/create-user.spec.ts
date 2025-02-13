import { UserRepository } from '@/domain/users';
import { CreateUserService } from './create-user.service';
import { InMemoryUserRepository } from '@/infra/persistence/in-memory/in-memory-users.repository';
import { InMemoryHasherAdapter } from '@/infra/adapters/hasher.adapter';
import { PASSWORD_SIZE_ERROR, USER_ALREADY_EXISTS_ERROR } from '../../errors';

let createUserService: CreateUserService;
let hasherAdapter: InMemoryHasherAdapter;
let usersRepository: UserRepository;

describe('Create User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUserRepository();
    hasherAdapter = new InMemoryHasherAdapter();
    createUserService = new CreateUserService(usersRepository, hasherAdapter);
  });

  it('should be able to create a user', async () => {
    const user = await createUserService.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      password: 'my-secret-password',
    });

    expect(user).toHaveProperty('id');
    expect(user.password).not.toBe('my-secret-password');
  });

  it('should not be able to create an user with a password smaller than 8 characters', () => {
    expect(async () => {
      await createUserService.execute({
        name: 'John Doe',
        email: 'john@doe.com',
        password: '1234567',
      });
    }).rejects.toBe(PASSWORD_SIZE_ERROR);
  });

  it('should not be able to create an user with same e-mail of other users', () => {
    expect(async () => {
      await createUserService.execute({
        name: 'John Doe',
        email: 'john@doe.com',
        password: '12345678',
      });
      await createUserService.execute({
        name: 'Mary Doe',
        email: 'john@doe.com',
        password: '87654321',
      });
    }).rejects.toBe(USER_ALREADY_EXISTS_ERROR);
  });
});
