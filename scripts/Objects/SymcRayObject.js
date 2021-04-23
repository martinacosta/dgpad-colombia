//************************************************
//*************** Symmetry Ray OBJECT ****************
//************************************************
function SymcRayObject(_construction, _name, _P, _Sr) {
	ext1=new SymcPointObject(_construction, "_P", _P, _Sr.getP1());
	_construction.add(ext1);
	ext2= new SymcPointObject(_construction, "_P", _P, _Sr.getP2());
	
	_construction.add(ext2);
	var superObject = new RayObject(_construction, _name, ext1, ext2)
	$U.extend(this, superObject); // Herencia
  var P = _P;
  var Sr = _Sr;
  // MEAG start
  var Cn = _construction;
  // MEAG end
  this.setParent(P, Sr, ext1, ext2);
 
 

  this.getCode = function() {
    return "ray";
  };


  this.isMoveable = function() {
    return false;
  };


  this.compute = function() {
   ext1.compute();
   ext2.compute();
   
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
    src.geomWrite(false, this.getName(), "Symmetry", P.getVarName(), Sr.getVarName());
  };

  // MEAG start
  this.getTextCons = function() {
    if (this.getParentLength()) {
      texto = "";
      texto = this.getName() + $L.object_syma_description_of + Sr.getVarName() + $L.object_syma_description_wrto + P.getVarName();
      parents = [Sr.getVarName(), P.getVarName()];
      return {
        "texto": texto,
        "parents": parents
      };
    }
  }
  // MEAG end

};
