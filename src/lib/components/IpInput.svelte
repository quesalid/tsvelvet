<script lang="ts">

export let ipArray = ['','','','']

export let updateIp
export let key

</script>


<div class="ip-input-container">
	  <input id='0' name={key} maxlength="3" minlength="1" size="3" type="text" class="ip-input-item" value="{ipArray?ipArray[0]:''}" placeholder="XXX" on:change={updateIp}>
	  <i class="ip-input-dot"></i>
	  <input id='1' name={key} maxlength="3" minlength="1" size="3" type="text" class="ip-input-item" value="{ipArray?ipArray[1]:''}" placeholder="XXX" on:change={updateIp}>
	  <i class="ip-input-dot"></i>
	  <input id='2' name={key} maxlength="3" minlength="1" size="3" type="text" class="ip-input-item" value="{ipArray?ipArray[2]:''}" placeholder="XXX" on:change={updateIp}>
	  <i class="ip-input-dot"></i>
	  <input id='3' name={key} maxlength="3" minlength="1" size="3" type="text" class="ip-input-item" value="{ipArray?ipArray[3]:''}" placeholder="XXX" on:change={updateIp}>
</div>

<style>
.ip-input-container{
  display: inline-block;
  font-size: 0;
  border: 1px solid #999;
  padding: 6px 0;
}
.ip-input-container .ip-input-item{
  border: none;
  outline: 0;
  margin: 0;
  /*width: 60px;*/
  text-align: center;
  vertical-align: center;
  font-size: 13px;
}
.ip-input-container .ip-input-dot{
  display: inline-block;
  width: 2px;
  height: 2px;
  margin-bottom: 2px;
  background-color: #333;
  border-radius: 50%;
  vertical-align: bottom;
}
</style>