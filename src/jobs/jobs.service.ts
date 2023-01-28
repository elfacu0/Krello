import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CollectionsService } from '../collections/collections.service';

@Injectable()
export class JobsService {
    constructor(private collectionsService: CollectionsService) { }

    @Cron(CronExpression.EVERY_DAY_AT_NOON)
    async deleteExpiredCollections() {
        return await this.collectionsService.deleteExpiredCollections();
    }
}
