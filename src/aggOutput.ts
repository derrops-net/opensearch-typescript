import { AggType, AggsQuery } from "./aggInput"
import { StatsField } from "./fields"

import { Hits } from "./search"


export type RangeString = {
    from: string,
    to: string,
}

export type RangeStringWithStringRep = RangeString & {
    from_as_string: string,
    to_as_string: string
}

export type ScriptedMetricAggResp = {
    value: {
        other: number,
        success: number,
        error: number,
    }
}

export type PercentilesAggResp = {
    values: {
        [a: string]: number
    }
}



export type PercentileRanksAggResp = {
    values: {
        [a: string]: number,
    }
}

export type MetricStatsElement<T> = {
    "name": StatsField<T>,
    "count": number,
    "mean": number,
    "variance": number,
    "skewness": number,
    "kurtosis": number,
    "covariance": {
        "products.base_price": number,
        "taxful_total_price": number,
    },
    "correlation": {
        "products.base_price": number,
        "taxful_total_price": number,
    }
}

/**
 * Metric Aggs
 */

export type MatrixStatsResp<T> = {
    "doc_count": number,
    "fields": MetricStatsElement<T>[]
}


export type MetricGeoBoundsAggResp = {

    bounds: {
        top_left: {
            lat: number,
            lon: number,
        },
        bottom_right: {
            lat: number,
            lon: number,
        }
    }

}


/**
 * Pipeline Aggs
 */

export type BucketPipeAggResp = {
    value: number,
}

export type StatsBucketPipeAggResp = StatsAggResp

export type BucketScriptAggResp = {
    value: number
}

export type ExtendedStatsBucketPipeAggResp = ExtendedStatsAggResp

export type AggBucket = {
    doc_count: number,
    key: string | number
}

export type AggBucketWithKeyAsString = AggBucket & { key_as_string: string }

export type AggAGG<AGG> = AggBucket & AGG

export type AggBucketWithKeyAsStringAgg<AGG> = AggBucketWithKeyAsString & AGG

export type AggBucketsResponse = {
    "buckets": AggBucket[]
}

export type AggBucketsResponseAgg<AGG> = {
    "buckets": AggAGG<AGG>[]
}

export type AggBucketsResponseWithKeyAsStringAgg<AGG> = {
    "buckets": AggBucketWithKeyAsStringAgg<AGG>[]
}

export type DateRangeBucketsResponseWithKeyAsStringAgg<AGG> = {
    "buckets": (AGG & RangeStringWithStringRep & AggBucket)[]
}


export type HistAggResp = AggBucketsResponse

export type DateHistAggResp = {
    "buckets": AggBucketWithKeyAsString[]
}

export type HistAggRespAgg<AGG> = AggBucketsResponseAgg<AGG>

export type DateHistAggRespAgg<AGG> = AggBucketsResponseWithKeyAsStringAgg<AGG>

export type DateRangeAggResp<AGG> = DateRangeBucketsResponseWithKeyAsStringAgg<AGG>


export type TermsAggResp = {
    "doc_count_error_upper_bound": number,
    "sum_other_doc_count": number,
} & AggBucketsResponse


export type FilterAggRespAgg<AGG> = {
    doc_count: number
} & AGG

export type SamplerAggRespAgg<AGG> = {
} & AGG

export type DiversifiedAggRespAgg<AGG> = {
    doc_count: number
} & AGG

export type SignificantTextAggResp<AGG> = {
    doc_count: number,
    bg_count: number,
    buckets: ({
        key: string,
        doc_count: number,
        score: number,
        bg_count: number
    } & AGG)[]
}

export type SignificantTermsAggResp<AGG> = {
    doc_count: number,
    bg_count: number,
    buckets: ({
        key: string,
        doc_count: number,
        score: number,
        bg_count: number
    } & AGG)[]
}

export type IPRangeAggResp<AGG> = {
    buckets:
    ({
        key: string,
        from: string,
        to: string,
        doc_count: number,
    } & AGG)[]
}

export type GeotileGridAggResp<AGG> = {
    "buckets": ({
        "key": string,
        "doc_count": number,
    } & AGG)[]
}

export type GeohexGridAggResp<AGG> = {
    "buckets": ({
        "key": string,
        "doc_count": number,
    } & AGG)[]
}

export type GeohashGridAggResp<AGG> = {
    "buckets": ({
        "key": string,
        "doc_count": number,
    } & AGG)[]
}

export type GeoDistanceAggResp<AGG> = {
    "buckets": ({
        "key": string,
        "from": number,
        "to": number,
        "doc_count": number
    } & AGG)[]
}

export type FiltersAggRespAgg<AGG> = {
    doc_count: number
} & AGG

export type TermsAggRespAgg<AGG> = {
    "doc_count_error_upper_bound": number,
    "sum_other_doc_count": number,
    "buckets": ({
        doc_count: number,
        key: string | number
    } & AGG)[]
}


export type MultiTermsAggRespAgg<AGG> = {
    "doc_count_error_upper_bound": number,
    "sum_other_doc_count": number,
    "buckets": ({
        key: string[] | number[],
        key_as_string: string,
        doc_count: number
    } & AGG)[]
}


export type ValueAggResp = {
    value: number,
    value_as_string: string,
}

export type AvgAggResp = ValueAggResp
export type SumAggResp = ValueAggResp
export type MinAggResp = ValueAggResp
export type MaxAggResp = ValueAggResp
export type CardAggResp = ValueAggResp

export type ValueCountAggResp = {
    value: number,
}

export type StatsAggResp = {
    count: number,
    min: number,
    max: number,
    avg: number,
    sum: number,
}

export type ExtendedStatsAggResp = {
    "count": number,
    "min": number,
    "max": number,
    "avg": number,
    "sum": number,
    "sum_of_squares": number,
    "variance": number,
    "variance_population": number,
    "variance_sampling": number,
    "std_deviation": number,
    "std_deviation_population": number,
    "std_deviation_sampling": number,
    "std_deviation_bounds": {
        "upper": number,
        "lower": number,
        "upper_population": number,
        "lower_population": number,
        "upper_sampling": number,
        "lower_sampling": number,
    }
}

export type AdjacencyMatrixAggResp = {
    buckets: AggBucket[]
}



export type RangeRespDict = {
    [k: string]: {
        from: number | Date,
        to: number | Date,
        doc_count: number
    }
}

export type RangeRespArr = {
    key: string,
    from: number | Date,
    to: number | Date,
    doc_count: number
}[]



export type RangeResp = {
    buckets: RangeRespDict & RangeRespArr
}


/**
 * Recursively map the aggregation types
 */
export type AggTypeResponseDictionary2<T, AT extends AggType, AGS extends AggsQuery> =
    AGS extends object ?
    (
        AT extends "significant_text" ? SignificantTextAggResp<{ [K in keyof AGS]: AggTypeResponseDictionary2<T, AGS[K]["agg"], AGS[K]["aggs"]> }> :
        AT extends "significant_terms" ? SignificantTermsAggResp<{ [K in keyof AGS]: AggTypeResponseDictionary2<T, AGS[K]["agg"], AGS[K]["aggs"]> }> :
        AT extends "ip_range" ? IPRangeAggResp<{ [K in keyof AGS]: AggTypeResponseDictionary2<T, AGS[K]["agg"], AGS[K]["aggs"]> }> :
        AT extends "geotile_grid" ? GeotileGridAggResp<{ [K in keyof AGS]: AggTypeResponseDictionary2<T, AGS[K]["agg"], AGS[K]["aggs"]> }> :
        AT extends "geohex_grid" ? GeohexGridAggResp<{ [K in keyof AGS]: AggTypeResponseDictionary2<T, AGS[K]["agg"], AGS[K]["aggs"]> }> :
        AT extends "geohash_grid" ? GeohashGridAggResp<{ [K in keyof AGS]: AggTypeResponseDictionary2<T, AGS[K]["agg"], AGS[K]["aggs"]> }> :
        AT extends "geo_distance" ? GeoDistanceAggResp<{ [K in keyof AGS]: AggTypeResponseDictionary2<T, AGS[K]["agg"], AGS[K]["aggs"]> }> :
        AT extends "sampler" ? SamplerAggRespAgg<{ [K in keyof AGS]: AggTypeResponseDictionary2<T, AGS[K]["agg"], AGS[K]["aggs"]> }> :
        AT extends "diversified_sampler" ? DiversifiedAggRespAgg<{ [K in keyof AGS]: AggTypeResponseDictionary2<T, AGS[K]["agg"], AGS[K]["aggs"]> }> :
        AT extends "filters" ? FiltersAggRespAgg<{ [K in keyof AGS]: AggTypeResponseDictionary2<T, AGS[K]["agg"], AGS[K]["aggs"]> }> :
        AT extends "filter" ? FilterAggRespAgg<{ [K in keyof AGS]: AggTypeResponseDictionary2<T, AGS[K]["agg"], AGS[K]["aggs"]> }> :
        AT extends "terms" ? TermsAggRespAgg<{ [K in keyof AGS]: AggTypeResponseDictionary2<T, AGS[K]["agg"], AGS[K]["aggs"]> }> :
        AT extends "multi_terms" ? MultiTermsAggRespAgg<{ [K in keyof AGS]: AggTypeResponseDictionary2<T, AGS[K]["agg"], AGS[K]["aggs"]> }> :
        AT extends "histogram" ? HistAggRespAgg<{ [K in keyof AGS]: AggTypeResponseDictionary2<T, AGS[K]["agg"], AGS[K]["aggs"]> }> :
        AT extends "date_histogram" ? DateHistAggRespAgg<{ [K in keyof AGS]: AggTypeResponseDictionary2<T, AGS[K]["agg"], AGS[K]["aggs"]> }> :
        AT extends "date_range" ? DateRangeAggResp<{ [K in keyof AGS]: AggTypeResponseDictionary2<T, AGS[K]["agg"], AGS[K]["aggs"]> }> :
        never

    ) :
    AT extends "significant_text" ? SignificantTextAggResp<void> :
    AT extends "significant_terms" ? SignificantTermsAggResp<void> :
    AT extends "ip_range" ? IPRangeAggResp<void> :
    AT extends "geotile_grid" ? GeotileGridAggResp<void> :
    AT extends "geohex_grid" ? GeohexGridAggResp<void> :
    AT extends "geohash_grid" ? GeohashGridAggResp<void> :
    AT extends "geo_distance" ? GeoDistanceAggResp<void> :
    AT extends "sampler" ? SamplerAggRespAgg<void> :
    AT extends "diversified_sampler" ? DiversifiedAggRespAgg<void> :
    AT extends "filters" ? FiltersAggRespAgg<void> :
    AT extends "filter" ? FilterAggRespAgg<void> :
    AT extends "terms" ? TermsAggRespAgg<void> :
    AT extends "multi_terms" ? MultiTermsAggRespAgg<void> :
    AT extends "histogram" ? DateHistAggRespAgg<void> :
    AT extends "date_histogram" ? DateHistAggRespAgg<void> :
    AT extends "date_range" ? DateRangeAggResp<void> :
    AT extends "value_count" ? ValueCountAggResp :
    AT extends "stats" ? StatsAggResp :
    AT extends "scripted_metric" ? ScriptedMetricAggResp :
    AT extends "percentiles" ? PercentilesAggResp :
    AT extends "percentile_ranks" ? PercentileRanksAggResp :
    AT extends "matrix_stats" ? MatrixStatsResp<T> :
    AT extends "geo_bounds" ? MetricGeoBoundsAggResp :
    AT extends "serial_diff" ? BucketPipeAggResp :
    AT extends "moving_avg" ? BucketPipeAggResp :
    AT extends "derivative" ? BucketPipeAggResp :
    AT extends "cumulative_sum" ? BucketPipeAggResp :
    AT extends "bucket_selector" ? undefined :
    AT extends "bucket_script" ? BucketScriptAggResp :
    AT extends "extended_stats_bucket" ? ExtendedStatsBucketPipeAggResp :
    AT extends "sum_bucket" ? BucketPipeAggResp :
    AT extends "stats_bucket" ? StatsBucketPipeAggResp :
    AT extends "min_bucket" ? BucketPipeAggResp :
    AT extends "max_bucket" ? BucketPipeAggResp :
    AT extends "avg" ? AvgAggResp :
    AT extends "sum" ? SumAggResp :
    AT extends "min" ? MinAggResp :
    AT extends "max" ? MaxAggResp :
    AT extends "extended_stats" ? ExtendedStatsAggResp :
    AT extends "cardinality" ? CardAggResp :
    AT extends "adjacency_matrix" ? AdjacencyMatrixAggResp :
    AT extends "top_hits" ? { hits: Hits<T> } :
    AT extends "range" ? RangeResp :
    never;


