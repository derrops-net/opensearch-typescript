import * as os from "@opensearch-project/opensearch"
import { TypescriptOSProxyClient } from "./typescriptOS"

import { ServerLog } from "./tests/ServerLog"

import * as q from "./search"
import { ResponseParser } from "./search"
import { makeClientWithEndpoint } from "./testUtil"


const INDEX_LOGS = "opensearch_dashboards_sample_data_logs"

var esClient: os.Client
var tsClient: TypescriptOSProxyClient

beforeAll(async () => {
    esClient = await makeClientWithEndpoint()
    tsClient = new TypescriptOSProxyClient(esClient)
})


type CountAllQuery = q.Search<ServerLog, {
    total: {
        agg: "value_count"
    }
}>

const countAll: CountAllQuery = {
    "query": {
        "match_all": {

        }
    },
    "aggs": {
        "total": {
            "value_count": {
                "field": "_id"
            }
        }
    },
    "size": 0
}



const exampleTopHitMax: q.Search<ServerLog, {

    agents: {
        agg: "terms",
        aggs: {
            maxValue: {
                agg: "max"
            },
            minValue: {
                agg: "min"
            },
            maxHits: {
                agg: "top_hits"
            },
            minHits: {
                agg: "top_hits"
            }
        }
    },


}> = {
    "size": 0,
    "aggs": {

        "agents": {
            "terms": {
                "field": "agent.keyword",
            },
            "aggs": {

                "maxValue": {
                    "max": {
                        "field": "@timestamp"
                    }
                },
                "maxHits": {
                    "top_hits": {
                        "size": 1,
                        "sort": [
                            {
                                "@timestamp": {
                                    "order": "desc"
                                }
                            }
                        ]
                    }
                },
                "minValue": {
                    "min": {
                        "field": "@timestamp"
                    }
                },
                "minHits": {
                    "top_hits": {
                        "size": 1,
                        "sort": [
                            {
                                "@timestamp": {
                                    "order": "asc"
                                }
                            }
                        ]
                    }
                }

            }
        }



    },

    query: {
        "match_all": {

        }
    }

}




const searchMatchAll: q.Search<ServerLog, {}> = {
    query: {
        "match_all": {

        }
    }
}


const searchExample: q.Search<ServerLog, {
    exampleDateHist: {
        agg: "date_histogram",
        aggs: {
            "agentTerms": {
                agg: "terms",

            }
        }
    },
    adjacency: {
        agg: "adjacency_matrix"
    },
    test: {
        agg: "terms",
        aggs: {
            "innerTest": {
                agg: "extended_stats"
            },
            "somethingMore": {
                agg: "terms",
                aggs: {
                    "minValue": {
                        agg: "min"
                    },
                    "minHits": {
                        agg: "top_hits"
                    },
                    "maxValue": {
                        agg: "max"
                    },
                    "maxHits": {
                        agg: "top_hits"
                    }
                }
            }
        }
    }
}> = {
    index: INDEX_LOGS,
    _source: {
        includes: [
            "bytes",
            "utc_time"
        ]
    },
    query: {
        bool: {
            must: [
                {
                    "terms":
                    {
                        "agent.keyword": [
                            "Mozilla/5.0 (X11; Linux x86_64; rv:6.0a1) Gecko/20110421 Firefox/6.0a1",
                            "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322)",
                        ]
                    }
                },
                {
                    "range": {
                        "@timestamp": {
                            "lte": "2025-01-25T03:41:11.215Z",
                            "gte": new Date("2005-01-25T03:41:11.215Z")
                        }
                    }
                }
            ],
            "minimum_should_match": 2,
            "should": [
                {
                    "term": {
                        "tags.keyword": "login"
                    }
                },
                {
                    "term": {
                        "tags.keyword": "success"
                    }
                }
            ]
        }
    },
    aggs: {
        "exampleDateHist": {
            "date_histogram": {
                "interval": "3d",
                "field": "timestamp"
            },
            "aggs": {
                "agentTerms": {
                    "terms": {
                        "field": "agent.keyword",
                    }
                }
            }
        },
        "adjacency": {
            "adjacency_matrix": {
                "filters": {
                    "linux": {
                        "match": {
                            "agent.keyword": "Mozilla/5.0 (X11; Linux x86_64; rv:6.0a1) Gecko/20110421 Firefox/6.0a1",
                        }
                    },
                    "windows": {
                        "match": {
                            "agent.keyword": "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322)",
                        }
                    }
                }
            }

        },
        "test": {
            "terms": {
                "field": "agent.keyword"
            },
            "aggs": {
                "innerTest": {
                    "extended_stats": {
                        "field": "bytes"
                    }
                },
                "somethingMore": {
                    "terms": {
                        "field": "referer.keyword"
                    },
                    "aggs": {
                        "maxValue": {
                            "max": {
                                "field": "@timestamp"
                            }
                        },
                        "maxHits": {
                            "top_hits": {
                                "size": 2,
                                "sort": [
                                    {
                                        "@timestamp": {
                                            "order": "desc"
                                        }
                                    }
                                ]
                            }
                        },
                        "minValue": {
                            "min": {
                                "field": "@timestamp"
                            }
                        },
                        "minHits": {
                            "top_hits": {
                                "size": 1,
                                "sort": [
                                    {
                                        "@timestamp": {
                                            "order": "asc"
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            }
        }
    },
    "size": 10
}
export const queries = [
    {},
    searchExample,
    {},
    searchMatchAll,
];


test("normal count", async () => {
    const response = await tsClient.countTs({ body: {}, index: INDEX_LOGS })
    response.count
    response._shards.total
    response._shards.failed
    response._shards.skipped
    response._shards.successful
    console.log(JSON.stringify(response, null, 2))
})


test("agg count all documents", async () => {
    const response = await tsClient.searchTS({ body: countAll, index: INDEX_LOGS })
    console.log(response.aggregations.total.value)
    console.log(JSON.stringify(response, null, 2))
})


test("msearchTS", async () => {
    const response = await tsClient.msearchTS([
        searchExample,
        searchMatchAll,
    ], INDEX_LOGS)

    const searchExampleResponse = new ResponseParser(searchExample).parseSearchResponse(response[0])

    console.log(JSON.stringify(searchExampleResponse.aggregations.adjacency.buckets, null, 2))
    // console.log(JSON.stringify(response, null, 2))
})


const msearch = {
    "searchExample": searchExample,
    "searchMatchAll": searchMatchAll
}



test("testRawTypes", async () => {
    await tsClient.msearchDictTS(msearch)
    // console.log(JSON.stringify(msearch.searchExample.response.aggregations.test.buckets, null, 2))
    console.log(JSON.stringify(msearch, null, 2))


    console.log(JSON.stringify(msearch.searchExample.response.aggregations.test.buckets
        .flatMap(b => b.innerTest), null, 2))
})


test("searchTS222", async () => {
    const response = await tsClient.searchTS({ body: searchExample, index: INDEX_LOGS })


    console.log(
        searchExample.response.aggregations.exampleDateHist.buckets.flatMap(
            b => b.agentTerms.buckets
                .flatMap(t => ({
                    "t.key": t.key,
                    "t.doc_count": t.doc_count,
                    "b.key_as_string": b.key_as_string,
                    // "b.key_as_string" : b.key_as_string,
                }))))

    // console.log("OPENSEARCH")
    // console.log(JSON.stringify(searchExample.response.aggregations.test.buckets.map(b => b.doc_count), null, 2))
    // console.log(JSON.stringify(searchExample.response.aggregations.exampleDateHist
    //         .buckets.flatMap(b => b.agentTerms
    //         .buckets.flatMap(a => ({doc_count : a.doc_count, key : `${b.key}.${a.key}`}))), null, 2))
})




test("exampleTopHitMax", async () => {

    const response = await tsClient.searchTS({ body: exampleTopHitMax, index: INDEX_LOGS })

    console.log(JSON.stringify(response.aggregations.agents.buckets.flatMap(agent => ({

        minFromMin: agent.minValue.value_as_string,
        minFromDoc: agent.minHits.hits.hits[0]._source.timestamp,
        minDoc: agent.minHits.hits.hits[0],

        maxFromMin: agent.maxValue.value_as_string,
        maxFromDoc: agent.maxHits.hits.hits[0]._source.timestamp,
        maxDoc: agent.maxHits.hits.hits[0],

    })), null, 2))
})


