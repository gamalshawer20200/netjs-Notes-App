import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './comments.entity';
import { Repository } from 'typeorm';
import { NoteEntity } from 'src/note/note.entity';
import { UserEntity } from 'src/user/user.entity';
import { CommentDTO } from './comments.dto';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(CommentEntity)
        private commentRepository: Repository<CommentEntity>,

        @InjectRepository(NoteEntity)
        private noteRepository: Repository<NoteEntity>,

        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ) { }

    private toResponseObject(comment: CommentEntity) {
        const responseObject: any = comment
        if (comment.user) {
            responseObject.user = comment.user.toResponseObject(false)
        }
        return responseObject
    }

    async showByNote(noteId: string) {
        const note = await this.noteRepository.findOne({ where: { id: noteId }, relations: ['comments', 'comments.user', 'comments.note'] })
        return note.comments.map(comment => this.toResponseObject(comment))
    }

    async showByUser(userId: string) {
        const comments = await this.commentRepository.find({ where: { user: { id: userId } }, relations: ['user'] })

        return comments.map(comment => this.toResponseObject(comment))
    }

    async show(noteId: string) {
        const comment = await this.commentRepository.findOne({ where: { id: noteId }, relations: ['user', 'note'] })
        return this.toResponseObject(comment)
    }

    async create(noteId: string, userId: string, data: CommentDTO) {
        const note = await this.noteRepository.findOne({ where: { id: noteId } })
        const user = await this.userRepository.findOne({ where: { id: userId } })
        console.log('*************************************************', user)
        const comment = await this.commentRepository.create({
            ...data,
            user,
            note,

        })
        await this.commentRepository.save(comment)
        console.log(comment)
        return this.toResponseObject(comment)
    }

    async destroy(noteId: string, userId: string) {
        const comment = await this.commentRepository.findOne({ where: { id: noteId }, relations: ['user', 'note'] })


        if (comment.user.id !== userId) {
            throw new HttpException('You do not own this comment', HttpStatus.UNAUTHORIZED)
        }

        await this.commentRepository.remove(comment)
        return this.toResponseObject(comment)
    }



}
