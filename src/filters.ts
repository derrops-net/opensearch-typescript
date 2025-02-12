import { BooleanAtt } from "."
import { NumberAtt, DateAtt, KeyWord, StringAtt, AnyAttribute, TextOrKeywordAtt } from "./attributes"
import * as att from "./attributes"
import { BooleanStatement } from "./search"
import type { RequireExactlyOne } from 'type-fest';

export type RangeDefaults<A> = {
    gte?: A,
    lte?: A,
    gt?: A,
    lt?: A,
}

export type Range<T, B extends string, R extends RangeDefaults<T>> = RequireExactlyOne<{ [key in B]: R }>

export type NumberRange<T> = Range<number, NumberAtt<T>, RangeDefaults<number>>

export type DateRangeStatement = {
    gte?: Date | string,
    lte?: Date | string,
    gt?: Date | string,
    lt?: Date | string,
    time_zone?: string,
    format?: string,
    execution?: string,
}

export type DateRange<T> = RequireExactlyOne<{
    [key in DateAtt<T>]: DateRangeStatement
}>

export type RangeStatement<T> = {
    "range": NumberRange<T> | DateRange<T>
}

export type ExistsStatement<T> = {
    "exists": {
        "field": AnyAttribute<T>
    }
}

export type PrefixStatement<T> = {
    "prefix": RequireExactlyOne<{
        [key in TextOrKeywordAtt<T>]: {
            value: string,
            boost?: number,
        }
    }>
}

export type WildCardStatement<T> = {
    "wildcard": RequireExactlyOne<{
        [key in TextOrKeywordAtt<T>]: {
            value: string,
            boost?: number,
        }
    }>
}

export type RegexpStatement<T> = {
    "regexp": RequireExactlyOne<{
        [key in TextOrKeywordAtt<T>]: {
            value: string,
            flags?: number,
            max_determinized_states?: number
        }
    }>
}

export type GeoBoundingBox = {
    geo_bounding_box: {
        point: {
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
}

export type XYShape<T> = {
    xy_shape: {
        geometry: {
            shape: {
                type: "envelope",
                coordinates: [number, number][]
            },
            relation: "INTERSECTS" | "DISJOINT" | "WITHIN" | "CONTAINS"
        }
    }
}


export type FuzzyStatement<T> = {
    fuzzy:
    RequireExactlyOne<{ [a in att.StringAtt<T>]: {
        value: string,
        boost?: number,
        fuzziness?: number,
        max_expansions?: number,
        prefix_length?: number,
        rewrite?: string,
        transpositions: boolean,
    }
    }>
}


export type Match<A extends string, V> = {
    "match": {
        [k in keyof RequireExactlyOne<{ [key in A]: V }>]: {
            query: string,
            auto_generate_synonyms_phrase_query?: boolean,
            analyzer?: string,
            boost?: number,
            enable_position_increments?: boolean,
            fuzziness?: string,
            fuzzy_rewrite?: string,
            fuzzy_transpositions?: boolean,
            lenient?: boolean,
            max_expansions?: number,
            minimum_should_match?: number,
            operator?: string,
            prefix_length?: number,
            zero_terms_query?: string
        } | string
    }
}
export type MatchKeyword<T> = Match<KeyWord<T>, string>
export type MatchString<T> = Match<StringAtt<T>, string>
// export type MatchNumber<T> = Match<NumberAtt<T>, number>
// export type MatchBoolean<T> = Match<BooleanAtt<T>, boolean>
// export type MatchDate<T> = Match<DateAtt<T>, Date>
export type MatchStatement<T> =
    MatchKeyword<T> |
    MatchString<T>


export type Term<A extends string, V> = { "term": RequireExactlyOne<{ [key in A]: V }> }
export type TermKeyword<T> = Term<KeyWord<T>, string>
export type TermString<T> = Term<StringAtt<T>, string>
export type TermNumber<T> = Term<NumberAtt<T>, number>
export type TermBoolean<T> = Term<BooleanAtt<T>, boolean>
export type TermDate<T> = Term<DateAtt<T>, Date>

export type TermStatement<T> =
    TermKeyword<T> |
    TermString<T> |
    TermDate<T> |
    TermNumber<T> |
    TermBoolean<T>

export type Terms<A extends string, V> = { "terms": RequireExactlyOne<{ [key in A]: V[] }> }


export type TermsKeyword<T> = Terms<KeyWord<T>, string>
export type TermsString<T> = Terms<StringAtt<T>, string>
export type TermsNumber<T> = Terms<NumberAtt<T>, number>
export type TermsDate<T> = Terms<DateAtt<T>, Date>
export type TermsBoolean<T> = Terms<BooleanAtt<T>, boolean>

export type MoreLikeThisStatement<T> = {
    /** Specify the fields to compare */
    "fields"?: TermsString<T>[],
    "like"?: string,
    /** Minimum term frequency in the source document */
    "min_term_freq"?: number,
    /** Maximum number of query terms to use */
    "max_query_terms"?: number,


    /** Minimum number of documents in which a term should appear to be considered. */
    min_doc_freq: number,
    /** Maximum number of documents in which a term may appear. */
    max_doc_freq: number,
    /** Minimum word length below which terms will be ignored. */
    min_word_length: number,
    /** Maximum word length above which terms will be ignored. */
    max_word_length: number,


}
export type MoreLikeThis<T> = {
    "more_like_this": MoreLikeThisStatement<T>
}

export type TermsStatement<T> =
    TermsKeyword<T> |
    TermsString<T> |
    TermsNumber<T> |
    TermsDate<T> |
    TermsBoolean<T>

export type FilterStatement<T> =
    WildCardStatement<T> |
    RegexpStatement<T> |
    PrefixStatement<T> |
    ExistsStatement<T> |
    RangeStatement<T> |
    TermStatement<T> |
    TermsStatement<T> |
    MatchStatement<T> |
    // MatchesStatement<T> |
    BoolStatement<T> |
    AndStatement<T> |
    GeoBoundingBox |
    XYShape<T> |
    FuzzyStatement<T> |
    MoreLikeThis<T>

export type BoolStatement<T> = {
    bool: BooleanStatement<T>
}

export type AndStatement<T> = {
    and: {
        filters: FilterStatement<T>
    }
}