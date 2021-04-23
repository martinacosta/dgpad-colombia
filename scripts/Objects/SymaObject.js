//************************************************
//*************** MIDPOINT OBJECT ****************
//************************************************
function SymaObject(_construction, _name, _L, _P) {
  $U.extend(this, new PointObject(_construction, _name, 0, 0)); // Herencia
  var L = _L;
  var P = _P;
  // MEAG start
  var Cn = _construction;
  // MEAG end
  this.setParent(L, P)
  this.setFillStyle(2);

  this.getCode = function() {
    return "syma";
  };


  this.isMoveable = function() {
    return false;
  };


  this.compute = function() {
    L.reflect(P, this);
    // MEAG start
    if (!Cn.getFrame().ifObject(this.getName())) {
      Cn.getFrame().getTextCons(this);
    }
    // MEAG end
  };

  this.getSource = function(src) {
    if (this.execMacroSource(src)) return;
    src.geomWrite(false, this.getName(), "Reflection", L.getVarName(), P.getVarName());
  };

  // MEAG start
  this.getTextCons = function() {
    if (this.getParentLength()) {
      texto = "";
      texto = this.getName() + $L.object_syma_description_of + P.getVarName() + $L.object_syma_description_wrto + L.getVarName();
      parents = [P.getVarName(), L.getVarName()];
      return {
        "texto": texto,
        "parents": parents
      };
    }
  }
  // MEAG end

};
