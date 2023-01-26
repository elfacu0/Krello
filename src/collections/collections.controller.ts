import { Controller, HttpCode, HttpStatus, Post, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CollectionsService } from './collections.service';

@Controller('collections')
export class CollectionsController {
    constructor(private collectionsService: CollectionsService) { }

    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @Post("/export")
    exportCollection(@Request() req) {
        const { user } = req;
        return this.collectionsService.exportCollection(user.id);
    }
}
