export type ObjectType = Record<PropertyKey, unknown>;

export type PickByValue<OBJ_T, VALUE_T> // From https://stackoverflow.com/a/55153000
    = Pick<OBJ_T, { [K in keyof OBJ_T]: OBJ_T[K] extends VALUE_T ? K : never }[keyof OBJ_T]>;

    export type ObjectEntries<OBJ_T> // From https://stackoverflow.com/a/60142095
    = { [K in keyof OBJ_T]: [keyof PickByValue<OBJ_T, OBJ_T[K]>, OBJ_T[K]] }[keyof OBJ_T][];


export function getTypedObjectEntries<OBJ_T extends ObjectType>(obj: OBJ_T): ObjectEntries<OBJ_T> {
        return Object.entries(obj) as ObjectEntries<OBJ_T>;
    }