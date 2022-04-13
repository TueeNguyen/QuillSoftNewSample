import React, { createRef } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";

import styles from "./KeywordViewer.module.css";

/**
 * Class: KeywordViewer
 * - takes info passed by parent component FileProcesser and renders it
 * - data format: keyword (also includes its lemma), frequency (number of occurences)
 */
export default class KeywordViewer extends React.Component {
  constructor(props) {
    super(props);
    //this.keywordCounter = this.keywordCounter.bind(this);
    this.determinelemma = this.determinelemma.bind(this);
    this.changeStyles = this.changeStyles.bind(this);
  }

  /*
  -- UNCOMMENT THE FUNCTIONS BELOW TO DETERMINE THE NUMBER OF OCCURENCES MANUALLY (by calculating it) --
  */

  /*
  counter(search, text){
    var cnt = 0;
    text.replace(new RegExp(search, 'gi'), function(x){
      cnt += 1;
    })
    return cnt;
  }
  */

  /*
  keywordCounter() {
    // clean xml
    const cleanXML = this.props.data.replace(
      "GROBID - A machine learning software for extracting information from scholarly documents",
      ""
    );

    var clean = cleanXML.replaceAll(/<([A-Z][A-Z0-9]*)\b[^>]*>(.*?)/gi,'');
    clean = clean.replace(/<[/]([A-Z][A-Z0-9]*)\b[^>]*>(.*?)/gi,'');

    var allGroupings = [];

    if (this.props.clusters !== null) {
      var grouping = { keyword: null, frequency: 0 };
      var count = 0;
      this.props.clusters.map((key) => {

        count = 0;

        count += this.counter(key[0], clean);
        // same for next lemma but only if its not the same as the first key
        if(key[0] !== key[1]){
          //count += this.counter(key[1].charAt(0).toUpperCase() + key[1].slice(1), cleanXML);
          count += this.counter(key[1], clean);
        }

        grouping = { keyword: key[1], frequency: count };
        allGroupings.push(grouping);
      });
    }
    return allGroupings;
  }
  */

  componentDidMount() {
    const _BTNS = document.getElementsByClassName("myBtns");
    if (_BTNS) {
      console.log(document.getElementsByClassName("myBtns"), "MOUNTED");
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.clusters !== this.props.clusters) {
      this.determinelemma();
      var elements = Array.prototype.slice.call(
        document.querySelectorAll(".myBtns")
      );

      elements.forEach(function (el) {
        el.style.color = "black";
      });
    }
  }

  determinelemma() {
    const { clusters } = this.props;
    var updatedData = [];
    if (clusters !== undefined || clusters !== null) {
      for (let i = 0; i < clusters.length; ++i) {
        if (i + 1 < clusters.length && clusters[i][1] === clusters[i + 1][1]) {
          updatedData.push([
            clusters[i][0],
            clusters[i + 1][0],
            clusters[i][2] + clusters[i + 1][2],
          ]);
          console.log("SAME: " + this.props.concept.toString(), [
            clusters[i][0],
            clusters[i][1],
            clusters[i][2],
            clusters[i + 1][0],
            clusters[i + 1][1],
            clusters[i + 1][2],
          ]);
          ++i;
        } else {
          updatedData.push([clusters[i][0], clusters[i][1], clusters[i][2]]);
        }
      }
    }
    return updatedData;
  }

  changeStyles(e) {
    e.target.className = "myBtns";
    e.target.style.color = "red";
    console.log("class" + e.target.className);
  }

  render() {
    const updated = this.determinelemma();
    if (updated !== []) {
      return (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Keywords</TableCell>
                  <TableCell align="right">Frequency</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {updated.map((event, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row" align="left">
                      <label>{index + 1}. </label>
                      <Button
                        className={styles.keywordbtns}
                        onClick={(e) => {
                          this.props.callConcepts(event), this.changeStyles(e);
                        }}
                      >
                        {event[0]}
                      </Button>
                    </TableCell>
                    <TableCell align="right">
                      {event[2]}{" "}
                      {/* the 3rd item in the array is the number of occurences */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      );
    } else {
      return <div></div>;
    }
  }
}
