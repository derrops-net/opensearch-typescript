import * as os from "@opensearch-project/opensearch"
import { TypescriptESProxy } from "./typescriptES"

import { ServerLog } from "./tests/ServerLog"

import * as q from "./search"
import { ResponseParser } from "./search"
import { makeClientWithEndpoint } from "./testUtil"


const INDEX_LOGS = "opensearch_dashboards_sample_data_logs"

var esClient : os.Client
var tsClient : TypescriptESProxy

beforeAll(async () => {
    esClient = await makeClientWithEndpoint()
    tsClient = new TypescriptESProxy(esClient)
})




const searchMatchAll : q.Search<ServerLog, {}> = {
    query : {
        "match_all" : {

        }
    }
}

const searchExample : q.Search<ServerLog, {
    exampleDateHist : {
        agg : "date_histogram",
        aggs : {
            "agentTerms" : {
                agg : "terms",

            }
        }
    },
    adjacency : {
        agg : "adjacency_matrix"
    },
    test : {
        agg : "terms",
        aggs : {
            "innerTest" : {
                agg : "extended_stats"
            },
            "somethingMore" : {
                agg : "terms",
                aggs : {
                    "topHits" : {
                        agg : "top_hits"
                    }
                }
            }
        }
    }
}> = {
    index : INDEX_LOGS,
    _source : {
        includes : [
            "bytes",
            "utc_time"
        ]
    },
    query : {
        bool : {
            must : [
                {
                    "terms":
                    {
                        "agent.keyword": [
                            "Mozilla/5.0 (X11; Linux x86_64; rv:6.0a1) Gecko/20110421 Firefox/6.0a1",
                            "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322)",
                    ]}
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
    aggs : {
        "exampleDateHist" : {
            "date_histogram" : {
                "interval": "3d",
                "field" : "timestamp"
            },
            "aggs" : {
                "agentTerms" : {
                    "terms" : {
                        "field" : "agent.keyword",
                    }
                }
            }
        },
        "adjacency" : {
            "adjacency_matrix" : {
                "filters" : {
                    "linux" : {
                        "match" : {
                            "agent.keyword" : "Mozilla/5.0 (X11; Linux x86_64; rv:6.0a1) Gecko/20110421 Firefox/6.0a1",
                        }
                    },
                    "windows" : {
                        "match" : {
                            "agent.keyword" : "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322)",
                        }
                    }
                }
            }
            
        },
        "test" : {
            "terms" : {
                "field" : "agent.keyword"
            },
            "aggs" : {
                "innerTest" : {
                    "extended_stats" : {
                        "field" : "bytes"
                    }
                },
                "somethingMore" : {
                    "terms" : {
                        "field" : "referer.keyword"
                    },
                    "aggs" : {
                        "topHits" : {
                            "top_hits" : {
                                "size" : 3
                            }
                        }
                    }
                }
            }
        }
    },
    "size" : 10
}
export const queries = [
    {},
    searchExample,
    {},
    searchMatchAll,
];


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
    "searchMatchAll" : searchMatchAll
}



test("testRawTypes", async () => {
    await tsClient.msearchDictTS(msearch)
    // console.log(JSON.stringify(msearch.searchExample.response.aggregations.test.buckets, null, 2))
    console.log(JSON.stringify(msearch, null, 2))


    console.log(JSON.stringify(msearch.searchExample.response.aggregations.test.buckets
        .flatMap(b => b.innerTest), null, 2))
})


test("searchTS", async () => {
    await tsClient.searchTS({body : searchExample, index : INDEX_LOGS})
    console.log(
        searchExample.response.aggregations.exampleDateHist.buckets.flatMap(
            b => b.agentTerms.buckets
                .flatMap(t => ({
                    "t.key" : t.key,
                    "t.doc_count" : t.doc_count,
                    "b.key_as_string" : b.key_as_string,
                    // "b.key_as_string" : b.key_as_string,
                }))))

    // console.log("OPENSEARCH")
    // console.log(JSON.stringify(searchExample.response.aggregations.test.buckets.map(b => b.doc_count), null, 2))
    // console.log(JSON.stringify(searchExample.response.aggregations.exampleDateHist
    //         .buckets.flatMap(b => b.agentTerms
    //         .buckets.flatMap(a => ({doc_count : a.doc_count, key : `${b.key}.${a.key}`}))), null, 2))
})



