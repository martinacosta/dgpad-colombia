//************************************************
//************** ROTATION CONSTRUCTOR ************
//************************************************
function HomothetyConstructor() {
    $U.extend(this, new ObjectConstructor()); //Héritage

    this.getCode = function() {
        return "homotecia";
    };

    //MEAG insert title in image
    this.getTitle = function() {
      return $L.tool_title_homothety;
    }

    this.getInitials = function() {
        return ["point,expression"];
    };

    this.isLastObject = function() {
        var c = this.getCList();
        return (c.length === 3);
    };

    this.newObj = function(_zc, _C) {
		if (_C[1].isInstanceType("circle")) {
            return new HomoCircleObject(_zc.getConstruction(), "_c", _C[0], _C[1]);
        }
		else if (_C[1].isInstanceType("arc")) {
            return new HomoArcObject(_zc.getConstruction(), "_ar", _C[0], _C[1]);
        }
		// else if (_C[1].getCode()=="vector") {
            // return new SymaVectorObject(_zc.getConstruction(), "_v", _C[0], _C[1]);
        // }
		else if (_C[1].isInstanceType("segment")) {
            return new HomoSegmentObject(_zc.getConstruction(), "_s", _C[0], _C[1]);
        }
		else if (_C[1].isInstanceType("ray")) {
            return new HomoRayObject(_zc.getConstruction(), "_sr", _C[0], _C[1]);
        }
		// else if (_C[1].isInstanceType("point")) {
            // return new HomoPointObject(_zc.getConstruction(), "_P", _C[0], _C[1]);
        // }
		else if (_C[1].isInstanceType("area")) {
            return new HomoAreaObject(_zc.getConstruction(), "_Pol", _C[0], _C[1]);
        }
		else if (_C[1].isInstanceType("line")) {
            return new HomoLineObject(_zc.getConstruction(), "_r", _C[0], _C[1]);
        }
		else {
			return new HomothetyObject(_zc.getConstruction(), "_P", _C[0], _C[1]);
        }
        // return new HomothetyObject(_zc.getConstruction(), "_P", _C[0], _C[1], _C[2]);
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
       
        var size = zc.prefs.size.point;
        if (Object.touchpad) {
            size *= zc.prefs.size.touchfactor;
        }

        var c = this.getCList();
        var len = c.length;
        var x;
        var y;
        var f = c[0].getValue();
        if (len == 2){
            x = f * (c[1].getX() - zc.mouseX(ev)) + zc.mouseX(ev);
            y = f * (c[1].getY() - zc.mouseY(ev)) + zc.mouseY(ev);
        }
        var ctx = zc.getContext();
        ctx.strokeStyle = zc.prefs.color.hilite;
        ctx.lineWidth = zc.prefs.size.pointborder;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
        switch (len){
            case 1:
                ctx.fillStyle=zc.prefs.color.hilite;
		        ctx.font = "16px Verdana";
		        ctx.fillText($L.tool_Homothety_help_1+c[0].getValue()+ $L.tool_Homothety_help_1a,zc.mouseX(ev)+40, zc.mouseY(ev));
                
                break;
            case 2:
                ctx.fillStyle=zc.prefs.color.hilite;
                ctx.font = "16px Verdana";
                ctx.fillText($L.tool_Homothety_help_2+c[0].getValue() +$L.tool_Homothety_help_2a+ c[1].getName() + $L.tool_Homothety_help_3, zc.mouseX(ev)+40, zc.mouseY(ev));
            
            break;
        };
    }
}