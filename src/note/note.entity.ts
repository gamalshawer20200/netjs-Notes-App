import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity('Note')
export class NoteEntity {
    @PrimaryGeneratedColumn('uuid') id: string;

    @CreateDateColumn({nullable:true}) created: Date;

    @Column('text') text: string;

    @Column({nullable:true}) photo: string;

    @Column('text') private: boolean;

    @Column({nullable:true}) ratenumber: number;
}