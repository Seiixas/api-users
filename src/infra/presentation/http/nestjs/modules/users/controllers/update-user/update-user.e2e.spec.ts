import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { dataSource } from '@/infra/persistence/database/typeorm/connection';

import { AppModule } from '../../../../app.module';

describe('UpdateUserController (e2e)', () => {
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
    await dataSource.undoLastMigration();
    await dataSource.undoLastMigration();
    await dataSource.undoLastMigration();
    await dataSource.undoLastMigration();
    await dataSource.destroy();
    await app.close();
  });

  it('should not be able to update user without authentication', async () => {
    const response = await request(app.getHttpServer())
      .put('/users/97a32174-3750-4d0e-8eaa-06cebf2644ce')
      .expect(401);
    expect(response.body).toEqual({
      message: 'Unauthorized',
      statusCode: 401,
    });
  });

  it('should not be able to update user that does not exist', async () => {
    const responseAuth = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: 'admin@admin.com',
        password: 'my-secret-password',
      });

    const { accessToken } = responseAuth.body;

    const response = await request(app.getHttpServer())
      .put(`/users/${crypto.randomUUID()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Mary Doe',
      });

    expect(response.body.statusCode).toBe(404);
  });

  it('should not be able to update other user if role is standard', async () => {
    const responseAuth = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: 'std@std.com',
        password: 'my-secret-password',
      });

    const { accessToken } = responseAuth.body;

    const response = await request(app.getHttpServer())
      .put(`/users/be30758d-1b1e-44d7-8019-69e424132c01`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Mary Doe',
      });

    expect(response.body.statusCode).toBe(403);
  });

  it('should be able to update any user if role is manager', async () => {
    const responseAuth = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: 'man@man.com',
        password: 'my-secret-password',
      });

    const { accessToken } = responseAuth.body;

    const response = await request(app.getHttpServer())
      .put(`/users/97a32174-3750-4d0e-8eaa-06cebf2644ce`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'John Doe',
        email: 'mary@doe.com',
        password: 'password',
      });

    expect(response.statusCode).toBe(204);
  });

  it('should not be able to update user role if user logged in role is manager', async () => {
    const responseAuth = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: 'man@man.com',
        password: 'my-secret-password',
      });

    const { accessToken } = responseAuth.body;

    const response = await request(app.getHttpServer())
      .put(`/users/97a32174-3750-4d0e-8eaa-06cebf2644ce`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        role: 'ADMIN',
      });

    expect(response.statusCode).toBe(403);
  });

  it('should be able to update user role if user logged in role is admin', async () => {
    const responseAuth = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: 'admin@admin.com',
        password: 'my-secret-password',
      });

    const { accessToken } = responseAuth.body;

    const response = await request(app.getHttpServer())
      .put(`/users/97a32174-3750-4d0e-8eaa-06cebf2644ce`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        role: 'ADMIN',
      });

    expect(response.statusCode).toBe(204);
  });
});
