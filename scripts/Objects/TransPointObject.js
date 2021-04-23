//************************************************
//*************** Translation POINT OBJECT ****************
//************************************************
function TransPointObject(_construction, _name, _v1, _P2) {
  $U.extend(this, new PointObject(_construction, _name)); // Herencia
  
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
  
  this.setXY(P2.getX() + v1.getParent()[1].getX() - v1.getParent()[0].getX(), P2.getY() + v1.getParent()[1].getY() - v1.getParent()[0].getY());

  this.getCode = function() {
    return "point";
  };


  this.isMoveable = function() {
    return false;
  };


  this.compute = function() {
    
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
    src.geomWrite(false, this.getName(), "Translation", v1.getVarName(),P2.getVarName() );
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
