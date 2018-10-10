import React, { Component } from 'react';

import Colors from './style/Colors';

class Needle extends Component {
  render() {
    var needleCircleStyle = {
      stroke: Colors.pink,
      strokeWidth: 2,
      fill: Colors.darkPink
    };
    var needleLineStyle = {
      stroke: Colors.pink,
      strokeWidth: 2
    };
    return (
        <g transform={"translate(" + this.props.x + "," +  this.props.y + ") rotate(" + this.props.rotation + ")"}>
        <circle cx="0" cy="0" r="20" style={needleCircleStyle} />
        <line x1="0"
              y1="0"
              x2="-120"
              y2="0"
              style={needleLineStyle} />
        </g>
    );
  }
}

export default Needle;
