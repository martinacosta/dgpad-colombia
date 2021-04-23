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
        return (new AngleBisectorObject(_zc.getConstruction(), "_r", _C[0], _C[1], _C[2]));
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
			else if (leng == 1 && selection[0].getCode()=="segment") {
				texto2= $L.tool_AngleBissector_help_2c;
			}
			else if (leng == 1 && selection[0].getCode()=="line") {
				texto2= $L.tool_AngleBissector_help_2d;
			}
			else if (leng == 1 && selection[0].getCode()=="perpbis") {
				texto2= $L.tool_AngleBissector_help_2d;
			}
			else if (leng == 1 && selection[0].getCode()=="ray") {
				texto2= $L.tool_AngleBissector_help_2e;
			}
			else if (leng == 1 && selection[0].getCode()=="anglebiss") {
				texto2= $L.tool_AngleBissector_help_2e;
			}
			else if (leng == 1 && selection[0].getCode()=="fixedangle") {
				texto2= $L.tool_AngleBissector_help_2e;
			}
			else if (leng == 1 && selection[0].isInstanceType("circle")) {
				texto2= $L.tool_AngleBissector_help_2f;
			}
			else if (leng == 1 && selection[0].getCode()=="vector") {
				texto2= $L.tool_AngleBissector_help_2g;
			}
			else if (leng == 1 && selection[0].getCode()=="arc3pts") {
				texto2= $L.tool_AngleBissector_help_2h;
			}
			else if (leng == 0) {
				texto2=$L.tool_AngleBissector_help_2a;
			}
			else if (leng == 2) {
			texto2=$L.tool_AngleBissector_help_2_intersection;
		}
		}
		if (len=2) {
			if (leng == 1 && selection[0].isInstanceType("point")) {
				texto3= $L.tool_AngleBissector_help_3b;
			}
			else if (leng == 1 && selection[0].getCode()=="segment") {
				texto3= $L.tool_AngleBissector_help_3c;
			}
			else if (leng == 1 && selection[0].getCode()=="line") {
				texto3= $L.tool_AngleBissector_help_3d;
			}
			else if (leng == 1 && selection[0].getCode()=="perpbis") {
				texto3= $L.tool_AngleBissector_help_3d;
			}
			else if (leng == 1 && selection[0].getCode()=="ray") {
				texto3= $L.tool_AngleBissector_help_3e;
			}
			else if (leng == 1 && selection[0].getCode()=="anglebiss") {
				texto3= $L.tool_AngleBissector_help_3e;
			}
			else if (leng == 1 && selection[0].getCode()=="fixedangle") {
				texto3= $L.tool_AngleBissector_help_3e;
			}
			else if (leng == 1 && selection[0].isInstanceType("circle")) {
				texto3= $L.tool_AngleBissector_help_3f;
			}
			else if (leng == 1 && selection[0].getCode()=="vector") {
				texto3= $L.tool_AngleBissector_help_3g;
			}
			else if (leng == 1 && selection[0].getCode()=="arc3pts") {
				texto3= $L.tool_AngleBissector_help_3h;
			}
			else if (leng == 0) {
				texto3=$L.tool_AngleBissector_help_3a;
			}
			else if (leng == 2) {
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
					// fromA = $U.angleH(c[0].getX() - xM, c[0].getY() - yM);
                    // fromA = fromA - Math.PI / 6;
                    // toA = fromA + Math.PI / 3;
					// trig=false;
                    this.isSelectCreatePoint = false;
                } else {
                    var b = $U.d(c[1], c[0]);
                    var a = $U.d(c[1], zc.mouse(ev));
                    var k = b / (a + b);
                    xA = c[1].getX();
                    yA = c[1].getY();
                    xM = c[0].getX() + k * (zc.mouseX(ev) - c[0].getX());
                    yM = c[0].getY() + k * (zc.mouseY(ev) - c[0].getY());
					var t = $U.computeAngleParams(c[0].getX(), c[0].getY(), c[1].getX(), c[1].getY(), zc.mouseX(ev), zc.mouseY(ev));
                    fromA = t.startAngle;
                    toA = t.endAngle;
                    trig = t.Trigo;
					ctx.beginPath();
					ctx.arc(c[1].getX(), c[1].getY(), 30, -fromA, -toA, trig);
				ctx.stroke();
				ctx.closePath();
                }
				ctx.beginPath();
				ctx.moveTo(c[0].getX(), c[0].getY());
				ctx.lineTo(c[1].getX(), c[1].getY());
				ctx.stroke();
				ctx.closePath();
				ctx.beginPath();
				ctx.moveTo(c[1].getX(), c[1].getY());
				ctx.lineTo(zc.mouseX(ev), zc.mouseY(ev));
				ctx.stroke();
				ctx.closePath();
				
				
                break;
        }
		
        var t = $U.computeBorderPoints(xA, yA, xM - xA, yM - yA, zc.getWidth(), zc.getHeight());
        ctx.strokeStyle = zc.prefs.color.hilite;
        ctx.lineWidth = zc.prefs.size.line;
        ctx.beginPath();
        ctx.moveTo(t[0], t[1]);
        ctx.lineTo(t[2], t[3]);
        ctx.stroke();
        ctx.closePath();
		
		switch (len) {
            case 1:
                ctx.fillStyle=zc.prefs.color.hilite;
				ctx.font = "16px Verdana";
				ctx.fillText($L.tool_AngleBissector_help_1+this.getC(0).getName()+texto2,zc.mouseX(ev)+40, zc.mouseY(ev));
                ctx.fillText(this.getC(0).getName(),this.getC(0).getX()+20,this.getC(0).getY());
                break;
            case 2:
                ctx.fillStyle=zc.prefs.color.hilite;
				ctx.font = "16px Verdana";
				ctx.fillText($L.tool_AngleBissector_help_1+this.getC(0).getName()+","+$L.tool_AngleBissector_help_2i+this.getC(1).getName(),zc.mouseX(ev)+40, zc.mouseY(ev));
				ctx.fillText(texto3, zc.mouseX(ev)+40, zc.mouseY(ev)+20);
                ctx.fillText(this.getC(0).getName(),this.getC(0).getX()+20,this.getC(0).getY());
				ctx.fillText(this.getC(1).getName(),this.getC(1).getX()+20,this.getC(1).getY());
                break;
        }
    };
}
