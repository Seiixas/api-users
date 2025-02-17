import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { dataSource } from '@/infra/persistence/database/typeorm/connection';

import { AppModule } from '../../../../app.module';

describe('UserProfileController (e2e)', () => {
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

  it('should not be able to update show users profile without authentication', async () => {
    const response = await request(app.getHttpServer())
      .put('/users/97a32174-3750-4d0e-8eaa-06cebf2644ce')
      .expect(401);
    expect(response.body).toEqual({
      message: 'Unauthorized',
      statusCode: 401,
    });
  });

  it('should not be able to show an user profile that does not exist', async () => {
    const responseAuth = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: 'std@std.com',
        password: 'my-secret-password',
      });

    const { accessToken } = responseAuth.body;

    const response = await request(app.getHttpServer())
      .get(`/users/${crypto.randomUUID()}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.body.statusCode).toBe(404);
  });

  it('should not be able to show an user profile which is not yours (if role is STANDARD)', async () => {
    const responseAuth = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: 'std@std.com',
        password: 'my-secret-password',
      });

    const { accessToken } = responseAuth.body;

    const response = await request(app.getHttpServer())
      .get(`/users/6f066a9e-0996-4aca-8c1d-98fc3a0407e3`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.body.statusCode).toBe(403);
  });

  it('should be able to show an user profile', async () => {
    const responseAuth = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: 'man@man.com',
        password: 'my-secret-password',
      });

    const { accessToken } = responseAuth.body;

    const response = await request(app.getHttpServer())
      .get(`/users/6f066a9e-0996-4aca-8c1d-98fc3a0407e3`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('email');
    expect(response.statusCode).toBe(200);
  });
});
