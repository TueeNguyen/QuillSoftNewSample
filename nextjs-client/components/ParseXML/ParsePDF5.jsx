import { useEffect, useState } from 'react';
import Highlighter from 'react-highlight-words';
export default function ParsePDF5({ keyWord, xmlData }) {
  const [searchResults, setsearchResults] = useState([]);
  //use Jquery to retrieve text by tag, save and merge to one array
  //each element will be a sentence
  const fullText = [].concat(
    $(xmlData)
      .find('header')
      .map(function () {
        return $(this).text();
      })
      .get(),
    $(xmlData)
      .find('footer')
      .map(function () {
        return $(this).text();
      })
      .get(),
    $(xmlData)
      .find('p')
      .map(function () {
        return $(this).text();
      })
      .get()
  );
  // search result
  const SearchResultLong = [];
  // search function, run on paragraph array, found match element and mix previous and after elements together as a paragraph and push to search result
  const searchFunction = (word) => {
    if (word == null || word == undefined || word == '') {
      console.log('empyty', word);
      return;
    }
    for (let i = 0; i < fullText.length; i++) {
      if (fullText[i].toLowerCase().includes(word)) {
        let str;
        let k;
        if (i <= 1) {
          for (k = 0; k < 3; k++) {
            str += fullText[k];
          }
          SearchResultLong.push(str);
        } else if (i >= 2) {
          if (i == fullText.length - 3) {
            for (k = i - 2; k <= i; k++) {
              str += fullText[k];
            }
            SearchResultLong.push(str);
          } else {
            for (k = i - 4; k <= i + 4; k++) {
              str += fullText[k];
            }
            SearchResultLong.push(str);
          }
        }
      }
    }
  };

  //user click on new keyWord trigger new search
  useEffect(() => {
    searchFunction(keyWord); // use keyword to search
    setsearchResults(SearchResultLong);
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
