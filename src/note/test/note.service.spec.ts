import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { Note } from '../entities/note.entity';
import { NoteService } from '../note.service';
import { NoteServiceMock } from './helpers/note-service-mock';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { CreateNoteDto } from '../dto/create-note.dto';
import { NoteRepositoryMock } from './helpers/note.repository.mock';

describe('noteService', () => {
  let service: NoteService;
  let noteRepositoryMock: Repository<Note>;
  const userMock: User = {
    id: 1,
    email: 'success@gmail.com',
    password: 'password',
    name: 'test_name',
    isActive: true,
    notes: [],
  };
  // const note: Note;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NoteService,
        {
          provide: getRepositoryToken(Note),
          useClass: NoteRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<NoteService>(NoteService);
    noteRepositoryMock = module.get<Repository<Note>>(getRepositoryToken(Note));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a note', async () => {
    const note: CreateNoteDto = {
      title: 'test_title',
      content: 'test_content',
    };
    const result = await service.create(note, userMock);
    expect(result).toEqual({
      id: expect.any(Number),
      title: note.title,
      content: note.content,
      user: userMock,
    });
  });
  it('should return all notes', async () => {
    const result = await service.findAll(
      { itemPerPage: 10, currentPage: 1, keyword: '' },
      userMock,
    );
    expect(result).toEqual({
      currentPage: 1,
      itemPerPage: 10,
      total: 1,
      notes: expect.any(Array),
    });
  });
  it('should return one note', async () => {
    const result = await service.findOne(1, userMock);
    expect(result).toEqual({
      id: expect.any(Number),
      title: 'note_title',
      content: 'note_content',
      user: userMock,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
  it('should update a note', async () => {
    const note: CreateNoteDto = {
      title: 'test_title',
      content: 'test_content',
    };
    const result = await service.update(1, note, userMock);
    expect(result).toEqual({
      id: expect.any(Number),
      title: note.title,
      content: note.content,
      user: userMock,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
  it('should delete a note', async () => {
    const result = await service.remove(1, userMock);
    expect(result).toEqual({
      message: 'Note deleted successfully',
      note: {
        id: expect.any(Number),
        title: 'note_title',
        content: 'note_content',
        user: userMock,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    });
  });
});
