//************************************************
//*************** Reflection Ray OBJECT ****************
//************************************************
function SymaRayObject(_construction, _name, _L, _S) {
	ext1=new SymaPointObject(_construction, "_P", _L, _S.getP1());
	_construction.add(ext1);
	ext2= new SymaPointObject(_construction, "_P", _L, _S.getP2());
	_construction.add(ext2);

  var superObject = new RayObject(_construction, _name, ext1, ext2)
	$U.extend(this, superObject); // Herencia
	// _construction.add(ray);

  var L = _L;
  var S = _S;
  // MEAG start
  var Cn = _construction;
  // MEAG end
  this.setParent(L, S, ext1, ext2);
 

  this.getCode = function() {
    return "ray";
  };


  this.isMoveable = function() {
    return false;
  };


  this.compute = function() {
    
    // MEAG start
    if (!Cn.getFrame().ifObject(this.getName())) {
      Cn.getFrame().getTextCons(this);
    }
    // MEAG end
	this.setDXDY(this.P1.getX(), this.P1.getY(), this.P2.getX(), this.P2.getY());
    superObject.compute();
  };
  

  this.getSource = function(src) {
    // if (this.execMacroSource(src)) return;
    src.geomWrite(false, this.getName(), "Reflection", L.getVarName(), S.getVarName());
  };

  // MEAG start
  this.getTextCons = function() {
    if (this.getParentLength()) {
      texto = "";
      texto = this.getName() + $L.object_syma_description_of + S.getVarName() + $L.object_syma_description_wrto + L.getVarName();
      parents = [S.getVarName(), L.getVarName()];
      return {
        "texto": texto,
        "parents": parents
      };
    }
  }
  // MEAG end

};
