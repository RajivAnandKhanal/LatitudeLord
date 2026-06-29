import {
  createContext,
  ReactNode,
  useState,
} from "react";

export type JourneyBus = {
  id: string;
  busNumber: string;
  routeName: string;
};

type JourneyContextType = {
  selectedBus: JourneyBus | null;
  boardBus: (bus: JourneyBus) => void;
  leaveBus: () => void;
};

export const JourneyContext =
  createContext<JourneyContextType>({
    selectedBus: null,
    boardBus: () => {},
    leaveBus: () => {},
  });

type Props = {
  children: ReactNode;
};

export function JourneyProvider({
  children,
}: Props) {
  const [selectedBus, setSelectedBus] =
    useState<JourneyBus | null>(null);

  function boardBus(bus: JourneyBus) {
    setSelectedBus(bus);
  }

  function leaveBus() {
    setSelectedBus(null);
  }

  return (
    <JourneyContext.Provider
      value={{
        selectedBus,
        boardBus,
        leaveBus,
      }}
    >
      {children}
    </JourneyContext.Provider>
  );
}