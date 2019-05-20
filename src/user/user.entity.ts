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

    @Column({ nullable: true })
    followingCount: number
    @Column({ nullable: true })
    followersCount: number

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
    // followingCount: number;


    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10)
    }

    toResponseObject(showToken: boolean) {
        const { id, created, username, token, following, followers,followersCount, followingCount } = this
        const responseObject: any = { username, followersCount, followingCount,followers,following }
        if (showToken) {
            responseObject.token = token
            responseObject.created = created
            responseObject.id = id
        }
        if (this.notes) {
            responseObject.notes = this.notes
        }
        
        if (this.followers) {
            responseObject.followers= this.followers
        }
        if (this.following) {
            responseObject.following = this.following
        }
        

        if (this.followersCount) {
            responseObject.followingCount = this.followingCount
        }
        if (this.followersCount) {
            responseObject.followerscount = this.followersCount
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