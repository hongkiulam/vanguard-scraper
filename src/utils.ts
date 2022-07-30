export const justDate = (d: Date) => {
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

export const jsDateToSQLDate = (d: Date) =>
  d.toISOString().slice(0, 19).replace("T", " ");
