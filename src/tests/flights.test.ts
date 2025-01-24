import * as os from "@opensearch-project/opensearch"
import * as logger from "../logger"
import { TypescriptOSProxyClient } from "../typescriptOS"
import { makeClientWithEndpoint } from "../testUtil"
import { Search } from "../search"
import { Flight } from "./Flight"
import { AggsQuery } from "../aggInput"

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


test("flights", async () => {

    type AvgByMonthForEachCountryAgg = {
        country: {
            agg: "terms",
            aggs: {
                histogram: {
                    agg: "date_histogram",
                    aggs: {
                        avg_price: {
                            agg: "avg"
                        }
                    }
                }
            }
        }
    }

    type AvgByMonthForEachCountrySearch = Search<Flight, AvgByMonthForEachCountryAgg>

    const search: AvgByMonthForEachCountrySearch =
    {
        "size": 0,
        "aggs": {
            "country": {
                "terms": {
                    "field": "DestCountry",
                    "size": 10
                },
                "aggs": {
                    "histogram": {
                        "date_histogram": {
                            "field": "timestamp",
                            "interval": "week"
                        },
                        "aggs": {
                            "avg_price": {
                                "avg": {
                                    "field": "AvgTicketPrice"
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    const result = await tsClient.searchTS({ body: search, index: "opensearch_dashboards_sample_data_flights" })

    console.log(result.aggregations.country.buckets.flatMap(c => c.histogram.buckets.flatMap(h => ({
        country: c.key,
        avg_price: h.avg_price.value,
        date: new Date(h.key_as_string)
    }))))
})

