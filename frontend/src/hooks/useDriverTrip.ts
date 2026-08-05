import { useContext } from "react";

import { DriverTripContext } from "../context/DriverTripContext";

export function useDriverTrip() {
  return useContext(DriverTripContext);
}
