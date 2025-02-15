import { Repository } from 'typeorm';

import { AllParams } from '@/domain/shared/repository/repository';
import { User, UserRepository } from '@/domain/users';

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

  async all(filters?: AllParams): Promise<[User[], number]> {
    const [users, total] = await this._repository.findAndCount({
      skip: (filters.page - 1) * filters.limit,
      take: filters.limit,
      ...(filters.role && { where: { role: filters.role } }),
      ...(filters.name && { where: { name: filters.name } }),
    });

    return [users.map(UserMapper.toDomain), total];
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
