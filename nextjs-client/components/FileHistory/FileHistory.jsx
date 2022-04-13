import React from "react";
import FileProcesser from "../FileUpload/FileProcesser";
import _ from "lodash";
import { isEqual } from "lodash/isEqual";

/**
 * Class: FileHistory
 * - takes props from FileUploader; data and clusters
 * - if its not a duplicate, adds data and clusters (as document) to local Storage
 * - renders current data and clusters using FileProcesser
 * - localStorage: limit up to 10 documents to be stored at a time.
 */

export default class FileHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: JSON.parse(localStorage.getItem("AllDocuments")) || [], // format: [...document { data, clusters }]
    };
    this.appendToFiles = this.appendToFiles.bind(this);
  }

  componentDidMount() {
    /* PRINT THE FILE AND CLUSTERS FOR TESTING */
    //console.log("FILE!: " + JSON.stringify(this.props.data));
    //console.log("CLUSTERS: " + JSON.stringify(this.props.clusters));

    /**
     * creates a variable called document that includes the xml data and the clusters(concepts, keywords and frequencies)
     * if document does not already exists in local storage, append it to files using appendToFiles(...) method
     */
    const document = [this.props.data, this.props.clusters];
    this.appendToFiles(document);
  }

  appendToFiles(newDocument) {
    let tmpDocs = this.state.files;
    tmpDocs.push(newDocument);
    // remove the first element if the size of the array on localStorage is 10
    if (tmpDocs.length >= 10) tmpDocs.shift();

    this.setState(
      {
        files: tmpDocs,
      },
      () => {
        localStorage.setItem("Current", this.state.files.length - 1);
        localStorage.setItem("AllDocuments", JSON.stringify(this.state.files));
      }
    );
  }

  render() {
    return (
      <>
        <FileProcesser
          clusters={this.props.clusters}
          data={this.props.data}
          file={this.props.file}
        />
      </>
    );
  }
}
