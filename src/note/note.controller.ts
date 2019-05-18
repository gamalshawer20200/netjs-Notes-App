import { Controller, Get, Post, Put, Delete, Body, Param, UsePipes } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteDTO } from './note.dto';
import { ValidationPipe } from 'src/common/validation.pipe';

@Controller('api/notes')
export class NoteController {
    constructor(private noteService: NoteService) { }

    @Get()
    showAllNotes() {
        return this.noteService.showAll()
    }

    @Post()
    @UsePipes(new ValidationPipe())
    createNote(@Body() data: NoteDTO) {
        return this.noteService.create(data)
    }

    @Get(':id')
    readNote(@Param('id') id: string) {
        return this.noteService.read(id)
    }

    @Put(':id')
    @UsePipes(new ValidationPipe())
    updateNote(@Param('id') id: string, @Body() data: Partial<NoteDTO>) {
        return this.noteService.update(id, data)
    }

    @Delete(':id')
    destroyNote(@Param('id') id: string) {
        return this.noteService.destroy(id)
    }
}
