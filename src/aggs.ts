import * as fields from "./fields"
import * as filter from "./filters"
import * as a from "./attributes"

import {RequireAtLeastOne} from "type-fest"

export type IPRange<T> = {
    ip_range : {
        ranges : RequireAtLeastOne<{
            from : string,
            to : string,
            mask : string,
        }>[]
    } & fields.SringField<T>
}

export type Global = {

}

export type GeotileGridAgg<T> = {
    geotile_grid : {
        precision : number,
    } & fields.GeoPointField<T>
}

export type GeohexGridAgg<T> = {
    geohex_grid : {
        precision : number,
    } & fields.GeoPointField<T>
}

export type GeohashGridAgg<T> = {
    geohash_grid : {
        precision : number,
    } & fields.GeoPointField<T>
}

export type ValueCountAgg<T> = {
    value_count : fields.AnyField<T>
}

export type StatsAgg<T> = {
    stats : fields.StatsField<T>
}

export type ScriptedMetricAgg = {
    scripted_metric : {
        init_script : string,
        map_script : string,
        combine_script : string,
        reduce_script : string
    }
}

export type PercentilesAgg<T> = {
    percentiles : fields.AnyField<T>
}

export type PercentileRanksAgg<T> = {
    "percentile_ranks": {
        "field": a.AnyAttribute<T>,
        "values": number[]
      }
}

export type MatrixStats<T> = {
    matrix_stats : {
        fields : a.StatsAttribute<T>[]
    }
}

export type MetricGeoBoundsAgg<T> = {
    geo_bounds : fields.GeoPointField<T>
}

export type BucketSerialDiffAgg = {
    serial_diff : BucketPipePatch & { lag : number | string}
}

export type BucketMovingAvgAgg = {
    moving_avg : BucketPipePatch
}

export type BucketDerivativeAgg = {
    derivative : BucketPipePatch
}

export type BucketCulmSumAgg = {
    cumulative_sum: BucketPipePatch
}

export type BucketSortAgg = {
    bucket_sort: {
        sort : {[key:string] : {order : "asc" | "desc"}}[],
        size? : number,
    }
}

export type BucketSelectorAgg = {
    bucket_selector: {
        buckets_path?: {[a:string] : string},
        script: string
      }
}

export type BucketScriptAgg = {
    bucket_script : {
        "buckets_path": {
            [p : string] : string
          },
        "script": string
    }
}

export type BucketPipePatch = string | {[a:string] : any}

export type SumBucketPipeAgg = {
    sum_bucket : BucketPipePatch
}

export type StatsBucketPipeAgg = {
    stats_bucket : BucketPipePatch
}

export type ExtendedStatsBucketPipeAgg = {
    extended_stats_bucket : BucketPipePatch
}

export type AvgBucketPipeAgg = {
    avg_bucket : BucketPipePatch
}

export type MinBucketPipeAgg = {
    min_bucket : BucketPipePatch
}

export type MaxBucketPipeAgg = {
    max_bucket : BucketPipePatch
}

export type TermsAgg<T> = {
    size? : number,
    terms : fields.AnyField<T>,
    missing : number | string | Date,
}

export type MultiTermsAgg<T> = {
    multi_terms : {
        terms : fields.AnyField<T>[]
        order? : Partial<{
            [key in a.AnyAttribute<T>] : "asc" | "desc"
        }>
        size? : number,
        doc_count? : number
    }
}

export type AvgAgg<T> = {
    avg : fields.StatsField<T>
}

export type ExtendedStatsAgg<T> = {
    extended_stats : fields.NumberField<T> & {
        sigma? : number
    }
}

export type HistAgg<T> = {
    histogram : {
        interval : number | string
    } & fields.StatsField<T>
}

export type DateHistBucketAgg<T> = {
    date_histogram : {
        interval? : string | "day"| "hour"| "minute" | "quarter" | "second" | "week" | "year",
        calendar_interval? : string,
    } & fields.DateField<T>
}

export type SumAgg<T> = {
    sum : fields.NumberField<T>
} 

export type MinAgg<T> = {
    min : fields.StatsField<T>
}

export type MaxAgg<T> = {
    max : fields.StatsField<T>
}

export type CardAgg<T> = {
    cardinality : fields.AnyField<T>
}

export type GeoDistanceAgg<T> = 
{
    geo_distance : {
        field : string,
        origin: {
            lat : number,
            lon : number,
        },
        ranges : RequireAtLeastOne<{
            from : number,
            to : number,
        }>[]
    }
}

export type DiversifiedAgg<T> = {
    diversified_sampler : {
        shard_size: number,
        field : a.AnyAttribute<T>,
        max_docs_per_value? : number,
    }
}

export type DateRangeBucketAgg<T> = {
    date_range : {
        field : a.DateAtt<T>,
        format : string,
        ranges : { from : string, to : string }[],
    }
}

export type AdjacencyMatrixBucketAgg<T> = {
    adjacency_matrix : {
        filters : {
            [k : string] : {
                match : Partial<{
                        [k in a.TextOrKeywordAtt<T>] : string
                }>
            }
        }
    }
}

export type TopHitsAgg = {
    top_hits : {
        size : number
    }
}



export type RangeAgg<T> = {
    range : {
        field : a.StatsAttribute<T>,
        keyed : boolean,
        ranges : {from : number | Date, to : number | Date}[]
    }
}



export type FilterAgg<T> = {
    filter : filter.FilterStatement<T>
}

export type FiltersAgg<T> = {
    filters : {
        filters : filter.FilterStatement<T>[],
        other_bucket? : boolean
    }
}
