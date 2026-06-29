import { DriverUser, PassengerUser } from "../types/auth";

export interface MockPassenger extends PassengerUser {
  password: string;
}

export interface MockDriver extends DriverUser {
  password: string;
}

export type MockUser = MockPassenger | MockDriver;

export const mockUsers: MockUser[] = [
  {
    id: "1",
    role: "passenger",
    email: "passenger@latitudelord.com",
    password: "Passenger123",
    fullName: "Bandana Gyawali",
    gender: "Female",
    healthCondition: "",
    photoUrl: "",
  },
  {
    id: "2",
    role: "driver",
    email: "driver@latitudelord.com",
    password: "Driver123",
    fullName: "Ram Sharma",
    phoneNumber: "9812345678",
    photoUrl: "",
    buses: [
      {
        id: "bus-1",
        numberPlate: "Ba 3 Kha 2245",
        companyBusNumber: "Bus #1",
        staff: [
          {
            id: "staff-1",
            staffName: "Sita Sharma",
            staffPhone: "9845678912",
          },
        ],
        schedule: [
          { dayOfWeek: "monday", departureTime: "07:00", routeName: "Kalanki → Koteshwor" },
          { dayOfWeek: "tuesday", departureTime: "07:00", routeName: "Koteshwor → Kalanki" },
          { dayOfWeek: "wednesday", departureTime: "07:00", routeName: "Kalanki → Koteshwor" },
          { dayOfWeek: "thursday", departureTime: "07:00", routeName: "Koteshwor → Kalanki" },
          { dayOfWeek: "friday", departureTime: "07:00", routeName: "Kalanki → Koteshwor" },
          { dayOfWeek: "saturday", departureTime: "07:00", routeName: "Koteshwor → Kalanki" },
        ],
      },
    ],
  },
];
