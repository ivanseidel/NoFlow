'use strict';

class Packet {
  constructor(data){
    this._data = data;
  }

  get data(){
    return this._data;
  }

}

module.exports = Packet;
