export const pushItemToBack = <T>(arr: T[], idx: number) => {
  const item = arr[idx];
  arr.splice(idx, 1);
  arr.push(item);
  return arr;
};
