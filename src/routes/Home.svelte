<script lang="ts">
    import GraphEditor from '../lib/components/GraphEditor.svelte'
	import IsaDataPanel from '../lib/components/IsaDataPanel.svelte'
	import BayesDataPanel from '../lib/components/BayesDataPanel.svelte'
	import BayesDistrPanel from '../lib/components/BayesDistrPanel.svelte'
	import BayesDistrDefPanel from '../lib/components/BayesDistrDefPanel.svelte'
	import { loadData, uploadFile} from '../lib/components/GraphUtils.js'
	import IsaNode from '../lib/components/IsaNode.svelte'
	import BayesNode from '../lib/components/BayesNode.svelte'
	import LoadGraph from '../lib/components/LoadGraph.svelte'
	import SaveGraph from '../lib/components/SaveGraph.svelte'
	import DeleteGraph from '../lib/components/DeleteGraph.svelte'

    let defaultNodes: any[] = [];
	let contextmenu = 'myContext'
	let currentnode = {}
	let editnode:any = {}
	let graph = {nodes:[],edges:[],name:''}
	let graphs = []
	let innernode = IsaNode
	//let innernode = BayesNode

	let typeOptions = [
		{value:"COMPANY",options:{level:'level1',color:'#ffff80'}},
		{value:"PLANT",options:{level:'level2',color:'#80ff80'}},
		{value:"DEPARTMENT",options:{level:'level3',color:'#ff80ff'}},
		{value:"LINE",options:{level:'level4',color:'#8080ff'}},
		{value:"MACHINE",options:{level:'level5',color:'#ff00ff'}},
		{value:"CONTROLLER",options:{level:'level6',color:'#ffc800'}}
	]

	/*let typeOptions = [
		{value:"DISCRETE",options:{level:'level1'}},
		{value:"CONTINUOUS",options:{level:'level1'}}
	]*/

	let panel = [
		{type:'text',subtype:'',name:'name',option:'COMPANY'},
		{type:'date',subtype:'',name:'createdAt',option:'COMPANY'},
		{type:'text',subtype:'',name:'name',option:'PLANT'},
		{type:'text',subtype:'',name:'address',option:'PLANT'},
		{type:'text',subtype:'',name:'name',option:'DEPARTMENT'},
		{type:'text',subtype:'',name:'description',option:'DEPARTMENT'},
		{type:'text',subtype:'',name:'name',option:'LINE'},
		{type:'text',subtype:'',name:'description',option:'LINE'},
		{type:'text',subtype:'',name:'name',option:'MACHINE'},
		{type:'text',subtype:'',name:'description',option:'MACHINE'},
		{type:'text',subtype:'',name:'supplier',option:'MACHINE'},
		{type:'text',subtype:'',name:'name',option:'CONTROLLER'},
		{type:'text',subtype:'',name:'description',option:'CONTROLLER'},
		{type:'text',subtype:'',name:'model',option:'CONTROLLER'},
		{type:'text',subtype:'ip',name:'ip',option:'CONTROLLER'},
		{type:'number',subtype:'',name:'port',option:'CONTROLLER'},
	]

	// LIST OF DATA FIELDS NOT EDITABLE
	const filterKey = ['level','nodetype']
	

	const exportData = async ()=>{
		let expdata = []
		let namecomp = editnode.label
		const array = editnode.data
		console.log(editnode.data)
		for(let i=0;i< array.length;i++){
			const param = array[i]
			if(!param.subgraph)
				expdata.push(param)
			if(param.key == 'nodetype')
				namecomp = param.value
			if(param.key == 'name')
				namecomp += '-'+param.value
		}
		console.log("EXPDATA",expdata,array)
		const filestring = JSON.stringify(expdata)
		// default data export json name = DATA.json
		uploadFile(filestring,'DATA-'+namecomp+'.json')
	}

	const importData = (e:any|undefined)=>{
		const element = document.getElementById("file-data-input")
		if(element)
			element.click()
	}

	const graphSelect = async (ev:any)=>{
		const graphid = ev.target.value
		const graphtext = ev.target.options[ev.target.selectedIndex].dataset.graph
		if(graphtext){
			graph = JSON.parse(graphtext)
		}
		console.log("GRAPH SELECT",graphid,graph)
	}

	const submitQuery = async (ev:any|undefined)=>{
		const elem = document.getElementById("ggraph-search") 
		const query = elem?elem.value:''
	
		graphs = [
			{id:'s3547dslfh6dfhcxtuw3797jhas',name:'GRAPH1',graph:{nodes:[],edges:[]}},
			{id:'fr57945taiqd6gvxt67rtu9rt0p',name:'GRAPH2',graph:{nodes:[],edges:[]}},
		]
	
		console.log("SUBMIT QUERY",query)

		const select = document.getElementById("ggraph-select")
		if(select){
			select.style.visibility = "visible";
		}
	}

	const saveQuery = async (ev:any|undefined)=>{
		
		console.log("SAVE GRAPH",graph)
	}

	const deleteQuery = async (ev:any|undefined)=>{
		
		console.log("DELETE GRAPH",graph)
	}

	const options = {datacomp:'ISA'}
	//const options = {datacomp:'BAYES'}

</script>

	<GraphEditor bind:graph={graph} typeOptions={typeOptions}  bind:editnode={editnode} innernode={innernode} options={options}>
		<IsaDataPanel slot="data" id="defaultDataMenuContainer" bind:node={editnode} bind:graph={graph} filterKey={filterKey} exp={exportData} imp={importData} panel={panel}/>
		<!--BayesDataPanel slot="data" id="defaultDataMenuContainer" bind:graph={graph} bind:node={editnode}  exp={exportData} imp={importData}/>
		<BayesDistrPanel slot="distribution" id="defaultDistributionMenuContainer" bind:graph={graph} bind:node={editnode}  exp={exportData} imp={importData}/>
		<BayesDistrDefPanel slot="distributiondef" id="defaultDistributionDefContainer" bind:graph={graph} bind:node={editnode}  exp={exportData} imp={importData}/-->
		<LoadGraph slot="importgraph" id="defaultLoadGraphContainer" bind:graph={graph} bind:graphs={graphs} submitQuery={submitQuery} graphSelect={graphSelect}/>"
		<SaveGraph slot="savegraph" id="defaultSaveGraphContainer" bind:graph={graph}  saveQuery={saveQuery} />"
		<DeleteGraph slot="deletegraph" id="defaultDeleteGraphContainer" bind:graph={graph}  deleteQuery={deleteQuery} />"
		<!-- ADD LOAD,SAVE AND DELETE PANELS-->


    </GraphEditor>


<style>


</style>


