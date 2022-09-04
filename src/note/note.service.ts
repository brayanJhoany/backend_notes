import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './entities/note.entity';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
  ) {}

  async create(createNoteDto: CreateNoteDto) {
    try {
      const note = this.noteRepository.create(createNoteDto);
      await this.noteRepository.save(note);
      return note;
    } catch (error) {
      this.handlerException(error);
    }
  }

  async findAll() {
    const notes = await this.noteRepository.find({
      select: ['id', 'title', 'content'],
    });
    return notes;
  }

  async findOne(id: number) {
    try {
      const note = await this.noteRepository.find({
        where: { id },
        select: ['id', 'title', 'content'],
      });
      return note;
    } catch (error) {
      this.handlerException(error);
    }
  }

  async update(id: number, updateNoteDto: UpdateNoteDto) {
    try {
      const note = await this.noteRepository.findOneBy({ id: id });
      if (!note) {
        throw new BadRequestException('Note not found');
      }
      const updateNote = Object.assign(note, updateNoteDto);
      return await this.noteRepository.save(updateNote);
    } catch (error) {
      this.handlerException(error);
    }
  }

  remove(id: number) {
    this.noteRepository.delete(id);
  }
  private handlerException(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException('Note already exists');
    }
    throw new InternalServerErrorException('Internal server error');
  }
}
