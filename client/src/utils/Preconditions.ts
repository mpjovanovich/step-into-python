/**
 * Utility class for enforcing preconditions.
 * Should be used as a sanity check for developer mistakes.
 */
export class Precondition {
  private static readonly MESSAGES = {
    IS_FALSE: "Condition must be false",
    IS_TRUE: "Condition must be true",
    NOT_EMPTY_ARRAY: "Array must not be empty",
    NOT_EMPTY_STRING: "String must not be empty",
  };

  static isTrue(condition: boolean) {
    if (!condition) {
      throw new Error(this.MESSAGES.IS_TRUE);
    }
  }

  static isFalse(condition: boolean) {
    if (condition) {
      throw new Error(this.MESSAGES.IS_FALSE);
    }
  }

  static notEmptyArray<T>(array: T[]) {
    if (array.length === 0) {
      throw new Error(this.MESSAGES.NOT_EMPTY_ARRAY);
    }
  }

  static notEmptyString(string: string) {
    if (!string.trim()) {
      throw new Error(this.MESSAGES.NOT_EMPTY_STRING);
    }
  }
}
