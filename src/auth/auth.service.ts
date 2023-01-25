import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as bcrypt from 'bcrypt';
import { RepositoryService } from 'src/repository/repository.service';
import { UsersService } from 'src/users/users.service';
import { LoginDto, RegisterDto } from './dto';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService,
        private readonly repository: RepositoryService) { }

    async validateUser(username: string, password: string) {
        const user = await this.usersService.getUser(username);
        if (user === undefined) return null;
        const match = await bcrypt.compare(password, user.hashedPassword);

        if (match) {
            const { hashedPassword, ...result } = user;
            return result;
        }
        return null;
    }

    async register(dto: RegisterDto) {
        const { username, email, password, confirmPassword } = dto;
        if (password != confirmPassword) throw new ForbiddenException("Passwords doesnt match");
        const hashedPassword = await bcrypt.hash(password, 10);
        try {
            const user = await this.repository.user.create({
                data: {
                    username,
                    email,
                    hashedPassword
                }
            })
            return user;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code == 'P2002') {
                throw new ForbiddenException("Credentials Taken");
            }
            throw error;
        }
    }

    async login(dto: LoginDto) { }
}
