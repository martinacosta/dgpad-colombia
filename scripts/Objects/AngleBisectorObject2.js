//************************************************
//************ BISSECTOR OBJECT ******************
//************************************************


function AngleBisectorObject(_construction, _name, _P1, _P2, _P3) {
  var superObject = $U.extend(this, new PrimitiveLineObject(_construction, _name, _P2)); // Héritage
  $U.extend(this, new MoveableObject(_construction)); // Héritage

  var M = new VirtualPointObject(0, 0);
  var P1 = _P1;
  var P2 = _P2;
  var P3 = _P3;
  
  // MEAG start
  var Cn = _construction;
 
  // MEAG end
  this.setParent(P1, P2, P3)

  this.setDefaults("line");

  this.redefine = function(_old, _new) {
    if (_old === P1) {
      this.addParent(_new);
      P1 = _new;
    } else if (_old === P2) {
      this.addParent(_new);
      P2 = _new;
    } else if (_old === P3) {
      this.addParent(_new);
      P3 = _new;
    }
  };

  this.getCode = function() {
    return "anglebiss";
  };

  this.isMoveable = function() {
    // Si los extremos son puntos libres:
    if ((P1.getParentLength() === 0) && (P2.getParentLength() === 0) && (P3.getParentLength() === 0))
      return true;
    return false;
  };


  this.getAlphaBounds = function(anim) {
    var t = superObject.getAlphaBounds(anim);
    t[0] = 0;
    return t;
  };

  this.setAlpha = function(p) {
    superObject.setAlpha(p);
    var a = p.getAlpha();
    if (a < 0) {
      p.setAlpha(0);
    }
  };

  // see if point inside ray (ver si el punto está dentro del rayo)
  this.checkIfValid = function(_P) {
    var dx = this.getDX();
    var dy = this.getDY();
    var xAP = _P.getX() - P2.getX();
    var yAP = _P.getY() - P2.getY();
    // if ((xAP * dx < 0) || (yAP * dy < 0)) {
      // _P.setXY(NaN, NaN);
    // }
  };

  this.dragObject = function(_x, _y) {
    var vx = _x - this.startDragX;
    var vy = _y - this.startDragY;
    M.setXY(M.getX() + vx, M.getY() + vy);
    P1.setXY(P1.getX() + vx, P1.getY() + vy);
    P2.setXY(P2.getX() + vx, P2.getY() + vy);
    P3.setXY(P3.getX() + vx, P3.getY() + vy);
    this.startDragX = _x;
    this.startDragY = _y;
  };

  this.computeDrag = function() {
    this.compute();
    P1.computeChilds();
    P2.computeChilds();
    P3.computeChilds();
  };

  //JDIAZ 11/20
  //Función para dibujar el nombre
  var paintTxt = function(ctx, txt) {
    var Sg = (yMax - _P2.getY()) / (xMax - _P2.getX());
    var y_calc;
    var direction = xMax > _P2.getX() ? 1 : -1;
    var ex = mp_XY.ex + _P2.getX();
    y_calc = _P2.getY() + Sg * (ex - P2.getX());
    if ((direction == 1 && ex < _P2.getX()) || (direction == -1 && ex > _P2.getX())) {
      ex = _P2.getX();
      y_calc = _P2.getY();
    }
    y_calc += mp_XY.ey < y_calc ? - 30 : 40;
    ctx.save();
    ctx.fillStyle = ctx.strokeStyle;
    ctx.textAlign = "left";
    ctx.fillText(txt, ex, y_calc);
  }
  //LLamar a la función painTxt para dibujar el nombre
  this.paintName = function(ctx) {
    paintTxt(ctx, this.getSubName());
  };

  var xMax = 0;
  var yMax = 0;
  var mp_XY = {"ex": 0, "ey": 0};

  this.nameMover = function(ev, zc) {
    var ex = zc.mouseX(ev) - _P2.getX();
    var ey = zc.mouseY(ev);

    mp_XY = {"ex": ex, "ey": ey};
    this.setShowName(true);
  };
  
  // this.paintObject = function(ctx) {
    // xMax = this.getXmax();
    // yMax = this.getYmax();
    // ctx.beginPath();
    // ctx.moveTo(this.getXmin(), this.getYmin());
    // ctx.lineTo(this.getXmax(), this.getYmax());
    // ctx.stroke();
  // };
  
  this.paintObject = function(ctx) {
    var t = $U.computeBorderPoints(this.P1.getX(), this.P1.getY(), superObject.NDX, superObject.NDY, this.getWidth(), this.getHeight());
    xmin = t[0];
    ymin = t[1];
    xmax = t[2];
    ymax = t[3];
	ctx.beginPath();
    ctx.moveTo(xmin, ymin);
    ctx.lineTo(xmax, ymax);
    ctx.stroke();
  };
  
  //JDIAZ end

  // this.compute = function() {
    // var b = $U.d(P2, P1);
    // var a = $U.d(P2, P3);
    // var k = b / (a + b);
    // var x = P1.getX() + k * (P3.getX() - P1.getX());
    // var y = P1.getY() + k * (P3.getY() - P1.getY());
    // if ($U.isNearToPoint(x, y, P2.getX(), P2.getY(), 1e-13)) {
      // x = P2.getX() + (P1.getY() - P2.getY());
      // y = P2.getY() + (P2.getX() - P1.getX());
    // }
    // M.setXY(x, y);
    // this.setDXDY(P2.getX(), P2.getY(), x, y);
    // superObject.compute();
    // MEAG start
    // if (!Cn.getFrame().ifObject(this.getName())) {
      // Cn.getFrame().getTextCons(this);
    // }
    // MEAG end
  // };

this.compute = function() {
    var t = $U.computeBorderPoints(this.P1.getX(), this.P1.getY(), superObject.NDX, superObject.NDY, this.getWidth(), this.getHeight());
    xmin = t[0];
    ymin = t[1];
    xmax = t[2];
    ymax = t[3];
  };

  this.mouseInside = function(ev) {
    // return $U.isNearToRay(P2.getX(), P2.getY(), M.getX(), M.getY(), this.mouseX(ev), this.mouseY(ev), this.getOversize());
	return $U.isNearToLine(this.P1.getX(), this.P1.getY(), this.getDX(), this.getDY(), this.mouseX(ev), this.mouseY(ev), this.getOversize());
	
  };


  this.getSource = function(src) {
    src.geomWrite(false, this.getName(), "AngleBisector", P1.getVarName(), P2.getVarName(), P3.getVarName());
  };

  //MEAG cambios

  this.getTextCons = function() {
    if (this.getParentLength()) {
      texto = "";
      texto = this.getName() + $L.object_anglebiss_description + P1.getVarName() + P2.getVarName() + P3.getVarName();
      parents = [P1.getVarName(), P2.getVarName(), P3.getVarName()];
      return {
        "texto": texto,
        "parents": parents
      };
    }
  }


};
