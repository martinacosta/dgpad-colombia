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
        this.appendDummyInput('obj_name')
            .appendField(Blockly.dgpad.objectPopup("expression"), "NAME");
			
		
    this.setInputsInline(true);
    this.setOutput(false);
    this.setColour(320);
    this.setTooltip('');
    this.setHelpUrl('');
	setTimeout(function() {
            var tpe = me.getInput('obj_type').fieldRow[0].getValue();
            var nme = me.getInput('obj_name').fieldRow[0].getValue();
            me.removeInput('obj_name');
            me.appendDummyInput('obj_name')
                .appendField(Blockly.dgpad.objectPopup(tpe), "NAME");
            me.getInput('obj_name').fieldRow[0].setValue(nme);
        }, 0);
    },
    updateShape_: function(tpe) {
        if (this.getInput('obj_name')) {
            this.removeInput('obj_name');
        };
        try {
            this.appendDummyInput('obj_name')
                .appendField(Blockly.dgpad.objectPopup(tpe), "NAME");
        } catch (e) {}
    },
    getName: function(_o) {
        this.getInput('obj_type').fieldRow[0].setValue(_o.getCode());
        this.updateShape_(_o.getCode());
        this.getInput('obj_name').fieldRow[0].setValue(_o.getName());
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
      .appendField($L.blockly.actions_iman);
	this.appendDummyInput()
        .appendField($L.blockly.actions_anchor_2);
    this.appendDummyInput('obj_type')
		.appendField(drop, "TYPE");   
    // this.appendDummyInput()
        // .appendField(" ");
    this.appendDummyInput('obj_name')
        .appendField(Blockly.dgpad.objectPopup("expression"), "NAME");
	
	this.appendValueInput("im")
	  .setCheck('Number')
	  .appendField($L.blockly.actions_iman_2);  
	this.appendDummyInput()
       .appendField("px");
    this.setInputsInline(true);
    this.setOutput(false);
    this.setColour(320);
    this.setTooltip('');
    this.setHelpUrl('');
	setTimeout(function() {
            var tpe = me.getInput('obj_type').fieldRow[0].getValue();
            var nme = me.getInput('obj_name').fieldRow[0].getValue();
            //me.removeInput('obj_name');
            me.getInput('obj_name').fieldRow[0].removeField("NAME");
			me.getInput('obj_name').fieldRow[0].insertField(Blockly.dgpad.objectPopup(tpe), "NAME");
            me.getInput('obj_name').fieldRow[0].setValue(nme);
        }, 0);
    },
    updateShape_: function(tpe) {
        
		if (this.getInput('obj_name')) {
            this.getInput('obj_name').removeField("NAME",true);
			//this.removeInput('obj_name');
        };
        try {
            this.getInput('obj_name').appendField(Blockly.dgpad.objectPopup(tpe), "NAME");
			//this.appendDummyInput('obj_name')
              // .appendField(Blockly.dgpad.objectPopup(tpe), "NAME");
        } catch (e) {}
    },
    getName: function(_o) {
        this.getInput('obj_type').fieldRow[0].setValue(_o.getCode());
        this.updateShape_(_o.getCode());
        this.getInput('obj_name').fieldRow[0].setValue(_o.getName());
    }
  
};

Blockly.Blocks['dgpad_actions_fixToPoint'] = {
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

Blockly.Blocks['dgpad_actions_fix'] = {
  init: function() {
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.appendValueInput("OBJ1")
      .appendField($L.blockly.actions_fix);
    this.setInputsInline(true);
    this.setOutput(false);
    this.setColour(320);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['dgpad_actions_free'] = {
  init: function() {
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.appendValueInput("OBJ1")
      .appendField($L.blockly.actions_free);
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
      
    this.appendValueInput('CorX')
      //.setCheck('Number');
	this.appendValueInput('CorY')
      //.setCheck('Number');
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