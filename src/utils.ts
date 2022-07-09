export const justDate = (d: Date) => {
  d.setUTCHours(0, 0, 0, 0);
  return d;
};
