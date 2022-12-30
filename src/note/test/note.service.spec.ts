import { Test, TestingModule } from '@nestjs/testing';
import { Note } from '../entities/note.entity';
import { NoteService } from '../note.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { CreateNoteDto } from '../dto/create-note.dto';
import { NoteRepositoryMock } from './helpers/note.repository.mock';
import { NoteTransformer } from '../serialization/note.transformer';
import { Repository } from 'typeorm';
import { NoteTransformerMock } from './helpers/note-transform-mock';

const mockNoteTransformer = () => ({
  transformNote: jest.fn(),
});

describe('NoteService', () => {
  let service: NoteService;
  let repository: Repository<Note>;
  // let noteTransformer: NoteTransformer;

  const userMock: User = {
    id: 1,
    email: 'success@gmail.com',
    password: 'password',
    name: 'test_name',
    isActive: true,
    notes: [],
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NoteService,
        // NoteTransformer,
        {
          provide: getRepositoryToken(Note),
          useClass: NoteRepositoryMock,
        },
        {
          provide: NoteTransformer,
          useClass: NoteTransformerMock,
        },
      ],
    }).compile();

    service = module.get<NoteService>(NoteService);
    repository = module.get<Repository<Note>>(getRepositoryToken(Note));

    // noteTransformer = module.get<NoteTransformer>(NoteTransformer);
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
    const date = new Date().toLocaleString();
    expect(result).toEqual({
      id: expect.any(Number),
      title: note.title,
      content: note.content,
      created_at: date,
      updated_at: date,
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
    const result = await service.show(1, userMock);
    expect(result).toEqual({
      id: expect.any(Number),
      title: 'note_title',
      content: 'note_content',
      created_at: expect.any(String),
      updated_at: expect.any(String),
    });
  });
  it('should update a note', async () => {
    const date = new Date().toLocaleString();
    const note: CreateNoteDto = {
      title: 'test_title',
      content: 'test_content',
    };
    const result = await service.update(1, note, userMock);
    expect(result).toEqual({
      id: expect.any(Number),
      title: note.title,
      content: note.content,
      created_at: expect.any(String),
      updated_at: date,
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
        created_at: expect.any(String),
        updated_at: expect.any(String),
      },
    });
  });
});
