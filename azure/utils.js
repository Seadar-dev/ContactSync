export function expirationDate() {
  let expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 6);
  return expirationDate;
}