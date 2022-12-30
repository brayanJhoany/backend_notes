import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateNoteDto } from 'src/note/dto/create-note.dto';
import { Note } from 'src/note/entities/note.entity';

export class NoteServiceMock {
  note = {
    id: 1,
    title: 'Test note',
    content: 'Test note description',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  async create(note: CreateNoteDto, user: User) {
    return Promise.resolve({
      id: Math.floor(Math.random() * 100),
      ...note,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  async findAll(paginator: PaginationDto, user: User) {
    const { itemPerPage, currentPage } = paginator;
    return Promise.resolve({
      currentPage,
      itemPerPage,
      total: 1,
      notes: [this.note],
    });
  }
  async findOne(id: number, user: User) {
    return Promise.resolve(this.note);
  }
  async update(id: number, note: CreateNoteDto, user: User) {
    this.note.title = note.title;
    this.note.content = note.content;
    return Promise.resolve(this.note);
  }
  async remove(id: number, user: User): Promise<any> {
    const response = {
      message: 'Note deleted successfully',
    };
    return Promise.resolve(response);
  }
}
