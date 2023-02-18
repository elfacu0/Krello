import { Controller, HttpCode, HttpStatus, Post, UseGuards, Request, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards';
import { CollectionsService } from './collections.service';
import { ImportCollectionDto } from './dto';

@ApiTags('collections')
@Controller('collections')
export class CollectionsController {
    constructor(private collectionsService: CollectionsService) { }

    @ApiOperation({ description: "Creates a collection of all the user tasks" })
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JwtAuthGuard)
    @Post("export")
    exportCollection(@Request() req) {
        const { user } = req;
        return this.collectionsService.exportCollection(user.id);
    }

    @ApiOperation({ description: "Imports all the tasks from a given collection" })
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @Post("import")
    importCollection(@Request() req, @Body() dto: ImportCollectionDto) {
        const { user } = req;
        return this.collectionsService.importCollection(user.id, dto.id);
    }
}
