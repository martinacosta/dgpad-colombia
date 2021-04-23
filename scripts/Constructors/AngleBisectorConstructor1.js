//************************************************
//**************** AREA CONSTRUCTOR **************
//************************************************
function AngleBisectorConstructor() {
    $U.extend(this, new ObjectConstructor()); //Herencia
    this.getCode = function() {
        return "anglebiss";
    };

    //MEAG insert title in image
    this.getTitle = function() {
      return $L.tool_title_anglebiss;
    }

    this.getInitials = function() {
        return ["point"];
    };

    this.isLastObject = function() {
        var c = this.getCList();
        return (c.length === 3);
    };

    this.newObj = function(_zc, _C) {
        return (new AngleBisectorObject(_zc.getConstruction(), "_sr", _C[0], _C[1], _C[2]));
    };

    this.preview = function(ev, zc) {
		//MEAG añadido para reconocer un punto seleccionado y cambiar el mensaje
		var cn = zc.getConstruction();
        var selection = cn.getIndicated();
        var leng = selection.length;
		var c = this.getCList();
		var len = c.length;
		if (len==1){
			if (leng == 1 && selection[0].isInstanceType("point")) {
				texto2= $L.tool_AngleBissector_help_2b;
			}
			if (leng == 1 && selection[0].getCode()=="segment") {
				texto2= $L.tool_AngleBissector_help_2c;
			}
			if (leng == 1 && selection[0].getCode()=="line") {
				texto2= $L.tool_AngleBissector_help_2d;
			}
			if (leng == 1 && selection[0].getCode()=="perpbis") {
				texto2= $L.tool_AngleBissector_help_2d;
			}
			if (leng == 1 && selection[0].getCode()=="ray") {
				texto2= $L.tool_AngleBissector_help_2e;
			}
			if (leng == 1 && selection[0].getCode()=="anglebiss") {
				texto2= $L.tool_AngleBissector_help_2e;
			}
			if (leng == 1 && selection[0].getCode()=="fixedangle") {
				texto2= $L.tool_AngleBissector_help_2e;
			}
			if (leng == 1 && selection[0].isInstanceType("circle")) {
				texto2= $L.tool_AngleBissector_help_2f;
			}
			if (leng == 1 && selection[0].getCode()=="vector") {
				texto2= $L.tool_AngleBissector_help_2g;
			}
			if (leng == 1 && selection[0].getCode()=="arc3pts") {
				texto2= $L.tool_AngleBissector_help_2h;
			}
			if (leng == 0) {
				texto2=$L.tool_AngleBissector_help_2a;
			}
			if (leng == 2) {
			texto2=$L.tool_AngleBissector_help_2_intersection;
		}
		}
		if (len=2) {
			if (leng == 1 && selection[0].isInstanceType("point")) {
				texto3= $L.tool_AngleBissector_help_3b;
			}
			if (leng == 1 && selection[0].getCode()=="segment") {
				texto3= $L.tool_AngleBissector_help_3c;
			}
			if (leng == 1 && selection[0].getCode()=="line") {
				texto3= $L.tool_AngleBissector_help_3d;
			}
			if (leng == 1 && selection[0].getCode()=="perpbis") {
				texto3= $L.tool_AngleBissector_help_3d;
			}
			if (leng == 1 && selection[0].getCode()=="ray") {
				texto3= $L.tool_AngleBissector_help_3e;
			}
			if (leng == 1 && selection[0].getCode()=="anglebiss") {
				texto3= $L.tool_AngleBissector_help_3e;
			}
			if (leng == 1 && selection[0].getCode()=="fixedangle") {
				texto3= $L.tool_AngleBissector_help_3e;
			}
			if (leng == 1 && selection[0].isInstanceType("circle")) {
				texto3= $L.tool_AngleBissector_help_3f;
			}
			if (leng == 1 && selection[0].getCode()=="vector") {
				texto3= $L.tool_AngleBissector_help_3g;
			}
			if (leng == 1 && selection[0].getCode()=="arc3pts") {
				texto3= $L.tool_AngleBissector_help_3h;
			}
			if (leng == 0) {
				texto3=$L.tool_AngleBissector_help_3a;
			}
			if (leng == 2) {
			texto3=$L.tool_AngleBissector_help_3_intersection;
			}
		}
		//fin MEAG
        var ctx = zc.getContext();
        ctx.strokeStyle = zc.prefs.color.hilite;
        ctx.lineWidth = zc.prefs.size.line;
        ctx.beginPath();
        var c = this.getCList();
        var len = c.length;
        var xM = yM = xA = yA = 0;
        switch (len) {
            case 1:
                xA = zc.mouseX(ev);
                yA = zc.mouseY(ev);
                xM = c[0].getX();
                yM = c[0].getY();
                break;
            case 2:
                if (this.isSelectCreatePoint) {
                    xA = c[1].getX();
                    yA = c[1].getY();
                    xM = c[0].getX();
                    yM = c[0].getY();
                    this.isSelectCreatePoint = false;
                } else {
                    var b = $U.d(c[1], c[0]);
                    var a = $U.d(c[1], zc.mouse(ev));
                    var k = b / (a + b);
                    xA = c[1].getX();
                    yA = c[1].getY();
                    xM = c[0].getX() + k * (zc.mouseX(ev) - c[0].getX());
                    yM = c[0].getY() + k * (zc.mouseY(ev) - c[0].getY());
                }
                break;
        }
        var t = $U.computeBorderPoints(xA, yA, xM - xA, yM - yA, zc.getWidth(), zc.getHeight());
        ctx.strokeStyle = zc.prefs.color.hilite;
        ctx.lineWidth = zc.prefs.size.line;
        ctx.beginPath();
        ctx.moveTo(xA, yA);
        ctx.lineTo(t[2], t[3]);
        ctx.stroke();
        ctx.closePath();
		switch (len) {
            case 1:
                ctx.fillStyle=zc.prefs.color.hilite;
				ctx.font = "16px Verdana";
				ctx.fillText($L.tool_AngleBissector_help_1+this.getC(0).getName()+texto2,zc.mouseX(ev)+40, zc.mouseY(ev));
                
                break;
            case 2:
                ctx.fillStyle=zc.prefs.color.hilite;
				ctx.font = "16px Verdana";
				ctx.fillText($L.tool_AngleBissector_help_1+this.getC(0).getName()+","+$L.tool_AngleBissector_help_2i+this.getC(1).getName()+texto3,zc.mouseX(ev)+40, zc.mouseY(ev));
                
                break;
        }
    };
}
