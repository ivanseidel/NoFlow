'use strict';

var exec = require('child_process').exec;
var child;

var NoFlow = require('../index');

module.exports = class PythonProc extends NoFlow.Component {

  constructor(graph, id, settings){
    super(graph, id, settings)
  }

  activate(next){

    this.getInPort('expression').on('data', this.calculate.bind(this));

    super.activate(next);
  }

  calculate(packet){
    // executes `pwd`
    let cmd = `node -e "console.log(${packet.data})"`;

    child = exec(cmd, (err, stout, sterr) => {

      if (err !== null)
        return console.error('Failed to execute script')

      // Forward result
      let packet = new NoFlow.Packet(parseInt(stout));
      this.getOutPort('result').activate(packet);
    });

  }


  static ports(){
    return {
      'in': {
        'expression': NoFlow.Types.Primitive,
      },
      'out': {
        'result': NoFlow.Types.Primitive,
      }
    };
  }

}
