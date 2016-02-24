'use strict';

var NoFlow = require('../../index');

module.exports = class Logger extends NoFlow.Component {

  constructor(graph, id, settings){
    super(graph, id, settings)
  }


  activate(next){
    // Bind log port
    this.getInPort('log').on('data', this.log.bind(this));

    super.activate(next);
  }

  log(packet){
    console.log(`New message in ${this.id}:`, packet.data);
  }

  static ports(){
    return {
      'in': {
        'log': NoFlow.Types.Generic,
      },
    };
  }

}
