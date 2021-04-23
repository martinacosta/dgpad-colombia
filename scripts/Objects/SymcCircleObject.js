//************************************************
//*************** symetry Circle OBJECT  ****************
//************************************************
function SymcCircleObject(_construction, _name, _P, _C) {
	 
	  
  var P = _P;
  var C = _C;
  M = C.getP1();
  r=C.getR();
  N = new SymcPointObject(_construction, "_P", P, M);
  _construction.add(N);
  // MEAG start
  var Cn = _construction;
  // MEAG end
  $U.extend(this, new Circle1Object(_construction, _name, N, r));
  // _construction.add(this);
	this.setParent(P, C);
	// this.setR(r);
	
	this.setExp(C.getName());
  this.getCode = function() {
    return "circle";
  };
  this.setParent(P, C, N);

  this.isMoveable = function() {
    return false;
  };


  this.compute = function() {
	 N.compute();
	
	r=C.getR();
	this.setR(r); 
	this.setExp(C.getName());
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
    src.geomWrite(false, this.getName(), "Symmetry", P.getVarName(), C.getVarName());
  };

  // MEAG start
  this.getTextCons = function() {
    if (this.getParentLength()) {
      texto = "";
      texto = this.getName() + $L.object_syma_description_of + C.getVarName() + $L.object_syma_description_wrto + P.getVarName();
      parents = [C.getVarName(), P.getVarName()];
      return {
        "texto": texto,
        "parents": parents
      };
    }
  }
  // MEAG end

};
