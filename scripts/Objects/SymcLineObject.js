//************************************************
//*************** Homothety Line OBJECT ****************
//************************************************
function SymcLineObject(_construction, _name, _P, _R) {
	
	var P = _P;
	var R = _R;
	pun1=R.getP1();

	trans1 = new SymcPointObject(_construction, "_P", _P, pun1);
	_construction.add(trans1);
	
	
    var superObject = $U.extend(this, new PrimitiveLineObject(_construction, _name, trans1));
	
	
	
  
  this.setParent(P,R, trans1);
  // this.setDXDY (0, 0, R.getNDX(), R.getNDY());
  
  
  // MEAG start
  var Cn = _construction;
  // MEAG end
 
  

  this.getCode = function() {
    return "line";
  };


  this.isMoveable = function() {
    return false;
  };


  this.compute = function() {
	 trans1.compute(); 
	this.setDXDY (0, 0, R.getDX(), R.getDY());
	superObject.compute();
    // MEAG start
    if (!Cn.getFrame().ifObject(this.getName())) {
      Cn.getFrame().getTextCons(this);
    }
    // MEAG end
  };

  this.getSource = function(src) {
    // if (this.execMacroSource(src)) return;
    src.geomWrite(false, this.getName(), "Symmetry", P.getVarName(), R.getVarName());
  };

  // MEAG start
  this.getTextCons = function() {
    if (this.getParentLength()) {
      texto = "";
      texto = this.getName() + $L.object_syma_description_of + R.getVarName() + $L.object_syma_description_wrto + P.getVarName();
      parents = [R.getVarName(), P.getVarName()];
      return {
        "texto": texto,
        "parents": parents
      };
    }
  }
  // MEAG end

};
