import React, { Component } from 'react';

import Colors from './style/Colors'
import util from './util'

class Dial extends Component {
  render() {
    var dialPathStyle = {
      fill: "none",
      strokeWidth: 2,
      stroke: Colors.blue
    };
    return (
       <path transform={"translate(" + this.props.x + "," + this.props.y + ")" +
                        "rotate(-90)"} d={util.describeArc(0, 0, 150, 0, 180)} style={dialPathStyle}/>
    );
  }
}

export default Dial;
