/**
 * @author jscastro / https://github.com/jscastro76
 */
import Objects from './objects';
import utils from '../utils/utils';
import CSS2D from './CSS2DRenderer';
/*function Label(obj) {

	obj = utils._validate(obj, Objects.prototype._defaults.label);

	let div = Objects.prototype.drawLabelHTML(obj.htmlElement, obj.cssClass);

	let label = new CSS2D.CSS2DObject(div);
	label.name = "label";
	label.visible = obj.alwaysVisible;
	label.alwaysVisible = obj.alwaysVisible;
	var userScaleGroup:any = Objects.prototype._makeGroup(label, obj);
	Objects.prototype._addMethods(userScaleGroup);
	userScaleGroup.visibility = obj.alwaysVisible;

	return userScaleGroup;
}*/
function Label(obj,objects) {
	console.log("Label ------------------>>>>>>>>",obj,objects);
	obj = utils._validate(obj, Objects._defaults.label);

	let div = objects.drawLabelHTML(obj.htmlElement, obj.cssClass);

	let label = new CSS2D.CSS2DObject(div);
	label.name = "label";
	label.visible = obj.alwaysVisible;
	label.alwaysVisible = obj.alwaysVisible;
	var userScaleGroup: any = objects._makeGroup(label, obj);
	objects._addMethods(userScaleGroup);
	userScaleGroup.visibility = obj.alwaysVisible;
	console.log("Label end ------------------>>>>>>>>");
	return userScaleGroup;
}


export default Label;