import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let server: any;
  let userDB: User;
  const userParams = {
    name: 'userTest',
    email: 'test.note@gmail.com',
    password: 'passwordPrueba',
  };
  //para cada prueba se ejecuta el before each
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
    //eliminamos los usuarios de la base de datos
    await userRepository.query(`DELETE FROM users;`);
    //creamos un nuevo usuario
    const hash = await bcrypt.hash(userParams.password, bcrypt.genSaltSync(10));
    const user = userRepository.create({
      name: userParams.name,
      email: userParams.email,
      password: hash,
    });
    userDB = await userRepository.save(user);
  });
  afterAll(async () => {
    await userRepository.query(`DELETE FROM users;`);
    await server.close();
    await app.close();
  });

  it('/api/auth/register (POST)', async () => {
    const response = await request(server)
      .post('/api/auth/register')
      .send({
        name: 'new user',
        email: 'register@gmail.com',
        password: '123456789',
      })
      .expect(201);
    return response;
  });
  it('/api/auth/login (POST)', async () => {
    const params = {
      email: userParams.email,
      password: userParams.password,
    };
    const response = await request(server).post('/api/auth/login').send(params);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('email');
    expect(response.body).toHaveProperty('token');
    return response;
  });
});
