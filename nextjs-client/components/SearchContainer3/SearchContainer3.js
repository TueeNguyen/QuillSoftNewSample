import React, { useState, useEffect, useRef } from "react";
import styles from "../../styles/SearchContainer.module.css";
import KeyConcepts from "../KeyConcepts/KeyConcepts";
import KeywordsPanel from "../KeywordsPanel/KeywordsPanel";
import { Tabs, Tab } from "@mui/material";
import {
  breakArryDimension,
  removeDupicate,
  changeArraytoWholeWord,
  breakArrayDimension2,
  chunkify,
} from "../keyWordProcessing";
const SearchContainer3 = (props) => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchResultsLength, setsearchResultsLength] = useState(0);
  const [activeResultIndex, setActiveResultIndex] = useState(-1);
  const [toggledSearchModes, setToggledSearchModes] = useState([]);
  const [textForSearch, settextForSearch] = useState("");
  const [keyConceptForSearch, SetkeyConceptForSearch] = useState("");
  const [searchResultChange, setsearchResultChange] = useState(false);
  const [keyWords, SetkeyWords] = useState([]);
  const [caseSensitive, SetcaseSensitive] = useState(false);
  const [wholeWord, SetwholeWord] = useState(false);
  const [keywordInUse, SetkeywordInUse] = useState([]);
  const [searchMultipleWords, SetsearchMultipleWords] = useState(false);
  const [searchOnPDF, SetsearchOnPDF] = useState("");
  const searchResultOnClick = useRef([]);
  const [selectedTab, setSelectedTab] = useState(0); // parsePDF7, Tab setting
  const [conceptIndex, setConceptIndex] = useState(null); //ParsePDF7, pass index of clicked concept back to parent component, use it to decide the keyword group
  const [keywordsToPanel, setKeywordsToPanel] = useState([]); //ParsePDF7 , pass keywords to keywordspanel to display list(High occurance)
  const [keywordsToPanelMedium, setKeywordsToPanelMedium] = useState([]); //ParsePDF7 , pass keywords to keywordspanel to display list(Medium occurance)
  const [keywordsToPanelLow, setKeywordsToPanelLow] = useState([]); //ParsePDF7 , pass keywords to keywordspanel to display list (Low occurance)
  const [resultTopanel, setResultTopanel] = useState([]); //ParsePDF7, save search result from perfomr search(High occurance)
  const [resultTopanelMedium, setResultTopanelMedium] = useState([]); //ParsePDF7, save search result from perfomr search(Medium occurance)
  const [resultTopanelLow, setResultTopanelLow] = useState([]); //ParsePDF7, save search result from perfomr search(Low occurance)

  const {
    Annotations,
    annotationManager,
    documentViewer,
    open = false,
    searchContainerRef,
    searchTermRef: searchTerm,
    searchButton,
    fullText,
    instance,
    keyConceptOnClick,
    keyWord,
    groups,
    setSearchContainerOpen,
    words,
    ConceptsAndWords,
  } = props;

  const pageRenderTracker = {};
  const KeyWordSearchResult = []; // keyword search result
  const KeyWordSearchResult2 = []; // perform further search on KeyWordSearchResult , break down long search result
  const FirstResults = useRef([]);
  const secondResults = useRef([]);
  const finalResults = useRef(KeyWordSearchResult2);
  const Resultlength = useRef(0);
  // const resultFromSearchFunction2 = useRef([]); //ParsePDF7 save search result

  /**
   * Coupled with the function `changeActiveSearchResult`
   */
  // useEffect(() => {
  //   if (activeResultIndex >= 0 && activeResultIndex < searchResults.length) {
  //     documentViewer.setActiveSearchResult(searchResults[activeResultIndex]);
  //   }
  // }, [activeResultIndex]);
  //display found result amount
  // useEffect(() => {
  //   setsearchResultsLength(Resultlength.current.length);
  //   console.log(finalResults.current);
  // }, [searchResultChange]);
  //keyconcept fire first level search
  // useEffect(() => {
  //   if (keyConceptOnClick != "") {
  //     clearSearchResults();
  //     SetkeyConceptForSearch(keyConceptOnClick);
  //     SetkeyWords(breakArryDimension(groups));
  //   }
  // }, [keyConceptOnClick]);
  useEffect(() => {
    searchOnKeyConcept(keyConceptForSearch);
  }, [keyConceptForSearch]);
  //ParsePDF7 update user selected concept, update keywords list
  useEffect(() => {
    if (ConceptsAndWords.words !== null && conceptIndex !== null) {
      let keywordTmp = chunkify(
        breakArrayDimension2(
          ConceptsAndWords.words[conceptIndex].sort((a, b) => {
            return b[2] - a[2];
          })
        ),
        3,
        true
      );

      setKeywordsToPanel(keywordTmp[0]);
      setKeywordsToPanelMedium(keywordTmp[1]);
      setKeywordsToPanelLow(keywordTmp[2]);
      settextForSearch(keywordTmp); //set keywords list use on search function
    }
  }, [ConceptsAndWords, conceptIndex]);
  //ParsePDF7 search on selected keyconcept,"FirstResults" save the search result
  useEffect(() => {
    if (conceptIndex !== null && ConceptsAndWords.concepts !== null) {
      searchOnKeyConcept(ConceptsAndWords.concepts[conceptIndex]);
    }
  }, [conceptIndex]);
  //ParsePDF7 use keyword list to search
  useEffect(() => {
    if (keywordsToPanel) {
      let temp = [];
      for (let i = 0, j = keywordsToPanel.length; i < j; i++) {
        temp.push(searchFunction2(keywordsToPanel[i], FirstResults.current));
        console.log(temp);
      }
      console.log(temp);
      for (let i = 0, j = temp.length; i < j; i++) {
        temp[i] = removeDupicate(temp[i]);
      }
      setResultTopanel(temp);
    }
    if (keywordsToPanelMedium) {
      let temp = [];
      for (let i = 0, j = keywordsToPanelMedium.length; i < j; i++) {
        temp.push(
          searchFunction2(keywordsToPanelMedium[i], FirstResults.current)
        );
        console.log(temp);
      }
      console.log(temp);
      for (let i = 0, j = temp.length; i < j; i++) {
        temp[i] = removeDupicate(temp[i]);
      }
      setResultTopanelMedium(temp);
    }
    if (keywordsToPanelLow) {
      let temp = [];
      for (let i = 0, j = keywordsToPanelLow.length; i < j; i++) {
        temp.push(searchFunction2(keywordsToPanelLow[i], FirstResults.current));
        console.log(temp);
      }
      console.log(temp);
      for (let i = 0, j = temp.length; i < j; i++) {
        temp[i] = removeDupicate(temp[i]);
      }
      setResultTopanelLow(temp);
    }
  }, [keywordsToPanel]);
  //keyword trigger search function
  // useEffect(() => {
  //   if (textForSearch != '') {
  //     searchMultiple(textForSearch, FirstResults.current);
  //     performSearch();
  //   }
  // }, [textForSearch]);
  useEffect(() => {
    console.log(keywordInUse);
    if (keywordInUse != []) {
      settextForSearch(keywordInUse);
    }
  }, [keywordInUse]);
  // useEffect(() => {
  //   if (searchMultipleWords) {
  //     wholeWord
  //       ? SetkeywordInUse(removeDupicate(changeArraytoWholeWord(keyWords)))
  //       : SetkeywordInUse(removeDupicate(keyWords));
  //   } else {
  //     wholeWord
  //       ? SetkeywordInUse(changeArraytoWholeWord(keyWord))
  //       : SetkeywordInUse(keyWord);
  //   }
  // }, [keyWord, wholeWord]);
  // useEffect(() => {
  //   if (searchResults != []) {
  //     searchResultOnClick.current = searchResults;
  //   }
  // }, [searchResults]);
  // useEffect(() => {
  //   if (searchOnPDF != "") {
  //     performSearch2(searchOnPDF);
  //   }
  // }, [searchOnPDF]);
  // useEffect(() => {
  //   clearResult();
  // }, [wholeWord]);
  /**
   * Side-effect function that invokes `documentViewer.textSearchInit`, and stores
   * every result in the state Array `searchResults`, and jumps the user to the
   * first result is found.
   */

  // handle tab selection
  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  //clear searchResult;
  const clearResult = () => {
    finalResults.current = [];
    setsearchResultsLength(0);
    SetsearchOnPDF("");
  };
  //count word function , check search result length.
  const wordCount = (str) => {
    const arr = str.split(" ");

    return arr.filter((word) => word !== "").length;
  };
  // break down long text to short sentences, merge result arrays to one array
  const breakWord = (arr) => {
    let breakLongText = arr.map((element) => {
      return element.replace(/([.?!])\s*(?=[A-Z])/g, "$1@").split("@");
    });
    let resultAfterMerge = [];
    for (let i = 0; i < breakLongText.length; i++) {
      resultAfterMerge = resultAfterMerge.concat(breakLongText[i]);
    }
    return resultAfterMerge;
  };

  //perform search use multiple words on text
  // const searchMultiple = (keyWordArray, resultArray) => {
  //   for (let i = 0; i < keyWordArray.length; i++) {
  //     searchFunction(keyWordArray[i], resultArray);
  //     console.log(keyWordArray);
  //   }
  // };

  //further level search, break down search result
  // const furtherSearch = (word, resultAfterMerge) => {
  //   //further search on previous result.
  //   for (let i = 0; i < resultAfterMerge.length; i++) {
  //     let str = "";

  //     if (
  //       caseSensitive == true
  //         ? resultAfterMerge[i].includes(word)
  //         : resultAfterMerge[i].toLowerCase().includes(word)
  //     ) {
  //       if (wordCount(resultAfterMerge[i]) <= 20) {
  //         if (i == 0) {
  //           if (resultAfterMerge.length == 1) {
  //             str += resultAfterMerge[i];
  //           } else if (resultAfterMerge.length == 2) {
  //             str += resultAfterMerge[i];
  //             if (!resultAfterMerge[i + 1].toLowerCase().includes(word)) {
  //               str += resultAfterMerge[i + 1];
  //             }
  //           } else {
  //             str += resultAfterMerge[i];
  //             if (!resultAfterMerge[i + 1].toLowerCase().includes(word)) {
  //               str += resultAfterMerge[i + 1];
  //             }
  //             if (!resultAfterMerge[i + 2].toLowerCase().includes(word)) {
  //               str += resultAfterMerge[i + 2];
  //             }
  //           }
  //         } else if (i == resultAfterMerge.length - 1) {
  //           if (!resultAfterMerge[i - 1].toLowerCase().includes(word)) {
  //             str += resultAfterMerge[i - 1];
  //           }
  //           str += resultAfterMerge[i];
  //         } else {
  //           if (!resultAfterMerge[i - 1].toLowerCase().includes(word)) {
  //             str += resultAfterMerge[i - 1];
  //           }
  //           str += resultAfterMerge[i];
  //           if (!resultAfterMerge[i + 1].toLowerCase().includes(word)) {
  //             str += resultAfterMerge[i + 1];
  //           }
  //         }
  //       } else {
  //         str += resultAfterMerge[i];
  //       }
  //       KeyWordSearchResult2.push(str);
  //       console.log(KeyWordSearchResult2.length);
  //       const removeDuplicate = removeDupicate(KeyWordSearchResult2);
  //       console.log(removeDuplicate.length);
  //       finalResults.current = removeDuplicate;
  //       Resultlength.current = removeDuplicate;
  //       console.log(finalResults.current);
  //     }
  //   }
  //   console.log(KeyWordSearchResult2);
  //   //finalResults.current = KeyWordSearchResult2;
  //   setsearchResultChange(!searchResultChange);
  // };
  //ParsePDF7
  const searchFunction3 = (word, array) => {
    let resultAfterMerge = [];
    let temp2 = [];
    for (let i = 0; i < array.length; i++) {
      let str = "";
      //check if search keyword with case-insensitive
      if (
        caseSensitive == true
          ? array[i].includes(word)
          : array[i].toLowerCase().includes(word)
      ) {
        str += array[i];
        KeyWordSearchResult.push(str);
        resultAfterMerge.push(str);
        secondResults.current = KeyWordSearchResult;
      }
    }
    for (let i = 0; i < resultAfterMerge.length; i++) {
      let str = "";

      if (
        caseSensitive == true
          ? resultAfterMerge[i].includes(word)
          : resultAfterMerge[i].toLowerCase().includes(word)
      ) {
        if (wordCount(resultAfterMerge[i]) <= 20) {
          if (i == 0) {
            if (resultAfterMerge.length == 1) {
              str += resultAfterMerge[i];
            } else if (resultAfterMerge.length == 2) {
              str += resultAfterMerge[i];
              if (!resultAfterMerge[i + 1].toLowerCase().includes(word)) {
                str += resultAfterMerge[i + 1];
              }
            } else {
              str += resultAfterMerge[i];
              if (!resultAfterMerge[i + 1].toLowerCase().includes(word)) {
                str += resultAfterMerge[i + 1];
              }
              if (!resultAfterMerge[i + 2].toLowerCase().includes(word)) {
                str += resultAfterMerge[i + 2];
              }
            }
          } else if (i == resultAfterMerge.length - 1) {
            if (!resultAfterMerge[i - 1].toLowerCase().includes(word)) {
              str += resultAfterMerge[i - 1];
            }
            str += resultAfterMerge[i];
          } else {
            if (!resultAfterMerge[i - 1].toLowerCase().includes(word)) {
              str += resultAfterMerge[i - 1];
            }
            str += resultAfterMerge[i];
            if (!resultAfterMerge[i + 1].toLowerCase().includes(word)) {
              str += resultAfterMerge[i + 1];
            }
          }
        } else {
          str += resultAfterMerge[i];
        }
        KeyWordSearchResult2.push(str);
        temp2.push(str);
        console.log(KeyWordSearchResult2.length);
        const removeDuplicate = removeDupicate(temp2);
        console.log(removeDuplicate.length);
        finalResults.current = removeDuplicate;
        Resultlength.current = removeDuplicate;
        console.log(finalResults.current);
      }
    }
    console.log(KeyWordSearchResult2);
    return Resultlength.current;
  };
  // search key word function, after search on key concept
  const searchFunction = (word, array) => {
    for (let i = 0; i < array.length; i++) {
      let str = "";
      //check if search keyword with case-insensitive
      if (
        caseSensitive == true
          ? array[i].includes(word)
          : array[i].toLowerCase().includes(word)
      ) {
        str += array[i];
        KeyWordSearchResult.push(str);
        console.log(KeyWordSearchResult);
        secondResults.current = KeyWordSearchResult;
      }
    }
    console.log(secondResults.current);

    const tempArray = breakWord(secondResults.current);
    furtherSearch(word, tempArray);
  };
  const searchFunction2 = (word, array1) => {
    let temp = [];
    //search whole word, another option will be const regex = new RegExp(String.raw`\${word}[\s.]`);
    const regex = new RegExp(String.raw`\s${word}[^a-zA-Z0-9]`);

    for (let i = 0; i < array1.length; i++) {
      let str = "";
      //check if search keyword with case-insensitive
      if (
        caseSensitive == true
          ? array1[i].includes(word)
          : array1[i].toLowerCase().includes(word)
      ) {
        if (regex.test(array1[i].toLowerCase()) === true) {
          str += array1[i];
          temp.push(str);
        }
      }
    }
    return temp;
  };
  // search function, run on fullText
  const searchOnKeyConcept = (concept) => {
    let tempArray = [];
    for (let i = 0; i < fullText.length; i++) {
      let str = "";
      if (fullText[i].toLowerCase().includes(concept.toLowerCase())) {
        if (i > 0 && i < fullText.length) {
          str += fullText[i - 1];
          str += fullText[i];
          str += fullText[i + 1];
        } else if (i == 0) {
          str += fullText[i];
        } else {
          str += fullText[i - 1];
          str += fullText[i];
        }

        tempArray.push(str);
      }
    }
    const tempArray2 = breakWord(tempArray);
    FirstResults.current = tempArray2;
    console.log(FirstResults.current);
  };

  // use keywords search result as search input, locate text position in PDF, use multiple keyword as input
  const performSearch2 = (textToSearch) => {
    console.log(textToSearch);
    let tempStrings = textToSearch.split(" ").slice(0, 12).join(" ");
    console.log(tempStrings);
    const { PAGE_STOP, HIGHLIGHT, AMBIENT_STRING } = window.Core.Search.Mode;

    const mode = toggledSearchModes.reduce(
      (prev, value) => prev | value,
      PAGE_STOP | HIGHLIGHT | AMBIENT_STRING
    );
    const fullSearch = true;
    let jumped = false;

    documentViewer.textSearchInit(tempStrings, mode, {
      fullSearch,
      onResult: (result) => {
        setSearchResults((prevState) => [...prevState, result]);

        const { resultCode, quads, page_num: pageNumber } = result;
        const { e_found: eFound } = window.PDFNet.TextSearch.ResultCode;
        if (resultCode === eFound) {
          // remove annotations , click on new result will remove previous result highlight
          if (annotationManager != null) {
            const annots = annotationManager.getAnnotationsList();
            annotationManager.deleteAnnotations(annots);
          }
          const highlight = new Annotations.TextHighlightAnnotation();
          /**
           * The page number in Annotations.TextHighlightAnnotation is not
           * 0-indexed
           */
          highlight.setPageNumber(pageNumber);
          highlight.Quads.push(quads[0].getPoints());
          //  highlight.StrokeColor = new Annotations.Color(255, 0, 0);
          annotationManager.addAnnotation(highlight);
          annotationManager.drawAnnotations(highlight.PageNumber);
          if (!jumped) {
            jumped = true;
            // This is the first result found, so set `activeResult` accordingly
            setActiveResultIndex(0);
            documentViewer.displaySearchResult(result, () => {
              /**
               * The page number in documentViewer.displayPageLocation is not
               * 0-indexed
               */
              documentViewer.displayPageLocation(pageNumber, 0, 0, true);
            });
          }
        }
      },
    });
    console.log(searchResultOnClick.current);
    if (searchResultOnClick.current[0] != undefined) {
      setSearchContainerOpen(false);
      documentViewer.setActiveSearchResult(searchResultOnClick.current[0]);
      console.log(searchResultOnClick[0]);
    }
  };

  //ParsePDF7 use multiple keywords as input
  const performSearch = () => {
    clearSearchResults(false);
    const {
      current: { value: textToSearch },
    } = searchTerm;

    const { PAGE_STOP, HIGHLIGHT, AMBIENT_STRING } = window.Core.Search.Mode;

    const mode = toggledSearchModes.reduce(
      (prev, value) => prev | value,
      PAGE_STOP | HIGHLIGHT | AMBIENT_STRING
    );
    const fullSearch = true;
    let jumped = false;
    if (wholeWord) {
      settextForSearch(" " + textToSearch + " ");
    } else {
      settextForSearch(textToSearch);
    }
    if (
      textToSearch !== undefined &&
      textToSearch !== null &&
      documentViewer !== null
    ) {
      for (let i = 0, j = textToSearch.length; i < j; i++) {
        documentViewer.textSearchInit(textToSearch[i], mode, {
          fullSearch,
          onResult: (result) => {
            setSearchResults((prevState) => [...prevState, result]);
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
              if (!jumped) {
                jumped = true;
                // This is the first result found, so set `activeResult` accordingly
                setActiveResultIndex(0);
                documentViewer.displaySearchResult(result, () => {
                  /**
                   * The page number in documentViewer.displayPageLocation is not
                   * 0-indexed
                   */
                  documentViewer.displayPageLocation(pageNumber, 0, 0, true);
                });
              }
            }
          },
        });
      }
    }
  };

  /**
   * Side-effect function that invokes the internal functions to clear the
   * search results
   *
   * @param {Boolean} clearSearchTermValue For the guard clause to determine
   * if `searchTerm.current.value` should be mutated (would not want this to
   * occur in the case where a subsequent search is being performed after a
   * previous search)
   */
  const clearSearchResults = (clearSearchTermValue = true) => {
    if (clearSearchTermValue) {
      if (searchTerm.current != null) {
        searchTerm.current.value = "";
      }

      SetkeywordInUse([]);
    }
    if (documentViewer != null) {
      documentViewer.clearSearchResults();
    }

    if (annotationManager != null) {
      annotationManager.deleteAnnotations(
        annotationManager.getAnnotationsList()
      );
    }
    setSearchResults([]);
    setActiveResultIndex(-1);
    setsearchResultsLength(0);
    clearResult();
  };

  /**
   * Checks if the key that has been released was the `Enter` key, and invokes
   * `performSearch` if so
   *
   * @param {SyntheticEvent} event The event passed from the `input` element
   * upon the function being invoked from a listener attribute, such as
   * `onKeyUp`
   */
  const listenForEnter = (event) => {
    const { keyCode } = event;
    // The key code for the enter button
    if (keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      performSearch();
    }
  };

  /**
   * Changes the active search result in `documentViewer`
   *
   * @param {Number} newSearchResult The index to set `activeResult` to,
   * indicating which `result` object that should be passed to
   * `documentViewer.setActiveSearchResult`
   */
  const changeActiveSearchResult = (newSearchResult) => {
    /**
     * @todo Figure out why only the middle set of search results can be
     * iterated through, but not the first or last results.
     */
    /**
     * Do not try to set a search result that is outside of the index range of
     * searchResults
     */
    if (newSearchResult >= 0 && newSearchResult < searchResults.length) {
      setActiveResultIndex(newSearchResult);
    }
  };

  /**
   * Toggles the given `searchMode` value within `toggledSearchModes`
   *
   * @param {CoreControls.DocumentViewer.SearchMode} searchMode The bitwise
   * search mode value to toggle on or off
   */
  const toggleSearchMode = (searchMode) => {
    if (!toggledSearchModes.includes(searchMode)) {
      setToggledSearchModes((prevState) => [...prevState, searchMode]);
    } else {
      setToggledSearchModes((prevState) =>
        prevState.filter((value) => value !== searchMode)
      );
    }
  };

  /**
   * Side-effect function that toggles whether or not to perform a text search
   * with case sensitivty
   */

  const toggleCaseSensitive = () => {
    toggleSearchMode(window.Core.Search.Mode.CASE_SENSITIVE);
    SetcaseSensitive((prevcaseSensitive) => !prevcaseSensitive);
  };

  /**
   * Side-effect function that toggles whether or not to perform a text search
   * that finds the whole word
   */
  const toggleWholeWord = () => {
    toggleSearchMode(window.Core.Search.Mode.WHOLE_WORD);
    SetwholeWord((prevwholeWord) => !prevwholeWord);
  };

  if (!open) {
    return null;
  }

  /**
   * Change search mode
   */

  const changeSearchCase = () => {
    SetsearchMultipleWords(
      (prevsearchMultipleWords) => !prevsearchMultipleWords
    );
  };

  //update the index of selected keyconcept, use same index to find the keyword array
  const updateKeyconceptIndex = (idx) => {
    setConceptIndex(idx);
  };
  return (
    <div className={styles.search_container} ref={searchContainerRef}>
      <KeyConcepts
        words={words}
        updateKeyconceptIndex={updateKeyconceptIndex}
      />
      <div className={styles.search_input}>
        <input
          ref={searchTerm}
          type={"text"}
          placeholder={"Search"}
          onKeyUp={listenForEnter}
        />
        <button
          style={{ cursor: "pointer" }}
          onClick={performSearch}
          ref={searchButton}
        >
          <img src="ic_search_black_24px.svg" alt="Search" />
        </button>
        <span style={{ float: "right" }}>
          <button onClick={clearSearchResults} style={{ cursor: "pointer" }}>
            <img src="icon-header-clear-search.svg" alt="Clear Search" />
          </button>
        </span>
      </div>

      <Tabs value={selectedTab} onChange={handleChange}>
        <Tab style={{ minWidth: 105 }} label="High" />
        <Tab style={{ minWidth: 105 }} label="Medium" />
        <Tab style={{ minWidth: 105 }} label="low" />
      </Tabs>

      {selectedTab === 0 && (
        <KeywordsPanel
          keywordsToPanel={keywordsToPanel}
          Annotations={Annotations}
          annotationManager={annotationManager}
          documentViewer={documentViewer}
          searchTermRef={searchTerm}
          resultTopanel={resultTopanel}
          instance={instance}
        />
      )}
      {selectedTab === 1 && (
        <KeywordsPanel
          keywordsToPanel={keywordsToPanelMedium}
          Annotations={Annotations}
          annotationManager={annotationManager}
          documentViewer={documentViewer}
          searchTermRef={searchTerm}
          resultTopanel={resultTopanelMedium}
          instance={instance}
        />
      )}
      {selectedTab === 2 && (
        <KeywordsPanel
          keywordsToPanel={keywordsToPanelLow}
          Annotations={Annotations}
          annotationManager={annotationManager}
          documentViewer={documentViewer}
          searchTermRef={searchTerm}
          resultTopanel={resultTopanelLow}
          instance={instance}
        />
      )}
    </div>
  );
};

export default SearchContainer3;
