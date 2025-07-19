export interface ReactNativeAsyncStorage {
  /**
   * Persist an item in storage.
   *
   * @param key - storage key.
   * @param value - storage value.
   */
  setItem(key: string, value: string): Promise<void>;
  /**
   * Retrieve an item from storage.
   *
   * @param key - storage key.
   */
  getItem(key: string): Promise<string | null>;
  /**
   * Remove an item from storage.
   *
   * @param key - storage key.
   */
  removeItem(key: string): Promise<void>;
}

/**
 * An interface covering the possible persistence mechanism types.
 *
 * @public
 */
export interface Persistence {
  /**
   * Type of Persistence.
   * - 'SESSION' is used for temporary persistence such as `sessionStorage`.
   * - 'LOCAL' is used for long term persistence such as `localStorage` or `IndexedDB`.
   * - 'NONE' is used for in-memory, or no persistence.
   * - 'COOKIE' is used for cookie persistence, useful for server-side rendering.
   */
  readonly type: 'SESSION' | 'LOCAL' | 'NONE' | 'COOKIE';
}
