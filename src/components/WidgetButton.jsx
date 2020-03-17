import React from "react";
import Button from "@material-ui/core/Button";
import {withStyles} from "@material-ui/core";


type Props = {
  highlighted?: boolean,
  onClick: Function,
  size?: string,
}

const StyledButton = withStyles({
  root: {
    background: 'linear-gradient(0deg, #f0f0f0 30%, #f8f8f8 90%)',
    // borderRadius: 3,
    // border: 0,
    // color: 'white',
    // height: 48,
    // padding: '0 30px',
    // boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  },
  label: {
    textTransform: 'capitalize',
  },
})(Button);

const HighlightedButton = withStyles({
  root: {
    background: 'linear-gradient(0deg, #ccddff 30%, #ddeeff 90%)',
    // borderRadius: 3,
    // border: 0,
    // color: 'white',
    // height: 48,
    // padding: '0 30px',
    // boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  },
  label: {
    textTransform: 'capitalize',
  },
})(StyledButton);

export default class WidgetButton extends React.PureComponent<Props> {
  render() {
    let sty = {
      margin: '0.5rem',
    };
    if (this.props.size === "small") {
      sty = {
        margin: '0.5rem',
        maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px'
      };
    }

    if (this.props.highlighted) {
      return (
        <HighlightedButton variant="contained"
                      onClick={(e) => { e.preventDefault(); this.props.onClick(e); } }
                      style={sty}>
          {this.props.children}
        </HighlightedButton>
      )
    } else {
      return (
        <StyledButton variant="contained"
                      onClick={(e) => { e.preventDefault(); this.props.onClick(e); } }
                      style={sty}>
          {this.props.children}
        </StyledButton>
      )
    }
  }
}