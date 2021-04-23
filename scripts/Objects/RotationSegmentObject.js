//************************************************
//*************** Rotation Segment OBJECT ****************
//************************************************
function RotationSegmentObject(_construction, _name, _E, _S, _P) {
	
	
	rot1=new RotationPointObject(_construction, "_P", _E, _S.getP1(), _P);
	_construction.add(rot1);
	
	rot2= new RotationPointObject(_construction, "_P", _E, _S.getP2(), _P);
	
	_construction.add(rot2);
	
	$U.extend(this, new SegmentObject(_construction, _name, rot1, rot2)); // Herencia
  var E = _E;
  var S = _S;
  var center = _P;
  // MEAG start
  var Cn = _construction;
  
  
 this.setParent(E,S,center, rot1, rot2);

  this.getCode = function() {
    return "segment";
  };


  this.isMoveable = function() {
    return false;
  };


  this.compute = function() {
    rot1.compute();
	rot2.compute();
	
    // MEAG start
    if (!Cn.getFrame().ifObject(this.getName())) {
      Cn.getFrame().getTextCons(this);
    }
    // MEAG end
  };
  

  this.getSource = function(src) {
    // if (this.execMacroSource(src)) return;
    src.geomWrite(false, this.getName(), "Rotation", E.getVarName(), S.getVarName(), center.getVarName());
  };

  // MEAG start
  this.getTextCons = function() {
    if (this.getParentLength()) {
      texto = "";
      texto = this.getName() + $L.object_rotate_description_of + S.getVarName() + $L.object_rotate_description_wrto+center.getVarName()+ $L.object_rotate_description_angle+ E.getValue();
      parents = [S.getVarName(), E.getVarName(), center.getVarName()];
      return {
        "texto": texto,
        "parents": parents
      };
    }
  }
  // MEAG end

};
