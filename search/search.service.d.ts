import { ElasticsearchService } from '@nestjs/elasticsearch';
export declare class SearchService {
    private readonly elasticService;
    constructor(elasticService: ElasticsearchService);
    autocomplete(input: string, limit: number, city?: string): Promise<{
        results: Record<string, any>;
        status: string;
    }>;
    geocode(input: any, limit: any): Promise<{
        results: Record<string, any>;
        status: string;
    }>;
    reverseGeocode(lat: any, long: any, radius: any): Promise<{
        results: Record<string, any>;
        status: string;
    }>;
    getAllCities(): Promise<any>;
    getById(id: any): Promise<{
        results: Record<string, any>;
        status: string;
    }>;
    normalizeResponseData(results: any, reverse_geocode?: any): Promise<any>;
    normalizeRewsponseDataOfData(results: any): Promise<any>;
    searchES(body: any, reverse_geocode?: any): Promise<{
        results: Record<string, any>;
        status: string;
    }>;
}
