export interface LoadingStates {
  recommendations: boolean;
  userLibrary: boolean;
  selectedBook: boolean;
  addBook: boolean;
  deleteBook: boolean;
  reading: boolean;
}

export type LoadingKey = keyof LoadingStates;

export const initialLoadingState: LoadingStates = {
  recommendations: false,
  userLibrary: false,
  selectedBook: false,
  addBook: false,
  deleteBook: false,
  reading: false,
};

export class LoadingManager {
  static setLoading(
    currentState: LoadingStates,
    key: LoadingKey,
    isLoading: boolean
  ): LoadingStates {
    return {
      ...currentState,
      [key]: isLoading,
    };
  }

  static startLoading(
    currentState: LoadingStates,
    key: LoadingKey
  ): LoadingStates {
    return this.setLoading(currentState, key, true);
  }

  static stopLoading(
    currentState: LoadingStates,
    key: LoadingKey
  ): LoadingStates {
    return this.setLoading(currentState, key, false);
  }

  static isLoading(loadingState: LoadingStates, key: LoadingKey): boolean {
    return loadingState[key];
  }

  static isAnyLoading(loadingState: LoadingStates): boolean {
    return Object.values(loadingState).some((loading) => loading);
  }

  static getLoadingKeys(loadingState: LoadingStates): LoadingKey[] {
    return Object.entries(loadingState)
      .filter(([_, isLoading]) => isLoading)
      .map(([key, _]) => key as LoadingKey);
  }

  static resetAllLoading(): LoadingStates {
    return { ...initialLoadingState };
  }
}
