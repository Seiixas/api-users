import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { UNAUTHORIZED_AUTH_ERROR } from '@/core/modules/auth/errors';
import { dataSource } from '@/infra/persistence/database/typeorm/connection';

import { AppModule } from '../../../../app.module';

describe('SignInController (e2e)', () => {
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

  it('should not be able to authenticate user that does not exist', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: 'dummy-email@mail.com',
        password: 'dummy-password',
      });

    expect(response.body).toEqual({
      message: UNAUTHORIZED_AUTH_ERROR.message,
      statusCode: UNAUTHORIZED_AUTH_ERROR.statusCode,
    });
  });

  it('should not be able to authenticate user with wrong password', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: 'admin@admin.com',
        password: 'dummy-password',
      });

    expect(response.body).toEqual({
      message: UNAUTHORIZED_AUTH_ERROR.message,
      statusCode: UNAUTHORIZED_AUTH_ERROR.statusCode,
    });
  });

  it('should not be able to authenticate user with wrong e-mail', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: 'wrong@mail.com',
        password: 'my-secret-password',
      });

    expect(response.body).toEqual({
      message: UNAUTHORIZED_AUTH_ERROR.message,
      statusCode: UNAUTHORIZED_AUTH_ERROR.statusCode,
    });
  });

  it('should be able to authenticate user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: 'admin@admin.com',
        password: 'my-secret-password',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('accessToken');
  });
});
