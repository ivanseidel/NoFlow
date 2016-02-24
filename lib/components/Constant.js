'use strict';

var NoFlow = require('../../index');

module.exports = class Constant extends NoFlow.Component {

  constructor(graph, id, settings){
    super(graph, id, settings)
  }

  activate(next){
    // Output constant value on trigger
    this.getInPort('trigger').on('data', this.send.bind(this));

    super.activate(next);
  }

  start(){
    // Skip outputing on start if in silent mode
    if(this._settings.silent)
      return;

    this.send();
  }

  send(){
    // Send constant when started
    var constant = new NoFlow.Packet(this._settings.value);
    this.getOutPort('value').activate(constant);
  }

  static ports(){
    return {
      'in': {
        'trigger': NoFlow.Types.Bang,
      },
      'out': {
        'value': NoFlow.Types.Primitive,
      }
    };
  }

}
