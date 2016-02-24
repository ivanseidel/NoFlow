var NoFlow = module.exports = require('./lib/NoFlow');

// Expose API
NoFlow.Graph = require('./lib/Graph');
NoFlow.Types = require('./lib/Types');
NoFlow.Packet = require('./lib/Packet');
NoFlow.Component = require('./lib/Component');

// Helpers
NoFlow.Bang = new NoFlow.Packet(null);
