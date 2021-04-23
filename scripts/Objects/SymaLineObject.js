//************************************************
//*************** Reflection Line OBJECT ****************
//************************************************
function SymaLineObject(_construction, _name, _L, _R) {
	
	var L = _L;
	var R = _R;
	pun1=R.getP1();

	ref1 = new SymaPointObject(_construction, "_P", _L, pun1);
	_construction.add(ref1);
	var x1 = L.getNDY();
    var y1 = L.getNDX();
    var x2 = R.getNDY();
    var y2 = R.getNDX();
	var x3= 2*((x1*x1*x2+x1*y1*y2)/(x1*x1+y1*y1))-x2;
	var y3= 2*((x1*y1*x2+y1*y1*y2)/(x1*x1+y1*y1))-y2;
	
    var superObject = $U.extend(this, new PrimitiveLineObject(_construction, _name, ref1));
	
	
	
  
  this.setParent(ref1,R,L);
  this.setDXDY (0, 0, y3, x3);
  
  
  // MEAG start
  var Cn = _construction;
  // MEAG end
  // this.setParent(L, R)
  

  this.getCode = function() {
    return "line";
  };


  this.isMoveable = function() {
    return false;
  };


  this.compute = function() {
	  pun1=R.getP1();
	var x1 = L.getNDY();
    var y1 = L.getNDX();
    var x2 = R.getNDY();
    var y2 = R.getNDX();
	var x3= 2*((x1*x1*x2+x1*y1*y2)/(x1*x1+y1*y1))-x2;
	var y3= 2*((x1*y1*x2+y1*y1*y2)/(x1*x1+y1*y1))-y2;
	this.setDXDY (0, 0, y3, x3);
	superObject.compute();
    // MEAG start
    if (!Cn.getFrame().ifObject(this.getName())) {
      Cn.getFrame().getTextCons(this);
    }
    // MEAG end
  };

  this.getSource = function(src) {
    // if (this.execMacroSource(src)) return;
    src.geomWrite(false, this.getName(), "Reflection", L.getVarName(), R.getVarName());
  };

  // MEAG start
  this.getTextCons = function() {
    if (this.getParentLength()) {
      texto = "";
      texto = this.getName() + $L.object_syma_description_of + R.getVarName() + $L.object_syma_description_wrto + L.getVarName();
      parents = [R.getVarName(), L.getVarName()];
      return {
        "texto": texto,
        "parents": parents
      };
    }
  }
  // MEAG end

};
