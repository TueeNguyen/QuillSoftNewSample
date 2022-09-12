//covert 3d array to 1d, save the first element "keyword " to new array
export const breakArryDimension = (longArray) => {
  let tempArray = [];
  for (let i = 0; i < longArray[0].length; i++) {
    if (longArray[0][i] != undefined) {
      tempArray[i] = longArray[0][i][0];
    }
  }
  return tempArray;
};
//covert 3d array to 1d, save the first element "keyword " to new array
export const breakArrayDimension2 = (longArray) => {
  let tempArray = [];
  for (let i = 0, j = longArray.length; i < j; i++) {
    if (longArray[i][0] != undefined) {
      tempArray[i] = longArray[i][0];
    }
  }
  return tempArray;
};

// to remove similar results , check the similarity (Jaro-Winkler Algorithm)
export const similarityCheck = (s1, s2) => {
  var m = 0;
  let i = 0;
  let j = 0;
  let n_trans = 0;
  if (s1 === undefined || s2 === undefined) {
    return 0;
  }
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
  if (arr.length === 2) {
    for (let i = 0, m = arr.length; i < m; i++) {
      for (let k = 1, j = arr.length; k < j; k++) {
        if (similarityCheck(arr[i], arr[k]) > 0.9) {
          arr.splice(k, 1);
        }
      }
    }
  } else {
    for (let i = 0, m = arr.length; i < m; i++) {
      for (let k = 1, j = arr.length - 1; k < j; k++) {
        if (similarityCheck(arr[i], arr[k]) > 0.9) {
          arr.splice(k, 1);
        }
      }
    }
  }

  return arr;
};

//change array element to meet wholeword search
export const changeArraytoWholeWord = (arr) => {
  let tempArr = [];
  for (let i = 0; i < arr.length; i++) {
    tempArr[i] = " " + arr[i] + " ";
  }
  return tempArr;
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
// split array "a".  "n" is how many chunks need to split to, balanced if set to "true", subarrays' lengths differ as less as possible, else all subarrays but the last have the same length)
export const chunkify = (a, n, balanced) => {
  if (n < 2) return [a];
  let len = a.length,
    out = [],
    i = 0,
    size;
  if (len % n === 0) {
    size = Math.floor(len / n);
    while (i < len) {
      out.push(a.slice(i, (i += size)));
    }
  } else if (balanced) {
    while (i < len) {
      size = Math.ceil((len - i) / n--);
      out.push(a.slice(i, (i += size)));
    }
  } else {
    n--;
    size = Math.floor(len / n);
    if (len % size === 0) size--;
    while (i < size * n) {
      out.push(a.slice(i, (i += size)));
    }
    out.push(a.slice(size * n));
  }
  return out;
};
