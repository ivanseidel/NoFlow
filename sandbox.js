'use strict';

var NoFlow = require('./index');

//
// Load components
//
NoFlow.loadComponent(require('./lib/components/Constant'));
NoFlow.loadComponent(require('./lib/components/Trigger'));
NoFlow.loadComponent(require('./lib/components/Logger'));
NoFlow.loadComponent(require('./test/TestComponent'));
NoFlow.loadComponent(require('./test/PythonProc'));


//
// Builds graph
//
// This graph:
// + Triggers every 100, then
// + Outputs a constant value, then
// + runs a process to get current time, then
// + Logs the result
//
var graph = new NoFlow.Graph();

graph.addProcess('Trigger', 'clock', {interval: 10});
graph.addProcess('Constant', 'expression', {value: '312 * 213', silent: true});
graph.addProcess('PythonProc', 'math');
graph.addProcess('Logger', 'logger');

// graph.connect('clock.trigger', 'expression.trigger');
graph.connect('clock.trigger', 'expression.trigger');
graph.connect('expression.value', 'logger.log');


//
// Start graph
//
graph.activate( () => graph.start() );