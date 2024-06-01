"use client";

import { createContext, useContext, useState } from "react";

const CityContext = createContext();

export default function AppStore({ children }) {
  const [cities, setCities] = useState("cuttack");

  return (
    <CityContext.Provider value={{ cities, setCities }}>
      {children}
    </CityContext.Provider>
  );
}

export function useCityContext() {
  return useContext(CityContext);
}
