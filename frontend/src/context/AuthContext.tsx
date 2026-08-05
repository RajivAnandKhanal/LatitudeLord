import { createContext, useContext, useEffect, useRef, useState } from "react";

import * as authService from "../services/authService";
import * as userService from "../services/userService";
import * as busService from "../services/busService";
import * as routeService from "../services/routeService";
import * as staffService from "../services/staffService";
import { BackendUser, BackendRole } from "../services/authService";
import { ApiRequestError, setOnSessionExpired } from "../services/httpClient";
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

  login: (
    email: string,
    password: string,
    role: BackendRole,
  ) => Promise<AppUser>;

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
  const { items: staff } = await staffService
    .getMyStaff()
    .catch(() => ({ items: [], total: 0, page: 1, limit: 20 }));

  return Promise.all(
    buses.map(async (bus) => {
      const route = await routeService
        .getScheduleByBus(bus._id)
        .catch(() => null);

      return {
        id: bus._id,
        numberPlate: bus.plateNumber,
        companyBusNumber: bus.busNumber,
        staff: staff.map((s) => ({
          id: s._id,
          staffName: s.name,
          staffPhone: s.phone,
        })),
        schedule: route ? toBusSchedule(route.schedule) : [],
      };
    }),
  );
}

async function toAppUser(backendUser: BackendUser): Promise<AppUser> {
  const base = {
    id: backendUser._id,
    email: backendUser.email,
    createdAt: backendUser.createdAt,
  };

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

  // `updateUser` (and any other function here) is handed out fresh to every
  // consumer on every render, but a caller that invokes it from inside an
  // async handler (e.g. right after register()) may still be holding a
  // reference captured on an earlier render — one where `user` was still
  // null. Reading from a ref instead of the closed-over `user` state means
  // updateUser always sees the latest value no matter which render handed
  // out the function it's running.
  const userRef = useRef<AppUser | null>(null);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

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
      const appUser = await toAppUser(backendUser);
      userRef.current = appUser;
      setUser(appUser);
      await reconnectSocket();
    } catch (err) {
      // Only a real auth failure (expired/invalid token -> 401/403) means
      // the saved session is actually invalid. A network/timeout error (no
      // response at all, e.g. unreachable API host, dev server restarting,
      // spotty connection in Expo Go) is NOT proof the session is bad — it
      // just means we couldn't check right now. Wiping the tokens on every
      // such hiccup was why the app looked "logged out" whenever a request
      // failed to reach the backend. Keep the tokens in that case so the
      // next successful check can restore the session normally.
      const isAuthFailure =
        err instanceof ApiRequestError &&
        (err.statusCode === 401 || err.statusCode === 403);

      if (isAuthFailure) {
        await clearTokens();
      }
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string, role: BackendRole) {
    const result = await authService.login({ email, password, role });
    const appUser = await toAppUser(result.user);
    userRef.current = appUser;
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
    userRef.current = appUser;
    setUser(appUser);
    await reconnectSocket();
    return appUser;
  }

  async function updateUser(updates: Partial<ProfileUpdate>) {
    const currentUser = userRef.current;
    if (!currentUser) return;

    const isDriver = currentUser.role === "driver";
    let photoUrl = (updates as Partial<PassengerUser | DriverUser>).photoUrl;

    // A photoUrl coming from the image picker is a local device URI
    // (file://, content://, ph://, etc.) — it only resolves on this device
    // during this app session. Saving it as-is is why the photo vanished
    // after logout/login: the URI was persisted, but nothing was ever
    // actually uploaded anywhere. Upload it now and swap in the permanent
    // URL the backend returns before persisting the profile.
    if (photoUrl && /^(file|content|ph|assets-library):/i.test(photoUrl)) {
      photoUrl = await userService.uploadAvatar(photoUrl);
    }

    const payload = isDriver
      ? {
          name: (updates as Partial<DriverUser>).fullName,
          phone: (updates as Partial<DriverUser>).phoneNumber,
          avatar: photoUrl,
        }
      : {
          name: (updates as Partial<PassengerUser>).fullName,
          gender: (updates as Partial<PassengerUser>).gender,
          healthCondition: (updates as Partial<PassengerUser>).healthCondition,
          avatar: photoUrl,
        };

    // Drop undefined keys so we don't overwrite fields the caller didn't touch.
    const cleaned = Object.fromEntries(
      Object.entries(payload).filter(([, v]) => v !== undefined),
    );

    const backendUser = await userService.updateMyProfile(cleaned);
    const updatedUser = await toAppUser(backendUser);
    userRef.current = updatedUser;
    setUser(updatedUser);
  }

  async function changePassword(currentPassword: string, newPassword: string) {
    try {
      await userService.changePassword(currentPassword, newPassword);
      return { success: true };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not change password.";
      return { success: false, error: message };
    }
  }

  async function logout() {
    await authService.logout().catch(() => undefined);
    userRef.current = null;
    setUser(null);
    disconnectSocket();
  }

  async function refreshDriverBuses() {
    const currentUser = userRef.current;
    if (!currentUser || currentUser.role !== "driver") return;
    const buses = await buildDriverBuses().catch(() => []);
    const updatedUser = { ...(currentUser as DriverUser), buses };
    userRef.current = updatedUser;
    setUser(updatedUser);
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
