//************************************************
//*************** Homothety arc OBJECT ****************
//************************************************
function HomoArcObject(_construction, _name, _E, _A, _P) {
	
	
	ext1=new HomoPointObject(_construction, "_P", _E, _A.getA(), _P);
	_construction.add(ext1);
	
	ext2= new HomoPointObject(_construction, "_P", _E, _A.getB(), _P);
	
	_construction.add(ext2);
	ext3= new HomoPointObject(_construction, "_P", _E, _A.getC(), _P);
	
	_construction.add(ext3);
	
	var arc=new Arc3ptsObject(_construction, _name, ext1, ext2, ext3);
	var superObject = arc;
	$U.extend(this, superObject); // Herencia
	_construction.add(arc);
  var E = _E;
  var A = _A;
  var P= _P;
  // MEAG start
  var Cn = _construction;
  // MEAG end
  this.setParent(E,A, P, ext1,ext2, ext3);
  
 

  this.getCode = function() {
    return "arc3pts";
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
	ext1.compute();
	ext2.compute();
	ext3.compute();
	var t = $U.computeArcParams(arc.getA().getX(), arc.getA().getY(), arc.getB().getX(), arc.getB().getY(), arc.getC().getX(), arc.getC().getY());
    arc.getM().setXY(t.centerX, t.centerY);
    fromAngle = t.startAngle;
    toAngle = t.endAngle;
    trigo = t.Trigo;
    AOC = t.AOC;
	 superObject.compute();
    
  };
  // ext1.setParent(this);
  // ext2.setParent(this);

  this.getSource = function(src) {
    // if (this.execMacroSource(src)) return;
    src.geomWrite(false, this.getName(), "Homothety", E.getVarName(), A.getVarName(), P.getVarName());
  };

  // MEAG start
  this.getTextCons = function() {
    if (this.getParentLength()) {
      texto = "";
      texto = this.getName() + $L.object_homothety_description_of + A.getVarName() + $L.object_homothety_description_wrto + P.getVarName()+$L.object_homothety_description_ratio + E.getValue();
      parents = [A.getVarName(), E.getVarName()];
      return {
        "texto": texto,
        "parents": parents
      };
    }
  }
  // MEAG end

};
