import * as React from "react";

export function useLocalStorageState(
  key: string,
  defaultValue: any,
  { serialize = JSON.stringify, deserialize = JSON.parse } = {}
) {
  const [state, setState] = React.useState(() => {
    if (typeof window !== "undefined") {
      const valueInLocalStorage = window.localStorage.getItem(key);
      if (valueInLocalStorage) {
        return deserialize(valueInLocalStorage);
      } else {
        return defaultValue;
      }
    } else {
      return defaultValue;
    }
  });

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, serialize(state));
    }
  }, [key, serialize, state]);

  return [state, setState];
}
