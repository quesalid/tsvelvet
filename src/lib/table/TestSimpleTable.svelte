<script lang="ts">
import { onMount} from "svelte"
import { writable } from "svelte/store";
import TestTableSlot from './TestTableSlot.svelte'
import SimpleTable from './SimpleTable.svelte'


let devicesdata =writable([])
let pagesize = true
let pSize = 8

const onDeviceClick = () => {
	console.log('onDeviceClick')
}
const voidfunction = () => { return "" }

let devicedatacolumns = [
    {
        header: 'Name',
        accessor: 'name',
    },
    {
        header: 'Description',
        accessor: 'description',
    },
    {
        header: 'plant',
        traslated: 'mainentity',
        accessor: 'plant',
    },
    {
        header: 'Type',
        accessor: 'type'
    },
    {
        header: 'OS',
        accessor: 'os'
    },
    {
        header: 'OSVER',
        accessor: 'osver'
    },
    {
        header: 'Host/IP',
        accessor: 'host',
    },
    {
        header: 'Port',
        accessor: 'port',
    },
    {
        header: 'Agents',
        accessor: voidfunction,
        renderdef: { type: 'image', params: { image: '/START.png', onClick: onDeviceClick } }
    },
    {
        header: 'Edit',
        accessor: voidfunction,
        renderdef: { type: 'image', params: { image: '/EDIT.svg', onClick: onDeviceClick} }
    },
    {
        header: 'Delete',
        accessor: voidfunction,
        renderdef: { type: 'image', params: { image: '/DELETE.svg', onClick: onDeviceClick } }
    }
];

onMount(() => {
	const data = [
		{
			uid: 1,
			name: 'Device 1',
			description: 'Device 1 description',
			plant: 'Plant 1',
			type: 'Type 1',
			os: 'OS 1',
			osver: 'OSVER 1',
			host: 'Host 1',
			port: 'Port 1',
			agents: 'Agents 1',
			edit: 'Edit 1',
			delete: 'Delete 1'
		},
		{
			uid: 2,
			name: 'Device 2',
			description: 'Device 2 description',
			plant: 'Plant 2',
			type: 'Type 2',
			os: 'OS 2',
			osver: 'OSVER 2',
			host: 'Host 2',
			port: 'Port 2',
			agents: 'Agents 2',
			edit: 'Edit 2',
			delete: 'Delete 2'
		},
		{
			uid: 3,
			name: 'Device 3',
			description: 'Device 3 description',
			plant: 'Plant 3',
			type: 'Type 3',
			os: 'OS 3',
			osver: 'OSVER 3',
			host: 'Host 3',
			port: 'Port 3',
			agents: 'Agents 3',
			edit: 'Edit 3',
			delete: 'Delete 3'
		},
		{
			uid: 4,
			name: 'Device 4',
			description: 'Device 4 description',
			plant: 'Plant 4',
			type: 'Type 4',
			os: 'OS 4',
			osver: 'OSVER 4',
			host: 'Host 4',
			port: 'Port 4',
			agents: 'Agents 4',
			edit: 'Edit 4',
			delete: 'Delete 4'
		}]
		$devicesdata = data
})
			

</script>

<div class="window-test-simple-table">
	<TestTableSlot>	
		<SimpleTable slot="bodycontent" data={devicesdata} datacolumns={devicedatacolumns} pagesize={pagesize} pSize={pSize}/>
	</TestTableSlot>
</div>

<style>
</style>