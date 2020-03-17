import React, {Component} from "react";
import Constants from "./Constants";


export default class NodeLegend extends Component<{type: string}> {
  render() {
    let color = Constants.SUSCEPTIBLE_COLOR;
    if (this.props.type === 'exposed') {
      color = Constants.EXPOSED_COLOR;
    } else if (this.props.type === 'infected') {
      color = Constants.INFECTED_COLOR;
    } else if (this.props.type === 'removed') {
      color = Constants.REMOVED_COLOR;
    } else if (this.props.type === 'dead') {
      color = Constants.DEAD_COLOR;
    }
    return <div style={{marginBottom: "-2px", border: "1px black solid", width: "1rem", height: "1rem", backgroundColor: color, display: "inline-block"}}/>;
  }
}