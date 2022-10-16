import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { Note } from '../src/note/entities/note.entity';
import { PaginationDto } from '../src/common/dtos/pagination.dto';
import { AuthGuard } from '@nestjs/passport';
import * as bcrypt from 'bcrypt';

describe('NoteController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let noteRepository: Repository<Note>;
  let server: any;
  let token: string;
  let noteDb: Note;
  let userDB: User;

  const userParams = {
    name: 'userTest',
    email: 'test.auth@gmail.com',
    password: 'passwordPrueba',
  };

  //se ejecuta una sola vez antes de todos los test
  beforeAll(async () => {
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
    noteRepository = moduleFixture.get<Repository<Note>>(
      getRepositoryToken(Note),
    );

    //delete all users and notes
    await noteRepository.query(`DELETE FROM notes;`);
    await userRepository.query(`DELETE FROM users;`);
    const users = await userRepository.find();

    //create a new user
    const hash = await bcrypt.hash(userParams.password, bcrypt.genSaltSync(10));
    const user = userRepository.create({
      name: userParams.name,
      email: userParams.email,
      password: hash,
    });
    userDB = await userRepository.save(user);

    noteDb = new Note();
    noteDb.title = 'new note';
    noteDb.content = 'this is a new note';
    noteDb.user = userDB;
    noteDb = await noteRepository.save(noteDb);
  });

  afterAll(async () => {
    await noteRepository.query(`DELETE FROM notes;`);
    await userRepository.query(`DELETE FROM users;`);
    await app.close();
    await server.close();
  });

  it('Get auth token', async () => {
    const response = await request(server)
      .post('/api/auth/login')
      .send({ email: userParams.email, password: userParams.password });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('email');
    expect(response.body).toHaveProperty('token');
    token = response.body.token;
    return response;
  });

  it('/api/note (GET)', async () => {
    //add headers
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await request(server)
      .get('/api/note?itemPerPage=3&currentPage=1')
      .set(headers);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('notes');
    expect(response.body).toHaveProperty('total');
    expect(response.body).toHaveProperty('itemPerPage');
    expect(response.body).toHaveProperty('currentPage');
    return response;
  });
  it('/api/note/:id (GET)', async () => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await request(server)
      .get(`/api/note/${noteDb.id}`)
      .set(headers);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('title');
    expect(response.body).toHaveProperty('content');
    expect(response.body).toHaveProperty('user');
    expect(response.body.title).toBe(noteDb.title);
    expect(response.body.content).toBe(noteDb.content);
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user).toHaveProperty('name');
    expect(response.body.user).toHaveProperty('email');
    expect(response.body.user.name).toBe(userParams.name);
    expect(response.body.user.email).toBe(userParams.email);
    return response;
  });
  it('/api/note (POST)', async () => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const newNote = {
      title: 'new note post',
      content: 'this is a new note post',
    };
    const response = await request(server)
      .post('/api/note')
      .set(headers)
      .send(newNote);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('title');
    expect(response.body).toHaveProperty('content');
    expect(response.body).toHaveProperty('user');
    expect(response.body.title).toBe(newNote.title);
    expect(response.body.content).toBe(newNote.content);
  });
  it('/api/note/:id (PUT)', async () => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const updateNote = {
      title: 'update note',
      content: 'this is a update note',
    };
    const response = await request(server)
      .patch(`/api/note/${noteDb.id}`)
      .set(headers)
      .send(updateNote);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('title');
    expect(response.body).toHaveProperty('content');
    expect(response.body).toHaveProperty('user');
    expect(response.body.title).toBe(updateNote.title);
    expect(response.body.content).toBe(updateNote.content);
  });
  it('/api/note/:id (DELETE)', async () => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const response = await request(server)
      .delete(`/api/note/${noteDb.id}`)
      .set(headers);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('note');
    expect(response.body.message).toBe('Note deleted successfully');
    expect(response.body.note.id).toBe(noteDb.id);
    //check if response is in fomat json
    expect(response.type).toBe('application/json');
  });
});
