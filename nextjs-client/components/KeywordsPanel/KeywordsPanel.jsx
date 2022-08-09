import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeywrodResult from "../KeywrodResult/KeywrodResult";

export default function KeywordsPanel(props) {
  const {
    Annotations,
    annotationManager,
    documentViewer,
    searchTermRef: searchTerm,
    keywordsToPanel,
    resultTopanel,
  } = props;
  return (
    <div>
      {keywordsToPanel.length > 0 &&
        keywordsToPanel.map((result, idx) => {
          return (
            <div key={`${result}+${idx}`}>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                >
                  <Typography>{result}</Typography>
                </AccordionSummary>
                <KeywrodResult
                  keywordsToPanel={keywordsToPanel}
                  resultTopanel={resultTopanel}
                  idx={idx}
                />
              </Accordion>
            </div>
          );
        })}
    </div>
  );
}
