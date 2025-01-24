import { FilterStatement } from "./filters";




export function negate<T>(filter: FilterStatement<T>): FilterStatement<T> {
    return {
        "bool": {
            "must_not": [
                filter
            ]
        }
    }
}


export function atLeast<T>(filters: FilterStatement<T>[], minShouldMatch: number): FilterStatement<T> {
    const anyMatch: FilterStatement<T> = {
        "bool": {
            "should": filters,
            "minimum_should_match": minShouldMatch
        }
    }
    return anyMatch
}

export const any = <T>(filters: FilterStatement<T>[]): FilterStatement<T> => atLeast(filters, 1)

export const all = <T>(filters: FilterStatement<T>[]): FilterStatement<T> => ({
    "bool": {
        "filter": filters
    }
})

export const none = <T>(filters: FilterStatement<T>[]): FilterStatement<T> => ({
    "bool": {
        "must_not": filters
    }
})