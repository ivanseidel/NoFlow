'use strict';
var _ = require('lodash');
var async = require('async');

var NoFlow = require('../');

class Graph {
	constructor(){
		this._nodes = {};
	}



	/**
	 * addProcess - Instantiates a component and adds to the Graph
	 *
	 * @param  {String} type Component name
	 * @param  {String} id	 Identifier to use in the Graph
	 * @return {Component}
	 */
	addProcess(component, id, settings){
		var Component = NoFlow.getComponent(component);

		if(!Component)
			throw new Error(`Component "${component}" could not be found`);

		// Validate name
		if(!id || id.length < 1)
			throw new Error(`Invalid id: "${id}"`);

		// Check if component is already registered
		if(this.getProcess(id))
			throw new Error(`Component with id "${id}" already registered`);

		// Instantiate and save component
		this._nodes[id] = new Component(this, id, settings);
	}


	/**
	 * getProcess - Finds a process by id in the graph and returns
	 *
	 * @param  {type} id description
	 * @return {type}    the instantiated component
	 */
	getProcess(id){
		if(id in this._nodes)
			return this._nodes[id];

		return null;
	}



	/**
	 * getPort - Given the type of the port (in|out) and address of the port:
	 * like: 'process.portName', returns that specified port if exists.
	 *
	 * @param  {String} type (in|out)
	 * @param  {String} adr  Address of the port, like: 'process.portName'
	 * @return {type}      	 The port if exists, or null
	 */
	getPort(type, adr){
		// Transforms the string into an array
		const stack = adr.split('.');

		// Get process
		var process = this.getProcess(stack[0]);

		if(!process)
			return null;

		// Find port in process
		return process.getPort(type, stack[1]);
	}



	/**
	 * connect - Does the real connection between two ports.
	 * Registers internally the binding in _flows
	 *
	 * @param  {String|Component} from From port
	 * @param  {String|Component} to   To port
	 * @return {Boolean}      				 Returns true if successfully connected
	 */
	connect(_from, _to){
		var from = _from;
		var to = _to;

		// find port object
		if(_.isString(from))
			from = this.getPort('out', from);

		if(_.isString(to))
			to = this.getPort('in', to);

		if(!from)
			throw new Error(`From port does not exist or wasn't set: ${_from}`);

		if(!to)
			throw new Error(`To port does not exist or wasn't set ${_to}`);

		// Binds both ports
		from.bind(to);
	}


	/**
	 * activate - Setups the Graph to begin processing. This triggers all
	 * processes to fire up it's sub-processes or load in async way.
	 *
	 * This method MUST be run before a `start` command.
	 *
	 * @param  {type} next       description
	 * @param  {type} maxParalel description
	 * @return {type}            description
	 */
	activate(next, maxParalel){
		this._callNodeFunctionsAsync('activate', next, maxParalel);
	}

	start(){
		for(var p in this._nodes)
			this._nodes[p].start();
	}

	deactivate(next, maxParalel){
		this._callNodeFunctionsAsync('deactivate', next, maxParalel);
	}

	_callNodeFunctionsAsync(method, next, maxParalel){
		// Default to maxParalel is 10
		maxParalel = maxParalel ? maxParalel : 10;

		// Stores the functions to activate processes
		var functions = [];

		// Iterate processes
		for(var p in this._nodes){
			var process = this._nodes[p];

			// Add to the queue
			var activateFn = process[method].bind(process);
			functions.push(activateFn);
		}

		// Calls function in all of them
		async.parallelLimit(functions, maxParalel, next);
	}

}


module.exports = Graph;
