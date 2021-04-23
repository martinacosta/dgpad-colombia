//************************************************
//*************** Homothety Segment OBJECT ****************
//************************************************
function HomoSegmentObject(_construction, _name, _E, _S, _P) {
	
	
	homo1=new HomoPointObject(_construction, "_P", _E, _S.getP1(), _P);
	_construction.add(homo1);
	
	homo2= new HomoPointObject(_construction, "_P", _E, _S.getP2(), _P);
	
	_construction.add(homo2);
	
	$U.extend(this, new SegmentObject(_construction, _name, homo1, homo2)); // Herencia
  var E = _E;
  var S = _S;
  var center = _P;
  // MEAG start
  var Cn = _construction;
  
  this.setParent(E,S,center,homo1,homo2);
 

  this.getCode = function() {
    return "segment";
  };


  this.isMoveable = function() {
    return false;
  };


  this.compute = function() {
    homo1.compute();
	homo2.compute()
	
    // MEAG start
    if (!Cn.getFrame().ifObject(this.getName())) {
      Cn.getFrame().getTextCons(this);
    }
    // MEAG end
  };
  

  this.getSource = function(src) {
    // if (this.execMacroSource(src)) return;
    src.geomWrite(false, this.getName(), "Homothety", E.getVarName(), S.getVarName(), center.getVarName());
  };

  // MEAG start
  this.getTextCons = function() {
    if (this.getParentLength()) {
      texto = "";
      texto = this.getName() + $L.object_homothety_description_of + S.getVarName() + $L.object_homothety_description_wrto+center.getVarName()+ $L.object_homothety_description_ratio+ E.getValue();
      parents = [S.getVarName(), E.getVarName(), center.getVarName()];
      return {
        "texto": texto,
        "parents": parents
      };
    }
  }
  // MEAG end

};
