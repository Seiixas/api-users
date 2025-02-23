import { Entity } from '../entity/entity';

describe('Base entity test', () => {
  it('should be able to create a new base object', () => {
    const baseEntity = new Entity();

    expect(baseEntity).toBeDefined();
    expect(baseEntity.id).not.toBe('');
    expect(baseEntity.createdAt).toBeInstanceOf(Date);
    expect(baseEntity.updatedAt).toBeInstanceOf(Date);
  });
});
