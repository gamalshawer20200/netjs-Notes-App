import { IsString, IsBoolean, IsInt } from 'class-validator'

export class NoteDTO {
    
    @IsString()
    text: string;

    @IsString()
    photo: string;
    
    @IsBoolean()
    private: boolean;
    
    @IsInt()
    ratenumber: number
}