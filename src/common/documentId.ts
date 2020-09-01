import randomString from "./randomString";

export default () => {
  return new Date().getTime().toString(16) + randomString(8);
};
