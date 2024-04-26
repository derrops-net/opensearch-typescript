import * as att from "./attributes"

export type Match<T> = Partial<{
    [key in att.AnyAttribute<T>] : string
}>

export type MatchPhrase<T> = Partial<{
    [key in att.TextOrKeywordAtt<T>] : string
}>