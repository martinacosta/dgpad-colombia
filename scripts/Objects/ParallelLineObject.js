//************************************************
//************ PARALLELLINE OBJECT ***************
//************************************************
function ParallelLineObject(_construction, _name, _L, _P1) {
  var superObject = $U.extend(this, new PrimitiveLineObject(_construction, _name, _P1)); // Héritage
  var Cn = _construction;

  this.L = _L;

  this.setParent(this.P1, this.L);

  this.getCode = function() {
    return "parallel";
  };

  this.isMoveable = function() {
    // Si P1 est un point libre :
    if ((this.P1.getParentLength() === 0))
      return true;
    return false;
  };

  this.compute = function() {
    //        this.setDX(this.L.getDX());
    //        this.setDY(this.L.getDY());
    this.setDXDY(0, 0, this.L.getDX(), this.L.getDY());
    superObject.compute();
    // MEAG start
    if (!Cn.getFrame().ifObject(this.getName())) {
      Cn.getFrame().getTextCons(this);
    }
    // MEAG end
  };

  this.getSource = function(src) {
    src.geomWrite(false, this.getName(), "Parallel", this.L.getVarName(), this.P1.getVarName());
  };

  // MEAG start
  this.getTextCons = function() {
    if (this.getParentLength()) {
      texto = this.getName() + $L.object_parallel_description_to + this.L.getVarName() + $L.object_parallel_description_by + this.P1.getVarName();
      parents = [this.L.getVarName(), this.P1.getVarName()];
      return {
        "texto": texto,
        "parents": parents
      };
    }
  }
  // MEAG end

};
