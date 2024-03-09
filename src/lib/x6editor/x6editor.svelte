<script lang='ts'>
// https://x6.antv.antgroup.com/en/examples/showcase/practices/#flowchart
import { onMount, onDestroy } from 'svelte';

import { Graph, Shape } from '@antv/x6'
import { Stencil } from '@antv/x6-plugin-stencil'
import { Transform } from '@antv/x6-plugin-transform'
import { Selection } from '@antv/x6-plugin-selection'
import { Snapline } from '@antv/x6-plugin-snapline'
import { Keyboard } from '@antv/x6-plugin-keyboard'
import { Clipboard } from '@antv/x6-plugin-clipboard'
import { History } from '@antv/x6-plugin-history'
import insertCss from 'insert-css'


let graph:any
let stencil:any

onMount(async () => {
	graph = new Graph({
            container: document.getElementById('graph-container'),
          background: {
            color: '#F2F7FA',
          },
        })
    stencil = new Stencil({
          title: 'MAIN',
          target: graph,
          groups: [
            {
              title:'TITLE1',
              name: 'group1',
            }
          ],
          })
    
    const rect1 = graph.createNode({
          shape: 'rect',
          width: 100,
          height: 40,
        })
    const rect2 = rect1.clone()

    const stencilContainer =  document.getElementById('stencil')
    stencilContainer.appendChild(stencil.container)
    stencil.load([rect1, rect2], 'group1')

})






</script>

      <div id="container">
          <div id="stencil">
          </div>
          <div id="graph-container">
          </div>
      </div>
<style>
#container {
      display: flex;
      border: 1px solid #dfe3e8;
      justify-content: left ;
      width:100%;
    }
#stencil {
      width: 180px;
      height:fit-content;
      border-right: 1px solid #dfe3e8;
      overflow:hidden;
    }
#graph-container {
       width: calc(100% - 180px);
     
      height: 100%;
      overflow:hidden;
    }
</style>