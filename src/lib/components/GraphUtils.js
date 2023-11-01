// BAYES NETWORKS
// https://github.com/bayesjs/bayesjs#readme
// MIXTURE DISTRIBUTIONS
// https://www.cs.toronto.edu/~rgrosse/csc321/mixture_models.pdfS
// a. define gaussian mean and variance for each latent variable
// b. define mixture distribution for observed variable (weigheted sum of gaussians)
// c. define interval for mixture distribution
// d. compute probability for each interval
// NEURAL NETWORKS
// https://github.com/martinjm97/ENNUI
// http://www.cs.toronto.edu/~rgrosse/csc321/calendar.html
import { v4 as uuidv4 } from 'uuid';
import { inferAll } from 'bayesjs';


/**
 * Add node to graph
 * @param {any} e event
 * @param {any} node nodeprops to attach 
 * @param {any} svwidth x coord for initial position
 * @param {any} svhwight y coord for initial position
 * @returns nodeprops: array of node proprties
 */
export const utilAddNode = (e, node, svwidth = 100, svhwight = 100) => {
	// Object that stores properties for the created node
	const nodeProps = {};
	let x
    let y
    let event = true

    if (!e || !e.target)
        event = false
	
	// MOVE MOUSE
	if (node.position &&
		node.position.x)
		x = node.position.x
    else 
       if(event)
		x = e.clientX + svwidth / 2
		

	if (node.position && node.position.y)
		y = node.position.y
    else
        if (event) {
		    y = e.clientY + svhwight / 2
		    node.position = { x: x, y:y}
        }
    if(event)
	    e.preventDefault();

    const moveEvent = new MouseEvent('mousemove', {
		clientX: x,
		clientY: y,
		bubbles: true
	});
    if(event)
        e.target.dispatchEvent(moveEvent);
    else
        e.dispatchEvent(moveEvent);
	
	// SET uid for new node
	if (!node.id) 
		nodeProps['id'] = uuidv4()
	else
		nodeProps['id'] = node.id

	// Add props to node if they exist
	addProp2(node, nodeProps);
	return(nodeProps)

}


const addProp2 = (node, nodeProps, all = false) => {
	const keys = Object.keys(node)
	for (let i = 0; i < keys.length; i++) {
        if (node[keys[i]]) {
            nodeProps[keys[i]] = node[keys[i]];
        }
	}
};

/**
 * add anchor to node
 * @param {any} node node for anchors
 * @param {any} edges edges for node
 * @param {any} anchorPre prefix for anchor id
 * @returns array of anchors properties
 */
export const utilAddAnchor = (node,edges=[],anchorPre='') => {
	const ancs = []
	let propsArray = {}
	let ins = 1
	let outs = 1

	if (node.inputs)
		ins = node.inputs
	if (node.outputs)
		outs = node.outputs
	
    for (let i = 0; i < ins; i++) {
        const propsArray = {}
		const connections = []
		propsArray['input'] = true
		propsArray['dynamic'] = true
		propsArray['bgColor'] = 'blue'
        propsArray['id'] = 'INPUT' + anchorPre + '-' + i + '-' + node.id
        const destinations = edges.filter((item) => item.destination == ('N-' + node.id))
        if (destinations) {
            for (let i = 0; i < destinations.length; i++) {
                const dest = destinations[i]
                const connection = []
                connection.push(dest.source.substring(2))
                connection.push(dest.sourceanchor.substring(2))
                connections.push(connection)
            }
            propsArray['connections'] = connections
        }
		ancs.push(propsArray)
    }
   
	for (let i = 0; i < outs; i++) {
		const propsArray = {}
		propsArray['output'] = true
		propsArray['dynamic'] = true
		propsArray['bgColor'] = '#ff8c00'
        propsArray['id'] = 'OUTPUT-' + i + '-' + node.id
		ancs.push(propsArray)
	}
	return ancs
}

/**
 * Drag element 
 * @param {any} element
 * @param {any} dragzone
 */
export const dragElement = (element, dragzone) => {
	let pos1 = 0,
		pos2 = 0,
		pos3 = 0,
		pos4 = 0;

	const dragMouseUp = () => {
		document.onmouseup = null;
		document.onmousemove = null;

		element.classList.remove("drag");
	};

	const dragMouseMove = (event) => {
		event.preventDefault();

			pos1 = pos3 - event.clientX;
			pos3 = event.clientX;
		
		
			pos2 = pos4 - event.clientY;
			pos4 = event.clientY;
			

		element.style.top = `${element.offsetTop - pos2}px`;
		element.style.left = `${element.offsetLeft - pos1}px`;
	};

	const dragMouseDown = (event) => {
		//event.preventDefault();

		pos3 = event.clientX;
		pos4 = event.clientY;

		element.classList.add("drag");

		document.onmouseup = dragMouseUp;
		document.onmousemove = dragMouseMove;
	};

	dragzone.onmousedown = dragMouseDown;
};

/**
 * GRAPH DATA STRUCTURE
 * graph = {
 *      nodes: [ 
 *              {id:id,nodetype:nodetype,data:[]}}
 *              ]
 *      edges: [ 
 *              {id:id,source:source,sourceanchor:sourceanchor,destination:destination,destanchor:destanchor,path:path}
 *              ]
 *     }
 * 
 * TREE DATA STRUCTURE
 * tree = {
 *          key:id,
 *          value:data,
 *          children:[tree,tree,tree],
 *          parent:tree,
 *          edges:[edge,edge,edge],
 *          graph:[]
 *      }
 **/

const filterProps = [
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
    'useDefaults',
    'position',
    'nodetype',
    'graphtype',
];

const addData = (key, filter) => {
    const index = filter.findIndex((item) => item == key)
    if (index >= 0)
        return (true)
    return false
}

const getChildrens = (graph, id) => {
    let childrens = []
    const locid = 'N-' + id // Prepend N- to id  
    for (let i = 0; i < graph.edges.length; i++) {
        if (graph.edges[i].source === locid) {
            const found = graph.nodes.find(element => element.id === graph.edges[i].destination.substring(2))
            if (found)
                childrens.push(found)
        }
    }

    return childrens
}

/**
 * Get parents of node
 * @param {any} graph 
 * @param {any} id node id
 * @returns array of node parents
 */
export const getParents = (graph, id) => {
    let parents = []
    for (let i = 0; i < graph.edges.length; i++) {
        if (graph.edges[i].destination === ('N-' + id)) {
            const found = graph.nodes.find(element => element.id === graph.edges[i].source.substring(2))
            if(found)
                parents.push(found)
        }
    }
    return parents
}

const getEdges = (graph, id) => {
    let edges = []
    for (let i = 0; i < graph.edges.length; i++) {
        if (graph.edges[i].source.substring(2) === id) {
            edges.push(graph.edges[i])
        }
    }
    return (edges)
}

const getDataObject = (origin) => {
    let data = {}
    console.log(origin)
    if (!data['params'])
        data['params'] = {}
    data['params']['name'] = origin.label
    for (let i = 0; i < origin.data.length; i++) {

        switch (origin.data[i].key) {
            case 'level':
                data['level'] = origin.data[i].value
                break
            default:
                if (!data['params'])
                    data['params'] = {}
                if (origin.data[i].key && origin.data[i].key != 'name')
                    data['params'][origin.data[i].key] = origin.data[i].value
                break
        }
    }
    return data
}

/**
 * Get tree from graph
 * @param {any} graph graph structure
 * @param {any} node subtree root node
 * @param {any} parent subtree parent - null if node is tree root
 * @returns tree
 */
export const getTreeFromGraph = (graph, node, parent) => {
    let nodes = getChildrens(graph, node.id)
    let edges = getEdges(graph, node.id)

    // MUST ENSURE UNIQUE DATA ID 
    let tree = {
        children: [],
        key: node.id,
        parent: parent,
        value: {
            data: getDataObject(node)
        },
        edges: edges,
        graph: []
    }
    const keys = Object.keys(node)
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        const value = node[key]
        const prop = { key: key, value: value }
        if (addData(key, filterProps)) {
            tree.graph.push(prop)
        }
    }
    for (let i = 0; i < nodes.length; i++) {
        // For strange reason this check is needed to avoid bad recursion from getChildrens
        if (nodes[i].id) {
            const parent = node.id
            const subtree = getTreeFromGraph(graph, nodes[i], parent)
            tree.children.push(subtree)
        }
    }
    return (tree)
}

/**
 * Get graph from tree
 * @param {any} tree tree
 * @returns graph
 */
export const getGraphFromTree = (tree) => {
    let graph = {
        nodes: [],
        edges: []
    }
    const root = tree
    const rootnode = {
        id: root.key,
        data: getDataFromTree(root.value.data)
    }
    for (let i = 0; i < tree.graph.length; i++) {
        const prop = tree.graph[i]
        rootnode[prop.key] = prop.value
    }
    graph.nodes.push(rootnode)
    const edges = root.edges
    if (edges) {
        for (let i = 0; i < edges.length; i++) {
            const edge = {
                id: edges[i].id,
                source: edges[i].source,
                sourceanchor: edges[i].sourceanchor,
                destination: edges[i].destination,
                destanchor: edges[i].destanchor,
                path: edges[i].path
            }
            graph.edges.push(edge)
        }
    }
    const children = root.children
    for (let i = 0; i < children.length; i++) {
        const subtree = getGraphFromTree(children[i])
        graph.nodes = graph.nodes.concat(subtree.nodes)
        graph.edges = graph.edges.concat(subtree.edges)
    }
    return (graph)
}

const getDataFromTree = (data) => {
    const keys = Object.keys(data)
    let dataarray = []
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        if (key != 'params') {
            const value = data[key]
            const prop = { key: key, value: value, type: 'text' }
            dataarray.push(prop)
        } else {
            const keys2 = Object.keys(data[key])
            for (let j = 0; j < keys2.length; j++) {
                const key2 = keys2[j]
                const value2 = data[key][key2]
                const prop = { key: key2, value: value2, type: 'text' }
                dataarray.push(prop)
            }
        }
    }
    return dataarray
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

export const createLoadObserver = (handler) => {
    let waiting = 0

    const onload = (el) => {
        waiting++
        el.addEventListener('load',  () => {
            waiting--
            if (waiting === 0) {
               handler()
            }
        })
    }

    return onload
}

/**
 * Load initial data structure for different node types
 * @param {any} type node type
 * @returns data structure
 */
export const loadData = (type) => {
    let data = []
    switch (type) {
        case 'BAYES':
            const bayes = {
                status: [], distribution: [], type: STATETYPE.INTERVAL, params: {} }
            data.push(bayes)
            break
        default:
            break
    }
    return data
}

/**
 * Get initial distribution for bayes node
 * @param {any} node graph node
 * @param {any} parents node parents
 * @returns distribution
 */
export const getInitialDistribution = (node, graph) => {
    // 1. node contains states and distribution
    // 2. parents states are used to create conditional distribution
    // 3. conditional distribution is a matrix of states for each parent
    const distribution = []
    const parents = getParents(graph, node.id)
    const index = node.data.findIndex((item) => item.status)
    if (index > -1) {
        const states = node.data[index].status
        const statusArray = buildStatusArray(node,parents)
        const cases = allPossibleCases(statusArray)
        for (let i = 0; i < cases.length; i++) {
            //const dist = { cond: cases[i], prob: 1 / states.length }
            const dist = { cond: cases[i], prob: 1 / states.length, mean: 0.0, variance: 1.0, weight: 1 / states.length }
            if (statusArray.length == 1)
                dist['cond'] = [cases[i]]
            distribution.push(dist)
        }
    }
    return distribution
}



const getDistChange = (dist,olddist,d,od) => {

    for (let i = 0; i < olddist.cond.length; i++) {
        const index = dist.cond.findIndex((item) => item.variable == olddist.cond[i].variable)
        if (index == -1)
            return ("NODEREMOVED")
    }
    for (let i = 0; i < dist.cond.length; i++) {
        const index = olddist.cond.findIndex((item) => item.variable == dist.cond[i].variable)
        if (index == -1)
            return ("NODEADDED")
    }
    if (od.length > d.length)
        return ("STATUSREMOVED")

    if (od.length < d.length)
        return ("STATUSADDED")

    return("NOCHANGE")

}

/**
 * Set Graph distribution on graph change
 * @param {any} graph graph
 * @param {any} equiprob if true set equiprobability for all nodes
 */
export const setGraphInitialDistribution = (graph, equiprob = false) => {
    for (let i = 0; i < graph.nodes.length; i++) {
        const node = graph.nodes[i] 
        const index = node.data.findIndex((item) => item.distribution)
        if (index > -1) {
            //if (node.nodetype == 'BAYES') {
            const dist = getInitialDistribution(node, graph)
            // HERE CHECK IF DISTRIBUTION IS ALREADY SET
            if (node.data[index].distribution.length == 0)
                node.data[index].distribution = dist
            else {
                for (let j = 0; j < dist.length; j++) {
                    const ds = dist[j]
                    for (let k = 0; k < node.data[index].distribution.length; k++) {
                        const ods = node.data[index].distribution[k]
                        switch (getDistChange(ds, ods, dist, node.data[index].distribution)) {
                            case "NODEADDED":
                                // If node added set eqprob to distribution
                                node.data[index].distribution = dist
                                //console.log("NODE ADDED",node.label,dist)
                                break
                            case "NODEREMOVED":
                                // If node removed set eqprob to distribution
                                node.data[index].distribution = dist
                                //console.log("NODE REMOVED", node.label, dist)
                                break
                            case "STATUSADDED":
                                node.data[index].distribution = dist
                                //console.log("STATUS ADDED", node.label, dist)
                                break
                            case "STATUSREMOVED":
                                node.data[index].distribution = dist
                                //console.log("STATUS  REMOVED", node.label, dist)
                                break
                            default:
                                //console.log("NO CHANGE")
                                break
                        }
                    }
                }
            }
        }
    }  
}


/**
 * Return distribution array in format for table
 * @param {any} node node
 * @param {any} index bayes data index
 * @returns fromatted distribution array
 */
export const getArrayFromDistribution = (node, index, type='DISCRETE') => {
    let retArray = { header: [], distarray: [] }
    let distribution = node.data[index].distribution
    let variable = node.label
    let states = node.data[index].status
    let header = []
    let distArray = []
    // GET HEADER
    header = getRetArrayHeader(distribution, states, variable)
    // GET DISTRIBUTION
    switch (type) {
        case 'CONTINUOUS':
            distArray = getRetArrayDistCont(distribution, states, variable)
            break;
        case 'WEIGHT':
            distArray = getRetArrayWeight(distribution, states, variable)
            break;
        default:
            distArray = getRetArrayDist(distribution, states, variable)
            break
    }
    

    retArray.distarray = distArray
    retArray.header = header
    return retArray
   
}

export const getMeansVariancesWeight = (node, index) => {
    let distribution = node.data[index].distribution
    let means = []
    let variances = []
    let weights = []
    for (let i = 0; i < distribution.length; i++) {
        const dist = distribution[i]
        if(dist.mean!=undefined)
            means.push(dist.mean)
        if (dist.variance!=undefined)
            variances.push(dist.variance)
        if (dist.weight!=undefined)
            weights.push(dist.weight)
    }
    return { means: means, variances: variances, weights: weights}
}


const getRetArrayHeader = (distribution, states, variable) => {
    const header = []
    for (let i = distribution.length - 1; i >= 0; i--) {
        const cond = distribution[i].cond
        for (let j = cond.length-1; j >=0; j--) {
            let item = cond[j].variable
            const index = header.findIndex((itm) => itm == item)
            if (index == -1 && item != variable)
                header.push(item)
        }
    }
    for (let i = distribution.length - 1; i >= 0; i--) {
        const cond = distribution[i].cond
        for (let j = 0; j < cond.length; j++) {
            let item = cond[j].variable
            if (item == variable) {
                item = item + '=' + cond[j].states.name
            }
            const index = header.findIndex((itm) => itm == item)
            if (index == -1)
                header.push(item)
        }
    }
    return(header)
}

const getRetArrayDist = (distribution, states, variable) => {
    const dist = []
    const probs = []
    for (let i = distribution.length - 1; i >= 0; i--) {
        const row = []
        const cond = distribution[i].cond
        for (let j = cond.length - 1; j >= 0; j--) {
            if(cond[j].variable != variable)
                row.push(cond[j].states.name)
        }
        probs.push(distribution[i].prob)
        if (i % states.length == 0) {
            const carray = row.concat(probs)
            dist.push({ array:carray,idx:i})
            probs.length = 0
        }
    }
    return dist
}

const getRetArrayWeight = (distribution, states, variable) => {
    const dist = []
    const probs = []
    for (let i = distribution.length - 1; i >= 0; i--) {
        const row = []
        const cond = distribution[i].cond
        for (let j = cond.length - 1; j >= 0; j--) {
            if (cond[j].variable != variable)
                row.push(cond[j].states.name)
        }
        probs.push(distribution[i].weight)
        if (i % states.length == 0) {
            const carray = row.concat(probs)
            dist.push({ array: carray, idx: i })
            probs.length = 0
        }
    }
    return dist
}

const getRetArrayDistCont = (distribution, states, variable) => {
    const dist = []
    const probs = []
    for (let i = distribution.length - 1; i >= 0; i--) {
        const row = []
        const cond = distribution[i].cond
        for (let j = cond.length - 1; j >= 0; j--) {
            if (cond[j].variable != variable)
                row.push({ state: cond[j].states.name })
        }
        let mean = 0.0
        let variance = 1.0
        let weight = 1.0
        if (distribution[i].mean)
            mean = distribution[i].mean
        if (distribution[i].variance)
            variance = distribution[i].variance
        if (distribution[i].weight)
            weight = distribution[i].weight
        probs.push({ mean: mean, variance: variance, weight:weight })
        if (i % states.length == 0) {
            const carray = row.concat(probs)
            dist.push({ array: carray, idx: i })
            probs.length = 0
        }
    }
    return dist
}

const allPossibleCases = (statusArray) => {
    if (statusArray.length === 0) {
        return [];
    }
    else if (statusArray.length === 1) {
        return statusArray[0];
    }
    else {
        var result = [];
        var allCasesOfRest = allPossibleCases(statusArray.slice(1));  // recur with the rest of array
        for (var c in allCasesOfRest) {
            let resObjs = []
            for (var i = 0; i < statusArray[0].length; i++) {
                resObjs.push(statusArray[0][i])
                resObjs = resObjs.concat(allCasesOfRest[c])
                result.push(resObjs)
                resObjs = []
            }
        }
        return result;
    }
}

const buildStatusArray = (node, parents) => {
    const statusArray = []
    const index = node.data.findIndex((item) => item.status)
    if (index > -1) {
        const states = node.data[index].status
        const starray = []
        for (let i = 0; i < states.length; i++) {
            const status = { variable: node.label, states: states[i] }
            starray.push(status)
        }
        statusArray.push(starray)
    }
    for (let i = 0; i < parents.length; i++) {
        const parent = parents[i]
        const index = parent.data.findIndex((item) => item.status)
        if (index > -1) {
            const states = parent.data[index].status
            const starray = []
            for(let i=0; i < states.length; i++) {
                const status = { variable: parent.label, states: states[i] }
                starray.push(status)
            }
            statusArray.push(starray)
        }
    }
    return statusArray
}

/**
 * Gets marginal distribution for "status" state of node random variable
 * @param {any} graph graph object
 * @param {any} node node random variable
 * @param {any} status status of random variable
 * @param {any} given given status for other random variables
 * @returns distribution
 */
export const getStatusDistribution = (graph, node, status, given = {}) => {
    // UPDATE DISTRIBUTION
    setGraphInitialDistribution(graph)
    const bjgraph = getBayesjsStructure(graph)
    const results = inferAll(bjgraph,given, { force: true })
    let distval = 0.0
    if(results[node.label])
        distval = results[node.label][status]
    return (distval)
}

/**
 * Returns bayes structure for bayesjs
 * @param {any} graph graph object
 * @returns bayes structure
 */
export const getBayesjsStructure = (graph) => {
    const network = {}
    /**
     {
        id: 'Node ID',
        states: ['State1', 'State2', ...,'StateN'],
        parents: ['Parent1','Parent2','ParentN'],
        cpt: {
        when: { 'Parent1': 'StatusP1', 'Parent2': 'StatusP2' },
        then: { State1: 0.5, State2: 0.5,...,StateN:0.0 },
      }
    }
    */
    const nodes = graph.nodes
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        const index = node.data.findIndex((item) => item.status)
        const bjsnode = {}
        bjsnode.id = node.label
        bjsnode.states =[]
        for (let i = 0; i < node.data[index].status.length; i++)
            bjsnode.states.push(node.data[index].status[i].name)
        bjsnode.parents = []
        bjsnode.cpt = []
        // Get parent from dist
        const dist = node.data[index].distribution
        for (let j = 0; j < dist.length; j++) {
            const cond = dist[j].cond
            for (let k = 0; k < cond.length; k++) {
                const found = bjsnode.parents.find((item)=> item == cond[k].variable)
                if (k > 0 && !found)
                    bjsnode.parents.push(cond[k].variable)
                    
            }

        }
        bjsnode.cpt = getCPT(dist, node.data[index].status.length)
        network[bjsnode.id] = bjsnode
    }
    return(network)
}

const getCPT = (dist,slength) => {
    let cpt
    if (dist.length == slength) {
        cpt = {}
        for (let i = 0; i < dist.length; i++) {
            cpt[dist[i].cond[0].states.name] = dist[i].prob
        }
    } else {
        cpt = []
        let whenobj = {}
        let thenobj = {}
        for (let i = 0; i < dist.length; i++) {
            const cond = dist[i].cond
            const states = cond[0].states
            const k = i % slength
            for (let j = 1; j < cond.length; j++) {
                whenobj[cond[j].variable] = cond[j].states.name
                thenobj[states.name] = dist[i].prob
                if (k == (slength - 1) && j == (cond.length-1)) {
                    const storethen = JSON.parse(JSON.stringify(thenobj))
                    const storewhen = JSON.parse(JSON.stringify(whenobj))
                    cpt.push({ when: whenobj, then: storethen })
                    thenobj = {}
                    whenobj = {}
                }
            }
        }
    }
    return cpt
}

/**
 * Returns default node propertires
 * @param {any} typeOptions options for context menu panel
 * @param {any} options other options
 * @returns node default properties
 */
export let getDefaultProperties = (typeOptions, options) => {
    let svwidth = 1000
    let svheight = 600
    let datacomp = 'ISA'
    if (options.svwidth)
        svwidth = options.svwidth
    if (options.svheight)
        svheight = options.svheight
    if (options.datacomp)
        datacomp = options.datacomp
    let borderColor
    let bgColor
    let label = "VAR"
    let width = 230;
    let height = 90;
    let inputs = 1
    let outputs = 1
    let locked
    let center
    let rotation
    let zIndex
    let TD
    let LR
    let useDefaults
    let uid = ''
    let position = { x: svwidth / 2, y: svheight / 2 }
    let nodetype = typeOptions[0] ? typeOptions[0].value:"COMPANY"
    

    const nodePropsVals = {
        bgColor: bgColor,
        borderColor: borderColor,
        label: label,
        width: width,
        height: height,
        locked: locked,
        center: center,
        inputs: inputs,
        outputs: outputs,
        rotation: rotation,
        zIndex: zIndex,
        TD: TD,
        LR: LR,
        useDefaults: useDefaults,
        id: uid,
        position: position,
        nodetype: nodetype,
        data: loadData(datacomp),
        graphtype:datacomp
    };
    return nodePropsVals
}

/**
 * Return default property names
 * @returns node default property names
 */
export let getDefaultPropertiesNames = () => {
    let nodePropNames = [
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
        'useDefaults',
        'id',
        'position',
        'nodetype',
        'data',
        'graphtype'
    ]

    return(nodePropNames)
}

/**
 * Update all discrete values sending "changevalue" event
 * @param {any} document dom 
 * @param {any} graph graph 
 * @param {any} given given status for other random variables
 */
export const updateAllDValues = (document, graph, given = {}) => {
    const dvComponents = document.querySelectorAll('.bayes-node-discrete-value')
    for (let i = 0; i < dvComponents.length; i++) {
        const element = dvComponents[i]
        const idstr = element.id
        const idarr = idstr.split('-')
        let id = ''
        for (let j = 1; j < idarr.length - 1; j++) {
            if (j == 1)
                id += idarr[j]
            else
                id += '-' + idarr[j]
        }
        const status = idarr[idarr.length - 1]
        const found = graph.nodes.find((item) => item.id == id)
        let variable = ''
        if (found)
            variable = found.label
        const item = { id: id, status: status, variable: variable }
        const value = getStatusDistribution(graph, found, item.status,given)
        const valueEvent = new CustomEvent("changevalue", { detail: { value: !isNaN(value) ? value : 0.0 } });
        if (element) {
            element.dispatchEvent(valueEvent)
        }
    }
}

export const updateAllCValues = (document, graph, given = {}) => {
    updateAllDValues(document, graph)
    const dvComponents = document.querySelectorAll('.bayes-node-cont-value')
    for (let i = 0; i < dvComponents.length; i++) {
        const comp = dvComponents[i]
        const id = comp.dataset.node.substring(2)
        const found = graph.nodes.find((item) => item.id == id)
        if (found) {
            const mv = getMeansVariancesWeight(found, 0)
            const event = new CustomEvent('changevalue', { detail: { mv: mv } })
            comp.dispatchEvent(event)
        }
    }
}

/**
 * Return all status checked
 * @param {any} document dom
 * @returns list of checked statuses
 */
export const getAllCheckedStatus = (document) => {
    let given = {}
    const dvComponents = document.querySelectorAll('.bayes-node-discrete-value')
    for (let i = 0; i < dvComponents.length; i++) {
        const element = dvComponents[i]
        const idstr = element.id
        const idarr = idstr.split('-')
        let id = ''
        for (let j = 1; j < idarr.length - 1; j++) {
            if (j == 1)
                id += idarr[j]
            else
                id += '-' + idarr[j]
        }
        const status = idarr[idarr.length - 1]
        let variable = element.dataset.node
        const found = Array.from(element.children).find((item)=>item.tagName == 'INPUT')
        if (found && found.checked)
            given[variable] = status
    }
    return given
}

/**
 * Adjust  heigth baed on new node content for all graph nodes
 * @param {any} graph graph
 */
export const adjustNodeHeight = (graph,document) => {
    
    for (let i = 0; i < graph.nodes.length; i++) {
        const node = graph.nodes[i]
        const nwuid = 'NW-' + node.id
        const wrapper = document.getElementById(nwuid)
        if (wrapper) {
            const height = wrapper.getBoundingClientRect().height
            // GET SVG NODE
            const svgnode = document.getElementById('N-' + node.id)
            if (svgnode) {
                svgnode.style.height = height + 'px'
            }
        }
    }
}

/**
 * STATETYPE: type of state value
 */
export const STATETYPE = {
    BOOL: 'BOOL',
    INT: 'INT',
    INTERVAL: 'INTERVAL',
    NONE: 'NONE'
}
/**
 * Mixture distribution class
 * @param {any} mean array of means
 * @param {any} std array of variances
 * @param {any} wg array of weights
 */
export var Mixture = function (mean, std, wg) {
    this.wg = wg;
    this.mean = mean;
    this.std = std;
    this.a = 1 / Math.sqrt(2 * Math.PI);
    this.uplim = 10;
    this.lowlim = -10;
    this.norm = 1.0;
}

Mixture.prototype = {
    addStd: function (v) {
        this.std += v;
    },

    setLimits: function (low, up) {
        this.lowlim = low;
        this.uplim = up;
    },

    setNorm: function (norm) {
        this.norm = norm;
    },

    getProbability: function (x) {
        var result = 0.0
        var step = (Math.abs(this.lowlim) + Math.abs(this.uplim)) / 100;
        var i = -100
        var cx = i * step
        if (x < this.lowlim || x > this.uplim)
            return 0.0
        while (cx <= x && i < 100) {
            result += this.get(cx) * step;
            i++
            cx = i * step
        }
        return result
        
    },

    get: function (x) {
        var result = 0.0
        for (let i = 0; i < this.mean.length; i++) {
            var f = this.a / this.std[i];
            var p = -1 / 2;
            var c = (x - this.mean[i]) / this.std[i];
            c *= c;
            p *= c;
            result += this.wg[i] * f * Math.pow(Math.E, p);
        }
        // Normalize result
        //result /= this.mean.length
        return result/this.norm
    },

    generateValues: function (start, end) {
        const magnify = 2.0
        var LUT = [];
        var step = (Math.abs(start) + Math.abs(end)) / 100;
        for (var i = start; i < end; i += step) {
            LUT.push(this.get(i)*magnify);
        }
        return LUT;
    },


    draw: function (ctx, cvs, width, height) {
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        var points = this.generateValues(this.lowlim, this.uplim);
        var len = points.length;
        ctx.strokeStyle = "black";
        ctx.beginPath();
        var p0 = points[0];
        ctx.moveTo(0, height - (height * p0));
        points.forEach(function (p, i) {
            if (i === 0) {
                return;
            }
            ctx.lineTo(width * i / len, height - (height * p));
            p0 = p;
        });
        ctx.stroke();
    }
};

/**
 * Adjust nodeParam on node add
 * @param {any} nodeParam node parameters
 * @param {any} typeOptions node type options
 */
export const getParamsAddNode = (nodeParam, typeOptions) => {
    switch (nodeParam.graphtype) {
        case 'ISA':
            let typeopt = typeOptions.find((item) => item.value == nodeParam['nodetype'])
            nodeParam.data = []
            let level = typeOptions.find((item) => item.value == nodeParam['nodetype'])
            const dt = { type: 'text', key: 'level', value: level.options.level }
            const dt1 = { type: 'text', key: 'nodetype', value: nodeParam['nodetype'] }
            nodeParam['data'].push(dt)
            nodeParam['data'].push(dt1)
            if (typeopt.options.color)
                nodeParam.bgColor = typeopt.options.color
            break
        case 'BAYES':
            //const ini = loadData(nodeParam.graphtype)
            if (nodeParam.nodetype == 'CONTINUOUS') {
                nodeParam.data[0].type = STATETYPE.INTERVAL
                nodeParam.bgColor = '#FF00FF'
            }
            if (nodeParam.nodetype == 'DISCRETE') {
                nodeParam.data[0].type = STATETYPE.NONE
                nodeParam.bgColor = '#FFFF00'
            }
            break
    }
}

/**
 * Adjust nodeParam on node modify
 * @param {any} nodePropsVals  node parameters
 * @param {any} typeOptions node type options
 */
export const getParamsModNode = (nodePropsVals, typeOptions) => {
    switch (nodePropsVals.graphtype) {
        case 'ISA':
            let typeopt = typeOptions.find((item) => item.value == nodePropsVals['nodetype'])
            const dt = { type: 'text', key: 'level', value: typeopt.options.level }
            const dt1 = { type: 'text', key: 'nodetype', value: nodePropsVals['nodetype'] }
            const index = nodePropsVals['data'].findIndex((item) => item.key == 'level')
            const index1 = nodePropsVals['data'].findIndex((item) => item.key == 'nodetype')
            //const index2 = nodePropsVals['data'].findIndex((item) => item.key == 'bgColor')
            if (index > -1)
                nodePropsVals['data'][index] = dt
            else
                nodePropsVals['data'].push(dt)
            if (index1 > -1)
                nodePropsVals['data'][index1] = dt1
            else
                nodePropsVals['data'].push(dt1)
            if (typeopt.options.color) { 
                nodePropsVals.bgColor = typeopt.options.color
            }
            break
        case 'BAYES':
            if (nodePropsVals.nodetype == 'CONTINUOUS') {
                nodePropsVals.bgColor = '#FF00FF'
                nodePropsVals.data[0].type = STATETYPE.INTERVAL
            }
            if (nodePropsVals.nodetype == 'DISCRETE') {
                nodePropsVals.bgColor = '#FFFF00'
            }
            break
    }
}

/**
     * Get all graph edges by document parsing
     * Temporary because library doesn't have import/export yet
     * @retunn all graph edges
     */
export const getAllEdges = (document) => {
    const EDGES = []
    // Query the dom to get all edges
    let edgeArray
    const edgewrappers = document.getElementsByClassName("edges-wrapper")
    edgeArray = Array.from(edgewrappers)
    for (let i = 0; i < edgeArray.length; i++) {
        let pathArray
        var dummyEl = document.createElement('html')
        dummyEl.innerHTML = edgeArray[i].innerHTML
        let paths = dummyEl.getElementsByTagName("path")
        pathArray = Array.from(paths)
        for (let j = 0; j < pathArray.length; j++) {
            // Split source destination
            if (pathArray[j].id && pathArray[j].id.includes('+')) {
                const splitted = pathArray[j].id.split('+')
                const destsplit = splitted[0].split('/')
                const sourcesplit = splitted[1].split('/')
                const sourcenode = sourcesplit[1].replace('-target', '')
                const sourceanch = sourcesplit[0]
                const destnode = destsplit[1]
                const destanch = destsplit[0]
                const path = pathArray[j].getAttribute("d")
                const edge = {
                    id: pathArray[j].id,
                    source: sourcenode,
                    sourceanchor: sourceanch,
                    destination: destnode,
                    destanchor: destanch,
                    path: path
                }
                EDGES.push(edge)
            }
        }
    }
    return (EDGES)
}

/**
 * Normalize probability distribution
 * @param {any} node node 
 */
export const normalizeProb = (node) => {
    const index = node.data.findIndex((item) => item.distribution)
    const arrayDist = getArrayFromDistribution(node, index)
    // Conditioning variables (if any)
    const variables = arrayDist.header.filter((item) => (!item.includes('=')))
    // Conditioned variable
    const nodevar = node.label
    // A. Normalize probability in arrayDist
    for (let i = 0; i < arrayDist.distarray.length; i++) {
        const dist = arrayDist.distarray[i]
        let sum = 0
        for (let j = variables.length ; j < dist.array.length; j++) {
            if (dist.array[j] < 0) // check for negative values
                dist.array[j] = -dist.array[j]
            if (isNaN(dist.array[j])) // check for not a number
                dist.array[j] = 0
            sum += dist.array[j]
        }
        for (let j = variables.length; j < dist.array.length; j++) {
            if(sum > 0)
                dist.array[j] /= sum
            else
                dist.array[j] = 1 / (dist.array.length - variables.length)
        }
    }
    // B. Update probability in node.data[index].distribution
    for (let i = 0; i < node.data[index].distribution.length; i++) {
        const col = variables.length + i % node.data[index].status.length
        const row = Math.floor(i / node.data[index].status.length)
        node.data[index].distribution[node.data[index].distribution.length - i - 1].prob = arrayDist.distarray[row].array[col]

    }
}

export const normalizeWeight = (node) => {
    const index = node.data.findIndex((item) => item.distribution)
    const arrayDist = getArrayFromDistribution(node, index,'WEIGHT')
    // Conditioning variables (if any)
    const variables = arrayDist.header.filter((item) => (!item.includes('=')))
    // Conditioned variable
    const nodevar = node.label
    // A. Normalize probability in arrayDist
    for (let i = 0; i < arrayDist.distarray.length; i++) {
        const dist = arrayDist.distarray[i]
        let sum = 0
        for (let j = variables.length; j < dist.array.length; j++) {
            if (dist.array[j] < 0) // check for negative values
                dist.array[j] = -dist.array[j]
            if (isNaN(dist.array[j])) // check for not a number
                dist.array[j] = 0
            sum += dist.array[j]
        }
        for (let j = variables.length; j < dist.array.length; j++) {
            if (sum > 0)
                dist.array[j] /= sum
            else
                dist.array[j] = 1 / (dist.array.length - variables.length)
        }
    }
    // B. Update weight in node.data[index].distribution
    for (let i = 0; i < node.data[index].distribution.length; i++) {
        const col = variables.length + i % node.data[index].status.length
        const row = Math.floor(i / node.data[index].status.length)
        node.data[index].distribution[node.data[index].distribution.length - i - 1].weight = arrayDist.distarray[row].array[col]
    }
}
