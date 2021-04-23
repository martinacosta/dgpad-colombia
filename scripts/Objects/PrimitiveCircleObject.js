//************************************************
//*********** PRIMITIVECIRCLE OBJECT *************
//************************************************
function PrimitiveCircleObject(_construction, _name, _P1) {
  // MEAG start
  if ($U.lang() === 'ES' && _name == "_C")
  _name = "_c";
  // MEAG end
  $U.extend(this, new ConstructionObject(_construction, _name)); // Herencia
  var lastx, lasty, lastr; // Para las trazas
  this.P1 = _P1;
  this.R = 0;

  this.getP1 = function() {
    return this.P1;
  };
  
  this.getCenter = function() {
    return this.P1;
  };
  
  this.getR = function() {
    return this.R;
  };
  
  this.setR = function (_r) {
	  this.R=_r;
	  return;
  }


  this.isCoincident = function(_C) {
    if (_C.isInstanceType("circle")) {
      // Si los circulos (o arcos) coinciden:
      if ($U.approximatelyEqual(this.getR(), _C.getR()) && $U.approximatelyEqual(this.getP1().getX(), _C.getP1().getX()) && $U.approximatelyEqual(this.getP1().getY(), _C.getP1().getY())) {
        return true;
      }
    }
    return false;
  };


  this.isInstanceType = function(_c) {
    return (_c === "circle");
  };
  this.getFamilyCode = function() {
    return "circle";
  };

  //JDIAZ 12/15
  this.getAssociatedTools = function() {
    // MEAG start
    if (this.getPrecision() === -1)
      var at2 = (this.getCode() !== "arc3pts") ? "@callvalue," : "";
    else
      var at2 = "@removevalue,";
    if (this.getShowName()===true)
      at2 += "@removename,";
    
    var at = "@namemover,@callproperty,@calltrash,@callhide," + at2 + "point,circle_int";
    
    // MEAG end
    // codigo original
    // var at = "@callproperty,@calltrash,point";
    if (this.getCn().findPtOn(this) !== null)
      at += ",locus";
    if (this.isMoveable()) at += ",@objectmover";
    return at;
  };
  //JDIAZ end

  // ****************************************
  // **** Unicamente para las animaciones ****
  // ****************************************

  this.getAlphaBounds = function(anim) {
    var inc = anim.direction * (anim.speed * anim.delay / 1000);
    return [0, $U.doublePI, inc]
  };


  this.getAnimationSpeedTab = function() {
    return [0, 1, 6, 10, 30, 45, 60, 70, 90, 180, 270, 360];
  };

  this.getAnimationParams = function(x0, y0, x1, y1) {
    var d = Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));
    var fce = this.getAnimationSpeedTab();
    var f = Math.floor(d / (300 / fce.length));
    if (f >= fce.length) f = fce.length - 1;

    var xp = this.getP1().getX();
    var yp = this.getP1().getY();
    var ps = (yp - y0) * (x1 - xp) + (x0 - xp) * (y1 - yp);
    var dir = (ps > 0) ? 1 : -1;
    return {
      message: fce[f] + " deg/s",
      speed: fce[f] * Math.PI / 180,
      direction: dir,
      ar: false
    }
  }

  // ****************************************
  // ****************************************


  this.projectXY = function(xM, yM) {
    var xA = this.P1.getX();
    var yA = this.P1.getY();
    var xAM = xM - xA;
    var yAM = yM - yA;
    var AM = Math.sqrt(xAM * xAM + yAM * yAM);
    if (AM === 0) {
      return [xA + this.R, yA];
    } else {
      return [xA + this.R * xAM / AM, yA + this.R * yAM / AM];
    }
  };
  this.projectAlpha = function(p) {
    var xA = this.P1.getX();
    var yA = this.P1.getY();
    var a = p.getAlpha();
    p.setXY(xA + this.R * Math.cos(a), yA - this.R * Math.sin(a));
  };


  this.setAlpha = function(p) {
    p.setAlpha($U.angleH(p.getX() - this.P1.getX(), p.getY() - this.P1.getY()));
  };

  // Para los objetos "locus". Inicializa el polígono a partir del dato
  // del número _nb de vértices deseados:
  this.initLocusArray = function(_nb) {
    var aMin = 0,
      aMax = 2 * Math.PI;
    var step = (aMax - aMin) / (_nb - 1);
    var Ptab = []; // List a de los vértices del polígono que representa el lugar
    // Inicialización de Ptab :
    for (var i = 0; i < _nb; i++) {
      Ptab.push({
        "alpha": aMin + step * i,
        "x": 0,
        "y": 0,
        "x1": 0,
        "y1": 0,
        "r": 0
      });
    }
    return Ptab;
  };

  this.setLocusAlpha = function(p, a) {
    var xA = this.P1.getX();
    var yA = this.P1.getY();
    p.setXY(xA + this.R * Math.cos(a), yA - this.R * Math.sin(a));
  };


  //// Solamente para las macros. Permite designar un circulo como inicial,
  //// con el centro como intermediario automatico:
  //    this.getMacroSource = function(src) {
  //        src.geomWrite(false, this.getP1().getName(), "Center", this.getName());
  //    };

  this.setMacroAutoObject = function() {
    var p = this.getP1();
    var c = this;
    var proc = function(src) {
      src.geomWrite(false, p.getName(), "Center", c.getVarName());
    }
    // Define el centro como intermediario:
    p.setMacroMode(1);
    p.setMacroSource(proc);
  };

  // For macro process only :
  this.isAutoObjectFlags = function() {
    return (this.getP1().Flag);
  };

  // Sobrecargado por CircleObject y Arc3ptsObjects :
  this.fixIntersection = function() {};

  this.initIntersect2 = function(_C, _P) {
    if (_C.isInstanceType("circle")) {
      // Determina Circle/Circle intersection :
      var xC1 = this.getP1().getX(),
        yC1 = this.getP1().getY();
      var xC2 = _C.getP1().getX(),
        yC2 = _C.getP1().getY();
      var dx = xC2 - xC1,
        dy = yC2 - yC1;
      var r = Math.sqrt(dx * dx + dy * dy);
      var r1 = this.getR(),
        r2 = _C.getR();
      if (r > (r1 + r2))
        return null;
      if (r === 0) {}
      var l = (r * r + r1 * r1 - r2 * r2) / (2 * r);
      dx /= r;
      dy /= r;
      var x = xC1 + l * dx,
        y = yC1 + l * dy;
      var h = r1 * r1 - l * l;
      if (h < 0) {
        return null;
      }
      h = Math.sqrt(h);
      var x0 = x + h * dy,
        y0 = y - h * dx,
        x1 = x - h * dy,
        y1 = y + h * dx;
      var d0 = (_P.getX() - x0) * (_P.getX() - x0) + (_P.getY() - y0) * (_P.getY() - y0);
      var d1 = (_P.getX() - x1) * (_P.getX() - x1) + (_P.getY() - y1) * (_P.getY() - y1);
      if (d0 < d1) {
        _P.setOrder(0);
        _P.setXY(x0, y0);
        // Si l'un des points constituant du deuxième cercle est sur l'autre
        // intersection, il faut en rester loin :
        if (this.P1.near(x1, y1)) _P.setAway(this.P1);
        else if (this.fixIntersection(x1, y1, _P)) null;
        else if (_C.P1.near(x1, y1)) _P.setAway(_C.P1);
        else _C.fixIntersection(x1, y1, _P);
        //                else if ((this.getCode() === "circle") && this.P2.near(x1, y1)) _P.setAway(this.P2);
        // Si uno de los puntos que constituyen el segundo circulo esta sobre la otra
        // intersection, il faut en rester loin :

        //                else if ((_C.getCode() === "circle") && _C.P2.near(x1, y1)) _P.setAway(_C.P2);
        //                // Si l'un des points constituant de ce cercle est sur l'autre
        //                // intersection, il faut en rester loin :
        //                if (this.P1.near(x1, y1)) _P.setAway(this.P1);
        //                else if ((this.getCode() === "circle") && this.P2.near(x1, y1)) _P.setAway(this.P2);
        //                // Si l'un des points constituant du deuxième cercle est sur l'autre
        //                // intersection, il faut en rester loin :
        //                else if (_C.P1.near(x1, y1)) _P.setAway(_C.P1);
        //                else if ((_C.getCode() === "circle") && _C.P2.near(x1, y1)) _P.setAway(_C.P2);
      } else {
        _P.setOrder(1);
        _P.setXY(x1, y1);
        // Si uno de los puntos que definen el segundo círculo está sobre la otra
        // intersección, hay que quedarse lejos:
        if (this.P1.near(x0, y0)) _P.setAway(this.P1);
        else if (this.fixIntersection(x0, y0, _P)) null;
        else if (_C.P1.near(x0, y0)) _P.setAway(_C.P1);
        else _C.fixIntersection(x0, y0, _P);
        //                // Si l'un des points constituant de ce cercle est sur l'autre
        //                // intersection, il faut en rester loin :
        //                if (this.P1.near(x0, y0)) _P.setAway(this.P1);
        //                else if ((this.getCode() === "circle") && this.P2.near(x0, y0)) _P.setAway(this.P2);
        //                // Si l'un des points constituant du deuxième cercle est sur l'autre
        //                // intersection, il faut en rester loin :
        //                else if (_C.P1.near(x0, y0)) _P.setAway(_C.P1);
        //                else if ((_C.getCode() === "circle") && _C.P2.near(x0, y0)) _P.setAway(_C.P2);
      }
    }
  }

  this.intersectCircleCircle = function(c2, _P) {
    // Determine Circle/Circle intersection :
    var xC1 = this.getP1().getX(),
      yC1 = this.getP1().getY();
    var xC2 = c2.getP1().getX(),
      yC2 = c2.getP1().getY();
    var dx = xC2 - xC1,
      dy = yC2 - yC1;
    var r = Math.sqrt(dx * dx + dy * dy);
    var r1 = this.getR(),
      r2 = c2.getR();
    if (r > (r1 + r2)) {
      _P.setXY(NaN, NaN);
      return;
    }
    if (r === 0) {}
    var l = (r * r + r1 * r1 - r2 * r2) / (2 * r);
    dx /= r;
    dy /= r;
    var x = xC1 + l * dx,
      y = yC1 + l * dy;
    var h = r1 * r1 - l * l;
    if (h < 0) {
      _P.setXY(NaN, NaN);
      return;
    }
    h = Math.sqrt(h);
    //        var hDX = h * dx, hDY = h * dy;

    if (_P.getAway()) {
      if (_P.getAway().near(x + h * dy, y - h * dx)) {
        _P.setXY(x - h * dy, y + h * dx);
      } else {
        _P.setXY(x + h * dy, y - h * dx);
      }
    } else {
      if (_P.getOrder() === 0) {
        _P.setXY(x + h * dy, y - h * dx);
      } else {
        _P.setXY(x - h * dy, y + h * dx);
      }
    }



    //        if (_P.getOrder() === 0) {
    //            _P.setXY(x + h * dy, y - h * dx);
    //        } else {
    //            _P.setXY(x - h * dy, y + h * dx);
    //        }
  };

  this.intersect = function(_C, _P) {
    if (_C.isInstanceType("circle")) {
      this.intersectCircleCircle(_C, _P);
    }
  };

  this.intersectXY = function(_C, _x, _y) {
    if (_C.isInstanceType("circle")) {
      // Determine Circle/Circle intersection :
      var xC1 = this.getP1().getX(),
        yC1 = this.getP1().getY();
      var xC2 = _C.getP1().getX(),
        yC2 = _C.getP1().getY();
      var dx = xC2 - xC1,
        dy = yC2 - yC1;
      var r = Math.sqrt(dx * dx + dy * dy);
      var r1 = this.getR(),
        r2 = _C.getR();
      if (r > (r1 + r2))
        return null;
      if (r === 0) {}
      var l = (r * r + r1 * r1 - r2 * r2) / (2 * r);
      dx /= r;
      dy /= r;
      var x = xC1 + l * dx,
        y = yC1 + l * dy;
      var h = r1 * r1 - l * l;
      if (h < 0) {
        return null;
      }
      h = Math.sqrt(h);
      var x0 = x + h * dy,
        y0 = y - h * dx,
        x1 = x - h * dy,
        y1 = y + h * dx;
      var d0 = (_x - x0) * (_x - x0) + (_y - y0) * (_y - y0);
      var d1 = (_x - x1) * (_x - x1) + (_y - y1) * (_y - y1);
      if (d0 < d1) {
        return [x0, y0];
      } else {
        return [x1, y1];
      }
    }
  };

  this.beginTrack = function() {
    lastx = this.getP1().getX();
    lasty = this.getP1().getY();
    lastr = this.getR();
  };

  this.drawTrack = function(ctx) {
    var x0 = this.getP1().getX(),
      y0 = this.getP1().getY(),
      r = this.getR();
    if (!isNaN(x0) && !isNaN(y0) && !isNaN(r)) {
      if ((x0 !== lastx) || (y0 != lasty) || (r != lastr)) {
        ctx.strokeStyle = this.getColor().getRGBA();
        ctx.lineWidth = this.getSize();
        ctx.lineCap = 'round';

        if (!isNaN(lastx) && !isNaN(lasty) && !isNaN(lastr)) {
          ctx.beginPath();
          switch (this.getCode()) {
            case "ray":
              ctx.moveTo(this.getP1().getX(), this.getP1().getY());
              //                            ctx.lineTo(r, ymax);
              break;
            case "segment":
              ctx.moveTo(this.getP1().getX(), this.getP1().getY());
              ctx.lineTo(this.getP2().getX(), this.getP2().getY());
              break;
            default:
              ctx.beginPath();
              ctx.arc(x0, y0, r, 0, Math.PI * 2, true);
              break;
          }
          ctx.stroke();
        }
      }
    }
    lastx = x0;
    lasty = y0;
    lastr = r;
  };


  this.mouseInside = function(ev) {
    return $U.isNearToCircle(this.P1.getX(), this.P1.getY(), this.R, this.mouseX(ev), this.mouseY(ev), this.getOversize());
  };

  // Alpha, for CaRMetal .zir translation :
  this.transformAlpha = function(_alpha) {
    return -_alpha;
  };

  // MEAG start
  this.nameMover = function(ev, zc) {
    Center = this.getP1();
    var r = Math.sqrt(Math.pow(zc.mouseX(ev) - Center.getX(),2) + Math.pow(zc.mouseY(ev) - Center.getY(),2));
    var a = Math.atan2(zc.mouseY(ev) - Center.getY(), zc.mouseX(ev) - Center.getX());
    a = (a < 0)? Math.abs(a) : Math.abs(a - 2 * Math.PI)
    // var a = $U.angleH(Center.getX() - zc.mouseX(ev), Center.getY() - zc.mouseY(ev));
    this.setNamePosition(a, r);
    this.setShowName(true);
  };

  this.paintLength = function(ctx) {
    ctx.save();
    var x1 = this.P1.getX();
    var y1 = this.P1.getY();
    if (this.P2) {
      var x2 = this.P2.getX();
      var y2 = this.P2.getY();
    } else {
      var x2 = this.R * Math.cos(30 * Math.PI / 180) + x1;
      var y2 = this.R * Math.sin(30 * Math.PI / 180) + y1;
    }
    var a = Math.atan2(y2 - y1, x2 - x1);
    if ((a < -$U.halfPI) || (a > $U.halfPI)) {
      a += Math.PI;
    }
    ctx.textAlign = "center";
    ctx.fillStyle = ctx.strokeStyle;
    ctx.translate((x1 + x2) / 2, (y1 + y2) / 2);
    ctx.rotate(a);
    var prec = this.getPrecision();
    var radio = $L.number(Math.round(this.getValue() * prec) / prec);
    ctx.fillText(" R: " + radio, 0, -this.prefs.fontmargin - this.getRealsize() / 2);
    ctx.restore();
  }
  // MEAG end

};
