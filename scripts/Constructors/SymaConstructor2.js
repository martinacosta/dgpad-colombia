//************************************************
//*************** Axial Symmetry CONSTRUCTOR ***********
//************************************************
function SymaConstructor() {
    $U.extend(this, new ObjectConstructor()); //Héritage

    this.getCode = function() {
        return "syma";
    };

    //MEAG insert title in image
    this.getTitle = function() {
      return $L.tool_title_syma;
    }

    this.getInitials = function() {
        return ["line","circle"];
    };
	
	this.getFinals = function() {
		return ["point", "segment", "line", "circle", "area","ray"];
	}

    /* this.createCallBack = function(zc, o) {
        zc.namesManager.setName(o);
    }; */

	this.isLastObject = function() {
        var c = this.getCList();
        return (c.length === 2);
    };

    this.newObj = function(_zc, _C) {
		
		if (_C[1].isInstanceType("circle")) {
            return new SymaCircleObject(_zc.getConstruction(), "_c", _C[0], _C[1]);
        }
		else if (_C[1].isInstanceType("segment")) {
            return new SymaSegmentObject(_zc.getConstruction(), "_s", _C[0], _C[1]);
        }
		else if (_C[1].isInstanceType("ray")) {
            return new SymaRayObject(_zc.getConstruction(), "_sr", _C[0], _C[1]);
        }
		else if (_C[1].isInstanceType("point")) {
            return new SymaPointObject(_zc.getConstruction(), "_P", _C[0], _C[1]);
        }
		else if (_C[1].isInstanceType("area")) {
            return new SymaAreaObject(_zc.getConstruction(), "_Pol", _C[0], _C[1]);
        }
		else if (_C[1].isInstanceType("line")) {
            return new SymaLineObject(_zc.getConstruction(), "_r", _C[0], _C[1]);
        }
		else {
			return new SymaPointObject(_zc.getConstruction(), "_P", _C[0], _C[1]);
        }
    };
	
	
	    this.selectCreatePoint = function(zc, ev) {
        this.isSelectCreatePoint = true;
        var cn = zc.getConstruction();
        var selection = cn.getIndicated();
        var len = selection.length;
        if (len > 0 && !selection[0].isInstanceType("point")) {
            this.addC(selection[0]);
        }  
			// else {this.addC(selection[0])};
    };

    this.preview = function(ev, zc) {
        var size = zc.prefs.size.point;
        if (Object.touchpad) {
            size *= zc.prefs.size.touchfactor;
        }
        var coords = this.getC(0).reflectXY(zc.mouseX(ev), zc.mouseY(ev));
        var ctx = zc.getContext();
        ctx.strokeStyle = zc.prefs.color.hilite;
        ctx.lineWidth = zc.prefs.size.pointborder;
        ctx.beginPath();
        ctx.arc(coords[0], coords[1], size, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
		ctx.fillStyle=zc.prefs.color.hilite;
		ctx.font = "16px Verdana";
		ctx.fillText($L.tool_Syma_help_1+this.getC(0).getName(),zc.mouseX(ev)+40, zc.mouseY(ev));
    };
}
