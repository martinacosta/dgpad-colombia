Blockly.Blocks['dgpad_actions_anchor'] = {
  init: function() {
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.appendValueInput("OBJ1")
      .appendField($L.blockly.actions_anchor);
    this.appendValueInput("OBJ2");
    this.setInputsInline(true);
    this.setOutput(false);
    this.setColour(320);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['dgpad_actions_move'] = {
  init: function() {
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.appendValueInput('OBJ1')
      .appendField($L.blockly.actions_move_1);
    this.appendDummyInput()
      .appendField($L.blockly.actions_move_2)
      .appendField(new Blockly.FieldDropdown([
          [$L.blockly.actions_move_3, 'COOR'],
          [$L.blockly.actions_move_4, 'OBJT']
        ],
        function(option) {
          if (option === 'COOR') {
            this.sourceBlock_.removeInput('OBJ2', true);
            this.sourceBlock_.removeInput('input_COOR', true);
            this.sourceBlock_.appendDummyInput('input_COOR')
              .appendField("X:")
              .appendField(new Blockly.FieldNumber(0, -50, 50, 0.1), 'CorX')
              .appendField("Y:")
              .appendField(new Blockly.FieldNumber(0, -50, 50, 0.1), 'CorY');
          } else if (option === 'OBJT') {
            this.sourceBlock_.removeInput('OBJ2', true);
            this.sourceBlock_.removeInput('input_COOR', true);
            this.sourceBlock_.appendValueInput('OBJ2')
          }
        },
        'TYPE'));
    this.appendDummyInput('input_COOR')
      .appendField("X:")
      .appendField(new Blockly.FieldNumber(0, -50, 50, 0.1), 'CorX')
      .appendField("Y:")
      .appendField(new Blockly.FieldNumber(0, -50, 50, 0.1), 'CorY');
    this.setInputsInline(true);
    this.setOutput(false);
    this.setColour(320);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
