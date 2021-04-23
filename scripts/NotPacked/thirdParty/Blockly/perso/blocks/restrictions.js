Blockly.Blocks['dgpad_restrictions_ShowCtrl'] = {
  init: function() {
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.appendValueInput("BOOL")
      .appendField($L.blockly.restrictions_CtrlPanel);
    this.setInputsInline(true);
    this.setOutput(false);
    this.setColour(47);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['dgpad_restrictions_Mode'] = {
  init: function() {
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.appendValueInput("BOOL")
      .appendField($L.blockly.restrictions_Mode);
    this.setInputsInline(true);
    this.setOutput(false);
    this.setColour(47);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['dgpad_restrictions_disableButton'] = {
  init: function() {
    
	this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.appendDummyInput()
		.appendField($L.blockly.restrictions_disableButton)
            .appendField(new Blockly.FieldDropdown([[$L.button_title_arrow,"arrow"], [$L.button_title_gomme,"hide"], [$L.button_title_trash,"trash"],[$L.button_title_macros,"macros"],[$L.button_title_calc , "calc"],[$L.button_title_tex , "tex"],[$L.button_title_properties , "properties"],[$L.button_title_history , "history"],[$L.button_title_copy,"copy"],[$L.button_title_name,"name"],[$L.button_title_grid,"grid"],[$L.button_title_zoom,"zoom"],[$L.button_title_lPress,"lPress"],[$L.button_title_undo,"undo"],[$L.button_title_redo,"redo"]]), "BUTTON");

    this.setInputsInline(true);
    this.setOutput(false);
    this.setColour(47);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['dgpad_restrictions_enableButton'] = {
  init: function() {
    
	this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.appendDummyInput()
		.appendField($L.blockly.restrictions_enableButton)
            .appendField(new Blockly.FieldDropdown([[$L.button_title_arrow,"arrow"], [$L.button_title_gomme,"hide"], [$L.button_title_trash,"trash"],[$L.button_title_macros,"macros"],[$L.button_title_calc , "calc"],[$L.button_title_tex , "tex"],[$L.button_title_properties , "properties"],[$L.button_title_history , "history"],[$L.button_title_copy,"copy"],[$L.button_title_name,"name"],[$L.button_title_grid,"grid"],[$L.button_title_zoom,"zoom"],[$L.button_title_lPress,"lPress"],[$L.button_title_undo,"undo"],[$L.button_title_redo,"redo"]]), "BUTTON");

    this.setInputsInline(true);
    this.setOutput(false);
    this.setColour(47);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['dgpad_restrictions_Zoom'] = {
  init: function() {
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.appendValueInput("BOOL")
      .appendField($L.blockly.restrictions_zoom);
    this.setInputsInline(true);
    this.setOutput(false);
    this.setColour(47);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['dgpad_restrictions_disableTool'] = {
  init: function() {
    
	this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.appendDummyInput()
		.appendField($L.blockly.restrictions_disableTool)
            .appendField(new Blockly.FieldDropdown([[$L.tool_title_anchor,"anchor"], [$L.tool_title_angle,"angle"], [$L.tool_title_anglebiss,"anglebiss"],[$L.tool_title_arc3pts,"arc3pts"],[$L.tool_title_area , "area"],[$L.tool_title_blockly , "@blockly"],[$L.tool_title_callcalc , "@callcalc"],[$L.tool_title_calldepends , "@calldepends"],[$L.tool_title_callhide,"@callhide"],[$L.tool_title_calllist,"@calllist"],[$L.tool_title_callmagnet,"@callmagnet"],[$L.tool_title_callproperty,"@callproperty"],[$L.tool_title_calltrash,"@calltrash "],[$L.tool_title_callvalue,"@callvalue"],[$L.tool_title_circle,"circle"],[$L.tool_title_circle1,"circle1"],[$L.tool_title_circle3,"circle3"],[$L.tool_title_circle3pts,"circle3pts"],[$L.tool_title_dgscriptname,"dgscriptname"],[$L.tool_title_doceval,"doceval"],[$L.tool_title_fixedangle,"fixedangle"],[$L.tool_title_floatingobject,"floatingobject"],[$L.tool_title_homothety,"homothety"],[$L.tool_title_intersect,"intersect"],[$L.tool_title_line,"line"],[$L.tool_title_locus,"locus"],[$L.tool_title_midpoint,"midpoint"],[$L.tool_title_namemover,"namemover"],[$L.tool_title_noanchor,"noanchor"],[$L.tool_title_objectmover,"objectmover"],[$L.tool_title_parallel,"parallel"],[$L.tool_title_perpbisector,"perpbisector"],[$L.tool_title_plumb,"plumb"],[$L.tool_title_point,"point"],[$L.tool_title_ray,"ray"],[$L.tool_title_removevalue,"@removevalue"],[$L.tool_title_rotate,"rotate"],[$L.tool_title_segment,"segment"],[$L.tool_title_spring,"spring"],[$L.tool_title_syma,"syma"],[$L.tool_title_symc,"symc"],[$L.tool_title_trans,"trans"],[$L.tool_title_vector,"vector"]]), "TOOL");

    this.setInputsInline(true);
    this.setOutput(false);
    this.setColour(47);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['image_dropdown'] = {
  init: function() {
    var input = this.appendDummyInput()
        .appendField('flag');
    var options = [
        ['none', 'NONE'],
        [{'src': 'NotPacked/thirdParty/images/controls/canada.png', 'width': 40, 'height': 40, 'alt': 'Arrow'}, 'arrow'],
        [{'src': 'usa.png', 'width': 50, 'height': 25, 'alt': 'USA'}, 'USA'],
        [{'src': 'mexico.png', 'width': 50, 'height': 25, 'alt': 'Mexico'}, 'MEXICO']
    ];
    input.appendField(new Blockly.FieldDropdown(options), 'FLAG');
  }
};

Blockly.Blocks['dgpad_restrictions_enableTool'] = {
  init: function() {
    
	this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.appendDummyInput()
		.appendField($L.blockly.restrictions_enableTool)
            .appendField(new Blockly.FieldDropdown([[$L.tool_title_anchor,"anchor"], [$L.tool_title_angle,"angle"], [$L.tool_title_anglebiss,"anglebiss"],[$L.tool_title_arc3pts,"arc3pts"],[$L.tool_title_area , "area"],[$L.tool_title_blockly , "@blockly"],[$L.tool_title_callcalc , "@callcalc"],[$L.tool_title_calldepends , "@calldepends"],[$L.tool_title_callhide,"@callhide"],[$L.tool_title_calllist,"@calllist"],[$L.tool_title_callmagnet,"@callmagnet"],[$L.tool_title_callproperty,"@callproperty"],[$L.tool_title_calltrash,"@calltrash "],[$L.tool_title_callvalue,"@callvalue"],[$L.tool_title_circle,"circle"],[$L.tool_title_circle1,"circle1"],[$L.tool_title_circle3,"circle3"],[$L.tool_title_circle3pts,"circle3pts"],[$L.tool_title_dgscriptname,"dgscriptname"],[$L.tool_title_doceval,"doceval"],[$L.tool_title_fixedangle,"fixedangle"],[$L.tool_title_floatingobject,"floatingobject"],[$L.tool_title_homothety,"homothety"],[$L.tool_title_intersect,"intersect"],[$L.tool_title_line,"line"],[$L.tool_title_locus,"locus"],[$L.tool_title_midpoint,"midpoint"],[$L.tool_title_namemover,"namemover"],[$L.tool_title_noanchor,"noanchor"],[$L.tool_title_objectmover,"objectmover"],[$L.tool_title_parallel,"parallel"],[$L.tool_title_perpbisector,"perpbisector"],[$L.tool_title_plumb,"plumb"],[$L.tool_title_point,"point"],[$L.tool_title_ray,"ray"],[$L.tool_title_removevalue,"@removevalue"],[$L.tool_title_rotate,"rotate"],[$L.tool_title_segment,"segment"],[$L.tool_title_spring,"spring"],[$L.tool_title_syma,"syma"],[$L.tool_title_symc,"symc"],[$L.tool_title_trans,"trans"],[$L.tool_title_vector,"vector"]]), "TOOL");

    this.setInputsInline(true);
    this.setOutput(false);
    this.setColour(47);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['dgpad_restrictions_fixOx'] = {
  init: function() {
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.appendValueInput("BOOL")
      .appendField($L.blockly.restrictions_fixOx);
    this.setInputsInline(true);
    this.setOutput(false);
    this.setColour(47);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['dgpad_restrictions_fixOy'] = {
  init: function() {
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.appendValueInput("BOOL")
      .appendField($L.blockly.restrictions_fixOy);
    this.setInputsInline(true);
    this.setOutput(false);
    this.setColour(47);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['dgpad_restrictions_fixOxOy'] = {
  init: function() {
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.appendValueInput("BOOL")
      .appendField($L.blockly.restrictions_fixOxOy);
    this.setInputsInline(true);
    this.setOutput(false);
    this.setColour(47);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['dgpad_restrictions_setSystem'] = {
  init: function() {
    this.setPreviousStatement(true);
    this.setNextStatement(true);
	this.appendDummyInput()
        .appendField($L.blockly.restrictions_setSystem);
    this.appendValueInput("min_abs")
      .appendField($L.blockly.restrictions_minAbs);
	this.appendValueInput("max_abs")
      .appendField($L.blockly.restrictions_maxAbs);
	this.appendValueInput("max_ords")
      .appendField($L.blockly.restrictions_maxOrds);
    this.setInputsInline(false);
    this.setOutput(false);
    this.setColour(47);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['dgpad_restrictions_SystemProperties'] = {
  init: function() {
    this.setPreviousStatement(true);
    this.setNextStatement(true);
	this.appendDummyInput()
        .appendField($L.blockly.restrictions_SystemProperties);
    this.appendValueInput("font")
      .appendField($L.blockly.restrictions_SystemFont);
	this.appendValueInput("axesWidth")
      .appendField($L.blockly.restrictions_axesWidth);
	this.appendValueInput("gridWidth")
      .appendField($L.blockly.restrictions_gridWidth);
	this.appendValueInput("gridShow")
      .appendField($L.blockly.restrictions_gridShow);
	this.appendValueInput("oxShow")
      .appendField($L.blockly.restrictions_oxShow);
	this.appendValueInput("oyShow")
      .appendField($L.blockly.restrictions_oyShow);
	this.appendValueInput("fixOx")
      .appendField($L.blockly.restrictions_fixOx);
	this.appendValueInput("fixOy")
      .appendField($L.blockly.restrictions_fixOy);
	this.appendValueInput("onlyPos")
      .appendField($L.blockly.restrictions_onlyPos);
	this.appendValueInput("zoomOrigin")
      .appendField($L.blockly.restrictions_zoomOrigin);
    this.setInputsInline(false);
    this.setOutput(false);
    this.setColour(47);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};