import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteEntity } from 'src/note/note.entity';
import { UserEntity } from 'src/user/user.entity';
import { CommentEntity } from './comments.entity';

@Module({
  imports:[TypeOrmModule.forFeature([NoteEntity,UserEntity,CommentEntity])],
  controllers: [CommentsController],
  providers: [CommentsService]
})
export class CommentsModule {}
