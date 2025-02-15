import { StoragePort } from '@/core/ports/storage.port';

import { HasherPort } from '../../../../../core/ports';
import { CoreService } from '../../../../../core/shared/services/core.service';
import { EUserRoles, User, UserRepository } from '../../../../../domain/users';
import {
  PASSWORD_SIZE_ERROR,
  USER_ALREADY_EXISTS_ERROR,
  USER_NOT_FOUND_ERROR,
} from '../../errors';

type Request = {
  id: string;
  name?: string;
  email?: string;
  password?: string;
  avatar?: Express.Multer.File;
  role?: EUserRoles;
};

type Response = User;

export class UpdateUserService implements CoreService<Request, Response> {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly hasherPort: HasherPort,
    private readonly storagePort: StoragePort,
  ) {}

  async execute(request: Request): Promise<Response> {
    const user = await this.usersRepository.find({ where: { id: request.id } });

    if (!user) throw USER_NOT_FOUND_ERROR;

    if (request.email) {
      const userAlreadyExists = await this.usersRepository.find({
        where: { email: request.email },
      });

      if (userAlreadyExists && userAlreadyExists.id !== user.id) {
        throw USER_ALREADY_EXISTS_ERROR;
      }
    }

    user.name = request.name || user.name;
    user.email = request.email || user.email;
    user.role = request.role || user.role;

    if (request.password) {
      if (request.password.length < 8) throw PASSWORD_SIZE_ERROR;
      user.password = await this.hasherPort.hash(request.password);
    }

    if (request.avatar) {
      if (user.avatar) {
        await this.storagePort.delete(user.avatar);
      }

      user.avatar = await this.storagePort.putFile({
        file: request.avatar.buffer,
        filename: `${user.id}-${new Date().toISOString()}.png`,
        contentType: request.avatar.mimetype,
        isPublic: true,
        contentDisposition: 'inline; filename=filename.png',
      });
    }

    const updateUserRequest = new User(user);

    const userUpdated = await this.usersRepository.update(user.id, {
      name: updateUserRequest.name,
      email: updateUserRequest.email,
      password: updateUserRequest.password,
      role: updateUserRequest.role,
      avatar: updateUserRequest.avatar,
    });

    return userUpdated;
  }
}
