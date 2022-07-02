import React, { useContext, useState } from 'react';

const FileContext = React.createContext();
const FileUpdateContext = React.createContext();

export function useFileContext() {
  return useContext(FileContext);
}
export function useFileUpdateContext() {
  return useContext(FileUpdateContext);
}
export default function FileProvider({ children }) {
  const [KeyConcept, setKeyConcept] = useState();
  function setKeyConcetValue(newValue) {
    setKeyConcept(newValue);
  }
  return (
    <FileContext.Provider value={KeyConcept}>
      <FileUpdateContext value={setKeyConcetValue(newValue)}>
        {children}
      </FileUpdateContext>
    </FileContext.Provider>
  );
}
