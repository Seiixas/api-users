import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { dataSource } from '@/infra/persistence/database/typeorm/connection';

import { AppModule } from '../../../../app.module';

describe('ListUsersController (e2e)', () => {
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

  it('should not be able to list users without authentication', async () => {
    const response = await request(app.getHttpServer())
      .get(`/users`)
      .expect(401);
    expect(response.body).toEqual({
      message: 'Unauthorized',
      statusCode: 401,
    });
  });

  it('should not be able to list users being a standard user', async () => {
    const responseAuth = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: 'std@std.com',
        password: 'my-secret-password',
      });

    const { accessToken } = responseAuth.body;

    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(403);
  });

  it('should not be able to list users being a standard user', async () => {
    const responseAuth = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: 'std@std.com',
        password: 'my-secret-password',
      });

    const { accessToken } = responseAuth.body;

    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(403);
  });

  it('should be able to list users being a manager user', async () => {
    const responseAuth = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: 'man@man.com',
        password: 'my-secret-password',
      });

    const { accessToken } = responseAuth.body;

    const response = await request(app.getHttpServer())
      .get('/users')
      .query({
        page: 1,
        limit: 10,
      })
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
  });
});
