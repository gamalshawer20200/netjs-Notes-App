import { Injectable, HttpException, HttpStatus, Param } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { NoteDTO } from './note.dto';
import { NoteEntity } from './note.entity';
import { UserEntity } from 'src/user/user.entity';
import { User } from 'src/user/user.decorator';
import { Votes } from 'src/common/votes.enum';


@Injectable()
export class NoteService {
    constructor(@InjectRepository(NoteEntity)
    private noteRepository: Repository<NoteEntity>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>) { }

    private toResponseObject(note: NoteEntity) {
        const ResponseObject: any = { ...note, user: note.user.toResponseObject(false) }
        if (ResponseObject.upvotes) {
            ResponseObject.upvotes = note.upvotes.length
        }
        if (ResponseObject.downvotes) {
            ResponseObject.downvotes = note.downvotes.length
        }
        return ResponseObject
    }

    private ensureOwnership(note: NoteEntity, userId: string) {
        if (note.user.id !== userId) {
            throw new HttpException('incorrect user', HttpStatus.UNAUTHORIZED)
        }
    }

    private async vote(note: NoteEntity, user: UserEntity, vote: Votes) {
        const opposite = vote === Votes.UP ? Votes.DOWN : Votes.UP
        if (
            note[opposite].filter(voter => voter.id === user.id).length > 0 ||
            note[vote].filter(voter => voter.id === user.id).length > 0
        ) {
            note[opposite] = note[opposite].filter(voter => voter.id !== user.id)
            note[vote].filter(voter => voter.id === user.id)
            await this.noteRepository.save(note)
        } else if (note[vote].filter(vooter => vooter.id === user.id).length < 1) {
            note[vote].push(user)
            await this.noteRepository.save(note)
        } else {
            throw new HttpException('Unable to cast Vote !', HttpStatus.BAD_REQUEST)
        }
        return note
    }

    async global() {
        const notes = await this.noteRepository.find({ relations: ['user', 'upvotes', 'downvotes'] })
        return notes.map(note => this.toResponseObject(note))
    }

    async showAll(id: string) {
        const notes = await this.noteRepository.find({ relations: ['user', 'upvotes', 'downvotes'] })
        return notes.map(note => {
            if (note.user.id == id) { return this.toResponseObject(note) }
        })
    }

    async create(userId: string, data: NoteDTO) {
        const user = await this.userRepository.findOne({ where: { id: userId } })
        const note = await this.noteRepository.create({ ...data, user: user })
        await this.noteRepository.save(note)
        return this.toResponseObject(note)
    }

    async read(id: string) {
        const note = await this.noteRepository.findOne({ where: { id }, relations: ['user', 'upvotes', 'downvotes'] })
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

    async bookmarkNote(userId: string, noteId: string) {

        let user = await this.userRepository.findOne({ where: { id: userId }, relations: ['bookmarks'] })
        console.log(user)
        const note = await this.noteRepository.findOne({ where: { id: noteId } })
        console.log(note)
        if (user.bookmarks.filter(bookmark => bookmark.id === note.id).length < 1) {
            user.bookmarks.push(note)
            await this.userRepository.save(user)

        } else {
            throw new HttpException('Note already bookmarked', HttpStatus.BAD_REQUEST)
        }
        return user

    }

    async unbookmarkNote(userId: string, noteId: string) {
        const note = await this.noteRepository.findOne({ where: { id: noteId } })
        const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['bookmarks'] })

        if (user.bookmarks.filter(bookmark => bookmark.id === note.id).length > 0) {
            user.bookmarks = user.bookmarks.filter(bookmark => bookmark.id !== note.id)
            await this.userRepository.save(user)
        } else {
            throw new HttpException('Note is not found', HttpStatus.BAD_REQUEST)
        }

        return user
    }

    async upvote(noteId: string, userId: string) {
        let note = await this.noteRepository.findOne({ where: { id: noteId }, relations: ['user', 'upvotes', 'downvotes'] })
        const user = await this.userRepository.findOne({ where: { id: userId } })

        note = await this.vote(note, user, Votes.UP)
        return this.toResponseObject(note)
    }

    async downvote(noteId: string, userId: string) {
        let note = await this.noteRepository.findOne({ where: { id: noteId }, relations: ['user', 'upvotes', 'downvotes'] })
        const user = await this.userRepository.findOne({ where: { id: userId } })

        note = await this.vote(note, user, Votes.DOWN)
        return this.toResponseObject(note)
    }

}
