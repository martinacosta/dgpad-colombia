//************************************************
//*************** MIDPOINT OBJECT ****************
//************************************************
function TranslationObject(_construction, _name, _v1, _P2) {
  $U.extend(this, new PointObject(_construction, _name, 0, 0)); // Herencia
  
  if (_v1.isInstanceType("point"))
  {
    var v1 = _P2;
    var P2 = _v1;
  }
  else
  {
    var v1 = _v1;
    var P2 = _P2;
  }
  // MEAG start
  var Cn = _construction;
  // MEAG end
  this.setParent(v1, P2)
  this.setFillStyle(2);

  this.getCode = function() {
    return "trans";
  };


  this.isMoveable = function() {
    return false;
  };


  this.compute = function() {
    //this.setXY(P2.getX() + v1.parents(1).getX() - v1.parents(0).getX(), P2.getY() + v1.parents(1).getY() - v1.parents(0).getY());
    //JDIAZ START
      this.setXY(P2.getX() + v1.getParent()[1].getX() - v1.getParent()[0].getX(), P2.getY() + v1.getParent()[1].getY() - v1.getParent()[0].getY());

    // MEAG start
    if (!Cn.getFrame().ifObject(this.getName())) {
      Cn.getFrame().getTextCons(this);
    }
    // MEAG end
  };

  this.getSource = function(src) {
    if (this.execMacroSource(src)) return;
    src.geomWrite(false, this.getName(), "Trans", P2.getVarName(), v1.getVarName());
  };

  // MEAG start
  this.getTextCons = function() {
    if (this.getParentLength()) {
      texto = "";
      texto = this.getName() + $L.object_trans_description_of + P2.getVarName() + $L.object_trans_description_wrto + v1.getVarName();
      parents = [P2.getVarName(), v1.getVarName()];
      return {
        "texto": texto,
        "parents": parents
      };
    }
  }
  // MEAG end

};
