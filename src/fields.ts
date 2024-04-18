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
export type AnyField<T> = Field<a.AnyAttribute<T>>

/**
 * Field representing a date
 */
export type DateField<T> = Field<a.DateAtt<T>>


/**
 * Number Field input to an agg
 */
export type NumberField<T> = Field<a.NumberAtt<T>>

/**
 * Value Field input to an agg
 */
export type ValueField<T> = Field<a.ValueAtt<T>>


export type GeoPointField<T> = Field<a.GeoPointAtt<T>>

/**
 * Text Field input to an agg
 */
export type TextField<T> = Field<a.TextOrKeywordAtt<T>>


export type TermsAggInput<T> = TextField<T> & {
    size? : number,
}