import AsyncStorage from '@react-native-async-storage/async-storage'

/**
 * Set a string value in async storage
 */
export async function setItem(key: string, value: string): Promise<void> {
  try {
    await AsyncStorage.setItem(key, value)
  } catch (error) {
    console.error(`Failed to set async storage item: ${key}`, error)
    throw error
  }
}

/**
 * Get a string value from async storage
 */
export async function getItem(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key)
  } catch (error) {
    console.error(`Failed to get async storage item: ${key}`, error)
    return null
  }
}

/**
 * Remove an item from async storage
 */
export async function removeItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key)
  } catch (error) {
    console.error(`Failed to remove async storage item: ${key}`, error)
    throw error
  }
}

/**
 * Set an object in async storage (serializes to JSON)
 */
export async function setObject<T>(key: string, value: T): Promise<void> {
  try {
    const jsonValue = JSON.stringify(value)
    await setItem(key, jsonValue)
  } catch (error) {
    console.error(`Failed to set async storage object: ${key}`, error)
    throw error
  }
}

/**
 * Get an object from async storage (deserializes from JSON)
 */
export async function getObject<T>(key: string): Promise<T | null> {
  try {
    const jsonValue = await getItem(key)
    if (jsonValue === null) return null
    return JSON.parse(jsonValue) as T
  } catch (error) {
    console.error(`Failed to get async storage object: ${key}`, error)
    return null
  }
}
