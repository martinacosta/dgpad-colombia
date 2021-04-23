//************************************************
//*************** SEGMENT OBJECT *******************
//************************************************
function SegmentObject(_construction, _name, _P1, _P2) {
  var superObject = $U.extend(this, new TwoPointsLineObject(_construction, _name, _P1, _P2, true)); // Herencia
  var me = this;
  // MEAG start
  var Cn = _construction;
  var ev_XY = {};
  var Xnm, Ynm;
  // MEAG end


  this.setParent(this.P1, this.P2);


  this.getCode = function() {
    return "segment";
  };


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
    at += ",midpoint,perpbis";
    return at
  };

  this.getValue = function() {
    return (me.getCn().coordsSystem.l($U.d(me.P1, me.P2)));
  };

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

  // ****************************************
  // **** Unicamente para las animaciones ****
  // ****************************************


  this.getAlphaBounds = function(anim) {
    var inc = anim.direction * (anim.speed * anim.delay / 1000) / $U.d(this.P1, this.P2);
    return [0, 1, inc]
  };


  // ****************************************
  // ****************************************

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

  //    this.redefine = function(_old,_new) {
  ////        superObject.redefine(_old,_new);
  //        console.log("redefine fonction");
  //        if (_old === this.P2) {
  //            console.log("redefine P2 !");
  //            this.deleteParent(_old);
  //            this.addParent(_new);
  //            _old.deleteChild(this);
  //            _new.addChild(this);
  ////            childs[i].deleteParent(_o);
  ////            _o.deleteChild(childs[i]);
  ////            childs[i].addParent(this);
  ////            this.addChild(childs[i]);
  //
  //
  //            this.P2=_new;
  //        }
  //    };

  //// Seulement pour les macros. Permet de désigner un segment comme initial,
  //// avec les extrémités comme intermédiaires automatiques :
  //    this.getMacroSource = function(src) {
  //        src.geomWrite(false, this.getP1().getName(), "First", this.getName());
  //        src.geomWrite(false, this.getP2().getName(), "Second", this.getName());
  //    };

  //    this.setMacroAutoObject = function() {
  //
  //        var p1 = this.getP1();
  //        var p2 = this.getP2();
  //        var s = this;
  //        var proc1 = function(src) {
  //            src.geomWrite(false, p1.getName(), "First", s.getVarName());
  //        };
  //        var proc2 = function(src) {
  //            src.geomWrite(false, p2.getName(), "Second", s.getVarName());
  //        };
  //
  //        // Défini les extrémités comme intermédiaire :
  //        p1.setMacroMode(1);
  //        p2.setMacroMode(1);
  //
  //        // Attache les getSources aux extrémités :
  //        p1.setMacroSource(proc1);
  //        p2.setMacroSource(proc2);
  //    };
  //
  //// For macro process only :
  //    this.isAutoObjectFlags = function() {
  //        return (this.getP1().Flag || this.getP2().Flag);
  //    };

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

   //JDIAZ 11/08
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
    ctx.translate((perP1 * _P1.getX() + perP2 * _P2.getX())+ x_pos, (perP1 * _P1.getY() + perP2 *_P2.getY()) + y_pos);
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
 //JDIAZ 11/08
  var paintTxt = function(ctx, txt) {
    ctx.save();
    var a = Math.atan2(_P2.getY() - _P1.getY(), _P2.getX() - _P1.getX());
    if ((a < -$U.halfPI) || (a > $U.halfPI)) {
      a += Math.PI;
    }
    ctx.textAlign = "center";
    ctx.fillStyle = ctx.strokeStyle;
    ctx.translate((perP1 * _P1.getX() + perP2 * _P2.getX())+ x_pos, (perP1 * _P1.getY() + perP2 *_P2.getY()) + y_pos);
    ctx.rotate(a);  
    ctx.fillText(txt, 0, 0);
    ctx.restore();
  }

  var perP1 = .5;
  var perP2 = .5;
  var y_pos = -5; 
  var x_pos = 0;
  //JDIAZ end
  // JDIAZ 10/31
  this.nameMover = function(ev, zc) {
    var x1 = this.P1.getX();
    var x2 = this.P2.getX();
	var y1 = this.P1.getY();
	var y2 = this.P2.getY();
    var ex = zc.mouseX(ev);
    var ey = zc.mouseY(ev);
	if (x1==x2) {
		x_pos= (ex < x1) ? -5 : +20;
		if (ey < y1 && ey < y2) {
			perP2 = (y1 <y2) ? 1 : 0;
			y_pos = 0;
		}
		else if (ey > y1 && ey > y2){
			perP2 = (y1 > y2) ? 1 : 0;
			y_pos = 0;
		}
		else {
			perP1 = 0;
			perP2 = 0;
			y_pos = ey;
			x_pos = (ex < x1) ? x1-5 : x1+20;
		}
		
	}
    else if (ex < x1 && ex < x2) {
      perP1 = (x1 < x2) ? 1 : 0;
	  perP2 = 1 - perP1;
	  y_pos = ey > perP1 * _P1.getY() + perP2 *_P2.getY() ? 30 : -10;
    }
    else if (ex > x1 && ex > x2) {
      perP1 = (x1 > x2) ? 1 : 0;
	  perP2 = 1 - perP1;
	  y_pos = ey > perP1 * _P1.getY() + perP2 *_P2.getY() ? 30 : -10;
    }
	
    else  {
      perP1 = x1 > ex ? ex - x2 : x2 - ex;
      perP1 = x1 > x2 ? perP1 / (x1 - x2) : perP1 / (x2 - x1);
	  perP2 = 1 - perP1;
	  y_pos = ey > perP1 * _P1.getY() + perP2 *_P2.getY() ? 30 : -10;
    }
	
    
    
    
    mp_XY = {"ex": ex, "ey": ey};
    this.setShowName(true);
  };
  //JDIAZ end

   //LLamar a la función painTxt para dibujar el nombre
  this.paintName = function(ctx) {
    paintTxt(ctx, this.getSubName());
  };

  
  this.paintObject = function(ctx) {
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(this.P1.getX(), this.P1.getY());
    ctx.lineTo(this.P2.getX(), this.P2.getY());
    ctx.stroke();
    ctx.lineCap = 'butt';
  };

  this.getSource = function(src) {
    src.geomWrite(false, this.getName(), "Segment", this.P1.getVarName(), this.P2.getVarName());
  };

  this.setDefaults("segment");

  //MEAG start
  this.getTextCons = function() {
    if (this.getParentLength()) {
      texto = "";
      texto = this.getName() + $L.object_segment_description + this.P1.getVarName() + this.P2.getVarName();
      parents = [this.P1.getVarName(), this.P2.getVarName()];
      return {
        "texto": texto,
        "parents": parents
      };
    }
  }
  // MEAG end

}
