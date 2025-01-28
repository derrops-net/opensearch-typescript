import * as os from "@opensearch-project/opensearch"
import * as logger from "../logger"
import { TypescriptOSProxyClient } from "../typescriptOS"
import { makeClientWithEndpoint } from "../testUtil"
import { Search } from "../search"
import { Ecommerce } from "./Ecommerce"
import { ServerLog } from "./ServerLog"

var esClient: os.Client
var tsClient: TypescriptOSProxyClient

jest.setTimeout(20_000)


beforeAll(async () => {
    esClient = await makeClientWithEndpoint()
    tsClient = new TypescriptOSProxyClient(esClient)
})


afterAll(
    async () => {
        await esClient.close()
    }
)


test("ecommerce", async () => {

    type QuickExample = Search<Ecommerce,
        {
            order_trend: {
                agg: "date_histogram",
                aggs: {
                    "region": {
                        agg: "terms",
                        aggs: {
                            "sum_region": {
                                agg: "sum"
                            },
                            "terms_gender": {
                                agg: "terms",
                                aggs: {
                                    "sum_region_gender": {
                                        agg: "sum"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }>

    const search: QuickExample =
    {
        "aggs": {
            "order_trend": {
                "date_histogram": {
                    "interval": "month",
                    "field": "order_date"
                },
                "aggs": {
                    "region": {
                        "terms": {
                            "field": "geoip.region_name"
                        },
                        "aggs": {
                            "sum_region": {
                                "sum": {
                                    "field": "taxful_total_price"
                                },
                            },
                            "terms_gender": {
                                "terms": {
                                    "field": "customer_gender"
                                },
                                "aggs": {
                                    "sum_region_gender": {
                                        "sum": {
                                            "field": "taxful_total_price"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    const result = await tsClient.searchTS({ body: search, index: "opensearch_dashboards_sample_data_ecommerce" })

    logger.info(result.aggregations)
})



test("ranges", async () => {
    type QuickExample = Search<Ecommerce, {
        rangetest: {
            agg: "range"
        }
    }>

    const search: QuickExample = {
        "aggs": {
            "rangetest": {
                "range": {
                    "keyed": false,
                    "field": "products.price",
                    "ranges": [
                        {
                            "from": 0,
                            "to": 1
                        },
                        {
                            "from": 1,
                            "to": 100
                        },
                        {
                            "from": 100,
                            "to": 200
                        }
                    ]
                }
            }
        }
    }

    const result = await tsClient.searchTS({ body: search, index: "opensearch_dashboards_sample_data_ecommerce" })

    console.log(result.aggregations.rangetest.buckets.map(b => b))

})