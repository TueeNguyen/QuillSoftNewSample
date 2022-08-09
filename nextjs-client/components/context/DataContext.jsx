import { createContext, useEffect, useState } from "react";

const DataContext = createContext({});

export const DataProvider = ({ children }) => {
  const [keyConceptList, setKeyConceptList] = useState([]);
  const [keyWordIndex, setKeyWordIndex] = useState(null);
  const [clusters, setClusters] = useState(null);
  const [keyWordList, setKeyWordList] = useState([]);
  useEffect(() => {
    if (clusters) {
      setKeyConceptList(clusters.concepts);
    }
  }, [clusters]);
  useEffect(() => {
    if (keyWordIndex && keyConceptList) {
      setKeyWordList(clusters.words[keyWordIndex]);
    }
  }, [keyConceptList]);

  return (
    <DataContext.Provider
      value={{
        keyWordIndex,
        setKeyWordIndex,
        clusters,
        setClusters,
        keyWordList,
        keyConceptList,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
