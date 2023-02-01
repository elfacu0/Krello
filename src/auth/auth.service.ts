import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RepositoryService } from '../repository/repository.service';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto } from './dto';
import { AccessToken, Tokens, ValidUser } from './interfaces';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService,
        private readonly repository: RepositoryService,
        private readonly jwtService: JwtService) { }


    async generateAccessToken(user: any) {
        const payload = { username: user.username, sub: user.id };
        return await this.jwtService.signAsync(payload, { expiresIn: '15m', secret: jwtConstants.secret });
    }

    async generateRefreshToken(user: any) {
        const payload = { username: user.username, sub: user.id };
        return await this.jwtService.signAsync(payload, { expiresIn: '7d', secret: jwtConstants.rtSecret });
    }

    async generateTokens(user: any): Promise<Tokens> {
        const accessToken = await this.generateAccessToken(user);
        const refreshToken = await this.generateRefreshToken(user);
        return {
            access_token: accessToken,
            refresh_token: refreshToken
        }
    }

    async updateRefreshToken(userId: number, refreshToken: string) {
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.repository.user.updateMany({
            where: {
                id: userId
            },
            data: {
                hashedRefreshToken
            }
        })
    }

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

    async register(dto: RegisterDto): Promise<Tokens | Error> {
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

            const token = this.generateTokens(user);
            return { id: user.id, ...token };

        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code == 'P2002') {
                throw new ForbiddenException("Credentials Taken");
            }
            throw error;
        }
    }

    async login(user: any): Promise<Tokens | Error> {
        const tokens = await this.generateTokens(user);
        this.updateRefreshToken(user.id, tokens.refresh_token);
        return tokens;
    }

    async refresh(user: any): Promise<AccessToken | Error> {
        const { hashedRefreshToken } = await this.usersService.getUserById(user.id);
        const { refreshToken } = user;
        if (hashedRefreshToken === null) throw new ForbiddenException("User is not Logged in");

        const match = await bcrypt.compare(refreshToken, hashedRefreshToken);

        if (match === false) throw new ForbiddenException("Invalid Refresh Token");

        const accessToken = await this.generateAccessToken(user);
        return { access_token: accessToken };
    }

    async logout(user: any) {
        const { id } = user;
        await this.repository.user.updateMany({
            where: {
                id,
                hashedRefreshToken: {
                    not: null
                }
            },
            data: {
                hashedRefreshToken: null
            }
        })
    }
}
