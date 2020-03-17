import {Component} from "react";
import React from "react";


type Props = {
  teaser: string,
}

type State = {
  expanded: boolean,
}

export default class Aside extends Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      expanded: false,
    }
  }

  render() {
    let toggle = () => {
      this.setState({
        expanded: !this.state.expanded,
      });
    };

    let contents = null;
    let extraClass = '';
    let toggleIcon = '+';
    if (this.state.expanded) {
      contents = <div className="aside-content">{this.props.children}</div>;
      extraClass = ' expanded';
      toggleIcon = '–'
    }

    return (
      <div className={"aside-container" + extraClass} onClick={toggle}>
        <div className="aside-teaser">[<span style={{fontFamily: 'monospace'}}>{toggleIcon}</span>] {this.props.teaser}</div>
        {contents}
      </div>
    )
  }
}