//************************************************
//************** CIRCLE OBJECT *******************
//************************************************
function Circle3Object(_construction, _name, _P3, _P2, _P1) {
  $U.extend(this, new PrimitiveCircleObject(_construction, _name, _P1)); // Herencia
  var me = this;
  // MEAG start
  var Cn = _construction;
  // MEAG end
  this.setDefaults("circle");

  this.P2 = _P2;
  this.P3 = _P3;

  this.setParent(this.P1, this.P2, this.P3)

  this.getCode = function() {
    return "circle3";
  };

  this.redefine = function(_old, _new) {
    if (_old === this.P1) {
      this.addParent(_new);
      this.P1 = _new;
    } else if (_old === this.P2) {
      this.addParent(_new);
      this.P2 = _new;
    } else if (_old === this.P3) {
      this.addParent(_new);
      this.P3 = _new;
    }
  };

  this.getValue = function() {
    return (me.getCn().coordsSystem.l(me.R));
  };

  //Función para dibujar el nombre
  // var paintTxt = function(ctx, txt, R) {
  //   ctx.save();
  //   ctx.fillStyle = ctx.strokeStyle;
  //   ctx.textAlign = "center";
  //   ctx.fillText(txt, _P1.getX(), _P1.getY() - (R - (R / 4)));
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

  this.compute = function() {
    this.R = $U.computeRay(this.P2.getX(), this.P2.getY(), this.P3.getX(), this.P3.getY());
    // MEAG start
    if (!Cn.getFrame().ifObject(this.getName())) {
      Cn.getFrame().getTextCons(this);
    }
    // MEAG end
  };

  this.getSource = function(src) {
    src.geomWrite(false, this.getName(), "Circle3", this.P3.getVarName(), this.P2.getVarName(), this.P1.getVarName());
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
      texto = this.getName() + $L.object_circle3object_description + this.P3.getVarName() + this.P2.getVarName() + $L.object_circle3object_description_center + this.P1.getVarName();
      parents = [this.P3.getVarName(), this.P2.getVarName(), this.P1.getVarName()];
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
