import React, { useState, useEffect } from 'react';
import styles from '../styles/History.module.css';
import mainStyle from '../styles/Home.module.css';
import { Link, Tooltip, Accordion, AccordionSummary, AccordionDetails, Typography } from '@material-ui/core';
import FileProcesser from '../components/FileUpload/FileProcesser';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import RefreshIcon from '@material-ui/icons/Refresh';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Head from 'next/head';
import Property from "../components/PropertiesModal/Property/Property";
import CategoryBox from "../components/PropertiesModal/CategoryBox/CategoryBox";

export default function Home() {

  const [history, setHistory] = useState([]);
  const [clicked, setClicked] = useState(null);

  const initHistory = () => {
    if (history?.length === 0) {
      const storageRef = localStorage.getItem("AllDocuments")
      const items = JSON.parse(storageRef);
      setHistory(items);
    }
  }

  useEffect(() => {
    initHistory();
  });

  const clearLocalStorage = () => {
    const storageRef = localStorage.getItem("AllDocuments");
    if (JSON.parse(storageRef) !== null) {
      localStorage.clear();
      setHistory([]);
    }
  };

  const documentChanged = (index) => {
    setClicked(index);
    localStorage.setItem("Current", index);
  }

  return (
    <div className={mainStyle.container}>
      <Head>
        <title>Quillsoft NLP Client</title>
      </Head>
      <main className={mainStyle.main}>
        <div className={styles.historyContainer}>
          {clicked === null ? (
            <Accordion style={{ margin: ".5rem"}}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Show/Hide</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <CategoryBox title="Current File History" style={{overflow: "scroll"}}>
                  <Property label="Reset History">
                      <Tooltip title="Reset History">
                        <RefreshIcon onClick={clearLocalStorage}/>
                      </Tooltip>
                  </Property>
                  {
                      history?.map((value, index) => {
                        return <Property key={`prop_${index}`} label={`Document ${index + 1}`}>
                            <Tooltip title={`Document ${index + 1}`}>
                              <Link onClick={() => documentChanged(index)}>
                                <FileCopyIcon/>
                              </Link>    
                            </Tooltip>
                          </Property>
                      })
                  }
                </CategoryBox>
              </AccordionDetails>
            </Accordion>)
            : (
              <FileProcesser clusters={history[clicked][1]} data={history[clicked][0]} />
            )}
        </div>
      </main>
    </div>
  );
}