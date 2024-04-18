import { NumberAtt, DateAtt, KeyWord, StringAtt, AnyAttribute, TextOrKeywordAtt } from "./attributes"


type RangeDefaults<A> = {
    gte? : A,
    lte? : A,
    gt? : A,
    lt? : A,
}

type Range<T, B extends string, R extends RangeDefaults<T>> = {
    [key in B] : R
}

type NumberRange<T> = Range<number, NumberAtt<T>, RangeDefaults<number>>

type DateRange<T> = Range<Date, DateAtt<T>, RangeDefaults<Date> & {
    time_zone?: string,
    format?: string,
    execution?: string,
}>


type RangeStatement<T> = {
    "range" : Partial<NumberRange<T> | DateRange<T>>
}

type ExistsStatement<T> = {
    "exists" : {
        "field" : AnyAttribute<T>
    }
}

type PrefixStatement<T> = {
    "prefix" : Partial<{
        [key in TextOrKeywordAtt<T>] : {
            value : string,
            boost? : number,
        }
    }>
}

type WildCardStatement<T> = {
    "wildcard" : Partial<{
        [key in TextOrKeywordAtt<T>] : {
            value : string,
            boost? : number,
        }
    }>
}

type RegexpStatement<T> = {
    "regexp" : Partial<{
        [key in TextOrKeywordAtt<T>] : {
            value : string,
            flags? : number,
            max_determinized_states? : number
        }
    }>
}

export type Term<A extends string, V> = {"term" : Partial<{[key in A] : V}>}
export type TermKeyword<T> = Term<KeyWord<T>, string>
export type TermString<T> =  Term<StringAtt<T>, string>
export type TermNumber<T> =  Term<NumberAtt<T>, number>
export type TermDate<T> =    Term<DateAtt<T>, Date>

export type TermStatement<T> = 
    TermKeyword<T> | 
    TermString<T> | 
    TermDate<T> | 
    TermNumber<T>

export type Terms<A extends string, V> = {"terms" : Partial<{[key in A] : V[]}>}

export type TermsKeyword<T> = Terms<KeyWord<T>, string>
export type TermsString<T> =  Terms<StringAtt<T>, string>
export type TermsNumber<T> =  Terms<NumberAtt<T>, number>
export type TermsDate<T> =  Terms<DateAtt<T>, Date>

export type TermsStatement<T> = 
    TermsKeyword<T> | 
    TermsString<T> | 
    TermsNumber<T> | 
    TermsDate<T>

export type FilterStatement<T> = 
    WildCardStatement<T> | 
    RegexpStatement<T> | 
    PrefixStatement<T> | 
    ExistsStatement<T> |  
    RangeStatement<T> | 
    TermStatement<T> | 
    TermsStatement<T> |
    BoolStatement<T> |
    AndStatement<T>

export type BoolStatement<T> = {
    bool : FilterStatement<T>
}

export type AndStatement<T> = {
    and : {
        filters : FilterStatement<T>
    }
}