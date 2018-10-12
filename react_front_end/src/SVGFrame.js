import React, { Component } from 'react';
import models from './models';
import Needle from './Needle';
import Dial from './Dial';
import Chart from './Chart';
import Events from './Events';


class SVGFrame extends Component {

  constructor(props) {
    super(props);
    window.scope = this;
    this.scope = new models.ApplicationScope(this);
  }

  componentDidMount() {
     var intervalId = setInterval(this.scope.timer, 17);
     this.scope.setState({
       intervalId: intervalId,
       frameWidth: window.innerWidth,
       frameHeight: window.innerHeight
     });
     window.addEventListener('resize', this.scope.onResize);
     window.addEventListener('beforeunload', this.scope.onUnload);

     this.forceUpdate();
  }

  render() {
    var frameStyle = {
      backgroundColor: '#ffffff',
      cursor: 'auto'
    };

    return (
      <div className='SVGFrame'>
        <svg  id='frame' style={frameStyle}
              height={this.scope.frameHeight}
              width={this.scope.frameWidth}>

        <Needle x={this.scope.frameWidth/4}
                y={this.scope.frameHeight/4}
                rotation={this.scope.cpu.rotation} />
        <Dial x={this.scope.frameWidth/4}
              y={this.scope.frameHeight/4} />
        <Chart x={this.scope.frameWidth/4}
               y={this.scope.frameHeight/4 + 200}
               history={this.scope.cpu.history}
               history_pairs={this.scope.cpu.history_pairs}
               key2="cpu_chart"/>
        <Events x={this.scope.frameWidth/4}
               y={this.scope.frameHeight/4 + 200}
               history={this.scope.events.history}
               key2="cpu_chart_events"/>


        <Needle x={this.scope.frameWidth*3/4}
                y={this.scope.frameHeight/4}
                rotation={this.scope.mem.rotation} />
        <Dial x={this.scope.frameWidth*3/4}
              y={this.scope.frameHeight/4} />
        <Chart x={this.scope.frameWidth*3/4}
               y={this.scope.frameHeight/4 + 200}
               history={this.scope.mem.history}
               history_pairs={this.scope.mem.history_pairs}
               key2="mem_chart"/>
        <Events x={this.scope.frameWidth*3/4}
               y={this.scope.frameHeight/4 + 200}
               history={this.scope.events.history}
               key2="mem_chart_events"/>

        </svg>
      </div>
    );
  }
}

export default SVGFrame;
