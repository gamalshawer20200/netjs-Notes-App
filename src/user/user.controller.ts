import { Controller, Post, Get, Body, UsePipes, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './user.dto';
import { ValidationPipe } from 'src/common/validation.pipe';
import { AuthGuard } from 'src/common/auth.gaurd';
import { User } from './user.decorator';

@Controller('api/users')
export class UserController {

    constructor(private userService: UserService){}
    
    @Get()
    @UseGuards(new AuthGuard())
    showAllUsers(@User('username') user){
        console.log('UserName:',user)
       return this.userService.showAll()
    }

    @Post('login') 
    @UsePipes(new ValidationPipe())
    login(@Body() data:UserDTO){
        return this.userService.login(data)
    }

    @Post('register')
    @UsePipes(new ValidationPipe())
    register(@Body() data:UserDTO){
        return this.userService.register(data)
    }

    
    
}
