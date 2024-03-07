import { writable } from 'svelte/store';

export const customDefaultNodes = writable([]) // ARRAY OF CUSTOM OBJECTS

export function addProps(propNames,propValues,propObject) {
	for (let i = 0; i < propNames.length; i++) {
		if (propValues[i] !== undefined) propObject[propNames[i]] = propValues[i];
	}
}

export const nodePropNames = [
	'bgColor',
	'borderColor',
	'label',
	'width',
	'height',
	'locked',
	'center',
	'inputs',
	'outputs',
	'rotation',
	'zIndex',
	'TD',
	'LR',
	'customnode',
	'useDefaults'
];


// Creates props and adds to customNodePropsStore if an anchor was created, defaultNodePropsStore if not
export const createNodeProps = (nodePropsArray,edgeProps,anchorProps) => {
	// Object that stores properties for the created node
	const nodeProps = {};
	
	// Add props to node if they exist
	addProps(nodePropNames, nodePropsArray, nodeProps);
	if (anchorProps) nodeProps.anchors = anchorProps;
	if (edgeProps) nodeProps.edgeProps = edgeProps;
	customDefaultNodes.update((nodes) => [...nodes, nodeProps]);
};