import * as os from "@opensearch-project/opensearch"
import * as logger from "../logger"
import { TypescriptOSProxyClient } from "../typescriptOS"
import { makeClientWithEndpoint } from "../testUtil"
import { Search } from "../search"
import { Ecommerce } from "./Ecommerce"
import { ServerLog } from "./ServerLog"

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


test("https://opensearch.org/docs/latest/aggregations/bucket/adjacency-matrix/", async () => {

type QuickExample = Search<Ecommerce, 
    {
        interactions : {
            agg : "adjacency_matrix",
        }
    }>

    const search : QuickExample = 
    {
      "size": 0,
      "aggs": {
        "interactions": {
          "adjacency_matrix": {
            "filters": {
              "grpA": {
                "match": {
                  "manufacturer.keyword": "Low Tide Media"
                }
              },
              "grpB": {
                "match": {
                  "manufacturer.keyword": "Elitelligence"
                }
              },
              "grpC": {
                "match": {
                  "manufacturer.keyword": "Oceanavigations"
                }
              }
            }
          }
        }
      }
    }
      
  const result = await tsClient.searchTS({body : search, index : "opensearch_dashboards_sample_data_ecommerce"})

  logger.info(result.aggregations.interactions.buckets.map(b => b))
})





test("https://opensearch.org/docs/latest/aggregations/bucket/date-histogram/", async () => {

type QuickExample = Search<ServerLog, 
{
  logs_per_month : {
        agg : "date_histogram",
    }
}>

  const search : QuickExample = 
  {
    "size": 0,
    "aggs": {
      "logs_per_month": {
        "date_histogram": {
          "field": "@timestamp",
          "interval": "month"
        }
      }
    }
  }
      
  const result = await tsClient.searchTS({body : search, index : "opensearch_dashboards_sample_data_logs"})

  logger.info(result.aggregations.logs_per_month.buckets.map(b => ({
    key_as_string : b.key_as_string,
    key : b.key,
    doc_count : b.doc_count,
  })))
})


test("https://opensearch.org/docs/latest/aggregations/bucket/date-range/", async () => {

  type QuickExample = Search<ServerLog, 
  {
    number_of_bytes : {
          agg : "date_range",
          aggs : {
            logs : {
              agg : "avg"
            }
          }
      }
  }>

  const search : QuickExample = 
  {
    "size": 0,
    "aggs": {
      "number_of_bytes": {
        "aggs" : {
          "logs" : {
            "avg" : {
              "field" : "memory"
            }
          }
        },
        "date_range": {
          "field": "@timestamp",
          "format": "MM-yyyy",
          "ranges": [
            {
              "from": "now-10d/d",
              "to": "now"
            }
          ]
        }
      }
    }
  }
      
  const result = await tsClient.searchTS({body : search, index : "opensearch_dashboards_sample_data_logs"})
  logger.info(result.aggregations.number_of_bytes.buckets.map(b => ({
    key : b.key,
    from : b.from,
    from_as_string : b.from_as_string,
    to : b.to,
    to_as_string : b.to_as_string,
    doc_count : b.doc_count,
    avgMem : b.logs.value
  })))
})


test("https://opensearch.org/docs/latest/aggregations/bucket/filter/", async () => {

  type QuickExample = Search<Ecommerce, 
  {
    low_value : {
      agg : "filter",
      aggs : {
        avg_amount : {
          agg : "avg"
        }
      }
    }
  }>

  const search : QuickExample = 
  {
    "size": 0,
    "aggs": {
      "low_value": {
        "filter": {
          "range": {
            "taxful_total_price": {
              "lte": 50
            }
          }
        },
        "aggs": {
          "avg_amount": {
            "avg": {
              "field": "taxful_total_price"
            }
          }
        }
      }
    }
  }

  const result = await tsClient.searchTS({body : search, index : "opensearch_dashboards_sample_data_ecommerce"})

  console.log(result.aggregations.low_value.doc_count)
  console.log(result.aggregations.low_value.avg_amount.value)

})