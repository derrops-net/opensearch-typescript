import * as a from "./attributes"


/**
 * Field input to an agg
 */
export type Field<T> = {
    field : T
}

/**
 * Field representing a date
 */

export type TermsAggInput<T> = AnyField<T> & {
    size? : number,
}


export type BooleanField<T> = Field<a.BooleanAtt<T>>
export type SringField<T> = Field<a.StringAtt<T>>
export type NumberField<T> = Field<a.NumberAtt<T>>
export type DateField<T> = Field<a.DateAtt<T>>
export type KeyWordField<T> = Field<a.KeyWord<T>>
export type GeoPointField<T> = Field<a.GeoPointAtt<T>>


export type AnyField<T> = Field<a.AnyAttribute<T>>
export type StatsField<T> = Field<a.StatsAttribute<T>>

export type TextOrKeywordField<T> = Field<a.TextOrKeywordAtt<T>>
