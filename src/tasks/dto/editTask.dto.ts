import { TaskStatus } from "@prisma/client";
import { IsNumber, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class EditTaskDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;
    
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    content: string;

    @IsNotEmpty()
    status: TaskStatus;
}