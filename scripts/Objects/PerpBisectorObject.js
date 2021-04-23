//************************************************
//********** PerpBisectorObject OBJECT ***********
//************************************************
function PerpBisectorObject(_construction, _name, _A1, _A2) {
  var M = new VirtualPointObject(0, 0);
  var superObject = $U.extend(this, new PrimitiveLineObject(_construction, _name, M)); // Herencia
  // MEAG start
  var Cn = _construction;
  // MEAG end

  this.A1 = _A1;
  this.A2 = _A2;

  this.setParent(this.A1, this.A2)

  this.getCode = function() {
    return "perpbis";
  };


  this.isMoveable = function() {
    // Si los extremos son puntos libres:
    if ((this.A1.getParentLength() === 0) && (this.A2.getParentLength() === 0)) return true;
    return false;
  };

  this.dragObject = function(_x, _y) {
    var vx = _x - this.startDragX;
    var vy = _y - this.startDragY;
    this.A1.setXY(this.A1.getX() + vx, this.A1.getY() + vy);
    this.A2.setXY(this.A2.getX() + vx, this.A2.getY() + vy);
    this.startDragX = _x;
    this.startDragY = _y;
  };

  this.computeDrag = function() {
    this.compute();
    this.computeChilds();
  };

  this.compute = function() {
    var xA = this.A1.getX(),
      yA = this.A1.getY();
    var xB = this.A2.getX(),
      yB = this.A2.getY();
    M.setXY((xA + xB) / 2, (yA + yB) / 2);
    this.setDXDY(0, 0, yA - yB, xB - xA);
    superObject.compute();
    // MEAG start
    if (!Cn.getFrame().ifObject(this.getName())) {
      Cn.getFrame().getTextCons(this);
    }
    // MEAG end
  };

  //JDIAZ 11/20
  var mp_XY = {"ex": 0, "ey": 0};
  var Sg;

  var paintTxt = function(ctx, txt) {
    var ex = mp_XY.ex + M.getX();
    var yCalc = M.getY() + Sg * mp_XY.ex;

    yCalc += mp_XY.ey < M.getY() + Sg * mp_XY.ex ? -8 : 35;
    ctx.save();
    ctx.fillStyle = ctx.strokeStyle;
    ctx.textAlign = "center";
    ctx.fillText(txt, ex, yCalc);
  }

  this.nameMover = function(ev, zc) {
    var ex = zc.mouseX(ev) - this.P1.getX();
    var ey = zc.mouseY(ev);
    mp_XY = {"ex": ex, "ey": ey};
    
    this.setShowName(true);
  };

  this.paintName = function(ctx) {
      Sg = this.getNDY() / this.getNDX();
      paintTxt(ctx, this.getSubName());
  };
  //JDIAZ end

  this.getSource = function(src) {
    src.geomWrite(false, this.getName(), "PerpendicularBisector", this.A1.getVarName(), this.A2.getVarName());
  };

  // MEAG start
  this.getTextCons = function() {
    if (this.getParentLength()) {
      texto = "";
      texto = this.getName() + $L.object_perpbis_description + this.A1.getVarName() + $L.object_perpbis_description_and + this.A2.getVarName();
      parents = [this.A1.getVarName(), this.A2.getVarName()];
      return {
        "texto": texto,
        "parents": parents
      };
    }
  }
  // MEAG end

};
