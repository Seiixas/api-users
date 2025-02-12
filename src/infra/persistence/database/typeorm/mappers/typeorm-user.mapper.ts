import { User as UserLocal } from 'src/domain/users';
import { UserEntity as UserTypeOrm } from '../entities/user.entity';

export class UserMapper {
  public static toTypeORM(user: UserLocal | Partial<UserLocal>): UserTypeOrm {
    const userTypeOrm = new UserTypeOrm();

    userTypeOrm.id = user.id;
    userTypeOrm.name = user.name;
    userTypeOrm.email = user.email;
    userTypeOrm.password = user.password;
    userTypeOrm.createdAt = user.createdAt;
    userTypeOrm.updatedAt = user.updatedAt;

    return userTypeOrm;
  }

  public static toDomain(user: UserTypeOrm): UserLocal {
    return new UserLocal({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }
}
