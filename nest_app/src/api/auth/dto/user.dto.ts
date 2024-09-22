import { IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator';

// only non-nullable fields of User table 

export class UserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;

}