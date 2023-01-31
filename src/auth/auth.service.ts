import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RepositoryService } from '../repository/repository.service';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto';
import { AccessToken, ValidUser } from './interfaces';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService,
        private readonly repository: RepositoryService,
        private readonly jwtService: JwtService) { }

    async validateUser(username: string, password: string): Promise<ValidUser | Error> {
        const user = await this.usersService.getUser(username);
        if (user === null) return null;
        const match = await bcrypt.compare(password, user.hashedPassword);

        if (match) {
            const { hashedPassword, ...result } = user;
            return result;
        }
        return null;
    }

    async register(dto: RegisterDto): Promise<ValidUser | Error> {
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
            delete user.hashedPassword;
            return user;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code == 'P2002') {
                throw new ForbiddenException("Credentials Taken");
            }
            throw error;
        }
    }

    async login(user: any): Promise<AccessToken | Error> {
        const payload = { username: user.username, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload)
        }
    }

    async refresh(user: any): Promise<AccessToken | Error> {
        const payload = { username: user.username, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload)
        }
    }
}
