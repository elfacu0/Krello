import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from "class-validator"

export class EditUserDto {
    @IsEmail()
    @IsOptional()
    email?: string

    @IsString()
    @IsOptional()
    @MinLength(4)
    @MaxLength(20)
    password?: string
}