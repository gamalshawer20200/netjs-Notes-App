import { IsNotEmpty, IsInt } from "class-validator";

export class UserDTO {

    @IsNotEmpty()
    username: string

    @IsNotEmpty()
    password: string

    @IsInt()
    followingCount: number = 0

    @IsInt()
    followersCount: number = 0
}

export class UserRo {
    id?: string
    created?: Date
    password?: string
    username: string
    followingCount: number
    followersCount: number
}