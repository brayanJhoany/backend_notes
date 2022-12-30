import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { NoteTransformer } from './serialization/note.transformer';

@Module({
  controllers: [NoteController],
  providers: [NoteService, NoteTransformer],
  imports: [TypeOrmModule.forFeature([Note])],
})
export class NoteModule {}
