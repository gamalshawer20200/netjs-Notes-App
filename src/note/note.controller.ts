import { Controller, Get, Post, Put, Delete, Body, Param, UsePipes, UseGuards } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteDTO } from './note.dto';
import { ValidationPipe } from 'src/common/validation.pipe';
import { AuthGuard } from 'src/common/auth.gaurd';
import { User } from 'src/user/user.decorator';
import { userInfo } from 'os';

@Controller('api/notes')
export class NoteController {
    constructor(private noteService: NoteService) { }

    @Get()
    ShowAll() {
        return this.noteService.global()
    }

    @Get('timeline')
    @UseGuards(new AuthGuard())
    showAllNotes(@User('id') id: string) {
        return this.noteService.showAll(id)
    }

    @Post()
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    createNote(@User('id') user, @Body() data: NoteDTO) {
        console.log(`user : ${user} , data: ${data}`)
        return this.noteService.create(user, data)
    }

    @Get(':id')
    readNote(@Param('id') id: string) {
        return this.noteService.read(id)
    }

    @Put(':id')
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    updateNote(@Param('id') id: string, @User('id') user: string, @Body() data: Partial<NoteDTO>) {
        console.log(id, user)
        return this.noteService.update(id, user, data)
    }

    @Delete(':id')
    @UseGuards(new AuthGuard())
    destroyNote(@Param('id') id: string, @User('id') user) {
        console.log(user, id)
        return this.noteService.destroy(id, user)
    }

    @Post('bookmark/:id')
    @UseGuards(new AuthGuard())
    addBookmark(@User('id') userId, @Param('id') noteId) {
        return this.noteService.bookmarkNote(userId, noteId)
    }

    @Delete('bookmark/:id')
    @UseGuards(new AuthGuard())
    DeleteBookmark(@User('id') userId, @Param('id') noteId) {
        return this.noteService.unbookmarkNote(userId, noteId)
    }

    @Post('upvote/:id')
    @UseGuards(new AuthGuard())
    upvoteNote(@Param('id') noteId: string, @User('id') userId: string) {
        return this.noteService.upvote(noteId,userId)
    }

    @Post('downvote/:id')
    @UseGuards(new AuthGuard())
    downvoteNote(@Param('id') noteId: string, @User('id') userId: string) {
        return this.noteService.downvote(noteId,userId)
    }


}
