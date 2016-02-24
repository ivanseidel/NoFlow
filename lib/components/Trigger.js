'use strict';

var NoFlow = require('../../index');

module.exports = class Trigger extends NoFlow.Component {

  constructor(graph, id, settings){
    super(graph, id, settings)
  }

  start(){
    this.stop();

    // Starts interval
    this._interval = setInterval( () => {

      this.getOutPort('trigger').activate(NoFlow.Bang);

    }, this._settings.interval);
  }

  set settings(settings){
    super.settings = settings;

    if(this._interval)
      this.start();
  }

  stop(){
    clearInterval(this._interval);
    this._interval = null;
  }

  deactivate(next){
    this.stop();
    super.deactivate(next);
  }

  static ports(){
    return {
      'out': {
        'trigger': NoFlow.Types.Bang,
      },
    };
  }

}
