
import * as THREE from 'three';
import utils from '../utils/utils';
import Objects from './objects';
import CSS2D from './CSS2DRenderer';


/*function Tooltip(obj) {

	obj = utils._validate(obj, Objects.prototype._defaults.tooltip);

	if (obj.text) {

		let divToolTip = Objects.prototype.drawTooltip(obj.text, obj.mapboxStyle);

		let tooltip = new CSS2D.CSS2DObject(divToolTip);
		tooltip.visible = false;
		tooltip.name = "tooltip";
		var userScaleGroup = Objects.prototype._makeGroup(tooltip, obj);
		Objects.prototype._addMethods(userScaleGroup);
		return userScaleGroup;
	}

}*/

function Tooltip(obj,objects) {

	obj = utils._validate(obj, Objects._defaults.tooltip);

	if (obj.text) {

		let divToolTip = objects.drawTooltip(obj.text, obj.mapboxStyle);

		let tooltip = new CSS2D.CSS2DObject(divToolTip);
		tooltip.visible = false;
		tooltip.name = "tooltip";
		var userScaleGroup = objects._makeGroup(tooltip, obj);
		objects._addMethods(userScaleGroup);
		return userScaleGroup;
	}

}


export default Tooltip;