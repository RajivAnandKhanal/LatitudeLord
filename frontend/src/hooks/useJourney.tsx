import { useContext } from "react";

import { JourneyContext } from "../context/JourneyContext";

export function useJourney() {
  return useContext(JourneyContext);
}