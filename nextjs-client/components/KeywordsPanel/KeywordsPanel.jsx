import React, { useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeywordsPanel2 from "../KeywordsPanel2";
import KeywrodResult from "../KeywrodResult/KeywrodResult";
import {
  removeDuplicateWord,
  breakArrayDimension2,
} from "../keyWordProcessing";

export default function KeywordsPanel(props) {
  const {
    Annotations,
    annotationManager,
    documentViewer,
    TextForSearch,
    keywordsToPanel, //key word array, each element will be ["base keyword","different keywordform","occurance"]
    instance,
    searchFunction,
  } = props;
  return (
    <div>
      {
        <div style={{ margin: "15px" }}>
          Found {keywordsToPanel.length} words
        </div>
      }
      {keywordsToPanel.length > 0 &&
        keywordsToPanel.map((result, idx) => {
          const keyWord = removeDuplicateWord(result); //remove duplicate words if only one form of key word
          const multipleWords = breakArrayDimension2(keywordsToPanel); // array of key words, each element is the base keyword from keyword list

          return (
            <div key={`${keyWord[0]}+${idx}`}>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  style={{ width: "100%", padding: "0.5rem" }}
                >
                  <Typography component={"div"}>{keyWord[0]}</Typography>
                </AccordionSummary>
                {keyWord.length === 1 ? (
                  <KeywrodResult
                    keywordsToPanel={multipleWords}
                    Annotations={Annotations}
                    keywordAllLevel={keywordsToPanel.map((element) =>
                      removeDuplicateWord(element)
                    )}
                    annotationManager={annotationManager}
                    documentViewer={documentViewer}
                    instance={instance}
                    keyWordSelected={keyWord[0]}
                    TextForSearch={TextForSearch}
                    searchFunction={searchFunction}
                  />
                ) : (
                  <KeywordsPanel2
                    keywordsToPanel={multipleWords}
                    keywords={keyWord}
                    Annotations={Annotations}
                    annotationManager={annotationManager}
                    documentViewer={documentViewer}
                    keywordAllLevel={keywordsToPanel.map((element) =>
                      removeDuplicateWord(element)
                    )}
                    instance={instance}
                    TextForSearch={TextForSearch}
                    searchFunction={searchFunction}
                  />
                )}
              </Accordion>
            </div>
          );
        })}
    </div>
  );
}
