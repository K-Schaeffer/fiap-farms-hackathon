// Cross-platform storage utility
// Uses localStorage on web and AsyncStorage on React Native

import AsyncStorage from '@react-native-async-storage/async-storage';

// Check if we're in a React Native environment
const _isReactNative = (): boolean => {
  return (
    typeof navigator !== 'undefined' && navigator.product === 'ReactNative'
  );
};

export const storage = {
  async getItem(key: string): Promise<string | null> {
    try {
      if (_isReactNative()) {
        return await AsyncStorage.getItem(key);
      }

      // Web environment - use localStorage
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem(key);
      }

      return null;
    } catch (error) {
      console.warn('Storage getItem failed:', error);
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (_isReactNative()) {
        await AsyncStorage.setItem(key, value);
        return;
      }

      // Web environment - use localStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, value);
      }
    } catch (error) {
      console.warn('Storage setItem failed:', error);
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      if (_isReactNative()) {
        await AsyncStorage.removeItem(key);
        return;
      }

      // Web environment - use localStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn('Storage removeItem failed:', error);
    }
  },

  async getAllKeys(): Promise<string[]> {
    try {
      if (_isReactNative()) {
        const keys = await AsyncStorage.getAllKeys();
        return [...keys]; // Convert readonly array to mutable array
      }

      // Web environment - use localStorage
      if (typeof localStorage !== 'undefined') {
        return Object.keys(localStorage);
      }

      return [];
    } catch (error) {
      console.warn('Storage getAllKeys failed:', error);
      return [];
    }
  },

  async multiRemove(keys: string[]): Promise<void> {
    try {
      if (_isReactNative()) {
        await AsyncStorage.multiRemove(keys);
        return;
      }

      // Web environment - remove each key individually
      if (typeof localStorage !== 'undefined') {
        keys.forEach(key => localStorage.removeItem(key));
      }
    } catch (error) {
      console.warn('Storage multiRemove failed:', error);
    }
  },
};
