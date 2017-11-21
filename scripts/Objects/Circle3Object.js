//************************************************
//************** CIRCLE OBJECT *******************
//************************************************
function Circle3Object(_construction, _name, _P3, _P2, _P1) {
  $U.extend(this, new PrimitiveCircleObject(_construction, _name, _P1)); // Héritage
  var me = this;
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
  var paintTxt = function(ctx, txt, R) {
    ctx.save();
    ctx.fillStyle = ctx.strokeStyle;
    ctx.textAlign = "center";
    ctx.fillText(txt, _P1.getX(), _P1.getY() - (R - (R / 4)));

  }
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
  };

  this.getSource = function(src) {
    src.geomWrite(false, this.getName(), "Circle3", this.P3.getVarName(), this.P2.getVarName(), this.P1.getVarName());
  };


  //MEAG cambios

  this.getTextCons = function() {
    len = this.getParentLength();
    texto = "";
    texto = this.getName() + $L.object_circle3object_description + this.P3.getVarName() + this.P2.getVarName() + $L.object_circle3object_description_center + this.P1.getVarName();
    parents = [this.P3.getVarName(), this.P2.getVarName(), this.P1.getVarName()];
    return {
      "texto": texto,
      "parents": parents
    };
  }

};
