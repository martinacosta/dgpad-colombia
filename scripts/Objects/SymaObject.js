//************************************************
//*************** MIDPOINT OBJECT ****************
//************************************************
function SymaObject(_construction, _name, _L, _P) {
    $U.extend(this, new PointObject(_construction, _name, 0, 0)); // Héritage
    var L = _L;
    var P = _P;
    this.setParent(L, P)
    this.setFillStyle(2);

    this.getCode = function() {
        return "syma";
    };


    this.isMoveable = function() {
        return false;
    };


    this.compute = function() {
        L.reflect(P, this);
    };

    this.getSource = function(src) {
        if (this.execMacroSource(src)) return;
        src.geomWrite(false, this.getName(), "Reflection", L.getVarName(), P.getVarName());
    };
	//MEAG cambios

	this.getTextCons = function () {
      len = this.getParentLength();
      texto = "";
		texto = this.getName() + ": punto simétrico de " + P.getVarName()+ " con respecto a " + L.getVarName();
		return texto;
	}
	

};
