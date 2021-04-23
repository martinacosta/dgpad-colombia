Blockly.JavaScript['dgpad_restrictions_ShowCtrl'] = function(block) {
	
	var value_obj1 = Blockly.JavaScript.valueToCode(block, 'BOOL', Blockly.JavaScript.ORDER_NONE);
    if (value_obj1 === "")  return "";
	var code = 'showCtrlPanel(' + value_obj1 + ')';
	
	return code;
	
};

Blockly.JavaScript['dgpad_restrictions_Mode'] = function(block) {
	
	var value_obj1 = Blockly.JavaScript.valueToCode(block, 'BOOL', Blockly.JavaScript.ORDER_NONE);
    if (value_obj1 === "")  return "";
	var code = 'setMode(' + value_obj1 + ')';
	
	return code;
	
};

Blockly.JavaScript['dgpad_restrictions_disableButton'] = function(block) {
	
	var button = block.getFieldValue('BUTTON');
	
	var code = 'disableButton("' + button + '")';
	
	return code;
	
};

Blockly.JavaScript['dgpad_restrictions_enableButton'] = function(block) {
	
	var button = block.getFieldValue('BUTTON');
	
	var code = 'enableButton("' + button + '")';
	
	return code;
	
};

Blockly.JavaScript['dgpad_restrictions_Zoom'] = function(block) {
	
	var value_obj1 = Blockly.JavaScript.valueToCode(block, 'BOOL', Blockly.JavaScript.ORDER_NONE);
    if (value_obj1 === "")  return "";
	var code = 'enableZoom(' + value_obj1 + ')';
	
	return code;
	
};

Blockly.JavaScript['dgpad_restrictions_disableTool'] = function(block) {
	
	var tool = block.getFieldValue('TOOL');
	
	var code = 'disableOneTool("' + tool + '")';
	
	return code;
	
};

Blockly.JavaScript['dgpad_restrictions_enableTool'] = function(block) {
	
	var tool = block.getFieldValue('TOOL');
	
	var code = 'enableTool("' + tool + '")';
	
	return code;
	
};

Blockly.JavaScript['dgpad_restrictions_fixOx'] = function(block) {
	
	var value_obj1 = Blockly.JavaScript.valueToCode(block, 'BOOL', Blockly.JavaScript.ORDER_NONE);
    if (value_obj1 === "")  return "";
	var code = 'fixOx(' + value_obj1 + ')';
	
	return code;
	
};

Blockly.JavaScript['dgpad_restrictions_fixOy'] = function(block) {
	
	var value_obj1 = Blockly.JavaScript.valueToCode(block, 'BOOL', Blockly.JavaScript.ORDER_NONE);
    if (value_obj1 === "")  return "";
	var code = 'fixOy(' + value_obj1 + ')';
	
	return code;
	
};

Blockly.JavaScript['dgpad_restrictions_fixOxOy'] = function(block) {
	
	var value_obj1 = Blockly.JavaScript.valueToCode(block, 'BOOL', Blockly.JavaScript.ORDER_NONE);
    if (value_obj1 === "")  return "";
	var code = 'fixOxOy(' + value_obj1 + ')';
	
	return code;
	
};

Blockly.JavaScript['dgpad_restrictions_SystemProperties'] = function(block) {
	
	var font = Blockly.JavaScript.valueToCode(block, 'font', Blockly.JavaScript.ORDER_NONE);
	var axesWidth = Blockly.JavaScript.valueToCode(block, 'axesWidth', Blockly.JavaScript.ORDER_NONE);
	var gridWidth = Blockly.JavaScript.valueToCode(block, 'gridWidth', Blockly.JavaScript.ORDER_NONE);
    var gridShow = Blockly.JavaScript.valueToCode(block, 'gridShow', Blockly.JavaScript.ORDER_NONE);
	var oxShow = Blockly.JavaScript.valueToCode(block, 'oxShow', Blockly.JavaScript.ORDER_NONE);
	var oyShow = Blockly.JavaScript.valueToCode(block, 'oyShow', Blockly.JavaScript.ORDER_NONE);
	var fixOx = Blockly.JavaScript.valueToCode(block, 'fixOx', Blockly.JavaScript.ORDER_NONE);
    var fixOy = Blockly.JavaScript.valueToCode(block, 'fixOy', Blockly.JavaScript.ORDER_NONE);
	var onlyPos = Blockly.JavaScript.valueToCode(block, 'onlyPos', Blockly.JavaScript.ORDER_NONE);
	var zoomOrigin = Blockly.JavaScript.valueToCode(block, 'zoomOrigin', Blockly.JavaScript.ORDER_NONE);
	
	
	var code = 'me.C.coordsSystem.setFontSize(' + font +');me.C.coordsSystem.setAxisWidth('+axesWidth+');me.C.coordsSystem.setGridWidth('+gridWidth+');me.C.coordsSystem.showGrid('+gridShow+');me.C.coordsSystem.showOx('+oxShow+');me.C.coordsSystem.showOy('+oyShow+');me.C.coordsSystem.setlockOx('+fixOx+');me.C.coordsSystem.setlockOy('+fixOy+');me.C.coordsSystem.setOnlyPos('+onlyPos+');me.C.coordsSystem.setCenterZoom('+zoomOrigin+')';
	
	return code;
	
};

Blockly.JavaScript['dgpad_restrictions_setSystem'] = function(block) {
	
	var minAbs = Blockly.JavaScript.valueToCode(block, 'min_abs', Blockly.JavaScript.ORDER_NONE);
	var maxAbs = Blockly.JavaScript.valueToCode(block, 'max_abs', Blockly.JavaScript.ORDER_NONE);
	var maxOrds = Blockly.JavaScript.valueToCode(block, 'max_ords', Blockly.JavaScript.ORDER_NONE);
    
	var code = 'SetSystem(' + minAbs + ','+maxAbs+','+maxOrds+')';
	
	return code;
	
};