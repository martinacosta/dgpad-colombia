//************************************************
//*************** Rotation Line OBJECT ****************
//************************************************
function RotationLineObject(_construction, _name, _E, _R, _P) {
	
	var E = _E;
	var R = _R;
	var P = _P;
	pun1=R.getP1();

	rot1 = new RotationPointObject(_construction, "_P", E, pun1, P);
	_construction.add(rot1);
	
	
    var superObject = $U.extend(this, new PrimitiveLineObject(_construction, _name, rot1));
	
	
	
  
  this.setParent(E,R,P,rot1);
  
  
  
  // MEAG start
  var Cn = _construction;
  // MEAG end
 
  

  this.getCode = function() {
    return "line";
  };


  this.isMoveable = function() {
    return false;
  };


  this.compute = function() {
	ang=-E.getValue()/ 180 * Math.PI;
	rot1.compute();
	this.setDXDY (0, 0, R.getDX()*Math.cos(ang)-R.getDY()*Math.sin(ang),R.getDX()*Math.sin(ang)+ R.getDY()*Math.cos(ang));
	superObject.compute();
    // MEAG start
    if (!Cn.getFrame().ifObject(this.getName())) {
      Cn.getFrame().getTextCons(this);
    }
    // MEAG end
  };

  this.getSource = function(src) {
    // if (this.execMacroSource(src)) return;
    src.geomWrite(false, this.getName(), "Rotation", E.getVarName(), R.getVarName(), P.getVarName());
  };

  // MEAG start
  this.getTextCons = function() {
    if (this.getParentLength()) {
      texto = "";
      texto = this.getName() + $L.object_rotate_description_of + R.getVarName() + $L.object_rotate_description_wrto + P.getVarName()+$L.object_rotate_description_angle + E.getValue();;
      parents = [R.getVarName(), E.getVarName(), P.getVarName()];
      return {
        "texto": texto,
        "parents": parents
      };
    }
  }
  // MEAG end

};
