import randomString from "./randomString";

export const generateDocumentId = () => {
  return new Date().getTime().toString(16) + randomString(8);
};
