//covert 3d array to 1d
export const breakArryDimension = (longArray) => {
  let tempArray = [];
  for (let i = 0; i < longArray[0].length; i++) {
    if (longArray[0][i] != undefined) {
      tempArray[i] = longArray[0][i][0];
    }
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

// to remove similar results , check the similarity (Jaro-Winkler Algorithm)
export const similarityCheck = (s1, s2) => {
  var m = 0;
  let i = 0;
  let j = 0;
  let n_trans = 0;
  // Exit early if either are empty.
  if (s1.length === 0 || s2.length === 0) {
    return 0;
  }

  // Exit early if they're an exact match.
  if (s1 === s2) {
    return 1;
  }

  var range = Math.floor(Math.max(s1.length, s2.length) / 2) - 1,
    s1Matches = new Array(s1.length),
    s2Matches = new Array(s2.length);

  for (i = 0; i < s1.length; i++) {
    var low = i >= range ? i - range : 0,
      high = i + range <= s2.length ? i + range : s2.length - 1;

    for (j = low; j <= high; j++) {
      if (s1Matches[i] !== true && s2Matches[j] !== true && s1[i] === s2[j]) {
        ++m;
        s1Matches[i] = s2Matches[j] = true;
        break;
      }
    }
  }
  // Exit early if no matches were found.
  if (m === 0) {
    return 0;
  }
  // Count the transpositions.
  var k = n_trans;

  for (i = 0; i < s1.length; i++) {
    if (s1Matches[i] === true) {
      for (j = k; j < s2.length; j++) {
        if (s2Matches[j] === true) {
          k = j + 1;
          break;
        }
      }

      if (s1[i] !== s2[j]) {
        ++n_trans;
      }
    }
  }

  var weight = (m / s1.length + m / s2.length + (m - n_trans / 2) / m) / 3,
    l = 0,
    p = 0.1;

  if (weight > 0.7) {
    while (s1[l] === s2[l] && l < 4) {
      ++l;
    }

    weight = weight + l * p * (1 - weight);
  }

  return weight;
};

// use similarityCheck function to check if elements are almost the same, and remove the duplicate.
export const removeDupicate = (arr) => {
  for (let i = 0; i < arr.length - 1; i++) {
    if (similarityCheck(arr[i], arr[i + 1]) > 0.9) {
      arr.splice(i + 1, 1);
    }
  }
  return arr;
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
