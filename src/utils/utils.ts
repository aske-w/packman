export const LOCAL_STORAGE_PREFIX = "learn_packing_"

export const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getYearMonthDay =(date:Date) => date.getUTCFullYear() + date.getUTCMonth() + date.getUTCDay(); 