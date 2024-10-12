export type LocalStorage = {
  models: string[];
};

export type StorageKeys = keyof LocalStorage;

export const setLocalStorage = (value: string[]): Promise<void> => {
  const updatedValues = {
    models: value,
  };
  return new Promise((resolve) => {
    chrome.storage.local.set(updatedValues, () => {
      resolve();
    });
  });
};

export const getStoredModels = (): Promise<LocalStorage["models"]> => {
  const keys: StorageKeys = "models";
  return new Promise((resolve) => {
    chrome.storage.local.get(keys, (res: LocalStorage) => {
      resolve(res.models);
    });
  });
};
