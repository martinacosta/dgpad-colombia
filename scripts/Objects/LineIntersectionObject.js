//************************************************
//*********** LINE INTERSECTION OBJECT ***********
//************************************************
function LineIntersectionObject(_construction, _name, _O1, _O2) {
    $U.extend(this, new PointObject(_construction, _name, 0, 0)); // Herencia
    
    var o1 = _O1;
    var o2 = _O2;
    var Cn = _construction;

    this.setParent(o1, o2);

    this.setFillStyle(2);
    this.forceFillStyle(2);

    this.getCode = function() {
      return "line int";
    };
  
    this.isMoveable = function() {
      return false;
    };
  
    this.getSource = function(src) {
      if (this.execMacroSource(src)) return;
      src.geomWrite(false, this.getName(), "Intersect", o1.getVarName(), o2.getVarName());
    };
  
    // MEAG start
    this.getTextCons = function() {
      if (this.getParentLength()) {
        texto = "";
        parents = [o1.getVarName(), o2.getVarName()];
		texto = this.getName() + $L.object_intersectionpoint_description + this.getParentAt(0).getVarName() + $L.object_intersectionpoint_description_secondObjetc + this.getParentAt(1).getVarName();
        return {
          "texto": texto,
          "parents": parents
        };
      }
    }
    // MEAG end
  
  };