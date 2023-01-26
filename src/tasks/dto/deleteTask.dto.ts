import { IsNotEmpty, IsNumber } from "class-validator";

export class DeleteTaskDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;
}