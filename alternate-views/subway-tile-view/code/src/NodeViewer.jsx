import { Card } from "@material-ui/core";
import React from "react";
import TreeGraph from "./TreeGraph";

export default class NodeViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allmaps: [],
      done: false
    };
  }

  createTree(root, values) {
    var map = { name: root, children: [] };
    for (let i = 0; i < values.length; ++i) {
      values[i].map((val2) => {
        map.children.push({ name: val2 });
      });
    }
    return map;
  }

  componentDidMount() {
    this.mapConcepts();
  }

  componentDidUpdate(newProps) {
    if (newProps.concepts !== this.props.concepts) {
      this.mapConcepts();
    }
  }

  mapConcepts() {
    var mapper = [];
    for (var word in this.props.concepts) {
      mapper.push(this.createTree(word, this.props.concepts[word]));
    }

    var temp = [{ name: this.props.currWord, children: mapper }];
    this.setState({ allmaps: temp, done: true });
  }

  createAll() {
    if (this.state.done) {
      this.state.allmaps.forEach((value) => {
        console.log("V:", value);
        return <Card></Card>;
      });
    } else {
      return <div>None</div>;
    }
  }

  render() {
    //this.createAll();
    if (this.state.done) {
      return (
        <div style={{ width: "100vw", height: "100vh" }}>
          <TreeGraph value={this.state.allmaps[0]} />
        </div>
      );
    } else {
      return null;
    }
  }
}
