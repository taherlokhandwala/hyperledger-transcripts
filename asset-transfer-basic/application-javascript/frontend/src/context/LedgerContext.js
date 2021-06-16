import React, { useState, createContext, useContext } from "react";

export const LedgerContext = createContext();

export const useLedger = () => {
  return useContext(LedgerContext);
};

export const LedgerContextProvider = ({ children }) => {
  const isLedgerInitialized = sessionStorage.getItem("ledger_init");
  const [ledgerInit, setLedgerInit] = useState(
    isLedgerInitialized ? true : false
  );
  return (
    <LedgerContext.Provider value={{ ledgerInit, setLedgerInit }}>
      {children}
    </LedgerContext.Provider>
  );
};
