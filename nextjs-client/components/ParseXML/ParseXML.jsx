import React from 'react';
import { Typography, Button } from '@material-ui/core';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import RefreshIcon from '@material-ui/icons/Refresh';
import Tooltip from '@material-ui/core/Tooltip';
import ParsePDF from './ParsePDF';
import ParsePDF2 from './ParsePDF2';
import ParsePDF3 from './ParsePDF3';
import ParsePDF4 from './ParsePDF4';
import ParsePDF5 from './ParsePDF5';
import ParsePDF6 from './ParsePDF6';

/**
 * Class: ParseXML
 * - takes the xml data and displays it
 * - includes buttons to manipulate text size with zoom in/out, and button to reset the highlights
 * - removes 'GROBID - A machine ...' string by default
 * - xmlData: is the thing being rendered
 * - withConcept: when a different concept is selected, this ensures that the updated concept is highlighted
 * - original: preserves default with no highlights, needed for reset button.
 * - sends title of XML to parent component FileProcesser
 */
export default class ParseXML extends React.Component {
  constructor(props) {
    super(props);

    const removedNoise = this.props.data.replace(
      'GROBID - A machine learning software for extracting information from scholarly documents',
      ''
    );
    this.state = {
      xmlData: removedNoise,
      withConcept: removedNoise,
      original: removedNoise,
      scale: 1,
    };
    this.onZoomIn = this.onZoomIn.bind(this);
    this.onZoomOut = this.onZoomOut.bind(this);
  }

  onZoomIn() {
    this.setState({ scale: this.state.scale + 0.2 });
  }

  onZoomOut() {
    this.setState({ scale: this.state.scale - 0.2 });
  }

  /* If keyword occurences need to be manually counted, then un-comment this function */
  /*
  counter(search, text){
    var cnt = 0;
    text.replace(new RegExp(search, 'gi'), function(x){
      cnt += 1;
    })
    return cnt;
  }
  */

  findNoise = () => {
    if (this.props.highlight !== null) {
      /* If keyword occurences need to be manually counted, then un-comment this function.
          - this calls the counter function and determine number of occurences of given word */
      /*
      // counter
      var count = 0;
      // count the number of occurences
      count += this.counter(this.props.highlight[0], this.state.xmlData);
      if (this.props.highlight[0] !== this.props.highlight[1]) {
        count += this.counter(this.props.highlight[1], this.state.xmlData);
      }
      */
      this._highlight(this.props.highlight);
    }
  };

  //utilitarian function to split an array
  chunks(array, size) {
    return Array.apply(0, { length: Math.ceil(array.length / size) }).map(
      (_, index) => array.slice(index * size, (index + 1) * size)
    );
  }

  /* Aids in higlighting keyword pressed (and its lemma value)
      - wraps the word needed to be highlighted in id "highlight" using replace 
      - css determine highlight color
      " */
  _highlight(value) {
    let _xmlData = this.state.withConcept;
    //get individual word chunks
    let keywords = this.chunks(value, 3);

    keywords.forEach((keyword) => {
      let regex = new RegExp('\\b' + keyword[0] + '\\b', 'ig');
      _xmlData = _xmlData.replace(
        regex,
        `<mark id="highlight">${keyword[0]}</mark>`
      );
    });

    this.setState({ xmlData: _xmlData });
  }

  /* Higlights the concept selected
      - updates property mainhighlight passed by parent component FileProcesser
   */
  highlightConcept() {
    var _xml = this.state.original.replaceAll(
      new RegExp(this.props.mainhighlight, 'gi'),
      `<mark id="main-highlight">${this.props.mainhighlight}</mark>`
    );
    this.setState({ xmlData: _xml, withConcept: _xml });
  }

  /* Attempts to extract the title of the file and update the function getTitle in parent class FileProcesser
      - if title is not found through this process, default title will be "Document Title"
   */
  getTitle() {
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(this.props.data, 'text/html');
    var title = 'Document Title';
    if (xmlDoc.getElementsByClassName('title')[0] !== undefined)
      title = xmlDoc.getElementsByTagName('title')[0].childNodes[0].nodeValue;
    const styling = (
      <h3
        style={{
          padding: '1rem',
          fontSize: '1rem',
          fontWeight: 800,
        }}
      >
        {title}
      </h3>
    );
    this.props.getTitle(styling);
    return styling;
  }

  componentDidMount() {
    //  this.getTitle();
  }

  render() {
    if (this.state.xmlData == null) {
      return null;
    } else {
      return (
        <>
          {/* below commented functions  will not working on the new added components (ParsePDF1-5)  */}
          {/* <div className="button-style">
            <Tooltip title="Zoom In">
              <Button variant="contained">
                <ZoomInIcon color="action" onClick={this.onZoomIn} />
              </Button>
            </Tooltip>
            <Tooltip title="Zoom Out">
              <Button variant="contained">
                <ZoomOutIcon color="action" onClick={this.onZoomOut} />
              </Button>
            </Tooltip>
            <Tooltip title="Hide Highlights">
              <Button>
                <RefreshIcon
                  color="action"
                  onClick={() => {
                    this.setState({ xmlData: this.state.original });
                  }}
                />
              </Button>
            </Tooltip>
          </div> */}
          {/* <div
            className="parse-xml"
            style={{ fontSize: `${this.state.scale}rem` }}
            dangerouslySetInnerHTML={{
              __html: this.state.xmlData,
            }}
          ></div> */}
          {/* uncomment  one component at a time to switch between  different UI */}
          {/* <ParsePDF keyWord={this.props.keyWord} /> */}
          {/* <ParsePDF2 keyWord={this.props.keyWord} /> */}
          {/* <ParsePDF3 keyWord={this.props.keyWord} /> */}
          {/* <ParsePDF4
            keyWord={this.props.keyWord}
            xmlData={this.props.data}
            keyConcept={this.props.keyConcept}
          /> */}
          {/* <ParsePDF5 keyWord={this.props.keyWord} xmlData={this.props.data} /> */}
          <ParsePDF6
            keyWord={this.props.keyWord}
            xmlData={this.props.data}
            keyConcept={this.props.keyConcept}
            groups={this.props.groups}
          />
        </>
      );
    }
  }
}
