import { createContext, ReactNode, useState } from "react";

type DriverTripContextType = {
  tripStarted: boolean;
  startTrip: () => void;
  endTrip: () => void;
};

export const DriverTripContext = createContext<DriverTripContextType>({
  tripStarted: false,
  startTrip: () => {},
  endTrip: () => {},
});

type Props = {
  children: ReactNode;
};

// Shared "is the driver currently on a trip" flag so the dashboard toggle and
// the Current Journey footer tab always agree on trip status.
export function DriverTripProvider({ children }: Props) {
  const [tripStarted, setTripStarted] = useState(false);

  return (
    <DriverTripContext.Provider
      value={{
        tripStarted,
        startTrip: () => setTripStarted(true),
        endTrip: () => setTripStarted(false),
      }}
    >
      {children}
    </DriverTripContext.Provider>
  );
}
