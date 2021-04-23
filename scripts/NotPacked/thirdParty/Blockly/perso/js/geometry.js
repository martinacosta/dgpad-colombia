Blockly.JavaScript['dgpad_construction'] = function(block) {
    var statements = Blockly.JavaScript.statementToCode(block, 'CONTENT');
    return "@CONST@" + statements + "@CONST@"
}

Blockly.JavaScript['dgpad_point'] = function(block) {
    var name = block.getFieldValue('name');
    var cod = name + "=Point(\"" + name + "\"," + block.cx + "," + block.cy + ");\n";
    switch (block.blocktype) {
        case "pointon":
            cod = name + "=PointOn(\"" + name + "\"," + block.getFieldValue('obj1') + ",0);\n";
            break;
        case "intersect":
            cod = name + "=OrderedIntersection(\"" + name + "\"," + block.getFieldValue('obj1') + "," + block.getFieldValue('obj2') + ",0);\n";
            break;
        case "coords":
            cod = name + "=Point(\"" + name + "\"," + block.getFieldValue('obj1') + "," + block.getFieldValue('obj2') + ");\n";
            break;
        case "exp":
            cod = name + "=Point(\"" + name + "\",\"" + block.getFieldValue('obj1') + "\",\"0\");\n";
            break;
    }
    cod += "STL(" + name + ",\"sn:true\");\n";
    return cod;
}



Blockly.JavaScript['dgpad_segment'] = function(block) {
    var A = block.getFieldValue('a'),
        B = block.getFieldValue('b');
    var name = "_s";
   // name = "b32_" + $U.base64_encode(name).replace(/\=/g, "")
//    var cod = name + "=Segment(\"" + name + "\"," + A + "," + B + ");\n";  //linea original
    var cod = name + "=Segment(\"" + name + "\", \"" + A + "\", \"" + B + "\");\n";
    return cod;
}

Blockly.JavaScript['segmento'] = function(block) {
  var A = Blockly.JavaScript.valueToCode(block, 'ext1', Blockly.JavaScript.ORDER_ATOMIC);
  var B = Blockly.JavaScript.valueToCode(block, 'ext2', Blockly.JavaScript.ORDER_ATOMIC);
  var name = "_s";
    //name = "b32_" + $U.base64_encode(name).replace(/\=/g, "")
//    var cod = name + "=Segment(\"" + name + "\"," + A + "," + B + ");\n";  //linea original
    var cod = name + "=Segment(\"" + name + "\", \"" + A + "\", \"" + B + "\");\n";
    return cod;
}


Blockly.JavaScript['dgpad_droite'] = function(block) {
    var A = block.getFieldValue('a'),
        B = block.getFieldValue('b');
    var name = "_r" ;
    //name = "b32_" + $U.base64_encode(name).replace(/\=/g, "")
    var cod = name + "=Line(\"" + name + "\",\"" + A + "\",\"" + B + "\");\n";
    return cod;
}

Blockly.JavaScript['dgpad_anglebiss'] = function(block) {
    var A = block.getFieldValue('a'),
        B = block.getFieldValue('b'),
        C = block.getFieldValue('c');
    var name = "_sr";
    //name = "b32_" + $U.base64_encode(name).replace(/\=/g, "")
    var cod = name + "=AngleBisector(\"" + name + "\",\"" + A + "\",\"" + B + "\",\"" + C + "\");\n";
    return cod;
}

Blockly.JavaScript['dgpad_plumb'] = function(block) {
    var AB = block.getFieldValue('a'),
        C = block.getFieldValue('c');
    var name = "_r";
    //name = "b32_" + $U.base64_encode(name).replace(/\=/g, "")
    var cod = name + "=Plumb(\"" + name + "\",\""+ AB + "\",\"" + C + "\");\n";
    return cod;
}

Blockly.JavaScript['dgpad_circle'] = function(block) {
    var A = block.getFieldValue('a'),
        B = block.getFieldValue('b'),
        C = block.getFieldValue('c');
    // var name = "T("+AB+" "+C+")";
    // name="A_"+$U.base32.encode(name).replace(/\=/g,"")
    var cod = A + "=Circle(\"" + A + "\"," + B + "," + C + ");\n";
    return cod;
}





