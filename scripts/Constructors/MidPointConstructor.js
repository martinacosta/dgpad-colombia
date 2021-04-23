//************************************************
//*************** MIDPOINT CONSTRUCTOR ***********
//************************************************
function MidPointConstructor() {
    $U.extend(this, new ObjectConstructor()); //Héritage

    this.getCode = function() {
        return "midpoint";
    };

    //MEAG insert title in image
    this.getTitle = function() {
      return $L.tool_title_midpoint;
    }

    this.getInitials = function() {
        return ["point,segment"];
    };

    // Si le premier constituant est un segment, alors
    // il s'agit d'une construction instantannée
    this.isInstantTool = function() {
        return (this.getC(0).isInstanceType("segment"));
    };

    this.createCallBack = function(zc, o) {
        zc.namesManager.setName(o);
    };

    this.newObj = function(_zc, _C) {
        var first = this.getC(0);
        if (first.isInstanceType("segment")) {
            _C = [first.P1, first.P2];
        }
        return new MidPointObject(_zc.getConstruction(), "_P", _C[0], _C[1]);
    };

    this.preview = function(ev, zc) {
        if (this.isInstantTool()) return;
        var size = zc.prefs.size.point;
        if (Object.touchpad) {
            size *= zc.prefs.size.touchfactor;
        }
        var x = (this.getC(0).getX() + zc.mouseX(ev)) / 2;
        var y = (this.getC(0).getY() + zc.mouseY(ev)) / 2;

        var ctx = zc.getContext();
		//MEAG añadido para reconocer un punto seleccionado
		var cn = zc.getConstruction();
        var selection = cn.getIndicated();
        var len = selection.length;
		var texto2 = $L.tool_segment_help_2;
        if (len > 0 && selection[0].isInstanceType("point")) {
			texto2= $L.tool_segment_help_2b;
		}
		if (len > 0 && selection[0].getCode()=="segment") {
			texto2= $L.tool_segment_help_2c;
		}
		if (len > 0 && selection[0].getCode()=="line") {
			texto2= $L.tool_segment_help_2d;
		} 
		if (len > 0 && selection[0].getCode()=="perpbis") {
			texto2= $L.tool_segment_help_2d;
		}
		if (len > 0 && selection[0].getCode()=="anglebiss") {
			texto2= $L.tool_segment_help_2e;
		}
		if (len > 0 && selection[0].getCode()=="fixedangle") {
			texto2= $L.tool_segment_help_2e;
		}
		if (len > 0 && selection[0].getCode()=="ray") {
			texto2= $L.tool_segment_help_2e;
		}
		if (len > 0 && selection[0].isInstanceType("circle")) {
			texto2= $L.tool_segment_help_2f;
		}
		if (len > 0 && selection[0].getCode()=="vector") {
			texto2= $L.tool_segment_help_2g;
		}
		if (len > 0 && selection[0].getCode()=="arc3pts") {
			texto2= $L.tool_segment_help_2h;
		}
		if (len == 0) {
			texto2=$L.tool_segment_help_2a;
		}
		if (len == 2) {
			texto2=$L.tool_segment_help_2_intersection;
		}
		//fin MEAG
        ctx.strokeStyle = zc.prefs.color.hilite;
        ctx.lineWidth = zc.prefs.size.pointborder;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
		ctx.fillStyle=zc.prefs.color.hilite;
		ctx.font = "16px Verdana";
		ctx.fillText($L.tool_MidPoint_help_1+this.getC(0).getName()+texto2,zc.mouseX(ev)+40, zc.mouseY(ev));
		ctx.fillText(this.getC(0).getName(),this.getC(0).getX()+20,this.getC(0).getY());
    };

}
