//************************************************
//*************** MIDPOINT OBJECT ****************
//************************************************
function MidPointObject(_construction, _name, _P1, _P2) {
  $U.extend(this, new PointObject(_construction, _name, 0, 0)); // Herencia
  var P1 = _P1;
  var P2 = _P2;
  // MEAG start
  var Cn = _construction;
  // MEAG end
  this.setParent(P1, P2);
  this.setFillStyle(2);


  this.isMoveable = function() {
    return false;
  };

  this.getCode = function() {
    return "midpoint";
  };


  this.compute = function() {
    this.setXY((P1.getX() + P2.getX()) / 2, (P1.getY() + P2.getY()) / 2);
    // MEAG start
    if (!Cn.getFrame().ifObject(this.getName())) {
      Cn.getFrame().getTextCons(this);
    }
    // MEAG end
  };

  this.getSource = function(src) {
    if (this.execMacroSource(src)) return;
    src.geomWrite(false, this.getName(), "MidPoint", P1.getVarName(), P2.getVarName());
  };

  // MEAG start
  this.getTextCons = function() {
    if (this.getParentLength()) {
      texto = "";
      texto = this.getName() + $L.object_midpoint_description + P1.getVarName() + $L.object_midpoint_description_and + P2.getVarName();
      parents = [P1.getVarName(), P2.getVarName()];
      return {
        "texto": texto,
        "parents": parents
      };
    }
  }
  // MEAG end

};
