export abstract class Repository<T> {
  abstract store(data: T): Promise<T>;
  abstract find({ where }: { where: Partial<T> }): Promise<T | null>;
  abstract remove(item: T): Promise<void>;
  abstract all(): Promise<T[]>;
  abstract update(id: string, data: Partial<T>): Promise<T>;
}
