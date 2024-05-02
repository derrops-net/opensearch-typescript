import * as os from "@opensearch-project/opensearch"
import * as logger from "../logger"
import { TypescriptOSProxyClient } from "../typescriptOS"
import { makeClientWithEndpoint } from "../testUtil"
import { ServerLog } from "./ServerLog"
import { Search } from "../search"

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

test("https://opensearch.org/docs/latest/aggregations/pipeline-agg/#quick-example", async () => {

  type QuickExample = Search<ServerLog, 
    {
        number_of_bytes : {
            agg : "histogram",
            aggs : {
                "sum_total_memory" : {
                    agg : "sum"
                }
            }
        },
        sum_copies : {
            agg : "sum_bucket"
        }
    }>

  const search : QuickExample = 
    {
        "size": 0,
        "aggs": {
          "number_of_bytes": {
            "histogram": {
              "field": "bytes",
              "interval": 10000
            },
            "aggs": {
              "sum_total_memory": {
                "sum": {
                  "field": "phpmemory"
                }
              }
            }
          },
          "sum_copies": {
            "sum_bucket": {
              "buckets_path": "number_of_bytes>sum_total_memory"
            }
          }
        }
      }

      const result = await tsClient.searchTS({body : search, index : "opensearch_dashboards_sample_data_logs"})

      logger.info(result.aggregations.number_of_bytes)
      logger.info(result.aggregations.sum_copies)

})






test("https://opensearch.org/docs/latest/aggregations/pipeline-agg/#avg_bucket-sum_bucket-min_bucket-max_bucket", async () => {

  type QuickExample = Search<ServerLog, 
    {
      visits_per_month : {
          agg : "date_histogram",
          aggs : {
              "sum_of_bytes" : {
                  agg : "sum"
              }
          }
      },
      avg_monthly_bytes : {
          agg : "avg_bucket"
      }
    }>

  const search : QuickExample = 
    {
      "size": 0,
      "aggs": {
        "visits_per_month": {
          "date_histogram": {
            "field": "@timestamp",
            "interval": "month"
          },
          "aggs": {
            "sum_of_bytes": {
              "sum": {
                "field": "bytes"
              }
            }
          }
        },
        "avg_monthly_bytes": {
          "avg_bucket": {
            "buckets_path": "visits_per_month>sum_of_bytes"
          }
        }
      }
    }

    const result = await tsClient.searchTS({body : search, index : "opensearch_dashboards_sample_data_logs"})
    logger.info(result.aggregations.avg_monthly_bytes)
    logger.info(result.aggregations.visits_per_month)

})






test("https://opensearch.org/docs/latest/aggregations/pipeline-agg/#stats_bucket-extended_stats_bucket", async () => {

  type QuickExample = Search<ServerLog, 
    {
      visits_per_month : {
          agg : "date_histogram",
          aggs : {
              "sum_of_bytes" : {
                  agg : "sum"
              }
          }
      },
      stats_monthly_bytes : {
          agg : "stats_bucket"
      }
    }>

  const search : QuickExample = 
    {
      "size": 0,
      "aggs": {
        "visits_per_month": {
          "date_histogram": {
            "field": "@timestamp",
            "interval": "month"
          },
          "aggs": {
            "sum_of_bytes": {
              "sum": {
                "field": "bytes"
              }
            }
          }
        },
        "stats_monthly_bytes": {
          "stats_bucket": {
            "buckets_path": "visits_per_month>sum_of_bytes"
          }
        }
      }
    }

    const result = await tsClient.searchTS({body : search, index : "opensearch_dashboards_sample_data_logs"})
    logger.info(result.aggregations.stats_monthly_bytes)
    logger.info(result.aggregations.visits_per_month)

})



// bucket_script, bucket_selector
test("https://opensearch.org/docs/latest/aggregations/pipeline-agg/#bucket_script-bucket_selector", async () => {

  type QuickExample = Search<ServerLog, 
  {
    sales_per_month : {
      agg : "histogram",
      aggs : {
        "total_ram" : {
          agg : "sum"
        },
        "ext-type" : {
          agg : "filter"
          aggs : {
            "total_ram" : {
              agg : "sum"
            }
          }
        },
        "ram-percentage" : {
          agg : "bucket_script"
        }
      }
    }
  }>

  const search : QuickExample = {
    "size": 0,
    "aggs": {
      "sales_per_month": {
        "histogram": {
          "field": "bytes",
          "interval": "10000"
        },
        "aggs": {
          "total_ram": {
            "sum": {
              "field": "machine.ram"
            }
          },
          "ext-type": {
            "filter": {
              "term": {
                "extension.keyword": "zip"
              }
            },
            "aggs": {
              "total_ram": {
                "sum": {
                  "field": "machine.ram"
                }
              }
            }
          },
          "ram-percentage": {
            "bucket_script": {
              "buckets_path": {
                "machineRam": "ext-type>total_ram",
                "totalRam": "total_ram"
              },
              "script": "params.machineRam / params.totalRam"
            }
          }
        }
      }
    }
  }

  const result = await tsClient.searchTS({body : search, index : "opensearch_dashboards_sample_data_logs"})

  logger.info(result.aggregations.sales_per_month.buckets)
  

})
/**
test("params.totalBytes > 20000 bucket_selector", async () => {

  type QuickExample = Search<ServerLog, 
  {
    bytes_per_month : {
      agg : "date_histogram",
      aggs : {
        "total_bytes" : {
          agg : "sum"
        },
        "bytes_bucket_filter" : {
          agg : "bucket_selector"
        }
      }
    }
  }>

  const search : QuickExample = 
  {
    "size": 0,
    "aggs": {
      "bytes_per_month": {
        "date_histogram": {
          "field": "@timestamp",
          "calendar_interval": "month"
        },
        "aggs": {
          "total_bytes": {
            "sum": {
              "field": "bytes"
            }
          },
          "bytes_bucket_filter": {
            "bucket_selector": {
              "buckets_path": {
                "totalBytes": "total_bytes"
              },
              "script": "params.totalBytes > 20000"
            }
          }
        }
      }
    }
  }

  const result = await tsClient.searchTS({body : search, index : "opensearch_dashboards_sample_data_logs"})

  logger.info(result.aggregations.bytes_per_month.buckets.map(b => b.bytes_bucket_filter))
  logger.info(result.aggregations.bytes_per_month.buckets.map(b => b))

})
 */
test("https://opensearch.org/docs/latest/aggregations/pipeline-agg/#bucket_sort", async () => {

  type QuickExample = Search<ServerLog, 
  {
    sales_per_month : {
      agg : "date_histogram",
      aggs : {
        "total_bytes" : {
          agg : "sum",
        },
        "bytes_bucket_sort" : {
          agg : "bucket_sort"
        }
      }
    }
  }>

  const search : QuickExample = {
    "size": 0,
    "aggs": {
      "sales_per_month": {
        "date_histogram": {
          "field": "@timestamp",
          "calendar_interval": "month"
        },
        "aggs": {
          "total_bytes": {
            "sum" : {
              "field" : "bytes"
            }
          },
          "bytes_bucket_sort": {
            "bucket_sort": {
              "sort": [
                { "total_bytes": { "order": "desc" } }
              ],
              "size": 3                                
            }
          }
        }
      }
    }
  }

  const result = await tsClient.searchTS({body : search, index : "opensearch_dashboards_sample_data_logs"})
  logger.info(result.aggregations.sales_per_month.buckets.map(b => ({
    "key_as_string" : b.key_as_string,
    "key" : b.key,
    "doc_count" : b.doc_count,
    "total_bytes" : {
      "value" : b.total_bytes.value
    }
  })))

})



test("https://opensearch.org/docs/latest/aggregations/pipeline-agg/#cumulative_sum", async () => {

  type QuickExample = Search<ServerLog, 
  {
    sales_per_month : {
      agg : "date_histogram",
      aggs : {
        "number_of_bytes" : {
          agg : "sum"
        },
        "cumulative_bytes" : {
          agg : "cumulative_sum"
        }
      }
    }
  }>

  const search : QuickExample = {
    "size": 0,
    "aggs": {
      "sales_per_month": {
        "date_histogram": {
          "field": "@timestamp",
          "calendar_interval": "month"
        },
        "aggs": {
          "number_of_bytes": {
            "sum": {
              "field": "bytes"
            }
          },
          "cumulative_bytes": {
            "cumulative_sum": {
              "buckets_path": "number_of_bytes"
            }
          }
        }
      }
    }
  }

  const result = await tsClient.searchTS({body : search, index : "opensearch_dashboards_sample_data_logs"})
  logger.info(result.aggregations.sales_per_month.buckets.map(b => b.cumulative_bytes.value))


})

test("https://opensearch.org/docs/latest/aggregations/pipeline-agg/#cumulative_sum", async () => {


type QuickExample = Search<ServerLog, 
  {
    sales_per_month : {
      agg : "date_histogram",
      aggs : {
        "number_of_bytes" : {
          agg : "sum"
        },
        "bytes_deriv" : {
          agg : "derivative"
        }
      }
    }
  }>

  const search : QuickExample = {
    "size": 0,
    "aggs": {
      "sales_per_month": {
        "date_histogram": {
          "field": "@timestamp",
          "calendar_interval": "month"
        },
        "aggs": {
          "number_of_bytes": {
            "sum": {
              "field": "bytes"
            }
          },
          "bytes_deriv": {
            "derivative": {
              "buckets_path": "number_of_bytes"
            }
          }
        }
      }
    }
  }

  const result = await tsClient.searchTS({body : search, index : "opensearch_dashboards_sample_data_logs"})
  logger.info(result.aggregations.sales_per_month.buckets.map(b => b.bytes_deriv))


})



test("https://opensearch.org/docs/latest/aggregations/pipeline-agg/#moving_avg", async () => {


  type QuickExample = Search<ServerLog, 
  {
    my_date_histogram : {
      agg : "date_histogram",
      aggs : {
        "sum_of_bytes" : {
          agg : "sum"
        },
        "moving_avg_of_sum_of_bytes" : {
          agg : "moving_avg"
        }
      }
    }
  }>


  const search : QuickExample = {
    "size": 0,
    "aggs": {
      "my_date_histogram": {                                
        "date_histogram": {
          "field": "@timestamp",
          "calendar_interval": "month"
        },
        "aggs": {
          "sum_of_bytes": {
            "sum": { "field": "bytes" }                 
          },
          "moving_avg_of_sum_of_bytes": {
            "moving_avg": { 
              "buckets_path": "sum_of_bytes"
            }
          }
        }
      }
    }
  }

  const result = await tsClient.searchTS({body : search, index : "opensearch_dashboards_sample_data_logs"})
  logger.info(result.aggregations.my_date_histogram.buckets.map(b => b?.moving_avg_of_sum_of_bytes?.value))


})



test("https://opensearch.org/docs/latest/aggregations/pipeline-agg/#serial_diff", async () => {

type QuickExample = Search<ServerLog, 
  {
    my_date_histogram : {
      agg : "date_histogram",
      aggs : {
        "the_sum" : {
          agg : "sum"
        },
        "thirtieth_difference" : {
          agg : "serial_diff"
        }
      }
    }
  }>

  const search : QuickExample = {
    "size": 0,
    "aggs": {
       "my_date_histogram": {                  
          "date_histogram": {
             "field": "@timestamp",
             "calendar_interval": "day"
          },
          "aggs": {
             "the_sum": {
                "sum": {
                   "field": "bytes"     
                }
             },
             "thirtieth_difference": {
                "serial_diff": {                
                   "buckets_path": "the_sum",
                   "lag" : 7
                }
             }
          }
       }
    }
  }

  const result = await tsClient.searchTS({body : search, index : "opensearch_dashboards_sample_data_logs"})
  logger.info(result.aggregations.my_date_histogram.buckets)


})