import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NoteController } from './note.controller';
import { NoteService } from './note.service';
import { NoteEntity } from './note.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NoteEntity])],
  controllers: [NoteController],
  providers: [NoteService]
})
export class NoteModule {}

