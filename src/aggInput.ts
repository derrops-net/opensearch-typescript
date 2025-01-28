import * as agg from "./aggs"


/**
 * All supported Agg keys
 */
export type AggType =
    "significant_text" |
    "significant_terms" |
    "sampler" |
    "reverse_nested" |
    "nested" |
    "ip_range" |
    "global" |
    "geotile_grid" |
    "geohex_grid" |
    "geohash_grid" |
    "geo_distance" |
    "diversified_sampler" |
    "date_range" |
    "value_count" |
    "stats" |
    "scripted_metric" |
    "percentiles" |
    "percentile_ranks" |
    "matrix_stats" |
    "geo_bounds" |
    "serial_diff" |
    "moving_avg" |
    "derivative" |
    "cumulative_sum" |
    "bucket_sort" |
    "min_bucket" |
    "max_bucket" |
    "sum_bucket" |
    "avg_bucket" |
    "extended_stats_bucket" |
    "stats_bucket" |
    "bucket_script" |
    "bucket_selector" |
    "terms" |
    "avg" |
    "sum" |
    "min" |
    "max" |
    "histogram" |
    "extended_stats" |
    "cardinality" |
    "adjacency_matrix" |
    "date_histogram" |
    "top_hits" |
    "range" |
    "filter" |
    "filters" |
    "multi_terms"





/**
 * All supported JSON structure of Aggs
 */
export type Agg<T> =
    agg.SignificantTextAgg<T> |
    agg.SignificantTermsAgg<T> |
    agg.Sampler |
    agg.ReverseNestedAgg |
    agg.NestedAgg<T> |
    agg.IPRangeAgg<T> |
    agg.Global |
    agg.GeotileGridAgg<T> |
    agg.GeohexGridAgg<T> |
    agg.GeohashGridAgg<T> |
    agg.GeoDistanceAgg<T> |
    agg.DiversifiedAgg<T> |
    agg.DateRangeBucketAgg<T> |
    agg.ValueCountAgg<T> |
    agg.StatsAgg<T> |
    agg.ScriptedMetricAgg |
    agg.PercentilesAgg<T> |
    agg.PercentileRanksAgg<T> |
    agg.MetricGeoBoundsAgg<T> |
    agg.BucketSerialDiffAgg |
    agg.BucketMovingAvgAgg |
    agg.BucketDerivativeAgg |
    agg.BucketCulmSumAgg |
    agg.BucketSortAgg |
    agg.BucketSelectorAgg |
    agg.BucketScriptAgg |
    agg.SumBucketPipeAgg |
    agg.MinBucketPipeAgg |
    agg.MaxBucketPipeAgg |
    agg.AvgBucketPipeAgg |
    agg.StatsBucketPipeAgg |
    agg.ExtendedStatsBucketPipeAgg |
    agg.TermsAgg<T> |
    agg.AvgAgg<T> |
    agg.ExtendedStatsAgg<T> |
    agg.HistAgg<T> |
    agg.SumAgg<T> |
    agg.MinAgg<T> |
    agg.MaxAgg<T> |
    agg.CardAgg<T> |
    agg.AdjacencyMatrixBucketAgg<T> |
    agg.DateHistBucketAgg<T> |
    agg.TopHitsAgg<T> |
    agg.RangeArrayAgg<T> |
    agg.RangeDictAgg<T> |
    agg.FilterAgg<T> |
    agg.FiltersAgg<T> |
    agg.MultiTermsAgg<T>



/**
 * Map to describe JSON of each agg type
 */
type AggTypeDictionary<T, AT extends AggType> =
    AT extends "significant_text" ? agg.SignificantTextAgg<T> :
    AT extends "significant_terms" ? agg.SignificantTermsAgg<T> :
    AT extends "sampler" ? agg.Sampler :
    AT extends "reverse_nested" ? agg.ReverseNestedAgg :
    AT extends "nested" ? agg.NestedAgg<T> :
    AT extends "ip_range" ? agg.IPRangeAgg<T> :
    AT extends "global" ? agg.Global :
    AT extends "geotile_grid" ? agg.GeotileGridAgg<T> :
    AT extends "geohex_grid" ? agg.GeohexGridAgg<T> :
    AT extends "geohash_grid" ? agg.GeohashGridAgg<T> :
    AT extends "geo_distance" ? agg.GeoDistanceAgg<T> :
    AT extends "diversified_sampler" ? agg.DiversifiedAgg<T> :
    AT extends "date_range" ? agg.DateRangeBucketAgg<T> :
    AT extends "value_count" ? agg.ValueCountAgg<T> :
    AT extends "stats" ? agg.StatsAgg<T> :
    AT extends "scripted_metric" ? agg.ScriptedMetricAgg :
    AT extends "percentiles" ? agg.PercentilesAgg<T> :
    AT extends "percentile_ranks" ? agg.PercentileRanksAgg<T> :
    AT extends "matrix_stats" ? agg.MatrixStats<T> :
    AT extends "geo_bounds" ? agg.MetricGeoBoundsAgg<T> :
    AT extends "serial_diff" ? agg.BucketSerialDiffAgg :
    AT extends "moving_avg" ? agg.BucketMovingAvgAgg :
    AT extends "derivative" ? agg.BucketDerivativeAgg :
    AT extends "cumulative_sum" ? agg.BucketCulmSumAgg :
    AT extends "bucket_sort" ? agg.BucketSortAgg :
    AT extends "bucket_script" ? agg.BucketScriptAgg :
    AT extends "bucket_selector" ? agg.BucketSelectorAgg :
    AT extends "extended_stats_bucket" ? agg.ExtendedStatsBucketPipeAgg :
    AT extends "stats_bucket" ? agg.StatsBucketPipeAgg :
    AT extends "sum_bucket" ? agg.SumBucketPipeAgg :
    AT extends "min_bucket" ? agg.MinBucketPipeAgg :
    AT extends "max_bucket" ? agg.MaxBucketPipeAgg :
    AT extends "avg_bucket" ? agg.AvgBucketPipeAgg :
    AT extends "terms" ? agg.TermsAgg<T> :
    AT extends "multi_terms" ? agg.MultiTermsAgg<T> :
    AT extends "avg" ? agg.AvgAgg<T> :
    AT extends "sum" ? agg.SumAgg<T> :
    AT extends "min" ? agg.MinAgg<T> :
    AT extends "max" ? agg.MaxAgg<T> :
    AT extends "histogram" ? agg.HistAgg<T> :
    AT extends "date_histogram" ? agg.DateHistBucketAgg<T> :
    AT extends "extended_stats" ? agg.ExtendedStatsAgg<T> :
    AT extends "cardinality" ? agg.CardAgg<T> :
    AT extends "adjacency_matrix" ? agg.AdjacencyMatrixBucketAgg<T> :
    AT extends "top_hits" ? agg.TopHitsAgg<T> :
    AT extends "range" ? agg.RangeArrayAgg<T> | agg.RangeDictAgg<T> :
    AT extends "filter" ? agg.FilterAgg<T> :
    AT extends "filters" ? agg.FiltersAgg<T> :
    never;



/**
 * The Recursive map to describe JSON of each agg type
 */
export type AggTypeDictionaryRecursive<T, AT extends AggType, AGS extends AggsQuery> =
    AGS extends object ? {
        aggs: {
            [K in keyof AGS]: AggTypeDictionaryRecursive<T, AGS[K]["agg"], AGS[K]["aggs"]>
        }
    } & AggTypeDictionary<T, AT> :
    AT extends AggType ? AggTypeDictionary<T, AT> :
    never;


/**
 * Describes the form of the aggregation query, which ultimately is used to infer the structure of the JSON returned by opensearch
 */
export type AggsQuery = {
    [key: string]: {
        agg: AggType,
        aggs?: AggsQuery
    }
}

