import React, { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeywrodResult from "../KeywrodResult/KeywrodResult";
import { removeDuplicateWord } from "../keyWordProcessing";
export default function KeywordsPanel2(props) {
  const [wordAmount, setWordAmount] = useState(0);
  const {
    Annotations,
    annotationManager,
    documentViewer,
    searchTermRef: searchTerm,
    keywordsToPanel,
    keywords,
    TextForSearch,
    searchFunction,
    instance,
  } = props;

  return (
    <div>
      {keywords.length > 0 && <div>Different words : {keywords.length}</div>}
      {keywords.length > 0 &&
        keywords.map((result, idx) => {
          return (
            <div key={`${result}+${idx}`}>
              <Accordion sx={{ width: "90%", margin: "0.5rem" }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  style={{ width: "100%", padding: "0.5rem" }}
                >
                  <Typography component={"div"}>{result}</Typography>
                </AccordionSummary>
                <KeywrodResult
                  keywordsToPanel={keywordsToPanel}
                  Annotations={Annotations}
                  annotationManager={annotationManager}
                  documentViewer={documentViewer}
                  instance={instance}
                  keyWordSelected={result}
                  TextForSearch={TextForSearch}
                  searchFunction={searchFunction}
                />
              </Accordion>
            </div>
          );
        })}
    </div>
  );
}
