import { EUserRoles } from '@/domain/users';

export interface AllParams {
  name?: string;
  role?: EUserRoles;
  page: number;
  limit: number;
}

export abstract class Repository<T> {
  abstract store(data: T): Promise<T>;
  abstract find({ where }: { where: Partial<T> }): Promise<T | null>;
  abstract remove(item: T): Promise<void>;
  abstract all(filters?: AllParams): Promise<[T[], number]>;
  abstract update(id: string, data: Partial<T>): Promise<T>;
}
