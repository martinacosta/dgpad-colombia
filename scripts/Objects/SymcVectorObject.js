//************************************************
//*************** Symmetric vector OBJECT ****************
//************************************************
function SymcVectorObject(_construction, _name, _L, _S) {
	
	
	ext1=new SymcPointObject(_construction, "_P", _L, _S.getP1());
	_construction.add(ext1);
	var ens=ext1.getValue();
	ext2= new SymcPointObject(_construction, "_P", _L, _S.getP2());
	
	_construction.add(ext2);
	var ens2=ext2.getValue();
	
	// ext1.setFillStyle(2);
	// ext2.setFillStyle(2);
	$U.extend(this, new VectorObject(_construction, "_v", ext1, ext2)); // Herencia
  var L = _L;
  var S = _S;
  // MEAG start
  var Cn = _construction;
  // MEAG end
  // this.setParent(L, P);
  this.setParent(L, S, ext1, ext2);
 

  this.getCode = function() {
    return "vector";
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
  };
  // ext1.setParent(this);
  // ext2.setParent(this);

  this.getSource = function(src) {
    // if (this.execMacroSource(src)) return;
    src.geomWrite(false, this.getName(), "Symmetry", L.getVarName(), S.getVarName());
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
