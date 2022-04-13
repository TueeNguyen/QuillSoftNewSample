import React, { Component } from "react";

import Dropzone from "react-dropzone";
import styles from "../../styles/Home.module.css";
import PDFIcon from "../icons/PDF";
import StyledButton from "../StyledButton";
import ProgressBar from "./../ProgressBar/ProgressBar";
import { fileToBinary } from "./UploadHelper";
import {
  uploadFile,
  processFile,
  getClusters,
  getTEI,
} from "./../../services/api-call.js";
import FileHistory from "./../FileHistory/FileHistory";
import db from "../db";

/**
 * Class: FileUploader
 * - takes the input file and calls api methods to upload and process file
 * - renders ProgressBar as api methods are called
 * - renders FileHistory when uploadFile, processFile, getClusters and getTEI is completed successfully
 */
class FileUploader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 25,
      progressbarStatus: "1 of 4 steps finished",
      processing: false,
      done: false,
      error: "", // invalid file types
      data: null, // tei
      clusters: null, // concepts and keywords
    };
    this._handleFileUpload = this._handleFileUpload.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    // refernce for file input
    this.fileInput = React.createRef();
  }

  onBrowseFilesClick = () => {
    this.fileInput.current.click();
  };

  /**
   * Method takes file as input
   * - 1. calls api methods: uploadFile, processFile, getClusters, getTEI
   * - 2. updates states as api methods are done
   *     - a. progress and progressbarStatus values changing after successful execution of the api methos
   *     - b. after all methods called, done and processing are true, indicating that file is done processing.
   */
  _handleFileUpload = async (e) => {
    let fileSelected = e.target !== undefined ? e.target.files[0] : e[0];
    //save the file to indexDB, will use it in ParsePDF.jsx for PDFtron webviewer
    db.recentFiles.add({ file: fileSelected, created_at: Date.now() });

    this.props.setFile(fileSelected);
    var data = new FormData();
    data.append("file", fileSelected);

    //const source = await fileToBinary(fileSelected);
    this.setState({ processing: true });

    uploadFile(data)
      .then((r) => {
        console.log("UPLOADED");
        this.setState({
          progress: 50,
          progressbarStatus: "2 of 4 steps finished",
        });
        processFile().then((r) => {
          console.log("PROCESSED");
          this.setState({
            progress: 75,
            progressbarStatus: "3 of 4 steps finished",
          });
          getClusters().then((result) => {
            console.log("GOT CLUSTERS");
            this.setState({
              progressbarStatus: "4 of 4 steps finished",
              progress: 100,
            });
            this.setState({ clusters: result.data });
            getTEI().then((r) => {
              console.log("GOT XML DATA");
              this.setState({
                progressbarStatus: "4 of 4 steps finished",
                progress: 100,
                data: r.data,
              }),
                this.setState({ done: true, processing: true });
            });
          });
        });
      })
      .catch((error) => console.log(error));
  };

  _handleSubmit = () => {
    alert("Submitted");
  };

  /**
   * If file has not been uploaded:
   * - processing and done are false
   * - renders dropzone with button to upload file
   *
   * If file has been uploaded and file is being processed:
   * - processing is true
   * - done is false
   * - renders ProgressBar with progress bar status (Step num) and progress (num%)
   *
   * If file has been uploaded and processing is complete:
   * - processing and done are true
   * - renders FileHistory which appends latest files that have been uploaded before refresh
   *
   */
  render() {
    return this.state.done == false && this.state.processing == false ? (
      <>
        <h2 className={styles.heading}>Let's Get Started!</h2>
        <Dropzone
          // mime-types
          // error: does not accept .docx type for unknown reasons.
          accept="application/pdf,text/xml"
          multiple={false}
          onDrop={this._handleFileUpload}
        >
          {({
            getRootProps,
            getInputProps,
            isDragActive,
            isDragAccept,
            isDragReject,
          }) => {
            const active = `${styles.accept_file}`;
            const reject = `${styles.reject_file}`;
            const fileclass = isDragAccept
              ? active
              : isDragReject
              ? reject
              : "";
            return (
              <div
                {...getRootProps({
                  className: `${styles.uploadContainer} ${fileclass}`,
                  onClick: (e) => e.stopPropagation(),
                  style: { outline: "none" },
                })}
              >
                <input {...getInputProps()} />
                <div className={styles.topSection}>
                  <PDFIcon width={111} height={111} />
                  <p className={styles.dragLabel}>
                    Drag & Drop a PDF or TEI.XML here
                  </p>
                </div>
                <p>or</p>
                <React.Fragment>
                  <input
                    type="file"
                    ref={this.fileInput}
                    style={{ display: "none" }}
                    onChange={this._handleFileUpload}
                  />
                  <StyledButton
                    label="Browse Files"
                    onClick={this.onBrowseFilesClick}
                  />
                </React.Fragment>
              </div>
            );
          }}
        </Dropzone>
      </>
    ) : this.state.done == false && this.state.processing == true ? (
      <ProgressBar
        progress={this.state.progress}
        progressStatus={this.state.progressbarStatus}
      />
    ) : (
      <FileHistory
        data={this.state.data}
        clusters={this.state.clusters}
        file={this.props.file}
      />
    );
  }
}

export default FileUploader;

/*
<FileProcesser clusters={this.state.document.clusters} data={this.state.document.data} />
*/
