import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, UpdateDateColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm'
import { UserEntity } from 'src/user/user.entity';
import { CommentEntity } from 'src/comments/comments.entity';

@Entity('Note')
export class NoteEntity {
    @PrimaryGeneratedColumn('uuid') id: string;

    @CreateDateColumn({ nullable: true }) created: Date;

    @UpdateDateColumn()
    updated: Date

    @Column('text') text: string;

    @Column({ nullable: true }) photo: string;

    @Column('text') private: boolean;

    @Column({ nullable: true }) ratenumber: number;

    @ManyToOne(type => UserEntity, user => user.notes)
    user: UserEntity

    @ManyToMany(type => UserEntity, { cascade: true })
    @JoinTable()
    upvotes: UserEntity[]

    @ManyToMany(type => UserEntity, { cascade: true })
    @JoinTable()
    downvotes: UserEntity[]

    @OneToMany(type => CommentEntity, comment => comment.note, { cascade: true })
    comments: CommentEntity[]

}