import { Controller, Get, Param, Post, UseGuards, UsePipes, Body, Delete } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from 'src/common/auth.gaurd';
import { ValidationPipe } from 'src/common/validation.pipe';
import { User } from 'src/user/user.decorator';
import { CommentDTO } from './comments.dto';

@Controller('api/comments')
export class CommentsController {
    constructor(private commentservice: CommentsService) { }

    @Get('note/:id')
    showCommentByNote(@Param('id') noteId: string) {
        console.log('Im Here !')
        return this.commentservice.showByNote(noteId)
    }

    @Get('user/:id')
    showCommentByUser(@Param('id') userId: string) {
        return this.commentservice.showByUser(userId)
    }

    @Post('note/:id')
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    createComment(@Param('id') noteId: string, @User('id') userId: string, @Body() data: CommentDTO) {
        return this.commentservice.create(noteId, userId, data)
    }

    @Get(':id')
    showComment(@Param('id') noteId: string) {
        return this.commentservice.show(noteId)
    }

    @Delete(':id')
    @UseGuards(new AuthGuard())
    destroyComment(@Param('id') noteId: string, @User('id') userId: string) {
        return this.commentservice.destroy(noteId, userId)
    }

}
