import { IsNotEmpty, IsNumber } from "class-validator";

export class ImportCollectionDto {
    @IsNotEmpty()
    id: number;
}