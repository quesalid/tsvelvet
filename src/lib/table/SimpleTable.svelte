<script lang="ts">
  import { onMount} from "svelte"
  import { writable } from "svelte/store";
  import { createTable, Subscribe, Render, createRender } from 'svelte-headless-table';
  import { addSortBy,addPagination,addTableFilter, addColumnFilters } from 'svelte-headless-table/plugins';
  // CELL RENDERERS
  import {	ImageRender,
			ImageRenderDynamic,
			CheckRender,
			SelectRender,
			TextRender,
			EditTextRender,
			EditCheckRender,
			TextStyleRender} from '.'
  // FILTER RENDERERS
  import TextFilter from './filters/TextFilter.svelte'
  import NumberRangeFilter from './filters/NumberRangeFilter.svelte'
  import SelectFilter from './filters/SelectFilter.svelte'
  import SliderFilter from './filters/SliderFilter.svelte'
  // IMPORT FILTER FUNCTIONS
  import { textPrefixFilter, minFilter, numberRangeFilter, matchFilter } from '../../script/filters/filters';

  

  export let data:any =  writable( []);

  export let datacolumns:any = [];

  export let pagesize = true;
  export let showpag = true;
  export let pSize = 2;


  
  const getFilterRenderer = (type:any,fn:any,iv:any) => {
	  let plugin:any = {}
	  switch(type){
		  case 'text':
		  plugin = {
			  filter: {
			  fn: fn,
			  initialFilterValue: iv,
			  render: ({ filterValue, values, preFilteredValues }) =>
				createRender(TextFilter, { filterValue, values, preFilteredValues }),
			}
		  }
		  break;
		  case 'number':
			  plugin = {
				  filter: {
				  fn: fn,
				  initialFilterValue: iv,
				  render: ({ filterValue, values, preFilteredValues }) =>
				  createRender(NumberRangeFilter, { filterValue, values, preFilteredValues }),
				  }
			  }
			  break;
		  case 'select':
			  plugin = {
				  filter: {
				  fn: fn,
				  initialFilterValue: iv,
				  render: ({ filterValue, values, preFilteredValues }) =>
				  createRender(SelectFilter, { filterValue, values, preFilteredValues }),
				  }
			  }
			  break;
		  case 'slider':
			  plugin = {
				  filter: {
				  fn: fn,
				  initialFilterValue: iv,
				  render: ({ filterValue, values, preFilteredValues }) =>
				  createRender(SliderFilter, { filterValue, values, preFilteredValues }),
				  }
			  }
			  break;
		  default:
			break;
	  }
	  return plugin
  }
  
  

  const getColumns = (datacolumns:any, table:any) => {
	  let columns = []
	  for (let i = 0; i < datacolumns.length; i++) {
		  if(datacolumns[i].renderdef){
			  datacolumns[i].cell = getRenderer(datacolumns[i].renderdef.type,datacolumns[i].renderdef.idtag,datacolumns[i].renderdef.uid,datacolumns[i].renderdef.params)
		  }
		  if(datacolumns[i].filterdef){
			  // INSERT TEXT FILTER
			  datacolumns[i].plugins = getFilterRenderer(datacolumns[i].filterdef.type,datacolumns[i].filterdef.fn,datacolumns[i].filterdef.iv)
		  }
		  columns.push(table.column(datacolumns[i]))
	  }
	  return columns
  }

  

  const getRenderer = (type:any,idtag:any,uid:any,params:any)=>{
	  let ret
	  switch(type){
		  case 'image':
			ret = ({row}:any)=>{
				params.uid = row.original['uid']
				return createRender(ImageRender,{...params})
			}
			break;
		  case 'imagedynamic':
			ret = ({row}:any)=>{
				params.uid = row.original['uid']
				params.image = row.original.profile.avatar
				return createRender(ImageRenderDynamic,{...params})
			}
			break;
		  case 'checkbox':
			ret = ({row}:any)=>{
				const keys = Object.keys(row.original)
				const key = keys.find((k)=>k==idtag)
				params.uid = row.original['uid']
				if(key)
					params.value = row.original[key]
				return createRender(CheckRender,{...params})
			}
			break;
		  case 'select':
			ret = ({row}:any)=>{
				const keys = Object.keys(row.original)
				const key = keys.find((k)=>k==idtag)
				params.uid = row.original['uid']
				if(key)
					params.type = row.original[key]
				return createRender(SelectRender,{...params})
			}
			break;
		  case 'text':
			ret = (({row}:any)=>{
				const keys = Object.keys(row.original)
				const key = keys.find((k)=>k==idtag)
				params.uid = row.original['uid']
				if(key)
					params.value = row.original[key]
				return createRender(TextRender,{...params})
			})
			break;
		case 'textstyle':
			ret = (({row}:any)=>{
				params.uid = row.original['uid']
			    params.value = row.original.lastvalue
				return createRender(TextStyleRender,{...params})
			})
			break;
			case 'editext':
			ret = (({row,column}:any)=>{
				const keys = Object.keys(row.original)
				const key = keys.find((k)=>k==idtag)
				params.uid = row.original['uid']
				if(key){
					params.value = row.original[key]
					params.key = column.id
				}
				//console.log("EDIT TEXT RENDER",params,row.id,column.id)
				return createRender(EditTextRender,{...params})
			})
			break;
			case 'editcheckbox':
			ret = ({row,column}:any)=>{
				const keys = Object.keys(row.original)
				const key = keys.find((k)=>k==idtag)
				params.uid = row.original['uid']
				if(key){
					params.value = row.original[key]
					params.key = column.id
				}
				//console.log("EDIT CHECK  RENDER",params,row.id,column.id)
				return createRender(EditCheckRender,{...params})
			}
			break;
		  default:
		    break;
	  }
	  return ret
  }

  
  const buildtable = (data:any,datacolumns:any)=>{
	  const tableOptions:any = {}
	  tableOptions.sort = addSortBy()
	  tableOptions.page = addPagination()
	  tableOptions.tableFilter = addTableFilter()
	  tableOptions.filter = addColumnFilters()
	  let table = createTable(data, tableOptions);
	  let columns = table.createColumns(getColumns(datacolumns,table))
	  let { visibleColumns, headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } = table.createViewModel(columns);
	  let { sortKeys } = pluginStates.sort;
	  let { filterValue } = pluginStates.tableFilter;
	  let { filterValues } = pluginStates.filter;
	  let { pageIndex, pageCount, pageSize, hasNextPage, hasPreviousPage } = pluginStates.page;
	  return {visibleColumns, headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates, pageIndex, pageCount, pageSize, hasNextPage, hasPreviousPage,filterValue}
  }

  let tableAttrs:any
  let headerRows:any
  let pageRows:any
  let tableBodyAttrs:any
  let pluginStates:any
  let pageIndex:any
  let pageCount:any
  let pageSize:any
  let hasNextPage:any
  let hasPreviousPage:any
  let filterValue:any
  let visibleColumns:any

  let key = 0

  onMount(async () => {
	({ visibleColumns, headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates, pageIndex, pageCount, pageSize, hasNextPage, hasPreviousPage, filterValue } = buildtable(data,datacolumns));
	$pageSize = pSize
	key++
  })
    
 $: {
	 if(key >0)
		({ visibleColumns, headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates, pageIndex, pageCount, pageSize, hasNextPage, hasPreviousPage, filterValue } = buildtable(data,datacolumns));
 }

</script>
    <!-- wait compont mount for rendering-->
	{#if key > 0}
		<table {...$tableAttrs}>
			<thead>
				{#each $headerRows as headerRow (headerRow.id)}
					<Subscribe rowAttrs={headerRow.attrs()} let:rowAttrs>
						<tr {...rowAttrs}>
							{#each headerRow.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
									<th {...attrs} on:click={props.sort.toggle}>
										<Render of={cell.render()} />
										{#if props.sort.order === 'asc'}
										⬇️
										{:else if props.sort.order === 'desc'}
										⬆️
										{/if}
										{#if props.filter?.render}
										<div>
											<Render of={props.filter.render} />
										</div>
										{/if}
									</th>
								</Subscribe>
							{/each}
						</tr>
					</Subscribe>
				{/each}
				<tr>
					<th class="th-input-search" colspan={$visibleColumns.length}>
						<input class="input-search" type="text" bind:value={$filterValue} placeholder="Search rows..." />
					</th>
				</tr>
			</thead>
			<tbody {...$tableBodyAttrs}>
				{#each $pageRows as row (row.id)}
					<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
						<tr {...rowAttrs}>
							{#each row.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs>
									<td {...attrs}>
										<Render of={cell.render()} />
									</td>
								</Subscribe>
							{/each}
						</tr>
					</Subscribe>
				{/each}
			</tbody>
		</table>

		{#if showpag}
			<div class="pagination-div">
				<div>
				  <button
					on:click={() => $pageIndex--}
					disabled={!$hasPreviousPage} style="font-weight:bold;font-size:15px;margin-left:2px;">🞀</button
				  >
				  {$pageIndex + 1} out of {$pageCount}
				  <button
					on:click={() => $pageIndex++}
					disabled={!$hasNextPage} style="font-weight:bold;font-size:15px;">🞂</button
				  >
				</div>
				{#if pagesize}
				   <div>
					<label for="page-size" style="margin-top:5px;margin-right:3px;margin-left:3px;">Page size</label>
					<input id="page-size" size="8" type="number" min={1} bind:value={$pageSize} />
				   </div>
				{/if}
			</div>
		{/if}
	{/if}


<style>
	table {
			border-spacing: 0;
			border-top: 1px solid black;
			border-left: 1px solid black;
			margin: 0.5rem;
		}
		th, td {
			border-bottom: 1px solid black;
			border-right: 1px solid black;
			padding: 0.5rem;
		}
		th{
			background-color: #e9e9e9;
		}
		.th-input-search{
			background-color: #fff;
		}
		.input-search{
			width: 100%;
		}
	.pagination-div{
		display:flex;
		vertical-align: middle;
		margin: 0.3rem;
		border: 1px solid;
	}
	#page-size{
		border: 1px solid;
	}
</style>