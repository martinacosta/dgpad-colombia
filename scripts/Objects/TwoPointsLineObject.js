//************************************************
//************ TWOPOINTSLINE OBJECT **************
//************************************************
function TwoPointsLineObject(_construction, _name, _P1, _P2, _isExtended) {
  var superObject = $U.extend(this, new PrimitiveLineObject(_construction, _name, _P1)); // Héritage
  // MEAG start
  var Cn = _construction;
  // MEAG end


  this.P2 = _P2;

  if (!_isExtended)
    this.setParent(this.P1, this.P2);


  this.getCode = function() {
    return "line";
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
      superObject.P1 = _new;
    }
  };




  this.isMoveable = function() {
    // Si les extrémités sont des points libres :
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

    this.compute();
    this.P1.computeChilds();
    this.P2.computeChilds();
  };

  this.getAlphaBounds = function(anim) {
    var t = superObject.getAlphaBounds(anim);
    var d = $U.d(this.P1, this.P2);
    t[0] = t[0] / d;
    t[1] = t[1] / d;
    t[2] = t[2] / d;
    return t;
  };

  this.projectAlpha = function(p) {
    var xA = this.P1.getX();
    var yA = this.P1.getY();
    var xB = this.P2.getX();
    var yB = this.P2.getY();
    var a = p.getAlpha();
    p.setXY(xA + a * (xB - xA), yA + a * (yB - yA));
  };

  this.setAlpha = function(p) {
    var xA = this.P1.getX();
    var yA = this.P1.getY();
    var xB = this.P2.getX();
    var yB = this.P2.getY();
    var xp = p.getX();
    var yp = p.getY();
    if (Math.abs(xA - xB) > 1e-12) {
      p.setAlpha((xp - xA) / (xB - xA));
    } else if (Math.abs(yA - yB) > 1e-12) {
      p.setAlpha((yp - yA) / (yB - yA));
    } else {
      p.setAlpha(0);
    }
  };


  // Seulement pour les macros :
  this.setMacroAutoObject = function() {
    var vn = this.getVarName();
    var p1 = this.getP1(),
      p2 = this.getP2();
    p1.setMacroMode(1);
    p1.setMacroSource(function(src) {
      src.geomWrite(false, p1.getVarName(), "DefinitionPoint", vn, 0);
    });
    p2.setMacroMode(1);
    p2.setMacroSource(function(src) {
      src.geomWrite(false, p2.getVarName(), "DefinitionPoint", vn, 1);
    });
  };
  // Seulement pour les macros :
  this.isAutoObjectFlags = function() {
    return (this.getP1().Flag || this.getP2().Flag);
  };
  // Seulement pour les macros :
  this.getPt = function(_i) {
    if (_i === 0)
      return this.getP1();
    else
      return this.getP2();
  }

  this.compute = function() {
    this.setDXDY(this.P1.getX(), this.P1.getY(), this.P2.getX(), this.P2.getY());
    superObject.compute();
    // MEAG start
    if (!Cn.getFrame().ifObject(this.getName())) {
      Cn.getFrame().getTextCons(this);
    }
    // MEAG end
  };

  // Alpha, dans le repère coordsSystem de l'objet Construction :
  // (for CaRMetal .zir translation)
  this.transformAlpha = function(_alpha) {
    return _alpha;
  };

  this.getSource = function(src) {
    src.geomWrite(false, this.getName(), "Line", this.P1.getVarName(), this.P2.getVarName());
  };

  // MEAG start
  this.getTextCons = function() {
    if (this.getParentLength()) {
      texto = "";
      texto = this.getName() + $L.object_line_description + this.P1.getVarName() + this.P2.getVarName();
      parents = [this.P1.getVarName(), this.P2.getVarName()];
      return {
        "texto": texto,
        "parents": parents
      };
    }
  }

  // var paintTxt = function(ctx, txt, getP2, zc, ev) {
  //     ctx.save();
  //     ctx.fillStyle = ctx.strokeStyle;
  //     ctx.textAlign = "center";
  //     ex = zc.mouseX(ev);
  //     ey = zc.mouseY(ev);
  //     xa = _P1.getX();
  //     xb = getP2.getX();
  //     ya = _P1.getY();
  //     yb = getP2.getY();
  //     Sg = (yb-ya)/(xb-xa);
  //     if (Math.abs(Sg) > 1) {
  //       Xx = (((ey-ya)*(xb-xa))/(yb-ya))+xa;
  //       if ((xb-xa) == 0) {
  //         Yy = ey;
  //       } else {
  //         Yy = (((Xx-xa)*(yb-ya))/(xb-xa))+ya;
  //       }
  //       Xx = (ex > Xx) ? Xx + 40 : Xx - 40;
  //       ctx.fillText(txt, Xx , Yy);  //iclinado cuadrante 2, sig -0,n,
  //     } else {
  //       Yy = (((ex-xa)*(yb-ya))/(xb-xa))+ya;
  //       if ((yb-ya) == 0) {
  //         Xx = ex;
  //       } else {
  //         Xx = (((Yy-ya)*(xb-xa))/(yb-ya))+xa;
  //       }
  //       Yy = (ey > Yy) ? Yy + 40 : Yy - 40;
  //       ctx.fillText(txt, Xx, Yy);  //iclinado cuadrante 2, sig -0,n,
  //     }
  // }
  //
  // this.nameMover = function(ev, zc) {
  //   console.log(this.getCode());
  //   var _ctx = zc.getContext();
  //   if(this.P2) {
  //     console.log("A");
  //     paintTxt(_ctx, this.getSubName(),this.P2, zc, ev);
  //   } else {
  //     console.log("B");
  //     paintTxt(_ctx, this.getSubName(),this.P1, zc, ev);
  //   }
  //   this.setShowName(true);
  //
  // };
  // // MEAG end

};
