

const getTitle = (title, titleclass ="title-box") => {
    const ret = '<div class="'+titleclass+'">' + title + '</div>'
    return (ret)
}
const getContent = (content, contentclass ="box") => {
    const ret = '<div class="'+contentclass+'">' + content + '</div>'
    return (ret)
}

let nodetypes = [
    {
        name: 'facebook',
        inputs: 0,
        outputs: 1,
        x: 0,
        y: 0,
        params: { type: 'facebook' },
        title: getTitle("Facebook Message"),
        content: getTitle("Facebook Message") + getContent(""),
    },
    {
        name: 'email',
        inputs: 1,
        outputs: 0,
        x: 0,
        y: 0,
        params: { type: 'email' },
        title: getTitle("Send Email"),
        content: getTitle("Send Email") + getContent(""),
    },
    {
        name: 'middlenode',
        inputs: 1,
        outputs: 1,
        x: 0,
        y: 0,
        params: { type: 'middlenode' },
        title: getTitle("Middel Node"),
        content: getTitle("Middel Node") + getContent("Box content"),
    }
]
const addNodeType = (name,ins,outs,params,title,content) => {
    let nodetype = {}
    nodetype.name = name
    nodetype.inputs = ins
    nodetype.outputs = outs
    nodetype.x = 0
    nodetype.y = 0
    nodetype.params = params
    nodetype.title= getTitle(title)
    nodetype.content = getTitle(title) + getContent(content)
    nodetypes.push(nodetype)
}

const removeNodeType = (name) =>{
    nodetypes = nodetypes.filter((item) => {item.name != name })
}

const getNodeType = (name) => {
    const found = nodetypes.find((item) => { item.name == name })
}

const getAllNodeType = () => {
    return(nodetypes)
}



const NODETYPES = {
    addNodeType,
    removeNodeType,
    getNodeType,
    getAllNodeType
}

export default NODETYPES
