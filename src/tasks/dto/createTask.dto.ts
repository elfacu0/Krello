import { TaskStatus } from "@prisma/client";
import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator"

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    content: string;

    @IsNotEmpty()
    status: TaskStatus;
}