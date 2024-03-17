import Drawflow from 'drawflow'

/**
 * MOBILE SUPPORT
 */
let mobile_item_selec = {} ; // selecetd node
let mobile_last_move = null; // event
let transform = '';
/**
 * CALLED ON INIT
 * 
 * @param {any} containerName
 * @returns
 */
const createFlow = (containerName) => {
    var id = document.getElementById(containerName);
    if (id) {
        const editor = new Drawflow(id);
        // EVENT LISTENERS
        editor.on('nodeCreated', function (id) {
            console.log("Node created " + id);
        })

        editor.on('nodeRemoved', function (id) {
            console.log("Node removed " + id);
        })

        editor.on('nodeSelected', function (id) {
            console.log("Node selected " + id);
        })

        editor.on('moduleCreated', function (name) {
            console.log("Module Created " + name);
        })

        editor.on('moduleChanged', function (name) {
            console.log("Module Changed " + name);
        })

        editor.on('connectionCreated', function (connection) {
            console.log('Connection created');
            console.log(connection);
        })

        editor.on('connectionRemoved', function (connection) {
            console.log('Connection removed');
            console.log(connection);
        })

        editor.on('mouseMove', function (position) {
            //console.log('Position mouse x:' + position.x + ' y:' + position.y);
        })

        editor.on('nodeMoved', function (id) {
            console.log("Node moved " + id);
        })

        editor.on('zoom', function (zoom) {
            console.log('Zoom level ' + zoom);
        })

        editor.on('translate', function (position) {
            console.log('Translate x:' + position.x + ' y:' + position.y);
        })

        editor.on('addReroute', function (id) {
            console.log("Reroute added " + id);
        })

        editor.on('removeReroute', function (id) {
            console.log("Reroute removed " + id);
        })
        return(editor)
    }
    return null
}

/**
 * SET LISTENERS FOR MOBILE
 * @param {any} elements
 */
const setListenersForMobile = (elements) => {
    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener('touchend', drop, false);
        elements[i].addEventListener('touchmove', positionMobile, false);
        elements[i].addEventListener('touchstart', drag, false);
    }
}

/**
 *  CALLED ON DROP EVENT
 * @param {any} editor
 * @param {any} node
 * @param {any} x
 * @param {any} y
 * @returns
 */
const addNodeToFlow = (editor,node,x,y) => {
    if (editor.editor_mode === 'fixed') {
        return false;
    }
    x = x * (editor.precanvas.clientWidth / (editor.precanvas.clientWidth * editor.zoom)) - (editor.precanvas.getBoundingClientRect().x * (editor.precanvas.clientWidth / (editor.precanvas.clientWidth * editor.zoom)));
    y = y * (editor.precanvas.clientHeight / (editor.precanvas.clientHeight * editor.zoom)) - (editor.precanvas.getBoundingClientRect().y * (editor.precanvas.clientHeight / (editor.precanvas.clientHeight * editor.zoom)));

    editor.addNode(node.name, node.inputs, node.outputs, x, y, node.name, node.params, node.content);
}

const  allowDrop = (ev) => {
    ev.preventDefault();
}

const drag = (ev) => {
    if (ev.type === "touchstart") {
        mobile_item_selec = ev.target.closest(".drag-drawflow").getAttribute('data-node');
    } else {
        ev.dataTransfer.setData("node", ev.target.getAttribute('data-node'));
    }
}

const  drop = (ev,editor) => {
    if (ev.type === "touchend") {
        var parentdrawflow = document.elementFromPoint(mobile_last_move.touches[0].clientX, mobile_last_move.touches[0].clientY).closest("#drawflow");
        if (parentdrawflow != null) {
            addNodeToFlow(editor,mobile_item_selec, mobile_last_move.touches[0].clientX, mobile_last_move.touches[0].clientY);
        }
        mi.mobile_item_selec = '';
    } else {
        ev.preventDefault();
        var data = ev.dataTransfer.getData("node");
        addNodeToFlow(editor,data, ev.clientX, ev.clientY);
    }

}

const  positionMobile = (ev) =>{
    mobile_last_move = ev;
}

/**
 * 
 * @param {any} e
 * @param {any} editor
 * @param {any} className //".drawflow-node"
 */
const  showpopup = (e,editor,className) =>{
    e.target.closest(className).style.zIndex = "9999";
    e.target.children[0].style.display = "block";
    //document.getElementById("modalfix").style.display = "block";

    //e.target.children[0].style.transform = 'translate('+translate.x+'px, '+translate.y+'px)';
    transform = editor.precanvas.style.transform;
    editor.precanvas.style.transform = '';
    editor.precanvas.style.left = editor.canvas_x + 'px';
    editor.precanvas.style.top = editor.canvas_y + 'px';
    console.log(transform);

    //e.target.children[0].style.top  =  -editor.canvas_y - editor.container.offsetTop +'px';
    //e.target.children[0].style.left  =  -editor.canvas_x  - editor.container.offsetLeft +'px';
    editor.editor_mode = "fixed";

}

const  closemodal = (e,editor,className) => {
    e.target.closest(className).style.zIndex = "2";
    e.target.parentElement.parentElement.style.display = "none";
    //document.getElementById("modalfix").style.display = "none";
    editor.precanvas.style.transform = transform;
    editor.precanvas.style.left = '0px';
    editor.precanvas.style.top = '0px';
    editor.editor_mode = "edit";
}

const  changeModule = (event,selector) => {
    var all = document.querySelectorAll(selector);
    for (var i = 0; i < all.length; i++) {
        all[i].classList.remove('selected');
    }
    event.target.classList.add('selected');
}

const changeMode = (option,lock,unlock) => {
    //console.log(lock.id);
    if (option == 'lock') {
        lock.style.display = 'none';
        unlock.style.display = 'block';
    } else {
        lock.style.display = 'block';
        unlock.style.display = 'none';
    }
}

const FLOW = {
    createFlow,
    allowDrop,
    drop,
    addNodeToFlow
}

export default FLOW
