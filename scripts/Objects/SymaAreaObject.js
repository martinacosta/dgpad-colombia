//************************************************
//*************** Reflection OBJECT ****************
//************************************************
function SymaAreaObject(_construction, _name, _L, _P) {
   // Herencia
  var L = _L;
  var P = _P;
  // MEAG start
  var Cn = _construction;
  // MEAG end
  var polRef=[];
  var puntos=P.getPtab();
  for (var i = 0, len = puntos.length; i < len; i++) {
	  var vertice = new SymaPointObject(_construction, "_P", L, P.getPt(i));
	  polRef.push(vertice);
	  _construction.add(vertice);
	  
	  vertice.setParent(L, P.getPt(i));
  }
  polRef.push(new SymaPointObject(_construction, _name, L, P.getPt(0)));
  var a=new AreaObject(_construction, _name, polRef)
  // $U.extend(this, new AreaObject(_construction, _name, polRef));
	a.setOpacity(0.2);
	$U.extend(this, a);
	
	this.setParent(L, P);
		for (var i = 0, len = polRef.length-1; i < len; i++) {
		this.addParent(polRef[i]);
	};
  this.getCode = function() {
    return "area";
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
