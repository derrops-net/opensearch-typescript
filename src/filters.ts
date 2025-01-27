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

export type DateRange<T> = RequireExactlyOne<{
    [key in DateAtt<T>]: {
        gte?: Date | string,
        lte?: Date | string,
        gt?: Date | string,
        lt?: Date | string,
        time_zone?: string,
        format?: string,
        execution?: string,
    }
}>

type RangeStatement<T> = {
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

export type GeoBoundingBox<T> = {
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


export export type FuzzyStatement<T> = {
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
    BoolStatement<T> |
    AndStatement<T> |
    GeoBoundingBox<T> |
    XYShape<T> |
    FuzzyStatement<T>

export type BoolStatement<T> = {
    bool: BooleanStatement<T>
}

export type AndStatement<T> = {
    and: {
        filters: FilterStatement<T>
    }
}