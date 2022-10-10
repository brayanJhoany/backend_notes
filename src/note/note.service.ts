import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './entities/note.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
  ) {}

  async create(createNoteDto: CreateNoteDto, user: User) {
    try {
      const note = this.noteRepository.create(createNoteDto);
      note.user = user;
      await this.noteRepository.save(note);
      return note;
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
        return { currentPage, itemPerPage, total, notes };
      } else {
        const [notes, total] = await this.noteRepository.findAndCount({
          where: { user },
          skip: (currentPage - 1) * itemPerPage,
          take: itemPerPage,
          order: { id: 'DESC' },
        });
        return { currentPage, itemPerPage, total, notes };
      }
    } catch (error) {
      this.handlerException(error);
    }
  }

  async findOne(id: number, user: User) {
    try {
      const note = await this.noteRepository.find({
        where: {
          id,
          user,
        },
        select: ['id', 'title', 'content'],
      });
      return note[0] ?? null;
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
      const updateNote = Object.assign(note, updateNoteDto);
      return await this.noteRepository.save(updateNote);
    } catch (error) {
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
    return { message: 'Note deleted successfully', note };
  }
  private handlerException(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException('Note already exists');
    }
    console.log(error);
    throw new InternalServerErrorException('Internal server error');
  }
}
