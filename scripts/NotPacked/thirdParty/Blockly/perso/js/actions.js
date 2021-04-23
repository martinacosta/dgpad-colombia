Blockly.JavaScript['dgpad_actions_anchor'] = function(block) {
  var value_obj1 = Blockly.JavaScript.valueToCode(block, 'OBJ1', Blockly.JavaScript.ORDER_NONE);
  var value_obj2 = block.getFieldValue('NAME');
  // console.log(value_obj1);
  // console.log(value_obj2);
  if ((value_obj1 === "") || (value_obj2 === "")) return "";
  var code = 'Anchor("' + value_obj1 + '", "' + value_obj2 + '")';
  return code;
};

Blockly.JavaScript['dgpad_actions_unanchor'] = function(block) {
  var value_obj1 = Blockly.JavaScript.valueToCode(block, 'OBJ1', Blockly.JavaScript.ORDER_NONE);
  
  if (value_obj1 === "")  return "";
  var code = 'Unanchor("' + value_obj1 + '")';
  return code;
};

Blockly.JavaScript['dgpad_actions_iman'] = function(block) {
	
	var value_obj1 = Blockly.JavaScript.valueToCode(block, 'OBJ1', Blockly.JavaScript.ORDER_NONE);
    var value_obj2 = block.getFieldValue('NAME');
	// var value_im = block.getFieldValue('im');
	var value_im = Blockly.JavaScript.valueToCode(block, 'im', Blockly.JavaScript.ORDER_ATOMIC);
	
	if ((value_obj1 === "") || (value_obj2 === "")) return "";
	var code = 'imantar("' + value_obj1 + '","' + value_obj2 + '", '+ value_im + ')';
	
	return code;
	
};

Blockly.JavaScript['dgpad_actions_fixToPoint'] = function(block) {
	
	var value_obj1 = Blockly.JavaScript.valueToCode(block, 'OBJ1', Blockly.JavaScript.ORDER_NONE);
    var value_obj2 = Blockly.JavaScript.valueToCode(block, 'OBJ2', Blockly.JavaScript.ORDER_NONE);
	
	
	if ((value_obj1 === "") || (value_obj2 === "")) return "";
	var code = 'FixPointToPoint("' + value_obj1 + '","' + value_obj2 +  '")';
	
	return code;
	
};

Blockly.JavaScript['dgpad_actions_fix'] = function(block) {
	
	var value_obj1 = Blockly.JavaScript.valueToCode(block, 'OBJ1', Blockly.JavaScript.ORDER_NONE);
    if (value_obj1 === "")  return "";
	var code = 'FixPoint("' + value_obj1 + '")';
	
	return code;
	
};

Blockly.JavaScript['dgpad_actions_free'] = function(block) {
  var value_obj1 = Blockly.JavaScript.valueToCode(block, 'OBJ1', Blockly.JavaScript.ORDER_NONE);
  
  if (value_obj1 === "")  return "";
  var code = 'FreePoint("' + value_obj1 + '")';
  return code;
};

Blockly.JavaScript['dgpad_actions_move'] = function(block) {
  var value_obj1 = Blockly.JavaScript.valueToCode(block, 'OBJ1', Blockly.JavaScript.ORDER_NONE);
  var value_corx = Blockly.JavaScript.valueToCode(block, 'CorX', Blockly.JavaScript.ORDER_ATOMIC);
  var value_cory = Blockly.JavaScript.valueToCode(block, 'CorY', Blockly.JavaScript.ORDER_ATOMIC);
  if (value_obj1 === "") return "";
  
  if (value_corx !== "" && value_cory !== "") {
    var code = 'Move("' + value_obj1 + '", ' + value_corx + ', ' + value_cory + ')';
  } else {
    return "";
  }
  return code;
};

Blockly.JavaScript['dgpad_actions_animPause'] = function(block) {
  var code = 'AnimationPause()';
  return code;
};

Blockly.JavaScript['dgpad_actions_animStart'] = function(block) {
  var code = 'AnimationStart()';
  return code;
};