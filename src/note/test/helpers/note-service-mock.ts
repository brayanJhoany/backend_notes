import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateNoteDto } from 'src/note/dto/create-note.dto';
import { Note } from 'src/note/entities/note.entity';

export class NoteServiceMock {
  note: Note = {
    id: 1,
    title: 'Test note',
    content: 'Test note description',
    user: {
      id: 1,
      email: 'success@gmail.com',
      password: 'password',
      name: 'test_name',
      isActive: true,
      notes: [],
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  async create(note: CreateNoteDto, user: User): Promise<Note> {
    return Promise.resolve(this.note);
  }
  async findAll(
    paginator: PaginationDto,
    user: User,
  ): Promise<
    | {
        currentPage: number;
        itemPerPage: number;
        total: number;
        notes: Note[];
      }
    | undefined
  > {
    const { itemPerPage, currentPage } = paginator;
    return Promise.resolve({
      currentPage,
      itemPerPage,
      total: 1,
      notes: [this.note],
    });
  }
  async findOne(id: number, user: User): Promise<Note> {
    return Promise.resolve(this.note);
  }
  async update(id: number, note: CreateNoteDto, user: User): Promise<Note> {
    this.note.title = note.title;
    this.note.content = note.content;
    return Promise.resolve(this.note);
  }
  async remove(id: number, user: User): Promise<any> {
    const response = {
      message: 'Note deleted successfully',
      note: this.note,
    };
    return Promise.resolve(response);
  }
}
