import React from "react";
import "./styles.css";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from "@material-ui/lab";

export default class TimelineViewer extends React.Component {
  render() {
    return (
      <Timeline align="right">
        {this.props.data.map((event) => (
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot
                color={"#fffeee"}
                className="timeline-dots"
                onClick={() => this.props.callTimelineDots(event)}
              />
              <TimelineConnector className="timeline-connector" />
            </TimelineSeparator>
            <TimelineContent>{event[0]}</TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    );
  }
}
