//************************************************
//*************** RAY OBJECT *********************
//************************************************
function RayObject(_construction, _name, _P1, _P2) {
  var superObject = $U.extend(this, new TwoPointsLineObject(_construction, _name, _P1, _P2, true)); // Héritage
  this.setParent(this.P1, this.P2);
  this.setDefaults("ray");
  // MEAG start
  var Cn = _construction;
  var ev_XY = {};
  var Xnm, Ynm;
  // MEAG end


  this.getCode = function() {
    return "ray";
  };

  this.setAlpha = function(p) {
    superObject.setAlpha(p);
    var a = p.getAlpha();
    if (a < 0) {
      p.setAlpha(0);
    }
  };



  this.isInstanceType = function(_c) {
    return ((_c === "line") || (_c === "ray"));
  };

  // see if point inside ray
  this.checkIfValid = function(_P) {
    var dx = this.getDX();
    var dy = this.getDY();
    var xAP = _P.getX() - this.P1.getX();
    var yAP = _P.getY() - this.P1.getY();
    if ((xAP * dx < 0) || (yAP * dy < 0)) {
      _P.setXY(NaN, NaN);
    }
  };


  this.mouseInside = function(ev) {
    return $U.isNearToRay(this.P1.getX(), this.P1.getY(), this.P2.getX(), this.P2.getY(), this.mouseX(ev), this.mouseY(ev), this.getOversize());
  };
  //Función para dibujar el nombre
  // var paintTxt = function(ctx, txt) {
  //   ctx.save();
  //   ctx.fillStyle = ctx.strokeStyle;
  //   ctx.textAlign = "left";
  //   ctx.fillText(txt, (_P1.getX() + _P2.getX()) / 2, (_P1.getY() + _P2.getY()) / 2 - 10);
  // }

  //LLamar a la función painTxt para dibujar el nombre
  this.paintName = function(ctx) {
    paintTxt(ctx, this.getSubName());
  };

  this.paintObject = function(ctx) {
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(this.P1.getX(), this.P1.getY());
    ctx.lineTo(this.getXmax(), this.getYmax());
    ctx.stroke();
    ctx.lineCap = 'butt';
  };

  this.getAlphaBounds = function(anim) {
    var t = superObject.getAlphaBounds(anim);
    t[0] = 0;
    return t;
  };

  this.getSource = function(src) {
    src.geomWrite(false, this.getName(), "Ray", this.P1.getVarName(), this.P2.getVarName());
  };

  // MEAG start
  var ev_XY = {};
  var Xnm, Ynm;

  this.setNamePosition = function(_ev) {
    if (_ev != 0) {
      ev_XY = {"x": Cn.getCanvas().mouseX(_ev), "y": Cn.getCanvas().mouseY(_ev)}
    }
  }

  this.setNamePosition(0);

  var paintTxt = function(ctx, txt) {
    xa = _P1.getX();
    xb = _P2.getX();
    ya = _P1.getY();
    yb = _P2.getY();
    if (typeof ev_XY.x !== "null") {
      ex = ev_XY.x;
      ey = ev_XY.y;
    } else {
      ex = Math.abs(xa-xb);
      ey = Math.abs(ya-yb);
    }
    Sg = (yb-ya)/(xb-xa);
    if (Math.abs(Sg) > 1) {
      Xx = (((ey-ya)*(xb-xa))/(yb-ya))+xa;
      if ((xb-xa) == 0) {
        Yy = ey;
      } else {
        Yy = (((Xx-xa)*(yb-ya))/(xb-xa))+ya;
      }
      Xnm = (ex > Xx) ? Xx + 25 : Xx - 25;
      Ynm = Yy;
    } else {
      Yy = (((ex-xa)*(yb-ya))/(xb-xa))+ya;
      if ((yb-ya) == 0) {
        Xx = ex;
      } else {
        Xx = (((Yy-ya)*(xb-xa))/(yb-ya))+xa;
      }
      Ynm = (ey > Yy) ? Yy + 25 : Yy - 25;
      Xnm = Xx;
    }
    Xnm = ((Xnm - xa) < 1) ? Xnm : xa;
    Ynm = ((Ynm - ya) < 1) ? Ynm : ya;
    ctx.save();
    ctx.fillStyle = ctx.strokeStyle;
    ctx.textAlign = "center";
    ctx.fillText(txt, Xnm, Ynm);
  }

  this.getTextCons = function() {
    if (this.getParentLength()) {
      texto = "";
      texto = this.getName() + $L.object_ray_description_beginning + this.P1.getVarName() + $L.object_ray_description_by + this.P2.getVarName();
      parents = [this.P1.getVarName(), this.P2.getVarName()];
      return {
        "texto": texto,
        "parents": parents
      };
    }
  }
  // MEAG end

};
