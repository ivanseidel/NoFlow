'use strict';

var NoFlow = require('../index');

module.exports = class TestComponent extends NoFlow.Component {

  constructor(graph, id, settings){
    super(graph, id, settings)
  }

  activate(next){
    console.log('activating...');
    setTimeout(super.activate.bind(this, next), 2000);

    // Bind ports
    this.getInPort('input').on('data', this.logInput.bind(this));
  }

  start(){
    this._interval = setInterval( () => {
      var packet = new NoFlow.Packet('Hey from '+this.id);
      this.getOutPort('output').activate(packet);
    }, 500);
  }

  deactivate(next){
    clearInterval(this._interval);
    super.deactivate(next);
  }

  logInput(packet){
    console.log(`New data in ${this.id}: ${packet.data}`);
  }

  static ports(){
    return {
      'in': {
        'input': NoFlow.Types.Generic,
      },
      'out': {
        'output': NoFlow.Types.Generic,
      },
    };
  }

}
