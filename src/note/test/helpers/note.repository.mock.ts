import { User } from '../../../auth/entities/user.entity';
import { CreateNoteDto } from '../../dto/create-note.dto';
import { Note } from '../../entities/note.entity';

export class NoteRepositoryMock {
  note: Note = {
    id: Math.random() * (1000 - 1) + 1,
    title: 'note_title',
    content: 'note_content',
    user: new User(),
  };
  create(createNoteDto: CreateNoteDto, user: User) {
    return {
      id: Math.random() * (1000 - 1) + 1,
      ...createNoteDto,
      user,
    };
  }
  save(note: Note): Promise<Note> {
    return Promise.resolve(note);
  }
  findAndCount(options: any) {
    return Promise.resolve([[this.note], 1]);
  }
  find(options: any) {
    return Promise.resolve([
      {
        id: options.where.id,
        title: this.note.title,
        content: this.note.content,
        user: options.where.user,
      },
    ]);
  }
  findOneBy(options: any) {
    return Promise.resolve({
      id: options.id,
      title: this.note.title,
      content: this.note.content,
      user: options.user,
    });
  }
  delete(id: number) {
    return Promise.resolve({ id });
  }
}
