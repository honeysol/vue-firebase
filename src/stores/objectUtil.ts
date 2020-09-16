import { firestore } from "firebase/app";

export interface DocumentData {
  [index: string]: number | string | null | DocumentData;
}

const _objectGetter = (
  obj: DocumentData,
  fields: string[],
  index = 0
): string | number | DocumentData | undefined | null => {
  if (obj === null || typeof obj !== "object") {
    return undefined;
  }
  const field = fields[index];
  const value = obj[field];
  if (fields.length == index + 1) {
    return value;
  } else if (value !== null && typeof value === "object") {
    return _objectGetter(value, fields, index + 1);
  }
};

export const objectGetter = (
  obj: DocumentData | null | undefined,
  field: string | number
) => {
  if (!obj) {
    return undefined;
  }
  if (typeof field === "string") {
    return _objectGetter(obj, field.split("."));
  } else {
    return obj[field];
  }
};

const _objectSetter = <V>(
  obj: any,
  fields: (string | number)[],
  value: string | number | null,
  index = 0
): void => {
  if (obj === null || typeof obj !== "object") {
    throw new Error("[objectSetter] Can not set value ");
  }
  const field = fields[index];
  if (fields.length == index + 1) {
    obj[fields[index]] = value;
  } else {
    if (typeof obj[field] === "undefined") {
      obj[field] || {};
    }
    return _objectSetter(obj[field], fields, value, index + 1);
  }
};

export const objectSetter = (
  obj: DocumentData | null | undefined,
  field: string | number,
  value: string | number | null
) => {
  if (!obj) {
    return undefined;
  }
  if (typeof field === "string") {
    return _objectSetter(obj, field.split("."), value);
  } else {
    return obj[field];
  }
};

export const updateDataToObject = (
  updateData: firestore.UpdateData
): DocumentData => {
  const obj: DocumentData = {};
  for (const key of Object.keys(updateData)) {
    objectSetter(obj, key, updateData[key]);
  }
  return obj;
};
