import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, ManyToMany, JoinTable, ManyToOne } from "typeorm";
import { UserEntity } from "src/user/user.entity";
import { NoteEntity } from "src/note/note.entity";

@Entity('Comments')
export class CommentEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @CreateDateColumn()
    created: Date

    @Column('text')
    comment: string

    @ManyToOne(type => UserEntity)
    @JoinTable()    //we don't ned to update user entty so we dont type any thing beside type => UserEntity
    user: UserEntity

    @ManyToOne(type => NoteEntity, note => note.comments) //we ned to update noteEntity
    note: NoteEntity

}