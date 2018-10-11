var inherits = require('inherits');
var fsm = require('./fsm.js');

function _State () {
}
inherits(_State, fsm._State);


function _Ready () {
    this.name = 'Ready';
}
inherits(_Ready, _State);
var Ready = new _Ready();
exports.Ready = Ready;

function _Start () {
    this.name = 'Start';
}
inherits(_Start, _State);
var Start = new _Start();
exports.Start = Start;






_Start.prototype.start = function (controller) {

    controller.changeState(Ready);

};
_Start.prototype.start.transitions = ['Ready'];


_Ready.prototype.onMessage = function(controller, msg_type, message) {

    var type_data = JSON.parse(message.data);
    var type = type_data[0];
    var data = type_data[1];
    controller.handle_message(type, data);
};

_Ready.prototype.onCpuUsage = function(controller, msg_type, message) {
  console.log(message);
  var percent = message.cpu_percent / 100.0;
  controller.scope.cpu.new_rotation = Math.trunc(Math.max(Math.min(1.0, percent), 0.0) * 180);
  if (controller.scope.cpu.history.length > 0) {
      controller.scope.cpu.history_pairs.push([controller.scope.cpu.history.slice(-1)[0], percent]);
      controller.scope.cpu.history_pairs = controller.scope.cpu.history_pairs.slice(-30);
  }
  controller.scope.cpu.history.push(percent);
  controller.scope.cpu.history = controller.scope.cpu.history.slice(-31);
};

_Ready.prototype.onMemUsage = function(controller, msg_type, message) {
  console.log(message);
  var percent = message.mem_percent / 100.0;
  controller.scope.mem.new_rotation = Math.trunc(Math.max(Math.min(1.0, percent), 0.0) * 180);
  if (controller.scope.mem.history.length > 0) {
      controller.scope.mem.history_pairs.push([controller.scope.mem.history.slice(-1)[0], percent]);
      controller.scope.mem.history_pairs = controller.scope.mem.history_pairs.slice(-30);
  }
  controller.scope.mem.history.push(percent);
  controller.scope.mem.history = controller.scope.mem.history.slice(-31);
};
