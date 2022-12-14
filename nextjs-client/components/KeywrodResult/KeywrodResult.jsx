import React, { useState, useEffect } from "react";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import HighlightWord from "../HighlightWord/HighlightWord";

export default function KeywrodResult(props) {
  const {
    keywordsToPanel,
    Annotations,
    annotationManager,
    documentViewer,
    keyWordSelected,
    TextForSearch,
    searchFunction,
    keywordAllLevel,
  } = props;
  const [toggledSearchModes, setToggledSearchModes] = useState([]);
  const [resultTopanel, setResultTopanel] = useState([]);
  const [highlightWordList, setHighlightWordList] = useState([]);

  useEffect(() => {
    if (keywordAllLevel !== undefined) {
      setHighlightWordList([].concat(...keywordAllLevel));
    }
  }, [keywordAllLevel]);
  useEffect(() => {
    if (keyWordSelected !== undefined) {
      setResultTopanel(searchFunction(keyWordSelected, TextForSearch));
    }
  }, [keyWordSelected]);

  /**
   * Toggles the given `searchMode` value within `toggledSearchModes`
   *
   * @param {CoreControls.DocumentViewer.SearchMode} searchMode The bitwise
   * search mode value to toggle on or off
   */
  //No need to use this function but the PDFTron search function need it as parameter
  const toggleSearchMode = (searchMode) => {
    if (!toggledSearchModes.includes(searchMode)) {
      setToggledSearchModes((prevState) => [...prevState, searchMode]);
    } else {
      setToggledSearchModes((prevState) =>
        prevState.filter((value) => value !== searchMode)
      );
    }
  };
  //result from this function create link from searchFunction to text on PDF
  // click on result from keyword panel will jump to the position of result on PDF
  const performSearch = (textToSearch) => {
    const { PAGE_STOP, HIGHLIGHT, AMBIENT_STRING } = window.Core.Search.Mode;

    // remove annotations
    if (annotationManager !== null) {
      const annots = annotationManager.getAnnotationsList();
      if (annots !== null || annots !== undefined) {
        annotationManager.deleteAnnotations(annots);
      }
    }

    const mode = toggledSearchModes.reduce(
      (prev, value) => prev | value,
      PAGE_STOP | HIGHLIGHT | AMBIENT_STRING
    );
    const fullSearch = true;

    documentViewer.textSearchInit(textToSearch, mode, {
      fullSearch,
      onResult: (result) => {
        const { resultCode, quads, page_num: pageNumber } = result;
        const { e_found: eFound } = window.PDFNet.TextSearch.ResultCode;
        if (resultCode === eFound) {
          const highlight = new Annotations.TextHighlightAnnotation();
          /**
           * The page number in Annotations.TextHighlightAnnotation is not
           * 0-indexed
           */
          highlight.setPageNumber(pageNumber);
          highlight.Quads.push(quads[0].getPoints());
          annotationManager.addAnnotation(highlight);
          annotationManager.drawAnnotations(highlight.PageNumber);
        }
        documentViewer.setActiveSearchResult(result);
        instance.setZoomLevel(instance.getZoomLevel() + 1);
      },
    });
  };

  return (
    <div>
      {<div>Result found: {resultTopanel.length}</div>}
      {resultTopanel.length > 0 ? (
        resultTopanel.map((result, index) => {
          return (
            <div key={index}>
              <AccordionDetails>
                <span
                  onClick={() => {
                    performSearch(
                      result.slice(result.indexOf(keyWordSelected))
                    );
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <Typography component="span">
                    <HighlightWord
                      searchWords={highlightWordList}
                      textToHighlight={result}
                      style={{ cursor: "pointer" }}
                      keyWordSelected={keyWordSelected}
                    />
                  </Typography>
                </span>
              </AccordionDetails>
            </div>
          );
        })
      ) : (
        <div>No result</div>
      )}
    </div>
  );
}
