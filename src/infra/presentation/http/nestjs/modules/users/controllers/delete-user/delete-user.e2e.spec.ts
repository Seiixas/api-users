import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { dataSource } from '@/infra/persistence/database/typeorm/connection';

import { AppModule } from '../../../../app.module';

describe('DeleteUserController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await dataSource.initialize();
    await dataSource.runMigrations();

    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await dataSource.undoLastMigration();
    await dataSource.undoLastMigration();
    await dataSource.undoLastMigration();
    await dataSource.undoLastMigration();
    await dataSource.destroy();
  });

  it('should not be able to delete user without authentication', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/users/${crypto.randomUUID()}`)
      .expect(401);
    expect(response.body).toEqual({
      message: 'Unauthorized',
      statusCode: 401,
    });
  });

  it('should be able to delete an user', async () => {
    const responseAuth = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: 'admin@admin.com',
        password: 'my-secret-password',
      });

    const { accessToken } = responseAuth.body;

    await request(app.getHttpServer())
      .delete(`/users/97a32174-3750-4d0e-8eaa-06cebf2644ce`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(204);
  });
});
