import React from "react";
import TreeMap from "react-d3-treemap";
import "react-d3-treemap/dist/react.d3.treemap.css";
import { data } from "../../public/mapper.js";

export default class TreeMapViewer extends React.Component {
  render() {
    return (
      <div
        style={{ overflow: "scroll", cursor: "pointer" }}
        onClick={() => console.log("clicked")}
      >
        <TreeMap
          height={600}
          width={400}
          data={data}
          valueUnit={"occurences"}
        />
      </div>
    );
  }
}
