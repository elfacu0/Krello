import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { RepositoryService } from '../repository/repository.service';
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
        try {
            const { hashedPassword, ...user } = await this.repository.user.findUnique({
                where: {
                    id: userId
                }
            });
            return user
        } catch (err) {
            throw new BadRequestException('Invalid user');
        }
    }

    async getUserTasks(userId: number) {
        if (userId === undefined) throw new BadRequestException('parameter error', { cause: new Error(), description: 'userId needs to be a number' })
        try {
            const { hashedPassword, ...user } = await this.repository.user.findUnique({
                where: {
                    id: userId
                },
                include: {
                    tasks: true
                }
            });
            return user.tasks;
        } catch (err) {
            throw new BadRequestException('Invalid user');
        }
    }


    async editUser(id: number, dto: EditUserDto) {
        try {
            const user: User = await this.repository.user.update({
                where: {
                    id
                },
                data: {
                    ...dto
                }
            })
            return user;
        } catch (err) {
            throw new BadRequestException('Invalid user');
        }
    }


    async deleteUser(id: number) {
        try {
            const deleteTasks = this.repository.task.deleteMany({
                where: {
                    userId: id
                },
            });

            const deleteUser = this.repository.user.delete({
                where: {
                    id
                }
            });

            return await this.repository.$transaction([deleteTasks, deleteUser]);
        } catch (err) {
            throw new BadRequestException('Invalid user');
        }

    }
}
