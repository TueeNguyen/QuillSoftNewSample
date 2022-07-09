import React from "react";
import ParseXML from "./../ParseXML/ParseXML";
import {
  Grid,
  Tooltip,
  Card,
  CardContent,
  Select,
  MenuItem,
  Button,
  Typography,
} from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import KeywordViewer from "../Viewer/KeywordViewer";
import AssignmentIcon from "@material-ui/icons/Assignment";
import dynamic from "next/dynamic";
import { Height } from "@material-ui/icons";
const TreeMapViewer = dynamic(() => import("../Viewer/TreeMapViewer"), {
  ssr: false,
});

/* React version for checking capabilities */
const REACT_VERSION = React.version;

/**
 * Class: FileProcesser
 * - takes input data and clusters from FileHistory
 * - passes xml data to ParseXML
 * - create treemap data and passes to TreeMapViewer with occurences
 * - passes concepts from clusters to KeyWordViewer
 */
export default class FileProcesser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      done: false,
      highlight: null,
      highText: null,
      words: [],
      groups: [],
      curr: {
        currIndex: -1,
        currWord: null,
        currGroup: null,
        done: false,
      },
      title: null,
      menu: {
        open: false,
      },
      show: true,
      tooltip: "hide table",
      isScrolling: false,
      cardHeight: 500,
      keyWord: [],
      keyConcept: "",
    };

    /* FOR: <ParseXML> */
    this.onUpdateHighText = this.onUpdateHighText.bind(this);
    this.getTitle = this.getTitle.bind(this);
    // reference
    this.refParseXML = React.createRef();

    /* FOR: Toggle to show and hide keywords */
    this.setOpen = this.setOpen.bind(this);
    this.setClose = this.setClose.bind(this);

    /* FOR: Keyword finder */
    this.callConcepts = this.callConcepts.bind(this);
  }

  /* Takes props clusters and extracts the concepts (words) and their keywords and frequencies (groups) */
  componentDidMount() {
    var temp = [];
    var keys = [];
    Object.keys(this.props.clusters).forEach((key) => {
      temp.push(this.props.clusters[key]);
      keys.push(key);
    });
    this.setState({ groups: temp, words: keys, done: true });
    console.log("keyword now ", temp);
    console.log(temp[0][0]);
    console.log(temp[0][0][0]);
  }

  /* Concept to be highlighted */
  onUpdateHighText(resp) {
    this.setState({ highText: resp });
  }

  /* Dropdown Menu to selecting a concept
  - these determine the keywords (currGroup)
   */
  _selectConcept() {
    return (
      <Button onClick={this.setOpen} fullWidth={true}>
        <Select
          defaultValue=""
          onOpen={this.setOpen}
          onClose={this.setClose}
          style={{ width: "100%" }}
        >
          {this.state.words.map((value, index) => (
            <MenuItem
              key={index}
              value={value}
              onClick={() => {
                this.setState(
                  {
                    curr: {
                      currWord: value,
                      currIndex: index,
                      currGroup: this.state.groups[index],
                      done: true,
                    },
                    highlight: null,
                    keyConcept: value,
                  },
                  () => {
                    this.refParseXML.current.highlightConcept();
                  }
                );
              }}
            >
              {value}
            </MenuItem>
          ))}
        </Select>
      </Button>
    );
  }

  // -- KEYWORDVIEWER --

  /* Keyword to be highlighted (ref used since keywords are in KeywordViewer) */
  callConcepts(value) {
    let temp =
      this.state.highlight === null
        ? value
        : this.state.highlight.concat(value);
    this.setState({ highlight: temp }, () => {
      this.refParseXML.current.findNoise();
    });
    /* user click the keyword, keyword value pass to ParseXml.jsx and child components */
    this.setState({ keyWord: value[0] });
    console.log(value);
  }

  /* Open or Close visibility of keywords table */
  setOpen() {
    this.setState({ menu: { open: true } });
  }
  setClose() {
    this.setState({ menu: { open: false } });
  }

  /* Tooltip and Button icons for showing and hiding table */
  _tooltip() {
    return (
      <Tooltip title={this.state.tooltip}>
        {this.state.show ? (
          <VisibilityIcon
            onClick={() => {
              this.setState({ show: false, tooltip: "show table" });
            }}
          />
        ) : (
          <VisibilityOffIcon
            onClick={() => {
              this.setState({ show: true, tooltip: "hide table" });
            }}
          />
        )}
      </Tooltip>
    );
  }

  // -- PARSEXML --

  /* Gets the title from the XML data */
  getTitle(value) {
    this.setState({ title: value });
  }

  // -- TREEMAPVIEWER --
  /* creates TreeMap representation of the concepts and the number of keywords for that concept (unit: size) */
  createTreeMap() {
    var text = this.props.data;
    if (this.state.words != null) {
      const data = { name: "Total Concepts and Keywords:", children: [] };
      var temp = { name: this.state.words[0], value: 100 };
      for (let i = 0; i < this.state.words.length; ++i) {
        var cnt = 0;
        cnt = this.state.groups[i].length;
        // incase the unit is the number of occurences for the concept (rather than its size)
        /*
        text.replace(new RegExp(this.state.words[i], 'gi'), function(x){
            cnt += 1;
        })
        */
        data.children.push({
          name: this.state.words[i],
          value: cnt,
        });
      }
      return <TreeMapViewer mapper={data} />;
    } else {
      return null;
    }
  }

  /* Two grids: 
  - One shows concepts, keywords, and treemap
  - Other shows  the text from PDF and highlights selections.
  */
  render() {
    return (
      <div>
        <Grid
          container
          spacing={2}
          style={{
            width: "1500px",
            padding: "1rem",
          }}
        >
          <Grid item xs={4}>
            <Card
              className="card-style"
              style={{ height: "100vh", overflow: "scroll" }}
            >
              <Typography style={{ padding: "1rem" }}>
                Select Concept:{" "}
              </Typography>
              <CardContent>{this._selectConcept()}</CardContent>
              <div style={{ padding: "1rem", alignSelf: "center" }}>
                {this._tooltip()}
              </div>
              {this.state.curr.done && this.state.show ? (
                <div>
                  <KeywordViewer
                    concept={this.state.curr.currWord}
                    callConcepts={this.callConcepts}
                    clusters={this.state.curr.currGroup}
                    data={this.state.data}
                  />
                </div>
              ) : null}

              {this.createTreeMap()}
            </Card>
          </Grid>
          <Grid item xs={8}>
            <Card className="card-style">
              <CardContent className="card-file-view">
                {/* <div style={{ marginLeft: "1rem", display: "inline-flex" }}>
                  <Tooltip title="Xray Viewer">
                    <a href="/xray" target="_blank">
                      <AssignmentIcon />
                    </a>
                  </Tooltip>
                </div> */}
                {this.state.title !== null ? this.state.title : null}

                <ParseXML
                  data={this.state.data}
                  onUpdateHighText={this.onUpdateHighText}
                  getTitle={this.getTitle}
                  ref={this.refParseXML}
                  highlight={this.state.highlight}
                  mainhighlight={this.state.curr.currWord}
                  keyWord={this.state.keyWord}
                  keyConcept={this.state.keyConcept}
                  groups={this.state.groups}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    );
  }
}
