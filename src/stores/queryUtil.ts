import { firestore } from "firebase/app";

export const operatorMap = {
  $gt: ">",
  $gte: ">=",
  $eq: "==",
  $lt: "<",
  $lte: "<=",
  $in: "in",
  $elemMatch: "array-contains",
  ">": ">",
  ">=": ">=",
  "==": "==",
  "<": "<",
  "<=": "<=",
  in: "in",
  "array-contains": "array-contains",
  "array-contains-any": "array-contains-any"
};

export type operatorMapType = typeof operatorMap;
export type operator = keyof operatorMapType;
export type filterFieldParams =
  | { [O in operator]?: string | number }
  | string
  | number;
export type filterParams = { [K in string]: filterFieldParams };
export type deriveQueryParams = {
  filter?: filterParams;
  documentId?: filterFieldParams;
  limit?: number;
  limitToLast?: number;
};

const deriveQueryForKey = <T>({
  condition,
  key,
  query
}: {
  condition: filterFieldParams;
  key: firestore.FieldPath | string;
  query: firestore.Query<T>;
}) => {
  let _query = query;
  if (typeof condition === "object") {
    const operators = Object.keys(condition) as (keyof typeof condition)[];

    for (const operator of operators) {
      const firestoreOperator = operatorMap[operator];
      if (!firestoreOperator) {
        console.error("You cannot use this query in firestore", condition);
        continue;
      }
      _query = _query.where(
        key,
        firestoreOperator as firestore.WhereFilterOp,
        condition[operator]
      );
    }
  } else {
    _query = _query.where(key, "==", condition);
  }
  return _query;
};

export const deriveQuery = <T>({
  query,
  filter,
  documentId,
  limit,
  limitToLast
}: deriveQueryParams & { query: firestore.Query<T> }) => {
  let _query = query;
  if (filter) {
    for (const key of Object.keys(filter) as (keyof typeof filter)[]) {
      _query = deriveQueryForKey({
        query: _query,
        key,
        condition: filter[key]
      });
    }
  }
  if (documentId) {
    _query = deriveQueryForKey({
      query: _query,
      key: firestore.FieldPath.documentId(),
      condition: documentId
    });
  }
  if (typeof limit == "number") {
    _query = _query.limit(limit);
  }
  if (typeof limitToLast == "number") {
    _query = _query.limitToLast(limitToLast);
  }
  return _query;
};
