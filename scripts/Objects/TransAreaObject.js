//************************************************
//*************** Translation Area OBJECT ****************
//************************************************
function TransAreaObject(_construction, _name, _V, _P) {
   // Herencia
  var V = _V;
  var P = _P;
  // MEAG start
  var Cn = _construction;
  // MEAG end
  var polRef=[];
  var puntos=P.getPtab();
  for (var i = 0, len = puntos.length; i < len; i++) {
	  var vertice = new TransPointObject(_construction, "_P", V, P.getPt(i));
	  polRef.push(vertice);
	  _construction.add(vertice);
	 
	  vertice.setParent(V,P.getPt(i));
  }
  polRef.push(new TransPointObject(_construction, _name, V, P.getPt(0)));
  var a=new AreaObject(_construction, _name, polRef)
  // $U.extend(this, new AreaObject(_construction, _name, polRef));
	a.setOpacity(0.2);
	$U.extend(this, a);
	
	this.setParent(V, P);
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
	   // for (var i = 0, len = this.Ptab.length; i < len - 1; i++) {
    // L.reflect(P, this.Ptab[i]);
    // MEAG start
    if (!Cn.getFrame().ifObject(this.getName())) {
      Cn.getFrame().getTextCons(this);
    }
    // MEAG end
  };

  this.getSource = function(src) {
    // if (this.execMacroSource(src)) return;
    src.geomWrite(false, this.getName(), "Translation", V.getVarName(), P.getVarName());
  };

  // MEAG start
  this.getTextCons = function() {
    if (this.getParentLength()) {
      texto = "";
      texto = this.getName() + $L.object_trans_description_of + P.getVarName() + $L.object_trans_description_wrto + V.getVarName();
      parents = [P.getVarName(), V.getVarName()];
      return {
        "texto": texto,
        "parents": parents
      };
    }
  }
  // MEAG end

};
