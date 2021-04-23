Blockly.Blocks['dgpad_actions_anchor'] = {
  init: function() {
	var types = [];
        var me = this;
        for (key in $L.blockly.o3) {
            types.push([$L.blockly.o3[key], key])
        }
        // Avoid blockly to automatically transform dropdown menu :
        types[0][0] = " " + types[0][0];
        var drop = new Blockly.FieldDropdown(types, function(option) {
            this.sourceBlock_.updateShape_(option);
        });
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.appendValueInput("OBJ1")
      .appendField($L.blockly.actions_anchor);
	this.appendDummyInput('obj_type')
		.appendField($L.blockly.actions_anchor_2)
            .appendField(drop, "TYPE");   
    this.appendDummyInput()
            .appendField(" ");
        this.appendDummyInput("OBJ2")
            .appendField(Blockly.dgpad.objectPopup("expression"), "NAME");
		
    this.setInputsInline(true);
    this.setOutput(false);
    this.setColour(320);
    this.setTooltip('');
    this.setHelpUrl('');
	setTimeout(function() {
            var tpe = me.getInput('obj_type').fieldRow[0].getValue();
            var nme = me.getInput("OBJ2").fieldRow[0].getValue();
            me.removeInput("OBJ2");
            me.appendDummyInput("OBJ2")
                .appendField(Blockly.dgpad.objectPopup(tpe), "NAME");
            me.getInput("OBJ2").fieldRow[0].setValue(nme);
        }, 0);
    },
    updateShape_: function(tpe) {
        if (this.getInput("OBJ2")) {
            this.removeInput("OBJ2");
        };
        try {
            this.appendDummyInput("OBJ2")
                .appendField(Blockly.dgpad.objectPopup(tpe), "NAME");
        } catch (e) {}
    },
    getName: function(_o) {
        this.getInput('obj_type').fieldRow[0].setValue(_o.getCode());
        this.updateShape_(_o.getCode());
        this.getInput("OBJ2").fieldRow[0].setValue(_o.getName());
    }
  
  
};

Blockly.Blocks['dgpad_actions_unanchor'] = {
  init: function() {
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.appendValueInput("OBJ1")
      .appendField($L.blockly.actions_unanchor);
    this.setOutput(false);
    this.setColour(320);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['dgpad_actions_iman'] = {
  init: function() {
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.appendValueInput("OBJ1")
      .appendField($L.blockly.actions_iman);
    this.appendValueInput("OBJ2")
	  .appendField("a");
	this.appendValueInput("im")
	  .setCheck('Number')
	  .appendField("con una fuerza de");  
	this.appendDummyInput()
       .appendField("px");
    this.setInputsInline(true);
    this.setOutput(false);
    this.setColour(320);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['dgpad_actions_fix'] = {
  init: function() {
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.appendValueInput("OBJ1")
      .appendField($L.blockly.actions_fix);
    this.appendValueInput("OBJ2")
	  .appendField($L.blockly.actions_fix_2);
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

Blockly.Blocks['dgpad_actions_animPause'] = {
  init: function() {
    this.setPreviousStatement(true);
    this.setNextStatement(true);
	this.appendDummyInput()
        .appendField("Pausar animaciones");
    this.setOutput(false);
    this.setColour(320);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['dgpad_actions_animStart'] = {
  init: function() {
    this.setPreviousStatement(true);
    this.setNextStatement(true);
	this.appendDummyInput()
        .appendField("Reanudar animaciones");
    this.setOutput(false);
    this.setColour(320);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};