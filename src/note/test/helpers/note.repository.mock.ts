import { User } from '../../../auth/entities/user.entity';
import { CreateNoteDto } from '../../dto/create-note.dto';
import { Note } from '../../entities/note.entity';

export class NoteRepositoryMock {
  note: Note = {
    id: Math.random() * (1000 - 1) + 1,
    title: 'note_title',
    content: 'note_content',
    user: new User(),
    created_at: new Date(),
    updated_at: new Date(),
  };
  async create(createNoteDto: CreateNoteDto, user: User) {
    const note = {
      id: Math.random() * (1000 - 1) + 1,
      ...createNoteDto,
      user,
      created_at: new Date(),
      updated_at: new Date(),
    };
    return note;
  }
  async save(note: Note): Promise<Note> {
    return Promise.resolve(note);
  }
  async findAndCount(options: any) {
    return Promise.resolve([[this.note], 1]);
  }
  async findOne(options: any) {
    return Promise.resolve([
      {
        id: options.where.id,
        title: this.note.title,
        content: this.note.content,
        user: options.where.user,
        created_at: this.note.created_at,
        updated_at: this.note.updated_at,
      },
    ]);
  }
  async findOneBy(options: any) {
    return Promise.resolve({
      id: options.id,
      title: this.note.title,
      content: this.note.content,
      created_at: this.note.created_at,
      updated_at: this.note.updated_at,
    });
  }
  async delete(id: number) {
    return Promise.resolve({ id });
  }
}
