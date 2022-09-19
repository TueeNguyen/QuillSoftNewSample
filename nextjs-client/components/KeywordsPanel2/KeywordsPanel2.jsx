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
    instance,
  } = props;

  const resultTopanel = [];
  //remove the last element( a number represent the occurance), remove duplicate element if exist
  keywordsToPanel.splice(-1);
  let newkeywordsToPanel = removeDuplicateWord(keywordsToPanel);

  return (
    <div>
      {newkeywordsToPanel.length > 0 &&
        newkeywordsToPanel.map((result, idx) => {
          return (
            <div key={`${result}+${idx}`}>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  style={{ width: "100%", padding: "0.5rem" }}
                >
                  <Typography component={"div"}>{result}</Typography>
                </AccordionSummary>
                <KeywrodResult
                  keywordsToPanel={keywordsToPanel}
                  resultTopanel={resultTopanel}
                  idx={idx}
                  Annotations={Annotations}
                  annotationManager={annotationManager}
                  documentViewer={documentViewer}
                  instance={instance}
                  keyWordSelected={result}
                />
              </Accordion>
            </div>
          );
        })}
    </div>
  );
}
