//************************************************
//*************** Translation arc OBJECT ****************
//************************************************
function TransArcObject(_construction, _name, _V, _A) {
	
	
	ext1=new TransPointObject(_construction, "_P", _V, _A.getA());
	_construction.add(ext1);
	
	ext2= new TransPointObject(_construction, "_P", _V, _A.getB());
	
	_construction.add(ext2);
	ext3= new TransPointObject(_construction, "_P", _V, _A.getC());
	
	_construction.add(ext3);
	
	var arc=new Arc3ptsObject(_construction, _name, ext1, ext2, ext3);
	var superObject = arc;
	$U.extend(this, superObject); // Herencia
	_construction.add(arc);
  var V = _V;
  var A = _A;
  // MEAG start
  var Cn = _construction;
  // MEAG end
  this.setParent(V, A, ext1, ext2, ext3);
  
 

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
    src.geomWrite(false, this.getName(), "Translation", V.getVarName(), A.getVarName());
  };

  // MEAG start
  this.getTextCons = function() {
    if (this.getParentLength()) {
      texto = "";
      texto = this.getName() + $L.object_trans_description_of + A.getVarName() + $L.object_trans_description_wrto + V.getVarName();
      parents = [A.getVarName(), V.getVarName()];
      return {
        "texto": texto,
        "parents": parents
      };
    }
  }
  // MEAG end

};
