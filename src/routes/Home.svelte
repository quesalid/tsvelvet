<script lang="ts">
    import GraphEditor from '../lib/components/GraphEditor.svelte'
	import IsaDataPanel from '../lib/components/IsaDataPanel.svelte'
	import BayesDataPanel from '../lib/components/BayesDataPanel.svelte'
	import BayesDistrPanel from '../lib/components/BayesDistrPanel.svelte'
	import { uploadFile} from '../lib/components/GraphUtils.js'
	import InnerNode from '../lib/components/InnerNode.svelte'
	import BayesNode from '../lib/components/BayesNode.svelte'

    let defaultNodes: any[] = [];
	let contextmenu = 'myContext'
	let currentnode = ''
	let editnode:any = {}
	//let innernode = BayesNode
	let graph = {nodes:[],edges:[]}
	let innernode = InnerNode

	let typeOptions = [
		{value:"COMPANY",options:{level:'level1'}},
		{value:"PLANT",options:{level:'level2'}},
		{value:"DEPARTMENT",options:{level:'level3'}},
		{value:"LINE",options:{level:'level4'}},
		{value:"MACHINE",options:{level:'level5'}},
		{value:"CONTROLLER",options:{level:'level6'}}
	]

	/*let typeOptions = [
		{value:"DISCRETE",options:{level:'level1'}},
		{value:"CONTINUOUS",options:{level:'level1'}}
	]*/

	let panel = [
		{type:'text',name:'name',option:'COMPANY'},
		{type:'date',name:'createdAt',option:'COMPANY'},
		{type:'text',name:'name',option:'PLANT'},
		{type:'text',name:'address',option:'PLANT'},
		{type:'text',name:'name',option:'DEPARTMENT'},
		{type:'text',name:'description',option:'DEPARTMENT'},
		{type:'text',name:'name',option:'LINE'},
		{type:'text',name:'description',option:'LINE'},
		{type:'text',name:'name',option:'MACHINE'},
		{type:'text',name:'description',option:'MACHINE'},
		{type:'text',name:'supplier',option:'MACHINE'},
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

	const options = {datacomp:'ISA'}
	//const options = {datacomp:'BAYES'}

</script>

	<GraphEditor bind:graph={graph} typeOptions={typeOptions}  bind:editnode={editnode} innernode={innernode} options={options}>
		<IsaDataPanel slot="data" id="defaultDataMenuContainer" bind:node={editnode} bind:graph={graph} filterKey={filterKey} exp={exportData} imp={importData} panel={panel}/>
		<!--BayesDataPanel slot="data" id="defaultDataMenuContainer" bind:graph={graph} bind:node={editnode}  exp={exportData} imp={importData}/>
		<BayesDistrPanel slot="distribution" id="defaultDistributionMenuContainer" bind:graph={graph} bind:node={editnode}  exp={exportData} imp={importData}/-->

    </GraphEditor>


<style>


</style>


