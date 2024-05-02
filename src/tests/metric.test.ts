import * as os from "@opensearch-project/opensearch"
import * as logger from "../logger"
import { TypescriptOSProxyClient } from "../typescriptOS"
import { makeClientWithEndpoint } from "../testUtil"
import { Search } from "../search"
import { Ecommerce } from "./Ecommerce"

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


test("https://opensearch.org/docs/latest/aggregations/metric/average/", async () => {


    type QuickExample = Search<Ecommerce, 
    {
        avg_taxful_total_price : {
            agg : "avg",
        }
    }>

    const search : QuickExample = 
    {
        "size": 0,
        "aggs": {
          "avg_taxful_total_price": {
            "avg": {
              "field": "taxful_total_price"
            }
          }
        }
      }

      const result = await tsClient.searchTS({body : search, index : "opensearch_dashboards_sample_data_ecommerce"})

      logger.info(result.aggregations.avg_taxful_total_price.value)

})


test("https://opensearch.org/docs/latest/aggregations/metric/cardinality/", async () => {


    type QuickExample = Search<Ecommerce, 
    {
        unique_products : {
            agg : "cardinality",
        }
    }>

    const search : QuickExample = 
    {
        "size": 0,
        "aggs": {
          "unique_products": {
            "cardinality": {
              "field": "products.product_id"
            }
          }
        }
      }
      
      

      const result = await tsClient.searchTS({body : search, index : "opensearch_dashboards_sample_data_ecommerce"})

      logger.info(result.aggregations.unique_products.value)

})




test("https://opensearch.org/docs/latest/aggregations/metric/extended-stats/", async () => {


    type QuickExample = Search<Ecommerce, 
    {
        extended_stats_taxful_total_price : {
            agg : "extended_stats",
        }
    }>

    const search : QuickExample = 
    {
        "size": 0,
        "aggs": {
          "extended_stats_taxful_total_price": {
            "extended_stats": {
              "field": "taxful_total_price"
            }
          }
        }
      }
      
      const result = await tsClient.searchTS({body : search, index : "opensearch_dashboards_sample_data_ecommerce"})

      logger.info(result.aggregations.extended_stats_taxful_total_price)

})


test("https://opensearch.org/docs/latest/aggregations/metric/extended-stats/  sigma", async () => {


    type QuickExample = Search<Ecommerce, 
    {
        extended_stats_taxful_total_price : {
            agg : "extended_stats",
        }
    }>

    const search : QuickExample = 
    {
        "size": 0,
        "aggs": {
          "extended_stats_taxful_total_price": {
            "extended_stats": {
              "field": "taxful_total_price",
              "sigma": 3
            }
          }
        }
      }
      
      const result = await tsClient.searchTS({body : search, index : "opensearch_dashboards_sample_data_ecommerce"})

      logger.info(result.aggregations.extended_stats_taxful_total_price)

})


test("https://opensearch.org/docs/latest/aggregations/metric/geobounds/", async () => {

    type QuickExample = Search<Ecommerce, 
    {
        geo : {
            agg : "geo_bounds",
        }
    }>

    const search : QuickExample = {
        "size": 0,
        "aggs": {
          "geo": {
            "geo_bounds": {
              "field" : "geoip.location"
            }
          }
        }
      }

      const result = await tsClient.searchTS({body : search, index : "opensearch_dashboards_sample_data_ecommerce"})

      logger.info(result.aggregations.geo.bounds)

})


test("https://opensearch.org/docs/latest/aggregations/metric/matrix-stats/", async () => {

    type QuickExample = Search<Ecommerce, 
    {
        matrix_stats_taxful_total_price : {
            agg : "matrix_stats",
        }
    }>

    const search : QuickExample = 
    {
        "size": 0,
        "aggs": {
          "matrix_stats_taxful_total_price": {
            "matrix_stats": {
              "fields": ["taxful_total_price", "products.base_price"]
            }
          }
        }
      }

      const result = await tsClient.searchTS({body : search, index : "opensearch_dashboards_sample_data_ecommerce"})

      logger.info(result.aggregations.matrix_stats_taxful_total_price.fields)

})



test("https://opensearch.org/docs/latest/aggregations/metric/maximum/", async () => {

    type QuickExample = Search<Ecommerce, 
    {
        max_taxful_total_price : {
            agg : "max",
        }
    }>

    const search : QuickExample = 
    {
        "size": 0,
        "aggs": {
            "max_taxful_total_price": {
                "max": {
                    "field": "taxful_total_price"
                }
            }
        }
    }

      const result = await tsClient.searchTS({body : search, index : "opensearch_dashboards_sample_data_ecommerce"})

      logger.info(result.aggregations.max_taxful_total_price.value)

})



test("https://opensearch.org/docs/latest/aggregations/metric/minimum/", async () => {

    type QuickExample = Search<Ecommerce, 
    {
        min_taxful_total_price : {
            agg : "min",
        }
    }>

    const search : QuickExample = 
    {
        "size": 0,
        "aggs": {
          "min_taxful_total_price": {
            "min": {
              "field": "taxful_total_price"
            }
          }
        }
      }

      const result = await tsClient.searchTS({body : search, index : "opensearch_dashboards_sample_data_ecommerce"})

      logger.info(result.aggregations.min_taxful_total_price.value)

})


test("https://opensearch.org/docs/latest/aggregations/metric/percentile-ranks/", async () => {

    type QuickExample = Search<Ecommerce, 
    {
        percentile_rank_taxful_total_price : {
            agg : "percentile_ranks",
        }
    }>

    const search : QuickExample = 
    {
        "size": 0,
        "aggs": {
          "percentile_rank_taxful_total_price": {
            "percentile_ranks": {
              "field": "taxful_total_price",
              "values": [
                10,
                15
              ]
            }
          }
        }
      }
      

      const result = await tsClient.searchTS({body : search, index : "opensearch_dashboards_sample_data_ecommerce"})

      logger.info(result.aggregations.percentile_rank_taxful_total_price.values)

})



test("https://opensearch.org/docs/latest/aggregations/metric/percentile/", async () => {

    type QuickExample = Search<Ecommerce, 
    {
        percentile_taxful_total_price : {
            agg : "percentiles",
        }
    }>

    const search : QuickExample = 
    {
        "size": 0,
        "aggs": {
          "percentile_taxful_total_price": {
            "percentiles": {
              "field": "taxful_total_price",
              "percents" : [
                50
              ]
            }
          }
        }
    }

    const result = await tsClient.searchTS({body : search, index : "opensearch_dashboards_sample_data_ecommerce"})

    logger.info(result.aggregations.percentile_taxful_total_price.values)

})

test("https://opensearch.org/docs/latest/aggregations/metric/scripted-metric/", async () => {

    type QuickExample = Search<Ecommerce, 
    {
        "responses.counts" : {
            agg : "scripted_metric",
        }
    }>

    const search : QuickExample = 
    {
        "size": 0,
        "aggs": {
          "responses.counts": {
            "scripted_metric": {
              "init_script": "state.responses = ['error':0L,'success':0L,'other':0L]",
              "map_script": `
                    def code = doc['response.keyword'].value;
                       if (code.startsWith('5') || code.startsWith('4')) {
                        state.responses.error += 1 ;
                        } else if(code.startsWith('2')) {
                         state.responses.success += 1;
                        } else {
                        state.responses.other += 1;
                      }
                   `,
              "combine_script": "state.responses",
              "reduce_script": `
                  def counts = ['error': 0L, 'success': 0L, 'other': 0L];
                      for (responses in states) {
                       counts.error += responses['error'];
                        counts.success += responses['success'];
                      counts.other += responses['other'];
              }
              return counts;
              `
            }
          }
        }
      }

      const result = await tsClient.searchTS({body : search, index : "opensearch_dashboards_sample_data_logs"})

      logger.info(result.aggregations["responses.counts"].value.error)
      logger.info(result.aggregations["responses.counts"].value.other)
      logger.info(result.aggregations["responses.counts"].value.success)
      
    
})


test("https://opensearch.org/docs/latest/aggregations/metric/stats/", async () => {
    
    type QuickExample = Search<Ecommerce, 
    {
        "stats_taxful_total_price" : {
            agg : "stats",
        }
    }>

    const search : QuickExample = 
    {
        "size": 0,
        "aggs": {
            "stats_taxful_total_price": {
            "stats": {
                "field": "taxful_total_price"
            }
            }
        }
    }

    const result = await tsClient.searchTS({body : search, index : "opensearch_dashboards_sample_data_logs"})
    logger.info(result.aggregations.stats_taxful_total_price)

})



test("https://opensearch.org/docs/latest/aggregations/metric/sum/", async () => {
    
    type QuickExample = Search<Ecommerce, 
    {
        "sum_taxful_total_price" : {
            agg : "sum",
        }
    }>

    const search : QuickExample = 
    {
        "size": 0,
        "aggs": {
          "sum_taxful_total_price": {
            "sum": {
              "field": "taxful_total_price"
            }
          }
        }
      }


    const result = await tsClient.searchTS({body : search, index : "opensearch_dashboards_sample_data_logs"})
    logger.info(result.aggregations.sum_taxful_total_price.value)

})

test("https://opensearch.org/docs/latest/aggregations/metric/top-hits/", async () => {

    type QuickExample = Search<Ecommerce, 
    {
        "top_hits_products" : {
            agg : "top_hits",
        }
    }>

    const search : QuickExample = 
    {
        "size": 0,
            "aggs": {
                "top_hits_products": {
                "top_hits": {
                    "size": 5
            }
            }
        }
    }

    const result = await tsClient.searchTS({body : search, index : "opensearch_dashboards_sample_data_logs"})
    logger.info(result.aggregations.top_hits_products.hits.hits)
    logger.info(result.aggregations.top_hits_products.hits.total.value)
    logger.info(result.aggregations.top_hits_products.hits.total.relation)
    logger.info(result.aggregations.top_hits_products.hits.max_score)
    

})

test("https://opensearch.org/docs/latest/aggregations/metric/top-hits/", async () => {

    type QuickExample = Search<Ecommerce, 
    {
        "number_of_values" : {
            agg : "value_count",
        }
    }>

    const search : QuickExample = 
    {
        "size": 0,
         "aggs": {
          "number_of_values": {
            "value_count": {
              "field": "taxful_total_price"
            }
          }
        }
      }
      
      const result = await tsClient.searchTS({body : search, index : "opensearch_dashboards_sample_data_ecommerce"})
      logger.info(result.aggregations.number_of_values.value)

})