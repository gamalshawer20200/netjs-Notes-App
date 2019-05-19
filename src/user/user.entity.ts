import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, BeforeInsert, OneToMany, ManyToMany, ManyToOne, JoinTable, RelationCount } from "typeorm";
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { NoteEntity } from "src/note/note.entity";

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

    @OneToMany(type => NoteEntity, note => note.user)
    notes: NoteEntity[]

    @ManyToMany(() => UserEntity, currentUser => currentUser.following)
    @JoinTable()
    followers: UserEntity[];

    @ManyToMany(() => UserEntity, currentUser => currentUser.followers)
    following: UserEntity[];

    // @RelationCount((currentUser: UserEntity) => currentUser.followers)
    // public followersCount: number;

    // @RelationCount((currentUser: UserEntity) => currentUser.following)
    // public followingCount: number;


    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10)
    }

    toResponseObject(showToken: boolean) {
        console.log(showToken)
        const { id, created, username, token, followers } = this
        const responseObject: any = { id, created, username, token: null, followers }
        if (showToken) {
            responseObject.token = token
        }
        if (this.notes) {
            responseObject.notes = this.notes
        }
        if (this.followers) {
            responseObject.followers = this.followers
        }
        return responseObject
    }

    async comparePassword(attempt: string) {
        let c = await bcrypt.compare(attempt, this.password)
        console.log('Res **** => ', c)
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