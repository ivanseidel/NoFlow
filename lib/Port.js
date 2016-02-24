'use strict';

const EventEmitter = require('events');

/**
 * Defines a generic Port, that can be either Input or Output
 *
 */
module.exports = class Port extends EventEmitter{

  constructor(process, id, type){
    if(!process || !id || !type)
      throw new Error('Cannot instantiate port without Process, Id and Type!');

    super();

    this._id = id;
    this._type = type;
    this._process = process;
    this._bindings = [];
  }


  /**
   * getId - Returns this object id
   *
   * @return {type}  description
   */
  get id(){
    return this._id;
  }


  /**
   * get - Returns the type of this port
   *
   * @return {type}  Type of this port
   */
  get type(){
    return this._type;
  }


  /**
   * getProcess - Returns the process this port belongs to
   *
   * @return {Component}  The process
   */
  getProcess(){
    return this._process;
  }


  /**
   * connect - Connects this Port to another in the same graph
   *
   * @param  {String|Component} to  To port
   * @return {Boolean}              true if succeeded
   */
  connect(to){
    return this.getProcess().connect(this, to);
  }


  /**
   * bind - Binds the output of this port to an activate function of another
   *
   * @param  {Port} to The destination port
   * @return {type}
   */
  bind(to){
    if(!to || !(to instanceof EventEmitter))
      throw 'Target port is not a valid EventEmitter|Port';

    if(this._bindings.indexOf(to) >= 0)
      throw 'Port already bound to target port';

    if(!to.type.accepts(this.type))
      throw new Error(`Type ${typeof this.type} cant send to ${typeof to.type}`);

    // Adds the target port to this
    this._bindings.push(to);
  }


  /**
   * activate - Causes the packet to activate
   *
   * @param  {Packet} packet Data packet to send
   * @return {Boolean}       Returns if went ok
   */
  activate(packet){
    for(var i in this._bindings){
      // Emits 'data' event to in port
      this._bindings[i].emit('data', packet);
    }
  }
}
