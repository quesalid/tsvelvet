import { writable } from 'svelte/store';

export const graphStore = writable({name:'defaultGraph',nodes:[]}) // GRAPH STORE REPRESENTATION
export const dragNode = writable('') // DRAGGING NODE


export function addProps(propNames,propValues,propObject) {
	for (let i = 0; i < propNames.length; i++) {
		if (propValues[i] !== undefined) propObject[propNames[i]] = propValues[i];
	}
}

export const nodePropNames = [
	'id',
	'uid',
	'anchors',
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
	'position',
	'zIndex',
	'TD',
	'LR',
	'editable',
	'customnode',
	'useDefaults'
];


export const nodePropDefault = {
	id:null,
	uid: '',
	anchors:[],
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
	position: {x:0,y:0},
	zIndex:0,
	TD:false,
	LR: false,
	editable:false,
	customnode:null,
	useDefaults:false
}

export const anchorPropDefault = {
	id:null,
	input: false,
	output: false,
	dynamic: false,
	bgcolor: 'red',
	direction: 'west',
	connections:[]
}

// Creates props and adds to customNodePropsStore if an anchor was created, defaultNodePropsStore if not
export const createNodeProps = (nodePropsArray,edgeProps,anchorProps) => {
	// Object that stores properties for the created node
	const nodeProps = {};
	
	// Add props to node if they exist
	addProps(nodePropNames, nodePropsArray, nodeProps);
	if (anchorProps) nodeProps.anchors = anchorProps;
	if (edgeProps) nodeProps.edgeProps = edgeProps;
	graphStore.update((graph) => { graph.nodes = [...graph.nodes, nodeProps]; return (graph) })
};

export const updateDragNode = (uid) => {
	dragNode.update((node) => { node = uid; return node })
}

export const toArrayObjProps = (propObj) => {
	const propArray = []
	const keys = Object.keys(propObj)
	for (let i = 0; i < keys.length; i++)
		propArray.push(propObj[keys[i]])
	return propArray
}

/**
 * Uploads file to local file system
 * @param {any} filestring file stream to upload
 * @param {any} filename default filename
 */
export const uploadFile = (filestring, filename) => {
	try {
		let textFileUrl = null;
		let fileData = new Blob([filestring], { type: 'text/plain' });
		if (textFileUrl !== null) {
			window.URL.revokeObjectURL(textFileUrl);
		}
		textFileUrl = window.URL.createObjectURL(fileData);
		var a = document.createElement("a");
		a.href = textFileUrl
		a.download = filename;
		a.click();
	} catch (error) {
		console.log(error)
	}
}

/**
 * Download json file from local file system
 * @param {any} file
 * @returns
 */
export const downloadJSON = (file) => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = event => resolve(event.target.result) // desired file content
		reader.onerror = error => reject(error)
		reader.readAsText(file)
	})
}




