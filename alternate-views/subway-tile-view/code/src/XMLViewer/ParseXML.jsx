import "../styles.css";
import data from "../../public/data.html";
import React from "react";
import ParsePDF from "../../../../../nextjs-client/components/ParseXML/ParsePDF";
export default class App extends React.Component {
  constructor(props) {
    super(props);

    const removedNoise = data.replace(
      "GROBID - A machine learning software for extracting information from scholarly documents",
      ""
    );
    this.state = {
      xmlData: removedNoise,
      withConcept: removedNoise,
    };
  }

  findNoise = () => {
    if (this.props.highlight !== null) {
      // counter
      var count = 0;
      // capitialize
      var word1cap =
        this.props.highlight[0].charAt(0).toUpperCase() +
        this.props.highlight[0].slice(1);
      var word2cap =
        this.props.highlight[1].charAt(0).toUpperCase() +
        this.props.highlight[1].slice(1);

      // count the number of occurences
      count = this.state.xmlData.split(this.props.highlight[0]).length - 1;
      count += this.state.xmlData.split(word1cap).length - 1;
      if (this.props.highlight[0] !== this.props.highlight[1]) {
        count += this.state.xmlData.split(this.props.highlight[1]).length - 1;
        if (word1cap !== word2cap)
          count += this.state.xmlData.split(word2cap).length - 1;
      }

      this.props.onUpdateHighText(`${word2cap}: ${count}`);
      this._highlight(
        this.props.highlight[0],
        this.props.highlight[1],
        word1cap,
        word2cap
      );
    }
  };

  _highlight(word1, word2, word3, word4) {
    var _xmlData = this.state.withConcept.replaceAll(
      word1,
      `<mark id="highlight">${word1}</mark>`
    );
    var _xmlData2 = _xmlData.replaceAll(
      word2,
      `<mark id="highlight">${word2}</mark>`
    );
    var _xmlData3 = _xmlData2.replaceAll(
      word3,
      `<mark id="highlight">${word3}</mark>`
    );
    var _xmlData4 = _xmlData3.replaceAll(
      word4,
      `<mark id="highlight">${word4}</mark>`
    );

    this.setState({ xmlData: _xmlData4 });
  }

  highlightConcept() {
    console.log("MAIN", this.props.mainhighlight);
    var _xml = this.state.xmlData.replaceAll(
      this.props.mainhighlight,
      `<mark id="main-highlight">${this.props.mainhighlight}</mark>`
    );
    this.setState({ xmlData: _xml, withConcept: _xml });
  }

  getTitle() {
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(data, "text/html");
    const title =
      xmlDoc.getElementsByTagName("title")[0].childNodes[0].nodeValue;
    const styling = (
      <h3
        style={{
          padding: "1rem",
          fontSize: "1rem",
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
    this.getTitle();
  }

  render() {
    if (this.state.xmlData == null) {
      return null;
    } else {
      return (
        <>
          <div
            className="App"
            dangerouslySetInnerHTML={{
              __html: this.state.xmlData,
            }}
          ></div>
          <ParsePDF />
        </>
      );
    }
  }
}
