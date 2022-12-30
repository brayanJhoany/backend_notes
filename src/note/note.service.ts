import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './entities/note.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { User } from 'src/auth/entities/user.entity';
import { NoteTransformer } from './serialization/note.transformer';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
    private noteTransformer: NoteTransformer,
  ) {}

  async create(createNoteDto: CreateNoteDto, user: User) {
    try {
      const note = this.noteRepository.create(createNoteDto);
      note.user = user;
      const noteBD = await this.noteRepository.save(note, { reload: true });
      return this.noteTransformer.transformNote(noteBD);
    } catch (error) {
      console.log(error);
      this.handlerException(error);
    }
  }

  async findAll(PaginationDto: PaginationDto, user: User) {
    const { itemPerPage, currentPage, keyword } = PaginationDto;
    if (!user) {
      throw new BadRequestException('User not found');
    }
    try {
      if (keyword) {
        const [notes, total] = await this.noteRepository.findAndCount({
          where: {
            user,
            title: Like(`%${keyword}%`),
          },
          skip: (currentPage - 1) * itemPerPage,
          take: itemPerPage,
          order: { id: 'DESC' },
        });
        return {
          currentPage,
          itemPerPage,
          total,
          notes: this.noteTransformer.transformNotes(notes),
        };
      } else {
        const [notes, total] = await this.noteRepository.findAndCount({
          where: { user },
          skip: (currentPage - 1) * itemPerPage,
          take: itemPerPage,
          order: { id: 'DESC' },
        });

        return {
          currentPage,
          itemPerPage,
          total,
          notes: this.noteTransformer.transformNotes(notes),
        };
      }
    } catch (error) {
      this.handlerException(error);
    }
  }

  async show(id: number, user: User) {
    try {
      const note = await this.noteRepository.findOneBy({ id: id, user: user });
      if (!note) {
        throw new NotFoundException(`Note with id ${id} not found.`);
      }
      return this.noteTransformer.transformNote(note);
    } catch (error) {
      this.handlerException(error);
    }
  }

  async update(id: number, updateNoteDto: UpdateNoteDto, user: User) {
    try {
      const note = await this.noteRepository.findOneBy({ id: id, user: user });
      if (!note) {
        throw new BadRequestException(`Note with id ${id} not found`);
      }
      let updateNote = Object.assign(note, updateNoteDto);
      updateNote = await this.noteRepository.save(updateNote);

      return this.noteTransformer.transformNote(updateNote);
    } catch (error) {
      console.log(error);
      this.handlerException(error);
    }
  }

  async remove(id: number, user: User) {
    //check id note exist and belong to user
    const note = await this.noteRepository.findOneBy({ id: id, user: user });
    if (!note) {
      throw new BadRequestException('Note not found');
    }
    await this.noteRepository.delete(id);
    return {
      message: 'Note deleted successfully',
      note: this.noteTransformer.transformNote(note),
    };
  }

  private handlerException(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException('Note already exists');
    }
    console.log(error);
    throw new InternalServerErrorException('Internal server error');
  }
}
