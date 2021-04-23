//************************************************
//*************** ReflectionCircle OBJECT creado el 11/02/20 Falta arreglar posición del nombre ****************
//************************************************
function SymaCircleObject(_construction, _name, _L, _P) {
	 
	  
  var L = _L;
  var P = _P;
  M = P.getP1();
  r=P.getR();
  N = new SymaPointObject(_construction, "_P", L, M);
  _construction.add(N);
  // MEAG start
  var Cn = _construction;
  // MEAG end
  $U.extend(this, new Circle1Object(_construction, _name, N, r));
  // _construction.add(this);
	this.setParent(L, P, N);
	// this.setR(r);
	
	this.setExp(P.getName());
  this.getCode = function() {
    return "circle";
  };


  this.isMoveable = function() {
    return false;
  };


  this.compute = function() {
	 
	
	r=P.getR();
	this.setR(r); 
	this.setExp(P.getName());
    // me.R = me.getCn().coordsSystem.lx(RX.value()); 
    // MEAG start
    if (!Cn.getFrame().ifObject(this.getName())) {
      Cn.getFrame().getTextCons(this);
    }
    // MEAG end
  };
  
  // M.setParent(this);

  this.getSource = function(src) {
    // if (this.execMacroSource(src)) return;
    src.geomWrite(false, this.getName(), "Reflection", L.getVarName(), P.getVarName());
  };

  // MEAG start
  this.getTextCons = function() {
    if (this.getParentLength()) {
      texto = "";
      texto = this.getName() + $L.object_syma_description_of + P.getVarName() + $L.object_syma_description_wrto + L.getVarName();
      parents = [P.getVarName(), L.getVarName()];
      return {
        "texto": texto,
        "parents": parents
      };
    }
  }
  // MEAG end

};
