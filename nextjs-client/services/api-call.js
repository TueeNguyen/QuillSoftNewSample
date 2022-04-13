/**
 * These methods help connect to the Quillsoft-engine
 */

import axios from 'axios';

/**
 * Takes in file as input and uploads it to the grobid server (/api)
 * 
 * @returns Promise: request variable that stores the JSON response
 *  - if upload is sucessful, returns response and prints response in console
 *  - if rejected, throws Promise.reject and prints the error in console
 */
export async function uploadFile(file) {
  const request = axios.post('http://localhost:5000/api/', file, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return request
  .then(response => {
    console.log(response)
    return response;
  }
      )
  .catch(error => {
    console.log(error)
    throw Promise.reject(error);
  })
}

/**
 * Edits the configuration requirements
 */
export async function editConfig(
  sentencesByParagraph,
  preprocessPDF,
  textRankRatio,
  summarizationSimilarityThreshold,
  lemma,
  phrasesPercentage,
  topKeyPhrasesCount,
  extractionSimilarityThreshold,
  nGrams,
  normalize
) {
  var dataConfig = JSON.stringify(
    {
      "SentencesByParagraph": sentencesByParagraph,
      "PreprocessPDF": preprocessPDF,
      "TextrankRatio": textRankRatio,
      "SummSimilarityThreshold": summarizationSimilarityThreshold,
      "Lemma": lemma,
      "PhrasesPercentage": phrasesPercentage,
      "TopKeyPhrasesCount": topKeyPhrasesCount,
      "PhraseSimilarityThreshold": extractionSimilarityThreshold,
      "NGrams": nGrams,
      "Normalize": normalize
    });
    var config = {
      method: 'post',
      url: 'http://localhost:5000/api/config',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : dataConfig
    };
    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
}

/**
 * Gets the configuration requirements
 */
export async function getConfig() {
  const request = axios.get('http://localhost:5000/api/config', { method: 'GET' });
  return request
    .then(response => {
    return response;
    })
    .catch(error => {
      throw Promise.reject(error);
  })
}


/**
 * Processes the uploaded file for clusters, file data and keywords. 
 * 
 * !Important: Must uploadFile(...) before calling this function, 
 * and all other post functions below are simply extracting information from the data derived by this method
 * 
 * @returns Promise: request variable that stores the JSON response
 *  - if processing is sucessful, returns response and prints response in console
 *  - otherwise, throws Promise.reject and prints the error in console
 */
export async function processFile() {
  // GET METHOD
  const request = axios.get('http://localhost:5000/api/process', {
    method: 'GET',
  });

    return request
      .then(response => {
        console.log(response);
        return response;
    })
    .catch(error => {
      throw Promise.reject(error);
    })
 
}
/**
 * Retrives the clusters with concepts, their keywords and frequencies extracted after processing the file
 * !Important: Must call uploadFile(...) and processFile() before using this method
 * 
 * @returns Promise: request variable that stores the JSON response
 *  - if clusters exists and are retrived, method is sucessful; returns response and prints response in console
 *  - otherwise, throws Promise.reject and prints the error in console
 */

export async function getClusters() {
  const request = axios.post('http://localhost:5000/api/cluster', {
    method: 'POST',
  });

  return request
  .then(response => {
      console.log(response);
      return response;
  })
  .catch(error => {
      throw Promise.reject(error);
  })
}

/**
 * Retrives the text from the file as JSON array after processing the file
 * !Important: Must call uploadFile(...) and processFile() before using this method
 * 
 * @returns Promise: request variable that stores the JSON response
 *  - if JSON object array of text is retrived, method is sucessful; returns response and prints response in console
 *  - otherwise, throws Promise.reject and prints the error in console
 */
export async function getText() {
  const request =  axios.get('http://localhost:5000/api/text', {
    method: 'GET',
  });

  return request
  .then(response => {
      console.log(response);
      return response;
  })
  .catch(error => {
      throw Promise.reject(error);
  })
}

/**
 * Retrives the xml data created by the GROBID server after processing the file
 * !Important: Must call uploadFile(...) and processFile() before using this method
 * 
 * @returns Promise: request variable that stores the XML response
 *  - if JSON object array of text is retrived, method is sucessful; returns response and prints response in console
 *  - otherwise, throws Promise.reject and prints the error in console
 */

export async function getTEI() {
  const request = axios.get('http://localhost:5000/api/tei', {
    method: 'GET',
    headers: {
      'Content-Type': 'text/xml'
    }
  });

  return request
    .then(response => {
      console.log(response);
      return response;
    })
    .catch(error => {
      throw Promise.reject(error);
    })
}

export async function getRawTEI() {
  const request = axios.get('http://localhost:5000/api/tei', {
    method: 'GET',
  });
    return request
      .then(response => {
        return response.data;
    })
    .catch(error => {
      throw Promise.reject(error);
    })
 
}

export async function getPhrases() {
  const request = axios.get('http://localhost:5000/api/phrases', {
    method: 'GET',
  });
    return request
      .then(response => {
        return response.data;
    })
    .catch(error => {
      throw Promise.reject(error);
    })
}
