import {Component} from "react";
import React from "react";


type Props = {
}

type State = {
}

export default class Button extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <div style={{border: '1px solid black', padding: 5}} onClick={() => {this.props.onClick();} } >
        {this.props.children}
      </div>
    )
  }
}