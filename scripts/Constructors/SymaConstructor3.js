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
        return ["line,circle, point, segment, ray, area, vector,arc"];
    };
	
	this.getFinals = function() {
		return ["point", "segment", "line", "circle", "area","ray"];
	}

    this.createCallBack = function(zc, o) {
        zc.namesManager.setName(o);
    };

	this.isLastObject = function() {
        var c = this.getCList();
        return (c.length === 2);
    };

    this.newObj = function(_zc, _C) {
		
		if (_C[1].getCode()=="arc3pts") {
            return new SymaArcObject(_zc.getConstruction(), "_ar", _C[0], _C[1]);
		
        }
		else if (_C[1].isInstanceType("circle")) {
            return new SymaCircleObject(_zc.getConstruction(), "_c", _C[0], _C[1]);
        }
		else if (_C[1].getCode()=="vector") {
            return new SymaVectorObject(_zc.getConstruction(), "_v", _C[0], _C[1]);
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
        if (len > 0) {
            this.addC(selection[0]);
        }  
			else {var o = new PointObject(zc.getConstruction(), "_P", zc.mouseX(ev), zc.mouseY(ev));
        zc.addObject(o);
		this.addC(o);
		cn.getFrame().getTextCons(o);
		};
    };

    this.preview = function(ev, zc) {
        //MEAG añadido para reconocer un punto seleccionado y cambiar el mensaje
		var cn = zc.getConstruction();
        var selection = cn.getIndicated();
        var len = selection.length;
		var texto2 = $L.tool_segment_help_2;
        if (len > 0 && selection[0].isInstanceType("point")) {
			texto2= $L.tool_Syma_help_1b;
		}
		if (len > 0 && selection[0].getCode()=="segment") {
			texto2= $L.tool_Syma_help_1c;
		}
		if (len > 0 && selection[0].getCode()=="line") {
			texto2= $L.tool_Syma_help_1d;
		}
		if (len > 0 && selection[0].getCode()=="ray") {
			texto2= $L.tool_Syma_help_1e;
		}
		if (len > 0 && selection[0].isInstanceType("circle")) {
			texto2= $L.tool_Syma_help_1f;
		}
		if (len > 0 && selection[0].getCode()=="vector") {
			texto2= $L.tool_Syma_help_1g;
		}
		if (len > 0 && selection[0].getCode()=="arc3pts") {
			texto2= $L.tool_Syma_help_1h;
		}
		if (len > 0 && selection[0].getCode()=="area") {
			texto2= $L.tool_Syma_help_1i;
		}
		if (len == 0) {
			texto2=$L.tool_Syma_help_1a;
		}
		
		//fin MEAG
		var size = zc.prefs.size.point;
        if (Object.touchpad) {
            size *= zc.prefs.size.touchfactor;
        }
        var coords = this.getC(0).reflectXY(zc.mouseX(ev), zc.mouseY(ev));
        var ctx = zc.getContext();
		
		ctx.strokeStyle = zc.prefs.color.hilite;
        ctx.lineWidth = zc.prefs.size.pointborder;
        ctx.beginPath();
		// if (len > 0 && selection[0].isInstanceType("circle")) {
				// ctx.arc(this.getCList()[0].reflectXY(selection[0].getP1())[0], this.getCList()[0].reflectXY(selection[0].getP1())[1], size, selection[0].getR(), Math.PI * 2, true);
		// }
        ctx.arc(coords[0], coords[1], size, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
		ctx.fillStyle=zc.prefs.color.hilite;
		ctx.font = "16px Verdana";
		ctx.fillText(texto2+this.getC(0).getName(),zc.mouseX(ev)+40, zc.mouseY(ev));
		
    };
}
