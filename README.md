# Box Flow
#### *A simple warpper for Flow Based Programming in Node.js*

*Note: This Library is under development. Although documentation is explained, some methods are not implemented yet.*

### Create a component:
```
var Component = {};

BoxComponent.prototype.inputs = [
	[BoxPort],
	[BoxPort]
];

BoxComponent.prototype.type = 'compoenent-name';
```

### Buld graph
```
var graph = new GraphComponent();

graph.addNode('node-id', 'component-name');

graph.getNode('node-id').getPort('out').connect(graph.getNode('other-node').getPort('in'));
```

### Serialized Graph
```
{
	nodes: [
		{
			active: true,
			id: 'unique-identifier',
			component: 'component-name',
			settings: {...},
		},

		{
			active: true,
			id: 'other-identifier',
			component: 'component-name',
			settings: {...},
		},

		{
			active: false,
			id: 'old-component',
			component: 'othertype',
			settings: {...},
		},

	],

	ports: [
		{
			from: 'unique-identifier.out',
			to: 'other-identifier.in',
		}
	],
}

```

### Load from file
```
var graph = Graph.fromJSON(json)
```

### Save to Json
```
var json = graph.toJSON();
```
