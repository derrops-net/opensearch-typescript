import { GeoPoint } from "./exports";

type addPrefix<TKey, TPrefix extends string> = TKey extends string
  ? `${TPrefix}${TKey}`
  : never;

type removePrefix<TPrefixedKey, TPrefix extends string> = TPrefixedKey extends addPrefix<infer TKey, TPrefix>
  ? TKey
  : '';

type addSuffix<TKey, TSuffix extends string> = TKey extends string
  ? `${TKey}${TSuffix}`
  : never;


type prefixedValue<TObject extends object, TPrefixedKey extends string, TPrefix extends string> = TObject extends { [K in removePrefix<TPrefixedKey, TPrefix>]: infer TValue }
  ? TValue
  : never;

export type addPrefixToObject<TObject extends object, TPrefix extends string> = {
  [K in addPrefix<keyof TObject, TPrefix>]: prefixedValue<TObject, K, TPrefix>
}



type Join<T extends string, U extends string> =
  "" extends T ? U : "" extends U ? T : `${T}.${U}`;

type DeepKeysMatching<T, V> = T extends V ? "" :
  T extends Array<infer U> ? DeepKeysMatching<U, V> :
  T extends object ? {
    [K in keyof T]: Join<string & K, DeepKeysMatching<T[K], V>>
  }[keyof T] : never;


export type HiddenSearchableAttributes = "_id"


export type BooleanAtt<T> = DeepKeysMatching<T, boolean>
export type StringAtt<T> = DeepKeysMatching<T, string> | HiddenSearchableAttributes
export type NumberAtt<T> = DeepKeysMatching<T, number>
export type DateAtt<T> = DeepKeysMatching<T, Date>
export type KeyWord<T> = addSuffix<StringAtt<T>, '.keyword'>
export type GeoPointAtt<T> = DeepKeysMatching<T, GeoPoint>;



export type AnyAttribute<T> =
  BooleanAtt<T> |
  StringAtt<T> |
  NumberAtt<T> |
  DateAtt<T> |
  KeyWord<T> |
  GeoPointAtt<T> |
  HiddenSearchableAttributes

export type StatsAttribute<T> =
  NumberAtt<T> |
  DateAtt<T>


export type TextOrKeywordAtt<T> =
  KeyWord<T> |
  StringAtt<T> |
  HiddenSearchableAttributes
