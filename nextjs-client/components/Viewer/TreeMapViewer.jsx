import React from "react";
import TreeMap from "react-d3-treemap";
import "react-d3-treemap/dist/react.d3.treemap.css";
import DragScrollProvider from "drag-scroll-provider";
import { CardContent } from "@material-ui/core";

/**
 * Class: TreeMapViewer
 * - takes data structure information from FileProcesser and displays tree-map
 * - DragScrollProvider is a package that lets you scroll by dragging your mouse
 * - css for card-scroll is determining orientation of overflow, thus determine scroll functionalities
 */

export default class TreeMapViewer extends React.Component {
  render() {
    return (
      <DragScrollProvider>
        {({ onMouseDown, ref }) => (
          <CardContent
            className="card-scroll"
            ref={ref}
            onMouseDown={onMouseDown}>
              <div style={{ cursor: "grab" }}>
              <TreeMap
                height={500}
                width={600}
                data={this.props.mapper}
                valueUnit={"size"}
                tooltipClassName="treemap-tooltip-style"
                nodeStyle={{
                  cursor: "grab",
                  fontSize: 12,
                  paddingLeft: 10,
                  stroke: "transparent !important",
                  alignSelf: "center !important",
                  alignContent: "center !important"
                }}
                svgClassName="svg-style"
                disableBreadcrumb="false"
                darkNodeTextColor="rgba(255,255,255, 0.8)"
                lightNodeTextColor="rgba(0, 0, 0, 0.8)"
                />
              </div>
          </CardContent>
        )}
      </DragScrollProvider>
    );
  }
}
