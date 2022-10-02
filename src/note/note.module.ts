import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';

@Module({
  controllers: [NoteController],
  providers: [NoteService],
  imports: [TypeOrmModule.forFeature([Note])],
})
export class NoteModule {}
