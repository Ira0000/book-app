export interface ErrorStates {
  recommendations: string | null;
  userLibrary: string | null;
  selectedBook: string | null;
  addBook: string | null;
  deleteBook: string | null;
  reading: string | null;
}

export type ErrorKey = keyof ErrorStates;

export const initialErrorState: ErrorStates = {
  recommendations: null,
  userLibrary: null,
  selectedBook: null,
  addBook: null,
  deleteBook: null,
  reading: null,
};

export class ErrorManager {
  static setError(
    currentState: ErrorStates,
    key: ErrorKey,
    error: string | null
  ): ErrorStates {
    return {
      ...currentState,
      [key]: error,
    };
  }

  static clearError(currentState: ErrorStates, key: ErrorKey): ErrorStates {
    return this.setError(currentState, key, null);
  }

  static clearAllErrors(): ErrorStates {
    return { ...initialErrorState };
  }

  static hasError(errorState: ErrorStates, key: ErrorKey): boolean {
    return errorState[key] !== null;
  }

  static hasAnyError(errorState: ErrorStates): boolean {
    return Object.values(errorState).some((error) => error !== null);
  }

  static getErrorKeys(errorState: ErrorStates): ErrorKey[] {
    return Object.entries(errorState)
      .filter(([_, error]) => error !== null)
      .map(([key, _]) => key as ErrorKey);
  }

  static extractErrorMessage(err: any): string {
    return (
      err.response?.data?.message ||
      err.message ||
      "An unexpected error occurred"
    );
  }

  static createStandardErrorMessages(operation: string) {
    return {
      fetch: `Failed to fetch ${operation}`,
      add: `Failed to add ${operation}`,
      update: `Failed to update ${operation}`,
      delete: `Failed to delete ${operation}`,
      save: `Failed to save ${operation}`,
    };
  }

  static logError(operation: string, error: string): void {
    console.error(`❌ ${operation} failed: ${error}`);
  }

  static logSuccess(operation: string): void {
    console.log(`✅ ${operation} completed successfully`);
  }
}
