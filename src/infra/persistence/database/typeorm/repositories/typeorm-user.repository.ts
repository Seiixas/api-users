import { User, UserRepository } from 'src/domain/users';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserMapper } from '../mappers/typeorm-user.mapper';

export class TypeORMUserRepository implements UserRepository {
  constructor(private readonly _repository: Repository<UserEntity>) {}

  async store(data: User): Promise<User> {
    const user = UserMapper.toTypeORM(data);

    await this._repository.save(user);

    return UserMapper.toDomain(user);
  }

  async find({ where }: { where: Partial<User> }): Promise<User> {
    const user = await this._repository.findOne({ where });

    return user ? UserMapper.toDomain(user) : null;
  }

  async remove(item: User): Promise<void> {
    await this._repository.delete(item.id);
  }

  async all(): Promise<User[]> {
    const users = await this._repository.find();

    return users.map((user) => UserMapper.toDomain(user));
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const user = await this._repository
      .createQueryBuilder()
      .update(UserEntity)
      .set(data)
      .where('id = :id', { id })
      .returning('*')
      .execute();

    return UserMapper.toDomain(user.raw[0]);
  }
}
