import AsyncStorage from "@react-native-async-storage/async-storage";

const ACCESS_KEY = "auth:accessToken";
const REFRESH_KEY = "auth:refreshToken";

export type TokenPair = { accessToken: string; refreshToken: string };

export async function saveTokens(tokens: TokenPair): Promise<void> {
  await AsyncStorage.multiSet([
    [ACCESS_KEY, tokens.accessToken],
    [REFRESH_KEY, tokens.refreshToken],
  ]);
}

export async function getAccessToken(): Promise<string | null> {
  return AsyncStorage.getItem(ACCESS_KEY);
}

export async function getRefreshToken(): Promise<string | null> {
  return AsyncStorage.getItem(REFRESH_KEY);
}

export async function clearTokens(): Promise<void> {
  await AsyncStorage.multiRemove([ACCESS_KEY, REFRESH_KEY]);
}
