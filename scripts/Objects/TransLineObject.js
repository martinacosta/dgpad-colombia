//************************************************
//*************** Translation Line OBJECT ****************
//************************************************
function TransLineObject(_construction, _name, _V, _R) {
	
	var V = _V;
	var R = _R;
	pun1=R.getP1();

	trans1 = new TransPointObject(_construction, "_P", _V, pun1);
	_construction.add(trans1);
	
	
    var superObject = $U.extend(this, new PrimitiveLineObject(_construction, _name, trans1));
	
	
	
  
  this.setParent(V,R,trans1);
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
    src.geomWrite(false, this.getName(), "Translation", V.getVarName(), R.getVarName());
  };

  // MEAG start
  this.getTextCons = function() {
    if (this.getParentLength()) {
      texto = "";
      texto = this.getName() + $L.object_syma_description_of + R.getVarName() + $L.object_syma_description_wrto + V.getVarName();
      parents = [R.getVarName(), V.getVarName()];
      return {
        "texto": texto,
        "parents": parents
      };
    }
  }
  // MEAG end

};
