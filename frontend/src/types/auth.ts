export type UserRole = "guest" | "passenger" | "driver";

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface BusSchedule {
  dayOfWeek: DayOfWeek;
  departureTime: string;
  routeName: string;
}

export interface BusStaff {
  id: string;
  staffName: string;
  staffPhone: string;
}

// Mirrors the `buses` table, scoped to a single driver-owned bus,
// with its `bus_staff` and `bus_schedules` rows attached.
export interface DriverBus {
  id: string;
  numberPlate: string;
  companyBusNumber?: string;
  staff: BusStaff[];
  schedule: BusSchedule[];
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

// Mirrors `users` joined with `passengers`.
export interface PassengerUser extends User {
  role: "passenger";
  fullName: string;
  gender?: string;
  healthCondition?: string;
  photoUrl?: string;
}

// Mirrors `users` joined with `drivers`, with the driver's `buses` attached.
export interface DriverUser extends User {
  role: "driver";
  fullName: string;
  phoneNumber?: string;
  photoUrl?: string;
  buses: DriverBus[];
}
