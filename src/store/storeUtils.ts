import { LoadingManager, LoadingStates, LoadingKey } from "./loadingUtils";
import { ErrorManager, ErrorStates, ErrorKey } from "./errorUtils";

export interface StoreState {
  loading: LoadingStates;
  errors: ErrorStates;
}

export type SetState<T> = (
  partial: T | Partial<T> | ((state: T) => T | Partial<T>)
) => void;

/**
 * Higher-order function that wraps async operations with loading and error handling
 */
export function withAsyncOperation<T extends StoreState, R = any>(
  set: SetState<T>,
  loadingKey: LoadingKey,
  errorKey: ErrorKey,
  operation: () => Promise<R>,
  operationName: string
) {
  return async (): Promise<R> => {
    // Start loading and clear previous errors
    set(
      (state) =>
        ({
          loading: LoadingManager.startLoading(state.loading, loadingKey),
          errors: ErrorManager.clearError(state.errors, errorKey),
        } as Partial<T>)
    );

    try {
      const result = await operation();

      // Stop loading on success
      set(
        (state) =>
          ({
            loading: LoadingManager.stopLoading(state.loading, loadingKey),
          } as Partial<T>)
      );

      ErrorManager.logSuccess(operationName);
      return result;
    } catch (err: any) {
      const errorMessage = ErrorManager.extractErrorMessage(err);

      // Stop loading and set error
      set(
        (state) =>
          ({
            loading: LoadingManager.stopLoading(state.loading, loadingKey),
            errors: ErrorManager.setError(state.errors, errorKey, errorMessage),
          } as Partial<T>)
      );

      ErrorManager.logError(operationName, errorMessage);
      throw new Error(errorMessage);
    }
  };
}

/**
 * Utility function to create loading/error state updaters
 */
export function createStateUpdaters<T extends StoreState>(set: SetState<T>) {
  return {
    setLoading: (key: LoadingKey, isLoading: boolean) => {
      set(
        (state) =>
          ({
            loading: LoadingManager.setLoading(state.loading, key, isLoading),
          } as Partial<T>)
      );
    },

    setError: (key: ErrorKey, error: string | null) => {
      set(
        (state) =>
          ({
            errors: ErrorManager.setError(state.errors, key, error),
          } as Partial<T>)
      );
    },

    clearError: (key: ErrorKey) => {
      set(
        (state) =>
          ({
            errors: ErrorManager.clearError(state.errors, key),
          } as Partial<T>)
      );
    },

    clearAllErrors: () => {
      set({
        errors: ErrorManager.clearAllErrors(),
      } as Partial<T>);
    },

    startLoading: (key: LoadingKey) => {
      set(
        (state) =>
          ({
            loading: LoadingManager.startLoading(state.loading, key),
          } as Partial<T>)
      );
    },

    stopLoading: (key: LoadingKey) => {
      set(
        (state) =>
          ({
            loading: LoadingManager.stopLoading(state.loading, key),
          } as Partial<T>)
      );
    },
  };
}
