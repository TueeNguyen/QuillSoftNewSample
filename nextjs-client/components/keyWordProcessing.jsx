//covert 3d array to 1d
export const breakArryDimension = (longArray) => {
  let tempArray = [];
  for (let i = 0; i < longArray.length; i++) {
    tempArray[i] = longArray[0][i][0];
  }
  return tempArray;
};
//return keyword list without the first selected keyword
export const keyWordList = (arr1, arr2) => {
  const index = arr1.indexOf(arr2[0]);
  if (index > -1) {
    arr1.splice(index, 1);
  }
  return arr1;
};

//Node server send back xml file, extract text from xml file by tags
export const getFullText = (xmlData) => {
  const fullText = [].concat(
    $(xmlData)
      .find("title")
      .map(function () {
        return $(this).text();
      })
      .get(),
    $(xmlData)
      .find("div")
      .map(function () {
        return $(this)
          .text()
          .replace("<head>", "")
          .replace("</head>", "")
          .replace("<p>", "")
          .replace("</p>", "")
          .replace(/\s{2,}/g, " ")
          .trim();
      })
      .get()
  );
  return fullText;
};
