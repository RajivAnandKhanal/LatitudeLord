import { createContext, ReactNode, useEffect, useState } from "react";

import * as journeyService from "../services/journeyService";
import { getCurrentLocation } from "../services/locationService";

export type JourneyBus = {
  id: string;
  busNumber: string;
  routeName: string;
};

type JourneyContextType = {
  selectedBus: JourneyBus | null;
  activeJourneyId: string | null;
  boardBus: (bus: JourneyBus) => Promise<void>;
  leaveBus: () => Promise<void>;
};

export const JourneyContext = createContext<JourneyContextType>({
  selectedBus: null,
  activeJourneyId: null,
  boardBus: async () => {},
  leaveBus: async () => {},
});

type Props = {
  children: ReactNode;
};

export function JourneyProvider({ children }: Props) {
  const [selectedBus, setSelectedBus] = useState<JourneyBus | null>(null);
  const [activeJourneyId, setActiveJourneyId] = useState<string | null>(null);

  // Restore an in-progress journey on app start (e.g. after a reload).
  useEffect(() => {
    journeyService
      .getActiveJourney()
      .then((journey) => {
        if (journey) {
          setActiveJourneyId(journey._id);
          setSelectedBus({ id: journey.bus, busNumber: journey.bus, routeName: "" });
        }
      })
      .catch(() => undefined);
  }, []);

  async function boardBus(bus: JourneyBus) {
    setSelectedBus(bus);
    try {
      const location = await getCurrentLocation();
      const journey = await journeyService.startJourney({
        busId: bus.id,
        lat: location.latitude,
        lng: location.longitude,
      });
      setActiveJourneyId(journey._id);
    } catch {
      // Chat/board UI still works even if journey tracking (used for the ML
      // pipeline) couldn't be started — e.g. offline or not logged in.
    }
  }

  async function leaveBus() {
    if (activeJourneyId) {
      try {
        const location = await getCurrentLocation();
        await journeyService.endJourney(activeJourneyId, {
          lat: location.latitude,
          lng: location.longitude,
        });
      } catch {
        // Best effort — don't block the UI from clearing the local state.
      }
    }
    setSelectedBus(null);
    setActiveJourneyId(null);
  }

  return (
    <JourneyContext.Provider value={{ selectedBus, activeJourneyId, boardBus, leaveBus }}>
      {children}
    </JourneyContext.Provider>
  );
}
