import { InMemoryUserRepository } from '../../../../../infra/persistence/in-memory/in-memory-users.repository';
import { User, UserRepository } from '../../../../../domain/users';
import { UpdateUserService } from './update-user.service';
import { HasherPort } from '../../../../../core/ports';
import { InMemoryHasherAdapter } from '../../../../../infra/adapters/hasher.adapter';
import {
  PASSWORD_SIZE_ERROR,
  USER_ALREADY_EXISTS_ERROR,
  USER_NOT_FOUND_ERROR,
} from '../../errors';

let updateUserService: UpdateUserService;
let hasherPort: HasherPort;
let usersRepository: UserRepository;

describe('Update User Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUserRepository();
    hasherPort = new InMemoryHasherAdapter();
    updateUserService = new UpdateUserService(usersRepository, hasherPort);

    usersRepository.store(
      new User({
        id: '1',
        name: 'John Doe',
        email: 'john@doe.com',
        password: await hasherPort.hash('my-secret-password'),
        role: '',
      }),
    );

    usersRepository.store(
      new User({
        id: '2',
        name: 'Same Doe',
        email: 'same@doe.com',
        password: await hasherPort.hash('same-secret-password'),
        role: '',
      }),
    );

    usersRepository.store(
      new User({
        id: '1',
        name: 'Same Doe',
        email: 'same@doe.com',
        password: await hasherPort.hash('same-secret-password'),
        role: '',
      }),
    );
  });

  it('should be able to update an user', async () => {
    const user = await updateUserService.execute({
      id: '1',
      name: 'Mary Doe',
      email: 'mary@doe.com',
    });

    expect(user).toHaveProperty('name', 'Mary Doe');
    expect(user).toHaveProperty('email', 'mary@doe.com');
  });

  it('should not be able to update the user if the user does not exist', () => {
    expect(async () => {
      await updateUserService.execute({ id: '3', name: 'Mary Doe' });
    }).rejects.toBe(USER_NOT_FOUND_ERROR);
  });

  it('should not be able to update the user if the email already exists', () => {
    expect(async () => {
      await updateUserService.execute({ id: '1', email: 'same@doe.com' });
    }).rejects.toBe(USER_ALREADY_EXISTS_ERROR);
  });

  it('should be able to update the user passwords with less then 8 characters', () => {
    expect(async () => {
      await updateUserService.execute({ id: '1', password: '1234567' });
    }).rejects.toBe(PASSWORD_SIZE_ERROR);
  });
});
