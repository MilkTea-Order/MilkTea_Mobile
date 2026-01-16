/**
 * Generic SecureStore utilities
 * Wraps expo-secure-store with type-safe methods
 * NO domain logic here - pure storage operations
 */

import * as SecureStore from "expo-secure-store";
import { STORAGE_KEYS } from "./storage.keys";

/**
 * Set a string value in secure storage
 */
export async function setItem(key: string, value: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.error(`Failed to set secure storage item: ${key}`, error);
    throw error;
  }
}

/**
 * Get a string value from secure storage
 */
export async function getItem(key: string): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error(`Failed to get secure storage item: ${key}`, error);
    return null;
  }
}

/**
 * Remove an item from secure storage
 */
export async function removeItem(key: string): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error(`Failed to remove secure storage item: ${key}`, error);
    throw error;
  }
}

/**
 * Set an object in secure storage (serializes to JSON)
 */
export async function setObject<T>(key: string, value: T): Promise<void> {
  try {
    const jsonValue = JSON.stringify(value);
    await setItem(key, jsonValue);
  } catch (error) {
    console.error(`Failed to set secure storage object: ${key}`, error);
    throw error;
  }
}

/**
 * Get an object from secure storage (deserializes from JSON)
 */
export async function getObject<T>(key: string): Promise<T | null> {
  try {
    const jsonValue = await getItem(key);
    if (jsonValue === null) {
      return null;
    }
    return JSON.parse(jsonValue) as T;
  } catch (error) {
    console.error(`Failed to get secure storage object: ${key}`, error);
    return null;
  }
}

/**
 * Clear all registered storage keys
 * SecureStore has no native clearAll, so we delete known keys
 */
export async function clearAll(): Promise<void> {
  try {
    const allKeys = [
      // Auth keys
      STORAGE_KEYS.AUTH.ACCESS_TOKEN,
      STORAGE_KEYS.AUTH.REFRESH_TOKEN,
      STORAGE_KEYS.AUTH.USER,
      // Settings keys
      STORAGE_KEYS.SETTINGS.THEME_MODE,
      STORAGE_KEYS.SETTINGS.LANGUAGE,
      // Onboarding keys
      STORAGE_KEYS.ONBOARDING.COMPLETED,
    ];

    await Promise.all(allKeys.map((key) => removeItem(key)));
  } catch (error) {
    console.error("Failed to clear all secure storage", error);
    throw error;
  }
}
