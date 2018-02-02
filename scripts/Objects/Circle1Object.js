//************************************************
//************** CIRCLE 1 OBJECT *****************
//************************************************
function Circle1Object(_construction, _name, _P1, _R) {
  $U.extend(this, new PrimitiveCircleObject(_construction, _name, _P1)); // Héritage
  $U.extend(this, new MoveableObject(_construction)); // Héritage
  var me = this;
  this.setDefaults("circle");
  this.R = _R;
  var RX = null;
  var isStr = $U.isStr;
  // MEAG start
  var Cn = _construction;
  // MEAG end
  this.setParent(this.P1);
  this.blocks.setMode(["oncompute"], "oncompute");

  me.getRX = function() {
    return RX;
  };

  // Pour Blockly :
  this.getRoot().setExpression = this.setExpression = function(exy) {
    me.setExp(exy);
  }

  // setExp pour les widgets :
  me.setExp = me.setRX = function(ex) {
    if (isStr(ex)) {
      // Si ex et ey sont des expressions :
      me.setParent(me.P1);
      RX = Expression.delete(RX);
      RX = new Expression(me, ex);
      me.isMoveable = function() {
        return false;
      };
      me.compute = computeFixed;
      me.getSource = getSourceFixed;
    } else {
      // Si ex et ey sont des nombres :
      RX = Expression.delete(RX);
      me.R = ex;
      me.isMoveable = function() {
        return true;
      };
      me.compute = computeGeom;
      me.getSource = getSourceGeom;
      me.setParent(me.P1)
    }
    //        me.compute();
    //        me.computeChilds();
  };

  me.getExp = function() {
    return me.getRX().getSource();
  };

  me.getR = function() {
    return me.R;
  }

  this.redefine = function(_old, _new) {
    if (_old === this.P1) {
      this.addParent(_new);
      this.P1 = _new;
    }
  };

  this.getCode = function() {
    return "circle1";
  };

  this.getAssociatedTools = function() {
    // MEAG start
    var at = "@namemover,@callproperty,@calltrash,point";
    // MEAG end
    // codigo original
    // var at = "@callproperty,@calltrash,point";
    if (this.getCn().findPtOn(this) !== null)
      at += ",locus";
    if (this.isMoveable())
      at += ",@objectmover";
    at += ",@callcalc,@blockly";
    return at;
  };

  this.isMoveable = function() {
    return true;
  };

  // Obsolete :
  this.dragObject = function(_x, _y) {
    this.R = Math.sqrt((_x - this.P1.getX()) * (_x - this.P1.getX()) + (_y - this.P1.getY()) * (_y - this.P1.getY()));
  };

  this.compute_dragPoints = function(_x, _y) {
    this.R = Math.sqrt((_x - this.P1.getX()) * (_x - this.P1.getX()) + (_y - this.P1.getY()) * (_y - this.P1.getY()));
  };


  this.computeDrag = function() {
    this.computeChilds();
  };

  this.setZoom = function(_h) {
    this.R *= _h;
  };

  this.getValue = function() {
    if (RX)
      return RX.value();
    return (me.getCn().coordsSystem.l(me.R));
  };

  //Función para dibujar el nombre
  // var paintTxt = function(ctx, txt, R) {
  //   ctx.save();
  //   ctx.fillStyle = ctx.strokeStyle;
  //   ctx.textAlign = "center";
  //   ctx.fillText(txt, _P1.getX(), (_P1.getY() - (parseInt(R))) + 40);
  //
  // }
  //LLamar a la función painTxt para dibujar el nombre
  this.paintName = function(ctx) {
    paintTxt(ctx, this.getSubName(), this.R);
  };

  this.paintObject = function(ctx) {
    ctx.beginPath();
    ctx.arc(this.P1.getX(), this.P1.getY(), this.R, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.stroke();
  };


  var computeGeom = function() {
    // MEAG start
    if (!Cn.getFrame().ifObject(this.getName())) {
      Cn.getFrame().getTextCons(this);
    } else {
      Cn.getFrame().updateTextCons(this);
    }
    // MEAG end

  };

  var computeFixed = function() {
    RX.compute();
    me.R = me.getCn().coordsSystem.lx(RX.value());
    // MEAG start
    if (!Cn.getFrame().ifObject(this.getName())) {
      Cn.getFrame().getTextCons(this);
    } else {
      Cn.getFrame().updateTextCons(this);
    }
    // MEAG end
  };

  this.compute = computeGeom;

  this.refreshNames = function() {
    if (RX)
      RX.refreshNames();
  };

  var getSourceGeom = function(src) {
    src.geomWrite(false, me.getName(), "Circle1", this.P1.getVarName(), me.getCn().coordsSystem.l(me.R));
  };

  var getSourceFixed = function(src) {
    var _ex = "\"" + RX.getUnicodeSource().replace(/\n/g, "\\n") + "\"";
    src.geomWrite(false, me.getName(), "Circle1", me.P1.getVarName(), _ex);
  };

  me.getSource = getSourceGeom;

  // MEAG start
  var aTXT, cosTXT, sinTXT;

  this.setNamePosition = function(_ev) {
    aTXT = _ev;
    cosTXT = Math.cos(_ev);
    sinTXT = Math.sin(_ev);
  }

  this.setNamePosition(0);

  var paintTxt = function(ctx, txt) {
    ctx.save();
    ctx.fillStyle = ctx.strokeStyle;
    ctx.textAlign = "left";
    var sz = 2 * me.P1.getRealsize();
    var Xnm = me.R * cosTXT + ctx.measureText(txt).width * (cosTXT - 1) / 2;
    var Ynm = me.R * sinTXT + me.getFontSize() * (sinTXT - 1) / 2;
    ctx.fillText(txt, me.P1.getX() + Xnm, me.P1.getY() - Ynm);
  }

  this.getTextCons = function() {
    if (this.getParentLength()) {
      texto = "";
      texto = this.getName() + $L.object_circle1_description + this.P1.getVarName()+ $L.object_circle1_description2 + me.getCn().coordsSystem.l(me.R);
      parents = [this.P1.getVarName()];
      return {
        "texto": texto,
        "parents": parents
      };
    }
  }
  // MEAG end

};
