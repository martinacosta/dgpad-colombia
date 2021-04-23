//************************************************
//*************** VECTOR OBJECT ******************
//************************************************
function VectorObject(_construction, _name, _P1, _P2) {
  var superObject = $U.extend(this, new TwoPointsLineObject(_construction, _name, _P1, _P2, true)); // Herencia
  var me = this;
  this.setParent(this.P1, this.P2);
  var Cn = _construction;

  this.getCode = function() {
    return "vector";
  };
  
  // this.isInstanceType = function(_c) {
    // return ((_c === "vector") || (_c === "segment"));
  // };

  this.getAssociatedTools = function() {
    var at = superObject.getAssociatedTools();
	//JDIAZ
    if (this.getPrecision() === -1)
      at += ",@callvalue";
    else 
      at += ",@removevalue";
    //JDIAZ
	//JDIAZ
    if (this.getShowName()===true)
      at += "@removename";
    
    //JDIAZ
    at += ",midpoint,perpbis,trans";
    return at
  };

  // Para el interprete de DG_scripts :
  this.coords2D = function() {
    var vx = me.getCn().coordsSystem.x(me.P2.getX()) - me.getCn().coordsSystem.x(me.P1.getX());
    var vy = me.getCn().coordsSystem.y(me.P2.getY()) - me.getCn().coordsSystem.y(me.P1.getY());
    return [vx, vy];
  };

  // Para el interprete de DG_scripts :
  this.coords3D = function() {
    me.P1.coords3D();
    me.P2.coords3D();
  };

  // Para el interprete de DG_scripts :
  this.getOldcoords = function() {
    var p1 = me.P1.getOldcoords();
    var p2 = me.P2.getOldcoords();
    return [p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]];
  };


  this.getValue = function() {
    if ((Cn.is3D()) && (me.is3D())) {
      var p1 = me.P1.coords3D();
      var p2 = me.P2.coords3D();
      return [p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]];
    }
    var vx = me.getCn().coordsSystem.x(me.P2.getX()) - me.getCn().coordsSystem.x(me.P1.getX());
    var vy = me.getCn().coordsSystem.y(me.P2.getY()) - me.getCn().coordsSystem.y(me.P1.getY());
    return [vx, vy];
  };

  //        this.getValue = function() {
  //        return (me.getCn().coordsSystem.l(me.R));
  //    };

  this.setAlpha = function(p) {
    superObject.setAlpha(p);
    var a = p.getAlpha();
    if (a < 0) {
      p.setAlpha(0);
    }
    if (a > 1) {
      p.setAlpha(1);
    }
  };

  // Para los objetos "locus". Inicializa el polígono a partir del dato
  // del número _nb de vértices deseados:
  this.initLocusArray = function(_nb) {
    var aMin = 0,
      aMax = 1;
    var step = (aMax - aMin) / (_nb - 1);
    var Ptab = []; // Lista de los vértices del polígono que representa el lugar
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
    var xB = this.P2.getX();
    var yB = this.P2.getY();
    p.setXY(xA + a * (xB - xA), yA + a * (yB - yA));
  };

  this.getXmax = function() {
    return this.P1.getX();
  };
  this.getYmax = function() {
    return this.P1.getY();
  };
  this.getXmin = function() {
    return this.P2.getX();
  };
  this.getYmin = function() {
    return this.P2.getY();
  };

  this.isInstanceType = function(_c) {
    return ((_c === "line") || (_c === "segment"));
  };


  // see if point inside 2 border points
  this.checkIfValid = function(_P) {
    var xPA = this.P1.getX() - _P.getX();
    var yPA = this.P1.getY() - _P.getY();
    var xPB = this.P2.getX() - _P.getX();
    var yPB = this.P2.getY() - _P.getY();
    if ((xPA * xPB + yPA * yPB) > 0) {
      _P.setXY(NaN, NaN);
    }
  };




  this.mouseInside = function(ev) {
    return $U.isNearToSegment(this.P1.getX(), this.P1.getY(), this.P2.getX(), this.P2.getY(), this.mouseX(ev), this.mouseY(ev), this.getOversize());
  };

  //JDIAZ 11/16
  this.paintLength = function(ctx) {
    ctx.save();

    var txt;
    var a = Math.atan2(this.P2.getY() - this.P1.getY(), this.P2.getX() - this.P1.getX());
    if ((a < -$U.halfPI) || (a > $U.halfPI)) {
      a += Math.PI;
    }

    ctx.textAlign = "left";
    ctx.fillStyle = ctx.strokeStyle;

    //ctx.translate((this.P1.getX() + this.P2.getX()) / 2, (this.P1.getY() + this.P2.getY()) / 2);
    ctx.translate((perP1 * _P1.getX() + perP2 * _P2.getX()), (perP1 * _P1.getY() + perP2 *_P2.getY()) + y_pos);
    ctx.rotate(a);

    var prec = this.getPrecision();
    var display = Math.round($U.d(this.P1, this.P2) / this.getUnit() * prec) / prec;
    txt = $L.number(display);
    if (this.getShowName() == true)
      txt = ":" + txt;
    //ctx.fillText($L.number(display), 0, -this.prefs.fontmargin - this.getRealsize() / 2);
    ctx.fillText(txt, 15, 0);
    ctx.restore();
  };
  //JDIAZ end

  //Función para dibujar el nombre
  //JDIAZ 11/16
  var paintTxt = function(ctx, txt) {
    ctx.save();
    var a = Math.atan2(_P2.getY() - _P1.getY(), _P2.getX() - _P1.getX());
    if ((a < -$U.halfPI) || (a > $U.halfPI)) {
      a += Math.PI;
    }
    ctx.textAlign = "center";
    ctx.fillStyle = ctx.strokeStyle;
    ctx.translate((perP1 * _P1.getX() + perP2 * _P2.getX()), (perP1 * _P1.getY() + perP2 *_P2.getY()) + y_pos);
    ctx.rotate(a);  
    ctx.fillText(txt, 0, 0);
    ctx.restore();
  }
  
  var perP1 = .5;
  var perP2 = .5;
  var y_pos = -5; 
  //JDIAZ end
  //JDIAZ
  this.nameMover = function(ev, zc) {
    var x1 = this.P1.getX();
    var x2 = this.P2.getX();
    var ex = zc.mouseX(ev);
    var ey = zc.mouseY(ev);
    if (ex < x1 && ex < x2) {
      perP1 = (x1 < x2) ? 1 : 0;
    }
    else if (ex > x1 && ex > x2) {
      perP1 = (x1 > x2) ? 1 : 0;
    }
    else {
      perP1 = x1 > ex ? ex - x2 : x2 - ex;
      perP1 = x1 > x2 ? perP1 / (x1 - x2) : perP1 / (x2 - x1);
    }
    perP2 = 1 - perP1;
    y_pos = ey > perP1 * _P1.getY() + perP2 *_P2.getY() ? 25 : -25;
    
    mp_XY = {"ex": ex, "ey": ey};
    this.setShowName(true);
  };
  //JDIAZ end
  
  this.paintName = function(ctx) {
    paintTxt(ctx, this.getSubName());
  };

  this.paintObject = function(ctx) {
    var x1 = this.P1.getX(),
      y1 = this.P1.getY();
    var x2 = this.P2.getX(),
      y2 = this.P2.getY();

    var headlen = me.prefs.size.vectorhead;
    var angle = Math.atan2(y2 - y1, x2 - x1);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2 - headlen * Math.cos(angle), y2 - headlen * Math.sin(angle));
    ctx.stroke();
    ctx.lineCap = 'butt';
    var c1 = Math.cos(angle - Math.PI / 10);
    var s1 = Math.sin(angle - Math.PI / 10);
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - headlen * c1, y2 - headlen * s1);
    ctx.lineTo(x2 - headlen * Math.cos(angle + Math.PI / 10), y2 - headlen * Math.sin(angle + Math.PI / 10));
    ctx.lineTo(x2, y2);
    ctx.lineTo(x2 - headlen * c1, y2 - headlen * s1);
    ctx.stroke();
    ctx.fill();
  };

  this.getSource = function(src) {
    src.geomWrite(false, this.getName(), "Vector", this.P1.getVarName(), this.P2.getVarName());
  };

  this.setDefaults("vector");

  // MEAG start 
  this.getTextCons = function() {
    if (this.getParentLength()) {
      texto = "";
      texto = this.getName() + $L.objetc_vector_description + this.P1.getVarName() + this.P2.getVarName();
      parents = [this.P1.getVarName(), this.P2.getVarName()];
      return {
        "texto": texto,
        "parents": parents
      };
    }
  }
  // MEAG end

}
