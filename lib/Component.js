'use strict';

var _ = require('lodash');

var Port = require('./Port');

module.exports = class Component{

  constructor(graph, id, settings){
    this._id = id;
    this._active = false;
    this._context = graph;
    this.settings = settings;

    // Instantiate ports
    this._initPorts();
  }

  _initPorts(){
    if('_ports' in this)
      throw 'Ports already initialized. Cannot re-initialize';

    this._ports = {};

    // Initialize port types (in/out)
    const ports = this.constructor.ports();
    for(var type in ports){
      this._ports[type] = {};

      // Instantiate ports with given types
      for(var portName in ports[type]){
        var dataType = ports[type][portName];
        var port = new Port(this.getContext(), portName, dataType);

        // Save to _ports
        this._ports[type][portName] = port;
      }
    }
  }


  /**
   * set - Update this process settings
   *
   * @param  {type} settings Object with settings
   * @return {type}
   */
  set settings(settings){
    this._settings = settings || {};
  }

  /**
   * id - Get's this process id
   *
   * @return {type}  description
   */
  get id(){
    return this._id;
  }

  /**
   * getContext - Returns the Graph containing this component
   *
   * @return {Graph}
   */
  getContext(){
    return this._context;
  }


  /**
   * connect - Connects two ports and delegates the connection to the Graph
   *
   * @param  {String|Port} from Port from
   * @param  {String|Port} to   Port to
   * @return {Boolean}          Success
   */
  connect(from, to){
    // Fix relative target
    if(_.isString(from))
      from = this.getInPort(from) || from;

    // Fix relative target
    if(_.isString(to))
      to = this.getOutPort(to) || to;

    // Delegate connection to the Graph
    return this.getContext().connect(from, to);
  }


  /**
   * get - Returns if this component is active or not
   *
   * @return {type}  description
   */
  get active(){
    return this._active;
  }


  /**
   * activate - Enables this process
   *
   * In this moment, any process, library, file and async methods to prepare
   * this process should be started. Also, port bindings should occour here.
   *
   * Note: If timers or triggers must be sent, wait for the `run` callback.
   *
   * @param  {type} next description
   * @return {type}      description
   */
  activate(next){
    this._active = true;
    next && next();
  }


  /**
   * deactivate - Disables this process and unbind port events
   *
   * @param  {type} next description
   * @return {type}      description
   */
  deactivate(next){

    // Clear all events bind to input ports
    for(var k in this._ports.in)
      this._ports.in[k].removeAllListeners();

    // Set active flag as false
    this._active = false;
    next && next();
  }


  /**
   * start - This method get`s called by the Graph to begin it's activity with
   * the ports. Prior to this method, no guarantee is given that event's
   * will be propagated through the network
   *
   * @return {type}  Nothing
   */
  start(){

  }

  /**
   * getPort - Returns a port (in/out) from this component
   *
   * @param  {String} type Type of port (in/out)
   * @param  {String} port Name of the port
   * @return {Port}
   */
  getPort(type, port){
    if( !(type in this._ports))
      return null;

    return this._ports[type][port] || null;
  }


  /**
   * getInPort - Returns the given input port
   *
   * @param  {String} port Port to get
   * @return {Port}
   */
  getInPort(port){
    return this.getPort('in', port);
  }


  /**
   * getOutPort - Returns the given output port
   *
   * @param  {String} port Port to get
   * @return {Port}
   */
  getOutPort(port){
    return this.getPort('out', port);
  }


  /**
   * static - Get the ports defined by this component.
   *
   * @return {type}      Key/value pairs of Port types
   */
  static ports(){
    return {
      in: {},
      out: {},
    };
  }

};
