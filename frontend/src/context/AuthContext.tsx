import { createContext, useContext, useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { mockUsers } from "../mock/users";
import { DriverUser, PassengerUser, User } from "../types/auth";

export type AppUser = PassengerUser | DriverUser | User;

type EditableFields<T> = Omit<T, "id" | "email" | "role">;

export type ProfileUpdate =
  | EditableFields<PassengerUser>
  | EditableFields<DriverUser>
  | EditableFields<User>;

interface AuthContextValue {
  user: AppUser | null;

  loading: boolean;

  login: (user: AppUser) => Promise<void>;

  updateUser: (updates: Partial<ProfileUpdate>) => Promise<void>;

  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<{ success: boolean; error?: string }>;

  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({} as AuthContextValue);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    restoreUser();
  }, []);

  async function restoreUser() {
    try {
      const saved = await AsyncStorage.getItem("user");

      if (saved) {
        setUser(JSON.parse(saved));
      }
    } finally {
      setLoading(false);
    }
  }

  async function login(userData: AppUser) {
    setUser(userData);

    await AsyncStorage.setItem("user", JSON.stringify(userData));
  }

  async function updateUser(updates: Partial<ProfileUpdate>) {
    if (!user) {
      return;
    }

    const nextUser = { ...user, ...updates } as AppUser;

    setUser(nextUser);

    await AsyncStorage.setItem("user", JSON.stringify(nextUser));

    const index = mockUsers.findIndex((item) => item.id === user.id);

    if (index >= 0) {
      mockUsers[index] = { ...mockUsers[index], ...updates } as typeof mockUsers[number];
    }
  }

  async function changePassword(currentPassword: string, newPassword: string) {
    if (!user) {
      return { success: false, error: "Not signed in." };
    }

    const index = mockUsers.findIndex((item) => item.id === user.id);

    if (index < 0) {
      return { success: false, error: "Account not found." };
    }

    if (mockUsers[index].password !== currentPassword) {
      return { success: false, error: "Current password is incorrect." };
    }

    mockUsers[index] = { ...mockUsers[index], password: newPassword };

    return { success: true };
  }

  async function logout() {
    setUser(null);

    await AsyncStorage.removeItem("user");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        updateUser,
        changePassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
