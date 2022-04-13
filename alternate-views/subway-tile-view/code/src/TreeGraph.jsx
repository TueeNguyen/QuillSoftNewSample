import React from "react";
import Tree from "react-d3-tree";
import "./NodeViewer.css";

export default class TreeGraph extends React.Component {
  render() {
    return (
      <Tree
        rootNodeClassName="_node-root"
        branchNodeClassName="_node-branch"
        leafNodeClassName="_node-leaf"
        height={1000}
        width={1000}
        collapsible={true}
        separation={{ siblings: 0.5, nonSiblings: 0.5 }}
        data={this.props.value}
      />
    );
  }
}
