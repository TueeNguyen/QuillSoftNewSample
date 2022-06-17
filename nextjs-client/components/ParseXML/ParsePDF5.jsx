import { useEffect, useState } from 'react';
import Highlighter from 'react-highlight-words';
export default function ParsePDF5({ keyWord, xmlData }) {
  const [searchResults, setsearchResults] = useState([]);
  //use Jquery to retrieve text by tag, save and merge to one array
  //each element will be a sentence
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
  //count word function , check if search result too short.
  const wordCount = (str) => {
    const arr = str.split(' ');

    return arr.filter((word) => word !== '').length;
  };
  // search result
  const SearchResultLong = [];
  const SearchResultsSecondLong = []; // perform second search on SearchResultLong , break down long search result
  // search function, run on paragraph array, found match element and mix previous and after elements together as a paragraph and push to search result
  const searchFunction = (word) => {
    if (word == null || word == undefined || word == '') {
      console.log('empyty', word);
      return;
    }
    for (let i = 0; i < fullText.length; i++) {
      if (fullText[i].toLowerCase().includes(word)) {
        let str = '';
        str += fullText[i];
        SearchResultLong.push(str);
      }
    }
    //use .?! break down long text to short sentences
    const breakLongText = SearchResultLong.map((element) => {
      return element.replace(/([.?!])\s*(?=[A-Z])/g, '$1@').split('@');
    });
    // merge result arrays to one array
    let resultAfterMerge = [];
    for (let i = 0; i < breakLongText.length; i++) {
      resultAfterMerge = resultAfterMerge.concat(breakLongText[i]);
    }
    //second search on previous result
    for (let i = 0; i < resultAfterMerge.length; i++) {
      let str = '';
      if (resultAfterMerge[i].toLowerCase().includes(word)) {
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
  };

  //user click on new keyWord trigger new search
  useEffect(() => {
    searchFunction(keyWord); // use keyword to search
    setsearchResults(SearchResultsSecondLong);
  }, [keyWord]);
  const resultFound = 'Result found: ' + searchResults.length;
  return (
    <div>
      <div>
        {resultFound}
        {searchResults.map((result, index) => (
          <div>
            <br />
            <Highlighter
              highlightClassName='YourHighlightClass'
              searchWords={[keyWord]}
              autoEscape={true}
              textToHighlight={result}
              key={index}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
