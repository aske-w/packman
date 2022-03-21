export const LOCAL_STORAGE_PREFIX = 'learn_packing_';

export const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getYearMonthDay = (date: Date) => date.getUTCFullYear() + date.getUTCMonth() + date.getUTCDay();

export const getLocalStorage = <T>(key: string) => {
  const stored = window.localStorage.getItem(key);
  return stored !== null ? (JSON.parse(stored) as T) : undefined;
};
