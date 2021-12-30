import { HttpStatus } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
export declare class SearchService {
    private readonly elasticService;
    constructor(elasticService: ElasticsearchService);
    autocomplete(input: string, limit: number): Promise<{
        results: Record<string, any>;
        status: HttpStatus;
    }>;
    geocode(input: any, limit: any): Promise<{
        results: Record<string, any>;
        status: HttpStatus;
    }>;
    reverseGeocode(lat: any, long: any, radius: any): Promise<{
        results: Record<string, any>;
        status: HttpStatus;
    }>;
    getById(id: any): Promise<{
        results: Record<string, any>;
        status: HttpStatus;
    }>;
    normalizeResponseData(results: any, reverse_geocode?: any): Promise<any>;
    normalizeRewsponseDataOfData(results: any): Promise<any>;
    searchES(body: any, reverse_geocode?: any): Promise<{
        results: Record<string, any>;
        status: HttpStatus;
    }>;
}
