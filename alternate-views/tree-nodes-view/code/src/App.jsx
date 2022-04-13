import "./styles.css";
import React from "react";
import {
  Paper,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Typography
} from "@material-ui/core";
import clusters from "./clusters.json";
import NodeViewer from "./NodeViewer";
import data from "../public/data.html";
import TimelineViewer from "./TimelineViewer";
import HeatMap from "react-heatmap-grid";
import Highlighter from "react-highlight-words";

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      done: false,
      highlight: ["swine"],
      singleWords: [],
      words: [],
      groups: [],
      structured: [],
      conceptMap: {},
      curr: {
        currIndex: -1,
        currWord: null,
        currGroup: null,
        done: false
      }
    };
  }

  createPDF() {
    return (
      <Typography
        className="text-style"
        dangerouslySetInnerHTML={{
          __html: data
        }}
      />
    );
  }

  callTimelineDots(value) {
    console.log("callTimelineDots: ", value);
    this.setState({ highlight: value });
  }

  // create tabs
  _tabs() {
    return (
      <Paper>
        <Tabs variant="scrollable" values={this.state.words}>
          {this.state.words.map((value, index) => (
            <Tab
              key={index}
              label={value}
              onClick={() => {
                console.log("FROM TABS:", value);
                this.setState({
                  curr: {
                    currWord: value,
                    currIndex: index,
                    currGroup: this.state.groups[index],
                    done: true
                  }
                });
              }}
            ></Tab>
          ))}
        </Tabs>
      </Paper>
    );
  }

  _content() {
    const { conceptMap, curr } = this.state;
    if (curr.currWord != null) {
      return (
        <>
          <NodeViewer
            concepts={conceptMap[curr.currWord]}
            currWord={curr.currWord}
          />
        </>
      );
    } else {
      return <></>;
    }
  }

  componentDidMount() {
    var temp = [];
    var keys = [];
    Object.keys(clusters).forEach((key) => {
      temp.push(clusters[key]);
      keys.push(key);
      
    });
    console.log("WORDS", keys);
    this.setState({ groups: temp, words: keys, done: true }, () => {
      this.singleWords();
    });
  }

  cluster() {
    var terms = [];

    this.state.singleWords.map((value) => {
      //console.log("VALUE", value);
      var group = this.findgroup(value);
      terms.push(group);
    });

    this.setState({ done: true, structured: terms }, () => {
      this.struct();
    });
  }

  struct() {
    var _val = {};
    this.state.words.map((val) => {
      var temp = {};
      this.state.singleWords.map((val2, index) => {
        var keys = [];
        if (val.includes(val2)) {
          keys.push(this.state.structured[index]);
          temp[val2] = keys;
        }
      });
      _val[val] = temp;
    });
    console.log("FROM STRUCT", _val);
    this.setState({ conceptMap: _val });
  }

  singleWords() {
    var temp = [];
    for (let i = 0; i < this.state.words.length; ++i) {
      var splitted = this.state.words[i].split(" ");
      splitted.map((value) => {
        if (!temp.includes(value)) {
          temp.push(value);
        }
      });
    }
    this.setState({ singleWords: temp }, () => this.cluster());
  }

  findgroup(root) {
    var groups = [];
    for (let i = 0; i < this.state.words.length; ++i) {
      if (this.state.words[i] !== root && this.state.words[i].includes(root)) {
        groups.push(this.state.words[i]);
      }
    }
    console.log("FOR ROOT", root, "GROUPS", groups);
    return groups;
  }

  render() {
    var temp = [];
    if (this.state.curr.done) {
      temp = this.state.curr.currGroup;
    } else {
      temp = [1, 2, 3];
    }

    return (
      <div>
        <Grid container>
          <Grid item xs={6}>
            <Card>
              <CardContent>{this._tabs()}</CardContent>
              <CardContent>{this._content()}</CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card className="card-style">
              {this.state.curr.done ? (
                <div className="second-grid">
                  <TimelineViewer
                    callTimelineDots={this.callTimelineDots}
                    data={this.state.curr.currGroup}
                  />
                </div>
              ) : (
                <div></div>
              )}
              {this.createPDF()}
            </Card>
          </Grid>
        </Grid>
      </div>
    );
  }
}
