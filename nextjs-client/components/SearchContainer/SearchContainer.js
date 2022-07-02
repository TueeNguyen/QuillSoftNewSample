import React, { useState, useEffect, useRef } from 'react';
import styles from '../../styles/SearchContainer.module.css';
import Highlighter from 'react-highlight-words';
import { colors } from '@material-ui/core';
const SearchContainer = (props) => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchResultsLength, setsearchResultsLength] = useState(0);
  const [activeResultIndex, setActiveResultIndex] = useState(-1);
  const [toggledSearchModes, setToggledSearchModes] = useState([]);
  const [textForSearch, settextForSearch] = useState('');
  const [keyConceptForSearch, SetkeyConceptForSearch] = useState('');
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
    xmlData,
    instance,
    keyConceptOnClick,
  } = props;

  const pageRenderTracker = {};

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
    setsearchResultsLength(finalResults.current.length);
  }, [searchResultChange]);
  //keyconcept fire first level search
  useEffect(() => {
    if (keyConceptOnClick != '') {
      SetkeyConceptForSearch(keyConceptOnClick);
    }
  }, [keyConceptOnClick]);
  useEffect(() => {
    searchOnKeyConcept(keyConceptForSearch);
  }, [keyConceptForSearch]);
  //keyword trigger search function
  useEffect(() => {
    if (textForSearch != '') {
      searchFunction(textForSearch, FirstResults.current);
      performSearch();
    }
  }, [textForSearch]);

  useEffect(() => {
    if (textForSearch != '') {
      searchFunction(textForSearch, FirstResults.current);
      performSearch();
    }
  }, [caseSensitive, wholeWord]);

  /**
   * Side-effect function that invokes `documentViewer.textSearchInit`, and stores
   * every result in the state Array `searchResults`, and jumps the user to the
   * first result is found.
   */
  const SearchResultLong = []; // keyword search result
  const SearchResultsSecondLong = []; // perform further search on SearchResultLong , break down long search result
  const finalResults = useRef(SearchResultsSecondLong);
  const FirstResults = useRef([]);
  //Retrieve text by tags, save as arrays and use concat method to merge to one array
  const fullText = [].concat(
    $(xmlData)
      .find('title')
      .map(function () {
        return $(this).text();
      })
      .get(),
    $(xmlData)
      .find('div')
      .map(function () {
        return $(this)
          .text()
          .replace('<head>', '')
          .replace('</head>', '')
          .replace('<p>', '')
          .replace('</p>', '')
          .replace(/\s{2,}/g, ' ')
          .trim();
      })
      .get()
  );

  //count word function , check search result length.
  const wordCount = (str) => {
    const arr = str.split(' ');

    return arr.filter((word) => word !== '').length;
  };

  //further level search, break down search result
  const furtherSearch = (word, resultAfterMerge) => {
    //further search on previous result.
    for (let i = 0; i < resultAfterMerge.length; i++) {
      let str = '';

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
            str += resultAfterMerge[i - 2];
            str += resultAfterMerge[i - 1];
            str += resultAfterMerge[i];
          } else {
            str += resultAfterMerge[i - 1];
            str += resultAfterMerge[i];
            str += resultAfterMerge[i + 1];
            str += resultAfterMerge[i + 2];
          }
        } else {
          str += resultAfterMerge[i];
        }
        SearchResultsSecondLong.push(str);
      }
    }
    console.log(SearchResultsSecondLong);
    finalResults.current = SearchResultsSecondLong;
    setsearchResultChange(!searchResultChange);
  };

  // search key word function, after search on key concept
  const searchFunction = (word, array) => {
    for (let i = 0; i < array.length; i++) {
      let str = '';

      //check if search keyword with case-insensitive
      if (
        caseSensitive == true
          ? array[i].includes(word)
          : array[i].toLowerCase().includes(word)
      ) {
        str += array[i];
        SearchResultLong.push(str);
      }
    }
    console.log(SearchResultLong);
    //use ".?!" break down long text to short sentences
    let breakLongText = SearchResultLong.map((element) => {
      return element.replace(/([.?!])\s*(?=[A-Z])/g, '$1@').split('@');
    });
    // merge result arrays to one array
    let resultAfterMerge = [];
    for (let i = 0; i < breakLongText.length; i++) {
      resultAfterMerge = resultAfterMerge.concat(breakLongText[i]);
    }
    console.log(resultAfterMerge);
    furtherSearch(word, resultAfterMerge);
  };

  // search function, run on fullText
  const searchOnKeyConcept = (concept) => {
    let tempArray = [];
    for (let i = 0; i < fullText.length; i++) {
      let str = '';
      if (fullText[i].toLowerCase().includes(concept)) {
        str += fullText[i];
        tempArray.push(str);
      }
    }
    let breakLongText = tempArray.map((element) => {
      return element.replace(/([.?!])\s*(?=[A-Z])/g, '$1@').split('@');
    });
    let resultAfterMerge = [];
    for (let i = 0; i < breakLongText.length; i++) {
      resultAfterMerge = resultAfterMerge.concat(breakLongText[i]);
    }
    FirstResults.current = resultAfterMerge;
  };

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
      settextForSearch(' ' + textToSearch + ' ');
    } else {
      settextForSearch(textToSearch);
    }

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
      searchTerm.current.value = '';
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
          type={'text'}
          placeholder={'Search'}
          onKeyUp={listenForEnter}
        />
        <button onClick={performSearch} ref={searchButton}>
          <img src='ic_search_black_24px.svg' alt='Search' />
        </button>
      </div>
      <div>
        <span>
          <input
            type='checkbox'
            value={toggledSearchModes.includes(
              window.Core.Search.Mode.CASE_SENSITIVE
            )}
            onChange={toggleCaseSensitive}
          />
          Case sensitive
        </span>
        <span>
          <input
            type='checkbox'
            value={toggledSearchModes.includes(
              window.Core.Search.Mode.WHOLE_WORD
            )}
            onChange={toggleWholeWord}
          />
          Whole word
        </span>
      </div>
      <div className='divider'></div>
      <div className={styles.search_buttons}>
        <span>
          <button onClick={clearSearchResults}>
            <img src='icon-header-clear-search.svg' alt='Clear Search' />
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
              src='ic_chevron_left_black_24px.svg'
              alt='Previous Search Result'
            />
          </button>
          <button
            onClick={() => {
              changeActiveSearchResult(activeResultIndex + 1);
            }}
            disabled={activeResultIndex < 0}
          >
            <img
              src='ic_chevron_right_black_24px.svg'
              alt='Next Search Result'
            />
          </button>
        </span>
      </div>
      <div>Result found {searchResultsLength}</div>
      <div>
        {searchResults.map((result, idx) => {
          const {
            ambient_str: ambientStr,
            page_num: pageNum,
            result_str_start: resultStrStart,
            result_str_end: resultStrEnd,
          } = result;

          let pageHeader = null;
          if (!pageRenderTracker[pageNum]) {
            pageRenderTracker[pageNum] = true;
            pageHeader = <div>Page {pageNum}</div>;
          }
          return (
            <div key={`search-result-${idx}`}>
              {pageHeader}
              <div
                className={styles.search_result}
                onClick={() => {
                  documentViewer.setActiveSearchResult(result);
                  instance.setZoomLevel(1.5);
                  console.log(instance.getZoomLevel());
                }}
              >
                <br />
                <Highlighter
                  highlightClassName='YourHighlightClass'
                  searchWords={[textForSearch]}
                  autoEscape={true}
                  textToHighlight={finalResults.current[idx]}
                  key={idx}
                />
              </div>
            </div>
          );
        })}
      </div>
    </span>
  );
};

export default SearchContainer;
