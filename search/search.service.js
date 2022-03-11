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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const elasticsearch_1 = require("@nestjs/elasticsearch");
let SearchService = class SearchService {
    constructor(elasticService) {
        this.elasticService = elasticService;
    }
    async autocomplete(input, limit, city, society) {
        let body;
        if (city && society) {
            body = {
                "query": {
                    "bool": {
                        "must": [
                            {
                                "multi_match": {
                                    "query": input,
                                    "type": "most_fields",
                                    "fields": [
                                        "name1.autocomplete^3",
                                        "city^4",
                                        "address.autocomplete^6"
                                    ],
                                    "fuzziness": "AUTO"
                                }
                            },
                            {
                                "match": {
                                    "city": city
                                }
                            },
                            {
                                "match": {
                                    "city": society
                                }
                            }
                        ]
                    }
                },
                "highlight": {
                    "fields": {
                        "name1.autocomplete": {}
                    }
                },
                "size": limit
            };
        }
        else if (city) {
            body = {
                "query": {
                    "bool": {
                        "must": [
                            {
                                "multi_match": {
                                    "query": input,
                                    "type": "most_fields",
                                    "fields": [
                                        "name1.autocomplete^3",
                                        "city^4",
                                        "address.autocomplete^6"
                                    ],
                                    "fuzziness": "AUTO"
                                }
                            },
                            {
                                "match": {
                                    "city": city
                                }
                            }
                        ]
                    }
                },
                "highlight": {
                    "fields": {
                        "name1.autocomplete": {}
                    }
                },
                "size": limit
            };
        }
        else {
            body = {
                "query": {
                    "bool": {
                        "must": [
                            {
                                "multi_match": {
                                    "query": input,
                                    "type": "most_fields",
                                    "fields": [
                                        "name1.autocomplete^3",
                                        "city^4",
                                        "address.autocomplete^6"
                                    ],
                                    "fuzziness": "AUTO"
                                }
                            }
                        ]
                    }
                },
                "highlight": {
                    "fields": {
                        "name1.autocomplete": {}
                    }
                },
                "size": limit
            };
        }
        return await this.searchES(body);
    }
    async geocode(input, limit) {
        let body = {
            "query": {
                "bool": {
                    "must": [
                        {
                            "multi_match": {
                                "query": input,
                                "type": "most_fields",
                                "fields": [
                                    "name1.autocomplete^3",
                                    "city^4",
                                    "address.autocomplete^6"
                                ],
                                "fuzziness": "AUTO"
                            }
                        }
                    ]
                }
            },
            "highlight": {
                "fields": {
                    "name1.autocomplete": {}
                }
            },
            "size": limit
        };
        return await this.searchES(body, true);
    }
    async reverseGeocode(lat, long, radius) {
        let body = {
            "query": {
                "bool": {
                    "filter": {
                        "geo_distance": {
                            "distance": radius,
                            "geometry.coordinates": {
                                "lat": lat,
                                "lon": long
                            }
                        }
                    }
                }
            },
            "sort": [
                {
                    "_geo_distance": {
                        "geometry.coordinates": {
                            "lat": lat,
                            "lon": long
                        },
                        "order": "asc",
                        "unit": "m"
                    }
                }
            ]
        };
        return await this.searchES(body, true);
    }
    async getAllCities() {
        let body = {
            "size": 0,
            "aggs": {
                "cities": {
                    "terms": {
                        "field": "city",
                        "size": 10
                    }
                }
            }
        };
        const { body: { aggregations } } = await this.elasticService.search({
            index: process.env.ES_INDEX,
            body,
        });
        return aggregations.cities.buckets.map(city => city.key);
    }
    async getSocitiesOfCities(city) {
        let body = {
            "size": 1000,
            "query": {
                "term": {
                    "city": {
                        "value": city
                    }
                }
            }
        };
        const { body: { hits } } = await this.elasticService.search({
            index: 'socities',
            body,
        });
        return hits.hits.map(s => (s._source.society));
    }
    async getById(id) {
        let body = {
            "query": {
                "terms": {
                    "_id": [id]
                }
            }
        };
        return await this.searchES(body, true);
    }
    async normalizeResponseData(results, reverse_geocode) {
        return await results.map(result => {
            if (result._source.geometry) {
                let _a = result._source, { name, address, name1, address1, geometry: { coordinates } } = _a, remainings = __rest(_a, ["name", "address", "name1", "address1", "geometry"]);
                let highlight;
                if (result.highlight) {
                    highlight = result.highlight['name1.autocomplete'][0];
                }
                if (reverse_geocode) {
                    return Object.assign(Object.assign({ name }, remainings), { address: address1, highlight, geometry: coordinates });
                }
                else {
                    return Object.assign(Object.assign({ name }, remainings), { address: address1, highlight });
                }
            }
            else {
            }
        });
    }
    async normalizeRewsponseDataOfData(results) {
        return await results.map(result => {
            let _a = result._source, { name, address, name1, address1, geometry: { coordinates } } = _a, remainings = __rest(_a, ["name", "address", "name1", "address1", "geometry"]);
            let highlight;
            if (result.highlight) {
                highlight = result.highlight['name1.autocomplete'][0];
            }
            return Object.assign(Object.assign({ name }, remainings), { address: address1, highlight, geometry: coordinates });
        });
    }
    async searchES(body, reverse_geocode) {
        try {
            let { body: results } = await this.elasticService.search({
                index: process.env.ES_INDEX,
                body,
            });
            results = await this.normalizeResponseData(results.hits.hits, reverse_geocode);
            return {
                results,
                status: 'OK'
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException();
        }
    }
};
SearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [elasticsearch_1.ElasticsearchService])
], SearchService);
exports.SearchService = SearchService;
//# sourceMappingURL=search.service.js.map