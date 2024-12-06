<script lang="ts">
  import { createTable, Subscribe, Render, createRender } from 'svelte-headless-table';
  import { addSortBy,addTableFilter,addSelectedRows } from 'svelte-headless-table/plugins';
  import ImageRender from './ImageRender.svelte'
  import ImageRenderDynamic from './ImageRenderDynamic.svelte'
  import CheckRender from './CheckRender.svelte'
  import SelectRender from './SelectRender.svelte'
  import TextRender from './TextRender.svelte'
  import EditTextRender from './EditTextRender.svelte'
  import EditCheckRender from './EditCheckRender.svelte'
  import TextStyleRender from './TextStyleRender.svelte';

  

  export let data:any = [
		{ name: 'Ada Lovelace', age: 21 },
		{ name: 'Barbara Liskov', age: 52 },
		{ name: 'Richard Hamming', age: 38 },
  ];
  export let datacolumns:any = [
	  {
		header: 'Name',
		accessor: 'name',
	  },
	  {
		header: 'Age',
		accessor: 'age',
	  }
  ];

  export let height = '450px';
  
  

  const getColumns = (datacolumns:any) => {
	  let columns = []
	  for (let i = 0; i < datacolumns.length; i++) {
		  if(datacolumns[i].renderdef){
			  datacolumns[i].cell = getRenderer(datacolumns[i].renderdef.type,datacolumns[i].renderdef.idtag,datacolumns[i].renderdef.uid,datacolumns[i].renderdef.params)
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
			ret = ({row}:any,{pluginStates}:any)=>{
				const keys = Object.keys(row.original)
				const key = keys.find((k)=>k==idtag)
				params.uid = row.original['uid']
				if(key)
					params.value = row.original[key]
			    const { isSomeSubRowsSelected, isSelected } = pluginStates.select.getRowState(row);
				params.isSelected = isSelected
				params.isSomeSubRowsSelected = isSomeSubRowsSelected
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

  //const datarows = readable(data);

  const tableOptions:any = {}
	  tableOptions.sort = addSortBy()
	  tableOptions.tableFilter = addTableFilter()
	  tableOptions.select = addSelectedRows()

  const table = createTable(data, tableOptions);

  const columns = table.createColumns(getColumns(datacolumns))

  const { visibleColumns, headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } = table.createViewModel(columns);
  const { sortKeys } = pluginStates.sort;
  const { filterValue } = pluginStates.tableFilter;
  const { selectedDataIds } = pluginStates.select;
  
 
 

</script>
<div  class='table-fix-head' style="--height:{height};">
    <table {...$tableAttrs}>
	  <thead >
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
</div>



<style>
    .table-fix-head {
        overflow-y: auto; /* make the table scrollable if height is more than height  */
        height: var(--height); 
		
      }
      .table-fix-head thead  {
        position: sticky; /* make the table heads sticky */
		position: -webkit-sticky;
        top: 0px; /* table head will be placed from the top of the table and sticks to it */
		z-index: 2;
      }
	table {
			border-spacing: 0;
			border-top: 1px solid black;
			border-left: 1px solid black;
			margin: 0rem 0.5rem 0.5rem 0.5rem;
			border-collapse: collapse;
		}
		thead {
			opacity: 100% ;
			/*border-top: 1px solid black;*/
			/*border-bottom: 1px solid black*/
			border : 1px solid black;
		}
		th, td {
			border-top: 1px solid black;
			border-bottom: 1px solid black;
			border-right: 1px solid black;
			padding: 0.5rem;
		}
		th{
			background-color: #e9e9e9;
		}
		.th-input-search {
			background-color: #fff;
			border-bottom: 1px solid black;
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
	
</style>