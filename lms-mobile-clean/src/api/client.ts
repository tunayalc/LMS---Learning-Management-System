import AsyncStorage from "@react-native-async-storage/async-storage";

import { createApiClient, resolveApiBaseUrl } from "../shared";

import { getEnv, getRuntime } from "../config/env";

const env = getEnv();
const runtime = getRuntime();

// Default URL from environment
const defaultBaseUrl = resolveApiBaseUrl({ env, runtime });

// Mutable state for current URL
let currentBaseUrl = defaultBaseUrl;

// Key for AsyncStorage
const STORAGE_KEY = "LMS_SERVER_URL";

/**
 * Updates the current base URL and persists it to storage.
 */
export const setApiBaseUrl = async (url: string) => {
  if (!url) return;
  try {
    // Normalize URL (remove trailing slash)
    const normalizedUrl = url.replace(/\/$/, "");
    currentBaseUrl = normalizedUrl;
    await AsyncStorage.setItem(STORAGE_KEY, normalizedUrl);
    console.log("[api] Updated server URL:", normalizedUrl);
  } catch (error) {
    console.error("[api] Failed to save server URL:", error);
  }
};

/**
 * Loads the saved base URL from storage on startup.
 */
export const loadServerUrl = async () => {
  try {
    const savedUrl = await AsyncStorage.getItem(STORAGE_KEY);
    if (savedUrl) {
      currentBaseUrl = savedUrl;
      console.log("[api] Loaded server URL from storage:", savedUrl);
    } else {
      console.log("[api] Using default server URL:", defaultBaseUrl);
    }
  } catch (error) {
    console.error("[api] Failed to load server URL:", error);
  }
  return currentBaseUrl;
};

/**
 * Returns the current base URL.
 */
export const getApiBaseUrl = () => currentBaseUrl;

// Initialize client with a getter function for dynamic resolution
export const apiClient = createApiClient({
  baseUrl: () => currentBaseUrl
});

