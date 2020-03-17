import {Component} from "react";
import React from "react";


type Props = {
  caption?: string|null,
  title?: string|null,
  image?: boolean,
}

type State = {}

export default class Figure extends Component<Props, State> {

  // constructor(props: Props) {
  //   super(props);
  // }

  render() {
    let titleDiv = null;
    if (this.props.title !== null && this.props.title !== undefined) {
      titleDiv = <div className="figure-title">{this.props.title}</div>
    }

    let captionDiv = null;
    if (this.props.caption !== null && this.props.caption !== undefined) {
      captionDiv = <div className="figure-caption">{this.props.caption}</div>
    }

    let cname = 'figure-body';
    if (this.props.image) {
      cname = 'figure-body image';
    }

    return (
      <div className="figure-container">
        {titleDiv}
        <div className={cname}>{this.props.children}</div>
        {captionDiv}
      </div>
    )
  }
}