//************************************************
//********* CIRCLE 3 pts OBJECT ******************
//************************************************


function Circle3ptsObject(_construction, _name, _P1, _P2, _P3) {
  var M = new CenterObject(_construction, "_Center", this);
  _construction.add(M);

  $U.extend(this, new PrimitiveCircleObject(_construction, _name, M)); // Herencia
  $U.extend(this, new MoveableObject(_construction)); // Herencia

  M.setParent(this);
  M.forceFillStyle(this.prefs.color.point_inter);
  M.setHidden(true);

  var me = this;
  var P1 = _P1;
  var P2 = _P2;
  var P3 = _P3;
  // MEAG start
  var Cn = _construction;
  // MEAG end
  this.setParent(P1, P2, P3);

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

  this.setDefaults("circle");

  this.getCode = function() {
    return "circle3pts";
  };

  this.getM = function() {
    return M;
  };

  this.getValue = function() {
    return (me.getCn().coordsSystem.l(me.R));
  };

  this.fixIntersection = function(_x, _y, _P) {
    if (P1.near(_x, _y)) {
      _P.setAway(P1);
      return true;
    }
    if (P2.near(_x, _y)) {
      _P.setAway(P2);
      return true;
    }
    if (P3.near(_x, _y)) {
      _P.setAway(P3);
      return true;
    }
    return false;
  };

  // Solamente para las macros:
  this.setMacroAutoObject = function() {
    var vn = this.getVarName();
    P1.setMacroMode(1);
    P1.setMacroSource(function(src) {
      src.geomWrite(false, P1.getVarName(), "DefinitionPoint", vn, 0);
    });
    P2.setMacroMode(1);
    P2.setMacroSource(function(src) {
      src.geomWrite(false, P2.getVarName(), "DefinitionPoint", vn, 1);
    });
    P3.setMacroMode(1);
    P3.setMacroSource(function(src) {
      src.geomWrite(false, P3.getVarName(), "DefinitionPoint", vn, 2);
    });
  };
  // Solamente para las macros:
  this.isAutoObjectFlags = function() {
    return (P1.Flag || P2.Flag || P3.Flag);
  };
  // Solamente para las macros:
  this.getPt = function(_i) {
    if (_i === 0)
      return P1;
    if (_i === 1)
      return P2;
    return P3;
  };

  this.isMoveable = function() {
    // Si los extremos son puntos libres:
    if ((P1.getParentLength() === 0) && (P2.getParentLength() === 0) && (P3.getParentLength() === 0))
      return true;
    return false;
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
    this.computeChilds();
  };

  //Función para dibujar el nombre
  // var paintTxt = function(ctx, txt) {
  //   ctx.save();
  //   ctx.fillStyle = ctx.strokeStyle;
  //   ctx.textAlign = "center";
  //   ctx.fillText(txt, (_P1.getX() + _P3.getX()) / 2, (_P1.getY() + _P3.getY()) / 2);
  //
  // }

  //LLamar a la función painTxt para dibujar el nombre
  this.paintName = function(ctx) {
    paintTxt(ctx, this.getSubName());
  };

  this.paintObject = function(ctx) {
    ctx.beginPath();
    ctx.arc(M.getX(), M.getY(), this.R, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.stroke();
  };

  this.compute = function() {
    var t = $U.computeCenter(P1.getX(), P1.getY(), P2.getX(), P2.getY(), P3.getX(), P3.getY());
    M.setXY(t[0], t[1]);
    this.R = $U.computeRay(M.getX(), M.getY(), P1.getX(), P1.getY());
    // MEAG start
    if (!Cn.getFrame().ifObject(this.getName())) {
      Cn.getFrame().getTextCons(this);
    }
    // MEAG end
  };

  this.getSource = function(src) {
    src.geomWrite(false, this.getName(), "Circle3pts", P1.getVarName(), P2.getVarName(), P3.getVarName());
  };

  // MEAG start
  var aTXT, cosTXT, sinTXT, ioo;

  this.setNamePosition = function(_ev, _rel) {
    aTXT = _ev;
    ioo = _rel;
    cosTXT = Math.cos(_ev);
    sinTXT = Math.sin(_ev);
  }

  this.setNamePosition(0, 0);

  var paintTxt = function(ctx, txt) {
    ctx.save();
    ctx.fillStyle = ctx.strokeStyle;
    ctx.textAlign = "left";
    var delta = (ioo < me.R)? -1.5 : 0.5;
    var Xnm = (me.R + delta * ctx.measureText(txt).width) * cosTXT + ctx.measureText(txt).width * (cosTXT - 1) / 2;
    var Ynm = (me.R + delta * me.getFontSize()) * sinTXT + me.getFontSize() * (sinTXT - 1) / 2;
    ctx.fillText(txt, me.P1.getX() + Xnm, me.P1.getY() - Ynm);
  }

  this.getTextCons = function() {
    if (this.getParentLength()) {
      texto = "";
      texto = this.getName() + $L.object_circle3pts_description + P1.getVarName() + $L.object_circle3pts_description2 + P2.getVarName() + $L.object_circle3pts_description3 + P3.getVarName();
      parents = [P1.getVarName(), P2.getVarName(), P3.getVarName()];
      return {
        "texto": texto,
        "parents": parents
      };
    }
  }
  // MEAG end
  //JDIAZ 11/08
  this.paintLength = function(ctx) {
    ctx.save();
    ctx.fillStyle = ctx.strokeStyle;
    ctx.textAlign = "left";
    var delta = (ioo < me.R)? 0.5 : -1.5;
    var prec = this.getPrecision();
    var radio = $L.number(Math.round(this.getValue() * prec) / prec);
    var txt = "r:" + radio;
    var Xnm = (me.R + delta * ctx.measureText(txt).width) * cosTXT + ctx.measureText(txt).width * (cosTXT - 1) / 2;
    var Ynm = (me.R + delta * me.getFontSize()) * sinTXT + me.getFontSize() * (sinTXT - 1) / 2;
    ctx.fillText(txt, me.P1.getX() + Xnm, me.P1.getY() - Ynm);
  }
  //JDIAZ

}
