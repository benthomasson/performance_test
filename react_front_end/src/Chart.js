import React, { Component } from 'react';

import Colors from './style/Colors';

class Chart extends Component {
  render() {

    console.log(this.props.key2);


    var chartCircleStyle = {
      stroke: Colors.blue,
      fill: Colors.blue,
      strokeWidth: 2
    };

    var chartLineStyle = {
      stroke: Colors.blue,
      strokeWidth: 2
    };

    var historyDots = [];
    var historyLines = [];
    var item = null;
    for (var i = 0; i < this.props.history_pairs.length; i++) {
      item = this.props.history_pairs[i];
      historyLines.push(<line x1={i*10}
                              y1={item[0] * -150}
                              x2={(i+1)*10}
                              y2={item[1] * -150}
                              style={chartLineStyle}
                              key={this.props.key2 + "line" + i}/>);
    }
    for (i = 0; i < this.props.history.length; i++) {
      item = this.props.history[i];
      historyDots.push(<circle cx={10*i} cy={-item * 150} r='2' style={chartCircleStyle} key={this.props.key2 + "dot" + i}/>)
    }
    return (
        <g transform={"translate(" + this.props.x + "," + this.props.y + ")"}>
        <g transform="translate(-150, 0)">
        <line x1="0"
              y1="0"
              x2="300"
              y2="0"
              style={chartLineStyle} />
        <line x1="0"
              y1="0"
              x2="0"
              y2="-150"
              style={chartLineStyle} />
        {historyLines}
        {historyDots}
        </g>
        </g>
    );
  }
}

export default Chart;
