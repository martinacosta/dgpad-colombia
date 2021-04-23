//************************************************
//*************** MIDPOINT OBJECT ****************
//************************************************
function RotationObject(_construction, _name, _Ex, _P1, _P2) {
    $U.extend(this, new PointObject(_construction, _name, 0, 0)); // Herencia
    
    var p1 = _P1;
    var p2 = _P2;
    var angle = _Ex;
    var Cn = _construction;

    this.setParent(p1, p2, angle);

    this.setFillStyle(2);
    this.forceFillStyle(2);

    this.getCode = function() {
      return "rot";
    };
  
    this.isMoveable = function() {
      return false;
    };
  
  
    this.compute = function() {
      var x_temp; 
      var y_temp;
      var rad;

      rad = -angle.getValue() / 180 * Math.PI;
      x_temp = p1.getX() - p2.getX();
      y_temp = p1.getY() - p2.getY();
      this.setXY(x_temp * Math.cos(rad) - y_temp * Math.sin(rad) + p2.getX(), x_temp * Math.sin(rad) + y_temp * Math.cos(rad) + p2.getY());
      if (!Cn.getFrame().ifObject(this.getName())) {
        Cn.getFrame().getTextCons(this);
      }
    };
  
    this.getSource = function(src) {
      if (this.execMacroSource(src)) return;
      src.geomWrite(false, this.getName(), "Rotate", angle.getVarName(), p1.getVarName(), p2.getVarName());
    };
  
    // MEAG start
    this.getTextCons = function() {
      if (this.getParentLength()) {
        texto = "";
        texto = this.getName() + $L.object_rotate_description_of + p1.getVarName() + $L.object_rotate_description_wrto + p2.getVarName()+$L.object_rotate_description_angle+angle.getValue();
        parents = [angle.getVarName(), p1.getVarName(), p2.getVarName()];
        return {
          "texto": texto,
          "parents": parents
        };
      }
    }
    // MEAG end
  
  };