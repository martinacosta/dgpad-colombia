//************************************************
//*************** VECTOR CONSTRUCTOR *************
//************************************************
function VectorConstructor() {
    $U.extend(this, new ObjectConstructor()); //Héritage

    this.getCode = function() {
        return "vector";
    };

    //MEAG insert title in image
    this.getTitle = function() {
      return $L.tool_title_vector;
    }

    this.getInitials = function() {
        return ["point"];
    };

    this.newObj = function(_zc, _C) {
        var a = new VectorObject(_zc.getConstruction(), "_v", _C[0], _C[1]);
        a.setOpacity(_zc.prefs.opacity.vector);
        return a;
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
        var x1 = this.getC(0).getX(),
            y1 = this.getC(0).getY();
        var x2 = zc.mouseX(ev),
            y2 = zc.mouseY(ev);
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.lineCap = 'butt';
        var headlen = zc.prefs.size.vectorhead;
        var angle = Math.atan2(y2 - y1, x2 - x1);
        var c1 = Math.cos(angle - Math.PI / 8);
        var s1 = Math.sin(angle - Math.PI / 8);
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - headlen * c1, y2 - headlen * s1);
        ctx.lineTo(x2 - headlen * Math.cos(angle + Math.PI / 8), y2 - headlen * Math.sin(angle + Math.PI / 8));
        ctx.lineTo(x2, y2);
        ctx.lineTo(x2 - headlen * c1, y2 - headlen * s1);
        ctx.fillStyle = ctx.strokeStyle;
        ctx.stroke();
        ctx.fill();
		ctx.fillStyle=zc.prefs.color.hilite;
		ctx.font = "16px Verdana";
		ctx.fillText($L.tool_Vector_help_1+this.getC(0).getName()+texto2,zc.mouseX(ev)+40, zc.mouseY(ev));
		ctx.fillText(this.getC(0).getName(),this.getC(0).getX()+20,this.getC(0).getY());


    };
}
