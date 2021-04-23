//************************************************
//*************** TransCircle OBJECT creado el 11/02/20 Falta arreglar posición del nombre ****************
//************************************************
function TransCircleObject(_construction, _name, _V, _C) {
	 
	  
  var V = _V;
  var C = _C;
  M = C.getP1();
  r=C.getR();
  N = new TransPointObject(_construction, "_P", V, M);
  _construction.add(N);
  // MEAG start
  var Cn = _construction;
  // MEAG end
  $U.extend(this, new Circle1Object(_construction, _name, N));
  // _construction.add(this);
	this.setParent(V, C, N);
	// this.setR(r);
	this.setExp(C.getName());
  this.getCode = function() {
    return "circle";
  };


  this.isMoveable = function() {
    return false;
  };


  this.compute = function() {
	  
	
	r=C.getR();
	this.setR(r); 
	this.setExp(C.getName());
    // MEAG start
    if (!Cn.getFrame().ifObject(this.getName())) {
      Cn.getFrame().getTextCons(this);
    }
    // MEAG end
  };
  
 

  this.getSource = function(src) {
    // if (this.execMacroSource(src)) return;
    src.geomWrite(false, this.getName(), "Translation", V.getVarName(), C.getVarName());
  };

  // MEAG start
  this.getTextCons = function() {
    if (this.getParentLength()) {
      texto = "";
      texto = this.getName() + $L.object_trans_description_of + C.getVarName() + $L.object_trans_description_wrto + V.getVarName();
      parents = [C.getVarName(), V.getVarName()];
      return {
        "texto": texto,
        "parents": parents
      };
    }
  }
  // MEAG end

};
