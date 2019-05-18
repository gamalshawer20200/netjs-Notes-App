import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, BeforeInsert } from "typeorm";
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'

@Entity('user')
export class UserEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @CreateDateColumn()
    created: Date

    @Column({
        unique: true
    })
    username: string

    @Column('text')
    password: string

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10)
    }

    toResponseObject(showToken: boolean = true) {
        const { id, created, username, token } = this
        const responseObject = { id, created, username, token }
        if (showToken) {
            responseObject.token = token
        }
        return responseObject
    }

    async comparePassword(attempt: string) {
        let c = await bcrypt.compare(attempt, this.password)
        console.log('Res **** => ',c)
        return c
    }

    private get token() {
        const { id, username } = this
        return jwt.sign(
            {
                id,
                username
            },
            process.env.SECRET, { expiresIn: '7d' }
        )


    }


}