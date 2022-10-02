import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateNoteDto } from '../dto/create-note.dto';
import { NoteController } from '../note.controller';
import { NoteService } from '../note.service';
import { NoteServiceMock } from './helpers/note-service-mock';
import { toArray } from 'rxjs';

describe('noteController', () => {
  let controller: NoteController;
  let service: NoteService;
  const userMock: User = {
    id: 1,
    email: 'success@gmail.com',
    password: 'password',
    name: 'test_name',
    isActive: true,
    notes: [],
  };

  beforeEach(async () => {
    const noteServiceProvider = {
      provide: NoteService,
      useClass: NoteServiceMock,
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NoteController],
      providers: [NoteService],
    })
      .overrideProvider(NoteService)
      .useClass(NoteServiceMock)
      .compile();

    controller = module.get<NoteController>(NoteController);
    service = module.get<NoteService>(NoteService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should create a new note', async () => {
    const noteDto: CreateNoteDto = {
      title: 'Test note',
      content: 'Test note description',
    };
    const result = await controller.create(noteDto, userMock);
    expect(result).toEqual({
      id: expect.any(Number),
      title: noteDto.title,
      content: noteDto.content,
      user: userMock,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
  it('should return all notes', async () => {
    const paginatorDto: PaginationDto = {
      itemPerPage: 10,
      currentPage: 1,
      keyword: '',
    };
    const result = await controller.findAll(paginatorDto, userMock);
    expect(result).toEqual({
      notes: [
        {
          id: expect.any(Number),
          title: 'Test note',
          content: 'Test note description',
          user: userMock,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      ],
      total: 1,
      currentPage: paginatorDto.currentPage,
      itemPerPage: paginatorDto.itemPerPage,
    });
  });
  it('should return a note by id', async () => {
    const result = await controller.findOne('1', userMock);
    expect(result).toEqual({
      id: expect.any(Number),
      title: 'Test note',
      content: 'Test note description',
      user: userMock,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
  it('should update a note', async () => {
    const noteDto: CreateNoteDto = {
      title: 'Test note updated',
      content: 'Test note description updated',
    };
    const result = await controller.update('1', noteDto, userMock);
    expect(result).toEqual({
      id: expect.any(Number),
      title: noteDto.title,
      content: noteDto.content,
      user: userMock,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
  it('should delete a note', async () => {
    const result = await controller.remove('1', userMock);
    expect(result).toEqual({
      message: 'Note deleted successfully',
      note: {
        id: expect.any(Number),
        title: 'Test note',
        content: 'Test note description',
        user: userMock,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    });
  });
});
