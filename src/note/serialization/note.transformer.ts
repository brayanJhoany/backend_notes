import { Note } from '../entities/note.entity';
import { Injectable } from '@nestjs/common';
import { ExportNote } from '../interfaces/export-note';

@Injectable()
export class NoteTransformer {
  transformNote(note: Note) {
    return {
      id: note.id,
      title: note.title,
      content: note.content,
      created_at: new Date(note.created_at).toLocaleString(),
      updated_at: new Date(note.updated_at).toLocaleString(),
    } as ExportNote;
  }
  transformNotes(notes: Note[]): ExportNote[] {
    return notes.map((note) => this.transformNote(note));
  }
}
