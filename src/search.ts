import { ShardStatistics } from "@opensearch-project/opensearch/api/_types/_common"
import { TotalHits } from "@opensearch-project/opensearch/api/_types/_core.search"
import { RequireAtLeastOne, RequireExactlyOne } from "type-fest"
import { AggTypeDictionaryRecursive, AggsQuery } from "./aggInput"
import { AggTypeResponseDictionary2 } from "./aggOutput"
import * as att from "./attributes"
import { Field, NumberField } from "./fields"
import * as f from "./filters"
import * as m from "./match"



/**
 * Represents a document
 */
export type Document<T> = {
    _index: string,
    _id: string,
    _score: number,
    _source: T,
    sort?: any[],
}


/**
 * Represents (Hits|Search Results)
 */
export type Hits<T> = {
    "total": number & TotalHits,
    "max_score": any,
    "hits": Document<T>[]
}

export type Source<T> = {
    includes?: att.AnyAttribute<T>[],
    excludes?: att.AnyAttribute<T>[],
}

export type BooleanStatement<T> = {
    should?: f.FilterStatement<T>[],
    filter?: f.FilterStatement<T>[],
    must?: f.FilterStatement<T>[],
    must_not?: f.FilterStatement<T>[],
    minimum_should_match?: number,
}

export type Boosting<T> = {
    positive: {
        match: m.Match<T>
    },
    negative: {
        match: m.Match<T>
    },
    negative_boost: number,
}


export type ConstanScore<T> = {
    filter: f.FilterStatement<T>,
    boost: number,
}

export type DisjointMatrix<T> = {
    queries: m.Match<T>[],
}


export type FunctionScore<T> = {
    weight: number,
    query: m.Match<T>,

} & RequireAtLeastOne<{
    random_score: {
        seed: number,
    } & NumberField<T>,

    field_value_factor: {
        factor: number,
        modifier: "log" | "log1p" | "log2p" | "ln" | "ln1p" | "ln2p" | "reciprocal" | "square" | "sqrt" | "none",
        missing?: number,
    } & NumberField<T>,

    script_score: {
        script: string | {
            params: {
                [k: string]: number
            },
            source: string
        },
    }

    exp: {
        [a in att.AnyAttribute<T>]: {
            origin?: string,
            offset?: string,
            scale?: string,
            decay?: number
        }
    }

}>

export type IDs = {
    ids: {
        values: string[]
    }
}

export type Nested<T> = {
    path: string,
    query: OSQuery<T>,
    ignore_unmapped?: boolean,
    score_mode?: string,
    boost?: number,
    inner_hits?: {
        ignore_unmapped?: boolean,
        from?: number,
        size?: number,
        version?: boolean,
        seq_no_primary_term?: false,
        explain?: false,
        track_scores?: false,
        _source?: Source<T>
    }
}


/**
 * Query to select a sub-set of documents
 */
export type OSQuery<T> = {
    function_score?: FunctionScore<T>,
    constant_score?: ConstanScore<T>,
    boosting?: Boosting<T>,
    match_all?: {},

    bool?: BooleanStatement<T>,
    nested?: Nested<T>


    // TODO - figure out which queries are valid in match or filter contexts
    dis_max?: DisjointMatrix<T>,
    match_phrase?: m.MatchPhrase<T>,
    match?: m.Match<T>,


} & Partial<f.FilterStatement<T>>



export type AggsExp<T, A extends AggsQuery> = { [K in keyof A]: AggTypeDictionaryRecursive<T, A[K]["agg"], A[K]["aggs"]> }

/**
 * Search query with description of the aggs, as well as the response
 */
export type Search<T, A extends AggsQuery> = {

    /** Aggs query */
    aggs?: AggsExp<T, A>,

    docvalue_fields?: att.AnyAttribute<T>[],


    /** Query used for search */
    query?: OSQuery<T>,

    /** Subset of attributes used for search */
    _source?: Source<T> | boolean,

    indices_boost?: { [a: string]: number }[]

    min_score?: number,
    seq_no_primary_term?: boolean,
    terminate_after?: number,


    /** Number of documents to return in search */
    size?: number,

    stats?: string[],

    track_total_hits?: boolean,
    version?: boolean,
    explain?: boolean,
    from?: number,
    timeout?: string,
    stored_fields?: att.AnyAttribute<T>[],
    /** How to sort */
    sort?:
    RequireExactlyOne<{
        [key in att.AnyAttribute<T>]: {
            order?: "desc" | "asc",
            missing?: "_first" | "_last",
            nested_filter?: OSQuery<T>,
            nested_path?: string,
            mode?: "min" | "max" | "avg" | "sum",
        }
    }>[],

    search_after?: any[],

    /** Response which will be populated after searching */
    response?: SearchResponse<T, A>

    /** Index used for the search */
    index?: string,

}


/**
 * Type 'ResponseItem' is not assignable to type 'SearchResponse<T, A>'.
  Type 'MultiSearchItem' is not assignable to type 'SearchResponse<T, A>'.
    Types of property '"_shards"' are incompatible.
      Type 'ShardStatistics' is not assignable to type 'ShardsHitResult'.
        Property '"skipped"' is optional in type 'ShardStatistics' but required in type 'ShardsHitResult'.
 */


/**
 * Details of the Shards Hit
 */
// export type ShardsHitResult = {
//     "total": number,
//     "successful": number,
//     "skipped": number,
//     "failed": number
// }


/**
 * The search response JSON
 */
export type SearchResponse<T, A extends AggsQuery> = {
    "took": number,
    "timed_out": boolean,
    "_shards": ShardStatistics,
    "hits": Hits<T>,
    "aggregations"?: { [K in keyof A]: AggTypeResponseDictionary2<T, A[K]["agg"], A[K]["aggs"]> },
}


/**
 * Class to parse Reponse JSON to it's corresponding type
 */
export class ResponseParser<T, A extends AggsQuery>  {
    search: Search<T, A>
    constructor(search: Search<T, A>) {
        this.search = search
    }
    parseSearchResponse = (response: any) => response as SearchResponse<T, A>
}
