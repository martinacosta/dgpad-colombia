Blockly.JavaScript['dgpad_actions_anchor'] = function(block) {
  var value_obj1 = Blockly.JavaScript.valueToCode(block, 'OBJ1', Blockly.JavaScript.ORDER_NONE);
  var value_obj2 = Blockly.JavaScript.valueToCode(block, 'OBJ2', Blockly.JavaScript.ORDER_NONE);
  if ((value_obj1 === "") || (value_obj2 === "")) return "";
  var code = 'Anchor("' + value_obj1 + '", "' + value_obj2 + '")';
  return code;
};

Blockly.JavaScript['dgpad_actions_move'] = function(block) {
  var value_obj1 = Blockly.JavaScript.valueToCode(block, 'OBJ1', Blockly.JavaScript.ORDER_NONE);
  var value_obj2 = Blockly.JavaScript.valueToCode(block, 'OBJ2', Blockly.JavaScript.ORDER_NONE);
  var value_corx = block.getFieldValue('CorX');
  var value_cory = block.getFieldValue('CorY');
  if (value_obj1 === "") return "";
  if (value_obj2 !== "") {
    var code = 'Move("' + value_obj1 + '", "' + value_obj2 + '")';
  } else if (value_corx !== "" && value_cory !== "") {
    var code = 'Move("' + value_obj1 + '", ' + value_corx + ', ' + value_cory + ')';
  } else {
    return "";
  }
  return code;
};
