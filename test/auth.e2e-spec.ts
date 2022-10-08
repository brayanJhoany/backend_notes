import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/auth/entities/user.entity';
import { Connection, Repository } from 'typeorm';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let server: any;

  const user = {
    name: 'userTest',
    email: 'newemail@gmail.com',
    password: 'passwordPrueba',
    isActive: true,
    notes: [],
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
    server = app.getHttpServer();
    userRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );
    await userRepository.query(`DELETE FROM users;`);
    await userRepository.save(user);
  });
  afterAll(async () => {
    console.log('cerrando la app');
    if (process.env.NODE_ENV === 'test') {
      await userRepository.query(`DELETE FROM users;`);
    }
    await app.close();
    await server.close();
  });

  it('/api/auth/register (POST)', async () => {
    const response = await request(server)
      .post('/api/auth/register')
      .send({
        name: 'Brayan Escobar',
        email: 'test@test.com',
        password: '123456789',
      })
      .expect(201);
    return response;
  });
  it('/api/auth/login (POST)', async () => {
    const response = await request(server)
      .post('/api/auth/login')
      .send({ email: user.email, password: user.password })
      .expect(201);
    return response;
  });
});
