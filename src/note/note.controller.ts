import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteDTO } from './note.dto';

@Controller('note')
export class NoteController {
    constructor(private noteService: NoteService) { }

    @Get()
    showAllNotes() {
        return this.noteService.showAll()
    }

    @Post()
    createNote(@Body() data: NoteDTO) {
        return this.noteService.create(data)
    }

    @Get(':id')
    readNote(@Param('id') id: string) {
        return this.noteService.read(id)
    }

    @Put(':id')
    updateNote(@Param('id') id: string, @Body() data: Partial<NoteDTO>) {
        return this.noteService.update(id, data)
    }

    @Delete(':id')
    destroyNote(@Param('id') id: string) {
        return this.noteService.destroy(id)
    }
}
