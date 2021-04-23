//************************************************
//*************** symmetric Point OBJECT ****************
//************************************************
function SymcPointObject(_construction, _name, _P1, _P2) {
  $U.extend(this, new PointObject(_construction, _name, 0, 0)); // Herencia
  var P1 = _P1;
  var P2 = _P2;
  // MEAG start
  var Cn = _construction;
  // MEAG end
  this.setParent(P1, P2)
  this.setFillStyle(2);

  this.getCode = function() {
    return "point";
  };


  this.isMoveable = function() {
    return false;
  };


  this.compute = function() {
    this.setXY(2 * P1.getX() - P2.getX(), 2 * P1.getY() - P2.getY());
    // MEAG start
    if (!Cn.getFrame().ifObject(this.getName())) {
      Cn.getFrame().getTextCons(this);
    }
    // MEAG end
  };

  this.getSource = function(src) {
    if (this.execMacroSource(src)) return;
    src.geomWrite(false, this.getName(), "Symmetry", P1.getVarName(), P2.getVarName());
  };

  // MEAG start
  this.getTextCons = function() {
    if (this.getParentLength()) {
      texto = "";
      texto = this.getName() + $L.object_symc_description_of + P2.getVarName() + $L.object_symc_description_wrto + P1.getVarName();
      parents = [P2.getVarName(), P1.getVarName()];
      return {
        "texto": texto,
        "parents": parents
      };
    }
  }
  // MEAG end

};
