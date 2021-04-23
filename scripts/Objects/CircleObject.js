//************************************************
//************** CIRCLE OBJECT *******************
//************************************************
function CircleObject(_construction, _name, _P1, _P2) {
  $U.extend(this, new PrimitiveCircleObject(_construction, _name, _P1)); // Herencia
  $U.extend(this, new MoveableObject(_construction)); // Herencia
  var me = this;
  // MEAG start
  var Cn = _construction;
  // MEAG end
  this.setDefaults("circle");
  this.P2 = _P2;
  this.setParent(this.P1, this.P2)

  this.getCode = function() {
    return "circle";
  };
  
  this.getCenter = function() {
	  return this.P1;
  };

  this.getP2 = function() {
    return this.P2;
  };

  this.redefine = function(_old, _new) {
    if (_old === this.P2) {
      this.addParent(_new);
      this.P2 = _new;
    } else if (_old === this.P1) {
      this.addParent(_new);
      this.P1 = _new;
    }
  };

  this.getValue = function() {
    return (me.getCn().coordsSystem.l(me.R));
  };

  this.fixIntersection = function(_x, _y, _P) {
    var isNear = this.P2.near(_x, _y);
    if (isNear)
      _P.setAway(this.P2);
    return isNear;
  };


  this.isMoveable = function() {
    // Si los extremos son puntos libres:
    if ((this.P1.getParentLength() === 0) && (this.P2.getParentLength() === 0))
      return true;
    return false;
  };

  this.dragObject = function(_x, _y) {
    var vx = _x - this.startDragX;
    var vy = _y - this.startDragY;
    this.P1.setXY(this.P1.getX() + vx, this.P1.getY() + vy);
    this.P2.setXY(this.P2.getX() + vx, this.P2.getY() + vy);
    this.startDragX = _x;
    this.startDragY = _y;
  };

  this.computeDrag = function() {
    this.computeChilds();
  };

  this.paintObject = function(ctx) {
    ctx.beginPath();
    ctx.arc(this.P1.getX(), this.P1.getY(), this.R, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.stroke();
  };


  this.compute = function() {
    this.R = $U.computeRay(this.P1.getX(), this.P1.getY(), this.P2.getX(), this.P2.getY());
    // MEAG start
    if (!Cn.getFrame().ifObject(this.getName())) {
      Cn.getFrame().getTextCons(this);
    }
    // MEAG end
  };

  this.getSource = function(src) {
    src.geomWrite(false, this.getName(), "Circle", this.P1.getVarName(), this.P2.getVarName());
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
    ctx.textAlign = "left";
    ctx.fillStyle = ctx.strokeStyle;
    var delta = (ioo < me.R)? -1.5 : 0.5;
    var Xnm = (me.R + delta * ctx.measureText(txt).width) * cosTXT + ctx.measureText(txt).width * (cosTXT - 1) / 2;
    var Ynm = (me.R + delta * me.getFontSize()) * sinTXT + me.getFontSize() * (sinTXT - 1) / 2;     ctx.fillText(txt, me.P1.getX() + Xnm, me.P1.getY() - Ynm);
  }

  //LLamar a la función painTxt para dibujar el nombre
  this.paintName = function(ctx) {
    paintTxt(ctx, this.getSubName());
  };

  this.getTextCons = function() {
    if (this.getParentLength()) {
      texto = "";
      texto = this.getName() + $L.object_circle_description_center + this.P1.getVarName() + $L.object_circle_description_point + this.P2.getVarName();
      parents = [this.P1.getVarName(), this.P2.getVarName()];
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

};
