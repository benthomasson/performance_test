var util = require('./util.js');
var fsm = require('./fsm.js');
var ReconnectingWebSocket = require('reconnectingwebsocket');
var history = require('history');
var dispatch_fsm = require('./dispatch.fsm.js')


function ApplicationScope (svgFrame) {

  //bind functions
  this.timer = this.timer.bind(this);
  this.onResize = this.onResize.bind(this);
  this.onUnload = this.onUnload.bind(this);
  this.updateScaledXY = this.updateScaledXY.bind(this);
  this.updatePanAndScale = this.updatePanAndScale.bind(this);
  this.send_control_message = this.send_control_message.bind(this);
  this.send_trace_message = this.send_trace_message.bind(this);
  this.parseUrl = this.parseUrl.bind(this);
  if (process.env.REACT_APP_REPLAY === 'true') {
    this.run_replay_events = this.run_replay_events.bind(this);
  }

  var self = this;

  //Initialize variables
  this.svgFrame = svgFrame;
  this.frameWidth = 0;
  this.frameHeight = 0;
  this.lastKey = '';
  this.frameNumber = 0;
  this.state = this;
  this.disconnected = process.env.REACT_APP_DISCONNECTED === 'true';
  this.websocket_host = process.env.REACT_APP_WEBSOCKET_HOST ? process.env.REACT_APP_WEBSOCKET_HOST : window.location.host;
  this.first_channel = null;
  this.browser_history = history.createHashHistory({hashType: "hashbang"});
  this.parseUrl();

  this.cpu = {rotation: 0, new_rotation: 0, history: [], history_pairs: []};
  this.mem = {rotation: 0, new_rotation: 0, history: [], history_pairs: []};
  this.events = {history: []}


  this.trace_order_seq = util.natural_numbers(0);


  //Connect websocket
  if (!this.disconnected) {
    console.log( "ws://" + this.websocket_host + "/ws/performance");
    this.control_socket_url = "ws://" + this.websocket_host + "/ws/performance"
    if (process.env.REACT_APP_REPLAY === 'true') {
      this.control_socket_url = this.control_socket_url + "&replay_id=" + this.replay_id;
    }
    this.control_socket = new ReconnectingWebSocket(
      this.control_socket_url,
      null,
      {debug: false, reconnectInterval: 300});
    this.control_socket.onmessage = function(message) {
      if (self.first_channel !== null) {
        self.first_channel.send("Message", message);
      }
      self.svgFrame.forceUpdate();
    };
  } else {
    this.control_socket = {send: util.noop};
  }

  this.dispatch_controller = new fsm.FSMController(this, 'dispatch_fsm', dispatch_fsm.Start, this);

  this.first_channel = new fsm.Channel(null,
                                       this.dispatch_controller,
                                       this);

}
exports.ApplicationScope = ApplicationScope;

ApplicationScope.prototype.parseUrl = function () {

};

ApplicationScope.prototype.send_trace_message = function (message) {
  console.log(message);
};

ApplicationScope.prototype.send_control_message = function (message) {
  console.log(message);
};

ApplicationScope.prototype.setState = function (o) {
  var keys = Object.keys(o);

  for (var i = 0; i < keys.length; i++) {
    this[keys[i]] = o[keys[i]];
  }
};

ApplicationScope.prototype.update_rotation = function (needle) {
  if (needle.rotation > needle.new_rotation) {
    needle.rotation -= 1;
    return true;
  }
  if (needle.rotation < needle.new_rotation) {
    needle.rotation += 1;
    return true;
  }
  return false;
};

ApplicationScope.prototype.timer = function () {
  this.setState({
    frameNumber: this.state.frameNumber + 1
  });
  var needs_update = false;
  needs_update = needs_update || this.update_rotation(this.cpu);
  needs_update = needs_update || this.update_rotation(this.mem);
  if (needs_update) {
    this.svgFrame.forceUpdate();
  }
};

ApplicationScope.prototype.onUnload = function (e) {

  this.first_channel.send('PageClose', {});
};

ApplicationScope.prototype.onResize = function (e) {
  if (process.env.REACT_APP_REPLAY === 'true') {
    if (this.replay) {
      return;
    }
  }
   this.setState({
     frameWidth: window.innerWidth,
     frameHeight: window.innerHeight
   });
  this.svgFrame.forceUpdate();
};

ApplicationScope.prototype.updateScaledXY = function() {
  this.scaledX = (this.mouseX - this.panX) / this.current_scale;
  this.scaledY = (this.mouseY - this.panY) / this.current_scale;
};

ApplicationScope.prototype.updatePanAndScale = function() {
  //var g = document.getElementById('frame_g');
  //g.setAttribute('transform','translate(' + this.panX + ',' + this.panY + ') scale(' + this.current_scale + ')');
};

