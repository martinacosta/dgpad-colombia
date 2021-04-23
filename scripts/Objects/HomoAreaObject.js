//************************************************
//*************** Homothety Area OBJECT ****************
//************************************************
function HomoAreaObject(_construction, _name, _E, _pol, _P) {
   // Herencia
  var pol = _pol;
  var P = _P;
  var E = _E; 
  // MEAG start
  var Cn = _construction;
  // MEAG end
  var polRef=[];
  var puntos=pol.getPtab();
  for (var i = 0, len = puntos.length; i < len; i++) {
	  var vertice = new HomoPointObject(_construction, "_P", E, pol.getPt(i),P);
	  polRef.push(vertice);
	  _construction.add(vertice);
	  // this.setParent(vertice);
	  vertice.setParent(E, pol, P, pol.getPt(i));
  }
  polRef.push(new HomoPointObject(_construction, _name, E, pol.getPt(0),P));
  var a=new AreaObject(_construction, _name, polRef)
  // $U.extend(this, new AreaObject(_construction, _name, polRef));
	a.setOpacity(0.2);
	$U.extend(this, a);
	
	this.setParent(pol,E,P);
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
	for (var i = 0, len = puntos.length; i < len; i++) {
	  polRef[i].compute();
	}
    // MEAG start
    if (!Cn.getFrame().ifObject(this.getName())) {
      Cn.getFrame().getTextCons(this);
    }
    // MEAG end
  };

  this.getSource = function(src) {
    // if (this.execMacroSource(src)) return;
    src.geomWrite(false, this.getName(), "Homothety",E.getVarName(), pol.getVarName(), P.getVarName());
  };

  // MEAG start
  this.getTextCons = function() {
    if (this.getParentLength()) {
      texto = "";
     texto = this.getName() + $L.object_homothety_description_of + pol.getVarName() + $L.object_homothety_description_wrto + P.getVarName()+$L.object_homothety_description_ratio + E.getValue();
      parents = [P.getVarName(), pol.getVarName(), E.getVarName()];
      return {
        "texto": texto,
        "parents": parents
      };
    }
  }
  // MEAG end

};
