//************************************************
//*************** Translation Vector OBJECT ****************
//************************************************
function TransVectorObject(_construction, _name, _V, _S) {
	
	
	ext1=new TransPointObject(_construction, "_P", _V, _S.getP1());
	_construction.add(ext1);
	var ens=ext1.getValue();
	ext2= new TransPointObject(_construction, "_P", _V, _S.getP2());
	
	_construction.add(ext2);
	
	
	
	$U.extend(this, new VectorObject(_construction, _name, ext1, ext2)); // Herencia
  var V = _V;
  var S = _S;
  // MEAG start
  var Cn = _construction;
  // MEAG end
  this.setParent(V, S, ext1, ext2);
  
 

  this.getCode = function() {
    return "vector";
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
  };
  

  this.getSource = function(src) {
    // if (this.execMacroSource(src)) return;
    src.geomWrite(false, this.getName(), "Translation", V.getVarName(), S.getVarName());
  };

  // MEAG start
  this.getTextCons = function() {
    if (this.getParentLength()) {
      texto = "";
      texto = this.getName() + $L.object_trans_description_of + S.getVarName() + $L.object_trans_description_wrto + V.getVarName();
      parents = [S.getVarName(), V.getVarName()];
      return {
        "texto": texto,
        "parents": parents
      };
    }
  }
  // MEAG end

};
