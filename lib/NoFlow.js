'use strict';

var NoFlow = module.exports = {
	// Stores all component instances by name
	_components: {},
};


/**
 * loadComponent - Adds the component to NoFlow and allows
 * use by it's name.
 *
 * @param  {Component} component
 */
NoFlow.loadComponent = function loadComponent(component) {
	// console.log('Registering component '+component.name);

	// Validates component is a function
	const inherits = component.prototype instanceof NoFlow.Component;
	if(!inherits)
		throw ('Component does not inherits from "Component": '+typeof component);

	// Validates component name
	var componentName = component.name;
	if(!componentName || componentName.length < 1)
		throw 'Invalid component name: '+componentName;

	// Check if component is not registered yet
	if(componentName in NoFlow._components)
		throw 'Failed to register. Component already registered:' + componentName;

	NoFlow._components[componentName] = component
}



/**
 * getComponent - Find component in NoFlow and returns if exists
 *
 * @param  {String} name Component name
 * @return {Component}   class of the component
 */
NoFlow.getComponent = function getComponent(name) {
	// Check if component exists
	if(name in NoFlow._components)
		return NoFlow._components[name];

	return null;
}
