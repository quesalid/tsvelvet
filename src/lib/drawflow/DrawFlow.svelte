<script>
import { onMount, onDestroy } from 'svelte';
import DrawFlow from './drawflow.js'

export let dataToImport = {"drawflow":{"Home":{"data":{"1":{"id":1,"name":"welcome","data":{},"class":"welcome","html":"\n    <div>\n      <div class=\"title-box\">👏 Welcome!!</div>\n      <div class=\"box\">\n        <p>Simple flow library <b>demo</b>\n        <a href=\"https://github.com/jerosoler/Drawflow\" target=\"_blank\">Drawflow</a><br> by <b>Jero Soler</b></p><br>\n\n        <p>Multiple input / outputs<br>\n           Data sync nodes<br>\n           Import / export<br>\n           Modules support<br>\n           Simple use<br>\n           Type: Fixed or Edit<br>\n           Events: view console<br>\n           Pure Javascript<br>\n        </p>\n        <br>\n        <p><b><u>Shortkeys:</u></b></p>\n        <p>🎹 <b>Delete</b> for remove selected<br>\n        💠 Mouse Left Click == Move<br>\n        ❌ Mouse Right == Delete Option<br>\n        🔍 Ctrl + Wheel == Zoom<br>\n        📱 Mobile support<br>\n        ...</p>\n      </div>\n    </div>\n    ","typenode": false, "inputs":{},"outputs":{},"pos_x":50,"pos_y":50},"2":{"id":2,"name":"slack","data":{},"class":"slack","html":"\n          <div>\n            <div class=\"title-box\"><i class=\"fab fa-slack\"></i> Slack chat message</div>\n          </div>\n          ","typenode": false, "inputs":{"input_1":{"connections":[{"node":"7","input":"output_1"}]}},"outputs":{},"pos_x":1028,"pos_y":87},"3":{"id":3,"name":"telegram","data":{"channel":"channel_2"},"class":"telegram","html":"\n          <div>\n            <div class=\"title-box\"><i class=\"fab fa-telegram-plane\"></i> Telegram bot</div>\n            <div class=\"box\">\n              <p>Send to telegram</p>\n              <p>select channel</p>\n              <select df-channel>\n                <option value=\"channel_1\">Channel 1</option>\n                <option value=\"channel_2\">Channel 2</option>\n                <option value=\"channel_3\">Channel 3</option>\n                <option value=\"channel_4\">Channel 4</option>\n              </select>\n            </div>\n          </div>\n          ","typenode": false, "inputs":{"input_1":{"connections":[{"node":"7","input":"output_1"}]}},"outputs":{},"pos_x":1032,"pos_y":184},"4":{"id":4,"name":"email","data":{},"class":"email","html":"\n            <div>\n              <div class=\"title-box\"><i class=\"fas fa-at\"></i> Send Email </div>\n            </div>\n            ","typenode": false, "inputs":{"input_1":{"connections":[{"node":"5","input":"output_1"}]}},"outputs":{},"pos_x":1033,"pos_y":439},"5":{"id":5,"name":"template","data":{"template":"Write your template"},"class":"template","html":"            <div>             <div class=\"title-box\"><i class=\"fas fa-code\"></i> Template</div>\n              <div class=\"box\">                Ger Vars<br>                <textarea df-template></textarea><br>                Output template with vars\n              </div>\n            </div>\n            ","typenode": false, "inputs":{"input_1":{"connections":[{"node":"6","input":"output_1"}]}},"outputs":{"output_1":{"connections":[{"node":"4","output":"input_1"},{"node":"11","output":"input_1"}]}},"pos_x":607,"pos_y":304},"6":{"id":6,"name":"github","data":{"name":"https://github.com/jerosoler/Drawflow"},"class":"github","html":"\n          <div>\n            <div class=\"title-box\"><i class=\"fab fa-github \"></i> Github Stars</div>\n            <div class=\"box\">\n              <p>Enter repository url</p>\n            <input type=\"text\" df-name>\n            </div>\n          </div>\n          ","typenode": false, "inputs":{},"outputs":{"output_1":{"connections":[{"node":"5","output":"input_1"}]}},"pos_x":341,"pos_y":191},"7":{"id":7,"name":"facebook","data":{},"class":"facebook","html":"\n        <div>\n          <div class=\"title-box\"><i class=\"fab fa-facebook\"></i> Facebook Message</div>\n        </div>\n        ","typenode": false, "inputs":{},"outputs":{"output_1":{"connections":[{"node":"2","output":"input_1"},{"node":"3","output":"input_1"},{"node":"11","output":"input_1"}]}},"pos_x":347,"pos_y":87},"11":{"id":11,"name":"log","data":{},"class":"log","html":"\n            <div>\n              <div class=\"title-box\"><i class=\"fas fa-file-signature\"></i> Save log file </div>\n            </div>\n            ","typenode": false, "inputs":{"input_1":{"connections":[{"node":"5","input":"output_1"},{"node":"7","input":"output_1"}]}},"outputs":{},"pos_x":1031,"pos_y":363}}},"Other":{"data":{"8":{"id":8,"name":"personalized","data":{},"class":"personalized","html":"\n            <div>\n              Personalized\n            </div>\n            ","typenode": false, "inputs":{"input_1":{"connections":[{"node":"12","input":"output_1"},{"node":"12","input":"output_2"},{"node":"12","input":"output_3"},{"node":"12","input":"output_4"}]}},"outputs":{"output_1":{"connections":[{"node":"9","output":"input_1"}]}},"pos_x":764,"pos_y":227},"9":{"id":9,"name":"dbclick","data":{"name":"Hello World!!"},"class":"dbclick","html":"\n            <div>\n            <div class=\"title-box\"><i class=\"fas fa-mouse\"></i> Db Click</div>\n              <div class=\"box dbclickbox\" ondblclick=\"showpopup(event)\">\n                Db Click here\n                <div class=\"modal\" style=\"display:none\">\n                  <div class=\"modal-content\">\n                    <span class=\"close\" onclick=\"closemodal(event)\">&times;</span>\n                    Change your variable {name} !\n                    <input type=\"text\" df-name>\n                  </div>\n\n                </div>\n              </div>\n            </div>\n            ","typenode": false, "inputs":{"input_1":{"connections":[{"node":"8","input":"output_1"}]}},"outputs":{"output_1":{"connections":[{"node":"12","output":"input_2"}]}},"pos_x":209,"pos_y":38},"12":{"id":12,"name":"multiple","data":{},"class":"multiple","html":"\n            <div>\n              <div class=\"box\">\n                Multiple!\n              </div>\n            </div>\n            ","typenode": false, "inputs":{"input_1":{"connections":[]},"input_2":{"connections":[{"node":"9","input":"output_1"}]},"input_3":{"connections":[]}},"outputs":{"output_1":{"connections":[{"node":"8","output":"input_1"}]},"output_2":{"connections":[{"node":"8","output":"input_1"}]},"output_3":{"connections":[{"node":"8","output":"input_1"}]},"output_4":{"connections":[{"node":"8","output":"input_1"}]}},"pos_x":179,"pos_y":272}}}}}
onMount(async () => {
	var id = document.getElementById("drawflow");
	const editor = new DrawFlow(id);
	editor.start();
	editor.import(dataToImport);
})
</script>

	<div class= "parent-drawflow" id="drawflow">
	</div>
<style>

.parent-drawflow {
  --parent-drawflow-heigth: 600px;
  display: flex;
  overflow: hidden;
  touch-action: none;
  outline:none;
  width:100%;
  height:var(--parent-drawflow-heigth);
   top: 40px;
}


:global(.drawflow) {
  width: 100%;
  height: 100%;
  position: relative;
  user-select: none;
  perspective: 0;
}

:global(.drawflow .parent-node) {
  position: relative;

}

:global(.drawflow .drawflow-node) {
  --drawflow-node-width:fit-content;
  --drawflow-node-border-color:black;
  --drawflow-node-color:black;
  display: flex;
  align-items: center;
  position: absolute;
  background: var(--background-color);
  width: var(--drawflow-node-width);
  min-width: 160px;
  min-height: fit-content;
  border-radius:4px;
  border: 2px solid var(--drawflow-node-border-color);
  color: var(--drawflow-node-color);
  z-index: 2;
}


:global(.drawflow .drawflow-node.selected) {
  --drawflow-node-border-selected-color:#4ea9ff;
  background: white;
  border: 2px solid var( --drawflow-node-border-selected-color);
}

:global(.drawflow .drawflow-node:hover) {
  cursor: move;
}

:global(.drawflow .drawflow-node .inputs, .drawflow .drawflow-node .outputs) {
  width: 0px;
}

:global(.drawflow .drawflow-node .drawflow_content_node) {
  width: fit-content;
  display: block;
}

:global(.drawflow .drawflow-node .input, .drawflow .drawflow-node .output) {

  position: relative;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  border: 2px solid black;
  cursor: crosshair;
  z-index: 1;
  margin-bottom: 5px;
}

:global(.drawflow .drawflow-node .input) {
  left: -27px;
  top: 2px;
  background: yellow;
}
:global(.drawflow .drawflow-node .output) {
  right: -3px;
  top: 2px;
}

:global(.drawflow-node .title-box) {
  /*height: 50px;
  line-height: 50px;*/
  --background-box-title: #e9e9e9;
  background: var(--background-box-title);
  border-bottom: 1px solid black;
  border-radius: 4px 4px 0px 0px;
  padding-left: 10px;
  font-weight:600 ;
  padding: 3px;
  min-width: 160px;
}
:global(.drawflow-node .box) {
	padding: 12px;
}

:global(.drawflow-node input, .drawflow-node select, .drawflow-node textarea) {
  border-radius: 4px;
  border: 1px solid var(--border-color);
  height: 30px;
  line-height: 30px;
  font-size: 16px;
  width: inherit;
  color: #555555;
}

:global(.drawflow svg) {
  z-index: 0;
  position: absolute;
  overflow: visible !important;
}
:global(.drawflow .connection) {
  position: absolute;
  pointer-events: none;
  aspect-ratio: 1 / 1;
}
:global(.drawflow .connection .main-path) {
  --connection-color:#4ea9ff;
  fill: none;
  stroke-width: 3px;
  stroke: var(--connection-color);
  pointer-events: all;
}


:global(.drawflow .connection .main-path:hover) {
  --connection-hover-color:#1266ab;
  stroke: var( --connection-hover-color);
  cursor: pointer;
}

:global(.drawflow .connection .main-path.selected) {
  stroke: #43b993;
}

:global(.drawflow .connection .point) {
  cursor: move;
  stroke: black;
  stroke-width: 2;
  fill: white;
  pointer-events: all;
}

:global(.drawflow .connection .point.selected, .drawflow .connection .point:hover) {
  fill: #1266ab;
}

:global(.drawflow .main-path) {
  fill: none;
  stroke-width: 5px;
  stroke: steelblue;
}

:global(.drawflow-delete) {
  position: absolute;
  display: block;
  width: 30px;
  height: 30px;
  background: black;
  color: white;
  z-index: 4;
  border: 2px solid white;
  line-height: 30px;
  font-weight: bold;
  text-align: center;
  border-radius: 50%;
  font-family: monospace;
  cursor: pointer;
}
:global(.drawflow > .drawflow-delete) {
  margin-left: -15px;
  margin-top: 15px;
}

:global(.parent-node .drawflow-delete) {
  right: -15px;
  top: -15px;
}


</style>