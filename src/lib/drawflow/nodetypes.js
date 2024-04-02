// https://www.edrawsoft.com/pid-wastewater-treatment-symbols.html

const getTitle = (title, titleclass ="title-box") => {
    const ret = '<div class="'+titleclass+'">' + title + '</div>'
    return (ret)
}
const getContent = (content, contentclass ="box") => {
    const ret = '<div class="'+contentclass+'">' + content + '</div>'
    return (ret)
}

let nodetypes = [
]

const addNodeType = (name,ins,outs,params,title,content) => {
    let nodetype = {}
    nodetype.name = name
    nodetype.inputs = ins
    nodetype.outputs = outs
    nodetype.x = 0
    nodetype.y = 0
    nodetype.params = params
    nodetype.title= getTitle(name)
    nodetype.content = getTitle(title) + getContent(content)
    nodetypes.push(nodetype)
}

const removeNodeType = (name) =>{
    nodetypes = nodetypes.filter((item) => {item.name != name })
}

const getNodeType = (name) => {
    const found = nodetypes.find((item) => { item.name == name })
}

const getAllNodeType = (module) => {
    switch(module){
        case 'CLONE':
            buildCloneNodeTypes()
            break;
        case 'DATA':
            buildDataNodeTypes()
            break;
        case 'DATAUTLITY':
            buildDataInfrastructureNodeTypes()
            break;
            
    }
    return(nodetypes)
}

const buildCloneNodeTypes = () => {
        addNodeType(`start`, 0, 1, { name: 'startid' }, `start`,
            `<div style="min-height:18px;">
            <svg id="svg-pippo" xmlns="http://www.w3.org/2000/svg" 
	            viewBox="0 -960 960 960" 
                class="svg-box-stroke">
	            <path id="path-pippo"  stroke-width="100.04" d="M1899 1023.999c0-483.252-391.75-874.995-875-874.995S149 540.747 149 1024c0 483.251 391.75 875.004 875 875.004s875-391.753 875-875.004z"/>
            </svg>
        </div>`)

        addNodeType(`stop`, 1, 0, { name: 'stopid' }, `stop`,
            `<div style="min-height:18px;">
            <svg id="svg-topo" xmlns="http://www.w3.org/2000/svg" 
	            viewBox="0 -960 960 960" 
                class="svg-box-fill">
	            <path id="path-topo" d="M1015.043 99.002C599.21 95.906 209.098 411.147 121.606 817.247c-84.386 356.719 66.704 754.625 369.312 962.585c293.721 210.37 712.33 226.857 1017.865 31.474c307.224-188.136 488.14-563.828 430.814-921.32c-52.494-370.583-348.523-692.886-716.13-769.06c-68.345-15.248-138.415-22.388-208.424-21.924m22.08 289.882c305.56-.968 586.24 251.915 617.383 556.116c39.755 290.762-147.702 594.914-429.537 682.33c-275.076 93.609-606.772-25.852-750.075-281.009c-158.564-264.725-91.1-641.965 160.165-825.757c113.947-87.919 258.202-134.99 402.064-131.68"/>
            </svg>
         </div>`)

        addNodeType(`usertask`, 1, 1, { name: 'usertaskid' }, `usertask`,
            `<div style="min-height:18px;">
            <svg id="svg-minnie" xmlns="http://www.w3.org/2000/svg" 
	            viewBox="0 -960 960 960" 
                class="svg-box-fill-stroke">
                <g transform="translate(0 947.638)">
                    <rect id="path-minnie" width="1800" height="1460" x="100" y="-677.638" fill="transparent" stroke-linecap="round" stroke-width="120" rx="329.651" ry="328.5"/>
                    <path id="path-minnie"  fill-rule="evenodd" d="M655.765-469.546c-101.845 0-174.703 78.293-174.907 167.474v.05c.006 26.97 7.304 55.433 18.706 81.107c8.233 18.537 18.468 35.579 30.94 49.231c-74.126 25.36-160.969 67.099-204.863 149.4l-2.366 4.436v266.423h664.98V-17.848l-2.365-4.435c-43.263-81.119-128.227-122.799-201.637-148.264c35.836-36.442 46.408-83.478 46.42-131.475v-.05c-.205-89.181-73.062-167.474-174.908-167.474m-69.537 94.964c4.707.012 9.876.169 15.574.505c45.398 2.676 60.678 10.848 72.422 18.598c11.745 7.75 20.025 15.128 51.063 16.033h.02c24.187-.905 35.82-5.217 44.16-10.102c3.38-1.98 6.22-4.037 9.128-6.002c7.687 16.478 11.815 34.694 11.862 53.545c-.016 53.681-9.245 91.274-58.465 122.037l4.815 36.29a825.005 825.005 0 0 1 31.583 10.269c1.5 6.262 3.235 14.475 4.401 23.206c1.222 9.148 1.703 18.665.95 25.811c-.754 7.146-2.973 11.004-3.362 11.394c-25.018 25.017-69.426 39.607-114.47 39.607c-45.043 0-89.452-14.59-114.47-39.607c-.389-.39-2.608-4.248-3.361-11.394c-.753-7.146-.273-16.663.95-25.81c1.172-8.78 2.92-17.042 4.427-23.316a826.137 826.137 0 0 1 31.27-10.16l2.87-38.885c-2.337-2.998-4.718-4.983-7.56-7.115c-10.986-8.242-24.307-26.372-33.717-47.56c-9.407-21.18-15.235-45.39-15.244-64.771c.059-23.235 6.312-45.507 17.796-64.744c2.055-.765 4.222-1.574 6.657-2.375c8.565-2.817 20.301-5.505 40.701-5.454m-86.95 258.269c-.035.263-.076.52-.111.785c-1.486 11.124-2.36 23.233-1.082 35.353c1.278 12.12 4.476 25.169 14.919 35.612C548.65-8.917 602.597 6.824 655.909 6.824c53.311 0 107.259-15.74 142.905-51.387c10.443-10.443 13.641-23.492 14.919-35.612c1.277-12.12.404-24.229-1.082-35.353c-.03-.22-.063-.432-.093-.65C866.752-92.413 919.136-58.376 948.04-7.557V208.36h-96.228V56.12h-40.215v152.24H499.071V56.12h-40.214v152.24H363.49V-7.556c28.96-50.915 81.486-84.985 135.789-108.757z"/>
                </g>
	        </svg>
        </div>`)

        addNodeType(`ruletask`, 1, 1, { name: 'ruletaskid' }, `ruletask`,
            `<div style="min-height:18px;">
            <svg id="svg-scrooge" xmlns="http://www.w3.org/2000/svg" 
	            viewBox="0 -960 960 960" 
                class="svg-box-fill-stroke">
                <g transform="translate(0 947.638)">
                    <rect id="path-scrooge" width="1800" height="1460" x="100" y="-677.638" fill="transparent" stroke-linecap="round" stroke-width="120" rx="329.651" ry="328.5"/>
                    <path id="path-scrooge"  d="M404.762-425.075V-209.9h921.642v-215.175z"/><path id={"path-"+id} fill="{fill}" d="M378.773-452.176v235.457h969.73v-235.457z"/><path id={"path-"+id} fill="none" stroke="{fill}" stroke-linecap="round" stroke-width="43.1" d="M379.284-93.79v-358.386H1348.4v716.774H617.528v-486.713v486.713H379.284V17.32H1348.4H379.284z"/>
                </g>
	        </svg>
     </div>`)

        addNodeType(`timer`, 1, 1, { name: 'timerid' }, `timer`,
            `<div style="min-height:18px;">
            <svg id="svg-donald" xmlns="http://www.w3.org/2000/svg" 
	            viewBox="0 -960 960 960" 
                class="svg-box-fill">
               <path id="path-donald"+id  d="M1024 99.004c-510.27 0-925 414.72-925 924.994s414.729 925.004 925 925.004s925-414.73 925-925.004c0-510.273-414.73-924.994-925-924.994m0 100c456.228 0 825 368.764 825 824.994s-368.773 825.004-825 825.004s-825-368.774-825-825.004s368.772-824.994 825-824.994m-8.29 385.945c-171.528 1.212-335.1 113.885-398.317 273.285c-65.79 155.801-29.42 347.57 88.884 468.442c115.027 123.83 304.555 169.464 463.307 111.428c166.36-56.675 288.573-221.231 292.976-397.19c8.863-170.945-93.874-339.97-248.558-412.566c-59.027-28.58-124.545-43.458-190.117-43.371a394.838 394.838 0 0 0-8.174-.028zm15.643 79.973c156.707.7 303.715 116.52 340.258 269.176c40.7 149.018-27.87 318.936-161.361 397.015c-136.3 85.544-328.47 62.745-440.395-53.11c-118.113-113.943-139.147-311.084-48.53-447.733c64.178-101.947 182.05-166.467 302.56-165.293c2.492-.048 4.981-.066 7.468-.055m105.952 102.072l-119.903 217.527c-37.032 3.938-45.83 60.122-11.662 75.106c22.57 15.666 40.247-10.392 60.793-9.494h183.293v-50H1065.89l115.205-209.004z"/>
	        </svg>
     </div>`)

        addNodeType(`egate`, 1, 1, { name: 'egateid' }, `egate`,
            `<div style="min-height:18px;">
            <svg id="svg-henry" xmlns="http://www.w3.org/2000/svg" 
	            viewBox="0 -960 960 960" 
                class="svg-box-fill">
               <path id="path-henry" d="M1024.022 99.36c-19.324-.017-38.646 7.15-52.98 21.55L120.937 971.023c-28.67 28.668-28.537 77.295.132 105.963l849.971 849.965c28.67 28.678 77.294 28.804 105.963 0l850.106-850.1c28.669-28.667 28.536-77.296-.135-105.964L1077.002 120.91c-14.334-14.334-33.657-21.534-52.98-21.55m-.065 126.045l798.66 798.666l-798.66 798.657l-798.66-798.657zm.045 339.555l-14.703 10.672l-426.28 309.453l168.44 517.967h545.082l168.44-517.967zm-.004 61.775l382.178 277.44l-145.977 448.904H787.801L641.824 904.175z" />
	        </svg>
     </div>`)
}

const buildDataNodeTypes = () => {
    addNodeType(`root`, 0, 1, { name: 'rootname' }, `company`,
        `<div style="min-height:18px;">
           <input type="image" src="ROOT.svg" alt="Factory" />
        </div>`)
    addNodeType(`factory`, 1, 1, { name: 'factoryname' }, `factory`,
        `<div style="min-height:18px;">
           <input type="image" src="FACTORY.svg" alt="Factory" />
        </div>`)
    addNodeType(`department`, 1, 1, { name: 'deptname' }, `department`,
        `<div style="min-height:18px;">
           <input type="image" src="DEPARTMENT.svg" alt="Department" />
        </div>`)
    addNodeType(`line`, 1, 1, { name: 'linename' }, `line`,
        `<div style="min-height:18px;">
           <input type="image" src="LINE.svg" alt="Department" />
        </div>`)
    addNodeType(`machine`, 1, 1, { name: 'machinename' }, `machine`,
        `<div style="min-height:18px;">
           <input type="image" src="MACHINE.svg" alt="Machine" />
        </div>`)
    addNodeType(`controller`, 1, 0, { name: 'contrname' }, `controller`,
        `<div style="min-height:18px;">
           <input type="image" src="CONTROLLER.svg" alt="Controller" />
        </div>`)
}

const buildDataInfrastructureNodeTypes = () => {
    addNodeType(`root`, 0, 1, { name: 'rootname' }, `company`,
        `<div style="min-height:18px;">
           <input type="image" src="ROOT.svg" alt="Factory" />
        </div>`)
    addNodeType(`infrastructure`, 1, 1, { name: 'plantname' }, `plant`,
        `<div style="min-height:18px;">
           <input type="image" src="AREA.svg" alt="Screen" />
        </div>`)
    addNodeType(`area`, 1, 1, { name: 'areaname' }, `area`,
        `<div style="min-height:18px;">
           <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gU3ZnIFZlY3RvciBJY29ucyA6IGh0dHA6Ly93d3cub25saW5ld2ViZm9udHMuY29tL2ljb24gLS0+DQo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMjU2IDI1NiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8bWV0YWRhdGE+IFN2ZyBWZWN0b3IgSWNvbnMgOiBodHRwOi8vd3d3Lm9ubGluZXdlYmZvbnRzLmNvbS9pY29uIDwvbWV0YWRhdGE+DQo8Zz48Zz48cGF0aCBmaWxsPSIjMDAwMDAwIiBkPSJNMTAzLjgsMTM5LjJoLTc1Yy0xMC40LDAtMTguOCw3LjUtMTguOCwxNi44djY3LjNjMCw5LjMsOC40LDE2LjgsMTguOCwxNi44aDc1YzEwLjQsMCwxOC44LTcuNSwxOC44LTE2Ljh2LTY3LjNDMTIyLjUsMTQ2LjgsMTE0LjEsMTM5LjIsMTAzLjgsMTM5LjJ6IE0xMDUuNSwyMTcuOGMwLDYuMi01LDExLjItMTEuMiwxMS4ySDM4LjJDMzIsMjI5LDI3LDIyNCwyNywyMTcuOHYtNTYuMWMwLTYuMiw1LTExLjIsMTEuMi0xMS4yaDU2LjFjNi4yLDAsMTEuMiw1LDExLjIsMTEuMlYyMTcuOEwxMDUuNSwyMTcuOHogTTEwMy44LDE1LjhoLTc1QzE4LjQsMTUuOCwxMCwyMy4zLDEwLDMyLjZ2NjcuM2MwLDkuMyw4LjQsMTYuOCwxOC44LDE2LjhoNzVjMTAuNCwwLDE4LjgtNy41LDE4LjgtMTYuOFYzMi42QzEyMi41LDIzLjMsMTE0LjEsMTUuOCwxMDMuOCwxNS44eiBNMTA1LjUsOTQuNGMwLDYuMi01LDExLjItMTEuMiwxMS4ySDM4LjJjLTYuMiwwLTExLjItNS0xMS4yLTExLjJWMzguMkMyNywzMi4xLDMyLDI3LDM4LjIsMjdoNTYuMWM2LjIsMCwxMS4yLDUsMTEuMiwxMS4yVjk0LjRMMTA1LjUsOTQuNHogTTIyNy4yLDE1LjhoLTc1Yy0xMC40LDAtMTguOCw3LjUtMTguOCwxNi44djY3LjNjMCw5LjMsOC40LDE2LjgsMTguOCwxNi44aDc1YzEwLjQsMCwxOC44LTcuNSwxOC44LTE2LjhWMzIuNkMyNDYsMjMuMywyMzcuNiwxNS44LDIyNy4yLDE1Ljh6IE0yMjksOTQuNGMwLDYuMi01LDExLjItMTEuMiwxMS4yaC01Ni4xYy02LjIsMC0xMS4yLTUtMTEuMi0xMS4yVjM4LjJjMC02LjIsNS0xMS4yLDExLjItMTEuMmg1Ni4xYzYuMiwwLDExLjIsNSwxMS4yLDExLjJWOTQuNHogTTIyNy4yLDEzOS4yaC03NWMtMTAuNCwwLTE4LjgsNy41LTE4LjgsMTYuOHY2Ny4zYzAsOS4zLDguNCwxNi44LDE4LjgsMTYuOGg3NWMxMC40LDAsMTguOC03LjUsMTguOC0xNi44di02Ny4zQzI0NiwxNDYuOCwyMzcuNiwxMzkuMiwyMjcuMiwxMzkuMnogTTIyOSwyMTcuOGMwLDYuMi01LDExLjItMTEuMiwxMS4yaC01Ni4xYy02LjIsMC0xMS4yLTUtMTEuMi0xMS4ydi01Ni4xYzAtNi4yLDUtMTEuMiwxMS4yLTExLjJoNTYuMWM2LjIsMCwxMS4yLDUsMTEuMiwxMS4yVjIxNy44eiIvPjwvZz48L2c+DQo8L3N2Zz4=" width="32" height="32">
        </div>`)
    addNodeType(`section`, 1, 1, { name: 'sectionname' }, `section`,
        `<div style="min-height:18px;">
          <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gU3ZnIFZlY3RvciBJY29ucyA6IGh0dHA6Ly93d3cub25saW5ld2ViZm9udHMuY29tL2ljb24gLS0+DQo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMjU2IDI1NiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8bWV0YWRhdGE+IFN2ZyBWZWN0b3IgSWNvbnMgOiBodHRwOi8vd3d3Lm9ubGluZXdlYmZvbnRzLmNvbS9pY29uIDwvbWV0YWRhdGE+DQo8Zz48Zz48cGF0aCBmaWxsPSIjMDAwMDAwIiBkPSJNODAuMiwzOS40bDQ3LDI2LjNjMC4yLDAuMSwwLjUsMC4yLDAuOCwwLjJjMC4zLDAsMC42LTAuMSwwLjgtMC4ybDQ3LTI2LjNjMC41LTAuMywwLjgtMC44LDAuOC0xLjRjMC0wLjYtMC4zLTEuMi0wLjgtMS40bC00Ny0yNi4zYy0wLjUtMC4zLTEuMS0wLjMtMS42LDBsLTQ3LDI2LjNjLTAuNSwwLjMtMC44LDAuOC0wLjgsMS40Qzc5LjQsMzguNiw3OS43LDM5LjIsODAuMiwzOS40TDgwLjIsMzkuNHogTTE3NS44LDExNS4xbC00Ny0yNi4zYy0wLjUtMC4zLTEuMS0wLjMtMS42LDBsLTQ3LDI2LjNjLTAuNSwwLjMtMC44LDAuOC0wLjgsMS40YzAsMCwwLDAuMSwwLDAuMWMwLDAuMSwwLDAuMiwwLDAuNFYyMTdjMCwxLjQsMC44LDIuOCwyLDMuNWw0NC42LDI1YzAuNiwwLjMsMS4zLDAuNSwyLDAuNWMwLjcsMCwxLjMtMC4yLDItMC41bDQ0LjYtMjVjMS4zLTAuNywyLTIsMi0zLjV2LTk5LjljMC0wLjEsMC0wLjIsMC0wLjRjMCwwLDAtMC4xLDAtMC4xQzE3Ni42LDExNiwxNzYuMywxMTUuNSwxNzUuOCwxMTUuMUwxNzUuOCwxMTUuMXogTTEyNCwyMzUuMmwtMzYuNy0yMC42VjEyMmwzNi43LDIwLjZMMTI0LDIzNS4yTDEyNCwyMzUuMnogTTE2OC42LDIxNC43TDEzMiwyMzUuMnYtOTIuN2wzNi43LTIwLjZWMjE0LjdMMTY4LjYsMjE0Ljd6IE0xMDcuMiw3Ny40YzAtMC42LTAuMy0xLjItMC44LTEuNEw1OS40LDQ5LjZjLTAuNS0wLjMtMS4xLTAuMy0xLjYsMEwxMC44LDc2Yy0wLjUsMC4zLTAuOCwwLjgtMC44LDEuNGMwLDAsMCwwLDAsMC4xYzAsMCwwLDAsMCwwLjFjMCwwLDAsMC4xLDAsMC4xYzAsMC4xLDAsMC4yLDAsMC40VjE3OGMwLDEuNCwwLjgsMi44LDIsMy41bDQ0LjYsMjVjMC42LDAuMywxLjMsMC41LDIsMC41czEuMy0wLjIsMi0wLjVsMi0xLjJ2LTkuMXYtOTIuNnYtMC4ybDQzLjgtMjQuNkMxMDYuOSw3OC41LDEwNy4yLDc4LDEwNy4yLDc3LjRMMTA3LjIsNzcuNHogTTU0LjYsMTk2LjJsLTM2LjctMjAuNlY4M2wzNi43LDIwLjZWMTk2LjJMNTQuNiwxOTYuMnogTTI0Niw3Ny41QzI0Niw3Ny41LDI0Niw3Ny41LDI0Niw3Ny41YzAtMC4xLDAtMC4xLDAtMC4xbDAsMGwwLDBjMC0wLjEsMC0wLjMsMC0wLjR2MGMtMC4xLTAuNC0wLjQtMC44LTAuOC0xbC00NC4xLTI0LjdsLTIuOS0xLjZjLTAuMS0wLjEtMC4zLTAuMS0wLjQtMC4yYy0wLjEsMC0wLjMsMC0wLjQsMGMtMC4zLDAtMC42LDAuMS0wLjgsMC4ybC01LjgsMy4zTDE0OS42LDc2Yy0wLjQsMC4yLTAuNywwLjYtMC44LDFjMCwwLjEtMC4xLDAuMy0wLjEsMC40YzAsMC42LDAuMywxLjIsMC44LDEuNGw0My44LDI0LjZ2MC4ydjkyLjd2OS4xbDIsMS4yYzAuNiwwLjMsMS4zLDAuNSwyLDAuNWMwLjcsMCwxLjMtMC4yLDItMC41bDQ0LjYtMjVjMS4zLTAuNywyLTIsMi0zLjVWNzguMWMwLTAuMSwwLTAuMiwwLTAuNEMyNDYsNzcuNiwyNDYsNzcuNiwyNDYsNzcuNUwyNDYsNzcuNXogTTIzOCwxNzUuNmwtMzYuNywyMC42di05Mi43TDIzOCw4M1YxNzUuNkwyMzgsMTc1LjZ6Ii8+PC9nPjwvZz4NCjwvc3ZnPg==" width="32" height="32">
        </div>`)
    addNodeType(`asset`, 1, 1, { name: 'assetname' }, `asset`,
        `<div style="min-height:18px;">
           <input type="image" src="MACHINE.svg" alt="Machine" />
        </div>`)
    addNodeType(`controller`, 1, 0, { name: 'contrname' }, `controller`,
        `<div style="min-height:18px;">
           <input type="image" src="CONTROLLER.svg" alt="Controller" />
        </div>`)
}


const NODETYPES = {
    addNodeType,
    removeNodeType,
    getNodeType,
    getAllNodeType
}

export default NODETYPES
