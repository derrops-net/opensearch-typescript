import { RequireExactlyOne } from "type-fest"
import * as att from "./attributes"


export type MatchRaw<T> = RequireExactlyOne<{
    [key in att.AnyAttribute<T>] : string
}>

export type MatchQuery<T> = RequireExactlyOne<{
    [key in att.AnyAttribute<T>] : {
        query : string,
        operator : string,
        minimum_should_match? : number,
        analyzer? : string,
        zero_terms_query? : string,
        fuzziness? : string,
        prefix_length? : string,
        fuzzy_transpositions? : boolean,
        auto_generate_synonyms_phrase_query? : boolean,
        boost? : number,
        enable_position_increments? : boolean,
        fuzzy_rewrite? : string,
        lenient? : boolean,
        max_expansions? : number,
    }
}>

export type Match<T> = MatchRaw<T> | MatchQuery<T>

export type MatchPhrase<T> = RequireExactlyOne<{
    [key in att.TextOrKeywordAtt<T>] : string
}>