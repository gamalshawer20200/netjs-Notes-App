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

    private followersToResponseObject(user: UserEntity) {
        return { ...user, followers: user.followers.map(follower => follower.toResponseObject(false)) }
    }

    async showAll() {
        const users = await this.userRepository.find({ relations: ['notes'] })
        return users.map(user => user.toResponseObject(false))
    }

    async login(data: UserDTO) {
        const { username, password } = data
        const user = await this.userRepository.findOne({ where: { username } })
        if (!user || !(await user.comparePassword(password))) {
            throw new HttpException(
                'Invalid username/password',
                HttpStatus.BAD_REQUEST,
            )
        }

        return user.toResponseObject(true)
    }

    async register(data: UserDTO) {
        const { username } = data
        let user = await this.userRepository.findOne({ where: { username } })
        if (user) {
            console.log('*************************** inside if')
            throw new HttpException(
                'User already exist',
                HttpStatus.BAD_REQUEST
            )
        }
        console.log('****************************** continue')
        user = await this.userRepository.create(data)
        await this.userRepository.save(user)
        return user.toResponseObject(true)

    }

    async follow(id: string, username: string) {
        const user = await this.userRepository.findOne({ where: { id } })
        const user2 = await this.userRepository.findOne({ where: { username } })
        let upData = { ...user2, followers: [user] }
        let connect = this.userRepository.merge(user2, { followers: [upData.followers[0]] })
        await this.userRepository.save(connect)
        return connect
    }

    async showFollowing(id: string) {
        const followers = await this.userRepository.find({ relations: ['followers'] })
        return followers.map(follower => {
            for (let y = 0; y < follower.followers.length; y++) {
                return follower.followers[y].id === id ? follower.toResponseObject(false) : null
            }
        })
    }

    async showFollowers(id: string) {
        const followers = await this.userRepository.find({ relations: ['followers'] })
        return followers.map(follower => (follower.id === id) ? follower.toResponseObject(false) : null)
    }
}

