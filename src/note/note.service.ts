import { Injectable, HttpException, HttpStatus, Param } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { NoteDTO } from './note.dto';
import { NoteEntity } from './note.entity';
import { UserEntity } from 'src/user/user.entity';
import { User } from 'src/user/user.decorator';
import { userInfo } from 'os';


@Injectable()
export class NoteService {
    constructor(@InjectRepository(NoteEntity)
    private noteRepository: Repository<NoteEntity>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>) { }

    private toResponseObject(note: NoteEntity) {
        return { ...note, user: note.user.toResponseObject(false) }
    }

    private ensureOwnership(note: NoteEntity, userId: string) {
        if (note.user.id !== userId) {
            throw new HttpException('incorrect user', HttpStatus.UNAUTHORIZED)
        }
    }

    async global () {
        const notes = await this.noteRepository.find({ relations: ['user']})
        return notes.map(note => this.toResponseObject(note))
    }

    async showAll(id :string) {
        const notes = await this.noteRepository.find({ relations: ['user'] })
        return notes.map(note => {
            if(note.user.id == id)
            {return this.toResponseObject(note)}
        })
    }

    async create(userId: string, data: NoteDTO) {
        const user = await this.userRepository.findOne({ where: { id: userId } })
        const note = await this.noteRepository.create({ ...data, user: user })
        await this.noteRepository.save(note)
        return this.toResponseObject(note)
    }

    async read(id: string) {
        const note = await this.noteRepository.findOne({ where: { id } })
        if (!note) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
        }
        return note
    }

    async update(id: string, userId: string, data: Partial<NoteDTO>) {
        const note = await this.noteRepository.findOne({ where: { id }, relations: ['user'] })
        if (!note) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
        }
        this.ensureOwnership(note, userId)
        await this.noteRepository.update({ id }, data)
        return await this.noteRepository.findOne({ id })
    }

    async destroy(id: string, userId: string) {
        const note = await this.noteRepository.findOne({ where: { id }, relations: ['user'] })
        if (!note) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
        }
        this.ensureOwnership(note, userId)
        await this.noteRepository.delete({ id })
        return this.toResponseObject(note)
    }

}
