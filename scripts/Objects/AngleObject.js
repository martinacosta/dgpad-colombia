//************************************************
//************ Angle OBJECT ******************
//************************************************
function AngleObject(_construction, _name, _P1, _P2, _P3) {
  var parent = $U.extend(this, new ConstructionObject(_construction, _name)); // Héritage
  $U.extend(this, new MoveableObject(_construction)); // Héritage
  var me = this;
  var A = _P1;
  var O = _P2;
  var C = _P3;
  var R = 30;
  var AOC = 0; // medida del ángulo AOC orientado positivo (en [0;2π[) :
  var AOC180 = 0; // medida del ángulo AOC (en [0;π[) :
  var fromAngle = 0; // Comienzo del arco (xOA sentido trigo en [0;2π[)
  var toAngle = 0; // Fin del arco (xOC sentido trigo en [0;2π[)
  var trigo = true; // sentido de dibujo del arco ( cómo ir de A a C)
  var valid = true;
  var Cn = _construction;
  var deg_coef = 180 / Math.PI;
  var mode360 = false;
  var modeRad = false;



  this.setParent(A, O, C);

  this.redefine = function(_old, _new) {
    if (_old === A) {
      this.addParent(_new);
      A = _new;
    } else if (_old === O) {
      this.addParent(_new);
      O = _new;
    } else if (_old === C) {
      this.addParent(_new);
      C = _new;
    }
  };
  this.is360 = function() {
    return mode360;
  };
  this.set360 = function(_360) {
    mode360 = _360;
  };
  this.getAOC = function() {
    return AOC;
  };
  this.setRad = function() {
	  this.modeRad= true;
  };
  this.setDeg = function() {
	  this.modeRad= false;
  };
  this.getValue = function() {
    var a = mode360 ? AOC : AOC180;
	if (!modeRad){
		return (Cn.isDEG()) ? (a * deg_coef) : a;
	}
	else {
		return (Cn.isDEG()) ? ((a * deg_coef))*(Math.Pi()/180) : a*(Math.Pi()/180);
		
	}
  };
  this.getCode = function() {
    return "angle";
  };
  this.getFamilyCode = function() {
    return "angle";
  };

  this.isMoveable = function() {
    return true;
  };
  //Obsolete :
  this.dragObject = function(_x, _y) {
    // console.log("dragObject");
    var vx = _x - O.getX();
    var vy = _y - O.getY();
    R = Math.sqrt(vx * vx + vy * vy);
  };
  this.compute_dragPoints = function(_x, _y) {
    // console.log("compute_dragPoints");
    var vx = _x - O.getX();
    var vy = _y - O.getY();
    R = Math.sqrt(vx * vx + vy * vy);
  };
  this.computeDrag = function() {
    // console.log("computeDrag");
  };
  this.getArcRay = function() {
    return R;
  };
  this.setArcRay = function(_r) {
    R = _r;
  };

  this.getAssociatedTools = function() {
    
    var at = "@namemover,@callproperty,@calltrash,@callhide" ;
	//JDIAZ
    if (this.getShowName()===true)
      at += ",@removename";
    
    //JDIAZ
    return (at);
  };

  this.paintLength = function(ctx) {
    if (valid && (!$U.approximatelyEqual(AOC180, $U.halfPI))) {
      ctx.save();
      var r = R + this.prefs.fontmargin + this.getRealsize() / 2 + 40;
      ctx.textAlign = "left";
      var prec = this.getPrecision();
      var display = (mode360) ? AOC : AOC180;
      display = display * 180 / Math.PI;
      display = Math.round(display * prec) / prec;
      var a = trigo ? -toAngle + AOC / 2 : Math.PI - toAngle + AOC / 2;
      a = a - Math.floor(a / $U.doublePI) * $U.doublePI; // retour en [0;2π]
      
      if ((a > $U.halfPI) && (a < 3 * $U.halfPI)) {
        a += Math.PI;
        r = -r + 40;
        ctx.textAlign = "right";
      }
      ctx.fillStyle = ctx.strokeStyle;
      ctx.translate(O.getX(), O.getY());
      ctx.rotate(a);

      ctx.fillText($L.number(display) + "°", r, this.getFontSize() / 2);
      ctx.restore();
    }
  };
  // JDIAZ start Función para dibujar el nombre
  var paintTxt = function(ctx, txt) {
    ctx.save();
    var r = R + me.prefs.fontmargin + me.getRealsize() / 2;
    ctx.textAlign = "left";
    var prec = me.getPrecision();
    var display = (mode360) ? AOC : AOC180;
    if (!this.modeRad) {
		display = display * 180 / Math.PI;
	}
		display = Math.round(display * prec) / prec;
    var a = trigo ? -toAngle + AOC / 2 : Math.PI - toAngle + AOC / 2;
    a = a - Math.floor(a / $U.doublePI) * $U.doublePI; // retour en [0;2π]
    if ((a > $U.halfPI) && (a < 3 * $U.halfPI)) {
      a += Math.PI;
      r = -r - 80;
      ctx.textAlign = "right";
    }
    ctx.fillStyle = ctx.strokeStyle;
    ctx.translate(O.getX(), O.getY());
    ctx.rotate(a);
    ctx.fillText(txt + ":", r, me.getFontSize() / 2);
    ctx.restore();
  }
  //JDIAZ end
  //OLD CODE Función para dibujar el nombre
  //var paintTxt = function(ctx, txt) {
  //ctx.save();
  //ctx.fillStyle = ctx.strokeStyle;
  //var r = R + this.prefs.fontmargin + this.getRealsize() / 2;
  //ctx.textAlign = "left";
  //ctx.fillText(txt, (_P1.getX() + _P2.getX()) / 2, (_P1.getY() + _P2.getY()) / 2);

  //LLamar a la función painTxt para dibujar el nombre
  this.paintName = function(ctx) {
    paintTxt(ctx, this.getSubName());
  };

  this.paintObject = function(ctx) {
    if (valid) {
      ctx.beginPath();
      if ($U.approximatelyEqual(AOC180, $U.halfPI)) {
        var cto = R * Math.cos(-toAngle),
          sto = R * Math.sin(-toAngle);
        var cfrom = R * Math.cos(-fromAngle),
          sfrom = R * Math.sin(-fromAngle);
        ctx.moveTo(O.getX() + cto, O.getY() + sto);
        ctx.lineTo(O.getX() + cto + cfrom, O.getY() + sto + sfrom);
        ctx.lineTo(O.getX() + cfrom, O.getY() + sfrom);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(O.getX(), O.getY());
        ctx.lineTo(O.getX() + cto, O.getY() + sto);
        ctx.lineTo(O.getX() + cfrom, O.getY() + sfrom);
        ctx.fill();
      } else {
        ctx.arc(O.getX(), O.getY(), R, -fromAngle, -toAngle, trigo);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(O.getX() + R * Math.cos(-toAngle), O.getY() + R * Math.sin(-toAngle));
        ctx.lineTo(O.getX(), O.getY());
        ctx.lineTo(O.getX() + R * Math.cos(-fromAngle), O.getY() + R * Math.sin(-fromAngle));
        ctx.fill();
      }
    }

  };

  this.compute = function() {
    var t = $U.computeAngleParams(A.getX(), A.getY(), O.getX(), O.getY(), C.getX(), C.getY());
    fromAngle = t.startAngle;
    toAngle = t.endAngle;
    trigo = mode360 ? true : t.Trigo;
    AOC = t.AOC;
    AOC180 = t.AOC180;
    valid = !isNaN(AOC);
    // valid = !isNaN(fromAngle);
    // console.log("fromA="+fromAngle+" toA="+toAngle+" trig="+trigo+" AOC="+AOC);
    // MEAG start
    if (!Cn.getFrame().ifObject(this.getName())) {
      Cn.getFrame().getTextCons(this);
    }
    // MEAG end
  };


  this.getSource = function(src) {
    src.geomWrite(false, this.getName(), "Angle", A.getVarName(), O.getVarName(), C.getVarName());
  };

  this.mouseInside = function(ev) {
    return $U.isNearToArc(O.getX(), O.getY(), AOC, fromAngle, toAngle, trigo, R, this.mouseX(ev), this.mouseY(ev), this.getOversize());
  };

  this.setDefaults("angle");

  // Sobrecarga de getStyle para tratar
  // un caso particular:
  this.getStyle = function(src) {
    var s = this.getStyleString();
    if (isNaN(this.getRealPrecision())) s += ";p:-1";
    src.styleWrite(true, this.getName(), "STL", s);
  };
  // this.getStyleString = function() {
  //     var s = parent.getStyleString();
  //     // console.log("this.getRealPrecision()="+this.getRealPrecision());
  //     if (isNaN(this.getRealPrecision())) s += ";p:-1";
  //     return s;
  // };

  // MEAG start
  this.getTextCons = function() {
    if (this.getParentLength()) {
      texto = "";
      texto = this.getName() + $L.object_angle_description + A.getVarName() + O.getVarName() + C.getVarName();
      parents = [A.getVarName(), O.getVarName(), C.getVarName()];
      return {
        "texto": texto,
        "parents": parents
      };
    }
  }
  // MEAG end

  //JDIAZ start
  this.nameMover = function(ev, zc) {
    me.setShowName(true);
  }
  //JDIAZ end
}
