import { writable } from 'svelte/store';

export const customDefaultNodes = writable([]) // ARRAY OF CUSTOM OBJECTS

export function addProps(propNames,propValues,propObject) {
	for (let i = 0; i < propNames.length; i++) {
		if (propValues[i] !== undefined) propObject[propNames[i]] = propValues[i];
	}
}

export const nodePropNames = [
	'uid',
	'bgColor',
	'borderColor',
	'borderWidth',
	'fillColor',
	'label',
	'width',
	'height',
	'locked',
	'center',
	'inputs',
	'outputs',
	'rotation',
	'iconPosition',
	'zIndex',
	'TD',
	'LR',
	'editable',
	'customnode',
	'useDefaults'
];


export const nodePropDefault = {
	uid:'',
	bgColor:'#FFFFFF00',
	borderColor: '#FFFFFF00',
	borderWidth: '0',
	fillColor: 'grey',
	label:'',
	width:60,
	height:60,
	locked:false,
	center:false,
	inputs:1,
	outputs:1,
	rotation: 0,
	iconPosition: {x:0,y:0},
	zIndex:0,
	TD:false,
	LR: false,
	editable:false,
	customnode:null,
	useDefaults:false
}

export const anchorPropDefault = {
	input: false,
	output: false,
	dynamic: false,
	bgcolor: 'red',
	direction: 'west',
}

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

export const toArrayObjProps = (propObj) => {
	const propArray = []
	const keys = Object.keys(propObj)
	for (let i = 0; i < keys.length; i++)
		propArray.push(propObj[keys[i]])
	return propArray
}


