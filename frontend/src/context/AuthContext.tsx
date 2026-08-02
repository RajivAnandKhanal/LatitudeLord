import { createContext, useContext, useEffect, useState } from "react";

import * as authService from "../services/authService";
import * as userService from "../services/userService";
import * as busService from "../services/busService";
import * as routeService from "../services/routeService";
import * as staffService from "../services/staffService";
import { BackendUser, BackendRole } from "../services/authService";
import { setOnSessionExpired } from "../services/httpClient";
import { clearTokens, getAccessToken } from "../services/tokenStorage";
import { reconnectSocket, disconnectSocket } from "../services/socket";
import { toBusSchedule } from "../adapters/busAdapters";

import { DriverBus, DriverUser, PassengerUser, User } from "../types/auth";

export type AppUser = PassengerUser | DriverUser | User;

type EditableFields<T> = Omit<T, "id" | "email" | "role">;

export type ProfileUpdate =
  | EditableFields<PassengerUser>
  | EditableFields<DriverUser>
  | EditableFields<User>;

interface AuthContextValue {
  user: AppUser | null;

  loading: boolean;

  login: (email: string, password: string, role: BackendRole) => Promise<AppUser>;

  register: (payload: {
    name: string;
    email: string;
    password: string;
    role: BackendRole;
    phone?: string;
  }) => Promise<AppUser>;

  updateUser: (updates: Partial<ProfileUpdate>) => Promise<void>;

  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<{ success: boolean; error?: string }>;

  logout: () => Promise<void>;

  refreshDriverBuses: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({} as AuthContextValue);

async function buildDriverBuses(): Promise<DriverBus[]> {
  const { items: buses } = await busService.getAllBuses({ driver: "me" });
  const { items: staff } = await staffService.getMyStaff().catch(() => ({ items: [], total: 0, page: 1, limit: 20 }));

  return Promise.all(
    buses.map(async (bus) => {
      const route = await routeService.getScheduleByBus(bus._id).catch(() => null);

      return {
        id: bus._id,
        numberPlate: bus.plateNumber,
        companyBusNumber: bus.busNumber,
        staff: staff.map((s) => ({ id: s._id, staffName: s.name, staffPhone: s.phone })),
        schedule: route ? toBusSchedule(route.schedule) : [],
      };
    }),
  );
}

async function toAppUser(backendUser: BackendUser): Promise<AppUser> {
  const base = { id: backendUser._id, email: backendUser.email, createdAt: backendUser.createdAt };

  if (backendUser.role === "passenger") {
    return {
      ...base,
      role: "passenger",
      fullName: backendUser.name,
      gender: backendUser.gender ?? "",
      healthCondition: backendUser.healthCondition ?? "",
      photoUrl: backendUser.avatar ?? "",
    } satisfies PassengerUser;
  }

  const buses = await buildDriverBuses().catch(() => []);

  return {
    ...base,
    role: "driver",
    fullName: backendUser.name,
    phoneNumber: backendUser.phone ?? "",
    photoUrl: backendUser.avatar ?? "",
    buses,
  } satisfies DriverUser;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    restoreSession();
    setOnSessionExpired(() => {
      setUser(null);
      disconnectSocket();
    });
  }, []);

  async function restoreSession() {
    try {
      const token = await getAccessToken();
      if (!token) return;

      const backendUser = await authService.getMe();
      setUser(await toAppUser(backendUser));
      await reconnectSocket();
    } catch {
      await clearTokens();
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string, role: BackendRole) {
    const result = await authService.login({ email, password, role });
    const appUser = await toAppUser(result.user);
    setUser(appUser);
    await reconnectSocket();
    return appUser;
  }

  async function register(payload: {
    name: string;
    email: string;
    password: string;
    role: BackendRole;
    phone?: string;
  }) {
    const result = await authService.register(payload);
    const appUser = await toAppUser(result.user);
    setUser(appUser);
    await reconnectSocket();
    return appUser;
  }

  async function updateUser(updates: Partial<ProfileUpdate>) {
    if (!user) return;

    const isDriver = user.role === "driver";
    const payload = isDriver
      ? {
          name: (updates as Partial<DriverUser>).fullName,
          phone: (updates as Partial<DriverUser>).phoneNumber,
          avatar: (updates as Partial<DriverUser>).photoUrl,
        }
      : {
          name: (updates as Partial<PassengerUser>).fullName,
          gender: (updates as Partial<PassengerUser>).gender,
          healthCondition: (updates as Partial<PassengerUser>).healthCondition,
          avatar: (updates as Partial<PassengerUser>).photoUrl,
        };

    // Drop undefined keys so we don't overwrite fields the caller didn't touch.
    const cleaned = Object.fromEntries(
      Object.entries(payload).filter(([, v]) => v !== undefined),
    );

    const backendUser = await userService.updateMyProfile(cleaned);
    setUser(await toAppUser(backendUser));
  }

  async function changePassword(currentPassword: string, newPassword: string) {
    try {
      await userService.changePassword(currentPassword, newPassword);
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not change password.";
      return { success: false, error: message };
    }
  }

  async function logout() {
    await authService.logout().catch(() => undefined);
    setUser(null);
    disconnectSocket();
  }

  async function refreshDriverBuses() {
    if (!user || user.role !== "driver") return;
    const buses = await buildDriverBuses().catch(() => []);
    setUser({ ...(user as DriverUser), buses });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        updateUser,
        changePassword,
        logout,
        refreshDriverBuses,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
