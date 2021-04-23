//************************************************
//*************** homothety OBJECT ****************
//************************************************
function HomoPointObject(_construction, _name, _Ex, _P1, _P2) {
    $U.extend(this, new PointObject(_construction, _name, 0, 0)); // Herencia
    
    var factor = _Ex;
    var p1 = _P1;
    var p2 = _P2;
    var Cn = _construction;

    this.setParent(factor, p1, p2);
    this.setFillStyle(2);
    this.forceFillStyle(2);

    this.getCode = function() {
      return "point";
    };
	
    
	
    this.isMoveable = function() {
      return false;
    };
  
  
    this.compute = function() {
      var f = factor.getValue();
      this.setXY(f * (p1.getX() -  p2.getX()) + p2.getX(), f * (p1.getY() - p2.getY()) + p2.getY());
      //MEAG
      if (!Cn.getFrame().ifObject(this.getName())) {
        Cn.getFrame().getTextCons(this);
      } else {
        Cn.getFrame().updateTextCons(this);
      }
	}
      //MEAG
  
    this.getSource = function(src) {
      if (this.execMacroSource(src)) return;
      src.geomWrite(false, this.getName(), "Homothety", factor.getVarName(), p1.getVarName(), p2.getVarName());
    };
  
    // MEAG start
    this.getTextCons = function() {
      if (this.getParentLength()) {
        texto = "";
        texto = this.getName() + $L.object_homothety_description_of + p1.getVarName() + $L.object_homothety_description_wrto + p2.getVarName()+$L.object_homothety_description_ratio+factor.getValue();
        parents = [factor.getVarName(), p1.getVarName(), p2.getVarName()];
        return {
          "texto": texto,
          "parents": parents
        };
      }
    }
    // MEAG end
  
  };