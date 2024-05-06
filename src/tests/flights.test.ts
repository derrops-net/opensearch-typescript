import * as os from "@opensearch-project/opensearch"
import * as logger from "../logger"
import { TypescriptOSProxyClient } from "../typescriptOS"
import { makeClientWithEndpoint } from "../testUtil"
import { Search } from "../search"
import { Flight } from "./Flight"

var esClient : os.Client
var tsClient : TypescriptOSProxyClient

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

type QuickExample = Search<Flight, 
    {
       country : {
        agg : "terms",
        aggs : {
            histogram : {
                agg : "date_histogram",
                aggs : {
                    avg_price : {
                        agg : "avg"
                    }
                }
            }
        }
       }
    }>

    const search : QuickExample = 
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
      
  const result = await tsClient.searchTS({body : search, index : "opensearch_dashboards_sample_data_flights"})

  logger.info(result.aggregations)
})

