
export * from "./Auth";

export const KEY_LOCALSTORAGE_USER = `app-local-storage`;
export type Optional<Type> = [Type] | [];


export function unwrap<T>(val: Optional<T>): T | null {
  if (val[0] === undefined) {
    return null;
  } else {
    return val[0];
  }
}
const enableCache = false;
export function getUserFromStorage(
  storage = window.localStorage,
  key: string
): any | undefined {
  if (!enableCache) {
    return undefined;
  }
  const lsUser = storage.getItem(key);
  if (lsUser) {
    return JSON.parse(lsUser, (k, v) => {
      if (k === "rewards") {
        return BigInt(v);
      }
      return v;
    }) as any;
  } else {
    return undefined;
  }
}
