//************************************************
//************ PerpBisectorConstructor ***********
//************************************************
function PerpBisectorConstructor() {
    $U.extend(this, new ObjectConstructor()); //Héritage

    this.getCode = function() {
        return "perpbis";
    };

    //MEAG insert title in image
    this.getTitle = function() {
      return $L.tool_title_perpbisector;
    }

    this.getInitials = function() {
        return ["point,segment"];
    };

    // Si le premier constituant est un segment, alors
    // il s'agit d'une construction instantannée
    this.isInstantTool = function() {
        return (this.getC(0).isInstanceType("segment"));
    };

    this.newObj = function(_zc, _C) {
        var first = this.getC(0);
        if (first.isInstanceType("segment")) {
            _C = [first.P1, first.P2];
        }
        return new PerpBisectorObject(_zc.getConstruction(), "_r", _C[0], _C[1]);
    };

    var normalize = function(xA, yA, xB, yB) {
        var l = Math.sqrt((xB - xA) * (xB - xA) + (yB - yA) * (yB - yA));
        return {
            x: (xB - xA) / l,
            y: (yB - yA) / l
        };
    };

    this.preview = function(ev, zc) {
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
		if (len > 0 && selection[0].getCode()=="ray") {
			texto2= $L.tool_segment_help_2e;
		}
		if (len > 0 && selection[0].getCode()=="anglebiss") {
			texto2= $L.tool_segment_help_2e;
		}
		if (len > 0 && selection[0].getCode()=="fixedangle") {
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
        if (this.isInstantTool()) return;
        var ctx = zc.getContext();
        var xA = this.getC(0).getX();
        var yA = this.getC(0).getY();
        var xB = zc.mouseX(ev);
        var yB = zc.mouseY(ev);
        var xM = (xA + xB) / 2;
        var yM = (yA + yB) / 2;



        var d = normalize(0, 0, yA - yB, xB - xA);
        var t = $U.computeBorderPoints(xM, yM, d.x, d.y, zc.getWidth(), zc.getHeight());
        ctx.strokeStyle = zc.prefs.color.hilite;
        ctx.lineWidth = zc.prefs.size.line;
        ctx.beginPath();
        ctx.moveTo(t[0], t[1]);
        ctx.lineTo(t[2], t[3]);
        ctx.closePath();
        ctx.stroke();
		ctx.fillStyle=zc.prefs.color.hilite;
		ctx.font = "16px Verdana";
		ctx.fillText($L.tool_PerpBiss_help_1+this.getC(0).getName()+texto2,zc.mouseX(ev)+40, zc.mouseY(ev));
		ctx.fillText(this.getC(0).getName(),this.getC(0).getX()+20,this.getC(0).getY());
    };
}
