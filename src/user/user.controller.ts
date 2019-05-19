import { Controller, Post, Get, Body, UsePipes, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './user.dto';
import { ValidationPipe } from 'src/common/validation.pipe';
import { AuthGuard } from 'src/common/auth.gaurd';
import { User } from './user.decorator';

@Controller('api/users')
export class UserController {

    constructor(private userService: UserService) { }

    @Get()
    @UseGuards(new AuthGuard())
    showAllUsers(@User('username') user) {
        console.log('UserName:', user)
        return this.userService.showAll()
    }

    @Post('login')
    @UsePipes(new ValidationPipe())
    login(@Body() data: UserDTO) {
        return this.userService.login(data)
    }

    @Post('register')
    @UsePipes(new ValidationPipe())
    register(@Body() data: UserDTO) {
        return this.userService.register(data)
    }

    @Post('follow')
    @UseGuards(new AuthGuard())
    follow(@User('id') id: string, @Body() username: string) {
        // console.log('username' ,username['username'])
        // console.log("usertoken",id)
        return this.userService.follow(id, username['username'])
    }

    @Get('showfollowing')
    @UseGuards(new AuthGuard())
    showFollowing(@User('id') id: string){
        console.log(id)
        return this.userService.showFollowing(id)
    }

    @Get('showfollowers')
    @UseGuards(new AuthGuard())
    showFollowers(@User('id') id: string){
        console.log(id)
        return this.userService.showFollowers(id)
    }


}
