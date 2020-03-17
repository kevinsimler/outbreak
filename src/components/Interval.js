import {Component} from "react";

type Props = {
  milliseconds: number,
  callback: () => any,
}

type State = {
  // nothing
}

export default class Interval extends Component<Props, State> {
  // Set default props
  static defaultProps = {
    // nothing for now
  };

  interval: any;  // timer for animations

  constructor(props: Props) {
    super(props);

    this.initializeFromProps(this.props, true);
  }

  componentWillReceiveProps(nextProps: Props, nextContext: any): void {
    this.initializeFromProps(nextProps, false);
  }

  initializeFromProps(props: Props, fromConstructor: boolean) {
    let state = {
      // nothing yet
    };
    if (fromConstructor) {
      this.state = state;
    } else {
      this.setState(state);
    }

    if (this.interval !== null && this.interval !== undefined) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(props.callback, props.milliseconds);
  }

  render() {
    return null;
  }
}