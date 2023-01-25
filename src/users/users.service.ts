import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { RepositoryService } from 'src/repository/repository.service';
import { EditUserDto } from './dto';

@Injectable()
export class UsersService {
    constructor(private readonly repository: RepositoryService) { }

    async getUser(username: string): Promise<User | undefined> {
        const user = await this.repository.user.findFirst({
            where: {
                username: username
            }
        });
        return user;
    }

    async getUserById(userId: number) {
        if (userId === undefined) throw new BadRequestException('parameter error', { cause: new Error(), description: 'userId needs to be a number' })
        const { hashedPassword, ...user } = await this.repository.user.findUnique({
            where: {
                id: userId
            }
        });
        return user;
    }

    async editUser(id: number, dto: EditUserDto) {
        const user: User = await this.repository.user.update({
            where: {
                id
            },
            data: {
                ...dto
            }
        })

    }
}
