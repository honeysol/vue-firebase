export default (size: number) => {
  return Array.from(crypto.getRandomValues(new Uint8Array(size)))
    .map(x => ("0" + x.toString(16)).slice(-2))
    .join("");
};
