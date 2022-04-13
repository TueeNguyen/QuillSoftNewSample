import "./styles.css";
import React from "react";
import {
  Paper,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Typography,
} from "@material-ui/core";
import clusters from "./clusters.json";
import TreeMapViewer from "./TreeMapViewer/TreeMapViewer";
import TimelineViewer from "./TimelineViewer/TimelineViewer";
import ParseXML from "./XMLViewer/ParseXML";
import data from "../../public/data.html";

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
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
    };
    this.callTimelineDots = this.callTimelineDots.bind(this);
    this.onUpdateHighText = this.onUpdateHighText.bind(this);
    this.getTitle = this.getTitle.bind(this);
    this.childParseXML = React.createRef();
  }

  onUpdateHighText(resp) {
    this.setState({ highText: resp });
  }

  getTitle(value) {
    this.setState({ title: value });
  }

  createPDF() {
    return (
      <ParseXML
        onUpdateHighText={this.onUpdateHighText}
        getTitle={this.getTitle}
        ref={this.childParseXML}
        highlight={this.state.highlight}
        mainhighlight={this.state.curr.currWord}
      />
    );
  }

  callTimelineDots(value) {
    console.log("callTimelineDots: ", value);
    this.setState({ highlight: value }, () => {
      this.childParseXML.current.findNoise();
    });
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
                this.setState(
                  {
                    curr: {
                      currWord: value,
                      currIndex: index,
                      currGroup: this.state.groups[index],
                      done: true,
                    },
                  },
                  () => {
                    this.childParseXML.current.highlightConcept();
                  }
                );
              }}
            ></Tab>
          ))}
        </Tabs>
      </Paper>
    );
  }

  _content() {
    const { curr } = this.state;
    if (curr.currWord != null) {
      return <></>;
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
      //console.log("C: ", key, "PROP: ", clusters[key]);
    });
    this.setState({ groups: temp, words: keys, done: true });
  }

  createTreeMap() {
    if (this.state.words != null) {
      var counters = [];
      this.state.words.map((val) => {
        // capitalized word
        // i.e. Flu -> flu
        var capVal = val.charAt(0).toUpperCase() + val.slice(1);

        var count = 0;
        count = data.split(val).length - 1;
        count += data.split(capVal).length - 1;
        counters.push(count);
      });
      console.log("COUNTERS:", counters);
      /*
      const data = { name: "Data", children: [] };
      var temp = { name: this.state.words[0], value: 100 };
      for (let i = 0; i < this.state.words.length; ++i) {
        data.children.push({
          name: this.state.words[i],
          value: Math.floor(Math.random() * 100)
        });
      }
      */
      return <TreeMapViewer />;
    } else {
      return null;
    }
  }

  findgroup(root) {
    var groups = [];
    for (let i = 0; i < this.state.words.length; ++i) {
      if (this.state.words[i] !== root && this.state.words[i].includes(root)) {
        groups.push(this.state.words[i]);
      }
    }
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
          <Grid item xs={4}>
            <Card>
              <CardContent>{this._tabs()}</CardContent>
              <CardContent>{this._content()}</CardContent>
              <CardContent>{this.createTreeMap()}</CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            {this.state.title !== null ? this.state.title : null}
            {this.state.highText !== null ? (
              <p style={{ padding: "1rem" }}>{this.state.highText}</p>
            ) : (
              <></>
            )}
            <Card className="card-style" style={{ overflow: "scroll" }}>
              {this.createPDF()}
            </Card>
          </Grid>
          <Grid item xs={2}>
            {this.state.curr.done ? (
              <div>
                <TimelineViewer
                  callTimelineDots={this.callTimelineDots}
                  data={this.state.curr.currGroup}
                />
              </div>
            ) : (
              <div></div>
            )}
          </Grid>
        </Grid>
      </div>
    );
  }
}
