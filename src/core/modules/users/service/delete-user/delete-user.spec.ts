import { InMemoryUserRepository } from '../../../../../infra/persistence/in-memory/in-memory-users.repository';
import { EUserRoles, User, UserRepository } from '../../../../../domain/users';
import { USER_NOT_FOUND_ERROR } from '../../errors';
import { DeleteUserService } from './delete-user.service';

let deleteUserService: DeleteUserService;
let usersRepository: UserRepository;

describe('Delete User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUserRepository();
    deleteUserService = new DeleteUserService(usersRepository);

    usersRepository.store(
      new User({
        id: '1',
        name: 'John Doe',
        email: 'john@doe.com',
        password: 'my-secret-password',
        role: EUserRoles.STANDARD,
      }),
    );
  });

  it('should be able to get the user profile', () => {
    expect(async () => {
      await deleteUserService.execute({ id: '1' });
    }).not.toThrow();
  });

  it('should not be able to get the user profile if the user does not exist', () => {
    expect(async () => {
      await deleteUserService.execute({ id: '2' });
    }).rejects.toBe(USER_NOT_FOUND_ERROR);
  });
});
