import { HttpStatus } from '@nestjs/common';
import { SearchService } from './search.service';
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    search(keywords: string): Promise<{
        results: Record<string, any>;
        status: HttpStatus;
    }>;
    geocode(keywords: string, place_id: string, latlong: string): Promise<{
        results: Record<string, any>;
        status: HttpStatus;
    }>;
}
