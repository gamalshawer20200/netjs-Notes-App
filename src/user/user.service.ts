import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import * as

import { UserEntity } from './user.entity';
import { UserDTO } from './user.dto';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
    ) { }

    async showAll() {
        const users = await this.userRepository.find()
        return users.map(user => user.toResponseObject(false))
    }

    async login(data: UserDTO) {
        const { username, password } = data
        const user = await this.userRepository.findOne({ where: { username } })
        if (!user || !(await user.comparePassword(password))) {
            console.log('inside IF')
            throw new HttpException(
                'Invalid username/password',
                HttpStatus.BAD_REQUEST,
            )
        }
        console.log('Continue ************')

        return user.toResponseObject(true)
    }

    async register(data: UserDTO) {
        const { username } = data
        let user = await this.userRepository.findOne({ where: { username } })
        if (user) {
            throw new HttpException(
                'User already exist',
                HttpStatus.BAD_REQUEST
            )
        }
        user = await this.userRepository.create(data)
        await this.userRepository.save(user)
        return user.toResponseObject(true)

    }
}
