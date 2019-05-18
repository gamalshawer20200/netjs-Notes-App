import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { NoteDTO } from './note.dto';
import { NoteEntity } from './note.entity';


@Injectable()
export class NoteService {
    constructor(@InjectRepository(NoteEntity)
    private noteRepository: Repository<NoteEntity>) { }

    async showAll() {
        return await this.noteRepository.find()
    }

    async create(data: NoteDTO) {
        const note = await this.noteRepository.create(data)
        await this.noteRepository.save(note)
        return note
    }

    async read(id: string) {
        return await this.noteRepository.findOne({ where: {id} })
    }

    async update(id: string, data: Partial<NoteDTO>) {
        await this.noteRepository.update({ id }, data)
        return await this.noteRepository.findOne({ id })
    }

    async destroy(id: string) {
        await this.noteRepository.delete({ id })
        return { deleted: true }
    }

}
