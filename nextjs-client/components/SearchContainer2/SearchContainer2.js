import React, { useState, useEffect, useRef } from "react";
import styles from "../../styles/SearchContainer.module.css";
import { colors } from "@material-ui/core";
import HighlightWord from "../HighlightWord/HighlightWord";
import HighlightWord2 from "../HighlightWord/HighlightWord2";
import { keyWordList, breakArryDimension } from "../keyWordProcessing";
const SearchContainer2 = (props) => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchResultsLength, setsearchResultsLength] = useState(0);
  const [activeResultIndex, setActiveResultIndex] = useState(-1);
  const [toggledSearchModes, setToggledSearchModes] = useState([]);
  const [textForSearch, settextForSearch] = useState("");
  const [keyConceptForSearch, SetkeyConceptForSearch] = useState("");
  const [searchResultChange, setsearchResultChange] = useState(false);
  const [caseSensitive, SetcaseSensitive] = useState(false);
  const [wholeWord, SetwholeWord] = useState(false);
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
  } = props;

  const pageRenderTracker = {};
  const KeyWordSearchResult = []; // keyword search result
  const KeyWordSearchResult2 = []; // perform further search on KeyWordSearchResult , break down long search result
  const FirstResults = useRef([]);
  const secondResults = useRef([]);
  const thirdResults = useRef([]);
  const finalResults = useRef(KeyWordSearchResult2);
  const Resultlength = useRef(0);
  const kewWords = breakArryDimension(groups);
  const keywordFullList = keyWordList(kewWords, textForSearch);
  let flag = false;
  /**
   * Coupled with the function `changeActiveSearchResult`
   */
  useEffect(() => {
    if (activeResultIndex >= 0 && activeResultIndex < searchResults.length) {
      documentViewer.setActiveSearchResult(searchResults[activeResultIndex]);
    }
  }, [activeResultIndex]);
  //display found result amount
  useEffect(() => {
    setsearchResultsLength(Resultlength.current.length);
    console.log(finalResults.current);
  }, [searchResultChange]);
  //keyconcept fire first level search
  useEffect(() => {
    if (keyConceptOnClick != "") {
      SetkeyConceptForSearch(keyConceptOnClick);
    }
  }, [keyConceptOnClick]);
  useEffect(() => {
    searchOnKeyConcept(keyConceptForSearch);
  }, [keyConceptForSearch]);
  //keyword trigger search function
  // useEffect(() => {
  //   if (textForSearch != '') {
  //     searchMultiple(textForSearch, FirstResults.current);
  //     performSearch();
  //   }
  // }, [textForSearch]);
  useEffect(() => {
    console.log(keyWord);
    settextForSearch(keyWord);
  }, [keyWord]);
  useEffect(() => {
    if (textForSearch != "") {
      searchFunction(textForSearch, FirstResults.current);
      performSearch();
    }
  }, [caseSensitive, wholeWord]);

  /**
   * Side-effect function that invokes `documentViewer.textSearchInit`, and stores
   * every result in the state Array `searchResults`, and jumps the user to the
   * first result is found.
   */

  const color = [
    "#f3ff33",
    "#e285f5",
    "#c8fae9",
    "#f5e385",
    "#fe4164",
    "#fcf7c2",
    "#9cff33",
    "#dffac8",
    "#ff33e9",
    "#fefce5",
    "#33fffc",
    "#33e0ff",
    "#c8d9fa",
    "#fac8e9",
    "#c0f7a7",
    "#a7f3f7",
    "#85f5d8",
    "#85aaf5",
  ];

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
  const searchMultiple = (keyWordArray, resultArray) => {
    for (let i = 0; i < keyWordArray.length; i++) {
      searchFunction(keyWordArray[i], resultArray);
      console.log(keyWordArray);
    }
  };

  //further level search, break down search result
  const furtherSearch = (word, resultAfterMerge) => {
    console.log(word);
    console.log(resultAfterMerge);
    //further search on previous result.
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
            } else {
              str += resultAfterMerge[i];
              str += resultAfterMerge[i + 1];
            }
          } else if (i == resultAfterMerge.length - 1) {
            str += resultAfterMerge[i - 1];
            str += resultAfterMerge[i];
          } else {
            str += resultAfterMerge[i];
            str += resultAfterMerge[i + 1];
          }
        } else {
          str += resultAfterMerge[i];
        }
        KeyWordSearchResult2.push(str);
        Resultlength.current = KeyWordSearchResult2;
        console.log(KeyWordSearchResult2.length);
        const removeDuplicate = [...new Set(KeyWordSearchResult2)];
        console.log(removeDuplicate.length);
        finalResults.current = removeDuplicate;
        console.log(finalResults.current);
      }
    }
    console.log(KeyWordSearchResult2);
    //finalResults.current = KeyWordSearchResult2;
    setsearchResultChange(!searchResultChange);
  };

  // search key word function, after search on key concept
  const searchFunction = (word, array) => {
    console.log(array);
    console.log(word);
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
    for (let i = 0; i < array1.length; i++) {
      let str = "";
      //check if search keyword with case-insensitive
      if (
        caseSensitive == true
          ? array1[i].includes(word)
          : array1[i].toLowerCase().includes(word)
      ) {
        str += array1[i];
        temp.push(str);

        FirstResults.current = temp;
      }
    }
  };
  // search function, run on fullText
  const searchOnKeyConcept = (concept) => {
    let tempArray = [];
    for (let i = 0; i < fullText.length; i++) {
      let str = "";
      if (fullText[i].toLowerCase().includes(concept)) {
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
    if (flag) {
      searchFunction2(textForSearch[0], FirstResults.current);
    }
  };

  //
  //
  //
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
    // if (wholeWord) {
    //   settextForSearch(' ' + textToSearch + ' ');
    // } else {
    //   settextForSearch(textToSearch);
    // }
    //console.log(keyWord);
    //keywordFullList
    // if (flag) {
    //   searchMultiple(keywordFullList, FirstResults.current);
    // } else {
    //   searchMultiple(textForSearch, FirstResults.current);
    // }
    searchMultiple(textForSearch, FirstResults.current);
    documentViewer.textSearchInit(textToSearch, mode, {
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
      searchTerm.current.value = "";
    }
    documentViewer.clearSearchResults();
    if (annotationManager != null) {
      annotationManager.deleteAnnotations(
        annotationManager.getAnnotationsList()
      );
    }
    setSearchResults([]);
    setActiveResultIndex(-1);
    setsearchResultsLength(0);
    finalResults.current = [];
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

  return (
    <span className={styles.search_container} ref={searchContainerRef}>
      <div className={styles.search_input}>
        <input
          ref={searchTerm}
          type={"text"}
          placeholder={"Search"}
          onKeyUp={listenForEnter}
        />
        <button onClick={performSearch} ref={searchButton}>
          <img src="ic_search_black_24px.svg" alt="Search" />
        </button>
      </div>
      <div>
        <span>
          <input
            type="checkbox"
            value={toggledSearchModes.includes(
              window.Core.Search.Mode.CASE_SENSITIVE
            )}
            onChange={toggleCaseSensitive}
          />
          Case sensitive
        </span>
        <span>
          <input
            type="checkbox"
            value={toggledSearchModes.includes(
              window.Core.Search.Mode.WHOLE_WORD
            )}
            onChange={toggleWholeWord}
          />
          Whole word
        </span>
      </div>
      <div className="divider"></div>
      <div className={styles.search_buttons}>
        <span>
          <button onClick={clearSearchResults}>
            <img src="icon-header-clear-search.svg" alt="Clear Search" />
          </button>
        </span>
        <span className={styles.search_iterators}>
          <button
            onClick={() => {
              changeActiveSearchResult(activeResultIndex - 1);
            }}
            disabled={activeResultIndex < 0}
          >
            <img
              src="ic_chevron_left_black_24px.svg"
              alt="Previous Search Result"
            />
          </button>
          <button
            onClick={() => {
              changeActiveSearchResult(activeResultIndex + 1);
            }}
            disabled={activeResultIndex < 0}
          >
            <img
              src="ic_chevron_right_black_24px.svg"
              alt="Next Search Result"
            />
          </button>
        </span>
      </div>
      <div>Result found {searchResultsLength}</div>
      <div>
        {finalResults.current.map((result, idx) => {
          // const {
          //   ambient_str: ambientStr,
          //   page_num: pageNum,
          //   result_str_start: resultStrStart,
          //   result_str_end: resultStrEnd,
          // } = result;

          // let pageHeader = null;
          // if (!pageRenderTracker[pageNum]) {
          //   pageRenderTracker[pageNum] = true;
          //   pageHeader = <div>Page {pageNum}</div>;
          // }
          return (
            <div key={`search-result-${idx}`}>
              {/* {pageHeader} */}
              <div
                className={styles.search_result}
                // onClick={() => {
                //   documentViewer.setActiveSearchResult(result);
                //   instance.setZoomLevel(1.5);
                //   console.log(instance.getZoomLevel());
                // }}
              >
                <br />
                {/* <HighlightWord searchWords={keyWord} textToHighlight={result} /> */}
                <HighlightWord2
                  searchWords={textForSearch}
                  textToHighlight={result}
                />
              </div>
            </div>
          );
        })}
      </div>
    </span>
  );
};

export default SearchContainer2;
