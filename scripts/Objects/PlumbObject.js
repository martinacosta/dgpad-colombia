//************************************************
//*************** PLUMB OBJECT *******************
//************************************************
function PlumbObject(_construction, _name, _L, _P1) {
  var superObject = $U.extend(this, new PrimitiveLineObject(_construction, _name, _P1)); // Herencia
  // MEAG start
  var Cn = _construction;
  // MEAG end

  this.L = _L;

  this.setParent(this.P1, this.L)

  this.getCode = function() {
    return "plumb";
  };


  this.isMoveable = function() {
    // Si P1 es un puno libre :
    if ((this.P1.getParentLength() === 0)) return true;
    return false;
  };

  this.compute = function() {
    this.setDXDY(0, 0, this.L.getDY(), -this.L.getDX());
    superObject.compute();
    // MEAG start
    if (!Cn.getFrame().ifObject(this.getName())) {
      Cn.getFrame().getTextCons(this);
    }
    // MEAG end
  };

  this.getSource = function(src) {
    src.geomWrite(false, this.getName(), "Perpendicular", this.L.getVarName(), this.P1.getVarName());
  };
  
  //JDIAZ 11/25
  var mp_XY = {"ex": 0, "ey": 0};
  var Sg;

  var paintTxt = function(ctx, txt) {
    var ex = mp_XY.ex + _P1.getX();
    var yCalc = _P1.getY() + Sg * mp_XY.ex;

    yCalc += mp_XY.ey < _P1.getY() + Sg * mp_XY.ex ? -8 : 35;
    ctx.save();
    ctx.fillStyle = ctx.strokeStyle;
    ctx.textAlign = "center";
    ctx.fillText(txt, ex, yCalc);
  }

  this.nameMover = function(ev, zc) {
    var ex = zc.mouseX(ev) - _P1.getX();
    var ey = zc.mouseY(ev);
    mp_XY = {"ex": ex, "ey": ey};
    
    this.setShowName(true);
  };

  this.paintName = function(ctx) {
      Sg = this.getNDY() / this.getNDX();
      paintTxt(ctx, this.getSubName());
  };
  //JDIAZ end

  // MEAG start
  this.getTextCons = function() {
    if (this.getParentLength()) {
      texto = this.getName() + $L.object_plumb_description_to + this.L.getVarName() + $L.object_plumb_description_by + this.P1.getVarName();
      parents = [this.L.getVarName(), this.P1.getVarName()];
      return {
        "texto": texto,
        "parents": parents
      };
    }
  }
  // MEAG end

};
