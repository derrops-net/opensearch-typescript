import { AggTypeDictionaryRecursive, AggsQuery } from "./aggInput"
import { AggTypeResponseDictionary2 } from "./aggOutput"
import * as att from "./attributes"
import * as f from "./filters"
import * as m from "./match"



/**
 * Represents a document
 */
export type Document<T> = {
    _index : string,
    _id : string,
    _score : number,
    _source : T
}


/**
 * Represents (Hits|Search Results)
 */
export type Hits<T> = {
    "total" : {
        "value" : number,
        "relation" : string
    },
    "max_score" : any,
    "hits" : Document<T>[]
}

export type Source<T> = {
    includes? : att.AnyAttribute<T>[],
    excludes? : att.AnyAttribute<T>[],
}

export type BooleanStatement<T> = {
    should? : f.FilterStatement<T>[],
    filter? : f.FilterStatement<T>[],
    must? : f.FilterStatement<T>[],
    must_not? : f.FilterStatement<T>[],
    minimum_should_match? : number,
}

/**
 * Query to select a sub-set of documents
 */
export type OSQuery<T> = {
    match_all? : {},
    bool? : BooleanStatement<T>,
    nested? : {
        path : string,
        query : OSQuery<T>,
        ignore_unmapped? : boolean,
        score_mode? : string,
        boost? : number,
        inner_hits? : {
            ignore_unmapped? : boolean,
            from? : number,
            size? : number,
            version? : boolean,
            seq_no_primary_term? : false,
            explain? : false,
            track_scores? : false,
            _source? : Source<T>
        }
    }
    match_phrase? : m.MatchPhrase<T>,
    match? : m.Match<T>,

} & Partial<f.FilterStatement<T>>



/**
 * Search query with description of the aggs, as well as the response
 */
export type Search<T, A extends AggsQuery> = {

    /** Aggs query */ 
    aggs? : {[K in keyof A] : AggTypeDictionaryRecursive<T,A[K]["agg"],A[K]["aggs"]>},


    docvalue_fields? : att.AnyAttribute<T>[],


    /** Query used for search */ 
    query? : OSQuery<T>,

    /** Subset of attributes used for search */ 
    _source? : Source<T> | boolean,

    indices_boost? : { [a:string] : number }[]

    min_score? : number,
    seq_no_primary_term? : boolean,
    terminate_after? : number,


    /** Number of documents to return in search */ 
    size? : number,

    stats? : string[],
    
    track_total_hits? : boolean,
    version? : boolean,
    explain? : boolean,
    from? : number,
    timeout? : string,
    stored_fields? : att.AnyAttribute<T>[],
    /** How to sort */
    sort? : 
        Partial<{
            [key in att.AnyAttribute<T>] : {
                order? : "desc" | "asc",
                missing?: "_first" | "_last",
                nested_filter? : OSQuery<T>,
                nested_path? : string,
                mode? : "min" | "max" | "avg" | "sum",
            }
        }>[],

    
    /** Response which will be populated after searching */
    response? : SearchResponse<T,A>

    /** Index used for the search */
    index? : string,

}



/**
 * Details of the Shards Hit
 */
export type ShardsHitResult = {
    "total" : number,
    "successful" : number,
    "skipped" : number,
    "failed" : number
}


/**
 * The search response JSON
 */
export type SearchResponse<T, A extends AggsQuery > = {
    "took" : number,
    "timed_out" : boolean,
    "_shards" : ShardsHitResult,
    "hits" : Hits<T>,
    "aggregations"? : {[K in keyof A] :  AggTypeResponseDictionary2<T,A[K]["agg"],A[K]["aggs"]>},
}


/**
 * Class to parse Reponse JSON to it's corresponding type
 */
export class ResponseParser <T, A extends AggsQuery>  {
    search : Search<T, A>
    constructor(search : Search<T, A>) {
        this.search = search
    }
    parseSearchResponse = (response : any) => response as SearchResponse<T, A>
}
