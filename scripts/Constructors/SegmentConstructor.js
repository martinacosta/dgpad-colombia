//************************************************
//*************** SEGMENT CONSTRUCTOR **************
//************************************************
function SegmentConstructor() {
    $U.extend(this, new ObjectConstructor()); //Héritage

    this.getCode = function() {
        return "segment";
    };

    //MEAG insert title in image
    this.getTitle = function() {
      return $L.tool_title_segment;
    }

    this.getInitials = function() {
        return ["point"];
    };

    this.newObj = function(_zc, _C) {
        return new SegmentObject(_zc.getConstruction(), "_s", _C[0], _C[1]);
    };

    this.preview = function(ev, zc) {
		//MEAG añadido para reconocer un punto seleccionado y cambiar el mensaje
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
        var ctx = zc.getContext();
        ctx.strokeStyle = zc.prefs.color.hilite;
        ctx.lineWidth = zc.prefs.size.line;
        ctx.beginPath();
        ctx.moveTo(this.getC(0).getX(), this.getC(0).getY());
        ctx.lineTo(zc.mouseX(ev), zc.mouseY(ev));
		ctx.closePath();
        ctx.stroke();
		ctx.fillStyle=zc.prefs.color.hilite;
		ctx.font = "16px Verdana";
		ctx.fillText($L.tool_segment_help_1+this.getC(0).getName()+texto2,zc.mouseX(ev)+40, zc.mouseY(ev));
		ctx.fillText(this.getC(0).getName(),this.getC(0).getX()+20,this.getC(0).getY());
    };
}
