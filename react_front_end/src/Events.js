import React, { Component } from 'react';

import Colors from './style/Colors';

class Events extends Component {
  render() {
    var eventLineStyle = {
      stroke: Colors.pink,
      strokeWidth: 2
    };
    var i = 0;
    var historyLines = [];
    var item = null;
    for (i = 0; i < this.props.history.length; i++) {
      item = this.props.history[i];
      if (item !== null) {
        historyLines.push(
          <g key={this.props.key2 + "line" + i}>
            <line x1={i*10}
                  y1={-150}
                  x2={i*10}
                  y2={0}
                  style={eventLineStyle} />
            <g transform={"translate(" + i*10 + "," + 0 + ") rotate(45)"} >
              <line x1='0'
                    y1='0'
                    x2='100'
                    y2='0'
                    style={eventLineStyle}
                    key={this.props.key2 + "line" + i}/>
              <text x="25" y='-5'> {item.event_name} </text>
            </g>
          </g>
        );
      }
    }
    return (
      <g transform={"translate(" + this.props.x + "," + this.props.y + ")"}>
        <g transform="translate(-150, 0)">
        {historyLines}
        </g>
      </g>
    );
  }
}

export default Events;
