import { Note } from 'src/note/entities/note.entity';
import { ExportNote } from 'src/note/interfaces/export-note';

export class NoteTransformerMock {
  transformNote(note: Note): any {
    return {
      id: note.id,
      title: note.title,
      content: note.content,
      created_at: new Date(note.created_at).toLocaleString(),
      updated_at: new Date(note.updated_at).toLocaleString(),
    };
  }
  transformNotes(notes: Note[]): ExportNote[] {
    return notes.map((note) => this.transformNote(note));
  }
}
