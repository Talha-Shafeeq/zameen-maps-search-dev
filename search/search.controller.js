"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const search_service_1 = require("./search.service");
const _ = require("lodash");
let SearchController = class SearchController {
    constructor(searchService) {
        this.searchService = searchService;
    }
    async search(keywords) {
        return await this.searchService.autocomplete(keywords, 10);
    }
    async geocode(keywords, place_id, latlong) {
        if (place_id) {
            return await this.searchService.getById(place_id);
        }
        else if (latlong) {
            let latlong_array = latlong.split(',').map(l => Number(l));
            if (_.inRange(_.inRange(latlong_array[0], -90, 90.01) && latlong_array[0], -180, 180.01)) {
                return await this.searchService.reverseGeocode(latlong_array[0], latlong_array[1], '40m');
            }
        }
        else if (keywords) {
            return await this.searchService.geocode(keywords, 10);
        }
    }
};
__decorate([
    (0, swagger_1.ApiQuery)({
        name: 'keywords',
        example: 'Lahore'
    }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('keywords')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "search", null);
__decorate([
    (0, swagger_1.ApiQuery)({
        name: 'keywords',
        example: 'A24, Platinum City',
        required: false
    }),
    (0, swagger_1.ApiQuery)({
        name: 'place_id',
        example: 'pa_5XjZB',
        required: false
    }),
    (0, swagger_1.ApiQuery)({
        name: 'latlong',
        example: '31.473147656486006, 74.46626436265876',
        required: false
    }),
    (0, common_1.Get)('/geocode'),
    __param(0, (0, common_1.Query)('keywords')),
    __param(1, (0, common_1.Query)('place_id')),
    __param(2, (0, common_1.Query)('latlong')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "geocode", null);
SearchController = __decorate([
    (0, swagger_1.ApiTags)('Search'),
    (0, common_1.Controller)('search'),
    __metadata("design:paramtypes", [search_service_1.SearchService])
], SearchController);
exports.SearchController = SearchController;
//# sourceMappingURL=search.controller.js.map